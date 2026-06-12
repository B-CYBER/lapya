from datetime import date
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator
from pydantic.alias_generators import to_camel

ConditionSlug = Literal[
    "diabetes",
    "hypertension",
    "kidney",
    "heart",
    "weight",
    "cholesterol",
    "uric-acid",
    "migraines",
    "anxiety",
    "acid-reflux",
    "fatty-liver",
    "arthritis",
]

Severity = Literal["Mild", "Moderate", "Severe"]

Region = Literal[
    "north-central",
    "north-east",
    "north-west",
    "south-east",
    "south-south",
    "south-west",
]

OnboardingRole = Literal["patient", "caregiver", "dietitian"]


class _CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class OnboardingConditionInput(_CamelModel):
    slug: ConditionSlug
    severity: Severity


class OnboardingCompleteRequest(_CamelModel):
    role: OnboardingRole
    display_name: str = Field(min_length=1, max_length=120)
    conditions: list[OnboardingConditionInput] = Field(default_factory=list)
    foods: list[str] = Field(default_factory=list)
    allergies: str | None = None
    region: Region | None = None
    age: int | None = Field(default=None, ge=1, le=120)
    weight_kg: float | None = Field(default=None, ge=20, le=300)
    last_bp_check: date | None = None
    bp_systolic: int | None = Field(default=None, ge=60, le=250)
    bp_diastolic: int | None = Field(default=None, ge=30, le=150)

    @model_validator(mode="after")
    def _require_patient_fields(self) -> "OnboardingCompleteRequest":
        if self.role == "dietitian":
            return self
        missing: list[str] = []
        if not self.conditions:
            missing.append("conditions")
        if not self.foods:
            missing.append("foods")
        if self.region is None:
            missing.append("region")
        if self.age is None:
            missing.append("age")
        if self.weight_kg is None:
            missing.append("weightKg")
        if missing:
            raise ValueError(
                f"Missing required onboarding fields: {', '.join(missing)}"
            )
        return self
