from fastapi.testclient import TestClient

from tests.conftest import (
    auth_headers,
    complete_onboarding,
    make_recipe,
    signup_and_get_token,
    signup_second_user,
)


def _invite(client: TestClient, token: str, email: str = "chioma@example.com") -> dict:
    response = client.post(
        "/api/caregivers/invite",
        json={"email": email, "relationship": "Daughter"},
        headers=auth_headers(token),
    )
    assert response.status_code == 201, response.text
    return response.json()


def test_invite_creates_pending_relationship(client: TestClient) -> None:
    token = signup_and_get_token(client)
    body = _invite(client, token)
    assert body["token"]
    assert "/care-circle/accept" in body["inviteUrl"]

    listed = client.get("/api/caregivers", headers=auth_headers(token)).json()
    assert len(listed) == 1
    assert listed[0]["status"] == "pending"


def test_caregiver_accepts_invite(client: TestClient) -> None:
    patient_token = signup_and_get_token(client)
    invite = _invite(client, patient_token)

    caregiver_token, _ = signup_second_user(client)
    accept = client.post(
        f"/api/caregivers/accept/{invite['token']}",
        headers=auth_headers(caregiver_token),
    )
    assert accept.status_code == 200
    assert accept.json()["status"] == "accepted"

    my_patients = client.get("/api/patients", headers=auth_headers(caregiver_token)).json()
    assert len(my_patients) == 1


def test_patient_cannot_accept_own_invite(client: TestClient) -> None:
    token = signup_and_get_token(client)
    invite = _invite(client, token)
    response = client.post(
        f"/api/caregivers/accept/{invite['token']}", headers=auth_headers(token)
    )
    assert response.status_code == 400
    assert response.json()["error"] == "self_invite"


def test_double_accept_returns_409(client: TestClient) -> None:
    patient_token = signup_and_get_token(client)
    invite = _invite(client, patient_token)

    caregiver_a_token, _ = signup_second_user(client, email="a@example.com")
    client.post(
        f"/api/caregivers/accept/{invite['token']}", headers=auth_headers(caregiver_a_token)
    )

    caregiver_b_token, _ = signup_second_user(client, email="b@example.com")
    response = client.post(
        f"/api/caregivers/accept/{invite['token']}", headers=auth_headers(caregiver_b_token)
    )
    assert response.status_code == 409


def test_invalid_token_returns_404(client: TestClient) -> None:
    caregiver_token, _ = signup_second_user(client, email="cg@example.com")
    response = client.post(
        "/api/caregivers/accept/nope", headers=auth_headers(caregiver_token)
    )
    assert response.status_code == 404


def test_caregiver_home_requires_active_relationship(client: TestClient) -> None:
    patient_token = signup_and_get_token(client)
    patient_id = client.get("/api/auth/me", headers=auth_headers(patient_token)).json()["id"]

    caregiver_token, _ = signup_second_user(client)
    response = client.get(
        f"/api/caregiver/patients/{patient_id}/home", headers=auth_headers(caregiver_token)
    )
    assert response.status_code == 403


def test_caregiver_home_returns_payload(client: TestClient, db_session) -> None:
    make_recipe(db_session, slug="b1", meal_type="breakfast")
    make_recipe(db_session, slug="l1", meal_type="lunch")
    make_recipe(db_session, slug="d1", meal_type="dinner")
    make_recipe(db_session, slug="s1", meal_type="snack")

    patient_token = signup_and_get_token(client)
    patient_id = client.get("/api/auth/me", headers=auth_headers(patient_token)).json()["id"]
    complete_onboarding(client, patient_token)
    client.get("/api/dashboard/today", headers=auth_headers(patient_token))  # generates the week

    invite = _invite(client, patient_token)
    caregiver_token, _ = signup_second_user(client)
    client.post(
        f"/api/caregivers/accept/{invite['token']}", headers=auth_headers(caregiver_token)
    )

    response = client.get(
        f"/api/caregiver/patients/{patient_id}/home", headers=auth_headers(caregiver_token)
    )
    assert response.status_code == 200
    body = response.json()
    assert body["patient"]["id"] == patient_id
    assert len(body["todaysMeals"]) == 4
    assert "recentMetrics" in body


def test_revoke_flips_status(client: TestClient) -> None:
    patient_token = signup_and_get_token(client)
    invite = _invite(client, patient_token)
    relationship_id = client.get(
        "/api/caregivers", headers=auth_headers(patient_token)
    ).json()[0]["id"]

    response = client.delete(
        f"/api/caregivers/{relationship_id}", headers=auth_headers(patient_token)
    )
    assert response.status_code == 200
    assert response.json()["status"] == "revoked"
    _ = invite
