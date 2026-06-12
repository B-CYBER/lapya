from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.subscription import Subscription
from app.models.user import User
from app.schemas.subscription import CheckoutRequest, SubscriptionOut

router = APIRouter()


def _period_end(billing_period: str) -> datetime:
    now = datetime.now(timezone.utc)
    return now + (timedelta(days=365) if billing_period == "annual" else timedelta(days=30))


@router.get("", response_model=SubscriptionOut | None)
def get_subscription(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Subscription | None:
    return db.scalar(select(Subscription).where(Subscription.user_id == current_user.id))


@router.post("/checkout", response_model=SubscriptionOut)
def checkout(
    payload: CheckoutRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Subscription:
    sub = db.scalar(select(Subscription).where(Subscription.user_id == current_user.id))
    period_end = _period_end(payload.billing_period)
    if sub is None:
        sub = Subscription(
            user_id=current_user.id,
            plan=payload.plan,
            billing_period=payload.billing_period,
            status="active",
            current_period_end=period_end,
        )
        db.add(sub)
    else:
        sub.plan = payload.plan
        sub.billing_period = payload.billing_period
        sub.status = "active"
        sub.current_period_end = period_end

    current_user.plan = payload.plan
    db.commit()
    db.refresh(sub)
    return sub
