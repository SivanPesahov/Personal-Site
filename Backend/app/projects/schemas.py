from marshmallow import Schema, fields


class ProjectListSchema(Schema):
    id = fields.Int()
    slug = fields.Str()
    title = fields.Str()
    short_description = fields.Str(allow_none=True)
    image_url = fields.Str(allow_none=True)
    repo_url = fields.Str(allow_none=True)
    live_url = fields.Str(allow_none=True)


class CommentPublicSchema(Schema):
    id = fields.Int()
    name = fields.Str()
    content = fields.Str()
    created_at = fields.DateTime()


class ProjectDetailSchema(Schema):
    id = fields.Int()
    slug = fields.Str()
    title = fields.Str()
    short_description = fields.Str(allow_none=True)
    description_md = fields.Str(allow_none=True)
    image_url = fields.Str(allow_none=True)
    repo_url = fields.Str(allow_none=True)
    live_url = fields.Str(allow_none=True)
    # comments will be injected in the route as approved-only list
    comments = fields.List(fields.Nested(CommentPublicSchema))
