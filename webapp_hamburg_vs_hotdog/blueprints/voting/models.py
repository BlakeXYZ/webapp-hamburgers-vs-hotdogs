# -*- coding: utf-8 -*-
"""Click Test models."""
import datetime as dt
import sqlalchemy as sa
import sqlalchemy.orm as so
from webapp_hamburg_vs_hotdog.database import Column, PkModel, db, reference_col, relationship

class Base(so.DeclarativeBase):
    pass

class Item(Base):
    """Model for a Item that can be voted on."""
    __tablename__ = 'item'

    id:                     so.Mapped[int] = so.mapped_column(primary_key=True)
    item_name:              so.Mapped[str] = so.mapped_column(sa.String(64), index=True, unique=True)
    item_description:       so.Mapped[str] = so.mapped_column(sa.String(256), nullable=True)

    matchups_as_a:      so.Mapped[list['Matchup']] = so.relationship('Matchup', back_populates='item_a', foreign_keys='Matchup.item_a_id')
    matchups_as_b:      so.Mapped[list['Matchup']] = so.relationship('Matchup', back_populates='item_b', foreign_keys='Matchup.item_b_id')
    
    @property
    def all_matchups(self):
        """Return all matchups involving this item."""
        return self.matchups_as_a + self.matchups_as_b

    def __repr__(self):
        return f'<Item: {self.item_name} {self.item_description} <All Matchups: {self.all_matchups}>> '
    

class Matchup(Base):
    """Model for a matchup between two items."""
    __tablename__ = 'matchup'

    id:             so.Mapped[int] = so.mapped_column(primary_key=True)
    item_a_id:      so.Mapped[int] = so.mapped_column(sa.ForeignKey('item.id'), index=True) 
    item_b_id:      so.Mapped[int] = so.mapped_column(sa.ForeignKey('item.id'), index=True)

    item_a:     so.Mapped[Item] = relationship('Item', back_populates='matchups_as_a', foreign_keys=[item_a_id])
    item_b:     so.Mapped[Item] = relationship('Item', back_populates='matchups_as_b', foreign_keys=[item_b_id])

    def __repr__(self):
        return f'<Matchup: {self.item_a.item_name} vs. {self.item_b.item_name}>'

    

class Vote(Base):
    """Model for a vote in a matchup."""