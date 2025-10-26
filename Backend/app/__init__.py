from flask import Flask
from .extensions import db, ma, limiter, mail, cors
from .config import Config
from .health.routes import bp as health_bp
from .projects.routes import bp as projects_bp
from app.error_handlers import register_error_handlers
from .contact.routes import bp as contact_bp
import logging
from logging.handlers import RotatingFileHandler


def create_app(config_object=Config):
    app = Flask(__name__)
    app.config.from_object(config_object)
    # Accept routes with and without a trailing slash to avoid 308 redirects (helps with CORS across origins)
    app.url_map.strict_slashes = False

    # --- Logging setup ---
    log_formatter = logging.Formatter(
        "%(asctime)s [%(levelname)s] %(name)s - %(message)s", "%Y-%m-%d %H:%M:%S"
    )

    # File handler (rotating)
    file_handler = RotatingFileHandler(
        "app.log", maxBytes=1_000_000, backupCount=5, encoding="utf-8"
    )
    file_handler.setFormatter(log_formatter)
    file_handler.setLevel(logging.INFO)

    # Console handler
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(log_formatter)
    console_handler.setLevel(logging.INFO)

    # Root logger setup
    app.logger.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
    app.logger.addHandler(console_handler)

    app.logger.info("✅ Flask app initialized and logging configured.")
    # --- End Logging setup ---

    db.init_app(app)
    ma.init_app(app)
    limiter.init_app(app)
    mail.init_app(app)
    # --- CORS init ---
    # Parse comma-separated CORS_ORIGINS from env/config, or allow "*" in debug
    origins_raw = app.config.get("CORS_ORIGINS", "*")
    if isinstance(origins_raw, str):
        origins = (
            "*"
            if origins_raw.strip() == "*"
            else [o.strip() for o in origins_raw.split(",") if o.strip()]
        )
    else:
        origins = origins_raw

    is_debug = bool(app.config.get("DEBUG"))
    use_wildcard = is_debug and origins != "*"

    cors.init_app(
        app,
        resources={
            r"/api/*": {"origins": "*" if use_wildcard else origins},
            r"/health": {"origins": "*" if use_wildcard else origins},
        },
        supports_credentials=(
            False if use_wildcard else app.config["CORS_SUPPORTS_CREDENTIALS"]
        ),
        allow_headers=app.config["CORS_ALLOW_HEADERS"],
        methods=app.config["CORS_METHODS"],
        max_age=app.config["CORS_MAX_AGE"],
        expose_headers=[],
    )
    # --- end CORS ---

    # --- Rate-limit default ---
    limiter.default_limits = [app.config.get("RATELIMIT_DEFAULT", "100 per hour")]
    limiter.storage_uri = app.config.get("RATELIMIT_STORAGE_URI", "memory://")
    # --- end Rate-limit ---

    register_error_handlers(app)

    app.register_blueprint(health_bp, url_prefix="/")
    app.register_blueprint(projects_bp, url_prefix="/api/projects")
    app.register_blueprint(contact_bp, url_prefix="/api/contact")

    return app
