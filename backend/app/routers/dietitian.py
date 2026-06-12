import secrets
from datetime import date, datetime, timedelta, timezone

from fastapi import APIRouter, BackgroundTasks, Depends, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.database import get_db
from app.core.deps import get_current_user, get_verified_dietitian
from app.exceptions import AppException
from app.models.dietitian import DietitianRelationship, PatientNote
from app.models.health_metric import HealthMetric
from app.models.meal_plan import MealPlanItem
from app.models.recipe import Recipe
from app.models.user import User
from app.models.user_condition import UserCondition
from app.models.user_preferences import UserPreferences
from app.routers.meal_plan import _to_item_out, _items_for_week
from app.routers.profile import _build_summary
from app.schemas.dietitian import (
    DietitianInviteRequest,
    DietitianInviteResponse,
    DietitianMealEditRequest,
    DietitianRelationshipOut,
    PatientDetailOut,
    PatientNoteCreateRequest,
    PatientNoteOut,
    PatientSummary,
)
from app.schemas.health import HealthMetricOut
from app.schemas.meal_plan import MealPlanItemOut, WeekPlanOut
from app.schemas.profile import ConditionView
from app.schemas.user import UserPublic
from app.services.adherence import compute_adherence_pct
from app.services.email import send_email_template

router = APIRouter()


def _new_token() -> str:
    return secrets.token_urlsafe(24)


def _status_from_adherence(pct: int) -> str:
    return "attention" if pct < 75 else "active"


def _last_activity(user_id: int, db: Session) -> datetime | None:
    return db.scalar(
        select(MealPlanItem.completed_at)
        .where(
            MealPlanItem.user_id == user_id,
            MealPlanItem.completed_at.is_not(None),
        )
        .order_by(MealPlanItem.completed_at.desc())
        .limit(1)
    )


def _alert_count(user_id: int, db: Session) -> int:
    cutoff = date.today() - timedelta(days=3)
    rows = db.scalars(
        select(MealPlanItem.is_completed)
        .where(
            MealPlanItem.user_id == user_id,
            MealPlanItem.date >= cutoff,
            MealPlanItem.date < date.today(),
        )
    ).all()
    return sum(1 for completed in rows if not completed)


def _patient_summary(user: User, db: Session) -> PatientSummary:
    prefs = db.scalar(select(UserPreferences).where(UserPreferences.user_id == user.id))
    conditions = db.scalars(
        select(UserCondition).where(UserCondition.user_id == user.id)
    ).all()
    adherence = compute_adherence_pct(user.id, db)
    return PatientSummary(
        id=user.id,
        first_name=user.first_name,
        last_name=user.last_name,
        age=prefs.age if prefs else None,
        conditions=[ConditionView(slug=c.slug, severity=c.severity) for c in conditions],
        adherence_pct=adherence,
        last_activity_at=_last_activity(user.id, db),
        status=_status_from_adherence(adherence),
        alert_count=_alert_count(user.id, db),
    )


def _serialise_relationship(
    rel: DietitianRelationship, viewer_id: int, db: Session
) -> DietitianRelationshipOut:
    if viewer_id == rel.dietitian_id and rel.patient_id:
        other = db.get(User, rel.patient_id)
        other_name = other.first_name if other else None
    elif viewer_id == rel.patient_id:
        other = db.get(User, rel.dietitian_id)
        other_name = other.first_name if other else None
    else:
        other_name = None
    return DietitianRelationshipOut(
        id=rel.id,
        patient_id=rel.patient_id,
        dietitian_id=rel.dietitian_id,
        status=rel.status,
        email=rel.invite_email,
        other_name=other_name,
        created_at=rel.created_at,
        accepted_at=rel.accepted_at,
    )


def _serialise_note(note: PatientNote, db: Session) -> PatientNoteOut:
    dietitian = db.get(User, note.dietitian_id)
    return PatientNoteOut(
        id=note.id,
        patient_id=note.patient_id,
        dietitian_id=note.dietitian_id,
        dietitian_name=dietitian.first_name if dietitian else None,
        body=note.body,
        created_at=note.created_at,
        updated_at=note.updated_at,
    )


