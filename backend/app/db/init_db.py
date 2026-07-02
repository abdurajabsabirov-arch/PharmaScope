from app.db.session import Base
from app.db.session import engine

from app.models.company import Company
from app.models.brand import Brand
from app.models.molecule import Molecule
from app.models.sku import SKU
from app.models.territory import Territory
from app.models.distributor import Distributor
from app.models.user import User
from app.models.secondary_sales import SecondarySales
from app.models.reference_price import ReferencePrice
from app.models.iqvia_sales import IQVIASales
from app.models.crm_visit import CRMVisit


def init_database():
    Base.metadata.create_all(bind=engine)