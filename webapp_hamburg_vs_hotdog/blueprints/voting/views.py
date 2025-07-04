from flask import Blueprint, jsonify, request

from webapp_hamburg_vs_hotdog.database import db
from webapp_hamburg_vs_hotdog.blueprints.voting.models import Contestant, Matchup, Vote

blueprint = Blueprint("voting", __name__)

@blueprint.route("/on_click_vote/", methods=["POST"])
def on_click_vote():
    data = request.get_json()
    matchup_id = int(data['matchup_id'])
    contestant_id = int(data['contestant_id'])
    session_id = str(data['session_id'])
    region_code = str(data['region_code'])

    #TODO: allow for session user to switch vote, but only vote once per session
    db.session.add(Vote(matchup=matchup_id,
                        contestant=contestant_id,
                        session_id=session_id,
                        country_code=region_code ))
    db.session.commit()

    matchup = Matchup.query.get(matchup_id)
    votes_a = sum(1 for v in matchup.votes if v.contestant_id == matchup.contestant_a_id)
    votes_b = sum(1 for v in matchup.votes if v.contestant_id == matchup.contestant_b_id)
    return jsonify(
        matchup_id=matchup_id,
        total_votes=len(matchup.votes),
        votes_a=votes_a,
        votes_b=votes_b,
        contestant_a_name=matchup.contestant_a.contestant_name,
        contestant_b_name=matchup.contestant_b.contestant_name
    )