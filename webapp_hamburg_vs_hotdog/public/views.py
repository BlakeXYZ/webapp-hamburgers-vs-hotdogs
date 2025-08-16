# -*- coding: utf-8 -*-
"""Public section, including homepage and signup."""
from flask import (
    Blueprint,
    current_app,
    flash,
    redirect,
    render_template,
    request,
    url_for,
    jsonify,
)
from flask_login import login_required, login_user, logout_user

from webapp_hamburg_vs_hotdog.extensions import login_manager
from webapp_hamburg_vs_hotdog.public.forms import LoginForm
from webapp_hamburg_vs_hotdog.blueprints.user.forms import RegisterForm
from webapp_hamburg_vs_hotdog.blueprints.user.models import User
from webapp_hamburg_vs_hotdog.utils import flash_errors

from webapp_hamburg_vs_hotdog.database import db

from webapp_hamburg_vs_hotdog.blueprints.voting.models import Contestant, Matchup, Vote
from webapp_hamburg_vs_hotdog.blueprints.voting.utils.get_matchup_stats import get_matchup_stats

blueprint = Blueprint("public", __name__, static_folder="../static")


@login_manager.user_loader
def load_user(user_id):
    """Load user by ID."""
    return User.get_by_id(int(user_id))


@blueprint.route("/", methods=["GET", "POST"])
def home():
    """Home page."""
    form = LoginForm(request.form)
    current_app.logger.info("Hello from the home page!")
    # Handle logging in
    if request.method == "POST":
        if form.validate_on_submit():
            login_user(form.user)
            flash("You are logged in.", "success")
            redirect_url = request.args.get("next") or url_for("user.members")
            return redirect(redirect_url)
        else:
            flash_errors(form)
    return render_template("public/home.html", form=form)


@blueprint.route("/logout/")
@login_required
def logout():
    """Logout."""
    logout_user()
    flash("You are logged out.", "info")
    return redirect(url_for("public.home"))


@blueprint.route("/register/", methods=["GET", "POST"])
def register():
    """Register new user."""
    form = RegisterForm(request.form)
    if form.validate_on_submit():
        User.create(
            username=form.username.data,
            email=form.email.data,
            password=form.password.data,
            active=True,
        )
        flash("Thank you for registering. You can now log in.", "success")
        return redirect(url_for("public.home"))
    else:
        flash_errors(form)
    return render_template("public/register.html", form=form)


@blueprint.route("/about/")
def about():
    """About page."""
    form = LoginForm(request.form)
    return render_template("public/about.html", form=form)


@blueprint.route("/test_vote/")
def test_vote():
    """Voting page."""
    contestants = db.session.query(Contestant).all()
    matchups = db.session.query(Matchup).all()
    for matchup in matchups:
        votes_a = sum(1 for v in matchup.votes if v.contestant_id == matchup.contestant_a_id)
        votes_b = sum(1 for v in matchup.votes if v.contestant_id == matchup.contestant_b_id)
        total = votes_a + votes_b
        matchup.percent_a = (votes_a / total * 100) if total > 0 else 50
        matchup.percent_b = (votes_b / total * 100) if total > 0 else 50
    return render_template("public/test_vote.html", contestants=contestants, matchups=matchups)

@blueprint.route("/test_cards/")
def test_cards():
    """Test cards page."""
    contestants = db.session.query(Contestant).all()
    matchups = db.session.query(Matchup).all()
    
    # Build a dict of matchup stats for all matchups

    matchup_stats = {m.id: get_matchup_stats(m) for m in matchups}
    return render_template("public/test_cards.html", contestants=contestants, matchups=matchups, matchup_stats=matchup_stats)



