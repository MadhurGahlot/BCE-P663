# GradeBook — Bug Report

> Analyzed: Backend (FastAPI/Python) + Frontend (React/TypeScript)  
> Total Issues Found: **21**

---

## 🔴 CRITICAL — Security & Data Integrity

### BUG-01 · Submission endpoint has NO authentication
**File:** `backend/app/routes/submission.py` — `POST /submissions/submit`

The submit endpoint accepts `student_id` as a **plain query parameter** from the request body. Any user can submit on behalf of ANY student by just passing a different `student_id`. There is no auth check at all on this endpoint.

```python
# ❌ student_id comes from the client — anyone can forge it
def upload_submission(assignment_id: int, student_id: int, ...):
```
**Fix:** Remove `student_id` as a parameter. Derive it from `get_current_user` (the authenticated token).

---

### BUG-02 · Student history endpoint is unauthorized
**File:** `backend/app/routes/submission.py` — `GET /submissions/student/{student_id}/history`

The comment literally says *"In a real app we'd verify..."* but never does. Any authenticated user (even another student) can fetch any other student's submission history.

**Fix:** Add a check that `current_user.id == student_id` OR `current_user.role == "teacher"`.

---

### BUG-03 · Assignment update doesn't verify ownership
**File:** `backend/app/routes/assignments.py` — `PUT /{assignment_id}`

Any teacher can edit or delete **any other teacher's** assignment. The route only checks that the user is a teacher, not that they own that assignment.

```python
# ❌ Only checks role, not ownership
current_user: User = Depends(get_current_teacher)
# Missing: if assignment.created_by != current_user.id: raise 403
```
**Fix:** Add `if assignment.created_by != current_user.id: raise HTTPException(403, "Not your assignment")`.

---

### BUG-04 · Secret key can be `None` — JWT will silently fail or crash
**File:** `backend/app/routes/auth.py` lines 17, 84

```python
SECRET_KEY = os.getenv("SECRET_KEY")  # Can be None!
payload = jwt.decode(token, SECRET_KEY, ...)  # Crash if None
```
If `SECRET_KEY` is missing from `.env`, the app starts fine but crashes on every login/decode. There is no validation at startup.

**Fix:** Add `if not SECRET_KEY: raise RuntimeError("SECRET_KEY not set")` at module load time, just like `DATABASE_URL` does in `database.py`.

---

### BUG-05 · Debug `print` of full JWT payload in production
**File:** `backend/app/routes/auth.py` line 87

```python
print("TOKEN PAYLOAD:", payload)  # ❌ Logs user_id, email, role on every request
```
This prints sensitive token data on every authenticated request. Must be removed.

---

## 🟠 HIGH — Broken Functionality

### BUG-06 · `AppContext` — ALL context methods are STUBS (return empty data)
**File:** `newui/src/store/AppContext.tsx` lines 108–116

The entire state management for assignments, submissions, and similarity results returns **hardcoded empty arrays/null**:

```typescript
getTeacherAssignments: () => [],        // ❌ Always empty
getSubmissionsForAssignment: () => [],  // ❌ Always empty
getSimilarityResult: () => null,        // ❌ Always null
users: [],                              // ❌ Never populated
getAssignmentById: () => null,          // ❌ Always null
```

This means `AssignmentDetail.tsx`, `StudentPage.tsx`, and `SimilarityReport.tsx` which depend on these methods will always show empty/broken state, even when the backend has real data.

**Fix:** Replace stubs with actual API calls using `useEffect` + `api.get(...)`.

---

### BUG-07 · Teacher's "Run Similarity Check" is fake — it never calls the backend
**File:** `newui/src/pages/teacher/AssignmentDetail.tsx` lines 41–51

```typescript
await new Promise(r => setTimeout(r, 2000)); // ❌ fake 2-second delay
runSimilarityCheck(id ?? '');                // ❌ calls a stub that does nothing
```
The actual similarity API (`GET /similarity/assignment/{id}`) is never called. The button is purely cosmetic.

---

