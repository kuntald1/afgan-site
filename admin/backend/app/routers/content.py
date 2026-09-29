from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import ContentBlock, AdminUser
from app.schemas import ContentBlockOut, ContentBlockUpdate
from app.auth import get_current_admin

router = APIRouter(prefix="/api/content", tags=["content"])


@router.get("", response_model=dict[str, str])
def get_content_map(db: Session = Depends(get_db)):
    """
    PUBLIC, no auth required. Returns every content block as a flat
    { key: value } map — this is what the main ace-final site fetches to
    render dynamic text/images. See admin/README.md for the fetch pattern.
    """
    blocks = db.query(ContentBlock).all()
    return {b.key: (b.value or "") for b in blocks}


@router.get("/admin", response_model=list[ContentBlockOut])
def list_content_for_admin(
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    """PROTECTED. Full rows (with page/section/label/type) for the admin UI."""
    return db.query(ContentBlock).order_by(ContentBlock.page, ContentBlock.section, ContentBlock.id).all()


@router.patch("/{key}", response_model=ContentBlockOut)
def update_content_block(
    key: str,
    payload: ContentBlockUpdate,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    """PROTECTED. Update a single content block's value by its key."""
    block = db.query(ContentBlock).filter(ContentBlock.key == key).first()
    if not block:
        raise HTTPException(status_code=404, detail=f"No content block with key '{key}'")
    block.value = payload.value
    db.commit()
    db.refresh(block)
    return block
