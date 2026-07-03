from fastapi import APIRouter
from typing import Optional

from app.services.analytics_service import get_dashboard_data

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get("/")
def get_dashboard(
    company: Optional[str] = None,
    brand: Optional[str] = None,
    region: Optional[str] = None,
    molecule: Optional[str] = None,
    sku: Optional[str] = None,
    market: Optional[str] = None,
    atc1: Optional[str] = None,
    atc2: Optional[str] = None,
    atc3: Optional[str] = None,
    atc4: Optional[str] = None,
    period_type: Optional[str] = None,
    year: Optional[str] = None,
    selected_years: Optional[str] = None,
    month: Optional[str] = None,
    selected_months: Optional[str] = None,
    quarter: Optional[str] = None,
):
    return get_dashboard_data(
        filters={
            "company": company,
            "brand": brand,
            "region": region,
            "molecule": molecule,
            "sku": sku,
            "market": market,
            "atc1": atc1,
            "atc2": atc2,
            "atc3": atc3,
            "atc4": atc4,
            "period_type": period_type,
            "year": year,
            "selected_years": selected_years,
            "month": month,
            "selected_months": selected_months,
            "quarter": quarter,
        }
    )
