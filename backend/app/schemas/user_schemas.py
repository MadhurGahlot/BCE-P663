from pydantic import BaseModel, EmailStr
from enum import Enum


class RoleEnum(str, Enum):
    teacher = "teacher"
    student = "student"


class DepartmentEnum(str, Enum):
    CSE = "CSE"
    EE = "EE"
    ME = "ME"
    ECE = "ECE"


class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: RoleEnum
    department: DepartmentEnum


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str