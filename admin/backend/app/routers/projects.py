import json
import re

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Project, AdminUser
from app.schemas import ProjectIn, ProjectOut
from app.auth import get_current_admin

router = APIRouter(prefix="/api/projects", tags=["projects"])


def _slugify(title: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
    return slug or "project"


def _unique_slug(db: Session, base_slug: str, exclude_id: int | None = None) -> str:
    """Appends -2, -3, ... if base_slug is already taken by a different row."""
    slug = base_slug
    n = 2
    while True:
        query = db.query(Project).filter(Project.slug == slug)
        if exclude_id is not None:
            query = query.filter(Project.id != exclude_id)
        if not query.first():
            return slug
        slug = f"{base_slug}-{n}"
        n += 1


def _to_model_fields(payload: ProjectIn) -> dict:
    return {
        "title": payload.title,
        "org": payload.org,
        "type": payload.type,
        "year": payload.year,
        "location": payload.location,
        "services": json.dumps(payload.services),
        "practice_areas": json.dumps(payload.practice_areas),
        "summary": payload.summary,
        "body": json.dumps(payload.body),
        "key_highlights": json.dumps(payload.key_highlights),
        "image_url": payload.image_url,
        "sort_order": payload.sort_order,
    }


# ---------------------------------------------------------------------------
# Public: list + single, no auth — same as the homepage/Projects page need
# ---------------------------------------------------------------------------
@router.get("", response_model=list[ProjectOut])
def list_projects(db: Session = Depends(get_db)):
    """PUBLIC. All projects, in admin-defined order (sort_order, then newest first)."""
    return (
        db.query(Project)
        .order_by(Project.sort_order.asc(), Project.id.desc())
        .all()
    )


@router.get("/{slug}", response_model=ProjectOut)
def get_project(slug: str, db: Session = Depends(get_db)):
    """PUBLIC. Single project by slug, for the detail page."""
    project = db.query(Project).filter(Project.slug == slug).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


# ---------------------------------------------------------------------------
# Admin: full CRUD
# ---------------------------------------------------------------------------
@router.get("/admin/all", response_model=list[ProjectOut])
def list_projects_admin(
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    """PROTECTED. Same ordering as the public list, for the admin table."""
    return (
        db.query(Project)
        .order_by(Project.sort_order.asc(), Project.id.desc())
        .all()
    )


@router.post("/admin", response_model=ProjectOut)
def create_project(
    payload: ProjectIn,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    base_slug = _slugify(payload.slug or payload.title)
    slug = _unique_slug(db, base_slug)
    project = Project(slug=slug, **_to_model_fields(payload))
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.put("/admin/{project_id}", response_model=ProjectOut)
def update_project(
    project_id: int,
    payload: ProjectIn,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Only re-slug if the admin explicitly typed a different slug/title —
    # otherwise editing a project's body text would silently change its
    # public URL and break any existing links to it.
    desired_slug = _slugify(payload.slug) if payload.slug else project.slug
    if desired_slug != project.slug:
        project.slug = _unique_slug(db, desired_slug, exclude_id=project.id)

    for field, value in _to_model_fields(payload).items():
        setattr(project, field, value)
    db.commit()
    db.refresh(project)
    return project


@router.delete("/admin/{project_id}")
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()
    return {"deleted": True}
