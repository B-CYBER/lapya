from datetime import date, datetime, time, timezone

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.health_metric import HealthMetric
from app.models.user import User
from app.schemas.health import HealthMetricCreate, HealthMetricOut, MetricType

router = APIRouter()

UNIT_BY_TYPE: dict[str, str] = {
    "weight": "kg",
    "blood_pressure": "mmHg",
    "blood_sugar": "mg/dL",
}


@router.get("/metrics", response_model=list[HealthMetricOut])
def list_metrics(
    type: MetricType | None = Query(default=None, alias="type"),
    from_date: date | None = Query(default=None, alias="fromDate"),
    to_date: date | None = Query(default=None, alias="toDate"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[HealthMetric]:
    stmt = select(HealthMetric).where(HealthMetric.user_id == current_user.id)
    if type:
        stmt = stmt.where(HealthMetric.metric_type == type)
    if from_date:
        stmt = stmt.where(
            HealthMetric.recorded_at >= datetime.combine(from_date, time.min, tzinfo=timezone.utc)
        )
    if to_date:
        stmt = stmt.where(
            HealthMetric.recorded_at <= datetime.combine(to_date, time.max, tzinfo=timezone.utc)
        )
    stmt = stmt.order_by(HealthMetric.recorded_at.desc())
    return list(db.scalars(stmt).all())


@router.post("/metrics", response_model=HealthMetricOut, status_code=status.HTTP_201_CREATED)
def create_metric(
    payload: HealthMetricCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> HealthMetric:
    metric = HealthMetric(
        user_id=current_user.id,
        metric_type=payload.type,
        value=payload.value,
        value_secondary=payload.value_secondary,
        unit=payload.unit or UNIT_BY_TYPE[payload.type],
        recorded_at=payload.recorded_at or datetime.now(timezone.utc),
        notes=payload.notes,
    )
    db.add(metric)
    db.commit()
    db.refresh(metric)
    return metric
