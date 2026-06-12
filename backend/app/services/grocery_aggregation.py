import re
from datetime import date, timedelta

from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.models.grocery import GroceryItem
from app.models.meal_plan import MealPlanItem
from app.models.recipe import RecipeIngredient
from app.models.user import User


def _slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return slug or "item"


def aggregate_for_week(user: User, db: Session, week_start: date) -> list[GroceryItem]:
    """Rebuild GroceryItem rows for week_start..+6 from MealPlanItem.recipe.ingredients."""
    week_end = week_start + timedelta(days=7)

    plan_items = db.scalars(
        select(MealPlanItem)
        .where(
            MealPlanItem.user_id == user.id,
            MealPlanItem.date >= week_start,
            MealPlanItem.date < week_end,
        )
    ).all()

    aggregated: dict[str, dict] = {}
    for plan_item in plan_items:
        for ingredient in plan_item.recipe.ingredients:
            slug = _slugify(ingredient.item)
            if slug in aggregated:
                aggregated[slug]["naira_kobo"] += ingredient.naira_kobo
            else:
                aggregated[slug] = {
                    "slug": slug,
                    "name": ingredient.item,
                    "quantity": ingredient.amount,
                    "category": ingredient.category,
                    "naira_kobo": ingredient.naira_kobo,
                }

    db.execute(
        delete(GroceryItem).where(
            GroceryItem.user_id == user.id, GroceryItem.week_start == week_start
        )
    )
    rows: list[GroceryItem] = []
    for data in aggregated.values():
        row = GroceryItem(user_id=user.id, week_start=week_start, **data)
        db.add(row)
        rows.append(row)
    return rows
