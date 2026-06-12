from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel


class _CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)


class SettingsOut(_CamelModel):
    phone: str | None
    language: str
    notif_meal_reminders: bool
    notif_tips: bool
    notif_caregiver_alerts: bool
    notif_marketing: bool


class SettingsUpdateRequest(_CamelModel):
    phone: str | None = Field(default=None, max_length=32)
    language: str | None = None
    notif_meal_reminders: bool | None = None
    notif_tips: bool | None = None
    notif_caregiver_alerts: bool | None = None
    notif_marketing: bool | None = None
