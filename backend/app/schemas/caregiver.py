from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field
from pydantic.alias_generators import to_camel

from app.schemas.health import HealthMetricOut
from app.schemas.meal_plan import MealPlanItemOut
from app.schemas.user import UserPublic

Relationship = Literal["Daughter", "Son", "Spouse", "Friend", "Other"]
RelationshipStatus = Literal["pending", "accepted", "revoked"]


class _CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)


class CaregiverInviteRequest(_CamelModel):
    email: EmailStr
    relationship: Relationship


class CaregiverInviteResponse(_CamelModel):
    token: str
    invite_url: str
    share_preview: str


class CaregiverRelationshipOut(_CamelModel):
    id: int
    patient_id: int
    caregiver_id: int | None
    status: RelationshipStatus
    relationship: str
    email: str = Field(alias="email")
    other_name: str | None
    created_at: datetime
    accepted_at: datetime | None


class CaregiverHomeOut(_CamelModel):
    patient: UserPublic
    todays_meals: list[MealPlanItemOut]
    grocery_total_kobo: int
    recent_metrics: list[HealthMetricOut]
