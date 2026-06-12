from datetime import date

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class _CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)


class GroceryItemOut(_CamelModel):
    id: int
    slug: str
    name: str
    quantity: str
    category: str
    naira_kobo: int
    is_checked: bool


class GroceryListOut(_CamelModel):
    week_start: date
    items: list[GroceryItemOut]
    total_naira_kobo: int


class GroceryToggleRequest(_CamelModel):
    is_checked: bool
