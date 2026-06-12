import logging
import secrets
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, BackgroundTasks, Depends, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.database import get_db
from app.core.deps import get_current_user
from app.core.security import (
    create_access_token,
    create_password_reset_token,
    hash_password,
    verify_password,
    verify_password_reset_token,
)
from app.exceptions import AppException
from app.models.user import User
from app.schemas.auth import (
    ForgotPasswordRequest,
    ResetPasswordRequest,
    SimpleMessage,
    VerifyOtpRequest,
)
from app.schemas.user import TokenResponse, UserCreate, UserLogin, UserPublic
from app.services.email import send_email_template
from app.services.notifications import welcome_pack

router = APIRouter()
logger = logging.getLogger("lapya.auth")

OTP_EXPIRY_MINUTES = 30


def _generate_otp() -> str:
    """6-digit OTP. Leading zeros allowed."""
    return f"{secrets.randbelow(1_000_000):06d}"


def _build_token_response(user: User) -> TokenResponse:
    return TokenResponse(
        user=UserPublic.model_validate(user),
        access_token=create_access_token(user.id),
    )


async def _send_verification(to: str, first_name: str, otp: str) -> None:
    await send_email_template(
        to,
        "verification",
        {"first_name": first_name, "otp": otp},
    )


async def _send_password_reset(to: str, first_name: str, token: str) -> None:
    settings = get_settings()
    reset_url = f"{settings.app_public_url}/reset-password?token={token}"
    await send_email_template(
        to,
        "password_reset",
        {"first_name": first_name, "reset_url": reset_url},
    )


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def signup(
    payload: UserCreate,
    background: BackgroundTasks,
    db: Session = Depends(get_db),
) -> TokenResponse:
    existing = db.scalar(select(User).where(User.email == payload.email.lower()))
    if existing is not None:
        raise AppException(
            "email_taken",
            "An account with this email already exists.",
            status.HTTP_409_CONFLICT,
        )

    otp = _generate_otp()
    user = User(
        email=payload.email.lower(),
        password_hash=hash_password(payload.password),
        first_name=payload.first_name,
        last_name=payload.last_name,
        pending_otp_hash=hash_password(otp),
        otp_sent_at=datetime.now(timezone.utc),
    )
    db.add(user)
    db.flush()
    welcome_pack(user, db)
    db.commit()
    db.refresh(user)

    background.add_task(_send_verification, user.email, user.first_name, otp)

    return _build_token_response(user)


@router.post("/login", response_model=TokenResponse)
def login(payload: UserLogin, db: Session = Depends(get_db)) -> TokenResponse:
    user = db.scalar(select(User).where(User.email == payload.email.lower()))
    if user is None or not verify_password(payload.password, user.password_hash):
        raise AppException(
            "invalid_credentials",
            "Email or password is incorrect.",
            status.HTTP_401_UNAUTHORIZED,
        )
    return _build_token_response(user)


@router.get("/me", response_model=UserPublic)
def me(current_user: User = Depends(get_current_user)) -> User:
    return current_user


@router.post("/verify-email", response_model=UserPublic)
def verify_email(
    payload: VerifyOtpRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> User:
    if current_user.is_email_verified:
        return current_user

    if not current_user.pending_otp_hash or not current_user.otp_sent_at:
        raise AppException(
            "no_pending_otp",
            "No verification code outstanding. Request a new one.",
            status.HTTP_400_BAD_REQUEST,
        )

    sent_at = current_user.otp_sent_at
    if sent_at.tzinfo is None:
        sent_at = sent_at.replace(tzinfo=timezone.utc)
    if datetime.now(timezone.utc) - sent_at > timedelta(minutes=OTP_EXPIRY_MINUTES):
        raise AppException(
            "otp_expired",
            "That code expired. Request a new one.",
            status.HTTP_410_GONE,
        )

    if not verify_password(payload.otp, current_user.pending_otp_hash):
        raise AppException(
            "invalid_otp",
            "That code is incorrect.",
            status.HTTP_401_UNAUTHORIZED,
        )

    current_user.is_email_verified = True
    current_user.pending_otp_hash = None
    current_user.otp_sent_at = None
    db.commit()
    db.refresh(current_user)
    return current_user


@router.post("/resend-verification", response_model=SimpleMessage)
def resend_verification(
    background: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> SimpleMessage:
    if current_user.is_email_verified:
        return SimpleMessage(message="Already verified.")

    otp = _generate_otp()
    current_user.pending_otp_hash = hash_password(otp)
    current_user.otp_sent_at = datetime.now(timezone.utc)
    db.commit()

    background.add_task(_send_verification, current_user.email, current_user.first_name, otp)
    return SimpleMessage(message="A new code is on its way.")


@router.post("/forgot-password", response_model=SimpleMessage)
def forgot_password(
    payload: ForgotPasswordRequest,
    background: BackgroundTasks,
    db: Session = Depends(get_db),
) -> SimpleMessage:
    user = db.scalar(select(User).where(User.email == payload.email.lower()))
    if user is not None:
        token = create_password_reset_token(user.email)
        background.add_task(_send_password_reset, user.email, user.first_name, token)
    return SimpleMessage(message="If that email is registered, a reset link has been sent.")


@router.post("/reset-password", response_model=SimpleMessage)
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)) -> SimpleMessage:
    email = verify_password_reset_token(payload.token)
    if email is None:
        raise AppException(
            "invalid_token",
            "Reset link is invalid or expired.",
            status.HTTP_400_BAD_REQUEST,
        )
    user = db.scalar(select(User).where(User.email == email.lower()))
    if user is None:
        raise AppException(
            "invalid_token",
            "Reset link is invalid or expired.",
            status.HTTP_400_BAD_REQUEST,
        )
    user.password_hash = hash_password(payload.new_password)
    db.commit()
    return SimpleMessage(message="Password updated.")
