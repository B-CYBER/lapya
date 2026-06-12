from typing import Iterable


def filter_condition_safety(
    recipe_safety: dict[str, str] | None, user_conditions: Iterable[str]
) -> dict[str, str]:
    """Return only the keys in user_conditions, defaulting missing ones to 'safe'."""
    safety = recipe_safety or {}
    return {slug: safety.get(slug, "safe") for slug in user_conditions}
