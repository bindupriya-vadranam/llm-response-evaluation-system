from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# Load embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")


def relevance_score(question, response):

    q_embedding = model.encode(question).reshape(1, -1)
    r_embedding = model.encode(response).reshape(1, -1)

    similarity = cosine_similarity(q_embedding, r_embedding)[0][0]

    # Convert similarity into score
    if similarity >= 0.75:
        score = 10.0
        reason = "The response directly answers the question."

    elif similarity >= 0.60:
        score = 8.0
        reason = "The response is mostly relevant to the question."

    elif similarity >= 0.40:
        score = 6.0
        reason = "The response is partially relevant."

    else:
        score = 3.0
        reason = "The response is not relevant to the question."

    return {
        "score": score,
        "reason": reason
    }


if __name__ == "__main__":

    question = input("Question: ")
    response = input("Response: ")

    result = relevance_score(question, response)

    print(result)