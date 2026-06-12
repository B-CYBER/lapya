from datetime import date, datetime, timezone

from sqlalchemy import JSON, Date, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class UserPreferences(Base):
    __tablename__ = "user_preferences"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), unique=True, index=True, nullable=False
    )

    display_name: Mapped[str] = mapped_column(String(120), nullable=False)
    foods: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    allergies: Mapped[str | None] = mapped_column(Text, nullable=True)
    region: Mapped[str] = mapped_column(String(32), nullable=False)

    age: Mapped[int] = mapped_column(Integer, nullable=False)
    weight_kg: Mapped[float] = mapped_column(Float, nullable=False)

    last_bp_check: Mapped[date | None] = mapped_column(Date, nullable=True)
    bp_systolic: Mapped[int | None] = mapped_column(Integer, nullable=True)
    bp_diastolic: Mapped[int | None] = mapped_column(Integer, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=_utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=_utcnow, onupdate=_utcnow
    )
