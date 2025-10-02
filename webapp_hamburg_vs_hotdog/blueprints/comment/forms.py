from flask_wtf import FlaskForm
from wtforms import TextAreaField, SubmitField
from wtforms.validators import DataRequired, Length

class CommentForm(FlaskForm):
    comment = TextAreaField('Comment', validators=[
        DataRequired(),
        Length(max=256)
    ])
    submit = SubmitField('Submit')


    