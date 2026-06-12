import secrets
from datetime import date, datetime, timedelta, timezone

from fastapi import APIRouter, BackgroundTasks, Depends, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.database import get_db
from app.core.deps import get_current_user
from app.exceptions import AppException
from app.models.caregiver import CaregiverRelationship
from app.models.grocery import GroceryItem
from app.models.health_metric import HealthMetric
from app.models.meal_plan import MealPlanItem
from app.models.user import User
from app.schemas.caregiver import (
    CaregiverHomeOut,
    CaregiverInviteRequest,
    CaregiverInviteResponse,
    CaregiverRelationshipOut,
)
from app.schemas.health import HealthMetricOut
from app.schemas.meal_plan import MealPlanItemOut
from app.schemas.recipe import RecipeSummary
from app.schemas.user import UserPublic
from app.services.email import send_email_template
from app.services.safety import filter_condition_safety
from app.models.user_condition import UserCondition

router = APIRouter()


def _new_token() -> str:
    return secrets.token_urlsafe(24)


def _patient_label(patient: User) -> str:
    return patient.first_name


def _serialise(rel: CaregiverRelationship, viewer_id: int, db: Session) -> CaregiverRelationshipOut:
    if viewer_id == rel.patient_id and rel.caregiver_id:
        other = db.get(User, rel.caregiver_id)
        other_name = other.first_name if other else None
    elif viewer_id == rel.caregiver_id:
        other = db.get(User, rel.patient_id)
        other_name = other.first_name if other else None
    else:
        other_name = None
    return CaregiverRelationshipOut(
        id=rel.id,
        patient_id=rel.patient_id,
        caregiver_id=rel.caregiver_id,
        status=rel.status,
        relationship=rel.invite_relationship,
        email=rel.invite_email,
        other_name=other_name,
        created_at=rel.created_at,
        accepted_at=rel.accepted_at,
    )


