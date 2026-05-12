from pathlib import Path
from uuid import uuid4

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    UploadFile,
    status,
)

from sqlalchemy.orm import (
    Session,
    joinedload
)

from app.database import get_db
from app.models.assignments import Assignment
from app.models.similarity import Similarity
from app.models.submission import Submission

from app.services.similarity_service import calculate_similarity

from app.routes.auth import (
    get_current_user,
    get_current_student,
)

import os
import zipfile
import json
import tempfile

from sarvamai import SarvamAI
from sarvamai.core.api_error import ApiError

from PyPDF2 import PdfReader, PdfWriter

router = APIRouter(
    prefix="/submissions",
    tags=["Submissions"]
)

UPLOAD_DIR = Path("backend/uploads/submissions")

MAX_UPLOAD_SIZE = 25 * 1024 * 1024

ALLOWED_EXTENSIONS = {
    ".pdf",
    ".txt",
    ".png",
    ".jpg",
    ".jpeg",
}


# ==========================================
# SAVE FILE SAFELY
# ==========================================
def save_submission_file(
    file: UploadFile
) -> str:

    original_name = Path(
        file.filename or ""
    ).name

    extension = Path(
        original_name
    ).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file type",
        )

    UPLOAD_DIR.mkdir(
        parents=True,
        exist_ok=True
    )

    stored_name = (
        f"{uuid4().hex}{extension}"
    )

    file_path = (
        UPLOAD_DIR / stored_name
    )

    total_size = 0

    with file_path.open("wb") as buffer:

        while chunk := file.file.read(
            1024 * 1024
        ):

            total_size += len(chunk)

            if total_size > MAX_UPLOAD_SIZE:

                buffer.close()

                file_path.unlink(
                    missing_ok=True
                )

                raise HTTPException(
                    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    detail="File size exceeds 25 MB limit",
                )

            buffer.write(chunk)

    return str(file_path)


# ==========================================
# LOCAL TEXT EXTRACTION
# ==========================================
def extract_text_locally(
    file_path: str
) -> str:

    try:

        text = ""

        # TXT FILE
        if file_path.lower().endswith(".txt"):

            with open(
                file_path,
                "r",
                encoding="utf-8"
            ) as f:

                return f.read()

        # PDF FILE
        if file_path.lower().endswith(".pdf"):

            reader = PdfReader(
                file_path
            )

            for page in reader.pages:

                extracted = (
                    page.extract_text()
                )

                if extracted:
                    text += (
                        extracted + "\n"
                    )

        return text.strip()

    except Exception as e:

        print(
            f"Local extraction failed: {e}"
        )

        return ""


# ==========================================
# SARVAM OCR
# ==========================================
def process_pdf_with_sarvam(
    file_path: str
) -> str:

    try:

        API_KEY = os.getenv(
            "API_KEY"
        )

        client = SarvamAI(
            api_subscription_key=API_KEY
        )

        def get_first_n_pages(
            pdf_path,
            output_path,
            n=5
        ):

            reader = PdfReader(
                pdf_path
            )

            writer = PdfWriter()

            for i in range(
                min(
                    n,
                    len(reader.pages)
                )
            ):

                writer.add_page(
                    reader.pages[i]
                )

            with open(
                output_path,
                "wb"
            ) as f:

                writer.write(f)

            return output_path

        upload_path = file_path

        if file_path.lower().endswith(".pdf"):

            trimmed_pdf = file_path.replace(
                ".pdf",
                "_trimmed.pdf"
            )

            get_first_n_pages(
                file_path,
                trimmed_pdf,
                n=5
            )

            upload_path = trimmed_pdf

        job = client.document_intelligence.create_job(
            language="en-IN",
            output_format="md"
        )

        job.upload_file(
            upload_path
        )

        job.start()

        status = (
            job.wait_until_complete()
        )

        if (
            file_path.lower().endswith(".pdf")
            and os.path.exists(upload_path)
        ):
            os.remove(upload_path)

        if status.job_state not in (
            "Completed",
            "PartiallyCompleted",
        ):

            print(
                f"Job ended with state: {status.job_state}"
            )

            return ""

        with tempfile.NamedTemporaryFile(
            suffix=".zip",
            delete=False
        ) as tmp_zip:

            tmp_zip_path = (
                tmp_zip.name
            )

        job.download_output(
            tmp_zip_path
        )

        text_parts = []

        with zipfile.ZipFile(
            tmp_zip_path,
            "r"
        ) as z:

            for name in z.namelist():

                if name.endswith(".md"):

                    with z.open(name) as f:

                        text_parts.append(
                            f.read().decode(
                                "utf-8"
                            )
                        )

                elif name.endswith(".json"):

                    with z.open(name) as f:

                        data = json.load(f)

                        if isinstance(
                            data,
                            list
                        ):

                            for page in data:

                                if isinstance(
                                    page,
                                    dict
                                ):

                                    text_parts.append(
                                        page.get(
                                            "text",
                                            ""
                                        )
                                        or
                                        page.get(
                                            "content",
                                            ""
                                        )
                                    )

                        elif isinstance(
                            data,
                            dict
                        ):

                            text_parts.append(
                                data.get(
                                    "text",
                                    ""
                                )
                                or
                                data.get(
                                    "content",
                                    ""
                                )
                            )

        os.remove(tmp_zip_path)

        return "\n".join(
            text_parts
        ).strip()

    except ApiError as e:

        print(
            f"Sarvam API error {e.status_code}: {e.body}"
        )

        return ""

    except Exception as e:

        print(
            f"Unexpected OCR error: {e}"
        )

        return ""


