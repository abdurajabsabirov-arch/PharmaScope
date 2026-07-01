from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String

from app.db.database import Base


class Company(Base):
    __tablename__ = "companies"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    name = Column(
        String(150),
        unique=True,
        nullable=False,
    )

    country = Column(
        String(100),
        nullable=True,
    )

    manufacturer = Column(
        String(150),
        nullable=True,
    )