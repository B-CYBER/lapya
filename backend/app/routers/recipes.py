from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.exceptions import AppException
from app.models.recipe import Recipe
from app.models.user import User
from app.models.user_condition import UserCondition
from app.schemas.recipe import RecipeDetail, RecipeSummary
from app.services.safety import filter_condition_safety

router = APIRouter()


def _user_condition_slugs(user: User, db: Session) -> list[str]:
    return list(
        db.scalars(select(UserCondition.slug).where(UserCondition.user_id == user.id)).all()
    )


def _summary(recipe: Recipe, condition_slugs: list[str]) -> RecipeSummary:
    data = RecipeSummary.model_validate(recipe).model_dump()
    data["condition_safety"] = filter_condition_safety(recipe.condition_safety, condition_slugs)
    return RecipeSummary.model_validate(data)


@router.get("", response_model=list[RecipeSummary])
def list_recipes(
    meal_type: str | None = Query(default=None, alias="mealType"),
    cuisine_region: str | None = Query(default=None, alias="cuisineRegion"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[RecipeSummary]:
    stmt = select(Recipe)
    if meal_type:
        stmt = stmt.where(Recipe.meal_type == meal_type)
    if cuisine_region:
        stmt = stmt.where(Recipe.cuisine_region == cuisine_region)

    condition_slugs = _user_condition_slugs(current_user, db)
    return [_summary(r, condition_slugs) for r in db.scalars(stmt).all()]


@router.get("/{recipe_id}", response_model=RecipeDetail)
def get_recipe(
    recipe_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> RecipeDetail:
    recipe = db.get(Recipe, recipe_id)
    if recipe is None:
        raise AppException("recipe_not_found", "Recipe not found.", status.HTTP_404_NOT_FOUND)

    condition_slugs = _user_condition_slugs(current_user, db)
    data = RecipeDetail.model_validate(recipe).model_dump()
    data["condition_safety"] = filter_condition_safety(recipe.condition_safety, condition_slugs)
    return RecipeDetail.model_validate(data)
