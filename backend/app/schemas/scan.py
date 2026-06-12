from datetime import datetime

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

from app.schemas.recipe import RecipeSummary


class _CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)


class ScanResultOut(_CamelModel):
    id: int
    confidence: int
    scanned_at: datetime
    recipe: RecipeSummary
