from fastapi.testclient import TestClient

from tests.conftest import auth_headers, signup_and_get_token


def test_signup_default_plan_is_free(client: TestClient) -> None:
    token = signup_and_get_token(client)
    me = client.get("/api/auth/me", headers=auth_headers(token)).json()
    assert me["plan"] == "free"


def test_subscription_starts_null(client: TestClient) -> None:
    token = signup_and_get_token(client)
    response = client.get("/api/subscription", headers=auth_headers(token))
    assert response.status_code == 200
    assert response.json() is None


def test_checkout_activates_care_plan(client: TestClient) -> None:
    token = signup_and_get_token(client)
    response = client.post(
        "/api/subscription/checkout",
        json={"plan": "care", "billingPeriod": "monthly"},
        headers=auth_headers(token),
    )
    assert response.status_code == 200
    body = response.json()
    assert body["plan"] == "care"
    assert body["status"] == "active"

    me = client.get("/api/auth/me", headers=auth_headers(token)).json()
    assert me["plan"] == "care"


def test_checkout_can_switch_to_family(client: TestClient) -> None:
    token = signup_and_get_token(client)
    client.post(
        "/api/subscription/checkout",
        json={"plan": "care", "billingPeriod": "monthly"},
        headers=auth_headers(token),
    )
    response = client.post(
        "/api/subscription/checkout",
        json={"plan": "family", "billingPeriod": "annual"},
        headers=auth_headers(token),
    )
    assert response.json()["plan"] == "family"
    assert response.json()["billingPeriod"] == "annual"
