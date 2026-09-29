import os
import uuid

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import MediaAsset, AdminUser
from app.schemas import MediaAssetOut
from app.auth import get_current_admin

router = APIRouter(prefix="/api/media", tags=["media"])

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".mp4"}
MAX_FILE_SIZE = 25 * 1024 * 1024  # 25MB


@router.post("/upload", response_model=MediaAssetOut)
async def upload_media(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    """PROTECTED. Uploads a file, saves it under /uploads with a random
    filename (avoids collisions/overwrites), and records it in the
    media_assets table. Returns the URL the file is served at.

    In production, /uploads needs to be served as static files by this
    FastAPI app (already wired in main.py) or by Nginx directly — see
    admin/README.md for the deployment note on this.
    """
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{ext}'. Allowed: {', '.join(sorted(ALLOWED_EXTENSIONS))}",
        )

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File exceeds 25MB limit")

    safe_name = f"{uuid.uuid4().hex}{ext}"
    dest_path = os.path.join(UPLOAD_DIR, safe_name)
    with open(dest_path, "wb") as f:
        f.write(contents)

    asset = MediaAsset(
        filename=file.filename or safe_name,
        url=f"/uploads/{safe_name}",
    )
    db.add(asset)
    db.commit()
    db.refresh(asset)
    return asset


@router.get("", response_model=list[MediaAssetOut])
def list_media(
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    """PROTECTED. Lists all uploaded media, most recent first."""
    return db.query(MediaAsset).order_by(MediaAsset.uploaded_at.desc()).all()
