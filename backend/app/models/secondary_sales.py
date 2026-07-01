from sqlalchemy import Column
from sqlalchemy import Date
from sqlalchemy import Float
from sqlalchemy import ForeignKey
from sqlalchemy import Integer

from app.db.database import Base


class SecondarySales(Base):
    __tablename__ = "secondary_sales"

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

    territory_id = Column(
        Integer,
        ForeignKey("territories.id"),
        nullable=False,
    )

    distributor_id = Column(
        Integer,
        nullable=True,
    )

    sales_value = Column(
        Float,
        nullable=False,
    )

    sales_units = Column(
        Float,
        nullable=False,
    )