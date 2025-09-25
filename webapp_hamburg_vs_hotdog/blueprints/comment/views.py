from datetime import datetime, timezone
from flask import Blueprint, render_template, request, jsonify

from webapp_hamburg_vs_hotdog.database import db
from webapp_hamburg_vs_hotdog.blueprints.comment.models import Comment
from webapp_hamburg_vs_hotdog.blueprints.comment.forms import CommentForm

blueprint = Blueprint("comment", __name__)

@blueprint.route("/on_comment_submit/", methods=["POST"])
def add_comment():
    data = request.get_json()
    form = CommentForm(data=data, meta={'csrf': False})

    if form.validate():
        comment = Comment(
            matchup=int(data['matchup_id']),
            text=form.comment.data,
            session_id=str(data['session_id']),
            timestamp=datetime.now(timezone.utc),
        )
        db.session.add(comment)
        db.session.commit()
        
        return jsonify(success=True, comment={
                "id": comment.id,
                "text": comment.text,
                "timestamp": comment.timestamp.isoformat(),
                "session_id": comment.session_id,
                "matchup_id": comment.matchup_id
            })
    
    return jsonify(success=False, errors=form.errors), 400
