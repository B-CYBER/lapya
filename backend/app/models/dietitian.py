from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class DietitianRelationship(Base):
    __tablename__ = "dietitian_relationships"

    id: Mapped[int] = mapped_column(primary_key=True)
    patient_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=True
    )
    dietitian_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )

    invite_email: Mapped[str] = mapped_column(String(255), nullable=False)
    invite_token: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    status: Mapped[str] = mapped_column(String(16), nullable=False, default="pending")

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=_utcnow)
    accepted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)


class PatientNote(Base):
    __tablename__ = "patient_notes"

    id: Mapped[int] = mapped_column(primary_key=True)
    patient_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    dietitian_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    body: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=_utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=_utcnow, onupdate=_utcnow
    )
