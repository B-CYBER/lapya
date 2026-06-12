from fastapi.testclient import TestClient
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.waitlist import WaitlistEntry


def test_waitlist_happy_path(client: TestClient, db_session: Session) -> None:
    response = client.post(
        "/api/waitlist", json={"email": "a@b.com", "role": "dietitian"}
    )
    assert response.status_code == 200
    assert "list" in response.json()["message"].lower()

    row = db_session.scalar(select(WaitlistEntry).where(WaitlistEntry.email == "a@b.com"))
    assert row is not None
    assert row.role == "dietitian"


def test_waitlist_upsert_updates_role(client: TestClient, db_session: Session) -> None:
    client.post("/api/waitlist", json={"email": "a@b.com", "role": "patient"})
    client.post("/api/waitlist", json={"email": "a@b.com", "role": "caregiver"})

    rows = db_session.scalars(select(WaitlistEntry)).all()
    assert len(rows) == 1
    assert rows[0].role == "caregiver"


def test_waitlist_rejects_unknown_role(client: TestClient) -> None:
    response = client.post(
        "/api/waitlist", json={"email": "a@b.com", "role": "investor"}
    )
    assert response.status_code == 422
