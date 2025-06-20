# schemas.py
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class CropImage(BaseModel):
    id: int
    image_path: str

    class Config:
        orm_mode = True

class CropBase(BaseModel):
    name: str
    planting_date: str
    category: Optional[str] = None
    harvest_date: Optional[str] = None
    actual_harvest_date: Optional[str] = None
    yield_: Optional[str] = None
    area: Optional[str] = None
    origin: Optional[str] = None
    notes: Optional[str] = None

class CropCreate(CropBase):
    pass

class Crop(CropBase):
    id: int
    main_image_id: Optional[int] = None
    created_at: Optional[datetime] = None
    images: List[CropImage] = []

    class Config:
        orm_mode = True
