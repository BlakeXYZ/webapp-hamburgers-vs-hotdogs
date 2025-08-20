# -*- coding: utf-8 -*-
"""Model unit tests."""
import datetime as dt

import pytest
import sqlalchemy as sa
import sqlalchemy.orm as so

from webapp_hamburg_vs_hotdog.blueprints.user.models import Role, User
from webapp_hamburg_vs_hotdog.blueprints.voting.models import Contestant, Matchup

from .factories import ContestantFactory, MatchupFactory


@pytest.mark.usefixtures("db")
class TestContestant:
    """Contestant tests."""

    def test_create_same_contestant(self, db):
        """Test Contestant factory with same contestant name."""
        contestant = ContestantFactory()
        db.session.add(contestant)
        db.session.commit()

        # Attempt to create a contestant with the same name
        with pytest.raises(sa.exc.IntegrityError):
            ContestantFactory(contestant_name=contestant.contestant_name)
            db.session.commit()


@pytest.mark.usefixtures("db")
class TestMatchup:
    """Matchup tests."""
        
    def test_self_matchup(self, db):
        """Test Matchup factory with same contestant for A and B."""
        contestant = ContestantFactory()
        db.session.add(contestant)
        db.session.commit()

        with pytest.raises(sa.exc.IntegrityError):
            # Attempt to create a matchup with the same contestant for both A and B
            MatchupFactory(contestant_a=contestant, contestant_b=contestant)
            db.session.commit()

    def test_same_matchup(self, db):
        """Test Matchup factory with same contestants."""
        contestant_a = ContestantFactory()
        contestant_b = ContestantFactory()
        db.session.add_all([contestant_a, contestant_b])
        db.session.commit()

        # Create the first matchup
        matchup1 = MatchupFactory(contestant_a=contestant_a, contestant_b=contestant_b)
        db.session.add(matchup1)
        db.session.commit()

        # Attempt to create the same matchup again
        with pytest.raises(sa.exc.IntegrityError):
            MatchupFactory(contestant_a=contestant_a, contestant_b=contestant_b)
            db.session.commit()
    
    def test_same_matchup_reverse(self, db):
        """Test Matchup factory with same contestants in reverse order."""
        contestant_a = ContestantFactory()
        contestant_b = ContestantFactory()
        db.session.add_all([contestant_a, contestant_b])
        db.session.commit()

        # Create the first matchup
        matchup1 = MatchupFactory(contestant_a=contestant_a, contestant_b=contestant_b)
        db.session.add(matchup1)
        db.session.commit()

        # Attempt to create the same matchup in reverse order
        with pytest.raises(sa.exc.IntegrityError):
            MatchupFactory(contestant_a=contestant_b, contestant_b=contestant_a)
            db.session.commit()


    def test_matchup_repr(self, db):
        """Check __repr__ output for Matchup."""
        contestant_a = ContestantFactory(contestant_name="Hamburger")
        contestant_b = ContestantFactory(contestant_name="Hotdog")
        db.session.add_all([contestant_a, contestant_b])
        db.session.commit()

        matchup = MatchupFactory(contestant_a=contestant_a, contestant_b=contestant_b)
        db.session.add(matchup)
        db.session.commit()

        print(f"matchup.repr ---- {matchup.__repr__()}") #using flag -s in pytest to see this output - lives inside \webapp_hamburg_vs_hotdog\commands.py > def test()

        repr_str = matchup.__repr__()
        assert "Hamburger" in repr_str
        assert "Hotdog" in repr_str
