# ACE Admin — content management portal

A separate admin login portal for editing the main ACE site's text and
images without touching code. Built the same way your PillPoints stack is
built: FastAPI backend, PostgreSQL database, Docker Compose deployment.

```
admin/
  backend/     FastAPI + PostgreSQL + JWT auth — the API
  frontend/    React admin UI — login + content editor
  docker-compose.yml
```

This is entirely separate from the main site (the `ace-final` root folder)
— it doesn't get deployed to `/var/www/ace-preview`, it runs as its own
service, on its own ports.

## What's actually done vs. what's a documented pattern

I want to be precise about this rather than implying more than what's
built:

- **Fully built and tested end-to-end**: login, JWT auth, the content
  API (list/read/update), image upload, and the admin UI that drives all
  of it. I ran this against a real PostgreSQL instance with real HTTP
  requests — login with correct/wrong passwords, protected-endpoint
  rejection, reading and writing content blocks, uploading and re-serving
  an image — all confirmed working, not just "looks correct."
- **Wired end-to-end on the main site**: the **Home page's Hero section**
  (eyebrow, headline, partner badge) and the **Impact stats section**
  (heading, intro, all four stat values/labels) genuinely fetch from this
  API now, with a safe fallback to the existing static text if the API is
  unreachable or not configured.
- **Seeded but not yet wired**: the remaining 15 rows in the seed data
  (About overview, team stats, aspirations intro, offices, contact
  info, gallery title, logo slots) exist in the database and are editable
  in the admin UI right now — but the corresponding components on the main
  site (`About.tsx`, `Overview.tsx`, `Footer.tsx`, etc.) still read from
  the static `src/content.ts`, not the API. Editing them in the admin
  panel currently has no visible effect on the live site.
- **Not seeded at all**: everything else across Services, Projects,
  Divisions, Blog, Career, Testimonials, and the Gallery — dozens more
  individual text/image fields across ~15 more components.

Wiring the rest is mechanical, repeatable work — see "Extending to more
content" below. I did two full examples (Hero, Impact) specifically so the
pattern is proven and copyable, rather than trying to rush all ~20
components in one pass and risk getting some of them wrong.

## Local setup

**Backend:**
```bash
cd admin/backend
cp .env.example .env
# edit .env — at minimum change JWT_SECRET and ADMIN_PASSWORD
pip install -r requirements.txt --break-system-packages
```

You need a Postgres database matching `DATABASE_URL` in `.env` to exist
first. Easiest local option — use the Docker Compose Postgres service (see
below) rather than installing Postgres yourself.

```bash
python -m app.seed          # populates content_blocks with real ACE copy
uvicorn app.main:app --reload --port 8030
```

Visit `http://localhost:8030/api/health` — should return `{"status":"ok"}`.

**Frontend:**
```bash
cd admin/frontend
npm install
npm run dev
```

Visit the printed local URL, log in with the `ADMIN_USERNAME` /
`ADMIN_PASSWORD` from `.env` (defaults: `admin` / `changeme123` —
**change this before deploying anywhere reachable**).

## Deploying — same domain as the main site (recommended)

Rather than separate `ace-admin.duckdns.org` / `ace-admin-api.duckdns.org`
subdomains, this is set up to run under paths on your existing
`ace-preview.duckdns.org` domain:

```
https://ace-preview.duckdns.org/         -> main site (unchanged)
https://ace-preview.duckdns.org/admin/   -> admin login + dashboard
https://ace-preview.duckdns.org/api/     -> admin backend
```

**Why this is simpler**: no new DNS entries, no new certificates, and
since everything shares one origin, the browser calls between the admin
frontend and backend are same-origin — CORS doesn't come into play at all
in production. The admin frontend is already built with
`base: '/admin/'` and its API client defaults to a relative `/api` path
for exactly this setup.

### 1. Upload and configure

```bash
scp -r admin root@187.127.150.252:/root/ace-admin
ssh root@187.127.150.252
cd /root/ace-admin/backend
cp .env.example .env
nano .env
```

Change at minimum `JWT_SECRET` and `ADMIN_PASSWORD` (generate a real
secret: `python3 -c "import secrets; print(secrets.token_hex(32))"`).

### 2. Start the stack

```bash
cd /root/ace-admin
docker compose up --build -d
docker compose ps   # all three should show "Up"
```

Note the containers are bound to `127.0.0.1` only (see `docker-compose.yml`)
— they're not reachable from the internet directly, only through Nginx.

### 3. Add two location blocks to the EXISTING Nginx config

