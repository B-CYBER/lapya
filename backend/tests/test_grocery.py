from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from tests.conftest import auth_headers, complete_onboarding, make_recipe, signup_and_get_token


def _seed(db: Session) -> None:
    make_recipe(
        db,
        slug="b1",
        meal_type="breakfast",
        ingredients=[("Egg", "1", "proteins", 17500), ("Bread", "2 slices", "grains", 30000)],
    )
    make_recipe(
        db,
        slug="l1",
        meal_type="lunch",
        ingredients=[
            ("Brown rice", "1 cup", "grains", 50000),
            ("Egg", "1", "proteins", 17500),
        ],
    )
    make_recipe(
        db, slug="d1", meal_type="dinner",
        ingredients=[("Spinach", "1 bunch", "vegetables", 20000)],
    )
    make_recipe(
        db, slug="s1", meal_type="snack",
        ingredients=[("Orange", "1", "fruits", 8000)],
    )


def test_grocery_list_auto_aggregates_on_first_fetch(
    client: TestClient, db_session: Session
) -> None:
    _seed(db_session)
    token = signup_and_get_token(client)
    complete_onboarding(client, token)
    client.post("/api/meal-plan/regenerate", headers=auth_headers(token))

    response = client.get("/api/grocery-list", headers=auth_headers(token))
    assert response.status_code == 200
    body = response.json()
    assert body["items"], "expected non-empty grocery list"
    slugs = {item["slug"] for item in body["items"]}
    assert "egg" in slugs
    assert "brown-rice" in slugs


def test_grocery_list_dedupes_by_slug_and_sums_naira(
    client: TestClient, db_session: Session
) -> None:
    _seed(db_session)
    token = signup_and_get_token(client)
    complete_onboarding(client, token)
    client.post("/api/meal-plan/regenerate", headers=auth_headers(token))

    body = client.get("/api/grocery-list", headers=auth_headers(token)).json()
    egg = next(i for i in body["items"] if i["slug"] == "egg")
    # Egg appears in both breakfast (17,500) and lunch (17,500); each used 7 times in the
    # generated week (one per day). Total should equal 14 × 17,500.
    assert egg["nairaKobo"] == 14 * 17500


def test_toggle_grocery_item(client: TestClient, db_session: Session) -> None:
    _seed(db_session)
    token = signup_and_get_token(client)
    complete_onboarding(client, token)
    client.post("/api/meal-plan/regenerate", headers=auth_headers(token))
    item = client.get("/api/grocery-list", headers=auth_headers(token)).json()["items"][0]

    response = client.patch(
        f"/api/grocery-list/items/{item['id']}",
        json={"isChecked": True},
        headers=auth_headers(token),
    )
    assert response.status_code == 200
    assert response.json()["isChecked"] is True


def test_regenerate_meal_plan_clears_grocery_list(
    client: TestClient, db_session: Session
) -> None:
    _seed(db_session)
    token = signup_and_get_token(client)
    complete_onboarding(client, token)
    client.post("/api/meal-plan/regenerate", headers=auth_headers(token))
    first_fetch = client.get("/api/grocery-list", headers=auth_headers(token)).json()
    item_id_before = first_fetch["items"][0]["id"]

    client.patch(
        f"/api/grocery-list/items/{item_id_before}",
        json={"isChecked": True},
        headers=auth_headers(token),
    )
    client.post("/api/meal-plan/regenerate", headers=auth_headers(token))

    after = client.get("/api/grocery-list", headers=auth_headers(token)).json()
    assert all(not item["isChecked"] for item in after["items"])
