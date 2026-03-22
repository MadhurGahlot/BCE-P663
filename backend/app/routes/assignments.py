from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.assignments import Assignment
from app.schemas.assignments_schemas import AssignmentCreate, AssignmentResponse
from app.utils.dependies import get_current_teacher

router = APIRouter(prefix="/assignments", tags=["Assignments"])


# 🔌 Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ✅ Create Assignment (Teacher Only)
@router.post("/", response_model=AssignmentResponse)
def create_assignment(
    assignment: AssignmentCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_teacher)
):
    new_assignment = Assignment(
        title=assignment.title,
        subject=assignment.subject,
        department=assignment.department,
        deadline=assignment.deadline,
        total_marks=assignment.total_marks,
        created_by=current_user["user_id"]   # ✅ FIXED (IMPORTANT)
    )

    db.add(new_assignment)
    db.commit()
    db.refresh(new_assignment)

    return new_assignment


# ✅ Get All Assignments
@router.get("/", response_model=list[AssignmentResponse])
def get_assignments(db: Session = Depends(get_db)):
    return db.query(Assignment).all()


# ✅ Get One Assignment
@router.get("/{assignment_id}", response_model=AssignmentResponse)
def get_assignment(assignment_id: int, db: Session = Depends(get_db)):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()

    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    return assignment


# ✅ Delete Assignment (Teacher Only)
@router.delete("/{assignment_id}")
def delete_assignment(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_teacher)
):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()

    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    db.delete(assignment)
    db.commit()

    return {"message": "Assignment deleted successfully"}