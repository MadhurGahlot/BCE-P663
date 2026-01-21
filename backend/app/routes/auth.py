from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models.user import User, Base
from app.utils.security import hash_password

#Base.metadata.create_all(bind=engine)

router = APIRouter(prefix="/auth", tags=["Auth"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register")
def register_user(
    name: str,
    email: str,
    password: str,
    role: str,
    department: str,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == email).first()
    if user:
        raise HTTPException(status_code=400, detail="Email already exists")

    new_user = User(
        name=name,
        email=email,
        password=hash_password(password),
        role=role,
        department=department
    )
    db.add(new_user)
    db.commit()
    return {"message": "User registered successfully"}
