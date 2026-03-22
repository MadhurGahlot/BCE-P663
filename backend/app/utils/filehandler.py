import os

UPLOAD_DIR = "uploads"

def save_file(file, user_id):
    if not os.path.exists(UPLOAD_DIR):
        os.makedirs(UPLOAD_DIR)

    file_path = f"{UPLOAD_DIR}/{user_id}_{file.filename}"

    with open(file_path, "wb") as buffer:
        buffer.write(file.file.read())

    return file_path