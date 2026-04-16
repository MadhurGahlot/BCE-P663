from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)

    assignment_id = Column(Integer, ForeignKey("assignments.id"))
    student_id = Column(Integer, ForeignKey("users.id"))

    file_path = Column(String)
    content = Column(Text)

    created_at = Column(DateTime, default=datetime.utcnow)

    # ✅ RELATIONS
    assignment = relationship("Assignment", back_populates="submissions")
    student = relationship("User", back_populates="submissions")

    ocr_text = Column(Text, nullable=True)