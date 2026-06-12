from fastapi.testclient import TestClient

from tests.conftest import auth_headers, signup_and_get_token


def test_create_and_list_weight_metric(client: TestClient) -> None:
    token = signup_and_get_token(client)
    create = client.post(
        "/api/health/metrics",
        json={"type": "weight", "value": 72.5},
        headers=auth_headers(token),
    )
    assert create.status_code == 201
    assert create.json()["unit"] == "kg"
    assert create.json()["valueSecondary"] is None

    listed = client.get("/api/health/metrics?type=weight", headers=auth_headers(token))
    assert listed.status_code == 200
    assert len(listed.json()) == 1


def test_bp_stores_both_values(client: TestClient) -> None:
    token = signup_and_get_token(client)
    response = client.post(
        "/api/health/metrics",
        json={"type": "blood_pressure", "value": 128, "valueSecondary": 82},
        headers=auth_headers(token),
    )
    assert response.status_code == 201
    body = response.json()
    assert body["unit"] == "mmHg"
    assert body["value"] == 128
    assert body["valueSecondary"] == 82


def test_metrics_isolated_per_user(client: TestClient) -> None:
    token_a = signup_and_get_token(client)
    client.post(
        "/api/health/metrics",
        json={"type": "weight", "value": 72.5},
        headers=auth_headers(token_a),
    )
    token_b = signup_and_get_token(
        client,
        {"email": "b@example.com", "password": "secret123", "firstName": "B", "lastName": "B"},
    )
    listed = client.get("/api/health/metrics", headers=auth_headers(token_b))
    assert listed.status_code == 200
    assert listed.json() == []
