from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr
from pydantic.alias_generators import to_camel

WaitlistRole = Literal["patient", "caregiver", "dietitian", "other"]


class _CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class WaitlistRequest(_CamelModel):
    email: EmailStr
    role: WaitlistRole


class WaitlistResponse(_CamelModel):
    message: str
