from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
import shutil
import os

from app.database import get_db
from app.models.submission import Submission
from app.models.similarity import Similarity
from app.services.ocr_service import process_pdf_with_sarvam
from app.services.similarity_service import calculate_similarity

router = APIRouter()

UPLOAD_DIR = "backend/uploads/submissions"


@router.post("/submit")
def upload_submission(
    assignment_id: int,
    student_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # 🔹 Save file
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 🔹 OCR processing
    print("🔍 Running OCR...")
    ocr_text = process_pdf_with_sarvam(file_path)

    # 🔹 Save submission
    new_submission = Submission(
        assignment_id=assignment_id,
        student_id=student_id,
        file_path=file_path,
        ocr_text=ocr_text
    )

    db.add(new_submission)
    db.commit()
    db.refresh(new_submission)

    # 🔥 Compare with existing submissions
    submissions = db.query(Submission).filter(
        Submission.assignment_id == assignment_id,
        Submission.id != new_submission.id
    ).all()

    results = []

    for sub in submissions:
        if not sub.ocr_text:
            continue

        score = calculate_similarity(new_submission.ocr_text, sub.ocr_text)

        similarity = Similarity(
            submission1_id=new_submission.id,
            submission2_id=sub.id,
            similarity=score
        )

        db.add(similarity)
        results.append({
            "compared_with": sub.id,
            "score": score
        })

    db.commit()

    return {
        "message": "Submission uploaded successfully",
        "submission_id": new_submission.id,
        "similarities": results
    }


