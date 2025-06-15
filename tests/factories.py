# -*- coding: utf-8 -*-
"""Factories to help in tests."""
from factory import Sequence
from factory.alchemy import SQLAlchemyModelFactory

from webapp_hamburg_vs_hotdog.database import db
from webapp_hamburg_vs_hotdog.user.models import User
from webapp_hamburg_vs_hotdog.click_test.models import ClickTest


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

