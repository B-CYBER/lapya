from datetime import datetime, timedelta, timezone
from typing import Any

from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import get_settings

settings = get_settings()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

_reset_serializer = URLSafeTimedSerializer(settings.secret_key, salt="lapya-password-reset")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return pwd_context.verify(password, password_hash)


def create_access_token(subject: str | int, expires_delta: timedelta | None = None) -> str:
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=settings.access_token_expire_minutes)
    )
    payload: dict[str, Any] = {"sub": str(subject), "exp": expire}
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> dict[str, Any] | None:
    try:
        return jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
    except JWTError:
        return None


def create_password_reset_token(email: str) -> str:
    return _reset_serializer.dumps(email)


def verify_password_reset_token(token: str) -> str | None:
    try:
        return _reset_serializer.loads(token, max_age=settings.reset_token_expire_minutes * 60)
    except (BadSignature, SignatureExpired):
        return None
