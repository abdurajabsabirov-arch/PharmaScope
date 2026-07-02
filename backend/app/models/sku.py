from sqlalchemy import Column
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Float
from sqlalchemy import Boolean

from app.db.session import Base


class SKU(Base):

    __tablename__ = "skus"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    brand_id = Column(
        Integer,
        ForeignKey("brands.id"),
    )

    dosage = Column(String)

    form = Column(String)

    pack = Column(String)

    manufacturer_price = Column(Float)

    wholesale_price = Column(Float)

    retail_price = Column(Float)

    active = Column(Boolean, default=True)