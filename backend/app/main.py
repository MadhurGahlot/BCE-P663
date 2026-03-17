from fastapi import FastAPI
from app.routes import auth
from app.database import engine, Base
from app.models import  assignments
from app.models import user
from app.routes import assignments

app = FastAPI(
    title="BCE-P663 Assignment Similarity System",
    description="API for detecting plagiarism between assignments.",
    version="1.0.0",
    contact={
        "name": "DEVELOPER",
        "email": "236301126@gkv.ac.in",
        #"email" : "236301140@gkv.ac.in"
    },
    )

# ✅ create tables ONCE at startups
Base.metadata.create_all(bind=engine)

app.include_router(auth.router)

@app.get("/")
def root():
    return {
        "message" : "BCE-P663 Backend Running",
        " stauts ": "OK",
        " Date ": " 21-01-2026"   
            }

app.include_router(assignments.router)    

