# -*- coding: utf-8 -*-
"""Model unit tests."""
import datetime as dt

import pytest

from webapp_hamburg_vs_hotdog.blueprints.user.models import Role, User
from webapp_hamburg_vs_hotdog.blueprints.click_test.models import ClickTest
from webapp_hamburg_vs_hotdog.blueprints.voting.models import Contestant, Matchup

from .factories import UserFactory, ClickTestFactory, ContestantFactory, MatchupFactory


@pytest.mark.usefixtures("db")
class TestUser:
    """User tests."""

    def test_get_by_id(self):
        """Get user by ID."""
        user = User(username="foo", email="foo@bar.com")
        user.save()

        retrieved = User.get_by_id(user.id)
        assert retrieved == user

    def test_created_at_defaults_to_datetime(self):
        """Test creation date."""
        user = User(username="foo", email="foo@bar.com")
        user.save()
        assert bool(user.created_at)
        assert isinstance(user.created_at, dt.datetime)

    def test_password_is_nullable(self):
        """Test null password."""
        user = User(username="foo", email="foo@bar.com")
        user.save()
        assert user.password is None

    def test_factory(self, db):
        """Test user factory."""
        user = UserFactory(password="myprecious")
        db.session.commit()
        assert bool(user.username)
        assert bool(user.email)
        assert bool(user.created_at)
        assert user.is_admin is False
        assert user.active is True
        assert user.check_password("myprecious")

    def test_check_password(self):
        """Check password."""
        user = User.create(username="foo", email="foo@bar.com", password="foobarbaz123")
        assert user.check_password("foobarbaz123") is True
        assert user.check_password("barfoobaz") is False

    def test_full_name(self):
        """User full name."""
        user = UserFactory(first_name="Foo", last_name="Bar")
        assert user.full_name == "Foo Bar"

    def test_roles(self):
        """Add a role to a user."""
        role = Role(name="admin")
        role.save()
        user = UserFactory()
        user.roles.append(role)
        user.save()
        assert role in user.roles

    def test_roles_repr(self):
        """Check __repr__ output for Role."""
        role = Role(name="user")
        assert role.__repr__() == "<Role(user)>"

    def test_user_repr(self):
        """Check __repr__ output for User."""
        user = User(username="foo", email="foo@bar.com")
        assert user.__repr__() == "<User('foo')>"

    # def test_purposeful_fail(self):
    #     """This test is designed to fail for practice."""
    #     assert 1 == 0


@pytest.mark.usefixtures("db")
class TestClickTest:
    """ClickTest tests."""

    def test_click_test_factory(self, db):
        """Test ClickTest factory."""
        click_test = ClickTestFactory()
        db.session.commit()
        assert click_test.click_count == 0

    def test_click_test_repr(self):
        """Check __repr__ output for ClickTest."""
        click_test = ClickTest(click_count=5)
        assert click_test.__repr__() == "<Click Count 5>"


@pytest.mark.usefixtures("db")
class TestMatchup:
    """Matchup tests."""

    def test_factory(self, db):
        """Test Matchup factory."""
        matchup = MatchupFactory()
        db.session.commit()
        assert matchup.contestant_a.contestant_name.startswith("Contestant A")
        assert matchup.contestant_b.contestant_name.startswith("Contestant B")