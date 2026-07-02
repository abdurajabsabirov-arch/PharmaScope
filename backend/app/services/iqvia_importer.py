import pandas as pd
from sqlalchemy.orm import Session

from app.models.iqvia_sales import IQVIASales
from app.services.base_importer import BaseImporter


def import_iqvia(file, db: Session):

    dataframe = pd.read_excel(file)
    dataframe = dataframe.where(pd.notna(dataframe), None)

    importer = BaseImporter(db)

    # Пока сохраняем только первые 5 строк как тест
    for _ in dataframe.head(5).itertuples():

        record = IQVIASales()

        importer.save(record)

    importer.commit()

    return {
        "success": True,
        "source": "IQVIA",
        "rows": len(dataframe),
        "saved": 5,
        "columns": list(dataframe.columns),
        "preview": dataframe.head(5).to_dict(orient="records"),
    }