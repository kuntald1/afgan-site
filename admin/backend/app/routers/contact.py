from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import ContactMessage, AdminUser
from app.schemas import ContactMessageIn, ContactMessageOut
from app.auth import get_current_admin

router = APIRouter(prefix="/api/contact", tags=["contact"])


# ---------------------------------------------------------------------------
# Public: submit the contact form. No auth — visitors aren't admin users.
# ---------------------------------------------------------------------------
@router.post("", response_model=ContactMessageOut)
def submit_message(payload: ContactMessageIn, db: Session = Depends(get_db)):
    message = ContactMessage(**payload.model_dump())
    db.add(message)
    db.commit()
    db.refresh(message)
    return message


# ---------------------------------------------------------------------------
# Admin: view + delete submissions. No update — a message is a record of
# what someone sent in, not something the admin edits.
# ---------------------------------------------------------------------------
@router.get("/admin", response_model=list[ContactMessageOut])
def list_messages(
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    return db.query(ContactMessage).order_by(ContactMessage.submitted_at.desc()).all()


@router.delete("/admin/{message_id}")
def delete_message(
    message_id: int,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    message = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    db.delete(message)
    db.commit()
    return {"deleted": True}
