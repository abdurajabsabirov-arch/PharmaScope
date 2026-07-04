from __future__ import annotations

from datetime import datetime
import hashlib
import json
from pathlib import Path
from typing import Any
from uuid import uuid4


BACKEND_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = BACKEND_DIR / "uploads"
USERS_FILE = DATA_DIR / ".users.json"

DATA_DIR.mkdir(exist_ok=True)


def _hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def _read_users() -> list[dict[str, Any]]:
    if not USERS_FILE.exists():
        return []
    try:
        payload = json.loads(USERS_FILE.read_text(encoding="utf-8"))
        return [item for item in payload.get("users", []) if isinstance(item, dict)]
    except Exception:
        return []


def _write_users(users: list[dict[str, Any]]) -> None:
    USERS_FILE.write_text(json.dumps({"users": users}, ensure_ascii=False, indent=2), encoding="utf-8")


def list_users() -> list[dict[str, Any]]:
    return [
        {
            "id": item["id"],
            "login": item["login"],
            "role": item.get("role", "user"),
            "created_at": item.get("created_at"),
            "active": item.get("active", True),
        }
        for item in _read_users()
    ]


def create_user(login: str, password: str, role: str) -> dict[str, Any]:
    users = _read_users()
    clean_login = login.strip().lower()
    if not clean_login:
        raise ValueError("Login is required")
    if any(item.get("login") == clean_login for item in users):
        raise ValueError("Login already exists")
    if role not in {"admin", "user"}:
        role = "user"

    user = {
        "id": uuid4().hex,
        "login": clean_login,
        "password_hash": _hash_password(password),
        "role": role,
        "active": True,
        "created_at": datetime.now().isoformat(timespec="seconds"),
    }
    users.insert(0, user)
    _write_users(users)
    return list_users()[0]
