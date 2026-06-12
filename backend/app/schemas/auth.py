from pydantic import BaseModel, ConfigDict, EmailStr, Field
from pydantic.alias_generators import to_camel


class _CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class VerifyOtpRequest(_CamelModel):
    otp: str = Field(min_length=6, max_length=6, pattern=r"^\d{6}$")


class ForgotPasswordRequest(_CamelModel):
    email: EmailStr


class ResetPasswordRequest(_CamelModel):
    token: str
    new_password: str = Field(min_length=6, max_length=128)


class SimpleMessage(_CamelModel):
    message: str
