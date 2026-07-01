from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String

from app.db.database import Base


class Molecule(Base):
    __tablename__ = "molecules"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    name = Column(
        String(200),
        unique=True,
        nullable=False,
    )

    atc1 = Column(
        String(20),
        nullable=True,
    )

    atc2 = Column(
        String(20),
        nullable=True,
    )

    atc3 = Column(
        String(20),
        nullable=True,
    )

    atc4 = Column(
        String(20),
        nullable=True,
    )