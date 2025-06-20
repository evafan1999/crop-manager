# crud.py
from sqlalchemy.orm import Session
from fastapi import UploadFile
import models, schemas
from datetime import datetime
from models import CropImage
from utils.image import save_image

def create_crop(db: Session, crop: schemas.CropCreate):
    db_crop = models.Crop(**crop.model_dump())
    db.add(db_crop)
    db.commit()
    db.refresh(db_crop)
    return db_crop

def get_crops(db: Session):
    return db.query(models.Crop).all()

def get_crop(db: Session, crop_id: int):
    return db.query(models.Crop).filter(models.Crop.id == crop_id).first()

def add_crop_images(db: Session, crop_id: int, files: list[UploadFile]):
    image_paths = []
    for file in files:
        path = save_image(file)
        db_image = CropImage(crop_id=crop_id, image_path=path)
        db.add(db_image)
        image_paths.append(db_image)
    db.commit()
    return image_paths

def set_main_image(db: Session, crop_id: int, image_id: int):
    crop = db.query(models.Crop).filter(models.Crop.id == crop_id).first()
    if not crop:
        return None
    crop.main_image_id = image_id
    db.commit()
    db.refresh(crop)
    return crop