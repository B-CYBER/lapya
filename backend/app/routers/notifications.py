from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import select, update
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.exceptions import AppException
from app.models.notification import Notification
from app.models.user import User
from app.schemas.notification import NotificationOut

router = APIRouter()


@router.get("", response_model=list[NotificationOut])
def list_notifications(
    unread: bool | None = Query(default=None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[Notification]:
    stmt = select(Notification).where(Notification.user_id == current_user.id)
    if unread is True:
        stmt = stmt.where(Notification.is_read.is_(False))
    stmt = stmt.order_by(Notification.created_at.desc())
    return list(db.scalars(stmt).all())


@router.patch("/{notification_id}/read", response_model=NotificationOut)
def mark_read(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Notification:
    row = db.get(Notification, notification_id)
    if row is None or row.user_id != current_user.id:
        raise AppException("not_found", "Notification not found.", status.HTTP_404_NOT_FOUND)
    row.is_read = True
    db.commit()
    db.refresh(row)
    return row


@router.post("/mark-all-read")
def mark_all_read(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    db.execute(
        update(Notification)
        .where(Notification.user_id == current_user.id, Notification.is_read.is_(False))
        .values(is_read=True)
    )
    db.commit()
    return {"message": "All caught up."}
