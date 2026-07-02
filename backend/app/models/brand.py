from sqlalchemy import Column
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import String

from app.db.session import Base


class Brand(Base):

    __tablename__ = "brands"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    company_id = Column(
        Integer,
        ForeignKey("companies.id"),
    )