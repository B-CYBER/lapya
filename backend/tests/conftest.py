import os
from collections.abc import Generator

# Ensure env vars exist before importing app modules that read settings.
os.environ.setdefault("SECRET_KEY", "test-secret-key")
os.environ.setdefault("JWT_SECRET_KEY", "test-jwt-secret")
os.environ.setdefault("DATABASE_URL", "sqlite:///:memory:")

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.database import Base, get_db
from app.main import app


@pytest.fixture
def db_session() -> Generator[Session, None, None]:
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    TestingSessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client(db_session: Session) -> Generator[TestClient, None, None]:
    def override_get_db() -> Generator[Session, None, None]:
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


SIGNUP_PAYLOAD = {
    "email": "mama@example.com",
    "password": "secret123",
    "firstName": "Mama",
    "lastName": "Nkechi",
}


def signup_and_get_token(client: TestClient, payload: dict | None = None) -> str:
    response = client.post("/api/auth/signup", json=payload or SIGNUP_PAYLOAD)
    assert response.status_code == 201, response.text
    return response.json()["accessToken"]


def signup_second_user(
    client: TestClient,
    *,
    email: str = "caregiver@example.com",
    first_name: str = "Chioma",
    last_name: str = "Adeyemi",
) -> tuple[str, int]:
    response = client.post(
        "/api/auth/signup",
        json={
            "email": email,
            "password": "secret123",
            "firstName": first_name,
            "lastName": last_name,
        },
    )
    assert response.status_code == 201, response.text
    body = response.json()
    return body["accessToken"], body["user"]["id"]


def auth_headers(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


def make_recipe(
    db: Session,
    *,
    slug: str,
    meal_type: str = "lunch",
    name: str | None = None,
    condition_safety: dict[str, str] | None = None,
    cuisine_region: str | None = None,
    ingredients: list[tuple[str, str, str, int]] | None = None,
):
    """Create a Recipe with a sane default shape for tests.

    `ingredients` is a list of (item, amount, category, naira_kobo) tuples.
    """
    from app.models.recipe import Recipe, RecipeIngredient, RecipeStep

    recipe = Recipe(
        slug=slug,
        name=name or slug.replace("-", " ").title(),
        local_name=None,
        meal_type=meal_type,
        image_url="https://example.com/x.jpg",
        prep_minutes=10,
        cook_minutes=20,
        servings=1,
        calories=300,
        protein_g=10,
        carbs_g=40,
        fat_g=8,
        sodium_mg=200,
        potassium_mg=300,
        portion="1 portion",
        reason="test",
        condition_safety=condition_safety or {},
        cuisine_region=cuisine_region,
        is_seeded=True,
    )
    db.add(recipe)
    db.flush()
    for i, (item, amount, category, naira) in enumerate(ingredients or []):
        recipe.ingredients.append(
            RecipeIngredient(
                item=item, amount=amount, category=category, naira_kobo=naira, sort_order=i
            )
        )
    recipe.steps.append(RecipeStep(step_number=1, instruction="cook it"))
    db.commit()
    db.refresh(recipe)
    return recipe


def make_verified_dietitian(client: TestClient, db: Session, email: str = "doc@example.com") -> str:
    """Sign up a user, promote them to verified dietitian directly in the DB, return token."""
    from app.models.user import User

    token, _ = signup_second_user(client, email=email, first_name="Doctor", last_name="Adaobi")
    user = db.query(User).filter_by(email=email).one()
    user.role = "dietitian"
    user.dietitian_verified = True
    db.commit()
    return token


def complete_onboarding(
    client: TestClient,
    token: str,
    *,
    conditions: list[dict] | None = None,
    foods: list[str] | None = None,
    region: str = "south-west",
) -> None:
    payload = {
        "role": "patient",
        "displayName": "Mama",
        "conditions": conditions or [{"slug": "diabetes", "severity": "Moderate"}],
        "foods": foods or ["jollof"],
        "region": region,
        "age": 45,
        "weightKg": 70.0,
    }
    response = client.post(
        "/api/onboarding/complete", json=payload, headers=auth_headers(token)
    )
    assert response.status_code == 200, response.text
