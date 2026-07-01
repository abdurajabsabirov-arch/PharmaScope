from fastapi import APIRouter

router = APIRouter(
    prefix="/skus",
    tags=["SKU"],
)


@router.get("/")
def get_skus():
    return [
        {
            "id": 1,
            "brand": "Tylol",
            "sku": "Tylol Hot Sachet",
            "pack": "10 sachets",
        },
        {
            "id": 2,
            "brand": "Anzibel",
            "sku": "Anzibel Lozenges",
            "pack": "24 tablets",
        },
        {
            "id": 3,
            "brand": "PanTap",
            "sku": "PanTap 20 mg",
            "pack": "28 tablets",
        },
    ]