from sqlalchemy import Column
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import String

from app.db.database import Base


class Brand(Base):
    __tablename__ = "brands"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    company_id = Column(
        Integer,
        ForeignKey("companies.id"),
        nullable=False,
    )

    name = Column(
        String(150),
        nullable=False,
    )

    molecule = Column(
        String(150),
        nullable=True,
    )

    atc = Column(
        String(30),
        nullable=True,
    )