from datetime import date, datetime, timezone

from sqlalchemy import Boolean, Date, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.recipe import Recipe


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class MealPlanItem(Base):
    __tablename__ = "meal_plan_items"
    __table_args__ = (UniqueConstraint("user_id", "date", "meal_type", name="uq_meal_plan_items_user_date_meal"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    meal_type: Mapped[str] = mapped_column(String(16), nullable=False)
    recipe_id: Mapped[int] = mapped_column(ForeignKey("recipes.id", ondelete="RESTRICT"), nullable=False)
    is_completed: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    edited_by_dietitian_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    dietitian_note: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=_utcnow)

    recipe: Mapped[Recipe] = relationship()
