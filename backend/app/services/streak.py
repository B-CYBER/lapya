from datetime import date, timedelta

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.meal_plan import MealPlanItem


def compute_streak(user_id: int, db: Session, today: date | None = None) -> int:
    """Count consecutive days ending today (or earlier) with at least one completed meal."""
    if today is None:
        today = date.today()

    rows = db.scalars(
        select(MealPlanItem.date)
        .where(MealPlanItem.user_id == user_id, MealPlanItem.is_completed.is_(True))
        .order_by(MealPlanItem.date.desc())
    ).all()
    completed_days = set(rows)

    streak = 0
    cursor = today
    while cursor in completed_days:
        streak += 1
        cursor -= timedelta(days=1)
    return streak
