import random
from datetime import date, timedelta

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.meal_plan import MealPlanItem
from app.models.recipe import Recipe
from app.models.user import User
from app.models.user_condition import UserCondition
from app.models.user_preferences import UserPreferences

MEAL_TYPES = ("breakfast", "lunch", "dinner", "snack")


def _score(recipe: Recipe, preferred_foods: set[str], region: str | None) -> int:
    score = 0
    if recipe.slug in preferred_foods:
        score += 3
    if region and recipe.cuisine_region == region:
        score += 1
    return score


def _is_safe(recipe: Recipe, user_condition_slugs: set[str]) -> bool:
    safety = recipe.condition_safety or {}
    return not any(safety.get(slug) == "avoid" for slug in user_condition_slugs)


def generate_week(user: User, db: Session, week_start: date) -> list[MealPlanItem]:
    """Build (uncommitted) MealPlanItem rows for week_start..+6 covering all 4 meal types/day."""
    prefs = db.scalar(select(UserPreferences).where(UserPreferences.user_id == user.id))
    preferred_foods = set(prefs.foods) if prefs and prefs.foods else set()
    region = prefs.region if prefs else None

    condition_slugs = set(
        db.scalars(select(UserCondition.slug).where(UserCondition.user_id == user.id)).all()
    )

    recipes_by_type: dict[str, list[Recipe]] = {meal_type: [] for meal_type in MEAL_TYPES}
    for recipe in db.scalars(select(Recipe)).all():
        if recipe.meal_type in recipes_by_type and _is_safe(recipe, condition_slugs):
            recipes_by_type[recipe.meal_type].append(recipe)

    items: list[MealPlanItem] = []
    chosen_this_week: set[int] = set()

    for day_offset in range(7):
        day = week_start + timedelta(days=day_offset)
        for sort_order, meal_type in enumerate(MEAL_TYPES):
            pool = recipes_by_type[meal_type]
            if not pool:
                continue

            available = [r for r in pool if r.id not in chosen_this_week] or pool
            scored = sorted(available, key=lambda r: _score(r, preferred_foods, region), reverse=True)
            top_score = _score(scored[0], preferred_foods, region)
            top = [r for r in scored if _score(r, preferred_foods, region) == top_score]
            recipe = random.choice(top)
            chosen_this_week.add(recipe.id)

            items.append(
                MealPlanItem(
                    user_id=user.id,
                    date=day,
                    meal_type=meal_type,
                    recipe_id=recipe.id,
                    sort_order=sort_order,
                )
            )
    return items
