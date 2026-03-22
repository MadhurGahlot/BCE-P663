from pydantic import BaseModel
from datetime import datetime

class SubmissionResponse(BaseModel):
    id: int
    assignment_id: int
    student_id: int
    file_path: str
    created_at: datetime

    class Config:
        orm_mode = True