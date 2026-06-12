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

## Phase 1 status — Scaffold + Auth

What works:

- Signup, login, logout, session rehydration via JWT.
- Protected routes via `/app/*`.
- Forgot-password and email-verification screens (stubbed — see launch blockers).
- All 30+ Figma prototype screens render unchanged; only auth screens are wired to the API. The rest are wired to APIs in later phases.

### Launch blockers — DO NOT ship to real users until these land

- **Email verification** — currently accepts any 6-digit OTP. Needs real email sending (Resend / SES / SMTP).
- **Password reset** — token is logged to stdout. Needs real email.
- **Dietitian self-selection (Phase 2)** — anyone can pick the dietitian role in onboarding. Admin must verify via `dietitian_verified` before that role grants access to patient data.
- **Payments (Phase 5)** — stub provider. Needs Paystack integration (₦ pricing).

## Build phases

Phases 1 → 5 per `LAPYA_PROJECT_CONTEXT.md`. We plan each phase in depth before starting it.

- **Phase 1 — Scaffold + Auth** (in progress / done — see above)
- **Phase 2 — Onboarding** (4-screen wizard, conditions + severity, food prefs)
- **Phase 3 — Core screens** (Home, meal plan, scanner, grocery — multi-condition safety analysis)
- **Phase 4 — Health & social** (metrics, caregivers, Claude-powered nutrition chatbot)
- **Phase 5 — Settings / payments / dietitian portal / landing**
