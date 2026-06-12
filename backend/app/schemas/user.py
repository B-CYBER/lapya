from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field
from pydantic.alias_generators import to_camel

Role = Literal["patient", "caregiver", "dietitian", "admin"]
Plan = Literal["free", "care", "family"]


class _CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)


class UserPublic(_CamelModel):
    id: int
    email: EmailStr
    first_name: str
    last_name: str
    role: Role
    dietitian_verified: bool
    is_email_verified: bool
    onboarding_completed_at: datetime | None
    language: str
    phone: str | None
    plan: Plan
    notif_meal_reminders: bool
    notif_tips: bool
    notif_caregiver_alerts: bool
    notif_marketing: bool
    created_at: datetime


class UserCreate(_CamelModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)
    first_name: str = Field(min_length=1, max_length=120)
    last_name: str = Field(min_length=1, max_length=120)


class UserLogin(_CamelModel):
    email: EmailStr
    password: str


class TokenResponse(_CamelModel):
    user: UserPublic
    access_token: str


class AdminRoleUpdate(_CamelModel):
    role: Role


class AdminDietitianVerifyUpdate(_CamelModel):
    verified: bool
