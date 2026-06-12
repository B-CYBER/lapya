from datetime import date, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.meal_plan import MealPlanItem
from app.models.user import User
from app.models.user_condition import UserCondition
from app.schemas.dashboard import DashboardTodayOut
from app.schemas.meal_plan import MealPlanItemOut
from app.schemas.recipe import RecipeSummary
from app.schemas.user import UserPublic
from app.services.meal_generation import generate_week
from app.services.safety import filter_condition_safety
from app.services.streak import compute_streak
from app.services.tips import tip_for_today

router = APIRouter()


def _current_monday() -> date:
    today = date.today()
    return today - timedelta(days=today.weekday())


def _to_item_out(
    item: MealPlanItem, condition_slugs: list[str], db: Session
) -> MealPlanItemOut:
    summary_data = RecipeSummary.model_validate(item.recipe).model_dump()
    summary_data["condition_safety"] = filter_condition_safety(
        item.recipe.condition_safety, condition_slugs
    )
    item_data = MealPlanItemOut.model_validate(item).model_dump()
    item_data["recipe"] = summary_data
    if item.edited_by_dietitian_id:
        editor = db.get(User, item.edited_by_dietitian_id)
        item_data["edited_by_dietitian_name"] = editor.first_name if editor else None
    return MealPlanItemOut.model_validate(item_data)


def _ensure_current_week(user: User, db: Session) -> None:
    week_start = _current_monday()
    week_end = week_start + timedelta(days=7)
    existing = db.scalar(
        select(MealPlanItem.id)
        .where(
            MealPlanItem.user_id == user.id,
            MealPlanItem.date >= week_start,
            MealPlanItem.date < week_end,
        )
        .limit(1)
    )
    if existing is not None:
        return
    new_items = generate_week(user, db, week_start)
    for item in new_items:
        db.add(item)
    db.commit()


@router.get("/today", response_model=DashboardTodayOut)
def get_today(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> DashboardTodayOut:
    _ensure_current_week(current_user, db)

    today = date.today()
    todays_items = db.scalars(
        select(MealPlanItem)
        .where(MealPlanItem.user_id == current_user.id, MealPlanItem.date == today)
        .order_by(MealPlanItem.sort_order)
    ).all()

    condition_slugs = list(
        db.scalars(
            select(UserCondition.slug).where(UserCondition.user_id == current_user.id)
        ).all()
    )

    return DashboardTodayOut(
        user=UserPublic.model_validate(current_user),
        todays_meals=[_to_item_out(i, condition_slugs, db) for i in todays_items],
        streak_days=compute_streak(current_user.id, db, today=today),
        tip=tip_for_today(),
    )
