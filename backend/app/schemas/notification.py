from datetime import datetime

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class _CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)


class NotificationOut(_CamelModel):
    id: int
    kind: str
    title: str
    body: str
    is_read: bool
    created_at: datetime
