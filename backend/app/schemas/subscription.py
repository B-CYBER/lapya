from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

PaidPlan = Literal["care", "family"]
BillingPeriod = Literal["monthly", "annual"]
SubscriptionStatus = Literal["active", "canceled", "past_due"]


class _CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)


class SubscriptionOut(_CamelModel):
    plan: PaidPlan
    billing_period: BillingPeriod
    status: SubscriptionStatus
    current_period_end: datetime


class CheckoutRequest(_CamelModel):
    plan: PaidPlan
    billing_period: BillingPeriod
