from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.submission import Submission
from app.models.user import User

from app.utils.filehandler import save_file
from app.utils.contentextractor import extract_content
from fastapi import status
from sqlalchemy.orm import Session
from jose import jwt, JWTError

from app.database import get_db
from app.models.user import User

from app.routes.auth import get_current_student, get_current_teacher
router = APIRouter(prefix="/submission", tags=["Submission"])


# ✅ Submit Assignment
@router.post("/submit/{assignment_id}")
def submit_assignment(
    assignment_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_student)
):
    # Save file
    file_path = save_file(file, current_user.id)

    # Extract content
    content = extract_content(file_path)

    if content == "":
        raise HTTPException(status_code=400, detail="Empty or unsupported file")

    # Save in DB
    submission = Submission(
        assignment_id=assignment_id,
        student_id=current_user.id,
        file_path=file_path,
        content=content
    )

    db.add(submission)
    db.commit()
    db.refresh(submission)

    return {"message": "Submission successful"}


# ✅ Get all submissions (Teacher only)
@router.get("/assignment/{assignment_id}")
def get_submissions(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_teacher)
):
    submissions = db.query(Submission).filter(
        Submission.assignment_id == assignment_id
    ).all()

    return submissions
