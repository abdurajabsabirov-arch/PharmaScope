from typing import Optional

from fastapi import APIRouter, Query

from app.services.performance_cockpit_service import get_performance_cockpit_data


router = APIRouter(
    prefix="/performance-cockpit",
    tags=["Performance Cockpit"],
)


@router.get("/")
def get_performance_cockpit(
    year: Optional[str] = Query(None),
    quarter: Optional[str] = Query(None),
    month: Optional[str] = Query(None),
    group: Optional[str] = Query(None),
    region: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    supervisor: Optional[str] = Query(None),
    field_force_manager: Optional[str] = Query(None),
    marketing_manager: Optional[str] = Query(None),
    product_manager: Optional[str] = Query(None),
    brand: Optional[str] = Query(None),
    sku: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    rx_otc: Optional[str] = Query(None),
    tylolfen: Optional[str] = Query(None),
    country: Optional[str] = Query(None),
):
    return get_performance_cockpit_data(
        {
            "year": year,
            "quarter": quarter,
            "month": month,
            "group": group,
            "region": region,
            "city": city,
            "supervisor": supervisor,
            "field_force_manager": field_force_manager,
            "marketing_manager": marketing_manager,
            "product_manager": product_manager,
            "brand": brand,
            "sku": sku,
            "type": type,
            "rx_otc": rx_otc,
            "tylolfen": tylolfen,
            "country": country,
        }
    )
