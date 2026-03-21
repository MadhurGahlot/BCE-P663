from pydantic import BaseModel
from datetime import datetime


class AssignmentCreate(BaseModel):
    title: str
    subject: str
    department: str
    deadline: datetime
    total_marks: int


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