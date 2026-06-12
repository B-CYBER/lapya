from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from tests.conftest import auth_headers, complete_onboarding, signup_and_get_token


def test_get_profile_returns_derived_stats(client: TestClient) -> None:
    token = signup_and_get_token(client)
    complete_onboarding(client, token)

    response = client.get("/api/profile", headers=auth_headers(token))
    assert response.status_code == 200
    body = response.json()
    assert body["user"]["email"] == "mama@example.com"
    assert body["displayName"] == "Mama"
    assert body["streakDays"] == 0
    assert body["mealsLogged"] == 0
    assert body["adherencePct"] == 0


def test_patch_profile_updates_display_name_and_conditions(
    client: TestClient, db_session: Session
) -> None:
    token = signup_and_get_token(client)
    complete_onboarding(client, token)

    response = client.patch(
        "/api/profile",
        json={
            "displayName": "Bola Updated",
            "conditions": [{"slug": "kidney", "severity": "Severe"}],
        },
        headers=auth_headers(token),
    )
    assert response.status_code == 200
    body = response.json()
    assert body["displayName"] == "Bola Updated"
    assert len(body["conditions"]) == 1
    assert body["conditions"][0]["slug"] == "kidney"


def test_change_password_happy_path(client: TestClient) -> None:
    token = signup_and_get_token(client)
    response = client.post(
        "/api/profile/password",
        json={"currentPassword": "secret123", "newPassword": "newpassword"},
        headers=auth_headers(token),
    )
    assert response.status_code == 200
    login = client.post(
        "/api/auth/login",
        json={"email": "mama@example.com", "password": "newpassword"},
    )
    assert login.status_code == 200


def test_change_password_rejects_wrong_current(client: TestClient) -> None:
    token = signup_and_get_token(client)
    response = client.post(
        "/api/profile/password",
        json={"currentPassword": "wrong", "newPassword": "newpassword"},
        headers=auth_headers(token),
    )
    assert response.status_code == 401
