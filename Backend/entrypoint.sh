#!/usr/bin/env bash
set -euo pipefail

echo "⏳ Waiting for DB to be ready..."
# נסה התחברות ל-DB בלולאה (עד ~30 שניות)
for i in {1..30}; do
  if python - <<'PYCODE'
from app.extensions import db
from sqlalchemy import text
try:
    db.session.execute(text("SELECT 1"))
    print("DB OK")
except Exception as e:
    raise SystemExit(1)
PYCODE
  then
    echo "✅ DB is reachable."
    break
  else
    echo "… DB not ready yet, retrying ($i/30)"
    sleep 1
  fi
done

echo "📦 Running Alembic migrations..."
alembic upgrade head

echo "🚀 Starting Gunicorn..."
PORT=${PORT:-8000}
echo "🌐 Binding Gunicorn on port ${PORT}" && exec gunicorn --workers 3 --bind 0.0.0.0:${PORT} --timeout 60 'app:create_app()'