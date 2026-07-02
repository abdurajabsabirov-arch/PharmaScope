from sqlalchemy import Column
from sqlalchemy import Date
from sqlalchemy import Float
from sqlalchemy import ForeignKey
from sqlalchemy import Integer

from app.db.session import Base


class ReferencePrice(Base):

    __tablename__ = "reference_prices"

    id = Column(Integer, primary_key=True, index=True)

    period = Column(Date, nullable=False)

    sku_id = Column(
        Integer,
        ForeignKey("skus.id"),
    )

    manufacturer_price = Column(Float)

    wholesale_price = Column(Float)

    retail_price = Column(Float)