def _accepted_patient_ids(dietitian_id: int, db: Session) -> set[int]:
    rows = db.scalars(
        select(DietitianRelationship.patient_id).where(
            DietitianRelationship.dietitian_id == dietitian_id,
            DietitianRelationship.status == "accepted",
            DietitianRelationship.patient_id.is_not(None),
        )
    ).all()
    return {pid for pid in rows if pid is not None}


def _ensure_patient_access(
    dietitian: User, patient_id: int, db: Session
) -> DietitianRelationship:
    rel = db.scalar(
        select(DietitianRelationship).where(
            DietitianRelationship.dietitian_id == dietitian.id,
            DietitianRelationship.patient_id == patient_id,
            DietitianRelationship.status == "accepted",
        )
    )
    if rel is None:
        raise AppException(
            "forbidden",
            "You don't have an active relationship with this patient.",
            status.HTTP_403_FORBIDDEN,
        )
    return rel


@router.post(
    "/patients/invite",
    response_model=DietitianInviteResponse,
    status_code=status.HTTP_201_CREATED,
)
def invite_patient(
    payload: DietitianInviteRequest,
    background: BackgroundTasks,
    dietitian: User = Depends(get_verified_dietitian),
    db: Session = Depends(get_db),
) -> DietitianInviteResponse:
    token = _new_token()
    rel = DietitianRelationship(
        dietitian_id=dietitian.id,
        invite_email=payload.email.lower(),
        invite_token=token,
        status="pending",
    )
    db.add(rel)
    db.commit()

    settings = get_settings()
    invite_url = f"{settings.app_public_url}/app/dietitian/accept?token={token}"
    share_preview = (
        f"Dr. {dietitian.first_name} invited you to share your Lapya plan. "
        f"Open this link while signed in to accept: {invite_url}"
    )
    background.add_task(
        send_email_template,
        payload.email,
        "dietitian_invite",
        {
            "dietitian_name": dietitian.first_name,
            "accept_url": invite_url,
        },
    )

    return DietitianInviteResponse(
        token=token, invite_url=invite_url, share_preview=share_preview
    )


