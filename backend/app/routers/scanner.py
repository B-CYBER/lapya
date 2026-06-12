import random
from typing import Annotated

from fastapi import APIRouter, Depends, File, Query, UploadFile, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.exceptions import AppException
from app.models.recipe import Recipe
from app.models.scan import ScanResult
from app.models.user import User
from app.models.user_condition import UserCondition
from app.schemas.recipe import RecipeSummary
from app.schemas.scan import ScanResultOut
from app.services import scanner_ai
from app.services.safety import filter_condition_safety

router = APIRouter()

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_IMAGE_BYTES = 6 * 1024 * 1024  # 6 MB hard cap before we touch the model


def _condition_slugs(user: User, db: Session) -> list[str]:
    return list(
        db.scalars(select(UserCondition.slug).where(UserCondition.user_id == user.id)).all()
    )


def _to_scan_out(scan: ScanResult, condition_slugs: list[str]) -> ScanResultOut:
    summary_data = RecipeSummary.model_validate(scan.recipe).model_dump()
    summary_data["condition_safety"] = filter_condition_safety(
        scan.recipe.condition_safety, condition_slugs
    )
    data = ScanResultOut.model_validate(scan).model_dump()
    data["recipe"] = summary_data
    return ScanResultOut.model_validate(data)


def _recipe_refs(recipes: list[Recipe]) -> list[scanner_ai.RecipeRef]:
    return [
        scanner_ai.RecipeRef(slug=r.slug, name=r.name, local_name=r.local_name)
        for r in recipes
    ]


@router.post("/scan", response_model=ScanResultOut, status_code=status.HTTP_201_CREATED)
async def scan(
    image: Annotated[UploadFile | None, File()] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ScanResultOut:
    recipes = list(db.scalars(select(Recipe)).all())
    if not recipes:
        raise AppException(
            "no_recipes", "No recipes seeded yet.", status.HTTP_409_CONFLICT
        )

    matched_recipe: Recipe | None = None
    confidence = 0
    image_provided = image is not None and image.filename

    if image_provided:
        if image.content_type not in ALLOWED_IMAGE_TYPES:
            raise AppException(
                "unsupported_image",
                "Please upload a JPEG, PNG or WebP photo.",
                status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            )
        image_bytes = await image.read()
        if len(image_bytes) > MAX_IMAGE_BYTES:
            raise AppException(
                "image_too_large",
                "Photo is too large. Try a smaller image (under 6 MB).",
                status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            )

        slug, ai_confidence = scanner_ai.identify_food(
            image_bytes, image.content_type, _recipe_refs(recipes)
        )
        if slug is not None:
            matched_recipe = next((r for r in recipes if r.slug == slug), None)
            if matched_recipe is not None:
                confidence = ai_confidence

    if matched_recipe is None:
        if image_provided:
            # Tried and failed — surface the "couldn't read this" state via confidence=0.
            matched_recipe = recipes[0]
            confidence = 0
        else:
            # No image at all — legacy dev path used when no key is set.
            matched_recipe = random.choice(recipes)
            confidence = 94

    scan_row = ScanResult(
        user_id=current_user.id,
        recipe_id=matched_recipe.id,
        confidence=confidence,
    )
    db.add(scan_row)
    db.commit()
    db.refresh(scan_row)
    return _to_scan_out(scan_row, _condition_slugs(current_user, db))


@router.get("/history", response_model=list[ScanResultOut])
def history(
    limit: int = Query(default=10, ge=1, le=50),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[ScanResultOut]:
    rows = db.scalars(
        select(ScanResult)
        .where(ScanResult.user_id == current_user.id)
        .order_by(ScanResult.scanned_at.desc())
        .limit(limit)
    ).all()
    slugs = _condition_slugs(current_user, db)
    return [_to_scan_out(row, slugs) for row in rows]
