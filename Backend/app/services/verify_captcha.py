from __future__ import annotations

from typing import Optional, Dict, Any
import requests
from flask import current_app

TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"
HCAPTCHA_VERIFY_URL = "https://hcaptcha.com/siteverify"


def verify_captcha(token: str, remote_ip: Optional[str] = None) -> bool:

    app = current_app

    if app.config.get("CAPTCHA_BYPASS", False):
        app.logger.debug("CAPTCHA_BYPASS=True -> skipping CAPTCHA verification.")
        return True

    if not token:
        app.logger.warning("CAPTCHA token missing.")
        return False

    provider = (app.config.get("CAPTCHA_PROVIDER") or "turnstile").lower()

    if provider == "turnstile":
        secret = app.config.get("TURNSTILE_SECRET")
        if not secret:
            app.logger.error("TURNSTILE_SECRET is not configured.")
            return False
        payload: Dict[str, Any] = {"secret": secret, "response": token}
        if remote_ip:
            payload["remoteip"] = remote_ip
        verify_url = TURNSTILE_VERIFY_URL

    elif provider == "hcaptcha":
        secret = app.config.get("HCAPTCHA_SECRET")
        if not secret:
            app.logger.error("HCAPTCHA_SECRET is not configured.")
            return False
        payload = {"secret": secret, "response": token}
        if remote_ip:
            payload["remoteip"] = remote_ip
        verify_url = HCAPTCHA_VERIFY_URL

    else:
        app.logger.error("Unknown CAPTCHA_PROVIDER: %s", provider)
        return False

    try:
        resp = requests.post(verify_url, data=payload, timeout=6)
        data = (
            resp.json()
            if resp.headers.get("content-type", "").startswith("application/json")
            else {}
        )
        success = bool(data.get("success"))
        if not success:
            app.logger.warning("CAPTCHA verification failed: %s", data)
        else:
            app.logger.debug("CAPTCHA verification success.")
        return success
    except Exception as e:
        app.logger.exception("CAPTCHA verification error: %s", e)
        return False
