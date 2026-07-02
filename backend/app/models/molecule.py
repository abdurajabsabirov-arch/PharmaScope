from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String

from app.db.session import Base


class Molecule(Base):

    __tablename__ = "molecules"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, unique=True, nullable=False)

    atc = Column(String)