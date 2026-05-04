import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.reset_password import PasswordReset
from app.utils.security import hash_password

router = APIRouter(prefix="/password", tags=["Password Reset"])


# 🔹 STEP 1: REQUEST RESET
@router.post("/request")
def request_reset(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # remove old tokens
    db.query(PasswordReset).filter(PasswordReset.email == email).delete()

    token = str(uuid.uuid4())

    reset = PasswordReset(
        email=email,
        token=token
    )

    db.add(reset)
    db.commit()

    # 👉 For now, show token in console
    print("RESET TOKEN:", token)

    return {"message": "Reset token generated (check console)"}


# 🔹 STEP 2: RESET PASSWORD
@router.post("/reset")
def reset_password(
    token: str,
    new_password: str,
    db: Session = Depends(get_db)
):
    reset = db.query(PasswordReset).filter(
        PasswordReset.token == token
    ).first()

    if not reset:
        raise HTTPException(status_code=400, detail="Invalid token")

    if reset.expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Token expired")

    user = db.query(User).filter(User.email == reset.email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.password = hash_password(new_password)

    db.delete(reset)
    db.commit()

    return {"message": "Password reset successful"}