Don't create new server blocks — edit the same file already serving the
main site:

```bash
nano /etc/nginx/sites-available/ace-preview
```

Inside the existing `server { ... listen 443 ssl; ... }` block (the one
Certbot already set up), add these two `location` blocks. Nginx picks the
most specific matching prefix automatically, so it doesn't matter whether
you place these before or after the site's existing
`location / { try_files ... }` block:

```nginx
    location /api/ {
        proxy_pass http://127.0.0.1:8030;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /admin/ {
        proxy_pass http://127.0.0.1:5180/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /uploads/ {
        proxy_pass http://127.0.0.1:8030;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
```

That third block matters: uploaded images are served by the backend at
`/uploads/...`, not under `/api/`. Without this block, an image *uploaded
through the admin panel* would silently 404 (or worse, get served the
main site's `index.html` instead) even though everything else works —
worth adding now rather than discovering it the first time someone
uploads a photo.

Note the trailing slash on `proxy_pass http://127.0.0.1:5180/` for the
`/admin/` block specifically — that's what strips the `/admin/` prefix
before forwarding, so the container (which serves its files from its own
root) receives the request it expects. The `/api/` block has **no**
trailing slash, because the backend's own routes already start with `/api/`
— forwarding the full path unchanged is what's needed there.

Test before reloading — this is critical since a bad reload can affect
every other site Nginx serves on this box, not just this one:

```bash
nginx -t
```

Only if that says `syntax is ok` / `test is successful`:

```bash
systemctl reload nginx
```

No new Certbot run needed — `https://ace-preview.duckdns.org/admin/` and
`/api/` are automatically covered by the certificate that's already issued
for the whole domain.

### 4. Verify

```bash
curl -H "Host: ace-preview.duckdns.org" http://127.0.0.1/api/health
```

Should return `{"status":"ok"}`. Then visit
`https://ace-preview.duckdns.org/admin/` in a browser — should show the
login page. Log in with the username/password from `.env`.

### Deploying on separate subdomains instead

If you'd rather keep the admin panel on its own subdomain after all (more
DNS entries, but a cleaner separation — e.g. easier to IP-restrict later),
that's also supported: rebuild the admin frontend with
`ADMIN_API_PUBLIC_URL=https://your-admin-api-domain docker compose up
--build -d admin_frontend`, revert `base: '/admin/'` back to the default in
`frontend/vite.config.ts`, and set up two ordinary Nginx server blocks +
Certbot runs like `ace-preview`'s own setup. Ask if you want the exact
steps for this path instead.

## Extending to more content — the exact repeatable pattern

To make another piece of text or an image editable, three steps:

**1. Add a row to the seed data** — `admin/backend/app/seed.py`:
```python
("services", "assess", "services.assess_title", "Assess — pillar title", "text", "Assess"),
```
`(page, section, key, label, type, value)` — `key` is what the frontend
will look up, `label` is what the admin UI displays, `type` is `"text"`,
`"richtext"` (multi-line), or `"image"`.

**2. Re-run the seed** (safe — it only inserts rows that don't exist yet,
never overwrites an edited value):
```bash
docker compose exec admin_backend python -m app.seed
```

**3. Wire the component** — in the relevant file under
`ace-final/src/components/`:
```tsx
import { useDynamicContent } from "../hooks/useDynamicContent";

// inside the component:
const title = useDynamicContent("services.assess_title", "Assess"); // 2nd arg = current static fallback
// ...
<h3>{title}</h3>
```

That's the entire pattern — it's the same three steps for every remaining
field. For an image field, the component just does
`<img src={imageUrl} />` where `imageUrl` comes from `useDynamicContent`
the same way; the admin UI's upload button handles getting a real URL into
that field.

## Security notes — read before deploying anywhere public

- **Single admin user, no roles, no self-service password reset.** This is
  intentionally minimal. If you need multiple admin accounts or
  permission levels later, that's a real backend change, not a config
  toggle.
- **Change `JWT_SECRET` and `ADMIN_PASSWORD`** in `.env` before deploying —
  the defaults are placeholders, not secrets.
- **No rate limiting on `/api/auth/login`.** Fine for a small internal
  tool; worth adding (e.g. via Nginx or `slowapi`) before this is
  internet-facing for any length of time.
- **CORS**: `CORS_ORIGINS` in `.env` must list the admin frontend's real
  URL and the main site's real URL, or browsers will block the requests.
- **Uploaded files** are served directly from `/uploads` with no
  virus/content scanning — fine for a trusted single-admin tool, worth
  knowing if this ever opens up to more users.
