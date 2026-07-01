from fastapi import APIRouter

router = APIRouter(
    prefix="/iqvia",
    tags=["IQVIA"],
)


@router.get("/")
def get_iqvia():
    return [
        {
            "id": 1,
            "brand": "PanTap",
            "market": "Gastro",
            "sales": 12540000,
            "share": 14.8,
        },
        {
            "id": 2,
            "brand": "Anzibel",
            "market": "ENT",
            "sales": 8420000,
            "share": 11.3,
        },
        {
            "id": 3,
            "brand": "Tylol Hot",
            "market": "Cold & Flu",
            "sales": 16430000,
            "share": 18.9,
        },
    ]