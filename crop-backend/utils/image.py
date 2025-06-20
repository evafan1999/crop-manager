# utils/image.py
import os
from uuid import uuid4
from fastapi import UploadFile

UPLOAD_DIR = "static/images"

def save_image(file: UploadFile) -> str:
    ext = file.filename.split('.')[-1]
    filename = f"{uuid4().hex}.{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as f:
        f.write(file.file.read())

    return f"/static/images/{filename}"
