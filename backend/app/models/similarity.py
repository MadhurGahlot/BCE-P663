from sqlalchemy import Column, Integer, Float, ForeignKey
from app.database import Base

class Similarity(Base):
    __tablename__ = "similarities"

    id = Column(Integer, primary_key=True, index=True)
    submission1_id = Column(Integer, ForeignKey("submissions.id"))
    submission2_id = Column(Integer, ForeignKey("submissions.id"))
    similarity = Column(Float)