from sqlalchemy import Column
from sqlalchemy import Date
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import String

from app.db.database import Base


class CRMVisit(Base):
    __tablename__ = "crm_visits"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    visit_date = Column(
        Date,
        nullable=False,
    )

    territory_id = Column(
        Integer,
        ForeignKey("territories.id"),
        nullable=False,
    )

    sku_id = Column(
        Integer,
        ForeignKey("skus.id"),
        nullable=True,
    )

    doctor_name = Column(
        String(200),
        nullable=True,
    )

    pharmacy_name = Column(
        String(200),
        nullable=True,
    )

    specialty = Column(
        String(100),
        nullable=True,
    )

    employee = Column(
        String(150),
        nullable=False,
    )