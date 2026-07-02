from sqlalchemy import Column
from sqlalchemy import Date
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import String

from app.db.session import Base


class CRMVisit(Base):

    __tablename__ = "crm_visits"

    id = Column(Integer, primary_key=True, index=True)

    visit_date = Column(Date, nullable=False)

    territory_id = Column(
        Integer,
        ForeignKey("territories.id"),
    )

    sku_id = Column(
        Integer,
        ForeignKey("skus.id"),
    )

    doctor_name = Column(String)

    pharmacy_name = Column(String)

    specialty = Column(String)

    employee = Column(String)