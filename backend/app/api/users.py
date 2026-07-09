from pydantic import BaseModel
from fastapi import APIRouter, HTTPException

from app.services.user_registry import authenticate_user, create_user, list_users


router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


class CreateUserPayload(BaseModel):
    login: str
    password: str
    role: str = "user"
    full_name: str = ""


class LoginPayload(BaseModel):
    login: str
    password: str


@router.get("/")
def get_users():
    return {"users": list_users()}


@router.post("/")
def add_user(payload: CreateUserPayload):
    if len(payload.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
    try:
        user = create_user(payload.login, payload.password, payload.role, payload.full_name)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return {"status": "success", "user": user}


@router.post("/login")
def login(payload: LoginPayload):
    user = authenticate_user(payload.login, payload.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid login or password")
    return {"status": "success", "user": user}
