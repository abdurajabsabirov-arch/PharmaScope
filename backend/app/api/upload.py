from datetime import datetime
from pathlib import Path

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.services.analytics_service import get_dashboard_data
from app.services.file_registry import activate_upload, delete_upload, list_uploads, register_upload


router = APIRouter(
    prefix="/upload",
    tags=["Upload"],
)

UPLOAD_DIR = Path(__file__).resolve().parents[2] / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)


@router.get("/")
def get_uploads():
    return {"files": list_uploads()}


@router.post("/")
async def upload_file(file: UploadFile = File(...), country: str = Form("Uzbekistan")):
    if not file.filename or not file.filename.lower().endswith((".xlsx", ".xls", ".csv")):
        raise HTTPException(status_code=400, detail="Only Excel or CSV files are supported")

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    safe_name = Path(file.filename).name
    file_path = UPLOAD_DIR / f"market_{timestamp}_{safe_name}"

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    upload_info = register_upload(file_path, safe_name, country)
    dashboard = get_dashboard_data(file_path)

    return {
        "status": "success",
        "filename": file.filename,
        "message": "File uploaded and dashboard data refreshed",
        "path": str(file_path),
        "file": upload_info,
        "dashboard": dashboard,
    }


@router.post("/{file_id}/activate")
def set_active_upload(file_id: str):
    upload_info = activate_upload(file_id)
    if not upload_info:
        raise HTTPException(status_code=404, detail="File not found")
    dashboard = get_dashboard_data()
    return {
        "status": "success",
        "file": upload_info,
        "dashboard": dashboard,
    }


@router.delete("/{file_id}")
def remove_upload(file_id: str):
    if not delete_upload(file_id):
        raise HTTPException(status_code=404, detail="File not found")
    return {"status": "success", "files": list_uploads()}
