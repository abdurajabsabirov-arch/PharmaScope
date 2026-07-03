import pandas as pd
from sqlalchemy.orm import Session
from typing import Dict, Any

from app.models.iqvia_sales import IQVIASales

def import_iqvia(file_path: str, db: Session) -> Dict[str, Any]:
    try:
        df = pd.read_excel(file_path)
        records_added = 0

        for _, row in df.iterrows():
            try:
                sale = IQVIASales(
                    period=row.get('period'),
                    sku_id=row.get('sku_id'),
                    territory_id=row.get('territory_id'),
                    sales_value=float(row.get('sales_value') or 0),
                    sales_units=float(row.get('sales_units') or 0),
                    market_share=float(row.get('market_share') or 0),
                    ppg=float(row.get('ppg') or 0),
                    evolution_index=float(row.get('evolution_index') or 0),
                )
                db.add(sale)
                records_added += 1
            except:
                continue

        db.commit()

        return {
            "records_processed": len(df),
            "records_added": records_added,
            "message": f"Успешно импортировано {records_added} записей"
        }
    except Exception as e:
        db.rollback()
        return {"error": str(e)}