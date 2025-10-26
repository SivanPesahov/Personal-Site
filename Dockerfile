# Root-level Dockerfile for Railway
FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_NO_CACHE_DIR=1

RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      build-essential \
      curl \
      libffi-dev \
      libssl-dev \
 && rm -rf /var/lib/apt/lists/*

# non-root
RUN useradd -m -u 10001 appuser
WORKDIR /app

# ---- deps (from Backend) ----
COPY Backend/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt \
 && pip install --no-cache-dir "gunicorn==21.*"

# ---- app code (from Backend) ----
COPY Backend/alembic.ini /app/alembic.ini
COPY Backend/migrations /app/migrations
COPY Backend/app /app/app
COPY Backend/scripts /app/scripts
COPY Backend/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# perms
RUN chown -R appuser:appuser /app
USER appuser

EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s CMD curl -fsS http://127.0.0.1:8000/health || exit 1

ENTRYPOINT ["/app/entrypoint.sh"]
CMD []