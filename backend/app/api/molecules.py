from fastapi import APIRouter

router = APIRouter(
    prefix="/molecules",
    tags=["Molecules"],
)


@router.get("/")
def get_molecules():
    return [
        {
            "id": 1,
            "name": "Pantoprazole",
            "atc": "A02BC02",
        },
        {
            "id": 2,
            "name": "Benzydamine",
            "atc": "R02AX03",
        },
        {
            "id": 3,
            "name": "Paracetamol",
            "atc": "N02BE01",
        },
    ]