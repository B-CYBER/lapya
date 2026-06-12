from datetime import date, datetime

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

from app.schemas.recipe import RecipeSummary


class _CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)


class MealPlanItemOut(_CamelModel):
    id: int
    date: date
    meal_type: str
    is_completed: bool
    completed_at: datetime | None
    sort_order: int
    recipe: RecipeSummary
    edited_by_dietitian_id: int | None = None
    edited_by_dietitian_name: str | None = None
    dietitian_note: str | None = None


class WeekPlanOut(_CamelModel):
    week_start: date
    items: list[MealPlanItemOut]


class MealItemUpdateRequest(_CamelModel):
    recipe_id: int | None = None
    is_completed: bool | None = None
