from __future__ import annotations

from flask import current_app
from markupsafe import escape
from flask_mail import Message

# We use the global Flask-Mail instance configured in the app
# (created in app/extensions.py and initialized in app/__init__.py)
from app.extensions import mail


def _render_text(name: str, email: str, message: str) -> str:
    return f"New contact message from {name} &lt;{email}&gt;\n\n" f"{message}\n"


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
    """
    Send contact email using Flask‑Mail (SMTP).
    SMTP settings are taken from the app config:

      MAIL_SERVER=smtp-relay.brevo.com
      MAIL_PORT=587
      MAIL_USE_TLS=True
      MAIL_USE_SSL=False
      MAIL_USERNAME=&lt;your Brevo SMTP login&gt;
      MAIL_PASSWORD=&lt;your Brevo SMTP key/password&gt;
      MAIL_DEFAULT_SENDER=&lt;verified sender email in Brevo&gt;
      MAIL_TO=&lt;destination address&gt;
      MAIL_SUBJECT_PREFIX=[Portfolio Contact] (optional)
    """
    sender = current_app.config.get("MAIL_DEFAULT_SENDER")
    to_email = current_app.config.get("MAIL_TO")
    subject_prefix = current_app.config.get("MAIL_SUBJECT_PREFIX", "[Contact]")

    if not sender or not to_email:
        raise RuntimeError("MAIL_DEFAULT_SENDER / MAIL_TO are not configured")

    subject = f"{subject_prefix} New message from {name}"

    msg = Message(
        subject=subject,
        sender=sender,
        recipients=[to_email],
    )
    msg.body = _render_text(name, email, message)
    msg.html = _render_html(name, email, message)

    current_app.logger.info("[email] Sending via SMTP (Flask‑Mail)…")
    # Flask‑Mail handles connection/retry based on app config
    mail.send(msg)
    current_app.logger.info("[email] SMTP send OK")
