from __future__ import annotations

from datetime import datetime
import hashlib
import json
import os
from pathlib import Path
from typing import Any
from uuid import uuid4


BACKEND_DIR = Path(os.environ.get("PHARMASCOPE_BACKEND_DIR", Path(__file__).resolve().parents[2]))
DATA_DIR = BACKEND_DIR / "uploads"
USERS_FILE = DATA_DIR / ".users.json"

DATA_DIR.mkdir(exist_ok=True)


DEMO_USERS = [
    {
        "id": "demo-admin",
        "login": "admin@pharmascope.local",
        "full_name": "Demo Admin",
        "password": "admin123",
        "role": "admin",
    },
    {
        "id": "demo-user",
        "login": "user@pharmascope.local",
        "full_name": "Demo User",
        "password": "user123",
        "role": "user",
    },
]


def _hash_password(password: str) -> str:
    return hashlib.sha256(password.strip().encode("utf-8")).hexdigest()


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


def _normalize_login(login: str) -> str:
    clean_login = login.strip().lower()
    aliases = {
        "admin": "admin@pharmascope.local",
        "user": "user@pharmascope.local",
    }
    return aliases.get(clean_login, clean_login)


def ensure_demo_users() -> None:
    users = _read_users()
    existing_logins = {item.get("login") for item in users}
    changed = False

    for demo in DEMO_USERS:
        if demo["login"] in existing_logins:
            continue
        users.append(
            {
                "id": demo["id"],
                "login": demo["login"],
                "full_name": demo["full_name"],
                "password_hash": _hash_password(demo["password"]),
                "role": demo["role"],
                "active": True,
                "created_at": datetime.now().isoformat(timespec="seconds"),
            }
        )
        changed = True

    if changed:
        _write_users(users)


def list_users() -> list[dict[str, Any]]:
    return [
        {
            "id": item["id"],
            "login": item["login"],
            "full_name": item.get("full_name") or item["login"],
            "role": item.get("role", "user"),
            "created_at": item.get("created_at"),
            "active": item.get("active", True),
        }
        for item in _read_users()
    ]


def create_user(login: str, password: str, role: str, full_name: str = "") -> dict[str, Any]:
    users = _read_users()
    clean_login = _normalize_login(login)
    if not clean_login:
        raise ValueError("Login is required")
    if any(item.get("login") == clean_login for item in users):
        raise ValueError("Login already exists")
    if role not in {"admin", "user"}:
        role = "user"

    user = {
        "id": uuid4().hex,
        "login": clean_login,
        "full_name": full_name.strip() or clean_login,
        "password_hash": _hash_password(password),
        "role": role,
        "active": True,
        "created_at": datetime.now().isoformat(timespec="seconds"),
    }
    users.insert(0, user)
    _write_users(users)
    return list_users()[0]


def authenticate_user(login: str, password: str) -> dict[str, Any] | None:
    ensure_demo_users()
    clean_login = _normalize_login(login)
    password_hash = _hash_password(password)

    for item in _read_users():
        if item.get("login") == clean_login and item.get("password_hash") == password_hash and item.get("active", True):
            return {
                "id": item["id"],
                "login": item["login"],
                "full_name": item.get("full_name") or item["login"],
                "role": item.get("role", "user"),
                "created_at": item.get("created_at"),
                "active": item.get("active", True),
            }
    return None
