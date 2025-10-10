from flask import Flask
from .extensions import db, ma, limiter, mail
from .config import Config
from .health.routes import bp as health_bp
from .projects.routes import bp as projects_bp
from app.error_handlers import register_error_handlers
from .contact.routes import bp as contact_bp


def create_app(config_object=Config):
    app = Flask(__name__)
    app.config.from_object(config_object)

    db.init_app(app)
    ma.init_app(app)
    limiter.init_app(app)
    mail.init_app(app)
    register_error_handlers(app)

    app.register_blueprint(health_bp, url_prefix="/")
    app.register_blueprint(projects_bp, url_prefix="/api/projects")
    app.register_blueprint(contact_bp, url_prefix="/api/contact")

    return app
