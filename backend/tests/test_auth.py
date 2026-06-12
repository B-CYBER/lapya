from fastapi.testclient import TestClient

from tests.conftest import SIGNUP_PAYLOAD


def test_signup_happy_path(client: TestClient) -> None:
    response = client.post("/api/auth/signup", json=SIGNUP_PAYLOAD)

    assert response.status_code == 201
    body = response.json()
    assert "accessToken" in body
    user = body["user"]
    assert user["email"] == SIGNUP_PAYLOAD["email"]
    assert user["firstName"] == SIGNUP_PAYLOAD["firstName"]
    assert user["lastName"] == SIGNUP_PAYLOAD["lastName"]
    assert user["role"] == "patient"
    assert user["dietitianVerified"] is False
    assert user["isEmailVerified"] is False
    assert user["onboardingCompletedAt"] is None
    assert user["language"] == "en"


def test_signup_duplicate_email_returns_409(client: TestClient) -> None:
    client.post("/api/auth/signup", json=SIGNUP_PAYLOAD)
    response = client.post("/api/auth/signup", json=SIGNUP_PAYLOAD)

    assert response.status_code == 409
    assert response.json() == {
        "error": "email_taken",
        "message": "An account with this email already exists.",
    }


def test_login_happy_path(client: TestClient) -> None:
    client.post("/api/auth/signup", json=SIGNUP_PAYLOAD)

    response = client.post(
        "/api/auth/login",
        json={"email": SIGNUP_PAYLOAD["email"], "password": SIGNUP_PAYLOAD["password"]},
    )

    assert response.status_code == 200
    body = response.json()
    assert "accessToken" in body
    assert body["user"]["email"] == SIGNUP_PAYLOAD["email"]


def test_login_wrong_password_returns_401(client: TestClient) -> None:
    client.post("/api/auth/signup", json=SIGNUP_PAYLOAD)

    response = client.post(
        "/api/auth/login",
        json={"email": SIGNUP_PAYLOAD["email"], "password": "wrong"},
    )

    assert response.status_code == 401
    assert response.json()["error"] == "invalid_credentials"


def test_me_without_token_returns_401(client: TestClient) -> None:
    response = client.get("/api/auth/me")

    assert response.status_code == 401
    assert response.json()["error"] == "not_authenticated"


def test_me_with_token_returns_user(client: TestClient) -> None:
    signup_response = client.post("/api/auth/signup", json=SIGNUP_PAYLOAD)
    token = signup_response.json()["accessToken"]

    response = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 200
    user = response.json()
    assert user["email"] == SIGNUP_PAYLOAD["email"]
    assert user["role"] == "patient"
    assert user["isEmailVerified"] is False
    assert user["onboardingCompletedAt"] is None


def test_verify_email_flips_flag(client: TestClient, monkeypatch) -> None:
    from app.routers import auth as auth_router

    monkeypatch.setattr(auth_router, "_generate_otp", lambda: "123456")

    signup_response = client.post("/api/auth/signup", json=SIGNUP_PAYLOAD)
    token = signup_response.json()["accessToken"]

    verify_response = client.post(
        "/api/auth/verify-email",
        json={"otp": "123456"},
        headers={"Authorization": f"Bearer {token}"},
    )

    assert verify_response.status_code == 200, verify_response.text
    assert verify_response.json()["isEmailVerified"] is True


def test_verify_email_rejects_wrong_otp(client: TestClient, monkeypatch) -> None:
    from app.routers import auth as auth_router

    monkeypatch.setattr(auth_router, "_generate_otp", lambda: "123456")

    signup_response = client.post("/api/auth/signup", json=SIGNUP_PAYLOAD)
    token = signup_response.json()["accessToken"]

    response = client.post(
        "/api/auth/verify-email",
        json={"otp": "999999"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 401
    assert response.json()["error"] == "invalid_otp"


def test_forgot_password_returns_generic_message(client: TestClient) -> None:
    response = client.post("/api/auth/forgot-password", json={"email": "nobody@example.com"})

    assert response.status_code == 200
    assert "If that email" in response.json()["message"]
