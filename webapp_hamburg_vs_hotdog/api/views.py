from flask import Blueprint, jsonify

from webapp_hamburg_vs_hotdog.database import db
from webapp_hamburg_vs_hotdog.click_test.models import ClickTest

blueprint = Blueprint("api", __name__)

@blueprint.route("/api/click/", methods=["POST"])
def api_click():
    click_test = db.session.query(ClickTest).get(1)
    if not click_test:
        click_test = ClickTest(id=1, click_count=0) # type: ignore
        db.session.add(click_test)
        db.session.commit()
    if click_test:
        click_test.click_count += 1
        db.session.commit()
        return jsonify({"click_count": click_test.click_count})
    return jsonify({"error": "Not found"}), 404