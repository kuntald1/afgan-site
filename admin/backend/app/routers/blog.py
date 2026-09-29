import json
import re

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import BlogPost, AdminUser
from app.schemas import BlogPostIn, BlogPostOut
from app.auth import get_current_admin

router = APIRouter(prefix="/api/blog", tags=["blog"])


def _slugify(title: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
    return slug or "post"


def _unique_slug(db: Session, base_slug: str, exclude_id: int | None = None) -> str:
    slug = base_slug
    n = 2
    while True:
        query = db.query(BlogPost).filter(BlogPost.slug == slug)
        if exclude_id is not None:
            query = query.filter(BlogPost.id != exclude_id)
        if not query.first():
            return slug
        slug = f"{base_slug}-{n}"
        n += 1


def _to_model_fields(payload: BlogPostIn) -> dict:
    return {
        "title": payload.title,
        "excerpt": payload.excerpt,
        "date_label": payload.date_label,
        "category": payload.category,
        "key_features": json.dumps(payload.key_features),
        "conclusion": payload.conclusion,
        "image_url": payload.image_url,
        "sort_order": payload.sort_order,
    }


# ---------------------------------------------------------------------------
# Public: list + single, no auth
# ---------------------------------------------------------------------------
@router.get("", response_model=list[BlogPostOut])
def list_posts(db: Session = Depends(get_db)):
    return db.query(BlogPost).order_by(BlogPost.sort_order.asc(), BlogPost.id.desc()).all()


@router.get("/{slug}", response_model=BlogPostOut)
def get_post(slug: str, db: Session = Depends(get_db)):
    post = db.query(BlogPost).filter(BlogPost.slug == slug).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


# ---------------------------------------------------------------------------
# Admin: full CRUD
# ---------------------------------------------------------------------------
@router.get("/admin/all", response_model=list[BlogPostOut])
def list_posts_admin(
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    return db.query(BlogPost).order_by(BlogPost.sort_order.asc(), BlogPost.id.desc()).all()


@router.post("/admin", response_model=BlogPostOut)
def create_post(
    payload: BlogPostIn,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    base_slug = _slugify(payload.slug or payload.title)
    slug = _unique_slug(db, base_slug)
    post = BlogPost(slug=slug, **_to_model_fields(payload))
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


@router.put("/admin/{post_id}", response_model=BlogPostOut)
def update_post(
    post_id: int,
    payload: BlogPostIn,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    desired_slug = _slugify(payload.slug) if payload.slug else post.slug
    if desired_slug != post.slug:
        post.slug = _unique_slug(db, desired_slug, exclude_id=post.id)

    for field, value in _to_model_fields(payload).items():
        setattr(post, field, value)
    db.commit()
    db.refresh(post)
    return post


@router.delete("/admin/{post_id}")
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    db.delete(post)
    db.commit()
    return {"deleted": True}
