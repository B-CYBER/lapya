
    # CLAUDE.md — Lapya MVP Project Instructions

## What is this project?
Lapya is an AI-powered therapeutic diet platform for Africans living with multiple chronic conditions (diabetes, hypertension, kidney disease, cardiovascular disease, obesity). Target user: Nigerian woman aged 30–65, often a caregiver. Tagline: "Eat well, even with everything."
- **Frontend:** React + TypeScript + Tailwind 4 + shadcn/ui + Vite 6 + react-router v7 + @tanstack/react-query
- **Backend:** FastAPI + SQLAlchemy 2.0 + Alembic + Pydantic v2 + python-jose (JWT) + passlib (bcrypt) + SQLite (dev) / PostgreSQL (prod)
- **Python:** 3.12 (pinned via pyenv in `backend/`)
- **Node package manager:** yarn (npm is not available on this system)

## Figma Designs
The designs are in a Figma Make file. Use the Figma MCP to pull screen designs:
- **File Key:** `IjDMHUVDmdIjk2QKjDBt9D`
- **URL:** https://www.figma.com/make/IjDMHUVDmdIjk2QKjDBt9D/Lapya--Copy-
- Use `get_design_context(fileKey="IjDMHUVDmdIjk2QKjDBt9D", nodeId="0:1")` to get the full source
- The Figma Make source includes generated React components — use as reference, adapt for production

## Current Status
- Phase 1: Project scaffold & auth — **IN PROGRESS**
- Phase 2: Onboarding flow — NOT STARTED
- Phase 3: Core screens (home, meals, scanner, grocery) — NOT STARTED
- Phase 4: Health & social features — NOT STARTED
- Phase 5: Settings, payments, dietitian portal — NOT STARTED

## Architecture Decisions
- Mobile-first responsive design (iPhone 14 Pro frame 390×844; PWA look)
- JWT-based authentication; access token in `localStorage` as `lapya_token`
- REST API between React frontend and FastAPI backend; dev proxy `/api → :8000`
- shadcn/ui as the component library (matching Figma designs)
- Role-based access: `user`, `caregiver`, `dietitian`, `admin`. Role picked in onboarding, not at signup.
- Pydantic schemas serialize with camelCase aliases; DB columns stay snake_case
- React Query owns server state; `AuthContext` is a thin wrapper, no global state outside React Query

## Detailed context
See `LAPYA_PROJECT_CONTEXT.md` in the project root for full screen inventory, API structure, folder layout, and build phases.

## Conventions
- Use TypeScript strict mode
- Use React functional components with hooks
- Use Tailwind utility classes (match Figma theme tokens from `frontend-figma-sourc/src/styles/theme.css`)
- FastAPI routers for route organization (`app/routers/*.py`)
- All API responses as JSON; errors as `{error: "code", message: "human readable"}`
- Pydantic models for every request and response shape
