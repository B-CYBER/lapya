from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class CaregiverRelationship(Base):
    __tablename__ = "caregiver_relationships"

    id: Mapped[int] = mapped_column(primary_key=True)
    patient_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    caregiver_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=True
    )

    invite_email: Mapped[str] = mapped_column(String(255), nullable=False)
    invite_relationship: Mapped[str] = mapped_column(String(32), nullable=False)
    invite_token: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)

    status: Mapped[str] = mapped_column(String(16), nullable=False, default="pending")

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=_utcnow)
    accepted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
