from flask import Blueprint
from sqlalchemy import text
from app.extensions import db
from app.utils.responses import json_response

bp = Blueprint("health", __name__)


@bp.get("/health")
def health():

    db_ok = False
    db_error = None
    try:
        # Minimal round-trip: SELECT 1
        db.session.execute(text("SELECT 1"))
        db_ok = True
    except Exception as e:
        db_ok = False
        db_error = str(e)

    data = {
        "status": "ok",
        "db": {"ok": db_ok, "error": db_error},
    }
    # Return 200 even if DB check fails, keeping consistency with uptime monitors.
    return json_response(data=data, error=None, status=200)
