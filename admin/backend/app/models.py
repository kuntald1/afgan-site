from sqlalchemy import Column, Integer, String, Text, DateTime, Date, ForeignKey, func
from pgvector.sqlalchemy import Vector
from app.database import Base

# Must match VOYAGE_EMBEDDING_DIMENSIONS in config.py exactly — pgvector
# columns are fixed-dimension, and voyage-4-lite defaults to 1024.
EMBEDDING_DIM = 1024


class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(Integer, primary_key=True)
    username = Column(String(64), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ContentBlock(Base):
    """
    Generic key-value content store. One row = one editable piece of
    content on the main site — a headline, a paragraph, a stat number, an
    image path, etc.

    `key` is what the main site's frontend looks up by (e.g.
    "hero.headline", "stats.returnees_value") — see admin/backend/seed.py
    for the full initial key list mapped from the current
    src/content.ts / src/assets.ts values, and README.md in this folder
    for how a page/component reads a key.
    """

    __tablename__ = "content_blocks"

    id = Column(Integer, primary_key=True)
    key = Column(String(160), unique=True, nullable=False, index=True)
    page = Column(String(64), nullable=False, index=True)  # e.g. "home", "about"
    section = Column(String(64), nullable=False)  # e.g. "hero", "impact"
    label = Column(String(200), nullable=False)  # human-readable, shown in admin UI
    type = Column(String(16), nullable=False, default="text")  # text | richtext | image | number
    value = Column(Text, nullable=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class MediaAsset(Base):
    __tablename__ = "media_assets"

    id = Column(Integer, primary_key=True)
    filename = Column(String(255), nullable=False)
    url = Column(String(500), nullable=False)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())


class JobPosting(Base):
    """
    A real job listing — unlike ContentBlock (fixed set of predefined
    text/image fields), the admin can create and delete these freely, same
    as adding/removing a row in a spreadsheet. The public careers list
    (GET /api/careers) automatically excludes anything past its
    `deadline`, so "remove the job after the deadline" needs no manual
    action or scheduled task — it's just a filter on read.
    """

    __tablename__ = "job_postings"

    id = Column(Integer, primary_key=True)
    title = Column(String(200), nullable=False)
    company = Column(String(120), nullable=False, default="ACE")
    location = Column(String(120), nullable=False)
    employment_type = Column(String(60), nullable=True)  # e.g. "Full time", "Contract"
    posted_date = Column(Date, nullable=False)
    deadline = Column(Date, nullable=True)  # null = never expires
    summary = Column(Text, nullable=False)  # short blurb shown on the card
    responsibilities = Column(Text, nullable=True)  # shown in the expanded detail view
    qualifications = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class JobApplication(Base):
    """A submitted application against a JobPosting. Public endpoint (no
    login) accepts these — applicants aren't admin users."""

    __tablename__ = "job_applications"

    id = Column(Integer, primary_key=True)
    job_id = Column(Integer, ForeignKey("job_postings.id", ondelete="CASCADE"), nullable=False, index=True)

    first_name = Column(String(100), nullable=False)
    middle_name = Column(String(100), nullable=True)
    last_name = Column(String(100), nullable=False)
    email = Column(String(200), nullable=False)
    mobile_phone = Column(String(40), nullable=False)
    gender = Column(String(30), nullable=True)

    experience_years = Column(Integer, nullable=True)
    experience_months = Column(Integer, nullable=True)
    current_salary = Column(String(60), nullable=True)
    expected_salary = Column(String(60), nullable=True)
    available_to_join_days = Column(Integer, nullable=True)

    preferred_location = Column(String(120), nullable=True)
    current_location = Column(String(120), nullable=True)
    current_organization = Column(String(150), nullable=True)
    know_someone_at_ace = Column(String(150), nullable=True)
    date_of_birth = Column(Date, nullable=True)
    legally_eligible = Column(String(10), nullable=True)  # "yes" | "no"
    skills = Column(Text, nullable=True)  # comma-separated

    resume_filename = Column(String(255), nullable=False)
    resume_url = Column(String(500), nullable=False)  # mandatory — enforced in the router
    resume_text = Column(Text, nullable=True)  # extracted for keyword search — see careers.py

    # --- AI-powered extraction (Claude) + semantic search (Voyage + pgvector) ---
    # All nullable, all best-effort: if AI matching isn't configured (no
    # API keys) or an extraction call fails, these just stay null and the
    # application is still saved normally — the free keyword search
    # (resume_text above) works regardless of any of this.
    ai_extraction_status = Column(String(20), nullable=True, default=None)  # "done" | "failed" | null (never attempted)
    extracted_skills = Column(Text, nullable=True)  # JSON-encoded list[str]
    extracted_years_experience = Column(Integer, nullable=True)
    extracted_education = Column(Text, nullable=True)
    extracted_summary = Column(Text, nullable=True)  # the text that was embedded
    embedding = Column(Vector(EMBEDDING_DIM), nullable=True)

    submitted_at = Column(DateTime(timezone=True), server_default=func.now())


class Project(Base):
    """
    A real project/case-study entry — same "freely add/remove, like a
    spreadsheet row" pattern as JobPosting, not a fixed ContentBlock.

    services / practice_areas / body / key_highlights are stored as JSON-
    encoded lists in Text columns (matching how JobApplication.skills-style
    fields are handled elsewhere) — the admin API accepts/returns real
    lists; only the DB storage is JSON text.

    slug is what the public site routes on (/home-02/projects/<slug>) and
    is generated from the title if not given explicitly, kept unique.
    """

    __tablename__ = "projects"

    id = Column(Integer, primary_key=True)
    slug = Column(String(160), unique=True, nullable=False, index=True)
    title = Column(String(200), nullable=False)
    org = Column(String(200), nullable=False)  # client / partner organization
    type = Column(String(100), nullable=False)
    year = Column(String(20), nullable=False)
    location = Column(String(150), nullable=False)
    services = Column(Text, nullable=True)  # JSON list[str]
    practice_areas = Column(Text, nullable=True)  # JSON list[str]
    summary = Column(Text, nullable=False)
    body = Column(Text, nullable=True)  # JSON list[str], one entry per paragraph
    key_highlights = Column(Text, nullable=True)  # JSON list[str]
    image_url = Column(String(500), nullable=True)
    sort_order = Column(Integer, nullable=False, default=0, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class GalleryItem(Base):
    """
    One gallery entry — a photo or a YouTube video. Freely add/remove from
    the admin panel, same pattern as JobPosting/Project.

    For kind="photo": image_url is used, youtube_id is null.
    For kind="video": youtube_id is used (the part after "v=" in a
    youtube.com/watch?v=... URL), image_url is null.
    """

    __tablename__ = "gallery_items"

    id = Column(Integer, primary_key=True)
    kind = Column(String(10), nullable=False, default="photo")  # "photo" | "video"
    image_url = Column(String(500), nullable=True)
    youtube_id = Column(String(50), nullable=True)
    caption = Column(String(300), nullable=True)
    sort_order = Column(Integer, nullable=False, default=0, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class BlogPost(Base):
    """A blog post — freely add/remove, same pattern as Project."""

    __tablename__ = "blog_posts"

    id = Column(Integer, primary_key=True)
    slug = Column(String(200), unique=True, nullable=False, index=True)
    title = Column(String(300), nullable=False)
    excerpt = Column(Text, nullable=False)
    date_label = Column(String(40), nullable=False)  # free-text, e.g. "12 Aug 2026" — matches the site's existing display format, not parsed/sorted as a real date
    category = Column(String(100), nullable=False)
    key_features = Column(Text, nullable=True)  # JSON list[str] — "Key Takeaways" bullets
    conclusion = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    sort_order = Column(Integer, nullable=False, default=0, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class ContactMessage(Base):
    """
    A submission from the public Contact page form. Public endpoint (no
    login) accepts these, same pattern as JobApplication — visitors
    submitting the form aren't admin users.
    """

    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True)
    name = Column(String(150), nullable=False)
    email = Column(String(200), nullable=False)
    phone = Column(String(60), nullable=True)
    subject = Column(String(150), nullable=True)  # the "Choose an Option" dropdown value
    message = Column(Text, nullable=False)
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
