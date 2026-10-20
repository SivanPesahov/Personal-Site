"""
One-off data migration: copy rows from the old Railway MySQL database into
the new Postgres database (Supabase / Neon), preserving primary keys and
foreign-key integrity, then fixing up Postgres's auto-increment sequences.

Run this AFTER `alembic upgrade head` has created the schema on the new
Postgres database, and BEFORE you point the live app at it.

Usage:
    pip install pymysql                 # source driver, not in requirements.txt
    SOURCE_DATABASE_URL="mysql+pymysql://user:pass@crossover.proxy.rlwy.net:PORT/railway?charset=utf8mb4" \
    TARGET_DATABASE_URL="postgresql+psycopg://user:pass@HOST:5432/DBNAME" \
    python scripts/migrate_mysql_to_postgres.py

Both URLs can also be passed as CLI args:
    python scripts/migrate_mysql_to_postgres.py <source_url> <target_url>
"""
import os
import sys

from sqlalchemy import MetaData, Table, Column, Integer, String, Text, DateTime, create_engine, text
from sqlalchemy.orm import sessionmaker

# Tables in FK-safe insert order: parents before children.
metadata = MetaData()

project = Table(
    "project",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("slug", String(255)),
    Column("title", String(255)),
    Column("short_description", String(500)),
    Column("description_md", Text),
    Column("image_url_desktop", String(255)),
    Column("image_url_mobile", String(255)),
    Column("images_json", Text),
    Column("repo_url", String(1024)),
    Column("live_url", String(1024)),
)

comment = Table(
    "comment",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("project_id", Integer),
    Column("name", String(255)),
    Column("email", String(320)),
    Column("content", Text),
    Column("created_at", DateTime),
)

contact_message = Table(
    "contact_message",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("name", String(255)),
    Column("email", String(320)),
    Column("message", Text),
    Column("created_at", DateTime),
)

TABLES_IN_ORDER = [project, comment, contact_message]


def get_urls():
    args = sys.argv[1:]
    if len(args) == 2:
        return args[0], args[1]
    source = os.environ.get("SOURCE_DATABASE_URL")
    target = os.environ.get("TARGET_DATABASE_URL")
    if not source or not target:
        print(
            "Set SOURCE_DATABASE_URL and TARGET_DATABASE_URL env vars, "
            "or pass them as two CLI args.",
            file=sys.stderr,
        )
        sys.exit(1)
    return source, target


def main():
    source_url, target_url = get_urls()

    source_engine = create_engine(source_url)
    target_engine = create_engine(target_url)
    TargetSession = sessionmaker(bind=target_engine)

    with source_engine.connect() as src_conn, TargetSession() as dst:
        for table in TABLES_IN_ORDER:
            rows = src_conn.execute(table.select()).mappings().all()
            if not rows:
                print(f"{table.name}: 0 rows, skipping")
                continue

            dst.execute(table.delete())  # idempotent re-runs
            dst.execute(table.insert(), [dict(r) for r in rows])
            dst.commit()
            print(f"{table.name}: copied {len(rows)} rows")

        # Postgres SERIAL/IDENTITY sequences don't know about the ids we
        # just inserted explicitly — bump each one past the current max id.
        for table in TABLES_IN_ORDER:
            dst.execute(
                text(
                    f"SELECT setval(pg_get_serial_sequence('{table.name}', 'id'), "
                    f"COALESCE((SELECT MAX(id) FROM {table.name}), 1), "
                    f"(SELECT COUNT(*) FROM {table.name}) > 0)"
                )
            )
        dst.commit()
        print("Sequences reset. Migration complete.")


if __name__ == "__main__":
    main()
