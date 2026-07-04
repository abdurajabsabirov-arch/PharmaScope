from __future__ import annotations

from datetime import datetime
import json
from pathlib import Path
from typing import Any
from uuid import uuid4


BACKEND_DIR = Path(__file__).resolve().parents[2]
UPLOAD_DIR = BACKEND_DIR / "uploads"
REGISTRY_FILE = UPLOAD_DIR / ".file_registry.json"
SUPPORTED_EXTENSIONS = {".xlsx", ".xls", ".csv"}

UPLOAD_DIR.mkdir(exist_ok=True)


def _read_registry() -> dict[str, Any]:
    if not REGISTRY_FILE.exists():
        return {"active_id": None, "files": []}

    try:
        payload = json.loads(REGISTRY_FILE.read_text(encoding="utf-8"))
    except Exception:
        return {"active_id": None, "files": []}

    return {
        "active_id": payload.get("active_id"),
        "files": [item for item in payload.get("files", []) if isinstance(item, dict)],
    }


def _write_registry(payload: dict[str, Any]) -> None:
    REGISTRY_FILE.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


def _file_info(path: Path, entry: dict[str, Any], active_id: str | None) -> dict[str, Any]:
    stat = path.stat() if path.exists() else None
    return {
        "id": entry["id"],
        "filename": entry["filename"],
        "stored_name": path.name,
        "country": entry.get("country") or "Uzbekistan",
        "uploaded_at": entry.get("uploaded_at"),
        "size": stat.st_size if stat else 0,
        "active": entry["id"] == active_id,
    }


def register_upload(path: Path, original_filename: str, country: str) -> dict[str, Any]:
    registry = _read_registry()
    entry = {
        "id": uuid4().hex,
        "filename": original_filename,
        "stored_name": path.name,
        "path": str(path),
        "country": country or "Uzbekistan",
        "uploaded_at": datetime.now().isoformat(timespec="seconds"),
    }
    registry["files"] = [entry, *registry["files"]]
    registry["active_id"] = entry["id"]
    _write_registry(registry)
    return _file_info(path, entry, registry["active_id"])


def list_uploads() -> list[dict[str, Any]]:
    registry = _read_registry()
    active_id = registry.get("active_id")
    files: list[dict[str, Any]] = []

    for entry in registry["files"]:
        path = Path(entry.get("path") or UPLOAD_DIR / entry.get("stored_name", ""))
        if path.exists() and path.suffix.lower() in SUPPORTED_EXTENSIONS:
            files.append(_file_info(path, entry, active_id))

    if not files:
        discovered = [
            path
            for extension in SUPPORTED_EXTENSIONS
            for path in UPLOAD_DIR.glob(f"*{extension}")
            if path.is_file()
        ]
        for path in sorted(discovered, key=lambda item: item.stat().st_mtime, reverse=True):
            files.append(
                {
                    "id": path.stem,
                    "filename": path.name,
                    "stored_name": path.name,
                    "country": "Uzbekistan",
                    "uploaded_at": datetime.fromtimestamp(path.stat().st_mtime).isoformat(timespec="seconds"),
                    "size": path.stat().st_size,
                    "active": path == max(discovered, key=lambda item: item.stat().st_mtime),
                }
            )

    return files


def activate_upload(file_id: str) -> dict[str, Any] | None:
    registry = _read_registry()
    for entry in registry["files"]:
        if entry.get("id") == file_id:
            registry["active_id"] = file_id
            _write_registry(registry)
            return _file_info(Path(entry["path"]), entry, file_id)

    legacy_path = _find_legacy_upload(file_id)
    if legacy_path:
        entry = {
            "id": legacy_path.stem,
            "filename": legacy_path.name,
            "stored_name": legacy_path.name,
            "path": str(legacy_path),
            "country": "Uzbekistan",
            "uploaded_at": datetime.fromtimestamp(legacy_path.stat().st_mtime).isoformat(timespec="seconds"),
        }
        registry["files"] = [entry, *registry["files"]]
        registry["active_id"] = entry["id"]
        _write_registry(registry)
        return _file_info(legacy_path, entry, entry["id"])
    return None


def delete_upload(file_id: str) -> bool:
    registry = _read_registry()
    entry = next((item for item in registry["files"] if item.get("id") == file_id), None)
    if not entry:
        legacy_path = _find_legacy_upload(file_id)
        if not legacy_path:
            return False
        try:
            legacy_path.unlink()
        except Exception:
            return False
        return True

    path = Path(entry.get("path", ""))
    registry["files"] = [item for item in registry["files"] if item.get("id") != file_id]
    if registry.get("active_id") == file_id:
        registry["active_id"] = registry["files"][0]["id"] if registry["files"] else None
    _write_registry(registry)

    try:
        if path.exists() and path.is_file() and path.parent == UPLOAD_DIR:
            path.unlink()
    except Exception:
        pass

    return True


def _find_legacy_upload(file_id: str) -> Path | None:
    for extension in SUPPORTED_EXTENSIONS:
        candidate = UPLOAD_DIR / f"{file_id}{extension}"
        if candidate.exists() and candidate.is_file():
            return candidate
    return None


def get_active_upload_entry() -> dict[str, Any] | None:
    registry = _read_registry()
    active_id = registry.get("active_id")
    entries = registry["files"]

    entry = next((item for item in entries if item.get("id") == active_id), None)
    if entry and Path(entry.get("path", "")).exists():
        return entry

    uploads = list_uploads()
    if uploads:
        active = next((item for item in uploads if item.get("active")), uploads[0])
        return {
            "id": active["id"],
            "filename": active["filename"],
            "stored_name": active["stored_name"],
            "path": str(UPLOAD_DIR / active["stored_name"]),
            "country": active.get("country") or "Uzbekistan",
            "uploaded_at": active.get("uploaded_at"),
        }
    return None


def get_active_upload_path() -> Path | None:
    entry = get_active_upload_entry()
    if not entry:
        return None
    path = Path(entry["path"])
    return path if path.exists() else None
