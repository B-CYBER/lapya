from datetime import date, timedelta

from fastapi.testclient import TestClient
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.meal_plan import MealPlanItem
from tests.conftest import auth_headers, complete_onboarding, make_recipe, signup_and_get_token


def _seed_minimal_recipes(db: Session) -> None:
    make_recipe(db, slug="b1", meal_type="breakfast")
    make_recipe(db, slug="l1", meal_type="lunch")
    make_recipe(db, slug="d1", meal_type="dinner")
    make_recipe(db, slug="s1", meal_type="snack")


def _monday() -> date:
    today = date.today()
    return today - timedelta(days=today.weekday())


def test_regenerate_produces_28_items(client: TestClient, db_session: Session) -> None:
    _seed_minimal_recipes(db_session)
    token = signup_and_get_token(client)
    complete_onboarding(client, token)

    response = client.post("/api/meal-plan/regenerate", headers=auth_headers(token))
    assert response.status_code == 200
    body = response.json()
    assert len(body["items"]) == 28
    assert body["weekStart"] == _monday().isoformat()


def test_regenerate_skips_avoid_recipes(client: TestClient, db_session: Session) -> None:
    # Safe lunch recipe + an avoid-for-kidney lunch recipe; only the safe one should appear.
    make_recipe(db_session, slug="b1", meal_type="breakfast")
    make_recipe(db_session, slug="dinner-x", meal_type="dinner")
    make_recipe(db_session, slug="snack-x", meal_type="snack")
    make_recipe(db_session, slug="safe-lunch", meal_type="lunch", condition_safety={"kidney": "safe"})
    make_recipe(
        db_session, slug="bad-lunch", meal_type="lunch", condition_safety={"kidney": "avoid"}
    )

    token = signup_and_get_token(client)
    complete_onboarding(client, token, conditions=[{"slug": "kidney", "severity": "Moderate"}])

    response = client.post("/api/meal-plan/regenerate", headers=auth_headers(token))
    lunch_slugs = {
        item["recipe"]["slug"] for item in response.json()["items"] if item["mealType"] == "lunch"
    }
    assert lunch_slugs == {"safe-lunch"}


def test_get_week_returns_empty_initially(client: TestClient, db_session: Session) -> None:
    token = signup_and_get_token(client)
    response = client.get("/api/meal-plan/week", headers=auth_headers(token))
    assert response.status_code == 200
    assert response.json()["items"] == []


def test_swap_item(client: TestClient, db_session: Session) -> None:
    _seed_minimal_recipes(db_session)
    make_recipe(db_session, slug="b2", meal_type="breakfast")
    token = signup_and_get_token(client)
    complete_onboarding(client, token)
    items = client.post("/api/meal-plan/regenerate", headers=auth_headers(token)).json()["items"]
    target = next(i for i in items if i["mealType"] == "breakfast")

    b2_id = db_session.scalar(select(MealPlanItem.recipe_id))  # unused; sanity-check the ORM access
    assert b2_id is not None

    b2_recipe_id = None
    from app.models.recipe import Recipe

    b2 = db_session.scalar(select(Recipe).where(Recipe.slug == "b2"))
    b2_recipe_id = b2.id

    swap = client.patch(
        f"/api/meal-plan/items/{target['id']}",
        json={"recipeId": b2_recipe_id},
        headers=auth_headers(token),
    )
    assert swap.status_code == 200
    assert swap.json()["recipe"]["slug"] == "b2"


def test_complete_item(client: TestClient, db_session: Session) -> None:
    _seed_minimal_recipes(db_session)
    token = signup_and_get_token(client)
    complete_onboarding(client, token)
    items = client.post("/api/meal-plan/regenerate", headers=auth_headers(token)).json()["items"]
    target = items[0]

    response = client.patch(
        f"/api/meal-plan/items/{target['id']}",
        json={"isCompleted": True},
        headers=auth_headers(token),
    )
    assert response.status_code == 200
    assert response.json()["isCompleted"] is True
    assert response.json()["completedAt"] is not None


def test_cannot_update_another_users_item(client: TestClient, db_session: Session) -> None:
    _seed_minimal_recipes(db_session)
    token_a = signup_and_get_token(client)
    complete_onboarding(client, token_a)
    items = client.post(
        "/api/meal-plan/regenerate", headers=auth_headers(token_a)
    ).json()["items"]
    target = items[0]

    token_b = signup_and_get_token(
        client,
        {"email": "other@example.com", "password": "secret123", "firstName": "B", "lastName": "B"},
    )
    response = client.patch(
        f"/api/meal-plan/items/{target['id']}",
        json={"isCompleted": True},
        headers=auth_headers(token_b),
    )
    assert response.status_code == 404
