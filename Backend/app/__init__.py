from flask import Flask
from .config import Config
from .health.routes import bp as health_bp


def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)

    app.register_blueprint(health_bp, url_prefix="/")

    return app
