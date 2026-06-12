from fastapi import Depends, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import decode_access_token
from app.exceptions import AppException
from app.models.user import User

bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    if credentials is None:
        raise AppException("not_authenticated", "Authentication required.", status.HTTP_401_UNAUTHORIZED)
    payload = decode_access_token(credentials.credentials)
    if payload is None or "sub" not in payload:
        raise AppException("invalid_token", "Token is invalid or expired.", status.HTTP_401_UNAUTHORIZED)
    try:
        user_id = int(payload["sub"])
    except (TypeError, ValueError):
        raise AppException("invalid_token", "Token is invalid or expired.", status.HTTP_401_UNAUTHORIZED)
    user = db.get(User, user_id)
    if user is None:
        raise AppException("user_not_found", "User no longer exists.", status.HTTP_401_UNAUTHORIZED)
    return user


def get_admin_user(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "admin":
        raise AppException("forbidden", "Admin role required.", status.HTTP_403_FORBIDDEN)
    return current_user


def get_verified_dietitian(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "dietitian" or not current_user.dietitian_verified:
        raise AppException(
            "forbidden",
            "Verified dietitian role required.",
            status.HTTP_403_FORBIDDEN,
        )
    return current_user
