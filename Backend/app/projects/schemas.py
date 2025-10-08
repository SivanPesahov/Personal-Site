from marshmallow import Schema, fields, validate, pre_load, post_dump


class ProjectListSchema(Schema):
    id = fields.Int()
    slug = fields.Str()
    title = fields.Str()
    short_description = fields.Str(allow_none=True)
    image_url = fields.Str(allow_none=True)
    repo_url = fields.Str(allow_none=True)
    live_url = fields.Str(allow_none=True)


class CommentPublicSchema(Schema):
    id = fields.Int(required=True)
    name = fields.Str(required=True)
    content = fields.Str(required=True)
    created_at = fields.DateTime(required=True)

    @post_dump
    def normalize(self, data, **kwargs):
        for key in ("name", "content"):
            if key in data and isinstance(data[key], str):
                data[key] = " ".join(data[key].split())
        return data


class ProjectDetailSchema(Schema):
    id = fields.Int()
    slug = fields.Str()
    title = fields.Str()
    short_description = fields.Str(allow_none=True)
    description_md = fields.Str(allow_none=True)
    image_url = fields.Str(allow_none=True)
    repo_url = fields.Str(allow_none=True)
    live_url = fields.Str(allow_none=True)
    comments = fields.List(fields.Nested(CommentPublicSchema))


class CommentCreateSchema(Schema):
    name = fields.String(
        required=True,
        validate=validate.Length(min=2, max=120),
    )
    email = fields.Email(required=True)
    content = fields.String(
        required=True,
        validate=validate.Length(min=1, max=2000),
    )

    @pre_load
    def strip_fields(self, data, **kwargs):
        for key in ("name", "email", "content"):
            if key in data and isinstance(data[key], str):
                data[key] = data[key].strip()
        return data
