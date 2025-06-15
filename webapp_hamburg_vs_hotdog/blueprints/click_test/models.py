# -*- coding: utf-8 -*-
"""Click Test models."""
import datetime as dt
import sqlalchemy as sa
import sqlalchemy.orm as so
from webapp_hamburg_vs_hotdog.database import Column, PkModel, db, reference_col, relationship


class ClickTest(PkModel):
    """Store how many clicks on a button were made."""
    __tablename__ = 'click_test'

    click_count:    so.Mapped[int] = so.mapped_column(sa.Integer, index=True)

    def __repr__(self):
        return f'<Click Count {self.click_count}>'