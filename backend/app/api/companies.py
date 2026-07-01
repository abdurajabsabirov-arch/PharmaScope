from fastapi import APIRouter

router = APIRouter(
    prefix="/companies",
    tags=["Companies"],
)


@router.get("/")
def get_companies():
    return [
        {
            "id": 1,
            "name": "Nobel",
            "country": "Turkey",
        },
        {
            "id": 2,
            "name": "Santo",
            "country": "Uzbekistan",
        },
        {
            "id": 3,
            "name": "Berlin Chemie",
            "country": "Germany",
        },
    ]