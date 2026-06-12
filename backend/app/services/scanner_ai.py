"""Identify a Nigerian dish from a photo using Claude Sonnet 4.6 multimodal.

When `ANTHROPIC_API_KEY` is unset, `identify_food` returns `(None, 0)` so callers
can fall back to legacy behaviour without crashing.
"""

import base64
import json
import logging
import re
from dataclasses import dataclass

import anthropic

from app.core.config import get_settings

logger = logging.getLogger(__name__)

MODEL = "claude-sonnet-4-6"
MAX_TOKENS = 256
CONFIDENCE_FLOOR = 60


@dataclass(frozen=True)
class RecipeRef:
    slug: str
    name: str
    local_name: str | None


_client_instance: anthropic.Anthropic | None = None


def _get_client() -> anthropic.Anthropic | None:
    global _client_instance
    if _client_instance is not None:
        return _client_instance
    settings = get_settings()
    if not settings.anthropic_api_key:
        return None
    _client_instance = anthropic.Anthropic(api_key=settings.anthropic_api_key)
    return _client_instance


def _build_system_prompt(recipes: list[RecipeRef]) -> str:
    lines = ["You identify Nigerian dishes from photographs."]
    lines.append("")
    lines.append("Pick the single best match from the list below. If the photo")
    lines.append("clearly does NOT match any of them, return slug=null.")
    lines.append("")
    lines.append("Allowed slugs:")
    for r in recipes:
        local = f" (also: {r.local_name})" if r.local_name else ""
        lines.append(f"- {r.slug}: {r.name}{local}")
    lines.append("")
    lines.append('Respond with ONLY a JSON object: {"slug": "<slug-or-null>", "confidence": <0-100>}.')
    lines.append("No explanation, no markdown, no code fences.")
    return "\n".join(lines)


def _parse_response(text: str) -> tuple[str | None, int]:
    cleaned = text.strip()
    # Strip ```json fences if Claude added them despite the instruction.
    fenced = re.match(r"^```(?:json)?\s*(.*?)\s*```$", cleaned, re.DOTALL)
    if fenced:
        cleaned = fenced.group(1).strip()
    try:
        payload = json.loads(cleaned)
    except json.JSONDecodeError:
        logger.warning("scanner_ai: could not parse response %r", text)
        return None, 0
    slug = payload.get("slug")
    confidence_raw = payload.get("confidence", 0)
    try:
        confidence = max(0, min(100, int(confidence_raw)))
    except (TypeError, ValueError):
        confidence = 0
    if not isinstance(slug, str) or not slug.strip():
        return None, confidence
    return slug.strip(), confidence


def identify_food(
    image_bytes: bytes, media_type: str, recipes: list[RecipeRef]
) -> tuple[str | None, int]:
    """Return (slug, confidence) or (None, 0) when no key / no match.

    Confidence below CONFIDENCE_FLOOR is squashed to 0 so callers can show the
    "couldn't read this" state without needing to know the threshold.
    """
    client = _get_client()
    if client is None or not recipes:
        return None, 0

    encoded = base64.standard_b64encode(image_bytes).decode("ascii")
    try:
        response = client.messages.create(
            model=MODEL,
            max_tokens=MAX_TOKENS,
            system=[
                {
                    "type": "text",
                    "text": _build_system_prompt(recipes),
                    "cache_control": {"type": "ephemeral"},
                }
            ],
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": media_type,
                                "data": encoded,
                            },
                        },
                        {
                            "type": "text",
                            "text": "Identify this dish.",
                        },
                    ],
                }
            ],
        )
    except anthropic.APIError as exc:
        logger.warning("scanner_ai: API error %s", exc)
        return None, 0

    text_parts = [
        block.text for block in response.content if getattr(block, "type", None) == "text"
    ]
    text = "".join(text_parts)
    slug, confidence = _parse_response(text)
    if slug is None or confidence < CONFIDENCE_FLOOR:
        return None, 0
    allowed = {r.slug for r in recipes}
    if slug not in allowed:
        logger.info("scanner_ai: returned slug %r not in allowed set", slug)
        return None, 0
    return slug, confidence
