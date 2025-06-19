# -*- coding: utf-8 -*-
"""Factories to help in tests."""
from factory import Sequence
from factory.alchemy import SQLAlchemyModelFactory

from webapp_hamburg_vs_hotdog.database import db
from webapp_hamburg_vs_hotdog.blueprints.user.models import User
from webapp_hamburg_vs_hotdog.blueprints.click_test.models import ClickTest
from webapp_hamburg_vs_hotdog.blueprints.voting.models import Contestant, Matchup   



class BaseFactory(SQLAlchemyModelFactory):
    """Base factory."""

    class Meta:
        """Factory configuration."""

        abstract = True
        sqlalchemy_session = db.session


class UserFactory(BaseFactory):
    """User factory."""

    username = Sequence(lambda n: f"user{n}")
    email = Sequence(lambda n: f"user{n}@example.com")
    active = True

    class Meta:
        """Factory configuration."""

        model = User


class ClickTestFactory(BaseFactory):
    """ClickTest factory."""

    click_count = 0

    class Meta:
        """Factory configuration."""

        model = ClickTest

    
class ContestantFactory(BaseFactory):
    """Contestant factory."""

    contestant_name = Sequence(lambda n: f"Contestant {n}")

    class Meta:
        """Factory configuration."""

        model = Contestant


class MatchupFactory(BaseFactory):
    """Matchup factory."""

    contestant_a = Sequence(lambda n: ContestantFactory(contestant_name=f"Contestant A {n}"))
    contestant_b = Sequence(lambda n: ContestantFactory(contestant_name=f"Contestant B {n}"))

    class Meta:
        """Factory configuration."""

        model = Matchup