from fastapi import APIRouter

router = APIRouter(
    prefix="/secondary-sales",
    tags=["Secondary Sales"],
)


@router.get("/")
def get_secondary_sales():
    return [
        {
            "id": 1,
            "distributor": "Grand Pharm",
            "brand": "PanTap",
            "sales": 2485000,
            "units": 1520,
        },
        {
            "id": 2,
            "distributor": "Dori Darmon",
            "brand": "Anzibel",
            "sales": 3840000,
            "units": 2960,
        },
        {
            "id": 3,
            "distributor": "Meros Pharm",
            "brand": "Tylol Hot",
            "sales": 5123000,
            "units": 4180,
        },
    ]