from __future__ import annotations

from datetime import datetime
import json
import os
from pathlib import Path
from typing import Any
from uuid import uuid4


BACKEND_DIR = Path(os.environ.get("PHARMASCOPE_BACKEND_DIR", Path(__file__).resolve().parents[2]))
UPLOAD_DIR = BACKEND_DIR / "uploads"
REGISTRY_FILE = UPLOAD_DIR / ".file_registry.json"
SUPPORTED_EXTENSIONS = {".xlsx", ".xls", ".csv"}

UPLOAD_DIR.mkdir(exist_ok=True)


def _read_registry() -> dict[str, Any]:
    if not REGISTRY_FILE.exists():
        return {"active_id": None, "active_by_destination": {}, "files": []}

    try:
        payload = json.loads(REGISTRY_FILE.read_text(encoding="utf-8"))
    except Exception:
        return {"active_id": None, "active_by_destination": {}, "files": []}

    files = [item for item in payload.get("files", []) if isinstance(item, dict)]
    active_by_destination = payload.get("active_by_destination") if isinstance(payload.get("active_by_destination"), dict) else {}
    if payload.get("active_id") and "market_intelligence" not in active_by_destination:
        active_by_destination["market_intelligence"] = payload.get("active_id")
    for item in files:
        destination = item.get("destination") or "market_intelligence"
        if destination not in active_by_destination:
            active_by_destination[destination] = item.get("id")

    return {
        "active_id": payload.get("active_id"),
        "active_by_destination": active_by_destination,
        "files": files,
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
        "destination": entry.get("destination") or "market_intelligence",
        "source": entry.get("source") or "iqvia",
    }


def register_upload(
    path: Path,
    original_filename: str,
    country: str,
    destination: str = "market_intelligence",
    source: str = "iqvia",
    make_active: bool = True,
) -> dict[str, Any]:
    registry = _read_registry()
    entry = {
        "id": uuid4().hex,
        "filename": original_filename,
        "stored_name": path.name,
        "path": str(path),
        "country": country or "Uzbekistan",
        "destination": destination,
        "source": source,
        "uploaded_at": datetime.now().isoformat(timespec="seconds"),
    }
    registry["files"] = [entry, *registry["files"]]
    if make_active:
        _clear_destination_cache(destination)
        registry.setdefault("active_by_destination", {})[destination] = entry["id"]
        if destination == "market_intelligence":
            registry["active_id"] = entry["id"]
    _write_registry(registry)
    return _file_info(path, entry, registry.get("active_by_destination", {}).get(destination))


def list_uploads() -> list[dict[str, Any]]:
    registry = _read_registry()
    active_by_destination = registry.get("active_by_destination", {})
    files: list[dict[str, Any]] = []

    for entry in registry["files"]:
        path = Path(entry.get("path") or UPLOAD_DIR / entry.get("stored_name", ""))
        if path.exists() and path.suffix.lower() in SUPPORTED_EXTENSIONS:
            destination = entry.get("destination") or "market_intelligence"
            active_id = active_by_destination.get(destination)
            if not active_id and destination == "market_intelligence":
                active_id = registry.get("active_id")
            files.append(_file_info(path, entry, active_id))

    if not files:
        discovered = [
            path
            for extension in SUPPORTED_EXTENSIONS
            for path in UPLOAD_DIR.glob(f"*{extension}")
            if path.is_file()
        ]
        latest_by_destination: dict[str, Path] = {}
        for path in discovered:
            destination = _destination_for_path(path)
            latest = latest_by_destination.get(destination)
            if latest is None or path.stat().st_mtime > latest.stat().st_mtime:
                latest_by_destination[destination] = path

        for path in sorted(discovered, key=lambda item: item.stat().st_mtime, reverse=True):
            destination = _destination_for_path(path)
            files.append(
                {
                    "id": path.stem,
                    "filename": path.name,
                    "stored_name": path.name,
                    "country": "Uzbekistan",
                    "uploaded_at": datetime.fromtimestamp(path.stat().st_mtime).isoformat(timespec="seconds"),
                    "size": path.stat().st_size,
                    "active": path == latest_by_destination.get(destination),
                    "destination": destination,
                    "source": _source_for_path(path),
                }
            )

    return files


