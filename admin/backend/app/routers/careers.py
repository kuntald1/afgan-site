import os
import uuid
import json
from datetime import date

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, func

from app.database import get_db
from app.models import JobPosting, JobApplication, AdminUser
from app.schemas import (
    JobPostingCreate,
    JobPostingUpdate,
    JobPostingOut,
    JobApplicationOut,
)
from app.auth import get_current_admin
from app.config import settings
from app.services import ai_matching

router = APIRouter(prefix="/api/careers", tags=["careers"])

RESUME_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "uploads", "resumes")
os.makedirs(RESUME_DIR, exist_ok=True)

# Matches the real Ginesys-style application form's stated allowed types.
ALLOWED_RESUME_EXTENSIONS = {".doc", ".docx", ".pdf", ".rtf", ".odt"}
MAX_RESUME_SIZE = 10 * 1024 * 1024  # 10MB, matching the reference form


def _extract_resume_text(file_path: str, ext: str) -> str | None:
    """
    Best-effort, local, free text extraction — no API calls. Used only to
    power keyword search over applications in the admin panel (see
    list_applications' `search` param below).

    Only .pdf and .docx are supported. .doc (old binary Word format),
    .rtf, and .odt are accepted as valid résumé uploads (per
    ALLOWED_RESUME_EXTENSIONS) but are NOT text-searchable — extracting
    those reliably needs heavier dependencies (e.g. textract, which pulls
    in antiword/LibreOffice as system dependencies) that weren't worth
    adding for this MVP. An application with one of those formats simply
    won't be found by a keyword search; it's still fully visible in the
    unfiltered applications list.
    """
    try:
        if ext == ".pdf":
            import pdfplumber
            text_parts = []
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text_parts.append(page_text)
            return "\n".join(text_parts) or None

        if ext == ".docx":
            import docx
            doc = docx.Document(file_path)
            return "\n".join(p.text for p in doc.paragraphs) or None

    except Exception as e:
        # Extraction failing should never block a real application from
        # being submitted — it only means this one resume won't be
        # keyword-searchable.
        print(f"[resume text extraction] failed for {file_path}: {e}")

    return None


def _optional_int(value: str | None, field_label: str) -> int | None:
    """
    Parses an optional Form(...) string field into an int, treating both
    None and "" (empty string) as "not provided."

    Why this is needed: FastAPI's automatic type coercion for
    `int | None = Form(None)` still tries to parse whatever the browser
    sends, and a blank HTML number input sends an empty string, not an
    omitted field — "" is not a valid int, so FastAPI would 422 on a field
    the applicant deliberately left blank, which isn't the intended
    behavior for an "optional" field. Accepting the raw value as `str`
    and converting it manually here sidesteps that.
    """
    if value is None or value.strip() == "":
        return None
    try:
        return int(value)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"'{field_label}' must be a whole number")


def _optional_date(value: str | None, field_label: str) -> date | None:
    """Same reasoning as _optional_int, for the date-of-birth field."""
    if value is None or value.strip() == "":
        return None
    try:
        return date.fromisoformat(value)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"'{field_label}' must be a valid date (YYYY-MM-DD)")


# ---------------------------------------------------------------------------
# Public: list open postings (deadline-filtered)
# ---------------------------------------------------------------------------
@router.get("", response_model=list[JobPostingOut])
def list_open_postings(db: Session = Depends(get_db)):
    """
    PUBLIC. Returns every posting whose deadline is today or later, or has
    no deadline at all. A posting whose deadline has passed simply stops
    appearing here — no scheduled task needed, it's just a filter applied
    on every read.
    """
    today = date.today()
    postings = (
        db.query(JobPosting)
        .filter((JobPosting.deadline.is_(None)) | (JobPosting.deadline >= today))
        .order_by(JobPosting.posted_date.desc())
        .all()
    )
    return postings


