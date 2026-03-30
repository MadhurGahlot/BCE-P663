from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.submission import Submission
from app.routes.auth import get_current_teacher
from app.models.grading import GradingRule

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

router = APIRouter(prefix="/similarity", tags=["Similarity"])


@router.get("/assignment/{assignment_id}")
def compare_submissions(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_teacher)
):
    submissions = db.query(Submission).filter(
        Submission.assignment_id == assignment_id
    ).all()

    rule = db.query(GradingRule).filter(
        GradingRule.assignment_id == assignment_id
    ).first()

    if len(submissions) < 2:
        return {"message": "Not enough submissions to compare"}

    texts = [s.content for s in submissions]

    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(texts)

    similarity_matrix = cosine_similarity(tfidf_matrix)

    results = []

    def calculate_marks(sim):
        if not rule:
            return 0

        if sim < rule.low:
            return rule.marks_low
        elif sim < rule.high:
            return rule.marks_medium
        else:
            return rule.marks_high

    for i in range(len(submissions)):
        for j in range(i + 1, len(submissions)):
            sim_score = round(similarity_matrix[i][j] * 100, 2)
            results.append({
                "studentid1": submissions[i].student_id,
                "studentid2": submissions[j].student_id,
                "similarityscore": sim_score,
                "marks": calculate_marks(sim_score)
            })

    return results