from fastapi import APIRouter

router = APIRouter(
    prefix="/budget",
    tags=["Budget"],
)


@router.get("/")
def get_budget():
    return [
        {
            "id": 1,
            "brand": "PanTap",
            "plan": 15000000,
            "actual": 14250000,
            "achievement": 95.0,
        },
        {
            "id": 2,
            "brand": "Anzibel",
            "plan": 9800000,
            "actual": 10420000,
            "achievement": 106.3,
        },
        {
            "id": 3,
            "brand": "Tylol Hot",
            "plan": 18200000,
            "actual": 17680000,
            "achievement": 97.1,
        },
    ]