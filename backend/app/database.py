import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# 🔥 LOAD ENV FILE
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# 🔹 Engine
engine = create_engine(DATABASE_URL)

# 🔹 Session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 🔹 Base
Base = declarative_base()

# ✅ Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

