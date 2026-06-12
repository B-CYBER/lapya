"""CLI entry point: seed app data into the database.

Usage:
    python seed.py
"""

from app.core.database import SessionLocal
from app.seeds import seed_all


def main() -> None:
    db = SessionLocal()
    try:
        seed_all(db)
        print("Seed complete.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
