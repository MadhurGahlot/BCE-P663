from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class AssignmentCreate(BaseModel):
    title: str
    subject: str
    department: str
    deadline: datetime
    total_marks: int


class AssignmentUpdate(BaseModel):
    title: Optional[str] = None
    subject: Optional[str] = None
    department: Optional[str] = None
    deadline: Optional[datetime] = None
    total_marks: Optional[int] = None


class AssignmentResponse(BaseModel):
    id: int
    title: str
    subject: str
    department: str
    deadline: datetime
    total_marks: int
    created_by: int

    class Config:
        # orm_mode = True
        from_attributes = True