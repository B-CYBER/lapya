from fastapi import APIRouter, BackgroundTasks, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.waitlist import WaitlistEntry
from app.schemas.waitlist import WaitlistRequest, WaitlistResponse
from app.services.email import send_email_template

router = APIRouter()


@router.post("", response_model=WaitlistResponse)
def join_waitlist(
    payload: WaitlistRequest,
    background: BackgroundTasks,
    db: Session = Depends(get_db),
) -> WaitlistResponse:
    email = payload.email.lower()
    existing = db.scalar(select(WaitlistEntry).where(WaitlistEntry.email == email))
    is_first_submission = existing is None
    if existing is None:
        db.add(WaitlistEntry(email=email, role=payload.role))
    else:
        existing.role = payload.role
    db.commit()

    if is_first_submission:
        background.add_task(
            send_email_template,
            email,
            "waitlist",
            {"role": payload.role},
        )

    return WaitlistResponse(message="You're on the list. We'll be in touch.")
