from fastapi.testclient import TestClient

from tests.conftest import auth_headers, signup_and_get_token


def test_settings_defaults(client: TestClient) -> None:
    token = signup_and_get_token(client)
    response = client.get("/api/settings", headers=auth_headers(token))
    assert response.status_code == 200
    body = response.json()
    assert body["language"] == "en"
    assert body["phone"] is None
    assert body["notifMealReminders"] is True
    assert body["notifMarketing"] is False


def test_patch_settings_updates_fields(client: TestClient) -> None:
    token = signup_and_get_token(client)
    response = client.patch(
        "/api/settings",
        json={"phone": "08099887766", "language": "yo", "notifMarketing": True},
        headers=auth_headers(token),
    )
    assert response.status_code == 200
    body = response.json()
    assert body["phone"] == "08099887766"
    assert body["language"] == "yo"
    assert body["notifMarketing"] is True
