from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from tests.conftest import auth_headers, complete_onboarding, make_recipe, signup_and_get_token


def test_list_recipes_returns_only_meal_type(client: TestClient, db_session: Session) -> None:
    make_recipe(db_session, slug="b1", meal_type="breakfast")
    make_recipe(db_session, slug="l1", meal_type="lunch")
    make_recipe(db_session, slug="d1", meal_type="dinner")

    token = signup_and_get_token(client)

    response = client.get("/api/recipes?mealType=breakfast", headers=auth_headers(token))
    assert response.status_code == 200
    slugs = [r["slug"] for r in response.json()]
    assert slugs == ["b1"]


def test_recipe_detail_returns_ingredients_and_steps(
    client: TestClient, db_session: Session
) -> None:
    make_recipe(
        db_session,
        slug="x",
        ingredients=[("Yam", "1 tuber", "grains", 50000), ("Salt", "pinch", "essentials", 0)],
    )
    token = signup_and_get_token(client)
    response = client.get("/api/recipes/1", headers=auth_headers(token))
    assert response.status_code == 200
    body = response.json()
    assert len(body["ingredients"]) == 2
    assert body["ingredients"][0]["item"] == "Yam"
    assert len(body["steps"]) == 1


def test_recipe_safety_is_filtered_to_user_conditions(
    client: TestClient, db_session: Session
) -> None:
    make_recipe(
        db_session,
        slug="x",
        condition_safety={"diabetes": "safe", "hypertension": "caution", "kidney": "avoid"},
    )
    token = signup_and_get_token(client)
    complete_onboarding(
        client,
        token,
        conditions=[
            {"slug": "diabetes", "severity": "Mild"},
            {"slug": "hypertension", "severity": "Mild"},
        ],
    )

    response = client.get("/api/recipes/1", headers=auth_headers(token))
    safety = response.json()["conditionSafety"]
    assert safety == {"diabetes": "safe", "hypertension": "caution"}


def test_recipe_detail_not_found(client: TestClient) -> None:
    token = signup_and_get_token(client)
    response = client.get("/api/recipes/9999", headers=auth_headers(token))
    assert response.status_code == 404
    assert response.json()["error"] == "recipe_not_found"
