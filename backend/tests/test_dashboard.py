from datetime import date, timedelta

from fastapi.testclient import TestClient
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.meal_plan import MealPlanItem
from tests.conftest import auth_headers, complete_onboarding, make_recipe, signup_and_get_token


def _seed_recipes(db: Session) -> None:
    make_recipe(db, slug="b1", meal_type="breakfast")
    make_recipe(db, slug="l1", meal_type="lunch")
    make_recipe(db, slug="d1", meal_type="dinner")
    make_recipe(db, slug="s1", meal_type="snack")


def test_today_returns_user_meals_and_tip(client: TestClient, db_session: Session) -> None:
    _seed_recipes(db_session)
    token = signup_and_get_token(client)
    complete_onboarding(client, token)

    response = client.get("/api/dashboard/today", headers=auth_headers(token))
    assert response.status_code == 200
    body = response.json()
    assert body["user"]["email"] == "mama@example.com"
    assert len(body["todaysMeals"]) == 4
    assert body["streakDays"] == 0
    assert isinstance(body["tip"], str) and body["tip"]


def test_today_auto_generates_week_on_first_call(
    client: TestClient, db_session: Session
) -> None:
    _seed_recipes(db_session)
    token = signup_and_get_token(client)
    complete_onboarding(client, token)

    client.get("/api/dashboard/today", headers=auth_headers(token))

    items = db_session.scalars(select(MealPlanItem)).all()
    assert len(items) == 28


def test_streak_reflects_completed_meals(client: TestClient, db_session: Session) -> None:
    _seed_recipes(db_session)
    token = signup_and_get_token(client)
    complete_onboarding(client, token)
    # Generate the week first so today's items exist.
    client.get("/api/dashboard/today", headers=auth_headers(token))

    # Mark today's first meal completed.
    todays_meal_id = db_session.scalar(
        select(MealPlanItem.id).where(MealPlanItem.date == date.today()).order_by(MealPlanItem.id)
    )
    client.patch(
        f"/api/meal-plan/items/{todays_meal_id}",
        json={"isCompleted": True},
        headers=auth_headers(token),
    )

    response = client.get("/api/dashboard/today", headers=auth_headers(token))
    assert response.json()["streakDays"] == 1


def test_streak_breaks_on_a_gap(client: TestClient, db_session: Session) -> None:
    _seed_recipes(db_session)
    token = signup_and_get_token(client)
    complete_onboarding(client, token)
    client.get("/api/dashboard/today", headers=auth_headers(token))

    today = date.today()
    # Mark items completed for today and 2 days ago — but not yesterday — so the streak is 1.
    items_today = db_session.scalars(
        select(MealPlanItem).where(MealPlanItem.date == today)
    ).all()
    items_minus_two = db_session.scalars(
        select(MealPlanItem).where(MealPlanItem.date == today - timedelta(days=2))
    ).all()
    for item in items_today + items_minus_two:
        item.is_completed = True
    db_session.commit()

    response = client.get("/api/dashboard/today", headers=auth_headers(token))
    assert response.json()["streakDays"] == 1
