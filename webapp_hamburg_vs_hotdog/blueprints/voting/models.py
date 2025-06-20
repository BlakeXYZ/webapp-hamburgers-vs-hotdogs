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
    contestant_a_id:      so.Mapped[int] = so.mapped_column(sa.ForeignKey('contestant.id'), index=True) 
    contestant_b_id:      so.Mapped[int] = so.mapped_column(sa.ForeignKey('contestant.id'), index=True)

    contestant_a:     so.Mapped[Contestant] = relationship('Contestant', back_populates='matchups_as_a', foreign_keys=[contestant_a_id])
    contestant_b:     so.Mapped[Contestant] = relationship('Contestant', back_populates='matchups_as_b', foreign_keys=[contestant_b_id])


    def __repr__(self):
        return f'<Matchup: {self.contestant_a.contestant_name} vs. {self.contestant_b.contestant_name}>'

    

# class Vote(Base):
#     """Model for a vote in a matchup."""