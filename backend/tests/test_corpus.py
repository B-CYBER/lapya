"""Unit tests for the Nigerian corpus import helpers (pure functions)."""
from scripts.corpus_common import normalize_food_key, normalize_tokens, parse_calories, slugify
from scripts.import_nigerian_corpus import (
    classify_meal_type,
    derive_condition_safety,
    estimate_macros,
    match_image,
    rule_layer,
)


def test_parse_calories_handles_formats():
    assert parse_calories("216 per cup") == 216
    assert parse_calories("~250 per serving") == 250
    assert parse_calories("490-500 per wrap") == 495
    assert parse_calories("350–450 per cup") == 400  # en-dash range
    assert parse_calories("no number here") is None
    assert parse_calories(None) is None


def test_normalize_food_key_drops_qualifiers():
    assert normalize_food_key("Eba/Garri (large portions)") == "ebagarri"
    assert normalize_food_key("Efo Riro (little palm oil)") == "eforiro"


def test_slugify():
    assert slugify("Jollof Rice (Yoruba style)") == "jollof-rice-yoruba-style"
    assert slugify("Ofe Nsala") == "ofe-nsala"


def test_classify_meal_type_word_boundary():
    # "masa" must not match inside "Masara".
    assert classify_meal_type("Tuwo Masara", "Swallow / Staple") == "dinner"
    assert classify_meal_type("Masa", "Snack / Breakfast") == "breakfast"
    assert classify_meal_type("Jollof Rice", "Rice Dish") == "lunch"
    assert classify_meal_type("Ofe Onugbu", "Soup") == "dinner"
    assert classify_meal_type("Suya", "Street Food / BBQ") == "snack"


def test_rule_layer_offal_flags_cholesterol_and_gout():
    out = rule_layer("Nkwobi", "Delicacy", 350)
    assert out["cholesterol"] == "avoid"
    assert out["uric-acid"] == "avoid"
    assert out["heart"] == "avoid"


def test_rule_layer_swallow_flags_diabetes():
    assert rule_layer("Eba / Garri", "Swallow / Staple", 360).get("diabetes") == "caution"
    # Guide-recommended swallows are exempt.
    assert "diabetes" not in rule_layer("Oat Swallow", "Swallow", 200)


def test_rule_layer_weight_by_calories():
    assert rule_layer("Jollof Rice", "Rice Dish", 868)["weight"] == "avoid"
    assert rule_layer("Moin Moin", "Snack", 520)["weight"] == "caution"
    assert "weight" not in rule_layer("Ewedu Soup", "Soup", 120)


def test_derive_condition_safety_defaults_to_safe():
    eat = {"diabetes": ["efointoriro"]}
    avoid = {"diabetes": [("ebagarri", True)]}
    # Eba matches a soft avoid -> caution; unmatched dish -> {} (all safe).
    eba = derive_condition_safety("Eba / Garri", None, "Swallow", 360, eat, avoid)
    assert eba["diabetes"] == "caution"
    unknown = derive_condition_safety("Mystery Dish", None, "Soup", 150, eat, avoid)
    assert unknown == {}


def test_estimate_macros_carb_heavy_for_swallows():
    m = estimate_macros(400, "dinner", "Swallow / Staple")
    assert m["carbs"] > m["protein"]
    assert set(m) == {"protein", "carbs", "fat", "sodium_mg", "potassium_mg"}


def test_match_image_falls_back_by_meal_type():
    available = {"vegetable-soup", "pap-and-milk", "puff-puff", "boiled-rice-and-beans-with-sauce"}
    # No distinctive match -> dinner fallback.
    assert match_image("Miyan Zogale", None, "dinner", available).endswith("vegetable-soup.jpg")
    # Exact slug match wins.
    available.add("jollof-rice")
    assert match_image("Jollof Rice", None, "lunch", available).endswith("jollof-rice.jpg")
