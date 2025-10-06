from flask import Flask
from .extensions import db
from .config import Config
from .health.routes import bp as health_bp


def create_app(config_object=Config):
    app = Flask(__name__)
    app.config.from_object(config_object)

    db.init_app(app)

    app.register_blueprint(health_bp, url_prefix="/")

    return app
