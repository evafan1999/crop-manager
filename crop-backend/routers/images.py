from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from database import get_db
from models import CropImage
import os, models, uuid, shutil

router = APIRouter(prefix="/images", tags=["Images"])

UPLOAD_DIR = "static/images"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.delete("/images/{image_id}", status_code=204)
def delete_crop_image(image_id: int, db: Session = Depends(get_db)):
    db_image = db.query(models.CropImage).filter(models.CropImage.id == image_id).first()
    if db_image is None:
        raise HTTPException(status_code=404, detail="Image not found")

    # 刪除檔案
    image_path = db_image.image_path
    try:
        full_path = os.path.join(".", image_path.lstrip("/"))
        if os.path.exists(full_path):
            os.remove(full_path)
    except Exception as e:
        print("刪除圖片檔案失敗：", e)

    db.delete(db_image)
    db.commit()
    return {"detail": "刪除成功"}
    
@router.post("/upload/{crop_id}")
async def upload_images(crop_id: int, files: list[UploadFile] = File(...), db: Session = Depends(get_db)):
    saved_files = []

    try:
        for file in files:
            ext = file.filename.split(".")[-1]
            filename = f"{uuid.uuid4()}.{ext}"
            filepath = os.path.join(UPLOAD_DIR, filename)

            with open(filepath, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            image = CropImage(crop_id=crop_id, image_path=f"/images/{filename}")
            db.add(image)
            saved_files.append(image.image_path)

        db.commit()
        return {"uploaded": saved_files}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"圖片上傳失敗：{e}")