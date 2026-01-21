from fastapi import FastAPI
from app.routes import auth
from app.database import engine, Base

app = FastAPI(title="BCE-P663 Assignment Similarity System")

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
    

