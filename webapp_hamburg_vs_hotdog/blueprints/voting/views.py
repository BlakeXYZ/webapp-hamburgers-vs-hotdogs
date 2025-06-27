from flask import Blueprint, jsonify

from webapp_hamburg_vs_hotdog.database import db
from webapp_hamburg_vs_hotdog.blueprints.voting.models import Contestant, Matchup, Vote

blueprint = Blueprint("voting", __name__)

@blueprint.route("/cast_vote/", methods=["POST"])
def on_vote_click():
    pass
