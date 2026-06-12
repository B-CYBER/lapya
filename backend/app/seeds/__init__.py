from sqlalchemy.orm import Session

from app.seeds.recipes import seed_recipes


def seed_all(db: Session) -> None:
    seed_recipes(db)
