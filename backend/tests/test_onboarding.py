from fastapi.testclient import TestClient
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.user_condition import UserCondition
from app.models.user_preferences import UserPreferences
from tests.conftest import SIGNUP_PAYLOAD


def _signup_and_get_token(client: TestClient) -> str:
    response = client.post("/api/auth/signup", json=SIGNUP_PAYLOAD)
    assert response.status_code == 201
    return response.json()["accessToken"]


def _full_payload(**overrides) -> dict:
    payload = {
        "role": "patient",
        "displayName": "Mama",
        "conditions": [
            {"slug": "diabetes", "severity": "Moderate"},
            {"slug": "hypertension", "severity": "Mild"},
        ],
        "foods": ["jollof", "eba"],
        "allergies": "peanuts",
        "region": "south-west",
        "age": 45,
        "weightKg": 72.5,
        "lastBpCheck": "2026-05-01",
        "bpSystolic": 130,
        "bpDiastolic": 85,
    }
    payload.update(overrides)
    return payload


def test_complete_onboarding_seeds_health_metrics(
    client: TestClient, db_session: Session
) -> None:
    from app.models.health_metric import HealthMetric

    token = _signup_and_get_token(client)
    client.post(
        "/api/onboarding/complete",
        json=_full_payload(),  # includes weight 72.5 + BP 130/85
        headers={"Authorization": f"Bearer {token}"},
    )

    metrics = db_session.query(HealthMetric).all()
    types = {m.metric_type for m in metrics}
    assert types == {"weight", "blood_pressure"}


def test_complete_onboarding_happy_path(client: TestClient, db_session: Session) -> None:
    token = _signup_and_get_token(client)

    response = client.post(
        "/api/onboarding/complete",
        json=_full_payload(),
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200
    user = response.json()
    assert user["role"] == "patient"
    assert user["onboardingCompletedAt"] is not None

    prefs = db_session.scalar(select(UserPreferences).where(UserPreferences.user_id == user["id"]))
    assert prefs is not None
    assert prefs.display_name == "Mama"
    assert prefs.region == "south-west"
    assert prefs.foods == ["jollof", "eba"]
    assert prefs.age == 45
    assert prefs.weight_kg == 72.5
    assert prefs.bp_systolic == 130
    assert prefs.bp_diastolic == 85

    conditions = db_session.scalars(
        select(UserCondition).where(UserCondition.user_id == user["id"])
    ).all()
    assert len(conditions) == 2
    slugs = {c.slug for c in conditions}
    assert slugs == {"diabetes", "hypertension"}


def test_complete_onboarding_is_idempotent_and_replaces_conditions(
    client: TestClient, db_session: Session
) -> None:
    token = _signup_and_get_token(client)
    headers = {"Authorization": f"Bearer {token}"}

    client.post("/api/onboarding/complete", json=_full_payload(), headers=headers)

    response = client.post(
        "/api/onboarding/complete",
        json=_full_payload(
            role="caregiver",
            conditions=[{"slug": "kidney", "severity": "Severe"}],
            displayName="Bola",
            age=50,
        ),
        headers=headers,
    )

    assert response.status_code == 200
    assert response.json()["role"] == "caregiver"

    user_id = response.json()["id"]
    conditions = db_session.scalars(
        select(UserCondition).where(UserCondition.user_id == user_id)
    ).all()
    assert len(conditions) == 1
    assert conditions[0].slug == "kidney"

    prefs = db_session.scalar(select(UserPreferences).where(UserPreferences.user_id == user_id))
    assert prefs is not None
    assert prefs.display_name == "Bola"
    assert prefs.age == 50


def test_complete_onboarding_requires_auth(client: TestClient) -> None:
    response = client.post("/api/onboarding/complete", json=_full_payload())
    assert response.status_code == 401


def test_complete_onboarding_rejects_unknown_condition_slug(client: TestClient) -> None:
    token = _signup_and_get_token(client)
    response = client.post(
        "/api/onboarding/complete",
        json=_full_payload(conditions=[{"slug": "bogus", "severity": "Moderate"}]),
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 422


def test_complete_onboarding_rejects_unknown_severity(client: TestClient) -> None:
    token = _signup_and_get_token(client)
    response = client.post(
        "/api/onboarding/complete",
        json=_full_payload(conditions=[{"slug": "diabetes", "severity": "Catastrophic"}]),
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 422


def test_complete_onboarding_rejects_out_of_range_age(client: TestClient) -> None:
    token = _signup_and_get_token(client)
    response = client.post(
        "/api/onboarding/complete",
        json=_full_payload(age=200),
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 422


def test_complete_onboarding_rejects_admin_role(client: TestClient) -> None:
    token = _signup_and_get_token(client)
    response = client.post(
        "/api/onboarding/complete",
        json=_full_payload(role="admin"),
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 422


def test_dietitian_onboarding_skips_conditions_and_prefs(
    client: TestClient, db_session: Session
) -> None:
    token = _signup_and_get_token(client)
    response = client.post(
        "/api/onboarding/complete",
        json={"role": "dietitian", "displayName": "Dr. Adaobi"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200, response.text
    user = response.json()
    assert user["role"] == "dietitian"
    assert user["onboardingCompletedAt"] is not None

    prefs = db_session.scalar(
        select(UserPreferences).where(UserPreferences.user_id == user["id"])
    )
    assert prefs is None

    conditions = db_session.scalars(
        select(UserCondition).where(UserCondition.user_id == user["id"])
    ).all()
    assert conditions == []


def test_patient_onboarding_still_requires_conditions(client: TestClient) -> None:
    token = _signup_and_get_token(client)
    response = client.post(
        "/api/onboarding/complete",
        json={"role": "patient", "displayName": "Mama"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 422
