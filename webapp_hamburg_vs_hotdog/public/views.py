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
from webapp_hamburg_vs_hotdog.blueprints.voting.utils.get_contestant_stats import get_contestant_stats

from webapp_hamburg_vs_hotdog.blueprints.comments.utils.commentor_name_gen import print_random_name

blueprint = Blueprint("public", __name__, static_folder="../static")


@login_manager.user_loader
def load_user(user_id):
    """Load user by ID."""
    return User.get_by_id(int(user_id))


@blueprint.route("/", methods=["GET", "POST"])
def home():
    """Home page."""
    contestants = db.session.query(Contestant).all()
    matchups = db.session.query(Matchup).all()
    matchup_stats = {m.id: get_matchup_stats(m) for m in matchups} # Build a dict of matchup stats for all matchups
    session_id = request.cookies.get('session_id')
    has_voted = False
    if session_id:
        has_voted = db.session.query(Vote).filter_by(session_id=session_id).count() > 0
    
    return render_template("public/home.html", contestants=contestants, matchups=matchups, matchup_stats=matchup_stats, session_id=session_id, has_voted=has_voted)


@blueprint.route("/gallery/")
def gallery():
    """Gallery page."""
    contestants = db.session.query(Contestant).all()
    contestants_stats = {c.id: get_contestant_stats(c) for c in contestants} # Build a dict of contestant stats for all contestants

    return render_template("public/gallery.html", contestants=contestants, contestants_stats=contestants_stats)



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
    session_id = request.cookies.get('session_id')

    form = LoginForm(request.form)
    random_name = print_random_name(session_id)
    return render_template("public/about.html", form=form, session_id=session_id, random_name=random_name)



