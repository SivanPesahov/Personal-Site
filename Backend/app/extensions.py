from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_mail import Mail

db = SQLAlchemy()
ma = Marshmallow()
mail = Mail()

limiter = Limiter(
    key_func=get_remote_address,
    # default limits & storage will be read from app.config:
    # RATELIMIT_DEFAULT (e.g., "100 per hour")
    # RATELIMIT_STORAGE_URI (e.g., "memory://")
)
