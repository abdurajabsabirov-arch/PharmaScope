from sqlalchemy.orm import Session

from app.services.iqvia_importer import import_iqvia

class ImportManager:

    @staticmethod
    def import_file(source: str, file_path: str, db: Session):
        if source == "iqvia":
            return import_iqvia(file_path, db)

        raise ValueError(f"Unknown source: {source}")