from datetime import date, datetime, timedelta, timezone

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.exceptions import AppException
from app.models.grocery import GroceryItem
from app.models.meal_plan import MealPlanItem
from app.models.recipe import Recipe
from app.models.user import User
from app.models.user_condition import UserCondition
from app.schemas.meal_plan import MealItemUpdateRequest, MealPlanItemOut, WeekPlanOut
from app.schemas.recipe import RecipeSummary
from app.services.meal_generation import generate_week
from app.services.notifications import meal_completed
from app.services.safety import filter_condition_safety

router = APIRouter()


def _current_monday(reference: date | None = None) -> date:
    today = reference or date.today()
    return today - timedelta(days=today.weekday())


def _condition_slugs(user: User, db: Session) -> list[str]:
    return list(
        db.scalars(select(UserCondition.slug).where(UserCondition.user_id == user.id)).all()
    )


def _to_item_out(
    item: MealPlanItem,
    condition_slugs: list[str],
    db: Session | None = None,
) -> MealPlanItemOut:
    summary_data = RecipeSummary.model_validate(item.recipe).model_dump()
    summary_data["condition_safety"] = filter_condition_safety(
        item.recipe.condition_safety, condition_slugs
    )
    item_data = MealPlanItemOut.model_validate(item).model_dump()
    item_data["recipe"] = summary_data
    if item.edited_by_dietitian_id and db is not None:
        editor = db.get(User, item.edited_by_dietitian_id)
        item_data["edited_by_dietitian_name"] = editor.first_name if editor else None
    return MealPlanItemOut.model_validate(item_data)


def _items_for_week(user: User, db: Session, week_start: date) -> list[MealPlanItem]:
    week_end = week_start + timedelta(days=7)
    return list(
        db.scalars(
            select(MealPlanItem)
            .where(
                MealPlanItem.user_id == user.id,
                MealPlanItem.date >= week_start,
                MealPlanItem.date < week_end,
            )
            .order_by(MealPlanItem.date, MealPlanItem.sort_order)
        ).all()
    )


@router.get("/week", response_model=WeekPlanOut)
def get_week(
    start: date | None = Query(default=None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> WeekPlanOut:
    week_start = start or _current_monday()
    items = _items_for_week(current_user, db, week_start)
    condition_slugs = _condition_slugs(current_user, db)
    return WeekPlanOut(
        week_start=week_start, items=[_to_item_out(i, condition_slugs, db) for i in items]
    )


@router.post("/regenerate", response_model=WeekPlanOut)
def regenerate_week(
    start: date | None = Query(default=None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> WeekPlanOut:
    week_start = start or _current_monday()
    week_end = week_start + timedelta(days=7)

    db.execute(
        delete(MealPlanItem).where(
            MealPlanItem.user_id == current_user.id,
            MealPlanItem.date >= week_start,
            MealPlanItem.date < week_end,
        )
    )
    db.execute(
        delete(GroceryItem).where(
            GroceryItem.user_id == current_user.id, GroceryItem.week_start == week_start
        )
    )

    new_items = generate_week(current_user, db, week_start)
    if not new_items:
        raise AppException(
            "no_recipes",
            "No recipes available. Try running the seed script.",
            status.HTTP_409_CONFLICT,
        )
    for item in new_items:
        db.add(item)
    db.commit()

    return get_week(start=week_start, current_user=current_user, db=db)


@router.patch("/items/{item_id}", response_model=MealPlanItemOut)
def update_item(
    item_id: int,
    payload: MealItemUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> MealPlanItemOut:
    item = db.get(MealPlanItem, item_id)
    if item is None or item.user_id != current_user.id:
        raise AppException("item_not_found", "Meal item not found.", status.HTTP_404_NOT_FOUND)

    if payload.recipe_id is not None:
        recipe = db.get(Recipe, payload.recipe_id)
        if recipe is None:
            raise AppException("recipe_not_found", "Recipe not found.", status.HTTP_404_NOT_FOUND)
        item.recipe_id = recipe.id

    if payload.is_completed is not None:
        was_completed = item.is_completed
        item.is_completed = payload.is_completed
        item.completed_at = datetime.now(timezone.utc) if payload.is_completed else None
        if payload.is_completed and not was_completed:
            meal_completed(current_user, db)

    db.commit()
    db.refresh(item)
    return _to_item_out(item, _condition_slugs(current_user, db), db)
