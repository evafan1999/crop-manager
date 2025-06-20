# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routers.crops import router as crops_router
from routers.images import router as image_router
from routers import images
# from database import Base, engine

app = FastAPI()

# Base.metadata.drop_all(bind=engine)  # ⚠️ 清空資料表（包含圖片資料）
# Base.metadata.create_all(bind=engine)

# CORS 設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # http://localhost:5173
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/", StaticFiles(directory="static", html=True), name="static")

# 路由掛載
app.include_router(crops_router, prefix="/api")
app.include_router(image_router, prefix="/api")
app.include_router(images.router)

app.mount("/uploaded_images", StaticFiles(directory="uploaded_images"), name="uploaded_images")
