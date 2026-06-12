from datetime import date, datetime, timezone

from sqlalchemy import Boolean, Date, DateTime, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class GroceryItem(Base):
    __tablename__ = "grocery_items"
    __table_args__ = (UniqueConstraint("user_id", "week_start", "slug", name="uq_grocery_user_week_slug"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    week_start: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    slug: Mapped[str] = mapped_column(String(64), nullable=False)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    quantity: Mapped[str] = mapped_column(String(120), nullable=False)
    category: Mapped[str] = mapped_column(String(32), nullable=False)
    naira_kobo: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    is_checked: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=_utcnow)
