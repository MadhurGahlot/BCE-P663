from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.submission import Submission
from app.routes.auth import get_current_teacher
from app.models.grading import GradingRule
from app.services.similarity_service import calculate_similarity

router = APIRouter(prefix="/similarity", tags=["Similarity"])


@router.get("/assignment/{assignment_id}")
def compare_submissions(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_teacher)
):
    submissions = db.query(Submission).filter(
        Submission.assignment_id == assignment_id
    ).all()

    rule = db.query(GradingRule).filter(
        GradingRule.assignment_id == assignment_id
    ).first()

    if len(submissions) < 2:
        return {"message": "Not enough submissions to compare"}

    results = []

    def calculate_marks(sim_percent):
        if not rule:
            return 0

        if sim_percent < rule.low:
            return rule.marks_low
        elif sim_percent < rule.high:
            return rule.marks_medium
        else:
            return rule.marks_high

    for i in range(len(submissions)):
        for j in range(i + 1, len(submissions)):
            # 🔹 Prefer ocr_text, fallback to content
            text1 = submissions[i].ocr_text or submissions[i].content or ""
            text2 = submissions[j].ocr_text or submissions[j].content or ""
            
            sim_score = calculate_similarity(text1, text2)
            sim_percent = round(sim_score * 100, 2)
            
            results.append({
                "studentid1": submissions[i].student_id,
                "studentid2": submissions[j].student_id,
                "similarityscore": sim_percent,
                "marks": calculate_marks(sim_percent)
            })

    return results