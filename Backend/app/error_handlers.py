import logging
from flask import request
from werkzeug.exceptions import (
    HTTPException,
    TooManyRequests,
    NotFound,
    MethodNotAllowed,
)

from app.utils.responses import json_response


def register_error_handlers(app):
    logger = logging.getLogger(__name__)

    # 429 - Rate limited
    @app.errorhandler(TooManyRequests)
    def handle_rate_limit(e: TooManyRequests):
        # Try to extract Retry-After from the generated response (if exists)
        retry_after = None
        try:
            retry_after = e.get_response().headers.get("Retry-After")
        except Exception:
            retry_after = None

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

    # 404 - Not found
    @app.errorhandler(NotFound)
    def handle_not_found(e: NotFound):
        return json_response(
            data=None,
            error={
                "code": "NOT_FOUND",
                "message": "Resource not found.",
                "path": request.path,
            },
            status=404,
        )

    # 405 - Method not allowed
    @app.errorhandler(MethodNotAllowed)
    def handle_method_not_allowed(e: MethodNotAllowed):
        return json_response(
            data=None,
            error={
                "code": "METHOD_NOT_ALLOWED",
                "message": "Method not allowed for this endpoint.",
                "path": request.path,
            },
            status=405,
        )

    # Other HTTP exceptions (400, 401, 403, etc.) — unified shape
    @app.errorhandler(HTTPException)
    def handle_http_exception(e: HTTPException):
        # Avoid duplicating logic for 404/405/429 since they are already handled above.
        if isinstance(e, (NotFound, MethodNotAllowed, TooManyRequests)):
            raise e

        code_name = (e.name or "HTTP_ERROR").upper().replace(" ", "_")
        message = e.description or "HTTP error occurred."

        return json_response(
            data=None,
            error={
                "code": code_name,
                "message": message,
                "path": request.path,
            },
            status=getattr(e, "code", 400),
        )

    # Catch-all: any non-HTTP exceptions -> 500
    @app.errorhandler(Exception)
    def handle_unexpected_error(e: Exception):
        # Log full stacktrace for debugging/observability
        logger.exception("Unhandled exception on path %s: %s", request.path, e)

        return json_response(
            data=None,
            error={
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occurred.",
                "path": request.path,
            },
            status=500,
        )
