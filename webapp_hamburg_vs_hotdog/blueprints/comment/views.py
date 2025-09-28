from datetime import datetime, timezone
from flask import Blueprint, render_template, request, jsonify

from webapp_hamburg_vs_hotdog.database import db
from webapp_hamburg_vs_hotdog.blueprints.comment.models import Comment
from webapp_hamburg_vs_hotdog.blueprints.comment.forms import CommentForm
from webapp_hamburg_vs_hotdog.blueprints.comment.utils.comment_data_gen import build_session_ids_coolname, build_session_ids_vote_color, build_comment_time_ago


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
                "matchup_id": comment.matchup_id,
                "session_id": comment.session_id,
                "text": comment.text,
                "timestamp": comment.timestamp.isoformat(),
                "cool_name": build_session_ids_coolname(comment.session_id),
                "time_ago": build_comment_time_ago(comment.timestamp),
                "matchup_contestant_vote_a_or_b": build_session_ids_vote_color(comment.matchup_id, comment.session_id),
            })
    
    return jsonify(success=False, errors=form.errors), 400
