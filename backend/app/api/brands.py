from fastapi import APIRouter

router = APIRouter(
    prefix="/brands",
    tags=["Brands"],
)


@router.get("/")
def get_brands():
    return [
        {
            "id": 1,
            "name": "Tylol",
            "company": "Nobel",
        },
        {
            "id": 2,
            "name": "Anzibel",
            "company": "Nobel",
        },
        {
            "id": 3,
            "name": "PanTap",
            "company": "Nobel",
        },
    ]