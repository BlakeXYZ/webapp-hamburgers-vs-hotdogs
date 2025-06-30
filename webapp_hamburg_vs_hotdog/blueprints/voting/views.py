from flask import Blueprint, jsonify

from webapp_hamburg_vs_hotdog.database import db
from webapp_hamburg_vs_hotdog.blueprints.voting.models import Contestant, Matchup, Vote

blueprint = Blueprint("voting", __name__)

@blueprint.route("/on_click_vote/", methods=["POST"])
def on_click_vote():
    pass
