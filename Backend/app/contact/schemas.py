from marshmallow import Schema, fields, validates, ValidationError
from marshmallow.validate import Length, Email
import re

_ws_re = re.compile(r"\s+")


class ContactCreateSchema(Schema):
    name = fields.Str(required=True, validate=Length(min=2, max=120))
    email = fields.Email(required=True, validate=Email())
    message = fields.Str(required=True, validate=Length(min=5, max=5000))
    captcha_token = fields.Str(required=False, allow_none=True)

    @validates("name")
    def validate_name(self, value: str, **kwargs):
        if not _ws_re.sub(" ", value).strip():
            raise ValidationError("Name cannot be empty.")

    @validates("message")
    def validate_message(self, value: str, **kwargs):
        if not _ws_re.sub(" ", value).strip():
            raise ValidationError("Message cannot be empty.")


class ContactPublicSchema(Schema):
    id = fields.Int()
    name = fields.Str()
    email = fields.Email()
    message = fields.Str()
    created_at = fields.DateTime()
