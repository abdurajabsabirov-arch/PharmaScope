from fastapi import APIRouter

router = APIRouter(
    prefix="/reference-prices",
    tags=["Reference Prices"],
)


@router.get("/")
def get_reference_prices():
    return [
        {
            "id": 1,
            "brand": "PanTap",
            "sku": "PanTap 20 mg",
            "manufacturer_price": 18500,
            "wholesale_price": 20100,
            "retail_price": 23500,
        },
        {
            "id": 2,
            "brand": "Anzibel",
            "sku": "Anzibel Lozenges",
            "manufacturer_price": 24800,
            "wholesale_price": 27100,
            "retail_price": 31500,
        },
        {
            "id": 3,
            "brand": "Tylol Hot",
            "sku": "Tylol Hot Lemon",
            "manufacturer_price": 14200,
            "wholesale_price": 15800,
            "retail_price": 18400,
        },
    ]