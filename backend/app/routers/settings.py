from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.settings import SettingsOut, SettingsUpdateRequest

router = APIRouter()


@router.get("", response_model=SettingsOut)
def get_settings(current_user: User = Depends(get_current_user)) -> User:
    return current_user


@router.patch("", response_model=SettingsOut)
def update_settings(
    payload: SettingsUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> User:
    if payload.phone is not None:
        current_user.phone = payload.phone or None
    if payload.language is not None:
        current_user.language = payload.language
    if payload.notif_meal_reminders is not None:
        current_user.notif_meal_reminders = payload.notif_meal_reminders
    if payload.notif_tips is not None:
        current_user.notif_tips = payload.notif_tips
    if payload.notif_caregiver_alerts is not None:
        current_user.notif_caregiver_alerts = payload.notif_caregiver_alerts
    if payload.notif_marketing is not None:
        current_user.notif_marketing = payload.notif_marketing
    db.commit()
    db.refresh(current_user)
    return current_user
