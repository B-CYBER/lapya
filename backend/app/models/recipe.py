from datetime import datetime, timezone

from sqlalchemy import JSON, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Recipe(Base):
    __tablename__ = "recipes"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    local_name: Mapped[str | None] = mapped_column(String(120), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    meal_type: Mapped[str] = mapped_column(String(16), nullable=False, index=True)
    image_url: Mapped[str] = mapped_column(String(500), nullable=False)

    prep_minutes: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    cook_minutes: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    servings: Mapped[int] = mapped_column(Integer, nullable=False, default=1)

    calories: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    protein_g: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    carbs_g: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    fat_g: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    sodium_mg: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    potassium_mg: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    portion: Mapped[str] = mapped_column(String(200), nullable=False, default="")
    reason: Mapped[str] = mapped_column(String(200), nullable=False, default="")

    condition_safety: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    cuisine_region: Mapped[str | None] = mapped_column(String(32), nullable=True)
    is_seeded: Mapped[bool] = mapped_column(default=True, nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=_utcnow)

    ingredients: Mapped[list["RecipeIngredient"]] = relationship(
        back_populates="recipe",
        cascade="all, delete-orphan",
        order_by="RecipeIngredient.sort_order",
    )
    steps: Mapped[list["RecipeStep"]] = relationship(
        back_populates="recipe",
        cascade="all, delete-orphan",
        order_by="RecipeStep.step_number",
    )


class RecipeIngredient(Base):
    __tablename__ = "recipe_ingredients"

    id: Mapped[int] = mapped_column(primary_key=True)
    recipe_id: Mapped[int] = mapped_column(ForeignKey("recipes.id", ondelete="CASCADE"), index=True, nullable=False)

    item: Mapped[str] = mapped_column(String(120), nullable=False)
    amount: Mapped[str] = mapped_column(String(120), nullable=False)
    category: Mapped[str] = mapped_column(String(32), nullable=False, default="other")
    naira_kobo: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    recipe: Mapped[Recipe] = relationship(back_populates="ingredients")


class RecipeStep(Base):
    __tablename__ = "recipe_steps"

    id: Mapped[int] = mapped_column(primary_key=True)
    recipe_id: Mapped[int] = mapped_column(ForeignKey("recipes.id", ondelete="CASCADE"), index=True, nullable=False)
    step_number: Mapped[int] = mapped_column(Integer, nullable=False)
    instruction: Mapped[str] = mapped_column(Text, nullable=False)

    recipe: Mapped[Recipe] = relationship(back_populates="steps")
