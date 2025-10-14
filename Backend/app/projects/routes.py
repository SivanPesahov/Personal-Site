from flask import Blueprint, request
from sqlalchemy import or_, func, desc
import bleach
from marshmallow import EXCLUDE

from app.utils.responses import json_response
from app.models.models import Project, Comment
from app.projects.schemas import (
    ProjectListSchema,
    ProjectDetailSchema,
    CommentPublicSchema,
    CommentCreateSchema,
)
from app.extensions import db, limiter
from app.services.verify_captcha import verify_captcha

bp = Blueprint("projects", __name__)


@bp.get("/")
def list_projects():
    q = (request.args.get("q") or "").strip()

    query = Project.query

    if q:
        ql = q.lower()
        query = query.filter(
            or_(
                func.lower(Project.title).like(f"%{ql}%"),
                func.lower(Project.short_description).like(f"%{ql}%"),
                func.lower(Project.description_md).like(f"%{ql}%"),
            )
        )

    query = query.order_by(Project.id.desc())

    items = query.all()

    data = ProjectListSchema(many=True).dump(items)
    return json_response(data=data, error=None, status=200)


@bp.get("/<string:slug>")
def get_project(slug: str):
    project = Project.query.filter_by(slug=slug).first()
    if not project:
        return json_response(
            data=None,
            error={"code": "NOT_FOUND", "message": "Project not found"},
            status=404,
        )

    comments = (
        Comment.query.filter_by(project_id=project.id)
        .order_by(Comment.created_at.desc())
        .all()
    )

    project_dict = ProjectDetailSchema().dump(project)
    project_dict["comments"] = CommentPublicSchema(many=True).dump(comments)

    return json_response(data=project_dict, error=None, status=200)


@bp.get("/<string:slug>/comments")
def get_project_comments(slug: str):
    project = Project.query.filter_by(slug=slug).first()
    if not project:
        return json_response(
            data=None,
            error={"code": "NOT_FOUND", "message": "Project not found"},
            status=404,
        )

    comments = (
        Comment.query.filter_by(project_id=project.id)
        .order_by(desc(Comment.created_at))
        .all()
    )

    data = CommentPublicSchema(many=True).dump(comments)
    return json_response(data=data, error=None, status=200)


@bp.post("/<string:slug>/comments")
@limiter.limit("5 per minute")
def create_project_comment(slug: str):

    project = Project.query.filter_by(slug=slug).first()
    if not project:
        return json_response(
            data=None,
            error={"code": "NOT_FOUND", "message": "Project not found"},
            status=404,
        )

    payload = request.get_json(silent=True) or {}
    print(payload)

    schema = CommentCreateSchema(unknown=EXCLUDE)
    errors = schema.validate(payload)
    print(errors)
    if errors:
        return json_response(
            data=None,
            error={"code": "VALIDATION_ERROR", "details": errors},
            status=400,
        )

    valid = schema.load(payload)

    # --- CAPTCHA verification ---
    token = payload.get("captcha_token")
    print("captcha_tokennnnnnnnnnnn")
    if not token:
        return json_response(
            data=None,
            error={"code": "CAPTCHA_REQUIRED", "message": "captcha_token is required"},
            status=400,
        )

    # detect client IP (supports proxy/CDN headers)
    remote_ip = (
        request.headers.get("CF-Connecting-IP")
        or (request.headers.get("X-Forwarded-For") or "").split(",")[0].strip()
        or request.remote_addr
    )

    ok = verify_captcha(token, remote_ip)
    if not ok:
        return json_response(
            data=None,
            error={"code": "CAPTCHA_FAILED", "message": "Captcha verification failed"},
            status=400,
        )
    # --- end CAPTCHA verification ---

    clean_name = bleach.clean(valid["name"], tags=[], attributes={}, strip=True)
    clean_email = bleach.clean(valid["email"], tags=[], attributes={}, strip=True)
    clean_content = bleach.clean(valid["content"], tags=[], attributes={}, strip=True)

    clean_name = " ".join(clean_name.split())
    clean_content = " ".join(clean_content.split())
    if not clean_content:
        return json_response(
            data=None,
            error={
                "code": "VALIDATION_ERROR",
                "details": {"content": ["Content is empty after sanitization"]},
            },
            status=400,
        )
    if not clean_name:
        return json_response(
            data=None,
            error={
                "code": "VALIDATION_ERROR",
                "details": {"name": ["Name is empty after sanitization"]},
            },
            status=400,
        )

    comment = Comment(
        project_id=project.id,
        name=clean_name,
        email=clean_email,
        content=clean_content,
    )
    db.session.add(comment)
    db.session.commit()

    data = CommentPublicSchema().dump(comment)
    return json_response(data=data, error=None, status=201)
