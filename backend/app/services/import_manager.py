from sqlalchemy.orm import Session

from app.services.iqvia_importer import import_iqvia
from app.services.secondary_sales_importer import import_secondary_sales
from app.services.reference_price_importer import import_reference_prices


class ImportManager:

    @staticmethod
    def import_file(source, file, db: Session):

        if source == "iqvia":
            return import_iqvia(file, db)

        if source == "secondary_sales":
            return import_secondary_sales(file)

        if source == "reference_prices":
            return import_reference_prices(file)

        raise ValueError(f"Unknown source: {source}")