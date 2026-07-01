from sqlalchemy import Column
from sqlalchemy import Date
from sqlalchemy import Float
from sqlalchemy import ForeignKey
from sqlalchemy import Integer

from app.db.database import Base


class ReferencePrice(Base):
    __tablename__ = "reference_prices"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    period = Column(
        Date,
        nullable=False,
    )

    sku_id = Column(
        Integer,
        ForeignKey("skus.id"),
        nullable=False,
    )

    manufacturer_price = Column(
        Float,
        nullable=True,
    )

    wholesale_price = Column(
        Float,
        nullable=True,
    )

    retail_price = Column(
        Float,
        nullable=True,
    )