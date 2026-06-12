from datetime import date

# Distilled from the Nigerian Multi-Morbidity Diet Guide — "Smart Cooking Tips".
# Each is safe across diabetes, hypertension, kidney, cholesterol and gout.
TIPS: list[str] = [
    "Swap the Maggi cube for fresh garlic, ginger, onion and scent leaf — your blood pressure will thank you.",
    "For kidney care, boil ugu or spinach for 5 minutes and pour the water away before cooking — it cuts the potassium.",
    "Keep palm oil to 1–2 tablespoons per pot, not a cup. A little goes a long way.",
    "One swallow portion is about the size of a tennis ball — fill the rest of the plate with vegetables.",
    "Grill, boil or steam your fish and chicken instead of frying — same protein, far less fat.",
    "Fresh catfish or tilapia has a fraction of the sodium of smoked or dried fish.",
    "Drink your zobo unsweetened — it helps lower blood pressure, cholesterol and uric acid.",
    "Squeeze fresh lemon or orange over fish and salads instead of reaching for the salt.",
    "Eat 3–4 smaller meals through the day instead of one big swallow — steadier blood sugar.",
    "Half your plate should be non-starchy vegetables, even when you eat rice or swallow.",
    "Soak dried beans 8–12 hours and change the water before cooking — gentler on the body.",
    "Take the salt shaker off the table. Table salt is a hidden source of too much sodium.",
    "Boil chicken bones with ginger, onion and garlic for a low-sodium stock — skip the bouillon.",
    "Even healthy starches like yam and unripe plantain add up — keep the portion modest.",
    "When buying packaged food, check the label: aim for under 200mg sodium per serving.",
]


def tip_for_today() -> str:
    return TIPS[date.today().toordinal() % len(TIPS)]
