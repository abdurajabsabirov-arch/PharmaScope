from datetime import datetime
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.services.analytics_service import get_dashboard_data


router = APIRouter(
    prefix="/upload",
    tags=["Upload"],
)

UPLOAD_DIR = Path(__file__).resolve().parents[2] / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post("/")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename or not file.filename.lower().endswith((".xlsx", ".xls", ".csv")):
        raise HTTPException(status_code=400, detail="Only Excel or CSV files are supported")

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    safe_name = Path(file.filename).name
    file_path = UPLOAD_DIR / f"iqvia_{timestamp}_{safe_name}"

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    dashboard = get_dashboard_data(file_path)

    return {
        "status": "success",
        "filename": file.filename,
        "message": "File uploaded and dashboard data refreshed",
        "path": str(file_path),
        "dashboard": dashboard,
    }
