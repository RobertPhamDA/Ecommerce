## Backend (FastAPI + SQLAlchemy + Supabase Postgres + Supabase Storage)

### Requirements
- Python 3.11+

### Setup
Copy `env.example` to `env` and fill values:

```bash
copy env.example env
```

Create venv + install deps:

```bash
python -m venv .venv
.venv\\Scripts\\python -m pip install -r requirements.txt
```

### Migrations (Alembic)
Generate initial migration:

```bash
.venv\\Scripts\\alembic revision --autogenerate -m "init"
```

Apply migrations:

```bash
.venv\\Scripts\\alembic upgrade head
```

### Run API

```bash
.venv\\Scripts\\uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Open docs: `http://localhost:8000/docs`

### Auth
- `POST /api/auth/register` (email+password) creates a **user** account.
- `POST /api/auth/login` uses OAuth2 form fields: `username` (email) + `password` → returns JWT.
- For admin-only routes, set a user's `role` to `admin` in DB (or extend with an admin endpoint).

### Image Upload (Supabase Storage)
- Bucket: `SUPABASE_STORAGE_BUCKET_IMAGES` (default: `images`)
- Endpoint (admin only): `POST /api/uploads/image` (multipart form upload field `file`)
- The response returns `{ "url": "https://.../storage/v1/object/public/..." }`

### Create an admin user (script)

```bash
.venv\\Scripts\\python -m app.main  # optional quick import check
.venv\\Scripts\\python scripts\\create_admin.py
```
