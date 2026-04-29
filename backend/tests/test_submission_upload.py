from io import BytesIO
from pathlib import Path

import pytest
from fastapi import HTTPException, UploadFile
from starlette.datastructures import Headers

from app.routes import submission


def make_upload(filename, content_type, body=b"sample"):
    return UploadFile(
        filename=filename,
        file=BytesIO(body),
        headers=Headers({"content-type": content_type}),
    )


def test_save_submission_file_rejects_unsupported_type(tmp_path, monkeypatch):
    monkeypatch.setattr(submission, "UPLOAD_DIR", tmp_path)
    upload = make_upload("payload.exe", "application/octet-stream")

    with pytest.raises(HTTPException) as exc:
        submission.save_submission_file(upload)

    assert exc.value.status_code == 400


def test_save_submission_file_uses_generated_filename(tmp_path, monkeypatch):
    monkeypatch.setattr(submission, "UPLOAD_DIR", tmp_path)
    upload = make_upload("student-answer.pdf", "application/pdf")

    saved_path = Path(submission.save_submission_file(upload))

    assert saved_path.exists()
    assert saved_path.parent == tmp_path
    assert saved_path.suffix == ".pdf"
    assert saved_path.name != "student-answer.pdf"


def test_save_submission_file_enforces_size_limit(tmp_path, monkeypatch):
    monkeypatch.setattr(submission, "UPLOAD_DIR", tmp_path)
    monkeypatch.setattr(submission, "MAX_UPLOAD_SIZE", 4)
    upload = make_upload("student-answer.txt", "text/plain", body=b"too-large")

    with pytest.raises(HTTPException) as exc:
        submission.save_submission_file(upload)

    assert exc.value.status_code == 413
    assert not list(tmp_path.iterdir())
