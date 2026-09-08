import requests
import time
import os

BASE_URL = "http://127.0.0.1:8000"

def run_tests():
    print("--- Starting Backend Tests ---")
    
    # 1. Register Teacher
    teacher_data = {
        "name": "Test Teacher",
        "email": f"teacher_{int(time.time())}@example.com",
        "password": "password123",
        "role": "teacher",
        "department": "CSE"
    }
    res = requests.post(f"{BASE_URL}/auth/register", json=teacher_data)
    print(f"Teacher Register: {res.status_code}")
    if res.status_code not in [200, 201]: print(res.text)

    # 2. Login Teacher
    res = requests.post(f"{BASE_URL}/auth/login", data={"username": teacher_data["email"], "password": "password123"})
    print(f"Teacher Login: {res.status_code}")
    teacher_token = res.json().get("access_token")
    teacher_headers = {"Authorization": f"Bearer {teacher_token}"}

    # 3. Create Assignment
    assignment_data = {
        "title": f"Test Assignment {int(time.time())}",
        "subject": "CS101",
        "department": "CSE",
        "deadline": "2026-12-31T23:59:59",
        "total_marks": 100
    }
    res = requests.post(f"{BASE_URL}/assignments/", json=assignment_data, headers=teacher_headers)
    print(f"Create Assignment: {res.status_code}")
    if res.status_code not in [200, 201]: print(res.text)
    
    resp_json = res.json()
    assignment_id = resp_json.get("id")

    # 4. Register Student
    student_data = {
        "name": "Test Student",
        "email": f"student_{int(time.time())}@example.com",
        "password": "password123",
        "role": "student",
        "department": "CSE"
    }
    res = requests.post(f"{BASE_URL}/auth/register", json=student_data)
    print(f"Student Register: {res.status_code}")
    if res.status_code not in [200, 201]: print(res.text)

    # 5. Login Student
    res = requests.post(f"{BASE_URL}/auth/login", data={"username": student_data["email"], "password": "password123"})
    print(f"Student Login: {res.status_code}")
    student_token = res.json().get("access_token")
    student_headers = {"Authorization": f"Bearer {student_token}"}

    # 6. Submit Assignment
    print(f"Submitting to Assignment ID: {assignment_id}")
    with open("dummy.txt", "w") as f:
        f.write("This is a test submission text for FastAPI. " * 10)
    
    with open("dummy.txt", "rb") as f:
        files = {"file": ("dummy.txt", f, "text/plain")}
        data = {"assignment_id": assignment_id}
        res = requests.post(f"{BASE_URL}/submissions/submit", files=files, data=data, headers=student_headers)
        print(f"Submit Assignment: {res.status_code}")
        print(res.text)

if __name__ == "__main__":
    try:
        run_tests()
    finally:
        if os.path.exists("dummy.txt"):
            os.remove("dummy.txt")
