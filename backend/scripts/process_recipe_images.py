"""Resize + recompress the corpus dish photos into backend/static/recipe-images/.

Run:  ./venv/bin/python -m scripts.process_recipe_images

Each source jpg in data/nigerian_corpus/food_images/ is:
  - re-oriented per EXIF,
  - resized to max 800px wide,
  - saved as progressive JPEG quality 80 (target ~150 KB),
  - named by a slug derived from the source filename.

The slug becomes the lookup key the importer fuzzy-matches recipe names against.
"""
from __future__ import annotations

from PIL import Image, ImageOps

from scripts.corpus_common import IMAGE_OUT_DIR, IMAGE_SRC_DIR, slugify

MAX_WIDTH = 800
QUALITY = 80

# Source filenames are messy ("Suya (2).jpg", emoji captions). Map the few
# that wouldn't slug cleanly, and drop non-dish promo images.
SKIP = {
    "get-ready-to-spice-up-your-day-with-our",
    "nerfee-mirandilla-kxcyyojzehi-unsplash",
}
RENAME = {
    "suya-2": "suya-alt",
    "suya-3": "suya-third",
    "refresh-yourself-with-homemade-ginger-ale": "ginger-ale",
}


def downscale(im: Image.Image) -> Image.Image:
    """Re-orient per EXIF, convert to RGB, cap width at MAX_WIDTH."""
    im = ImageOps.exif_transpose(im)
    im = im.convert("RGB")
    if im.width > MAX_WIDTH:
        ratio = MAX_WIDTH / im.width
        im = im.resize((MAX_WIDTH, round(im.height * ratio)), Image.LANCZOS)
    return im


def main() -> None:
    IMAGE_OUT_DIR.mkdir(parents=True, exist_ok=True)
    if not IMAGE_SRC_DIR.exists():
        raise SystemExit(f"Source images not found at {IMAGE_SRC_DIR}")

    written = 0
    skipped = 0
    total_bytes = 0
    for src in sorted(IMAGE_SRC_DIR.glob("*.jpg")):
        slug = slugify(src.stem)
        slug = RENAME.get(slug, slug)
        if slug in SKIP or not slug:
            skipped += 1
            continue
        out = IMAGE_OUT_DIR / f"{slug}.jpg"
        with Image.open(src) as im:
            im = downscale(im)
            im.save(out, "JPEG", quality=QUALITY, optimize=True, progressive=True)
        total_bytes += out.stat().st_size
        written += 1

    avg_kb = (total_bytes / written / 1024) if written else 0
    print(f"Wrote {written} images -> {IMAGE_OUT_DIR.relative_to(IMAGE_OUT_DIR.parents[2])}")
    print(f"  skipped: {skipped}   avg size: {avg_kb:.0f} KB")


if __name__ == "__main__":
    main()
