from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
import crud, models, schemas
from database import get_db
from utils.image import save_image

router = APIRouter()
class MainImageUpdate(BaseModel):
    image_id : int

# ✅ 取得所有作物（含圖片）
@router.get("/crops", response_model=List[schemas.Crop])
def get_crops(db: Session = Depends(get_db)):
    return crud.get_crops(db)

# ✅ 取得單一作物
@router.get("/crops/{crop_id}", response_model=schemas.Crop)
def get_crop(crop_id: int, db: Session = Depends(get_db)):
    crop = crud.get_crop(db, crop_id)
    if not crop:
        raise HTTPException(status_code=404, detail="Crop not found")
    return crop

# ✅ 新增作物（不含圖片）
@router.post("/crops", response_model=schemas.Crop)
def create_crop(crop: schemas.CropCreate, db: Session = Depends(get_db)):
    return crud.create_crop(db, crop)

# ✅ 上傳圖片（可多張）
@router.post("/crops/{crop_id}/images", response_model=List[schemas.CropImage])
def add_crop_images(
    crop_id: int,
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
):
    crop = crud.get_crop(db, crop_id)
    if not crop:
        raise HTTPException(status_code=404, detail="Crop not found")
    return crud.add_crop_images(db, crop_id, files)

@router.put("/crops/{crop_id}/main-image", response_model=schemas.Crop)
def update_main_image(crop_id: int, data: MainImageUpdate, db: Session = Depends(get_db)):
    crop = crud.set_main_image(db, crop_id, data.image_id)
    if not crop:
        raise HTTPException(status_code=404, detail="Crop not found")
    return crop
