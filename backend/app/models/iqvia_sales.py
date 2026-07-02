from sqlalchemy import Column
from sqlalchemy import Date
from sqlalchemy import Float
from sqlalchemy import ForeignKey
from sqlalchemy import Integer

from app.db.session import Base


class IQVIASales(Base):

    __tablename__ = "iqvia_sales"

    id = Column(Integer, primary_key=True, index=True)

    period = Column(Date, nullable=True)
    
    sku_id = Column(
        Integer,
        ForeignKey("skus.id"),
    )

    territory_id = Column(
        Integer,
        ForeignKey("territories.id"),
    )

    sales_value = Column(Float)

    sales_units = Column(Float)

    market_share = Column(Float)

    ppg = Column(Float)

    evolution_index = Column(Float)