from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr
from pydantic.alias_generators import to_camel

from app.schemas.health import HealthMetricOut
from app.schemas.meal_plan import WeekPlanOut
from app.schemas.profile import ConditionView, ProfileSummary
from app.schemas.user import UserPublic


RelationshipStatus = Literal["pending", "accepted", "revoked"]


class _CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)


class PatientSummary(_CamelModel):
    id: int
    first_name: str
    last_name: str
    age: int | None
    conditions: list[ConditionView]
    adherence_pct: int
    last_activity_at: datetime | None
    status: Literal["active", "attention"]
    alert_count: int


class PatientDetailOut(_CamelModel):
    patient: UserPublic
    profile: ProfileSummary
    week_plan: WeekPlanOut
    recent_metrics: list[HealthMetricOut]


class DietitianInviteRequest(_CamelModel):
    email: EmailStr


class DietitianInviteResponse(_CamelModel):
    token: str
    invite_url: str
    share_preview: str


class DietitianRelationshipOut(_CamelModel):
    id: int
    patient_id: int | None
    dietitian_id: int
    status: RelationshipStatus
    email: str
    other_name: str | None
    created_at: datetime
    accepted_at: datetime | None


class PatientNoteOut(_CamelModel):
    id: int
    patient_id: int
    dietitian_id: int
    dietitian_name: str | None = None
    body: str
    created_at: datetime
    updated_at: datetime


class PatientNoteCreateRequest(_CamelModel):
    body: str


class DietitianMealEditRequest(_CamelModel):
    recipe_id: int | None = None
    dietitian_note: str | None = None
