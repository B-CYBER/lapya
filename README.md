# Lapya

AI-powered therapeutic diet platform for Africans living with multiple chronic conditions (diabetes, hypertension, kidney disease, cardiovascular disease, obesity). Target user: Nigerian woman aged 30–65, often a caregiver.

> **Tagline:** "Eat well, even with everything."

## Repo layout

```
.
├── CLAUDE.md                 # Project rules for Claude Code
├── LAPYA_PROJECT_CONTEXT.md  # Full screen inventory and build phases
├── frontend-figma-sourc/     # Figma Make export (read-only reference)
├── frontend/                 # Production frontend (React + Vite + Tailwind 4)
└── backend/                  # FastAPI backend (Python 3.12)
```

## Quick start

You need **Python 3.12** (managed by pyenv) and **Node 18+** with **yarn**.

### Backend

```sh
cd backend
pyenv local 3.12.3
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # generate secrets with `openssl rand -hex 32`
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

API runs at <http://localhost:8000>. Interactive docs at <http://localhost:8000/docs>.

Run tests:

```sh
cd backend && source venv/bin/activate
pytest
```

### Frontend

```sh
cd frontend
yarn
yarn dev
```

App runs at <http://localhost:5173>. The dev server proxies `/api/*` to the backend.
