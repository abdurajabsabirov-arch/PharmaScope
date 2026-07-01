from sqlalchemy import Column
from sqlalchemy import Date
from sqlalchemy import Float
from sqlalchemy import ForeignKey
from sqlalchemy import Integer

from app.db.database import Base


class IQVIASales(Base):
    __tablename__ = "iqvia_sales"

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

    sales_value = Column(
        Float,
        nullable=False,
    )

    sales_units = Column(
        Float,
        nullable=False,
    )

    market_share = Column(
        Float,
        nullable=True,
    )

    ppg = Column(
        Float,
        nullable=True,
    )

    evolution_index = Column(
        Float,
        nullable=True,
    )