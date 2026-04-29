from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.assignments import Assignment
from app.models.similarity import Similarity
from app.models.submission import Submission
from app.services.ocr_service import process_pdf_with_sarvam
from app.services.similarity_service import calculate_similarity

router = APIRouter()

UPLOAD_DIR = Path("backend/uploads/submissions")
MAX_UPLOAD_SIZE = 25 * 1024 * 1024
ALLOWED_EXTENSIONS = {".pdf", ".txt", ".png", ".jpg", ".jpeg"}
ALLOWED_CONTENT_TYPES = {
    "application/pdf",
    "text/plain",
    "image/png",
    "image/jpeg",
}


def save_submission_file(file: UploadFile) -> str:
    original_name = Path(file.filename or "").name
    extension = Path(original_name).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS or file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file type",
        )

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    stored_name = f"{uuid4().hex}{extension}"
    file_path = UPLOAD_DIR / stored_name

    total_size = 0
    with file_path.open("wb") as buffer:
        while chunk := file.file.read(1024 * 1024):
            total_size += len(chunk)
            if total_size > MAX_UPLOAD_SIZE:
                buffer.close()
                file_path.unlink(missing_ok=True)
                raise HTTPException(
                    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    detail="File size exceeds 25 MB limit",
                )
            buffer.write(chunk)

    return str(file_path)


@router.post("/submit")
def upload_submission(
    assignment_id: int,
    student_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    file_path = save_submission_file(file)

    print("Running OCR...")
    ocr_text = process_pdf_with_sarvam(file_path)

    new_submission = Submission(
        assignment_id=assignment_id,
        student_id=student_id,
        file_path=file_path,
        ocr_text=ocr_text,
    )

    db.add(new_submission)
    db.commit()
    db.refresh(new_submission)

    submissions = db.query(Submission).filter(
        Submission.assignment_id == assignment_id,
        Submission.id != new_submission.id,
    ).all()

    results = []

    for sub in submissions:
        if not sub.ocr_text:
            continue

        score = calculate_similarity(new_submission.ocr_text, sub.ocr_text)

        similarity = Similarity(
            submission1_id=new_submission.id,
            submission2_id=sub.id,
            similarity=score,
        )

        db.add(similarity)
        results.append({
            "compared_with": sub.id,
            "score": score,
        })

    db.commit()

    return {
        "message": "Submission uploaded successfully",
        "submission_id": new_submission.id,
        "similarities": results,
    }
