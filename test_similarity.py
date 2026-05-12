import requests
import time
import os

BASE_URL = "http://127.0.0.1:8000"

def run_tests():
    print("--- Starting Similarity Tests ---")
    
    # We will use existing assignment_id=13, or create a new one to be safe.
    
    teacher_data = {
        "name": "Test Teacher 2",
        "email": f"teacher2_{int(time.time())}@example.com",
        "password": "password123",
        "role": "teacher",
        "department": "CSE"
    }
    requests.post(f"{BASE_URL}/auth/register", json=teacher_data)
    res = requests.post(f"{BASE_URL}/auth/login", data={"username": teacher_data["email"], "password": "password123"})
    teacher_token = res.json().get("access_token")
    teacher_headers = {"Authorization": f"Bearer {teacher_token}"}

    # Create Assignment
    assignment_data = {
        "title": f"Test Assignment {int(time.time())}",
        "subject": "CS101",
        "department": "CSE",
        "deadline": "2026-12-31T23:59:59",
        "total_marks": 100
    }
    res = requests.post(f"{BASE_URL}/assignments/", json=assignment_data, headers=teacher_headers)
    assignment_id = res.json().get("id")

    # Student 1
    student1_data = {
        "name": "Test Student 1",
        "email": f"student1_{int(time.time())}@example.com",
        "password": "password123",
        "role": "student",
        "department": "CSE"
    }
    requests.post(f"{BASE_URL}/auth/register", json=student1_data)
    res1 = requests.post(f"{BASE_URL}/auth/login", data={"username": student1_data["email"], "password": "password123"})
    student1_headers = {"Authorization": f"Bearer {res1.json().get('access_token')}"}

    # Student 2
    student2_data = {
        "name": "Test Student 2",
        "email": f"student2_{int(time.time())}@example.com",
        "password": "password123",
        "role": "student",
        "department": "CSE"
    }
    requests.post(f"{BASE_URL}/auth/register", json=student2_data)
    res2 = requests.post(f"{BASE_URL}/auth/login", data={"username": student2_data["email"], "password": "password123"})
    student2_headers = {"Authorization": f"Bearer {res2.json().get('access_token')}"}

    print(f"Created Assignment ID: {assignment_id}")

    with open("dummy.txt", "w") as f:
        f.write("FastAPI is a modern, fast (high-performance), web framework for building APIs with Python 3.7+ based on standard Python type hints.")
    
    # Sub 1
    with open("dummy.txt", "rb") as f:
        files = {"file": ("dummy.txt", f, "text/plain")}
        data = {"assignment_id": assignment_id}
        res = requests.post(f"{BASE_URL}/submissions/submit", files=files, data=data, headers=student1_headers)
        print(f"Student 1 Submit: {res.status_code} - {res.text}")

    # Sub 2 (Same text, expecting high similarity)
    with open("dummy.txt", "rb") as f:
        files = {"file": ("dummy.txt", f, "text/plain")}
        data = {"assignment_id": assignment_id}
        res = requests.post(f"{BASE_URL}/submissions/submit", files=files, data=data, headers=student2_headers)
        print(f"Student 2 Submit: {res.status_code} - {res.text}")

if __name__ == "__main__":
    try:
        run_tests()
    finally:
        if os.path.exists("dummy.txt"):
            os.remove("dummy.txt")
