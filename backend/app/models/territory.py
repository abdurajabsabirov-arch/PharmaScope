from sqlalchemy import Column
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import String

from app.db.database import Base


class Territory(Base):
    __tablename__ = "territories"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    marketing_manager = Column(
        String(150),
        nullable=True,
    )

    product_manager = Column(
        String(150),
        nullable=True,
    )

    region = Column(
        String(100),
        nullable=False,
    )

    brick = Column(
        String(100),
        nullable=True,
    )

    territory_name = Column(
        String(150),
        nullable=False,
    )

    company_id = Column(
        Integer,
        ForeignKey("companies.id"),
        nullable=True,
    )