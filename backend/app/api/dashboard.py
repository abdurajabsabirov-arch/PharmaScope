from fastapi import APIRouter

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get("/")
def get_dashboard():

    return {
        "total_market": 124600000,
        "nobel_sales": 18300000,
        "market_share": 14.7,
        "rank": 4,
        "growth": 12.4,
    }