def activate_upload(file_id: str) -> dict[str, Any] | None:
    registry = _read_registry()
    for entry in registry["files"]:
        if entry.get("id") == file_id:
            destination = entry.get("destination") or "market_intelligence"
            _clear_destination_cache(destination)
            registry.setdefault("active_by_destination", {})[destination] = file_id
            if destination == "market_intelligence":
                registry["active_id"] = file_id
            _write_registry(registry)
            return _file_info(Path(entry["path"]), entry, file_id)

    legacy_path = _find_legacy_upload(file_id)
    if legacy_path:
        destination = _destination_for_path(legacy_path)
        _clear_destination_cache(destination)
        entry = {
            "id": legacy_path.stem,
            "filename": legacy_path.name,
            "stored_name": legacy_path.name,
            "path": str(legacy_path),
            "country": "Uzbekistan",
            "destination": destination,
            "source": _source_for_path(legacy_path),
            "uploaded_at": datetime.fromtimestamp(legacy_path.stat().st_mtime).isoformat(timespec="seconds"),
        }
        registry["files"] = [entry, *registry["files"]]
        registry.setdefault("active_by_destination", {})[destination] = entry["id"]
        if destination == "market_intelligence":
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
        destination = _destination_for_path(legacy_path)
        try:
            legacy_path.unlink()
        except Exception:
            return False
        _clear_destination_cache(destination)
        return True

    path = Path(entry.get("path", ""))
    destination = entry.get("destination") or "market_intelligence"
    registry["files"] = [item for item in registry["files"] if item.get("id") != file_id]
    active_by_destination = registry.setdefault("active_by_destination", {})
    if active_by_destination.get(destination) == file_id:
        next_entry = next(
            (item for item in registry["files"] if (item.get("destination") or "market_intelligence") == destination),
            None,
        )
        active_by_destination[destination] = next_entry["id"] if next_entry else None
    if registry.get("active_id") == file_id or destination == "market_intelligence":
        registry["active_id"] = active_by_destination.get("market_intelligence")
    _write_registry(registry)

    try:
        if path.exists() and path.is_file() and path.parent == UPLOAD_DIR:
            path.unlink()
    except Exception:
        pass

    _clear_destination_cache(destination)
    return True


def _find_legacy_upload(file_id: str) -> Path | None:
    direct = UPLOAD_DIR / file_id
    if direct.exists() and direct.is_file() and direct.suffix.lower() in SUPPORTED_EXTENSIONS:
        return direct

    for extension in SUPPORTED_EXTENSIONS:
        candidate = UPLOAD_DIR / f"{file_id}{extension}"
        if candidate.exists() and candidate.is_file():
            return candidate
    return None


def _destination_for_path(path: Path) -> str:
    name = path.name.lower()
    if name.startswith("performance_") or "secondary sales" in name:
        return "performance_cockpit"
    return "market_intelligence"


def _source_for_path(path: Path) -> str:
    return "performance" if _destination_for_path(path) == "performance_cockpit" else "iqvia"


def _clear_destination_cache(destination: str) -> None:
    if destination == "market_intelligence":
        cache_file = UPLOAD_DIR / ".dashboard_cache.json"
        try:
            if cache_file.exists():
                cache_file.unlink()
        except Exception:
            pass

    if destination == "performance_cockpit":
        for cache_file in (UPLOAD_DIR / ".performance_frame_cache.pkl", UPLOAD_DIR / ".performance_frame_cache.json"):
            try:
                if cache_file.exists():
                    cache_file.unlink()
            except Exception:
                pass


def get_active_upload_entry(destination: str = "market_intelligence") -> dict[str, Any] | None:
    registry = _read_registry()
    active_id = registry.get("active_by_destination", {}).get(destination)
    if destination == "market_intelligence":
        active_id = active_id or registry.get("active_id")
    entries = registry["files"]

    destination_entries = [item for item in entries if item.get("destination", "market_intelligence") == destination]
    entry = next((item for item in destination_entries if item.get("id") == active_id), None)
    if entry and Path(entry.get("path", "")).exists():
        return entry

    uploads = list_uploads()
    if uploads:
        destination_uploads = [item for item in uploads if item.get("destination", "market_intelligence") == destination]
        if not destination_uploads:
            return None
        active = next((item for item in destination_uploads if item.get("active")), destination_uploads[0])
        return {
            "id": active["id"],
            "filename": active["filename"],
            "stored_name": active["stored_name"],
            "path": str(UPLOAD_DIR / active["stored_name"]),
            "country": active.get("country") or "Uzbekistan",
            "destination": active.get("destination") or "market_intelligence",
            "source": active.get("source") or "iqvia",
            "uploaded_at": active.get("uploaded_at"),
        }
    return None


def get_active_upload_path() -> Path | None:
    entry = get_active_upload_entry()
    if not entry:
        return None
    path = Path(entry["path"])
    return path if path.exists() else None
