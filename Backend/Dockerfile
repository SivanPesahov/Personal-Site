# ---------- Base ----------
    FROM python:3.13-slim AS base

    # הגדרות סביבת Python ו-Pip
    ENV PYTHONDONTWRITEBYTECODE=1 \
        PYTHONUNBUFFERED=1 \
        PIP_DISABLE_PIP_VERSION_CHECK=1 \
        PIP_NO_CACHE_DIR=1
    
    # התקנות מערכת מינימליות (כולל curl ל-HEALTHCHECK)
    RUN apt-get update \
     && apt-get install -y --no-install-recommends \
          build-essential \
          curl \
          libffi-dev \
          libssl-dev \
     && rm -rf /var/lib/apt/lists/*
    
    # יצירת משתמש לא-רוט
    RUN useradd -m -u 10001 appuser
    
    # תיקיית העבודה בתוך הקונטיינר
    WORKDIR /app
    
    # התקנת תלויות: קודם requirements לקאשינג יעיל
    COPY requirements.txt /app/requirements.txt
    RUN pip install --no-cache-dir -r requirements.txt \
     && pip install --no-cache-dir "gunicorn==21.*"
    
    # העתקת שאר קוד האפליקציה (כולל app/, migrations, alembic.ini, scripts)
    COPY . /app

    COPY entrypoint.sh /app/entrypoint.sh
    RUN chmod +x /app/entrypoint.sh
    
    # הרשאות למשתמש הלא-רוט
    RUN chown -R appuser:appuser /app
    USER appuser
    
    # פורט פנימי עליו Gunicorn יאזין
    EXPOSE 8000
    
    # HEALTHCHECK: קריאה ל-/health
    HEALTHCHECK --interval=30s --timeout=5s --start-period=20s CMD curl -fsS http://127.0.0.1:8000/health || exit 1
    
    ENTRYPOINT ["/app/entrypoint.sh"]
    CMD []