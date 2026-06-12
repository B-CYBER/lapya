"""Email delivery — Jinja templates + aiosmtplib.

When `SMTP_HOST` is unset (or any send fails), the message is logged to stdout
instead so dev still observes what would have been sent. Production sets the
SMTP_* env vars to point at a real host.

All senders go through `send_email_template`; individual templates live under
`app/email_templates/`.
"""

import logging
from email.message import EmailMessage
from pathlib import Path
from typing import Any

import aiosmtplib
from jinja2 import Environment, FileSystemLoader, select_autoescape

from app.core.config import get_settings

logger = logging.getLogger("lapya.email")

_TEMPLATE_DIR = Path(__file__).parent.parent / "email_templates"
_env = Environment(
    loader=FileSystemLoader(_TEMPLATE_DIR),
    autoescape=select_autoescape(["html"]),
    keep_trailing_newline=True,
)


def _render(template_name: str, context: dict[str, Any]) -> tuple[str, str]:
    """Render template_name.txt; the first line is the subject, the rest is the body."""
    template = _env.get_template(f"{template_name}.txt")
    rendered = template.render(**context)
    lines = rendered.split("\n", 1)
    subject = lines[0].strip()
    body = lines[1].lstrip("\n") if len(lines) > 1 else ""
    return subject, body


async def send_email_template(to: str, template_name: str, context: dict[str, Any]) -> None:
    settings = get_settings()
    subject, text_body = _render(template_name, context)

    if not settings.smtp_host:
        # Dev fallback: log instead of send.
        logger.warning(
            "[email-stdout] no SMTP_HOST set; would send to=%s subject=%s\n--\n%s\n--",
            to,
            subject,
            text_body,
        )
        return

    msg = EmailMessage()
    msg["From"] = settings.smtp_from
    msg["To"] = to
    msg["Subject"] = subject
    msg.set_content(text_body)

    try:
        await aiosmtplib.send(
            msg,
            hostname=settings.smtp_host,
            port=settings.smtp_port,
            username=settings.smtp_user or None,
            password=settings.smtp_password or None,
            start_tls=False,
        )
    except Exception as exc:  # noqa: BLE001
        logger.error(
            "[email-failed] to=%s subject=%s err=%s — falling back to stdout\n--\n%s\n--",
            to,
            subject,
            exc,
            text_body,
        )
