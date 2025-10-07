from flask import Blueprint, request
from sqlalchemy import or_, func

from app.utils.responses import json_response
from app.models.models import Project, Comment
from app.projects.schemas import (
    ProjectListSchema,
    ProjectDetailSchema,
    CommentPublicSchema,
)

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
