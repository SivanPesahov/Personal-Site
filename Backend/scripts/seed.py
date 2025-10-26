# scripts/seed.py
from dotenv import load_dotenv
import json

# Load .env from project root when running: `python scripts/seed.py`
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
    # --- Projects ---
    p1 = upsert_project(
        slug="crypto-streamer",
        title="Crypto Streamer",
        short_description="Realtime crypto dashboard with queues & caching",
        description_md=(
            "# Crypto Streamer\n\n"
            "Next.js App Router + RabbitMQ + Redis + MySQL + Prisma.\n"
            "Realtime prices, risers/fallers, and 7-day history persisted to DB."
        ),
        image_url_desktop="https://res.cloudinary.com/dipx5fuza/image/upload/v1760530334/Screenshot_2025-08-25_at_16.18.39_m9mtq9.png",
        image_url_mobile="https://res.cloudinary.com/dipx5fuza/image/upload/v1761128257/Screenshot_2025-10-22_at_13.17.05_o7nt40.png",
        repo_url="https://github.com/SivanPesahov/crypto-streamer",
        live_url="",
        images_json=json.dumps(
            [
                "https://res.cloudinary.com/dipx5fuza/image/upload/v1760530334/Screenshot_2025-08-29_at_17.00.25_eodu7u.png",
                "https://res.cloudinary.com/dipx5fuza/image/upload/v1760530334/Screenshot_2025-08-29_at_16.58.48_afpgkt.png",
            ]
        ),
    )

    p2 = upsert_project(
        slug="taskify",
        title="Taskify",
        short_description="Task management with Kanban & analytics",
        description_md=(
            "# Taskify\n\n"
            "Task manager that Includes task creation, categorization, and real-time updates. Built with React, Node + Express, and MongoDB."
        ),
        image_url_desktop="https://res.cloudinary.com/dipx5fuza/image/upload/v1760530336/Screenshot_2025-09-01_at_13.35.41_zdp1jy.png",
        image_url_mobile="https://res.cloudinary.com/dipx5fuza/image/upload/v1761127784/Screenshot_2025-10-22_at_13.09.11_wkwiju.png",
        repo_url="https://github.com/SivanPesahov/Task-Management",
        live_url="https://task-management-e4on.onrender.com/",
        images_json=json.dumps(
            [
                "https://res.cloudinary.com/dipx5fuza/image/upload/v1760530337/Screenshot_2025-09-01_at_13.34.36_exprld.png",
                "https://res.cloudinary.com/dipx5fuza/image/upload/v1760530337/Screenshot_2025-09-01_at_13.36.39_b56jiw.png",
                "https://res.cloudinary.com/dipx5fuza/image/upload/v1760530337/Screenshot_2025-09-01_at_13.36.58_a5cvu0.png",
                "https://res.cloudinary.com/dipx5fuza/image/upload/v1760530336/Screenshot_2025-09-01_at_13.35.09_aiyyf1.png",
                "https://res.cloudinary.com/dipx5fuza/image/upload/v1760530335/Screenshot_2025-09-01_at_13.36.14_ucb8wx.png",
                "https://res.cloudinary.com/dipx5fuza/image/upload/v1760530334/Screenshot_2025-09-01_at_13.35.58_lk0for.png",
            ]
        ),
    )

    p3 = upsert_project(
        slug="relyon-landing",
        title="Relyon Landing",
        short_description="Product landing page with clean UX & SEO",
        description_md=(
            "# Relyon Landing\n\n"
            "Marketing landing with responsive layout, SEO meta, and mobile-first design. Built with Next.js."
        ),
        image_url_desktop="https://res.cloudinary.com/dipx5fuza/image/upload/v1760530336/Screenshot_2025-08-25_at_16.46.12_yi6jf5.png",
        image_url_mobile="https://res.cloudinary.com/dipx5fuza/image/upload/v1760530336/Screenshot_2025-08-25_at_16.46.12_yi6jf5.png",
        repo_url="",
        live_url="https://www.relyon.ai/",
        images_json=json.dumps(
            [
                "https://res.cloudinary.com/dipx5fuza/image/upload/v1760530990/Screenshot_2025-10-15_at_15.23.03_lmrjjp.png",
                "https://res.cloudinary.com/dipx5fuza/image/upload/v1760530960/Screenshot_2025-10-15_at_15.22.35_ge6nga.png",
                "https://res.cloudinary.com/dipx5fuza/image/upload/v1760530933/Screenshot_2025-10-15_at_15.22.05_uzgds1.png",
            ]
        ),
    )

    p4 = upsert_project(
        slug="job-flow",
        title="Job Flow",
        short_description="AI-powered job tracking app for smarter career management",
        description_md=(
            "# Job Flow\n\n"
            "An AI-powered application for job seekers to track applications, "
            "get AI insights, and optimize job search strategies.\n\n"
            "Built with React, Node.js, TypeScript, Express, MongoDB, and ShadCN UI."
        ),
        image_url_desktop="https://res.cloudinary.com/dipx5fuza/image/upload/v1761481848/Screenshot_2025-10-26_at_14.30.42_ffraku.png",
        image_url_mobile="https://res.cloudinary.com/dipx5fuza/image/upload/v1761481899/Screenshot_2025-10-26_at_14.31.35_xjccem.png",
        repo_url="https://github.com/SivanPesahov/Job-Flow",
        live_url="",
        images_json=json.dumps(
            [
                "https://res.cloudinary.com/dipx5fuza/image/upload/v1761481848/Screenshot_2025-10-26_at_14.30.42_ffraku.png"
            ]
        ),
    )

    db.session.commit()

    # --- Comments (approved demo) ---
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

    print("Seed done: upserted projects and an approved comment.")
