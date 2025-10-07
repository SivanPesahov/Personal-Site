from typing import Any, Optional
from flask import jsonify


def json_response(data: Any = None, error: Optional[dict] = None, status: int = 200):
    payload = {"data": data, "error": error}
    return jsonify(payload), status
