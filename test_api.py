import requests

BASE_URL = "http://127.0.0.1:8000"

def test():
    # Register teacher
    res = requests.post(f"{BASE_URL}/auth/register", json={
        "name": "Prof Apple", "email": "prof@example.com", "password": "pass", "role": "teacher", "department": "CS"
    })
    print("Register:", res.status_code, res.text)
    
    # Login
    res = requests.post(f"{BASE_URL}/auth/login", data={"username": "prof@example.com", "password": "pass"})
    print("Login:", res.status_code, res.text)
    token = res.json().get("access_token")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Profile update
    res = requests.put(f"{BASE_URL}/auth/me", json={"name": "Prof Banana", "email": "prof_new@example.com"}, headers=headers)
    print("Update Profile:", res.status_code, res.text)
    
    # Check Profile
    res = requests.get(f"{BASE_URL}/auth/me", headers=headers)
    print("Verify Profile:", res.status_code, res.json().get("name"))

if __name__ == "__main__":
    test()
