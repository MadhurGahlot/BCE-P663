from sqlalchemy import Column, Integer, ForeignKey
from app.database import Base


class GradingRule(Base):
    __tablename__ = "grading_rules"

    id = Column(Integer, primary_key=True, index=True)

    assignment_id = Column(Integer, ForeignKey("assignments.id"))

    low = Column(Integer)     # e.g. 30
    high = Column(Integer)    # e.g. 70

    marks_low = Column(Integer)
    marks_medium = Column(Integer)
    marks_high = Column(Integer)