from fastapi import APIRouter

router = APIRouter(
    prefix="/health",
    tags=["Health"],
)


@router.get("/")
def health():
    return {
        "status": "ok",
        "application": "PharmaScope",
        "version": "1.0.0",
    }