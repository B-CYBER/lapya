from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel

from app.schemas.onboarding import OnboardingConditionInput, Region
from app.schemas.user import UserPublic


class _CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)


class ConditionView(_CamelModel):
    slug: str
    severity: str


class ProfileSummary(_CamelModel):
    user: UserPublic
    display_name: str | None
    age: int | None
    weight_kg: float | None
    region: Region | None
    foods: list[str] = []
    allergies: str | None = None
    conditions: list[ConditionView] = []
    streak_days: int
    meals_logged: int
    adherence_pct: int


class ProfileUpdateRequest(_CamelModel):
    display_name: str | None = Field(default=None, min_length=1, max_length=120)
    foods: list[str] | None = None
    allergies: str | None = None
    region: Region | None = None
    age: int | None = Field(default=None, ge=1, le=120)
    weight_kg: float | None = Field(default=None, ge=20, le=300)
    conditions: list[OnboardingConditionInput] | None = None


class PasswordChangeRequest(_CamelModel):
    current_password: str
    new_password: str = Field(min_length=6, max_length=128)
