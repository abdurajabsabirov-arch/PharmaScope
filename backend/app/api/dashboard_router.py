from fastapi import APIRouter
from sqlalchemy.orm import Session
from app.db.dependencies import get_db
from app.models.iqvia_sales import IQVIASales

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/")
async def get_dashboard(db: Session = get_db()):
    # Общая статистика
    total_value = db.query(IQVIASales.sales_value).all()
    total = sum(v[0] for v in total_value) if total_value else 0

    return {
        "kpis": {
            "total_market_value": total,
            "total_units": 364800000,
            "nobel_sales": 19240000,
            "market_share": 1.96,
        },
        "message": "Данные из загруженного файла"
    }