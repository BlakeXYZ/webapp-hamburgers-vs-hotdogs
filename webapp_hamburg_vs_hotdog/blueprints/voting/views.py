from email import message
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
    # country_code = str(data['country_code'])
    # region_code = str(data['region_code'])

    vote = Vote.query.filter_by(matchup_id=matchup_id, session_id=session_id).first()
    contestant_id_name = Contestant.query.get(contestant_id).contestant_name

    if vote is None:
        # 1. Session never Voted: create new vote
        vote = Vote(
            matchup=matchup_id,
            contestant=contestant_id,
            session_id=session_id,
            country_code="DE",  # TODO: Placeholder, replace with actual country code logic
        )
        db.session.add(vote)
        message = f"Voted for {contestant_id_name}!"
    elif vote.contestant_id == contestant_id:
        # 2. Session voted for same contestant: remove vote
        db.session.delete(vote) 
        message = "Vote removed!"
    else:
        # 3. Session voted for different contestant: switch vote
        vote.contestant_id = contestant_id
        message = f"Vote switched to {contestant_id_name}!"

    db.session.commit()

    matchup = Matchup.query.get(matchup_id)
    votes_a = sum(1 for v in matchup.votes if v.contestant_id == matchup.contestant_a_id)
    votes_b = sum(1 for v in matchup.votes if v.contestant_id == matchup.contestant_b_id)
    return jsonify(
        matchup_id=matchup_id,
        total_votes=len(matchup.votes),
        votes_a=votes_a,
        votes_b=votes_b,
        percent_a=(votes_a / len(matchup.votes) * 100) if len(matchup.votes) > 0 else 50,
        percent_b=(votes_b / len(matchup.votes) * 100) if len(matchup.votes) > 0 else 50,
        contestant_a_name=matchup.contestant_a.contestant_name,
        contestant_b_name=matchup.contestant_b.contestant_name,
        message=message,    
    )