from sqlalchemy import Column, Integer, String, Enum
from app.database import Base
import enum

class RoleEnum(str, enum.Enum):
    teacher = "teacher"
    student = "student"

class DepartmentEnum(str, enum.Enum):
    CSE = "CSE"
    EE = "EE"
    ME = "ME"
    ECE = "ECE"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    role = Column(Enum(RoleEnum))
    department = Column(Enum(DepartmentEnum))
