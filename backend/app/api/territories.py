from fastapi import APIRouter

router = APIRouter(
    prefix="/territories",
    tags=["Territories"],
)


@router.get("/")
def get_territories():
    return [
        {
            "id": 1,
            "territory": "Pro_Man_Gurur_01",
            "region": "Tashkent",
            "marketing_manager": "Emre Kaplan",
            "product_manager": "Umidjon Abdullaev",
        },
        {
            "id": 2,
            "territory": "Pro_Man_Gurur_02",
            "region": "Samarkand",
            "marketing_manager": "Emre Kaplan",
            "product_manager": "Emrhan Ozdemir",
        },
        {
            "id": 3,
            "territory": "Pro_Man_Razum_01",
            "region": "Bukhara",
            "marketing_manager": "Abdurajab Sabirov",
            "product_manager": "Mamurjon Maxmudov",
        },
    ]