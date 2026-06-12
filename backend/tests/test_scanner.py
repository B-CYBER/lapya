from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from tests.conftest import auth_headers, complete_onboarding, make_recipe, signup_and_get_token


PNG_1PX = (
    b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08"
    b"\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc\xf8\xcf\xc0\x00\x00"
    b"\x00\x03\x00\x01\x6d\xc2\x00\xa6\x00\x00\x00\x00IEND\xaeB`\x82"
)


def _file_arg(name: str = "dish.png", mime: str = "image/png") -> dict:
    return {"image": (name, PNG_1PX, mime)}


def test_scan_without_image_falls_back_to_random(
    client: TestClient, db_session: Session
) -> None:
    """Legacy dev path — no key, no image: random recipe at 94%."""
    make_recipe(db_session, slug="jollof", meal_type="lunch")
    token = signup_and_get_token(client)
    complete_onboarding(client, token)

    response = client.post("/api/scanner/scan", headers=auth_headers(token))
    assert response.status_code == 201
    body = response.json()
    assert body["recipe"]["slug"] == "jollof"
    assert body["confidence"] == 94


def test_scan_with_no_recipes_returns_409(client: TestClient) -> None:
    token = signup_and_get_token(client)
    response = client.post("/api/scanner/scan", headers=auth_headers(token))
    assert response.status_code == 409
    assert response.json()["error"] == "no_recipes"


def test_scan_history_returns_most_recent_first(
    client: TestClient, db_session: Session
) -> None:
    make_recipe(db_session, slug="jollof", meal_type="lunch")
    token = signup_and_get_token(client)
    client.post("/api/scanner/scan", headers=auth_headers(token))
    client.post("/api/scanner/scan", headers=auth_headers(token))

    response = client.get("/api/scanner/history", headers=auth_headers(token))
    assert response.status_code == 200
    assert len(response.json()) == 2


def test_scan_with_image_uses_ai_match(
    client: TestClient, db_session: Session, monkeypatch
) -> None:
    from app.routers import scanner as scanner_router
    from app.services import scanner_ai

    make_recipe(db_session, slug="jollof", meal_type="lunch")
    make_recipe(db_session, slug="eba", meal_type="dinner")
    token = signup_and_get_token(client)
    complete_onboarding(client, token)

    monkeypatch.setattr(
        scanner_router.scanner_ai, "identify_food", lambda b, m, r: ("eba", 88)
    )
    _ = scanner_ai  # silence unused import warning

    response = client.post(
        "/api/scanner/scan",
        headers=auth_headers(token),
        files=_file_arg(),
    )
    assert response.status_code == 201
    body = response.json()
    assert body["recipe"]["slug"] == "eba"
    assert body["confidence"] == 88


def test_scan_persists_scan_result(
    client: TestClient, db_session: Session, monkeypatch
) -> None:
    from app.models.scan import ScanResult
    from app.routers import scanner as scanner_router

    make_recipe(db_session, slug="jollof", meal_type="lunch")
    token = signup_and_get_token(client)
    complete_onboarding(client, token)

    monkeypatch.setattr(
        scanner_router.scanner_ai, "identify_food", lambda b, m, r: ("jollof", 92)
    )

    client.post(
        "/api/scanner/scan", headers=auth_headers(token), files=_file_arg()
    )

    row = db_session.query(ScanResult).one()
    assert row.confidence == 92
    assert row.recipe.slug == "jollof"


def test_scan_low_confidence_returns_zero(
    client: TestClient, db_session: Session, monkeypatch
) -> None:
    from app.routers import scanner as scanner_router

    make_recipe(db_session, slug="jollof", meal_type="lunch")
    token = signup_and_get_token(client)

    # AI couldn't confidently identify — scanner_ai returns (None, 0).
    monkeypatch.setattr(
        scanner_router.scanner_ai, "identify_food", lambda b, m, r: (None, 0)
    )

    response = client.post(
        "/api/scanner/scan",
        headers=auth_headers(token),
        files=_file_arg(),
    )
    assert response.status_code == 201
    assert response.json()["confidence"] == 0


def test_scan_rejects_non_image_upload(
    client: TestClient, db_session: Session
) -> None:
    make_recipe(db_session, slug="jollof", meal_type="lunch")
    token = signup_and_get_token(client)

    response = client.post(
        "/api/scanner/scan",
        headers=auth_headers(token),
        files={"image": ("notes.txt", b"hello", "text/plain")},
    )
    assert response.status_code == 415
    assert response.json()["error"] == "unsupported_image"


def test_scanner_ai_parses_json(monkeypatch) -> None:
    from app.services import scanner_ai

    class FakeBlock:
        type = "text"
        text = '{"slug": "jollof", "confidence": 91}'

    class FakeResponse:
        content = [FakeBlock()]

    class FakeMessages:
        def create(self, **kwargs):
            self.kwargs = kwargs
            return FakeResponse()

    class FakeClient:
        def __init__(self):
            self.messages = FakeMessages()

    monkeypatch.setattr(scanner_ai, "_get_client", lambda: FakeClient())
    slug, confidence = scanner_ai.identify_food(
        b"\x00", "image/png", [scanner_ai.RecipeRef("jollof", "Jollof Rice", None)]
    )
    assert slug == "jollof"
    assert confidence == 91


def test_scanner_ai_returns_none_for_low_confidence(monkeypatch) -> None:
    from app.services import scanner_ai

    class FakeBlock:
        type = "text"
        text = '{"slug": "jollof", "confidence": 30}'

    class FakeResponse:
        content = [FakeBlock()]

    class FakeMessages:
        def create(self, **kwargs):
            return FakeResponse()

    class FakeClient:
        def __init__(self):
            self.messages = FakeMessages()

    monkeypatch.setattr(scanner_ai, "_get_client", lambda: FakeClient())
    slug, confidence = scanner_ai.identify_food(
        b"\x00", "image/png", [scanner_ai.RecipeRef("jollof", "Jollof Rice", None)]
    )
    assert slug is None
    assert confidence == 0


def test_scanner_ai_returns_none_without_key(monkeypatch) -> None:
    from app.services import scanner_ai

    monkeypatch.setattr(scanner_ai, "_get_client", lambda: None)
    slug, confidence = scanner_ai.identify_food(
        b"\x00", "image/png", [scanner_ai.RecipeRef("jollof", "Jollof Rice", None)]
    )
    assert slug is None
    assert confidence == 0
