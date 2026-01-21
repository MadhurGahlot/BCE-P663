BCE-P663/
│
├── README.md
├── docker-compose.yml
├── .env
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── assignment.py
│   │   │   ├── submission.py
│   │   │   ├── similarity.py
│   │   │   └── grade.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── user_schema.py
│   │   │   ├── assignment_schema.py
│   │   │   ├── submission_schema.py
│   │   │   └── grade_schema.py
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.py
│   │   │   ├── users.py
│   │   │   ├── assignments.py
│   │   │   ├── submissions.py
│   │   │   ├── similarity.py
│   │   │   ├── grading.py
│   │   │   └── reports.py
│   │   │
│   │   ├── services/
│   │   │   ├── auth_service.py
│   │   │   ├── file_service.py
│   │   │   ├── similarity_service.py
│   │   │   └── grading_service.py
│   │   │
│   │   ├── similarity_engine/
│   │   │   ├── text_similarity.py
│   │   │   ├── code_similarity.py
│   │   │   └── utils.py
│   │   │
│   │   └── utils/
│   │       ├── security.py
│   │       └── helpers.py
│   │
│   ├── uploads/
│   │   ├── assignments/
│   │   └── submissions/
│   │
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   │
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CreateAssignment.jsx
│   │   │   ├── AssignmentDetails.jsx
│   │   │   ├── UploadSubmission.jsx
│   │   │   ├── SimilarityReport.jsx
│   │   │   └── GradeView.jsx
│   │   │
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── FileUpload.jsx
│   │   │   ├── SimilarityTable.jsx
│   │   │   ├── SimilarityChart.jsx
│   │   │   └── GradeForm.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── tailwind.config.js
│   ├── package.json
│   └── Dockerfile
│
└── docs/
    ├── architecture.png
    ├── database_schema.png
    ├── api_documentation.md
    └── project_report.docx