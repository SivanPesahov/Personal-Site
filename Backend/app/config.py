# path: Backend/app/config.py
import os


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

    # Rate limit ברירת מחדל (נשתמש מאוחר יותר)
    RATELIMIT_DEFAULT = os.getenv("RATELIMIT_DEFAULT", "100/hour")

    # חיבור ל-MySQL (נשתמש בהמשך עם SQLAlchemy)
    # פורמט: mysql+pymysql://USER:PASSWORD@HOST:3306/DBNAME?charset=utf8mb4
    DATABASE_URL = os.getenv("DATABASE_URL", "")
