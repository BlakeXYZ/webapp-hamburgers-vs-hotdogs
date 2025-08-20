# -*- coding: utf-8 -*-
"""Click Test models."""
from calendar import c
from datetime import datetime, timezone
import sqlalchemy as sa
import sqlalchemy.orm as so
from webapp_hamburg_vs_hotdog.database import Model, db, relationship


#TODO: Upgrade DB with voting models and setup unit tests for them.

class Contestant(Model):
    """Model for a contestant that can be voted on."""
    __tablename__ = 'contestant'

    id:                        so.Mapped[int] = so.mapped_column(primary_key=True)
    contestant_name:           so.Mapped[str] = so.mapped_column(sa.String(64), index=True, unique=True)
    contestant_description:    so.Mapped[str] = so.mapped_column(sa.String(256), nullable=True)

    matchups_as_a:      so.Mapped[list['Matchup']] = so.relationship(
        'Matchup', 
        back_populates='contestant_a',
        foreign_keys='Matchup.contestant_a_id',
        cascade='all, delete-orphan'
    )
    matchups_as_b:      so.Mapped[list['Matchup']] = so.relationship(
        'Matchup',
        back_populates='contestant_b',
        foreign_keys='Matchup.contestant_b_id',
        cascade='all, delete-orphan'
    )
    votes:              so.Mapped[list['Vote']] = so.relationship('Vote', back_populates='contestant', cascade='all, delete-orphan')

    @property
    def all_matchups(self):
        """Return all matchups involving this contestant."""
        return self.matchups_as_a + self.matchups_as_b

    def __repr__(self):
        return f'<Contestant: {self.contestant_name} {self.contestant_description} <All Matchups: {self.all_matchups}>> '
    

class Matchup(Model):
    """Model for a matchup between two contestants."""
    __tablename__ = 'matchup'
    __table_args__ = (
        sa.UniqueConstraint('contestant_a_id', 'contestant_b_id', name='uq_matchup_pair'),
        sa.CheckConstraint('contestant_a_id != contestant_b_id', name='ck_no_self_matchup'),
    )

    def __init__(self, contestant_a, contestant_b, **kwargs):
        # Extract IDs whether given objects or ints
        # Ensure both contestants have valid IDs
        # and sort by IDs to maintain consistency, this helps avoid duplicate matchups
        ids = [
            contestant_a.id if hasattr(contestant_a, 'id') else contestant_a,
            contestant_b.id if hasattr(contestant_b, 'id') else contestant_b,
        ]
        if None in ids:
            raise ValueError("Both contestants must have valid IDs or objects with an 'id' attribute.")
        ids = sorted(ids)
        self.contestant_a_id, self.contestant_b_id = ids
        super().__init__(**kwargs)

    id:                   so.Mapped[int] = so.mapped_column(primary_key=True)
    contestant_a_id:      so.Mapped[int] = so.mapped_column(sa.ForeignKey('contestant.id', ondelete='CASCADE'), index=True) 
    contestant_b_id:      so.Mapped[int] = so.mapped_column(sa.ForeignKey('contestant.id', ondelete='CASCADE'), index=True)

    contestant_a:     so.Mapped[Contestant] = relationship('Contestant', back_populates='matchups_as_a', foreign_keys=[contestant_a_id])
    contestant_b:     so.Mapped[Contestant] = relationship('Contestant', back_populates='matchups_as_b', foreign_keys=[contestant_b_id])
    votes:            so.Mapped[list['Vote']] = so.relationship('Vote', back_populates='matchup', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Matchup: {self.contestant_a.contestant_name} vs. {self.contestant_b.contestant_name}>'


class Vote(Model):
    """Model for a vote in a matchup."""
    __tablename__ = 'vote'
    __table_args__ = (
        sa.UniqueConstraint('matchup_id', 'session_id', name='uq_vote_matchup_session'),
    )

    def __init__(self, matchup, contestant, **kwargs):
        # Accept either objects or IDs
        matchup_id = matchup.id if hasattr(matchup, 'id') else matchup
        contestant_id = contestant.id if hasattr(contestant, 'id') else contestant

        # Fetch matchup if only ID is given
        if not hasattr(matchup, 'contestant_a_id'):
            matchup_obj = Matchup.query.get(matchup_id)
        else:
            matchup_obj = matchup

        # Validation: contestant must be in matchup
        if contestant_id not in [matchup_obj.contestant_a_id, matchup_obj.contestant_b_id]:
            raise ValueError("Contestant must be part of the matchup.")

        self.matchup_id = matchup_id
        self.contestant_id = contestant_id
        super().__init__(**kwargs)

    id:                        so.Mapped[int] = so.mapped_column(primary_key=True)
    matchup_id:                so.Mapped[int] = so.mapped_column(sa.ForeignKey('matchup.id', ondelete='CASCADE'), index=True)
    contestant_id:             so.Mapped[int] = so.mapped_column(sa.ForeignKey('contestant.id', ondelete='CASCADE'), index=True)
    session_id:                so.Mapped[str] = so.mapped_column(sa.String(64), index=True, nullable=False)
    country_code:              so.Mapped[str] = so.mapped_column(sa.String(2), index=True, nullable=False) # ISO 3166-1 alpha-2 country code
    timestamp:                 so.Mapped[datetime] = so.mapped_column(index=True, default=lambda: datetime.now(timezone.utc))
    #TODO: add region code + timestamp logic

    contestant:                so.Mapped[Contestant] = relationship('Contestant', back_populates='votes')
    matchup:                   so.Mapped[Matchup] = relationship('Matchup', back_populates='votes')

    def __repr__(self):
        return f'<A Vote for {self.contestant.contestant_name} in {self.matchup}>'



    
