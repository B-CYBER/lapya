from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_admin_user
from app.exceptions import AppException
from app.models.user import User
from app.schemas.user import (
    AdminDietitianVerifyUpdate,
    AdminRoleUpdate,
    UserPublic,
)

router = APIRouter()


def _get_user_or_404(db: Session, user_id: int) -> User:
    user = db.get(User, user_id)
    if user is None:
        raise AppException("user_not_found", "User not found.", status.HTTP_404_NOT_FOUND)
    return user


@router.patch("/users/{user_id}/role", response_model=UserPublic)
def update_role(
    user_id: int,
    payload: AdminRoleUpdate,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_admin_user),
) -> User:
    user = _get_user_or_404(db, user_id)
    user.role = payload.role
    db.commit()
    db.refresh(user)
    return user


@router.patch("/users/{user_id}/dietitian-verified", response_model=UserPublic)
def update_dietitian_verified(
    user_id: int,
    payload: AdminDietitianVerifyUpdate,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_admin_user),
) -> User:
    user = _get_user_or_404(db, user_id)
    user.dietitian_verified = payload.verified
    db.commit()
    db.refresh(user)
    return user
