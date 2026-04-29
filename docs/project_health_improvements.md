# Project Health Improvements

This note tracks cleanup work that is separate from secret removal and frontend/backend API wiring.

## Completed

- Removed the automatic mock teacher fallback from frontend auth state.
- Renamed typo modules:
  - `app/utils/dependies.py` -> `app/utils/dependencies.py`
  - `app/services/hybrid_serices.py` -> `app/services/hybrid_services.py`
- Centralized route auth dependency imports through `app.utils.dependencies`.
- Made sentence-transformer and TrOCR model loading lazy so imports are lighter.
- Hardened submission upload storage:
  - generated server-side filenames
  - extension and content-type validation
  - 25 MB upload limit
  - assignment existence check before OCR work
- Made grading rule updates idempotent instead of creating duplicate rows.
- Added focused upload validation tests in `backend/tests/test_submission_upload.py`.

## Recommended Next Backend Work

- Replace `Base.metadata.create_all(bind=engine)` with Alembic migrations before production use.
- Add authenticated student ownership checks to `/submit`.
- Store original upload filename separately from the generated stored filename.
- Move OCR and similarity comparison into a background job so uploads return quickly.
- Add API tests for auth, assignments, grading, and similarity reports.

## Verification Commands

Frontend:

```bash
cd frontend
npm.cmd run build
```

Backend tests, after Python is available:

```bash
cd backend
python -m pip install -r requirements-dev.txt
python -m pytest
```
