from datetime import date, timedelta

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.exceptions import AppException
from app.models.grocery import GroceryItem
from app.models.user import User
from app.schemas.grocery import GroceryItemOut, GroceryListOut, GroceryToggleRequest
from app.services.grocery_aggregation import aggregate_for_week

router = APIRouter()


def _current_monday() -> date:
    today = date.today()
    return today - timedelta(days=today.weekday())


def _list_items(user: User, db: Session, week_start: date) -> list[GroceryItem]:
    return list(
        db.scalars(
            select(GroceryItem)
            .where(GroceryItem.user_id == user.id, GroceryItem.week_start == week_start)
            .order_by(GroceryItem.category, GroceryItem.id)
        ).all()
    )


def _build_list(items: list[GroceryItem], week_start: date) -> GroceryListOut:
    total = sum(item.naira_kobo for item in items)
    return GroceryListOut(
        week_start=week_start,
        items=[GroceryItemOut.model_validate(item) for item in items],
        total_naira_kobo=total,
    )


@router.get("", response_model=GroceryListOut)
def get_grocery_list(
    week: date | None = Query(default=None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> GroceryListOut:
    week_start = week or _current_monday()
    items = _list_items(current_user, db, week_start)
    if not items:
        aggregate_for_week(current_user, db, week_start)
        db.commit()
        items = _list_items(current_user, db, week_start)
    return _build_list(items, week_start)


@router.post("/regenerate", response_model=GroceryListOut)
def regenerate_grocery_list(
    week: date | None = Query(default=None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> GroceryListOut:
    week_start = week or _current_monday()
    aggregate_for_week(current_user, db, week_start)
    db.commit()
    return _build_list(_list_items(current_user, db, week_start), week_start)


@router.patch("/items/{item_id}", response_model=GroceryItemOut)
def toggle_item(
    item_id: int,
    payload: GroceryToggleRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> GroceryItemOut:
    item = db.get(GroceryItem, item_id)
    if item is None or item.user_id != current_user.id:
        raise AppException("item_not_found", "Grocery item not found.", status.HTTP_404_NOT_FOUND)
    item.is_checked = payload.is_checked
    db.commit()
    db.refresh(item)
    return GroceryItemOut.model_validate(item)
