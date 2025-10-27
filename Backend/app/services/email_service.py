from __future__ import annotations
from flask import current_app
from markupsafe import escape
import requests

BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email"


def _render_text(name: str, email: str, message: str) -> str:
    return f"New contact message from {name} <{email}>\n\n{message}\n"


def _render_html(name: str, email: str, message: str) -> str:
    safe_name = escape(name)
    safe_email = escape(email)
    safe_msg = escape(message).replace("\n", "<br>")
    return (
        f"<p><strong>New contact message</strong></p>"
        f"<p>From: {safe_name} &lt;{safe_email}&gt;</p>"
        f"<hr>"
        f"<p>{safe_msg}</p>"
    )


def send_contact_email(*, name: str, email: str, message: str) -> None:
    """Send contact email using Brevo (Sendinblue) REST API."""
    api_key = current_app.config.get("BREVO_API_KEY")
    sender = current_app.config.get("MAIL_DEFAULT_SENDER")
    to_email = current_app.config.get("MAIL_TO")
    subject_prefix = current_app.config.get("MAIL_SUBJECT_PREFIX", "[Contact]")

    if not api_key:
        raise RuntimeError("BREVO_API_KEY is not configured")
    if not sender or not to_email:
        raise RuntimeError("MAIL_DEFAULT_SENDER / MAIL_TO are not configured")

    payload = {
        "sender": {"email": sender},
        "to": [{"email": to_email}],
        "subject": f"{subject_prefix} New message from {name}",
        "textContent": _render_text(name, email, message),
        "htmlContent": _render_html(name, email, message),
        "headers": {"X-Source-App": "personal-site"},
    }

    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": api_key,
    }

    current_app.logger.info("[email] Sending via Brevo API...")
    resp = requests.post(BREVO_ENDPOINT, json=payload, headers=headers, timeout=10)
    if resp.status_code >= 400:
        current_app.logger.error(
            "[email] Brevo error %s: %s", resp.status_code, resp.text[:500]
        )
        resp.raise_for_status()
    current_app.logger.info("[email] Brevo send OK")
