from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.assignments import Assignment
from app.models.grading import GradingRule
from app.models.submission import Submission
from app.routes.auth import get_current_teacher

router = APIRouter(prefix="/grading", tags=["Grading"])


@router.post("/set/{assignment_id}")
def set_grading_rules(
    assignment_id: int,
    low: int,
    high: int,
    marks_low: int,
    marks_medium: int,
    marks_high: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_teacher),
):
    if low < 0 or high > 100 or low >= high:
        raise HTTPException(status_code=400, detail="Invalid similarity thresholds")

    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    rule = db.query(GradingRule).filter(
        GradingRule.assignment_id == assignment_id
    ).first()

    if rule:
        rule.low = low
        rule.high = high
        rule.marks_low = marks_low
        rule.marks_medium = marks_medium
        rule.marks_high = marks_high
    else:
        rule = GradingRule(
            assignment_id=assignment_id,
            low=low,
            high=high,
            marks_low=marks_low,
            marks_medium=marks_medium,
            marks_high=marks_high,
        )
        db.add(rule)

    db.commit()
    db.refresh(rule)

    return {"message": "Grading rules saved"}

from pydantic import BaseModel
class GradeSubmissionRequest(BaseModel):
    grade: int
    feedback: str = ""

@router.put("/{submission_id}")
def grade_submission(
    submission_id: int,
    request: GradeSubmissionRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_teacher),
):
    sub = db.query(Submission).filter(Submission.id == submission_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found")
        
    sub.grade = request.grade
    sub.feedback = request.feedback
    
    db.commit()
    db.refresh(sub)
    
    return {"message": "Submission graded successfully", "grade": sub.grade}
