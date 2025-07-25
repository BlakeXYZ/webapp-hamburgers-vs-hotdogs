"""fix clicktest table

Revision ID: ae53dfaaafa0
Revises: b16d918f96a2
Create Date: 2025-06-19 19:52:56.653367

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ae53dfaaafa0'
down_revision = 'b16d918f96a2'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('click_test', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_click_test_contestant_name'))
        batch_op.drop_column('contestant_name')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('click_test', schema=None) as batch_op:
        batch_op.add_column(sa.Column('contestant_name', sa.VARCHAR(length=64), nullable=False))
        batch_op.create_index(batch_op.f('ix_click_test_contestant_name'), ['contestant_name'], unique=1)

    # ### end Alembic commands ###
