from sqlalchemy import Column
from sqlalchemy import Date
from sqlalchemy import Float
from sqlalchemy import ForeignKey
from sqlalchemy import Integer

from app.db.session import Base


class SecondarySales(Base):

    __tablename__ = "secondary_sales"

    id = Column(Integer, primary_key=True, index=True)

    period = Column(Date, nullable=False)

    sku_id = Column(
        Integer,
        ForeignKey("skus.id"),
    )

    territory_id = Column(
        Integer,
        ForeignKey("territories.id"),
    )

    distributor_id = Column(Integer)

    sales_value = Column(Float)

    sales_units = Column(Float)