"""Shared helpers for the Nigerian corpus import + image pipeline.

The source corpus lives at repo-root `data/nigerian_corpus/`:
  - food_database.xlsx   (Cooked Foods by Region, Vegetables, Cooking Ingredients, ...)
  - diet_guide.xlsx      (per-condition FOODS TO EAT / AVOID sheets)
  - food_images/*.jpg    (77 dish photos)
"""
from __future__ import annotations

import re
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
CORPUS_DIR = REPO_ROOT / "data" / "nigerian_corpus"
FOOD_DB = CORPUS_DIR / "food_database.xlsx"
DIET_GUIDE = CORPUS_DIR / "diet_guide.xlsx"
IMAGE_SRC_DIR = CORPUS_DIR / "food_images"

BACKEND_ROOT = REPO_ROOT / "backend"
IMAGE_OUT_DIR = BACKEND_ROOT / "static" / "recipe-images"


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return slug or "item"


def normalize_food_key(value: str) -> str:
    """Lowercase, drop parenthetical qualifiers, strip non-alphanumerics → join.

    "Eba/Garri (large portions)" -> "ebagarri"
    "Efo Riro (little palm oil)" -> "eforiro"
    """
    value = re.sub(r"\([^)]*\)", " ", value)  # drop ( ... )
    value = value.lower()
    return re.sub(r"[^a-z0-9]+", "", value)


def normalize_tokens(value: str) -> str:
    """Like normalize_food_key but keeps word boundaries as single spaces."""
    value = re.sub(r"\([^)]*\)", " ", value).lower()
    value = re.sub(r"[^a-z0-9]+", " ", value)
    return re.sub(r"\s+", " ", value).strip()


def parse_calories(raw: object) -> int | None:
    """'~250 per cup' -> 250 ; '490-500 per wrap' -> 495 ; '216 per cup' -> 216."""
    if raw is None:
        return None
    text = str(raw)
    nums = [int(n) for n in re.findall(r"\d+", text)]
    if not nums:
        return None
    # A range like 490-500 / 350-450 → take the first two as bounds.
    rng = re.search(r"(\d+)\s*[-–]\s*(\d+)", text)
    if rng:
        lo, hi = int(rng.group(1)), int(rng.group(2))
        return round((lo + hi) / 2)
    return nums[0]
