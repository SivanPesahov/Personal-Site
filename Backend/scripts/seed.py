# scripts/seed.py
from dotenv import load_dotenv

load_dotenv(dotenv_path=".env")

from app import create_app
from app.extensions import db
from app.models.models import Project, Comment

app = create_app()


def upsert_project(**kwargs):
    slug = kwargs["slug"]
    p = Project.query.filter_by(slug=slug).first()
    if p:
        for k, v in kwargs.items():
            setattr(p, k, v)
        return p
    p = Project(**kwargs)
    db.session.add(p)
    return p


with app.app_context():
    p1 = upsert_project(
        slug="crypto-streamer",
        title="Crypto Streamer",
        short_description="Realtime crypto dashboard with queues & caching",
        description_md="# Crypto Streamer\n\nRealtime prices, risers/fallers, details.",
        image_url="https://via.placeholder.com/800x400",
        repo_url="https://github.com/SivanPesahov/crypto-streamer",
        live_url="",
    )
    p2 = upsert_project(
        slug="taskify",
        title="Taskify",
        short_description="Task management with Kanban & analytics",
        description_md="Manage tasks efficiently with boards and filters.",
        image_url="https://picsum.photos/800/400",
        repo_url="https://github.com/SivanPesahov/Task-Management",
        live_url="",
    )
    db.session.commit()

    if not Comment.query.filter_by(project_id=p1.id).first():
        db.session.add(
            Comment(
                project_id=p1.id,
                name="Sivan",
                email="sivan@example.com",
                content="Awesome work!",
            )
        )
        db.session.commit()

    print("Seed done.")