# ---------------------------------------------------------------------------
# Admin: full CRUD, including expired postings
# ---------------------------------------------------------------------------
@router.get("/admin", response_model=list[JobPostingOut])
def list_all_postings(
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    """PROTECTED. All postings, including expired ones, for the admin UI.
    Each posting includes its application_count, computed here via a
    single grouped query rather than one COUNT per posting."""
    postings = db.query(JobPosting).order_by(JobPosting.posted_date.desc()).all()

    counts = dict(
        db.query(JobApplication.job_id, func.count(JobApplication.id))
        .group_by(JobApplication.job_id)
        .all()
    )

    results = []
    for posting in postings:
        out = JobPostingOut.model_validate(posting)
        out.application_count = counts.get(posting.id, 0)
        results.append(out)
    return results


@router.post("/admin", response_model=JobPostingOut)
def create_posting(
    payload: JobPostingCreate,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    posting = JobPosting(**payload.model_dump())
    db.add(posting)
    db.commit()
    db.refresh(posting)
    return posting


@router.put("/admin/{posting_id}", response_model=JobPostingOut)
def update_posting(
    posting_id: int,
    payload: JobPostingUpdate,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    posting = db.query(JobPosting).filter(JobPosting.id == posting_id).first()
    if not posting:
        raise HTTPException(status_code=404, detail="Posting not found")
    for field, value in payload.model_dump().items():
        setattr(posting, field, value)
    db.commit()
    db.refresh(posting)
    return posting


@router.delete("/admin/{posting_id}")
def delete_posting(
    posting_id: int,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    posting = db.query(JobPosting).filter(JobPosting.id == posting_id).first()
    if not posting:
        raise HTTPException(status_code=404, detail="Posting not found")
    db.delete(posting)  # cascades to its applications, see models.py
    db.commit()
    return {"deleted": True}


# ---------------------------------------------------------------------------
# Public: submit an application (resume mandatory)
# ---------------------------------------------------------------------------
@router.post("/{posting_id}/apply", response_model=JobApplicationOut)
async def submit_application(
    posting_id: int,
    first_name: str = Form(...),
    last_name: str = Form(...),
    email: str = Form(...),
    mobile_phone: str = Form(...),
    middle_name: str | None = Form(None),
    gender: str | None = Form(None),
    # Accepted as raw strings, not int/date, specifically so a blank field
    # doesn't trip FastAPI's automatic type coercion — see _optional_int /
    # _optional_date above for why.
    experience_years: str | None = Form(None),
    experience_months: str | None = Form(None),
    current_salary: str | None = Form(None),
    expected_salary: str | None = Form(None),
    available_to_join_days: str | None = Form(None),
    preferred_location: str | None = Form(None),
    current_location: str | None = Form(None),
    current_organization: str | None = Form(None),
    know_someone_at_ace: str | None = Form(None),
    date_of_birth: str | None = Form(None),
    legally_eligible: str | None = Form(None),
    skills: str | None = Form(None),
    resume: UploadFile = File(...),  # mandatory — FastAPI 400s if omitted
    db: Session = Depends(get_db),
):
    """
    PUBLIC, no auth — applicants aren't admin users. Resume is a required
    field both at the type level (UploadFile = File(...), no default) and
    validated again below for extension/size.
    """
    posting = db.query(JobPosting).filter(JobPosting.id == posting_id).first()
    if not posting:
        raise HTTPException(status_code=404, detail="This posting no longer exists")
    if posting.deadline and posting.deadline < date.today():
        raise HTTPException(status_code=400, detail="The application deadline for this role has passed")

    parsed_experience_years = _optional_int(experience_years, "Experience (years)")
    parsed_experience_months = _optional_int(experience_months, "Experience (months)")
    parsed_available_days = _optional_int(available_to_join_days, "Available to join (days)")
    parsed_dob = _optional_date(date_of_birth, "Date of birth")

    ext = os.path.splitext(resume.filename or "")[1].lower()
    if ext not in ALLOWED_RESUME_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported resume file type '{ext}'. Allowed: {', '.join(sorted(ALLOWED_RESUME_EXTENSIONS))}",
        )
    contents = await resume.read()
    if len(contents) > MAX_RESUME_SIZE:
        raise HTTPException(status_code=400, detail="Resume exceeds 10MB limit")
    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="Resume file is empty")

    safe_name = f"{uuid.uuid4().hex}{ext}"
    dest_path = os.path.join(RESUME_DIR, safe_name)
    with open(dest_path, "wb") as f:
        f.write(contents)

    resume_text = _extract_resume_text(dest_path, ext)

    # --- Best-effort AI extraction + embedding ---
    # Deliberately wrapped so that ANY failure here (missing API keys,
    # network error, malformed AI response) never blocks the application
    # from being saved. An applicant's submission succeeding must not
    # depend on a third-party AI service being up.
    ai_status = None
    extracted_skills_json = None
    extracted_years = None
    extracted_education = None
    extracted_summary = None
    embedding_vector = None

    if resume_text and settings.anthropic_api_key:
        try:
            structured = ai_matching.extract_cv_structure(resume_text)
            if structured:
                extracted_skills_json = json.dumps(structured["skills"])
                extracted_years = structured["years_experience"]
                extracted_education = structured["education"]
                extracted_summary = structured["summary"]
                ai_status = "done"

                if extracted_summary and settings.voyage_api_key:
                    embedding_vector = ai_matching.embed_text(extracted_summary)
            else:
                ai_status = "failed"
        except Exception as e:
            print(f"[careers] AI extraction pipeline error for application: {e}")
            ai_status = "failed"

    application = JobApplication(
        job_id=posting_id,
        first_name=first_name,
        middle_name=middle_name,
        last_name=last_name,
        email=email,
        mobile_phone=mobile_phone,
        gender=gender,
        experience_years=parsed_experience_years,
        experience_months=parsed_experience_months,
        current_salary=current_salary,
        expected_salary=expected_salary,
        available_to_join_days=parsed_available_days,
        preferred_location=preferred_location,
        current_location=current_location,
        current_organization=current_organization,
        know_someone_at_ace=know_someone_at_ace,
        date_of_birth=parsed_dob,
        legally_eligible=legally_eligible,
        skills=skills,
        resume_filename=resume.filename or safe_name,
        resume_url=f"/uploads/resumes/{safe_name}",
        resume_text=resume_text,
        ai_extraction_status=ai_status,
        extracted_skills=extracted_skills_json,
        extracted_years_experience=extracted_years,
        extracted_education=extracted_education,
        extracted_summary=extracted_summary,
        embedding=embedding_vector,
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    return application


# ---------------------------------------------------------------------------
# Admin: AI-powered semantic search (see app/services/ai_matching.py)
# ---------------------------------------------------------------------------
@router.get("/{posting_id}/applications/smart-search", response_model=list[JobApplicationOut])
def smart_search_applications(
    posting_id: int,
    q: str = Query(..., min_length=1, description="Natural-language query, e.g. 'python with 3 years'"),
    min_score: int = Query(
        40,
        ge=0,
        le=100,
        description=(
            "Minimum relevance score (0-100) to include a candidate at all. "
            "Genuinely irrelevant candidates are now excluded, not just "
            "ranked last — this is the cutoff. 40 is a starting default, "
            "not empirically tuned against real data (this sandbox has no "
            "real Voyage AI access to calibrate against) — raise it if "
            "weak matches still slip through, lower it if good matches are "
            "getting excluded. Pass ?min_score=0 to see everyone ranked, "
            "no exclusion, for comparison."
        ),
    ),
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    """
    PROTECTED. Semantic candidate search: expands `q` into a structured
    filter + an "ideal candidate" description via Claude, embeds that
    description via Voyage, and ranks applications for this posting by
    cosine similarity between that embedding and each application's own
    extracted-summary embedding (computed at submission time).

    Each result includes `match_score` (0-100) so relevance is visible,
    not just implied by list order — and candidates below `min_score` are
    excluded entirely rather than merely sorted to the bottom, so an
    unrelated candidate (e.g. a Sales Manager showing up under a search
    for a technical skill) doesn't appear at all.

    Only considers applications that have BOTH ai_extraction succeeded AND
    an embedding — i.e. ones submitted after AI matching was configured,
    or with a résumé in a supported format (.pdf/.docx). Requires both
    ANTHROPIC_API_KEY and VOYAGE_API_KEY configured — returns a clear 400,
    not a crash, if they're not set.
    """
    if not settings.anthropic_api_key or not settings.voyage_api_key:
        raise HTTPException(
            status_code=400,
            detail=(
                "AI matching isn't configured — ANTHROPIC_API_KEY and VOYAGE_API_KEY "
                "must both be set. The plain keyword search (GET .../applications?search=...) "
                "works without this."
            ),
        )

    expansion = ai_matching.expand_search_query(q)
    if not expansion:
        raise HTTPException(
            status_code=502,
            detail="Could not expand the search query via Claude — check backend logs.",
        )

    query_embedding = ai_matching.embed_query(expansion["ideal_candidate_description"])
    if not query_embedding:
        raise HTTPException(
            status_code=502,
            detail="Could not generate a query embedding via Voyage AI — check backend logs.",
        )

    distance_expr = JobApplication.embedding.cosine_distance(query_embedding)

    base_query = (
        db.query(JobApplication, distance_expr.label("distance"))
        .filter(JobApplication.job_id == posting_id)
        .filter(JobApplication.embedding.isnot(None))
    )

    if expansion["min_years_experience"] is not None:
        # Don't hard-exclude candidates whose years couldn't be determined
        # (extraction failure, or a résumé format that wasn't parseable) —
        # only filter out ones we KNOW have fewer years than asked for.
        base_query = base_query.filter(
            or_(
                JobApplication.extracted_years_experience >= expansion["min_years_experience"],
                JobApplication.extracted_years_experience.is_(None),
            )
        )

    rows = base_query.order_by(distance_expr).limit(50).all()

    results = []
    for application, distance in rows:
        # pgvector's cosine_distance = 1 - cosine_similarity, so this
        # recovers similarity, then scales it to a 0-100 score. Clamped
        # since floating-point noise or an unusual embedding pair could
        # technically push it just outside [0, 1].
        similarity = 1 - distance
        score = max(0, min(100, round(similarity * 100)))
        if score < min_score:
            continue
        out = JobApplicationOut.model_validate(application)
        out.match_score = score
        results.append(out)

    return results[:20]


# ---------------------------------------------------------------------------
# Admin: review submitted applications
# ---------------------------------------------------------------------------
@router.get("/{posting_id}/applications", response_model=list[JobApplicationOut])
def list_applications(
    posting_id: int,
    search: str | None = Query(
        None,
        description=(
            "Case-insensitive keyword search. Matches against the applicant's "
            "listed skills AND the extracted text of their résumé (where "
            "extraction succeeded — see _extract_resume_text). Free-text, "
            "not semantic — 'FastAPI' finds résumés literally containing "
            "that word, not ones implying similar experience."
        ),
    ),
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    """PROTECTED. Applications for one posting, most recent first, optionally
    filtered by keyword."""
    query = db.query(JobApplication).filter(JobApplication.job_id == posting_id)
    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                JobApplication.resume_text.ilike(term),
                JobApplication.skills.ilike(term),
            )
        )
    return query.order_by(JobApplication.submitted_at.desc()).all()


@router.delete("/{posting_id}/applications/{application_id}")
def delete_application(
    posting_id: int,
    application_id: int,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    """
    PROTECTED. Deletes both the database record AND the résumé file on
    disk — unlike a raw `DELETE FROM job_applications` run directly in
    psql, which only removes the row and leaves the uploaded file orphaned
    on disk (harmless, just wasted space, but not a full delete).

    `posting_id` is included in the path and checked here specifically so
    a request can't accidentally delete an application belonging to a
    different job posting than the one currently open in the admin UI.
    """
    application = (
        db.query(JobApplication)
        .filter(JobApplication.id == application_id, JobApplication.job_id == posting_id)
        .first()
    )
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    # resume_url looks like "/uploads/resumes/<uuid>.<ext>" — resolve it
    # back to the real file path and remove it. Wrapped so a file that's
    # already missing (manually cleaned up, moved, etc.) doesn't block the
    # database record from being deleted.
    filename = os.path.basename(application.resume_url)
    file_path = os.path.join(RESUME_DIR, filename)
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
    except OSError as e:
        print(f"[careers] Failed to delete résumé file {file_path}: {e}")

    db.delete(application)
    db.commit()
    return {"deleted": True, "application_id": application_id}

