# BCE-P663 Backend: Architecture & Technology Overview

## 1. Introduction
Good morning/afternoon. Today, I'll be walking you through the backend architecture of the BCE-P663 Assignment Similarity System. Our goal was to build a robust, AI-powered system that handles assignment submissions and automatically flags potential plagiarism between students.

## 2. Core Technologies Used
We built the backend with modern, high-performance tools:
*   **Web Framework:** We used **FastAPI** (Python). It is extremely fast, supports asynchronous programming natively, and automatically generates API documentation. This makes it perfect for handling file uploads and running AI models simultaneously without lagging.
*   **Database:** We use a relational database managed by **SQLAlchemy** (an Object-Relational Mapper). This allows us to securely define and link our `Users`, `Assignments`, and `Submissions` tables using pure Python code, ensuring clean data management.

## 3. The Document Processing Pipeline (OCR)
When a student uploads an assignment, the system needs to extract the text to understand it:
*   **Local Extraction:** First, we use Python libraries like `PyPDF2` to read digitally typed PDFs and `.txt` files in milliseconds.
*   **Sarvam AI (Document Intelligence):** For handwritten assignments, standard extraction fails. To solve this, we integrated the cloud-based **Sarvam AI API**. It receives snippets of the PDF, runs advanced Optical Character Recognition (OCR) on handwritten cursive, and returns clean Markdown text so our engine can read it.

## 4. The Plagiarism / Similarity Engine (The Core Feature)
Instead of relying on simple "word-matching" algorithms (which can be easily tricked by changing synonyms), we implemented **Semantic Search**:
*   **Embeddings:** We implemented a pre-trained **Hugging Face Sentence-Transformer (`all-MiniLM-L6-v2`)**. This neural network processes the student's text and converts it into a high-dimensional mathematical vector (an embedding). 
*   **Cosine Similarity:** To detect plagiarism, we calculate the **Cosine Similarity** between two students' vectors. This measures the mathematical angle between the two documents. If the score is close to 1.0 (100%), it means the *meaning, structure, and intent* of their answers are nearly identical, effectively catching smart plagiarism strategies.

## 5. Automated Grading Rules
Once the similarity is calculated, the backend looks at the dynamic grading rules set by the teacher for that specific assignment. Based on thresholds (e.g., 60% similarity = Medium deduction, 90% = High deduction), the system automatically applies penalties to the student's marks.

## 6. Testing & Reliability
We have rigorously tested the core API endpoints locally. I've validated:
*   Teacher and Student Authentication flows (Registration & JWT Token Login).
*   Assignment creation endpoints.
*   The Submission APIs and file parsing logic.
*   The Semantic Similarity Engine (which successfully flagged identical documents with a 1.0 (100%) cosine similarity score during end-to-end testing).

**Conclusion:** The backend is fully operational, seamlessly bridging standard REST APIs with advanced Natural Language Processing and OCR AI engines to create a highly accurate, automated anti-plagiarism system.
