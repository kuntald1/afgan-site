import json
from datetime import datetime, date
from pydantic import BaseModel, field_validator


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class ContentBlockOut(BaseModel):
    id: int
    key: str
    page: str
    section: str
    label: str
    type: str
    value: str | None
    updated_at: datetime

    class Config:
        from_attributes = True


class ContentBlockUpdate(BaseModel):
    value: str


class MediaAssetOut(BaseModel):
    id: int
    filename: str
    url: str
    uploaded_at: datetime

    class Config:
        from_attributes = True


class JobPostingCreate(BaseModel):
    title: str
    company: str = "ACE"
    location: str
    employment_type: str | None = None
    posted_date: date
    deadline: date | None = None
    summary: str
    responsibilities: str | None = None
    qualifications: str | None = None


class JobPostingUpdate(JobPostingCreate):
    pass


class JobPostingOut(BaseModel):
    id: int
    title: str
    company: str
    location: str
    employment_type: str | None
    posted_date: date
    deadline: date | None
    summary: str
    responsibilities: str | None
    qualifications: str | None
    updated_at: datetime

    # Not a real column on JobPosting — computed and attached manually in
    # the admin listing endpoint (see routers/careers.py), since it's a
    # count of related job_applications rows, not stored data.
    application_count: int = 0

    class Config:
        from_attributes = True


class JobApplicationOut(BaseModel):
    id: int
    job_id: int
    first_name: str
    middle_name: str | None
    last_name: str
    email: str
    mobile_phone: str
    gender: str | None
    experience_years: int | None
    experience_months: int | None
    current_salary: str | None
    expected_salary: str | None
    available_to_join_days: int | None
    preferred_location: str | None
    current_location: str | None
    current_organization: str | None
    know_someone_at_ace: str | None
    date_of_birth: date | None
    legally_eligible: str | None
    skills: str | None
    resume_filename: str
    resume_url: str
    submitted_at: datetime

    # AI-extracted fields — all optional, present only if AI matching was
    # configured and the extraction succeeded for this application.
    ai_extraction_status: str | None = None
    extracted_skills: list[str] | None = None
    extracted_years_experience: int | None = None
    extracted_education: str | None = None
    extracted_summary: str | None = None

    # Only populated by the smart-search endpoint — a 0-100 relevance
    # score for THIS search, not a stored property of the application.
    # None on every other endpoint (plain list, keyword search).
    match_score: int | None = None

    class Config:
        from_attributes = True

    @field_validator("extracted_skills", mode="before")
    @classmethod
    def _parse_extracted_skills(cls, value):
        """
        extracted_skills is stored in the database as a JSON string (see
        models.py), but the API should return a real list. This only
        transforms the value going INTO this Pydantic model — it never
        touches the underlying SQLAlchemy object, which matters: mutating
        the ORM object's attribute in place here would risk SQLAlchemy
        later trying to write a Python list back into what's actually a
        Text column.
        """
        if value is None or isinstance(value, list):
            return value
        if isinstance(value, str):
            try:
                return json.loads(value)
            except (ValueError, TypeError):
                return None
        return value


class ProjectIn(BaseModel):
    """Used for both create and update — same shape either way."""

    title: str
    org: str
    type: str
    year: str
    location: str
    services: list[str] = []
    practice_areas: list[str] = []
    summary: str
    body: list[str] = []
    key_highlights: list[str] = []
    image_url: str | None = None
    slug: str | None = None  # optional on create — auto-generated from title if omitted
    sort_order: int = 0


class ProjectOut(BaseModel):
    id: int
    slug: str
    title: str
    org: str
    type: str
    year: str
    location: str
    services: list[str] = []
    practice_areas: list[str] = []
    summary: str
    body: list[str] = []
    key_highlights: list[str] = []
    image_url: str | None
    sort_order: int
    updated_at: datetime

    class Config:
        from_attributes = True

    @field_validator("services", "practice_areas", "body", "key_highlights", mode="before")
    @classmethod
    def _parse_json_list(cls, value):
        """
        These are stored in the database as JSON strings (see models.py)
        but the API should return real lists. Only transforms the value
        going INTO this Pydantic model — never mutates the underlying
        SQLAlchemy object (same reasoning as JobApplicationOut's
        extracted_skills validator).
        """
        if value is None:
            return []
        if isinstance(value, list):
            return value
        if isinstance(value, str):
            try:
                parsed = json.loads(value)
                return parsed if isinstance(parsed, list) else []
            except (ValueError, TypeError):
                return []
        return []


class GalleryItemIn(BaseModel):
    kind: str = "photo"  # "photo" | "video"
    image_url: str | None = None
    youtube_id: str | None = None
    caption: str | None = None
    sort_order: int = 0


class GalleryItemOut(BaseModel):
    id: int
    kind: str
    image_url: str | None
    youtube_id: str | None
    caption: str | None
    sort_order: int

    class Config:
        from_attributes = True


class BlogPostIn(BaseModel):
    title: str
    excerpt: str
    date_label: str
    category: str
    key_features: list[str] = []
    conclusion: str | None = None
    image_url: str | None = None
    slug: str | None = None  # optional — auto-generated from title if omitted
    sort_order: int = 0


class BlogPostOut(BaseModel):
    id: int
    slug: str
    title: str
    excerpt: str
    date_label: str
    category: str
    key_features: list[str] = []
    conclusion: str | None
    image_url: str | None
    sort_order: int
    updated_at: datetime

    class Config:
        from_attributes = True

    @field_validator("key_features", mode="before")
    @classmethod
    def _parse_key_features(cls, value):
        """Same JSON-string-to-list transform as ProjectOut's list fields."""
        if value is None:
            return []
        if isinstance(value, list):
            return value
        if isinstance(value, str):
            try:
                parsed = json.loads(value)
                return parsed if isinstance(parsed, list) else []
            except (ValueError, TypeError):
                return []
        return []


class ContactMessageIn(BaseModel):
    """PUBLIC — what the Contact page form submits. No auth."""

    name: str
    email: str
    phone: str | None = None
    subject: str | None = None
    message: str


class ContactMessageOut(BaseModel):
    id: int
    name: str
    email: str
    phone: str | None
    subject: str | None
    message: str
    submitted_at: datetime

    class Config:
        from_attributes = True
