from flask import Blueprint, request, jsonify, current_app
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime
import bleach
import re
import socket

from app.extensions import db, limiter
from app.models import ContactMessage
from .schemas import ContactCreateSchema, ContactPublicSchema
from app.services.email_service import send_contact_email
from app.services.verify_captcha import verify_captcha

bp = Blueprint("contact", __name__)
create_schema = ContactCreateSchema()
public_schema = ContactPublicSchema()

_ws_re = re.compile(r"\s+")


def sanitize_text(value: str) -> str:

    cleaned = bleach.clean(text=value, tags=[], attributes={}, protocols=[], strip=True)
    cleaned = _ws_re.sub(" ", cleaned).strip()
    return cleaned


@bp.route("", methods=["POST"])
@limiter.limit("3 per minute")
def create_contact_message():

    json_data = request.get_json(silent=True) or {}
    current_app.logger.info(
        "[contact] received payload: keys=%s", list((json_data or {}).keys())
    )

    errors = create_schema.validate(json_data)
    if errors:
        return (
            jsonify(
                {"data": None, "error": {"code": "VALIDATION_ERROR", "details": errors}}
            ),
            400,
        )

    name = json_data.get("name", "")
    email = json_data.get("email", "")
    message = json_data.get("message", "")

    # ---- CAPTCHA verification ----
    token = json_data.get("captcha_token")

    # Try common headers for client IP (useful behind proxies / Cloudflare), fallback to remote_addr
    xff = request.headers.get("X-Forwarded-For", "")
    cf_ip = request.headers.get("CF-Connecting-IP")
    remote_ip = (
        cf_ip or (xff.split(",")[0].strip() if xff else None)
    ) or request.remote_addr

    current_app.logger.info("[contact] verifying captcha (ip=%s)", remote_ip)

    if not verify_captcha(token=token, remote_ip=remote_ip):
        current_app.logger.warning("[contact] captcha failed")
        return (
            jsonify(
                {
                    "data": None,
                    "error": {
                        "code": "CAPTCHA_FAILED",
                        "message": "Captcha verification failed.",
                    },
                }
            ),
            400,
        )
    current_app.logger.info("[contact] captcha ok")
    # ---- end CAPTCHA verification ----

    name_clean = sanitize_text(name)
    message_clean = sanitize_text(message)

    if not name_clean or not message_clean:
        return (
            jsonify(
                {
                    "data": None,
                    "error": {
                        "code": "EMPTY_AFTER_SANITIZE",
                        "message": "Message or name empty after sanitization.",
                    },
                }
            ),
            400,
        )

    try:
        cm = ContactMessage(
            name=name_clean,
            email=email.strip(),
            message=message_clean,
            created_at=datetime.utcnow(),
        )
        db.session.add(cm)
        db.session.commit()
    except SQLAlchemyError:
        db.session.rollback()
        return (
            jsonify(
                {
                    "data": None,
                    "error": {"code": "DB_ERROR", "message": "Failed to save message."},
                }
            ),
            500,
        )

    if current_app.config.get("MAIL_SUPPRESS_SEND", False):
        current_app.logger.info(
            "[contact] MAIL_SUPPRESS_SEND=true -> skipping SMTP and returning success"
        )
        return jsonify({"data": public_schema.dump(cm), "error": None}), 201

    try:
        prev_to = socket.getdefaulttimeout()
        socket.setdefaulttimeout(5)
        current_app.logger.info("[contact] sending email via provider=brevo…")
        send_contact_email(name=name_clean, email=email.strip(), message=message_clean)
        current_app.logger.info("[contact] email sent")
    except Exception as e:
        current_app.logger.exception("[contact] Failed to send contact email: %s", e)
    finally:
        socket.setdefaulttimeout(prev_to)

    return jsonify({"data": public_schema.dump(cm), "error": None}), 201
