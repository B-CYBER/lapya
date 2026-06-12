from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.config import get_settings
from app.exceptions import register_exception_handlers
from app.routers import (
    admin,
    auth,
    caregiver,
    chat,
    dashboard,
    dietitian,
    grocery,
    health,
    meal_plan,
    notifications,
    onboarding,
    profile,
    recipes,
    scanner,
    settings as settings_router,
    subscription,
    waitlist,
)

settings = get_settings()

app = FastAPI(title="Lapya API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_exception_handlers(app)

# Seeded recipe photos live on disk; served read-only at /static/recipe-images/.
_STATIC_DIR = Path(__file__).resolve().parent.parent / "static"
_STATIC_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/static", StaticFiles(directory=str(_STATIC_DIR)), name="static")

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
app.include_router(onboarding.router, prefix="/api/onboarding", tags=["onboarding"])
app.include_router(recipes.router, prefix="/api/recipes", tags=["recipes"])
app.include_router(meal_plan.router, prefix="/api/meal-plan", tags=["meal-plan"])
app.include_router(grocery.router, prefix="/api/grocery-list", tags=["grocery"])
app.include_router(scanner.router, prefix="/api/scanner", tags=["scanner"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])
app.include_router(health.router, prefix="/api/health", tags=["health"])
app.include_router(caregiver.router, prefix="/api", tags=["caregiver"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(profile.router, prefix="/api/profile", tags=["profile"])
app.include_router(settings_router.router, prefix="/api/settings", tags=["settings"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["notifications"])
app.include_router(subscription.router, prefix="/api/subscription", tags=["subscription"])
app.include_router(waitlist.router, prefix="/api/waitlist", tags=["waitlist"])
app.include_router(dietitian.router, prefix="/api/dietitian", tags=["dietitian"])


@app.get("/api/health", tags=["meta"])
def health() -> dict[str, str]:
    return {"status": "ok"}


class _SPAStaticFiles(StaticFiles):
    """Serve the built frontend; unknown paths fall back to index.html so
    client-side routes (/app/week, /login, ...) survive a hard refresh."""

    async def get_response(self, path: str, scope):  # type: ignore[override]
        # API/static misses must stay JSON 404s, not index.html.
        spa_fallback = not path.startswith(("api/", "static/"))
        try:
            response = await super().get_response(path, scope)
        except StarletteHTTPException as exc:
            if exc.status_code == 404 and spa_fallback:
                return await super().get_response("index.html", scope)
            raise
        if response.status_code == 404 and spa_fallback:
            response = await super().get_response("index.html", scope)
        return response


# In production (Heroku) the Vite build is present and one process serves
# everything. In dev the folder is absent and Vite serves the frontend.
_FRONTEND_DIST = Path(__file__).resolve().parents[2] / "frontend" / "dist"
if _FRONTEND_DIST.is_dir():
    app.mount("/", _SPAStaticFiles(directory=str(_FRONTEND_DIST), html=True), name="spa")
