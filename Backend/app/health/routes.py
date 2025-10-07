from flask import Blueprint, jsonify
from app.utils.responses import json_response

bp = Blueprint("health", __name__)


@bp.get("/health")
def health():
    return json_response(data="ok", error=None, status=200)
