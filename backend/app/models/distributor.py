from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String

from app.db.session import Base


class Distributor(Base):

    __tablename__ = "distributors"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, unique=True, nullable=False)

    region = Column(String)

    city = Column(String)

    active = Column(Integer, default=1)