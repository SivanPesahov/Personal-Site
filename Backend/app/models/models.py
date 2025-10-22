from sqlalchemy import func
from ..extensions import db


class Project(db.Model):
    __tablename__ = "project"

    id = db.Column(db.Integer, primary_key=True)
    slug = db.Column(db.String(255), unique=True, nullable=False, index=True)
    title = db.Column(db.String(255), nullable=False)
    short_description = db.Column(db.String(500))
    description_md = db.Column(db.Text)
    image_url_desktop = db.Column(db.String(255))
    image_url_mobile = db.Column(db.String(255))
    images_json = db.Column(db.Text)
    repo_url = db.Column(db.String(1024))
    live_url = db.Column(db.String(1024))

    comments = db.relationship(
        "Comment",
        back_populates="project",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    def __repr__(self) -> str:
        return f"<Project {self.slug}>"


class Comment(db.Model):
    __tablename__ = "comment"

    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(
        db.Integer,
        db.ForeignKey("project.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(320), nullable=False)
    content = db.Column(db.Text, nullable=False)

    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())

    project = db.relationship("Project", back_populates="comments")

    def __repr__(self) -> str:
        return f"<Comment {self.id} on project {self.project_id}>"


class ContactMessage(db.Model):
    __tablename__ = "contact_message"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(320), nullable=False)
    message = db.Column(db.Text, nullable=False)

    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())

    def __repr__(self) -> str:
        return f"<ContactMessage {self.id}>"


__all__ = [
    "Project",
    "Comment",
    "ContactMessage",
]
