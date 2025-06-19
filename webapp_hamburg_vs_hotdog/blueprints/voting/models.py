# -*- coding: utf-8 -*-
"""Click Test models."""
import datetime as dt
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

    matchups_as_a:      so.Mapped[list['Matchup']] = so.relationship('Matchup', back_populates='contestant_a', foreign_keys='Matchup.contestant_a_id')
    matchups_as_b:      so.Mapped[list['Matchup']] = so.relationship('Matchup', back_populates='contestant_b', foreign_keys='Matchup.contestant_b_id')
    
    @property
    def all_matchups(self):
        """Return all matchups involving this contestant."""
        return self.matchups_as_a + self.matchups_as_b

    def __repr__(self):
        return f'<Contestant: {self.contestant_name} {self.contestant_description} <All Matchups: {self.all_matchups}>> '
    

class Matchup(Model):
    """Model for a matchup between two contestants."""
    __tablename__ = 'matchup'

    id:                   so.Mapped[int] = so.mapped_column(primary_key=True)
    contestant_a_id:      so.Mapped[int] = so.mapped_column(sa.ForeignKey('contestant.id'), index=True) 
    contestant_b_id:      so.Mapped[int] = so.mapped_column(sa.ForeignKey('contestant.id'), index=True)

    contestant_a:     so.Mapped[Contestant] = relationship('Contestant', back_populates='matchups_as_a', foreign_keys=[contestant_a_id])
    contestant_b:     so.Mapped[Contestant] = relationship('Contestant', back_populates='matchups_as_b', foreign_keys=[contestant_b_id])

    def __repr__(self):
        return f'<Matchup: {self.contestant_a.contestant_name} vs. {self.contestant_b.contestant_name}>'

    

# class Vote(Base):
#     """Model for a vote in a matchup."""