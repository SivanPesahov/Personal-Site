import os
from dotenv import load_dotenv

# Load .env from the project root (Backend/.env)
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
load_dotenv(dotenv_path=os.path.join(BASE_DIR, ".env"))


class Config:
    # סביבה ודיבאג
    ENV = os.getenv("FLASK_ENV", "development")
    DEBUG = os.getenv("FLASK_DEBUG", "1") == "1"

    # סוד לאפליקציה (להחליף בפרודקשן)
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-change-me")

    # דומיינים מותרים ל-CORS (נשתמש מאוחר יותר)
    CORS_ORIGINS = [
        o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
    ]

    # Rate limit ברירת מחדל (נשתמש כבר עכשיו)
    RATELIMIT_DEFAULT = os.getenv("RATELIMIT_DEFAULT", "100 per hour")
    # אחסון מגבלות (לזיכרון מקומי; נשתמש ב־Redis בפרודקשן)
    RATELIMIT_STORAGE_URI = os.getenv("RATELIMIT_STORAGE_URI", "memory://")

    # חיבור ל-MySQL (נשתמש בהמשך עם SQLAlchemy)
    # פורמט: mysql+pymysql://USER:PASSWORD@HOST:3306/DBNAME?charset=utf8mb4
    DATABASE_URL = os.getenv("DATABASE_URL", "")

    # SQLAlchemy configuration
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = os.getenv("SQLALCHEMY_ECHO", "0") == "1"


class DevConfig(Config):
    DEBUG = True


class ProdConfig(Config):
    DEBUG = False
