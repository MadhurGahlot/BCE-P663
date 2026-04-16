from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class SubmissionResponse(BaseModel):
    id: int
    assignment_id: int
    student_id: int
    file_path: str
    ocr_text: Optional[str] = None
    created_at: datetime

    class Config:
        orm_mode = True