from datetime import datetime, time, timezone

from sqlalchemy.orm import Session

from app.models.health_metric import HealthMetric
from app.models.user import User
from app.models.user_preferences import UserPreferences


def _to_datetime(d) -> datetime:
    if isinstance(d, datetime):
        return d
    return datetime.combine(d, time.min, tzinfo=timezone.utc)


def seed_metrics_from_preferences(user: User, prefs: UserPreferences, db: Session) -> None:
    """Insert one weight + (optional) one BP HealthMetric from onboarding fields."""
    if prefs.weight_kg:
        db.add(
            HealthMetric(
                user_id=user.id,
                metric_type="weight",
                value=float(prefs.weight_kg),
                unit="kg",
                recorded_at=datetime.now(timezone.utc),
                notes="Recorded during onboarding.",
            )
        )

    if prefs.bp_systolic is not None and prefs.bp_diastolic is not None:
        when = _to_datetime(prefs.last_bp_check) if prefs.last_bp_check else datetime.now(timezone.utc)
        db.add(
            HealthMetric(
                user_id=user.id,
                metric_type="blood_pressure",
                value=float(prefs.bp_systolic),
                value_secondary=float(prefs.bp_diastolic),
                unit="mmHg",
                recorded_at=when,
                notes="Recorded during onboarding.",
            )
        )
