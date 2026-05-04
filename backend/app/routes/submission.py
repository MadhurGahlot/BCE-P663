from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.assignments import Assignment
from app.models.similarity import Similarity
from app.models.submission import Submission
from app.services.ocr_service import process_pdf_with_sarvam
from app.services.similarity_service import calculate_similarity
from app.routes.auth import get_current_user

router = APIRouter(prefix="/submissions", tags=["Submissions"])

UPLOAD_DIR = Path("backend/uploads/submissions")
MAX_UPLOAD_SIZE = 25 * 1024 * 1024
ALLOWED_EXTENSIONS = {".pdf", ".txt", ".png", ".jpg", ".jpeg"}


# ✅ Save file safely
def save_submission_file(file: UploadFile) -> str:
    original_name = Path(file.filename or "").name
    extension = Path(original_name).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
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


# ✅ MAIN UPLOAD ROUTE (OPTIMIZED)
@router.post("/submit")
def upload_submission(
    assignment_id: int = Form(...),
    student_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    # ✅ Check assignment exists
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    # ✅ Save file
    file_path = save_submission_file(file)

    # ✅ OCR
    print("Running OCR...")
    ocr_text = process_pdf_with_sarvam(file_path)

    # ✅ Save submission
    new_submission = Submission(
        assignment_id=assignment_id,
        student_id=student_id,
        file_path=file_path,
        ocr_text=ocr_text,
    )

    db.add(new_submission)
    db.commit()
    db.refresh(new_submission)

    # ✅ Get previous submissions
    submissions = db.query(Submission).filter(
        Submission.assignment_id == assignment_id,
        Submission.id != new_submission.id,
    ).all()

    results = []

    for sub in submissions:
        # ❌ Skip if no OCR
        if not sub.ocr_text:
            continue

        # ❌ Skip same student
        if sub.student_id == student_id:
            continue

        # ✅ Avoid duplicate pairs
        id1 = min(new_submission.id, sub.id)
        id2 = max(new_submission.id, sub.id)

        existing = db.query(Similarity).filter(
            Similarity.submission1_id == id1,
            Similarity.submission2_id == id2
        ).first()

        if existing:
            continue

        # ✅ Calculate similarity
        score = calculate_similarity(new_submission.ocr_text, sub.ocr_text)

        similarity = Similarity(
            submission1_id=id1,
            submission2_id=id2,
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


# ✅ GET submissions
@router.get("/assignment/{assignment_id}")
def get_submissions_for_assignment(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.role == "teacher":
        return db.query(Submission).filter(
            Submission.assignment_id == assignment_id
        ).all()
    else:
        return db.query(Submission).filter(
            Submission.assignment_id == assignment_id,
            Submission.student_id == current_user.id
        ).all()
    
@router.get("/")
def get_all_submissions(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # Teacher → all submissions
    if current_user.role == "teacher":
        return db.query(Submission).all()

    # Student → only their submissions
    return db.query(Submission).filter(
        Submission.student_id == current_user.id
    ).all()