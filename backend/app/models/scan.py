from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.recipe import Recipe


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class ScanResult(Base):
    __tablename__ = "scan_results"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    recipe_id: Mapped[int] = mapped_column(ForeignKey("recipes.id", ondelete="RESTRICT"), nullable=False)
    confidence: Mapped[int] = mapped_column(Integer, nullable=False, default=94)
    scanned_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=_utcnow)

    recipe: Mapped[Recipe] = relationship()