# ==========================================
# MAIN SUBMISSION ROUTE
# ==========================================
@router.post("/submit")
def upload_submission(
    assignment_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(
        get_current_student
    ),
):

    student_id = current_user.id

    assignment = (
        db.query(Assignment)
        .filter(
            Assignment.id == assignment_id
        )
        .first()
    )

    if not assignment:

        raise HTTPException(
            status_code=404,
            detail="Assignment not found"
        )

    file_path = save_submission_file(
        file
    )

    print(
        "Trying local extraction..."
    )

    ocr_text = extract_text_locally(
        file_path
    )

    if (
        not ocr_text
        or
        len(
            ocr_text.strip()
        ) < 30
    ):

        print(
            "Using Sarvam OCR..."
        )

        ocr_text = (
            process_pdf_with_sarvam(
                file_path
            )
        )

    else:

        print(
            "Local extraction successful."
        )

    new_submission = Submission(
        assignment_id=assignment_id,
        student_id=student_id,
        file_path=file_path,
        ocr_text=ocr_text,
    )

    db.add(new_submission)

    db.commit()

    db.refresh(new_submission)

    submissions = (
        db.query(Submission)
        .filter(
            Submission.assignment_id
            == assignment_id,

            Submission.id
            != new_submission.id,
        )
        .all()
    )

    results = []

    for sub in submissions:

        if not sub.ocr_text:
            continue

        if sub.student_id == student_id:
            continue

        id1 = min(
            new_submission.id,
            sub.id
        )

        id2 = max(
            new_submission.id,
            sub.id
        )

        existing = (
            db.query(Similarity)
            .filter(
                Similarity.submission1_id
                == id1,

                Similarity.submission2_id
                == id2
            )
            .first()
        )

        if existing:
            continue

        score = calculate_similarity(
            new_submission.ocr_text,
            sub.ocr_text
        )

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
        "message":
            "Submission uploaded successfully",

        "submission_id":
            new_submission.id,

        "ocr_text_length":
            len(ocr_text),

        "similarities":
            results,
    }


# ==========================================
# GET SUBMISSIONS FOR ASSIGNMENT
# ==========================================
@router.get("/assignment/{assignment_id}")
def get_submissions_for_assignment(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(
        get_current_user
    )
):

    if current_user.role == "teacher":

        return (
            db.query(Submission)
            .options(joinedload(Submission.student))
            .join(Assignment)
            .filter(
                Submission.assignment_id
                == assignment_id,

                Assignment.created_by
                == current_user.id
            )
            .all()
        )

    return (
        db.query(Submission)
        .filter(
            Submission.assignment_id
            == assignment_id,

            Submission.student_id
            == current_user.id
        )
        .all()
    )


# ==========================================
# GET ALL SUBMISSIONS
# ==========================================
@router.get("/")
def get_all_submissions(
    db: Session = Depends(get_db),
    current_user=Depends(
        get_current_user
    )
):

    if current_user.role == "teacher":

        return (
            db.query(Submission)
            .options(joinedload(Submission.student))
            .join(Assignment)
            .filter(
                Assignment.created_by
                == current_user.id
            )
            .all()
        )

    return (
        db.query(Submission)
        .filter(
            Submission.student_id
            == current_user.id
        )
        .all()
    )


# ==========================================
# STUDENT HISTORY
# ==========================================
@router.get("/student/{student_id}/history")
def get_student_history(
    student_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(
        get_current_user
    ),
):

    if current_user.role == "teacher":

        submissions = (
            db.query(Submission)
            .filter(
                Submission.student_id
                == student_id
            )
            .all()
        )

    elif str(current_user.id) == str(student_id):

        submissions = (
            db.query(Submission)
            .filter(
                Submission.student_id
                == student_id
            )
            .all()
        )

    else:

        raise HTTPException(
            status_code=403,
            detail="Not authorized"
        )

    results = []

    for sub in submissions:

        from sqlalchemy import func

        max_sim = (
            db.query(
                func.max(
                    Similarity.similarity
                )
            )
            .filter(
                (
                    Similarity.submission1_id
                    == sub.id
                )
                |
                (
                    Similarity.submission2_id
                    == sub.id
                )
            )
            .scalar()
        )

        results.append({
            "id": sub.id,
            "assignment_id": sub.assignment_id,
            "student_id": sub.student_id,
            "file_path": sub.file_path,
            "ocr_text": sub.ocr_text,
            "grade": sub.grade,
            "max_similarity": max_sim if max_sim is not None else 0,
            "created_at": sub.created_at.isoformat() if sub.created_at else None,
        })

    return results