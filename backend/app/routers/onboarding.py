from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.health_metric import HealthMetric
from app.models.user import User
from app.models.user_condition import UserCondition
from app.models.user_preferences import UserPreferences
from app.schemas.onboarding import OnboardingCompleteRequest
from app.schemas.user import UserPublic
from app.services.caregiver_seeding import seed_metrics_from_preferences

router = APIRouter()


@router.post("/complete", response_model=UserPublic)
def complete_onboarding(
    payload: OnboardingCompleteRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> User:
    current_user.role = payload.role
    current_user.onboarding_completed_at = datetime.now(timezone.utc)

    if payload.role == "dietitian":
        db.commit()
        db.refresh(current_user)
        return current_user

    existing_prefs = db.scalar(
        select(UserPreferences).where(UserPreferences.user_id == current_user.id)
    )
    if existing_prefs is None:
        existing_prefs = UserPreferences(user_id=current_user.id)
        db.add(existing_prefs)

    existing_prefs.display_name = payload.display_name
    existing_prefs.foods = payload.foods
    existing_prefs.allergies = payload.allergies
    existing_prefs.region = payload.region
    existing_prefs.age = payload.age
    existing_prefs.weight_kg = payload.weight_kg
    existing_prefs.last_bp_check = payload.last_bp_check
    existing_prefs.bp_systolic = payload.bp_systolic
    existing_prefs.bp_diastolic = payload.bp_diastolic

    db.execute(delete(UserCondition).where(UserCondition.user_id == current_user.id))
    for condition in payload.conditions:
        db.add(
            UserCondition(
                user_id=current_user.id,
                slug=condition.slug,
                severity=condition.severity,
            )
        )

    # Only seed metrics on the first onboarding (so re-running the wizard later
    # doesn't pile up duplicate seed rows).
    has_existing_metrics = db.scalar(
        select(HealthMetric.id).where(HealthMetric.user_id == current_user.id).limit(1)
    )
    if has_existing_metrics is None:
        seed_metrics_from_preferences(current_user, existing_prefs, db)

    db.commit()
    db.refresh(current_user)
    return current_user
