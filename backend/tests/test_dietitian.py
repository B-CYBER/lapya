from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from tests.conftest import (
    auth_headers,
    complete_onboarding,
    make_recipe,
    make_verified_dietitian,
    signup_and_get_token,
)


def _seed_recipes(db_session: Session) -> None:
    make_recipe(db_session, slug="b1", meal_type="breakfast")
    make_recipe(db_session, slug="l1", meal_type="lunch")
    make_recipe(db_session, slug="d1", meal_type="dinner")
    make_recipe(db_session, slug="s1", meal_type="snack")


def _invite_patient(
    client: TestClient, dietitian_token: str, email: str = "mama@example.com"
) -> str:
    response = client.post(
        "/api/dietitian/patients/invite",
        json={"email": email},
        headers=auth_headers(dietitian_token),
    )
    assert response.status_code == 201, response.text
    return response.json()["token"]


def _patient_id(client: TestClient, patient_token: str) -> int:
    return client.get("/api/auth/me", headers=auth_headers(patient_token)).json()["id"]


def test_dietitian_endpoints_require_verified_dietitian(
    client: TestClient, db_session: Session
) -> None:
    patient_token = signup_and_get_token(client)
    response = client.get("/api/dietitian/patients", headers=auth_headers(patient_token))
    assert response.status_code == 403


def test_unverified_dietitian_still_forbidden(
    client: TestClient, db_session: Session
) -> None:
    from app.models.user import User

    token = signup_and_get_token(client)
    user = db_session.query(User).filter_by(email="mama@example.com").one()
    user.role = "dietitian"
    user.dietitian_verified = False
    db_session.commit()

    response = client.get("/api/dietitian/patients", headers=auth_headers(token))
    assert response.status_code == 403


def test_list_patients_empty_when_no_relationships(
    client: TestClient, db_session: Session
) -> None:
    _seed_recipes(db_session)

    # Patient who has nothing to do with this dietitian still must not appear.
    patient_token = signup_and_get_token(client)
    complete_onboarding(client, patient_token)

    dietitian_token = make_verified_dietitian(client, db_session)
    response = client.get(
        "/api/dietitian/patients", headers=auth_headers(dietitian_token)
    )
    assert response.status_code == 200
    assert response.json() == []


def test_invite_and_accept_links_patient_to_dietitian(
    client: TestClient, db_session: Session
) -> None:
    _seed_recipes(db_session)
    patient_token = signup_and_get_token(client)
    complete_onboarding(client, patient_token)

    dietitian_token = make_verified_dietitian(client, db_session)
    invite_token = _invite_patient(client, dietitian_token, email="mama@example.com")

    # Patient accepts.
    response = client.post(
        f"/api/dietitian/patients/accept/{invite_token}",
        headers=auth_headers(patient_token),
    )
    assert response.status_code == 200, response.text
    body = response.json()
    assert body["status"] == "accepted"
    assert body["patientId"] == _patient_id(client, patient_token)

    # Dietitian now sees the patient.
    list_resp = client.get(
        "/api/dietitian/patients", headers=auth_headers(dietitian_token)
    )
    assert list_resp.status_code == 200
    rows = list_resp.json()
    assert len(rows) == 1
    assert rows[0]["firstName"] == "Mama"


def test_accept_rejects_self_invite(
    client: TestClient, db_session: Session
) -> None:
    dietitian_token = make_verified_dietitian(client, db_session)
    invite_token = _invite_patient(client, dietitian_token, email="doc@example.com")

    response = client.post(
        f"/api/dietitian/patients/accept/{invite_token}",
        headers=auth_headers(dietitian_token),
    )
    assert response.status_code == 400


def test_accept_rejects_unknown_token(
    client: TestClient, db_session: Session
) -> None:
    patient_token = signup_and_get_token(client)
    response = client.post(
        "/api/dietitian/patients/accept/bogus",
        headers=auth_headers(patient_token),
    )
    assert response.status_code == 404


def test_get_patient_forbidden_without_relationship(
    client: TestClient, db_session: Session
) -> None:
    _seed_recipes(db_session)
    patient_token = signup_and_get_token(client)
    complete_onboarding(client, patient_token)
    patient_id = _patient_id(client, patient_token)

    dietitian_token = make_verified_dietitian(client, db_session)
    response = client.get(
        f"/api/dietitian/patients/{patient_id}",
        headers=auth_headers(dietitian_token),
    )
    assert response.status_code == 403


def test_get_patient_returns_detail_after_accept(
    client: TestClient, db_session: Session
) -> None:
    _seed_recipes(db_session)
    patient_token = signup_and_get_token(client)
    complete_onboarding(client, patient_token)
    patient_id = _patient_id(client, patient_token)

    dietitian_token = make_verified_dietitian(client, db_session)
    invite_token = _invite_patient(client, dietitian_token)
    client.post(
        f"/api/dietitian/patients/accept/{invite_token}",
        headers=auth_headers(patient_token),
    )

    response = client.get(
        f"/api/dietitian/patients/{patient_id}",
        headers=auth_headers(dietitian_token),
    )
    assert response.status_code == 200
    body = response.json()
    assert body["patient"]["id"] == patient_id
    assert "weekPlan" in body


