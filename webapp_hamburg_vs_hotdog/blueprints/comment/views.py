from flask import Blueprint, jsonify, request

from webapp_hamburg_vs_hotdog.database import db
from webapp_hamburg_vs_hotdog.blueprints.comment.models import Comment

blueprint = Blueprint("comment", __name__)
