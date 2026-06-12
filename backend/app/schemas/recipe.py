from typing import Literal

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

MealType = Literal["breakfast", "lunch", "dinner", "snack"]
SafetyRating = Literal["safe", "caution", "avoid"]
IngredientCategory = Literal["proteins", "grains", "vegetables", "fruits", "essentials", "other"]


class _CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)


class IngredientOut(_CamelModel):
    id: int
    item: str
    amount: str
    category: IngredientCategory
    naira_kobo: int
    sort_order: int


class StepOut(_CamelModel):
    id: int
    step_number: int
    instruction: str


class RecipeSummary(_CamelModel):
    id: int
    slug: str
    name: str
    local_name: str | None
    meal_type: MealType
    image_url: str
    portion: str
    reason: str
    calories: int
    protein_g: int
    carbs_g: int
    fat_g: int
    sodium_mg: int
    potassium_mg: int
    prep_minutes: int
    cook_minutes: int
    servings: int
    cuisine_region: str | None
    condition_safety: dict[str, SafetyRating]


class RecipeDetail(RecipeSummary):
    description: str | None
    ingredients: list[IngredientOut]
    steps: list[StepOut]
