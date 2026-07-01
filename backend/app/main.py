from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import similarity
from app.database import engine, Base
from datetime import datetime


# ✅ IMPORT ALL MODELS (VERY IMPORTANT)
from app.models.user import User
from app.models.assignments import Assignment
from app.models.submission import Submission
from app.models.grading import GradingRule
from app.models import reset_password
from app.models import user

# ✅ IMPORT ROUTES
from app.routes import auth
from app.routes import assignments
from app.routes import submission
from app.routes import grading
from app.routes import reset_password
from app.routes import user



app = FastAPI(
    title="BCE-P663 Assignment Similarity System",
    description="API for detecting plagiarism between assignments.",
    version="1.0.0",
    contact={
        "name": " BACKEND DEVELOPER",
        "email": "236301126@gkv.ac.in",
    },
    
)

# ✅ ALLOW REQUESTS FROM REACT FRONTEND
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)


# ✅ INCLUDE ROUTES
app.include_router(auth.router)
app.include_router(assignments.router)
app.include_router(submission.router)
app.include_router(similarity.router)
app.include_router(grading.router)
app.include_router(reset_password.router)
app.include_router(user.router)


@app.get("/")
def root():
    return {
        "message": "BCE-P663 Backend Running",
        "status": "OK",
        "date": datetime.now(),
        "contact" : "236301126@gkv.ac.in"
    }


