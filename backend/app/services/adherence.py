from datetime import date, timedelta

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.meal_plan import MealPlanItem


def compute_adherence_pct(user_id: int, db: Session, today: date | None = None) -> int:
    """% of MealPlanItems in the last 7 days where `is_completed = True`. Returns 0–100."""
    today = today or date.today()
    start = today - timedelta(days=6)

    total = db.scalar(
        select(func.count(MealPlanItem.id)).where(
            MealPlanItem.user_id == user_id,
            MealPlanItem.date >= start,
            MealPlanItem.date <= today,
        )
    ) or 0
    if total == 0:
        return 0

    done = db.scalar(
        select(func.count(MealPlanItem.id)).where(
            MealPlanItem.user_id == user_id,
            MealPlanItem.date >= start,
            MealPlanItem.date <= today,
            MealPlanItem.is_completed.is_(True),
        )
    ) or 0
    return round(done * 100 / total)


def count_completed_meals(user_id: int, db: Session) -> int:
    return db.scalar(
        select(func.count(MealPlanItem.id)).where(
            MealPlanItem.user_id == user_id,
            MealPlanItem.is_completed.is_(True),
        )
    ) or 0
