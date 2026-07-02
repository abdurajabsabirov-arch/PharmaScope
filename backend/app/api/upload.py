from fastapi import APIRouter
from fastapi import Depends
from fastapi import File
from fastapi import Form
from fastapi import UploadFile

from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.services.import_manager import ImportManager

router = APIRouter(
    prefix="/upload",
    tags=["Upload"],
)


@router.post("/")
async def upload_file(
    source: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):

    result = ImportManager.import_file(
    source=source,
    file=file.file,
    db=db,
)

    return result