def test_edit_patient_meal_swaps_recipe_and_stamps_dietitian(
    client: TestClient, db_session: Session
) -> None:
    from app.models.meal_plan import MealPlanItem
    from app.models.recipe import Recipe

    _seed_recipes(db_session)
    patient_token = signup_and_get_token(client)
    complete_onboarding(client, patient_token)
    patient_id = _patient_id(client, patient_token)

    dietitian_token = make_verified_dietitian(client, db_session)
    invite_token = _invite_patient(client, dietitian_token)
    client.post(
        f"/api/dietitian/patients/accept/{invite_token}",
        headers=auth_headers(patient_token),
    )

    # Trigger week generation by hitting /today.
    today_resp = client.get("/api/dashboard/today", headers=auth_headers(patient_token))
    assert today_resp.status_code == 200

    item = (
        db_session.query(MealPlanItem)
        .filter(MealPlanItem.user_id == patient_id, MealPlanItem.meal_type == "lunch")
        .first()
    )
    assert item is not None

    # Find a different lunch recipe to swap to.
    other_lunch = (
        db_session.query(Recipe)
        .filter(Recipe.meal_type == "lunch", Recipe.id != item.recipe_id)
        .first()
    )
    if other_lunch is None:
        other_lunch = make_recipe(db_session, slug="l-alt", meal_type="lunch")

    response = client.patch(
        f"/api/dietitian/patients/{patient_id}/meals/{item.id}",
        json={"recipeId": other_lunch.id, "dietitianNote": "Lower sodium swap."},
        headers=auth_headers(dietitian_token),
    )
    assert response.status_code == 200, response.text
    body = response.json()
    assert body["recipe"]["id"] == other_lunch.id
    assert body["editedByDietitianName"] == "Doctor"
    assert body["dietitianNote"] == "Lower sodium swap."

    db_session.expire_all()
    refreshed = db_session.get(MealPlanItem, item.id)
    assert refreshed is not None
    assert refreshed.recipe_id == other_lunch.id
    assert refreshed.edited_by_dietitian_id is not None


def test_edit_patient_meal_forbidden_without_relationship(
    client: TestClient, db_session: Session
) -> None:
    from app.models.meal_plan import MealPlanItem

    _seed_recipes(db_session)
    patient_token = signup_and_get_token(client)
    complete_onboarding(client, patient_token)
    patient_id = _patient_id(client, patient_token)
    client.get("/api/dashboard/today", headers=auth_headers(patient_token))
    item = db_session.query(MealPlanItem).filter_by(user_id=patient_id).first()
    assert item is not None

    dietitian_token = make_verified_dietitian(client, db_session)
    response = client.patch(
        f"/api/dietitian/patients/{patient_id}/meals/{item.id}",
        json={"dietitianNote": "x"},
        headers=auth_headers(dietitian_token),
    )
    assert response.status_code == 403


def test_notes_create_and_list(client: TestClient, db_session: Session) -> None:
    _seed_recipes(db_session)
    patient_token = signup_and_get_token(client)
    complete_onboarding(client, patient_token)
    patient_id = _patient_id(client, patient_token)

    dietitian_token = make_verified_dietitian(client, db_session)
    invite_token = _invite_patient(client, dietitian_token)
    client.post(
        f"/api/dietitian/patients/accept/{invite_token}",
        headers=auth_headers(patient_token),
    )

    create_resp = client.post(
        f"/api/dietitian/patients/{patient_id}/notes",
        json={"body": "Cut down on salt this week."},
        headers=auth_headers(dietitian_token),
    )
    assert create_resp.status_code == 201, create_resp.text
    created = create_resp.json()
    assert created["body"] == "Cut down on salt this week."
    assert created["dietitianName"] == "Doctor"

    list_resp = client.get(
        f"/api/dietitian/patients/{patient_id}/notes",
        headers=auth_headers(dietitian_token),
    )
    assert list_resp.status_code == 200
    rows = list_resp.json()
    assert len(rows) == 1
    assert rows[0]["id"] == created["id"]


def test_notes_rejects_empty_body(client: TestClient, db_session: Session) -> None:
    _seed_recipes(db_session)
    patient_token = signup_and_get_token(client)
    complete_onboarding(client, patient_token)
    patient_id = _patient_id(client, patient_token)

    dietitian_token = make_verified_dietitian(client, db_session)
    invite_token = _invite_patient(client, dietitian_token)
    client.post(
        f"/api/dietitian/patients/accept/{invite_token}",
        headers=auth_headers(patient_token),
    )

    response = client.post(
        f"/api/dietitian/patients/{patient_id}/notes",
        json={"body": "   "},
        headers=auth_headers(dietitian_token),
    )
    assert response.status_code == 400


def test_revoke_relationship_removes_access(
    client: TestClient, db_session: Session
) -> None:
    _seed_recipes(db_session)
    patient_token = signup_and_get_token(client)
    complete_onboarding(client, patient_token)
    patient_id = _patient_id(client, patient_token)

    dietitian_token = make_verified_dietitian(client, db_session)
    invite_token = _invite_patient(client, dietitian_token)
    accept_resp = client.post(
        f"/api/dietitian/patients/accept/{invite_token}",
        headers=auth_headers(patient_token),
    )
    rel_id = accept_resp.json()["id"]

    revoke_resp = client.delete(
        f"/api/dietitian/patients/{rel_id}",
        headers=auth_headers(patient_token),
    )
    assert revoke_resp.status_code == 200
    assert revoke_resp.json()["status"] == "revoked"

    list_resp = client.get(
        "/api/dietitian/patients", headers=auth_headers(dietitian_token)
    )
    assert list_resp.json() == []

    detail_resp = client.get(
        f"/api/dietitian/patients/{patient_id}",
        headers=auth_headers(dietitian_token),
    )
    assert detail_resp.status_code == 403


def test_invite_records_email_in_relationship(
    client: TestClient, db_session: Session
) -> None:
    from app.models.dietitian import DietitianRelationship

    dietitian_token = make_verified_dietitian(client, db_session)
    _invite_patient(client, dietitian_token, email="Patient@Example.com")

    rel = db_session.query(DietitianRelationship).one()
    assert rel.invite_email == "patient@example.com"
    assert rel.status == "pending"
    assert rel.patient_id is None
