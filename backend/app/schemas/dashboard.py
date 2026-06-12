from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

from app.schemas.meal_plan import MealPlanItemOut
from app.schemas.user import UserPublic


class _CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)


class DashboardTodayOut(_CamelModel):
    user: UserPublic
    todays_meals: list[MealPlanItemOut]
    streak_days: int
    tip: str
