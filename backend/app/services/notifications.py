from sqlalchemy.orm import Session

from app.models.notification import Notification
from app.models.user import User


def welcome_pack(user: User, db: Session) -> None:
    """Insert two welcome notifications. Caller commits."""
    db.add(
        Notification(
            user_id=user.id,
            kind="welcome",
            title=f"Welcome to Lapya, {user.first_name}!",
            body="We're getting your personalised plan ready. Tap around to explore.",
        )
    )
    db.add(
        Notification(
            user_id=user.id,
            kind="reminder",
            title="Finish your profile",
            body="Tell us about your conditions so we can tailor every meal.",
        )
    )


def meal_completed(user: User, db: Session) -> None:
    """Append a success notification when a user logs a meal."""
    db.add(
        Notification(
            user_id=user.id,
            kind="success",
            title="Great progress!",
            body=f"Well done {user.first_name} — that meal is logged.",
        )
    )
