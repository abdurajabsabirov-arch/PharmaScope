from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String

from app.db.session import Base


class Territory(Base):

    __tablename__ = "territories"

    id = Column(Integer, primary_key=True, index=True)

    territory_name = Column(String, nullable=False)

    region = Column(String)

    brick = Column(String)

    marketing_manager = Column(String)

    product_manager = Column(String)