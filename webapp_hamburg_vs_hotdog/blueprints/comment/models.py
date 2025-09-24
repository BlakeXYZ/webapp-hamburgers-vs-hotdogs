from datetime import datetime, timezone
import sqlalchemy as sa
import sqlalchemy.orm as so
from webapp_hamburg_vs_hotdog.database import Model, db, relationship

class Comment(Model):
    """Model for a comment made by a user."""
    __tablename__ = 'comment'

    id:             so.Mapped[int] = so.mapped_column(primary_key=True)
    matchup_id:     so.Mapped[int] = so.mapped_column(sa.ForeignKey('matchup.id', ondelete='CASCADE'), index=True)
    text:           so.Mapped[str] = so.mapped_column(sa.String(256), nullable=False)
    session_id:     so.Mapped[str] = so.mapped_column(sa.String(64), index=True, nullable=False)
    timestamp:      so.Mapped[datetime] = so.mapped_column(index=True, default=lambda: datetime.now(timezone.utc))

    matchup:        so.Mapped['Matchup'] = relationship('Matchup', back_populates='comments')

    def __repr__(self):
        return f'<Comment: {self.text} {self.session_id} {self.timestamp}>'

