"""Unit tests for the meal generator (bypasses the API)."""

from datetime import date, timedelta

from sqlalchemy.orm import Session

from app.models.user import User
from app.models.user_condition import UserCondition
from app.models.user_preferences import UserPreferences
from app.services.meal_generation import generate_week
from tests.conftest import make_recipe


def _make_user(db: Session, *, conditions: list[str] | None = None, foods: list[str] | None = None, region: str | None = None) -> User:
    user = User(
        email="gen@test.com",
        password_hash="x",
        first_name="Gen",
        last_name="Test",
    )
    db.add(user)
    db.flush()
    db.add(
        UserPreferences(
            user_id=user.id,
            display_name="Gen",
            foods=foods or [],
            allergies=None,
            region=region or "south-west",
            age=40,
            weight_kg=70.0,
        )
    )
    for slug in conditions or []:
        db.add(UserCondition(user_id=user.id, slug=slug, severity="Mild"))
    db.commit()
    db.refresh(user)
    return user


def test_generator_respects_avoid(db_session: Session) -> None:
    make_recipe(db_session, slug="safe-breakfast", meal_type="breakfast")
    make_recipe(db_session, slug="safe-lunch", meal_type="lunch", condition_safety={"diabetes": "safe"})
    make_recipe(db_session, slug="bad-lunch", meal_type="lunch", condition_safety={"diabetes": "avoid"})
    make_recipe(db_session, slug="safe-dinner", meal_type="dinner")
    make_recipe(db_session, slug="safe-snack", meal_type="snack")

    user = _make_user(db_session, conditions=["diabetes"])
    items = generate_week(user, db_session, date.today() - timedelta(days=date.today().weekday()))

    lunch_recipe_slugs = {item.recipe_id for item in items if item.meal_type == "lunch"}
    from app.models.recipe import Recipe

    bad_lunch = db_session.query(Recipe).filter_by(slug="bad-lunch").one()
    assert bad_lunch.id not in lunch_recipe_slugs


def test_generator_prefers_user_foods(db_session: Session) -> None:
    make_recipe(db_session, slug="liked", meal_type="lunch")
    make_recipe(db_session, slug="disliked", meal_type="lunch")
    # Single-meal-type generator coverage; fill other slots so the loop doesn't break.
    make_recipe(db_session, slug="b", meal_type="breakfast")
    make_recipe(db_session, slug="d", meal_type="dinner")
    make_recipe(db_session, slug="s", meal_type="snack")

    user = _make_user(db_session, foods=["liked"])
    items = generate_week(user, db_session, date.today() - timedelta(days=date.today().weekday()))

    from app.models.recipe import Recipe

    liked = db_session.query(Recipe).filter_by(slug="liked").one()
    # 'liked' should get picked at least once for lunch over the 7 days.
    lunch_recipe_ids = [item.recipe_id for item in items if item.meal_type == "lunch"]
    assert liked.id in lunch_recipe_ids
