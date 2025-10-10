from flask import current_app
from flask_mail import Message
from app.extensions import mail


def send_contact_email(name: str, email: str, message: str) -> None:

    subject_prefix = current_app.config.get("MAIL_SUBJECT_PREFIX", "[Personal Site]")
    recipient = current_app.config.get("MAIL_TO")
    default_sender = current_app.config.get("MAIL_DEFAULT_SENDER")

    if not recipient:
        raise RuntimeError("MAIL_TO is not configured")

    subject = f"{subject_prefix} New Contact Message"

    body = (
        "New contact message received:\n\n"
        f"Name: {name}\n"
        f"Email: {email}\n\n"
        "Message:\n"
        f"{message}\n"
    )

    msg = Message(
        subject=subject,
        recipients=[recipient],
        body=body,
        sender=default_sender,
        reply_to=email or None,
    )

    mail.send(msg)
