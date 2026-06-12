from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from tests.conftest import auth_headers, complete_onboarding, make_recipe, signup_and_get_token


def test_signup_seeds_welcome_pack(client: TestClient) -> None:
    token = signup_and_get_token(client)
    response = client.get("/api/notifications", headers=auth_headers(token))
    assert response.status_code == 200
    items = response.json()
    assert len(items) == 2
    kinds = {n["kind"] for n in items}
    assert kinds == {"welcome", "reminder"}


def test_mark_read_flips_flag(client: TestClient) -> None:
    token = signup_and_get_token(client)
    item_id = client.get("/api/notifications", headers=auth_headers(token)).json()[0]["id"]

    response = client.patch(
        f"/api/notifications/{item_id}/read", headers=auth_headers(token)
    )
    assert response.status_code == 200
    assert response.json()["isRead"] is True


def test_mark_all_read(client: TestClient) -> None:
    token = signup_and_get_token(client)
    client.post("/api/notifications/mark-all-read", headers=auth_headers(token))
    unread = client.get("/api/notifications?unread=true", headers=auth_headers(token)).json()
    assert unread == []


def test_meal_completion_emits_success_notification(
    client: TestClient, db_session: Session
) -> None:
    make_recipe(db_session, slug="b1", meal_type="breakfast")
    make_recipe(db_session, slug="l1", meal_type="lunch")
    make_recipe(db_session, slug="d1", meal_type="dinner")
    make_recipe(db_session, slug="s1", meal_type="snack")

    token = signup_and_get_token(client)
    complete_onboarding(client, token)
    items = client.post(
        "/api/meal-plan/regenerate", headers=auth_headers(token)
    ).json()["items"]

    before = len(client.get("/api/notifications", headers=auth_headers(token)).json())
    client.patch(
        f"/api/meal-plan/items/{items[0]['id']}",
        json={"isCompleted": True},
        headers=auth_headers(token),
    )
    after = client.get("/api/notifications", headers=auth_headers(token)).json()
    assert len(after) == before + 1
    assert after[0]["kind"] == "success"