### BUG-08 · Teacher file upload in `AssignmentDetail` is 100% local/fake
**File:** `newui/src/pages/teacher/AssignmentDetail.tsx` lines 78–118

When a teacher uploads a file, it's read locally and stored only in React state (which is a stub anyway). It never calls `POST /submissions/submit`. After page refresh, the "submission" disappears.

---

### BUG-09 · `Assignments.tsx` — Submitted/Graded/Flagged counts always show 0
**File:** `newui/src/pages/teacher/Assignments.tsx` lines 131–134

```typescript
const subs: any[] = [];   // ❌ Hardcoded empty
const graded = 0;         // ❌ Hardcoded
const highSim = 0;        // ❌ Hardcoded
```
The cards always show "0 Submitted, 0 Graded, 0 Flagged" because there is no API call to fetch submission stats per assignment.

---

### BUG-10 · Deadline filter is broken — deadline is converted to string too early
**File:** `newui/src/pages/teacher/Assignments.tsx` lines 35, 54

The deadline is converted to a localized string during data mapping:
```typescript
deadline: new Date(a.deadline).toLocaleDateString(), // → "5/20/2025"
```
But the filter checks `new Date(a.deadline) < new Date()` — `new Date("5/20/2025")` is **Invalid Date** in many locales, so the Active/Closed filter always shows wrong results.

**Fix:** Keep the raw ISO deadline for comparison; format only when displaying.

---

### BUG-11 · Student can submit even after the assignment deadline has passed
**File:** `newui/src/pages/student/SubmitAssignment.tsx` lines 190, 330–340

The UI shows a red "Deadline passed" warning but does **not disable the Submit button**. The backend has no deadline check either.

```typescript
// ❌ isPast is computed but never used to disable submission
disabled={submitting || (mode === 'file' && !file) || ...}
// Missing: || isPast
```

---

### BUG-12 · `submitted_at` timestamp is always `new Date()` — not the real time
**File:** `newui/src/pages/student/SubmitAssignment.tsx` line 50

```typescript
submittedAt: new Date().toISOString(), // ❌ Current time, not when it was submitted
```
The `Submission` model has a `created_at` column that should be read from the API response.

---

## 🟡 MEDIUM — Data & Logic Issues

### BUG-13 · Duplicate `get_db()` definition
**File:** `backend/app/routes/assignments.py` lines 13–18

`get_db()` is re-defined locally here, but the canonical version already exists in `app/database.py`. Two separate `SessionLocal` sessions could cause subtle transaction bugs.

```python
# ❌ Duplicate — should use: from app.database import get_db
def get_db():
    db = SessionLocal()
    ...
```

---

### BUG-14 · `GradeSubmissionRequest` Pydantic model defined inside route file
**File:** `backend/app/routes/grading.py` lines 57–60

```python
from pydantic import BaseModel  # ← import mid-file
class GradeSubmissionRequest(BaseModel): ...
```
The import is in the middle of the file (after router setup). This works but is bad practice and should be in `schemas/`.

---

### BUG-15 · Similarity score stored redundantly — stored in `submissions/submit` AND computed again in `similarity/assignment/{id}`
**File:** `backend/app/routes/submission.py` lines 85–110 & `backend/app/routes/similarity.py`

When a new submission comes in, the backend computes similarity against ALL existing submissions and saves to `Similarity` table. But the `GET /similarity/assignment/{id}` endpoint **re-computes everything from scratch** instead of reading from the saved `Similarity` table. This is:
- Slow (re-runs ML model every time)
- Inconsistent (new submissions after a "run" appear in the live calc but not in stored results)

---

### BUG-16 · `Submission` model missing `submitted_at` field — uses `created_at`
**File:** `backend/app/models/submission.py` line 18 & `backend/app/routes/submission.py` line 150

The model uses `created_at`, but the frontend and student history endpoint reference `submitted_at`:
```python
# model: created_at
# route returns: "submitted_at": s.submitted_at  ← AttributeError at runtime!
```
This will crash the `GET /submissions/student/{id}/history` endpoint.

---

### BUG-17 · `Assignment` model has no `description` or `allowedFileTypes` fields
**File:** `backend/app/models/assignments.py`

