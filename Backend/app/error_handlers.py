from flask import request
from werkzeug.exceptions import TooManyRequests

from app.utils.responses import json_response


def register_error_handlers(app):
    @app.errorhandler(TooManyRequests)
    def handle_rate_limit(e: TooManyRequests):
        retry_after = e.get_response().headers.get("Retry-After")
        return json_response(
            data=None,
            error={
                "code": "RATE_LIMITED",
                "message": "Too many requests. Please slow down.",
                "retry_after": retry_after,
                "path": request.path,
            },
            status=429,
        )
