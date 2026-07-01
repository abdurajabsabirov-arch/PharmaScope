from sqlalchemy import Boolean
from sqlalchemy import Column
from sqlalchemy import Float
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import String

from app.db.database import Base


class SKU(Base):
    __tablename__ = "skus"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    brand_id = Column(
        Integer,
        ForeignKey("brands.id"),
        nullable=False,
    )

    name = Column(
        String(200),
        nullable=False,
    )

    dosage = Column(
        String(100),
        nullable=True,
    )

    form = Column(
        String(100),
        nullable=True,
    )

    pack = Column(
        String(100),
        nullable=True,
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

    active = Column(
        Boolean,
        default=True,
    )