from functools import lru_cache

from sentence_transformers import SentenceTransformer, util


@lru_cache(maxsize=1)
def get_similarity_model():
    return SentenceTransformer("all-MiniLM-L6-v2")


def calculate_similarity(text1, text2):
    text1 = (text1 or "").strip()
    text2 = (text2 or "").strip()

    if not text1 or not text2:
        return 0.0

    model = get_similarity_model()
    emb1 = model.encode(text1, convert_to_tensor=True)
    emb2 = model.encode(text2, convert_to_tensor=True)

    score = util.cos_sim(emb1, emb2)
    return float(score.item())