@router.post(
    "/patients/accept/{token}", response_model=DietitianRelationshipOut
)
def accept_invite(
    token: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> DietitianRelationshipOut:
    rel = db.scalar(
        select(DietitianRelationship).where(DietitianRelationship.invite_token == token)
    )
    if rel is None:
        raise AppException(
            "invite_not_found", "Invite link is invalid.", status.HTTP_404_NOT_FOUND
        )
    if rel.dietitian_id == current_user.id:
        raise AppException(
            "self_invite",
            "You cannot accept your own invite.",
            status.HTTP_400_BAD_REQUEST,
        )
    if rel.status == "accepted":
        raise AppException(
            "already_accepted",
            "Invite was already accepted.",
            status.HTTP_409_CONFLICT,
        )
    if rel.status == "revoked":
        raise AppException("invite_revoked", "Invite was revoked.", status.HTTP_410_GONE)

    rel.patient_id = current_user.id
    rel.status = "accepted"
    rel.accepted_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(rel)
    return _serialise_relationship(rel, current_user.id, db)


@router.delete(
    "/patients/{relationship_id}", response_model=DietitianRelationshipOut
)
def revoke(
    relationship_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> DietitianRelationshipOut:
    rel = db.get(DietitianRelationship, relationship_id)
    if rel is None or current_user.id not in (rel.patient_id, rel.dietitian_id):
        raise AppException("not_found", "Relationship not found.", status.HTTP_404_NOT_FOUND)
    rel.status = "revoked"
    db.commit()
    db.refresh(rel)
    return _serialise_relationship(rel, current_user.id, db)


@router.get("/my-dietitians", response_model=list[DietitianRelationshipOut])
def list_my_dietitians(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[DietitianRelationshipOut]:
    rows = db.scalars(
        select(DietitianRelationship)
        .where(DietitianRelationship.patient_id == current_user.id)
        .order_by(DietitianRelationship.created_at.desc())
    ).all()
    return [_serialise_relationship(r, current_user.id, db) for r in rows]


@router.get("/patients", response_model=list[PatientSummary])
def list_patients(
    dietitian: User = Depends(get_verified_dietitian),
    db: Session = Depends(get_db),
) -> list[PatientSummary]:
    patient_ids = _accepted_patient_ids(dietitian.id, db)
    if not patient_ids:
        return []
    patients = db.scalars(
        select(User)
        .where(User.id.in_(patient_ids))
        .order_by(User.created_at.desc())
    ).all()
    return [_patient_summary(p, db) for p in patients]


@router.get("/patients/{patient_id}", response_model=PatientDetailOut)
def get_patient(
    patient_id: int,
    dietitian: User = Depends(get_verified_dietitian),
    db: Session = Depends(get_db),
) -> PatientDetailOut:
    _ensure_patient_access(dietitian, patient_id, db)

    patient = db.get(User, patient_id)
    if patient is None:
        raise AppException("patient_not_found", "Patient not found.", status.HTTP_404_NOT_FOUND)

    profile = _build_summary(patient, db)

    today = date.today()
    week_start = today - timedelta(days=today.weekday())
    items = _items_for_week(patient, db, week_start)
    condition_slugs = [c.slug for c in db.scalars(
        select(UserCondition).where(UserCondition.user_id == patient.id)
    ).all()]
    week_plan = WeekPlanOut(
        week_start=week_start,
        items=[_to_item_out(i, condition_slugs, db) for i in items],
    )

    recent_metrics = db.scalars(
        select(HealthMetric)
        .where(HealthMetric.user_id == patient.id)
        .order_by(HealthMetric.recorded_at.desc())
        .limit(10)
    ).all()

    _ = timezone.utc

    return PatientDetailOut(
        patient=UserPublic.model_validate(patient),
        profile=profile,
        week_plan=week_plan,
        recent_metrics=[HealthMetricOut.model_validate(m) for m in recent_metrics],
    )


@router.patch(
    "/patients/{patient_id}/meals/{item_id}", response_model=MealPlanItemOut
)
def edit_patient_meal(
    patient_id: int,
    item_id: int,
    payload: DietitianMealEditRequest,
    dietitian: User = Depends(get_verified_dietitian),
    db: Session = Depends(get_db),
) -> MealPlanItemOut:
    _ensure_patient_access(dietitian, patient_id, db)

    item = db.get(MealPlanItem, item_id)
    if item is None or item.user_id != patient_id:
        raise AppException("item_not_found", "Meal item not found.", status.HTTP_404_NOT_FOUND)

    if payload.recipe_id is not None:
        recipe = db.get(Recipe, payload.recipe_id)
        if recipe is None:
            raise AppException("recipe_not_found", "Recipe not found.", status.HTTP_404_NOT_FOUND)
        item.recipe_id = recipe.id

    if payload.dietitian_note is not None:
        item.dietitian_note = payload.dietitian_note or None

    item.edited_by_dietitian_id = dietitian.id
    db.commit()
    db.refresh(item)

    condition_slugs = [c.slug for c in db.scalars(
        select(UserCondition).where(UserCondition.user_id == patient_id)
    ).all()]
    return _to_item_out(item, condition_slugs, db)


@router.get(
    "/patients/{patient_id}/notes", response_model=list[PatientNoteOut]
)
def list_patient_notes(
    patient_id: int,
    dietitian: User = Depends(get_verified_dietitian),
    db: Session = Depends(get_db),
) -> list[PatientNoteOut]:
    _ensure_patient_access(dietitian, patient_id, db)
    notes = db.scalars(
        select(PatientNote)
        .where(PatientNote.patient_id == patient_id)
        .order_by(PatientNote.created_at.desc())
    ).all()
    return [_serialise_note(n, db) for n in notes]


@router.post(
    "/patients/{patient_id}/notes",
    response_model=PatientNoteOut,
    status_code=status.HTTP_201_CREATED,
)
def create_patient_note(
    patient_id: int,
    payload: PatientNoteCreateRequest,
    dietitian: User = Depends(get_verified_dietitian),
    db: Session = Depends(get_db),
) -> PatientNoteOut:
    _ensure_patient_access(dietitian, patient_id, db)
    body = payload.body.strip()
    if not body:
        raise AppException(
            "empty_note", "Note body is required.", status.HTTP_400_BAD_REQUEST
        )
    note = PatientNote(
        patient_id=patient_id,
        dietitian_id=dietitian.id,
        body=body,
    )
    db.add(note)
    db.commit()
    db.refresh(note)
    return _serialise_note(note, db)
