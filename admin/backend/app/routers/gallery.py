from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import GalleryItem, AdminUser
from app.schemas import GalleryItemIn, GalleryItemOut
from app.auth import get_current_admin

router = APIRouter(prefix="/api/gallery", tags=["gallery"])


# ---------------------------------------------------------------------------
# Public: full list, no auth — the Gallery page needs both photos and videos
# together, so unlike careers/projects there's no separate "open only" vs
# "admin, including hidden" split; everything here is always public.
# ---------------------------------------------------------------------------
@router.get("", response_model=list[GalleryItemOut])
def list_gallery(db: Session = Depends(get_db)):
    return db.query(GalleryItem).order_by(GalleryItem.sort_order.asc(), GalleryItem.id.desc()).all()


# ---------------------------------------------------------------------------
# Admin: full CRUD
# ---------------------------------------------------------------------------
@router.post("/admin", response_model=GalleryItemOut)
def create_gallery_item(
    payload: GalleryItemIn,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    item = GalleryItem(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/admin/{item_id}", response_model=GalleryItemOut)
def update_gallery_item(
    item_id: int,
    payload: GalleryItemIn,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    item = db.query(GalleryItem).filter(GalleryItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    for field, value in payload.model_dump().items():
        setattr(item, field, value)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/admin/{item_id}")
def delete_gallery_item(
    item_id: int,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    item = db.query(GalleryItem).filter(GalleryItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    db.delete(item)
    db.commit()
    return {"deleted": True}
