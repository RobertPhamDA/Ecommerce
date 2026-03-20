## Ecommerce Website (Next.js 14 + FastAPI + Supabase Postgres + Supabase Storage)

This workspace contains two repos:
- `frontend/` (Next.js 14 + TypeScript + Tailwind)
- `backend/` (FastAPI + SQLAlchemy + Alembic + JWT RBAC + Storage uploads)

### Local run (high level)
1) Backend
- `cd backend`
- `copy env.example env` and fill values
- `python -m venv .venv`
- `.venv\\Scripts\\python -m pip install -r requirements.txt`
- `.venv\\Scripts\\alembic revision --autogenerate -m "init"` (first time)
- `.venv\\Scripts\\alembic upgrade head`
- `.venv\\Scripts\\python scripts\\create_admin.py` (optional)
- `.venv\\Scripts\\uvicorn app.main:app --reload --port 8000`

2) Frontend
- Install Node.js 18+ (LTS)
- `cd frontend`
- `copy env.example .env.local`
- `npm install`
- `npm run dev` (port 3000)

### Deployment notes
- **Database**: use Supabase Postgres connection string in `backend/env` as `DATABASE_URL`.
- **Images**: configure Supabase Storage in `backend/env` (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_STORAGE_BUCKET_IMAGES`). Use `/api/uploads/image` (admin-only) to upload to a public bucket.
- **Frontend hosting**: Vercel is simplest; set `NEXT_PUBLIC_API_BASE_URL` to your backend URL.
- **Backend hosting**: deploy on Render/Fly/Cloud Run; run migrations via Alembic during release.

