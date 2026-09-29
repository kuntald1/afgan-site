from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import Base, engine, SessionLocal
from app.models import AdminUser
from app.auth import hash_password
from app.routers import auth, content, media, careers, projects, gallery, blog, contact

Base.metadata.create_all(bind=engine)

app = FastAPI(title="ACE Admin API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(auth.router)
app.include_router(content.router)
app.include_router(media.router)
app.include_router(careers.router)
app.include_router(projects.router)
app.include_router(gallery.router)
app.include_router(blog.router)
app.include_router(contact.router)


@app.on_event("startup")
def seed_admin_user():
    """Creates the initial admin user from ADMIN_USERNAME/ADMIN_PASSWORD
    env vars if no admin user exists yet. Change the password after first
    login — there's no self-service reset in this MVP."""
    db = SessionLocal()
    try:
        existing = db.query(AdminUser).filter(
            AdminUser.username == settings.admin_username
        ).first()
        if not existing:
            db.add(
                AdminUser(
                    username=settings.admin_username,
                    password_hash=hash_password(settings.admin_password),
                )
            )
            db.commit()
            print(f"[seed] Created admin user '{settings.admin_username}'")
    finally:
        db.close()


@app.get("/api/health")
def health():
    return {"status": "ok"}