The frontend maps `description` and `allowedFileTypes` from API responses, but the `Assignment` model has neither column. The frontend fills in fake fallbacks:
```typescript
description: assignRes.data.description || `Assignment for ${assignRes.data.department}`,
allowedFileTypes: ['.pdf', '.txt', '.png', '.jpg', '.jpeg'], // ← hardcoded
```
These should be proper database columns.

---

## 🔵 LOW — UX & Code Quality

### BUG-18 · "View Content" modal uses `Trash2` icon for the close button
**File:** `newui/src/pages/teacher/AssignmentDetail.tsx` line 385

```tsx
<button onClick={() => setViewContent(null)}>
  <Trash2 size={16} />  {/* ❌ Trash icon for a close action */}
</button>
```
Should be `<X size={16} />`.

---

### BUG-19 · Demo login cards fill wrong password — they don't actually work
**File:** `newui/src/pages/Login.tsx` lines 216, 226

The demo accounts use hardcoded passwords `teacher123` / `student123`, but these users don't exist in the database. Clicking a demo account card will always fail.

**Fix:** Either seed the database with demo users, or remove the demo cards.

---

### BUG-20 · `window.location.reload()` after editing an assignment — loses state
**File:** `newui/src/pages/teacher/AssignmentDetail.tsx` line 59

```typescript
window.location.reload(); // ❌ Full page reload — bad UX
```
Should re-fetch the assignment from the API and update state locally.

---

### BUG-21 · `Sarvam AI` API is a stub that always falls back to local OCR
**File:** `backend/app/services/ocr_service.py` lines 36–49

The Sarvam API integration is commented out and simulates failure:
```python
# Simulating failure to force fallback until API is implemented
return extract_text_with_ocr(pdf_path)
```
This means all handwritten document OCR runs locally with TrOCR, which requires a GPU/large download. For a production deployment this is a silent failure with a major performance impact.

---

## Summary Table

| # | Severity | Area | Short Description |
|---|---|---|---|
| 01 | 🔴 Critical | Backend Security | Submit endpoint has no auth — student_id forgeable |
| 02 | 🔴 Critical | Backend Security | Student history endpoint has no authorization check |
| 03 | 🔴 Critical | Backend Security | Any teacher can edit/delete any other teacher's assignments |
| 04 | 🔴 Critical | Backend Config | `SECRET_KEY` can be None — crashes JWT silently |
| 05 | 🔴 Critical | Backend Security | JWT payload printed to console on every request |
| 06 | 🟠 High | Frontend State | All AppContext methods are stubs — no real data loads |
| 07 | 🟠 High | Frontend Feature | Similarity check button is fake — never calls backend |
| 08 | 🟠 High | Frontend Feature | Teacher file upload is local-only — never persisted |
| 09 | 🟠 High | Frontend UI | Assignment card stats always show 0 |
| 10 | 🟠 High | Frontend Logic | Deadline filter broken — date parsed from formatted string |
| 11 | 🟠 High | Frontend/Backend | Late submissions not blocked on frontend or backend |
| 12 | 🟡 Medium | Frontend Data | `submittedAt` always set to current time, not real timestamp |
| 13 | 🟡 Medium | Backend Code | Duplicate `get_db()` function in assignments route |
| 14 | 🟡 Medium | Backend Code | Pydantic model + import defined mid-file in grading route |
| 15 | 🟡 Medium | Backend Logic | Similarity stored AND re-computed on every view (redundant) |
| 16 | 🟡 Medium | Backend Bug | `submitted_at` used in route but model field is `created_at` |
| 17 | 🟡 Medium | Data Model | `description` and `allowedFileTypes` missing from DB schema |
| 18 | 🔵 Low | Frontend UX | Trash icon used as close button in content viewer modal |
| 19 | 🔵 Low | Frontend UX | Demo login cards reference non-existent database users |
| 20 | 🔵 Low | Frontend UX | `window.location.reload()` used after edit — bad UX |
| 21 | 🔵 Low | Backend Feature | Sarvam AI OCR is a stub — silently falls back to local OCR |
