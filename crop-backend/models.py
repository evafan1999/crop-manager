from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class Crop(Base):
    __tablename__ = "crops"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    planting_date = Column(String)
    category = Column(String)
    harvest_date = Column(String)
    actual_harvest_date = Column(String)
    yield_ = Column(String)
    area = Column(String)
    origin = Column(String)
    notes = Column(String)
    created_at = Column(DateTime, default=datetime.now)

    main_image_id = Column(Integer, ForeignKey("cropimage.id"), nullable=True)

    images = relationship(
        "CropImage",
        back_populates="crop",
        foreign_keys="CropImage.crop_id"
    )
    main_image = relationship(
        "CropImage",
        foreign_keys=[main_image_id]
    )

class CropImage(Base):
    __tablename__ = "cropimage"

    id = Column(Integer, primary_key=True, index=True)
    crop_id = Column(Integer, ForeignKey("crops.id"))
    image_path = Column(String)

    crop = relationship(
        "Crop",
        back_populates="images",
        foreign_keys=[crop_id]
    )
