from fastapi import APIRouter, Depends, status
from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.core.security import hash_password, verify_password
from app.exceptions import AppException
from app.models.user import User
from app.models.user_condition import UserCondition
from app.models.user_preferences import UserPreferences
from app.schemas.profile import (
    ConditionView,
    PasswordChangeRequest,
    ProfileSummary,
    ProfileUpdateRequest,
)
from app.schemas.user import UserPublic
from app.services.adherence import compute_adherence_pct, count_completed_meals
from app.services.streak import compute_streak

router = APIRouter()


def _build_summary(user: User, db: Session) -> ProfileSummary:
    prefs = db.scalar(select(UserPreferences).where(UserPreferences.user_id == user.id))
    conditions = db.scalars(
        select(UserCondition).where(UserCondition.user_id == user.id)
    ).all()

    return ProfileSummary(
        user=UserPublic.model_validate(user),
        display_name=prefs.display_name if prefs else None,
        age=prefs.age if prefs else None,
        weight_kg=prefs.weight_kg if prefs else None,
        region=prefs.region if prefs else None,  # type: ignore[arg-type]
        foods=list(prefs.foods) if prefs and prefs.foods else [],
        allergies=prefs.allergies if prefs else None,
        conditions=[ConditionView(slug=c.slug, severity=c.severity) for c in conditions],
        streak_days=compute_streak(user.id, db),
        meals_logged=count_completed_meals(user.id, db),
        adherence_pct=compute_adherence_pct(user.id, db),
    )


@router.get("", response_model=ProfileSummary)
def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ProfileSummary:
    return _build_summary(current_user, db)


@router.patch("", response_model=ProfileSummary)
def update_profile(
    payload: ProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ProfileSummary:
    prefs = db.scalar(select(UserPreferences).where(UserPreferences.user_id == current_user.id))
    if prefs is None:
        raise AppException(
            "no_profile",
            "Complete onboarding before editing your profile.",
            status.HTTP_400_BAD_REQUEST,
        )

    if payload.display_name is not None:
        prefs.display_name = payload.display_name
    if payload.foods is not None:
        prefs.foods = payload.foods
    if payload.allergies is not None:
        prefs.allergies = payload.allergies
    if payload.region is not None:
        prefs.region = payload.region
    if payload.age is not None:
        prefs.age = payload.age
    if payload.weight_kg is not None:
        prefs.weight_kg = payload.weight_kg

    if payload.conditions is not None:
        db.execute(delete(UserCondition).where(UserCondition.user_id == current_user.id))
        for c in payload.conditions:
            db.add(UserCondition(user_id=current_user.id, slug=c.slug, severity=c.severity))

    db.commit()
    db.refresh(current_user)
    return _build_summary(current_user, db)


@router.post("/password")
def change_password(
    payload: PasswordChangeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    if not verify_password(payload.current_password, current_user.password_hash):
        raise AppException(
            "invalid_credentials",
            "Current password is incorrect.",
            status.HTTP_401_UNAUTHORIZED,
        )
    current_user.password_hash = hash_password(payload.new_password)
    db.commit()
    return {"message": "Password updated."}
