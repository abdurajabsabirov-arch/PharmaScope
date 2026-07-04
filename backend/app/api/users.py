from pydantic import BaseModel
from fastapi import APIRouter, HTTPException

from app.services.user_registry import create_user, list_users


router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


class CreateUserPayload(BaseModel):
    login: str
    password: str
    role: str = "user"


@router.get("/")
def get_users():
    return {"users": list_users()}


@router.post("/")
def add_user(payload: CreateUserPayload):
    if len(payload.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
    try:
        user = create_user(payload.login, payload.password, payload.role)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return {"status": "success", "user": user}
