from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel

MetricType = Literal["weight", "blood_pressure", "blood_sugar"]


class _CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)


class HealthMetricOut(_CamelModel):
    id: int
    metric_type: MetricType
    value: float
    value_secondary: float | None
    unit: str
    recorded_at: datetime
    notes: str | None


class HealthMetricCreate(_CamelModel):
    type: MetricType = Field(alias="type")
    value: float
    value_secondary: float | None = None
    unit: str | None = None
    notes: str | None = None
    recorded_at: datetime | None = None
