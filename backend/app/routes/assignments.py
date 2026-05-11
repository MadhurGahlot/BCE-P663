from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.assignments import Assignment
from app.models.user import User
from app.schemas.assignments_schemas import AssignmentCreate, AssignmentResponse, AssignmentUpdate
from app.utils.dependencies import get_current_teacher

router = APIRouter(prefix="/assignments", tags=["Assignments"])


@router.post("/", response_model=AssignmentResponse)
def create_assignment(
    assignment: AssignmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_teacher),
):
    new_assignment = Assignment(
        title=assignment.title,
        subject=assignment.subject,
        department=assignment.department,
        deadline=assignment.deadline,
        total_marks=assignment.total_marks,
        created_by=current_user.id,
    )

    db.add(new_assignment)
    db.commit()
    db.refresh(new_assignment)

    return new_assignment


# ✅ GET all assignments (public, for students)
@router.get("/", response_model=list[AssignmentResponse])
def get_assignments(db: Session = Depends(get_db)):
    return db.query(Assignment).all()


# ✅ GET only the current teacher's assignments
@router.get("/teacher/me", response_model=list[AssignmentResponse])
def get_my_assignments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_teacher),
):
    return db.query(Assignment).filter(Assignment.created_by == current_user.id).all()


@router.get("/{assignment_id}", response_model=AssignmentResponse)
def get_assignment(assignment_id: int, db: Session = Depends(get_db)):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()

    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    return assignment


# ✅ UPDATE assignment (teacher only, owner only)
@router.put("/{assignment_id}", response_model=AssignmentResponse)
def update_assignment(
    assignment_id: int,
    update: AssignmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_teacher),
):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()

    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    # 🔒 Verify the teacher owns this assignment
    if assignment.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Not your assignment")

    # Update only provided fields
    if update.title is not None:
        assignment.title = update.title
    if update.subject is not None:
        assignment.subject = update.subject
    if update.department is not None:
        assignment.department = update.department
    if update.deadline is not None:
        assignment.deadline = update.deadline
    if update.total_marks is not None:
        assignment.total_marks = update.total_marks

    db.commit()
    db.refresh(assignment)

    return assignment


@router.delete("/{assignment_id}")
def delete_assignment(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_teacher),
):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()

    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    # 🔒 Verify the teacher owns this assignment
    if assignment.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Not your assignment")

    db.delete(assignment)
    db.commit()

    return {"message": "Assignment deleted successfully"}