@router.post(
    "/caregivers/invite",
    response_model=CaregiverInviteResponse,
    status_code=status.HTTP_201_CREATED,
)
def invite_caregiver(
    payload: CaregiverInviteRequest,
    background: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> CaregiverInviteResponse:
    token = _new_token()
    rel = CaregiverRelationship(
        patient_id=current_user.id,
        invite_email=payload.email.lower(),
        invite_relationship=payload.relationship,
        invite_token=token,
        status="pending",
    )
    db.add(rel)
    db.commit()

    settings = get_settings()
    invite_url = f"{settings.app_public_url}/app/care-circle/accept?token={token}"
    share_preview = (
        f"{current_user.first_name} invited you to their Lapya care circle. "
        f"Open this link while signed in to accept: {invite_url}"
    )
    background.add_task(
        send_email_template,
        payload.email,
        "caregiver_invite",
        {
            "inviter_name": current_user.first_name,
            "relationship": payload.relationship,
            "accept_url": invite_url,
        },
    )

    return CaregiverInviteResponse(token=token, invite_url=invite_url, share_preview=share_preview)


@router.post(
    "/caregivers/accept/{token}", response_model=CaregiverRelationshipOut
)
def accept_invite(
    token: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> CaregiverRelationshipOut:
    rel = db.scalar(select(CaregiverRelationship).where(CaregiverRelationship.invite_token == token))
    if rel is None:
        raise AppException("invite_not_found", "Invite link is invalid.", status.HTTP_404_NOT_FOUND)
    if rel.patient_id == current_user.id:
        raise AppException(
            "self_invite", "You cannot accept your own invite.", status.HTTP_400_BAD_REQUEST
        )
    if rel.status == "accepted":
        raise AppException(
            "already_accepted",
            "Invite was already accepted by someone else.",
            status.HTTP_409_CONFLICT,
        )
    if rel.status == "revoked":
        raise AppException("invite_revoked", "Invite was revoked.", status.HTTP_410_GONE)

    rel.caregiver_id = current_user.id
    rel.status = "accepted"
    rel.accepted_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(rel)
    return _serialise(rel, current_user.id, db)


@router.get("/caregivers", response_model=list[CaregiverRelationshipOut])
def list_my_caregivers(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[CaregiverRelationshipOut]:
    rows = db.scalars(
        select(CaregiverRelationship)
        .where(CaregiverRelationship.patient_id == current_user.id)
        .order_by(CaregiverRelationship.created_at.desc())
    ).all()
    return [_serialise(r, current_user.id, db) for r in rows]


@router.get("/patients", response_model=list[CaregiverRelationshipOut])
def list_my_patients(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[CaregiverRelationshipOut]:
    rows = db.scalars(
        select(CaregiverRelationship)
        .where(
            CaregiverRelationship.caregiver_id == current_user.id,
            CaregiverRelationship.status == "accepted",
        )
        .order_by(CaregiverRelationship.accepted_at.desc())
    ).all()
    return [_serialise(r, current_user.id, db) for r in rows]


@router.delete(
    "/caregivers/{relationship_id}", response_model=CaregiverRelationshipOut
)
def revoke(
    relationship_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> CaregiverRelationshipOut:
    rel = db.get(CaregiverRelationship, relationship_id)
    if rel is None or current_user.id not in (rel.patient_id, rel.caregiver_id):
        raise AppException("not_found", "Relationship not found.", status.HTTP_404_NOT_FOUND)
    rel.status = "revoked"
    db.commit()
    db.refresh(rel)
    return _serialise(rel, current_user.id, db)


@router.get(
    "/caregiver/patients/{patient_id}/home", response_model=CaregiverHomeOut
)
def caregiver_home(
    patient_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> CaregiverHomeOut:
    rel = db.scalar(
        select(CaregiverRelationship).where(
            CaregiverRelationship.patient_id == patient_id,
            CaregiverRelationship.caregiver_id == current_user.id,
            CaregiverRelationship.status == "accepted",
        )
    )
    if rel is None:
        raise AppException(
            "forbidden",
            "You don't have caregiver access to this patient.",
            status.HTTP_403_FORBIDDEN,
        )
    patient = db.get(User, patient_id)
    if patient is None:
        raise AppException("not_found", "Patient not found.", status.HTTP_404_NOT_FOUND)

    today = date.today()
    todays_items = db.scalars(
        select(MealPlanItem)
        .where(MealPlanItem.user_id == patient_id, MealPlanItem.date == today)
        .order_by(MealPlanItem.sort_order)
    ).all()

    patient_conditions = list(
        db.scalars(select(UserCondition.slug).where(UserCondition.user_id == patient_id)).all()
    )
    todays_meals_out: list[MealPlanItemOut] = []
    for item in todays_items:
        summary_data = RecipeSummary.model_validate(item.recipe).model_dump()
        summary_data["condition_safety"] = filter_condition_safety(
            item.recipe.condition_safety, patient_conditions
        )
        item_data = MealPlanItemOut.model_validate(item).model_dump()
        item_data["recipe"] = summary_data
        todays_meals_out.append(MealPlanItemOut.model_validate(item_data))

    monday = today - timedelta(days=today.weekday())
    grocery_total = sum(
        row
        for row in db.scalars(
            select(GroceryItem.naira_kobo).where(
                GroceryItem.user_id == patient_id, GroceryItem.week_start == monday
            )
        ).all()
    )

    recent_metrics = db.scalars(
        select(HealthMetric)
        .where(HealthMetric.user_id == patient_id)
        .order_by(HealthMetric.recorded_at.desc())
        .limit(10)
    ).all()

    return CaregiverHomeOut(
        patient=UserPublic.model_validate(patient),
        todays_meals=todays_meals_out,
        grocery_total_kobo=grocery_total,
        recent_metrics=[HealthMetricOut.model_validate(m) for m in recent_metrics],
    )
