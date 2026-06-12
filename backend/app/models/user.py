from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    first_name: Mapped[str] = mapped_column(String(120), nullable=False)
    last_name: Mapped[str] = mapped_column(String(120), nullable=False)
    role: Mapped[str] = mapped_column(String(32), nullable=False, default="patient")
    dietitian_verified: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    is_email_verified: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    onboarding_completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    language: Mapped[str] = mapped_column(String(8), nullable=False, default="en")
    phone: Mapped[str | None] = mapped_column(String(32), nullable=True)
    plan: Mapped[str] = mapped_column(String(16), nullable=False, default="free")
    notif_meal_reminders: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    notif_tips: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    notif_caregiver_alerts: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    notif_marketing: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    pending_otp_hash: Mapped[str | None] = mapped_column(String(255), nullable=True)
    otp_sent_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=_utcnow)
