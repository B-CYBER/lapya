"""Nutrition chatbot — Claude Sonnet 4.6 with prompt caching.

When `ANTHROPIC_API_KEY` is unset the endpoint still works: it streams a
graceful "AI chat is offline" message so the UI behaves the same locally.
"""

import asyncio
from collections.abc import AsyncIterator
from datetime import date, timedelta

import anthropic
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.models.health_metric import HealthMetric
from app.models.meal_plan import MealPlanItem
from app.models.user import User
from app.models.user_condition import UserCondition
from app.models.user_preferences import UserPreferences
from app.schemas.chat import ChatMessage

MODEL = "claude-sonnet-4-6"
MAX_TOKENS = 1024

SYSTEM_INTRO = (
    "You are Lapya, a warm, knowledgeable Nigerian nutrition assistant. "
    "You help Nigerians living with multiple chronic conditions eat well using local foods "
    "they love (jollof, eba, moin moin, soups, plantain, etc.). "
    "Speak in plain English with the occasional respectful Nigerian phrase. "
    "Use local food measures (1 cigar cup, 1 mudu, 1 derica, hand-fistful) when giving portions. "
    "Always tailor advice to the user's conditions and severities below. "
    "Never claim to replace a doctor. Keep answers short — 2-4 short paragraphs max."
)


def _build_system_prompt(user: User, db: Session) -> str:
    prefs = db.scalar(select(UserPreferences).where(UserPreferences.user_id == user.id))
    conditions = db.scalars(
        select(UserCondition).where(UserCondition.user_id == user.id)
    ).all()
    today_meals = db.scalars(
        select(MealPlanItem)
        .where(MealPlanItem.user_id == user.id, MealPlanItem.date == date.today())
        .order_by(MealPlanItem.sort_order)
    ).all()
    week_ago = date.today() - timedelta(days=7)
    recent = db.scalars(
        select(HealthMetric)
        .where(HealthMetric.user_id == user.id)
        .where(HealthMetric.recorded_at >= week_ago)
        .order_by(HealthMetric.recorded_at.desc())
        .limit(10)
    ).all()

    blocks: list[str] = [SYSTEM_INTRO, ""]
    blocks.append(f"User: {user.first_name} ({user.role}, plan: {user.plan}).")
    if prefs:
        details = []
        if prefs.age:
            details.append(f"age {prefs.age}")
        if prefs.weight_kg:
            details.append(f"weight {prefs.weight_kg:g} kg")
        if prefs.region:
            details.append(f"region {prefs.region}")
        if details:
            blocks.append("Details: " + ", ".join(details) + ".")
        if prefs.allergies:
            blocks.append(f"Allergies: {prefs.allergies}.")
        if prefs.foods:
            blocks.append("Favourite foods: " + ", ".join(prefs.foods) + ".")

    if conditions:
        cond_list = ", ".join(f"{c.slug} ({c.severity})" for c in conditions)
        blocks.append(f"Conditions: {cond_list}.")

    if today_meals:
        meals_list = ", ".join(
            f"{i.meal_type}: {i.recipe.name}" for i in today_meals
        )
        blocks.append(f"Today's plan: {meals_list}.")

    if recent:
        latest_by_type: dict[str, str] = {}
        for m in recent:
            if m.metric_type in latest_by_type:
                continue
            if m.metric_type == "blood_pressure" and m.value_secondary is not None:
                latest_by_type[m.metric_type] = f"BP {int(m.value)}/{int(m.value_secondary)}"
            else:
                latest_by_type[m.metric_type] = (
                    f"{m.metric_type.replace('_', ' ')} {m.value:g} {m.unit}"
                )
        if latest_by_type:
            blocks.append("Recent metrics: " + "; ".join(latest_by_type.values()) + ".")

    return "\n".join(blocks)


_client_instance: anthropic.Anthropic | None = None


def _get_client() -> anthropic.Anthropic | None:
    """Lazy-instantiate the Anthropic client. Returns None if no API key is set."""
    global _client_instance
    if _client_instance is not None:
        return _client_instance
    settings = get_settings()
    if not settings.anthropic_api_key:
        return None
    _client_instance = anthropic.Anthropic(api_key=settings.anthropic_api_key)
    return _client_instance


async def _fallback_stream(user: User) -> AsyncIterator[bytes]:
    reply = (
        f"Hi {user.first_name}, the AI chat is offline because the server's "
        f"ANTHROPIC_API_KEY isn't set. Set it in backend/.env to wire Claude Sonnet 4.6."
    )
    for word in reply.split(" "):
        yield f"data: {word} \n\n".encode()
        await asyncio.sleep(0.02)
    yield b"data: [DONE]\n\n"


async def stream_chat(
    user: User, db: Session, messages: list[ChatMessage]
) -> AsyncIterator[bytes]:
    """Stream SSE chunks of the assistant reply."""
    client = _get_client()
    if client is None:
        async for chunk in _fallback_stream(user):
            yield chunk
        return

    system_prompt = _build_system_prompt(user, db)
    api_messages = [{"role": m.role, "content": m.content} for m in messages]

    try:
        with client.messages.stream(
            model=MODEL,
            max_tokens=MAX_TOKENS,
            system=[
                {
                    "type": "text",
                    "text": system_prompt,
                    "cache_control": {"type": "ephemeral"},
                }
            ],
            messages=api_messages,
        ) as stream:
            for text in stream.text_stream:
                if not text:
                    continue
                yield f"data: {text}\n\n".encode()
                await asyncio.sleep(0)
    except anthropic.APIError as exc:
        yield f"data: [error: {exc.__class__.__name__}]\n\n".encode()

    yield b"data: [DONE]\n\n"
