from sklearn.metrics.pairwise import cosine_similarity
from model_loader import get_model
def completeness_score(question, response):
    model = get_model()

    # Generate embeddings
    question_embedding = model.encode(question).reshape(1, -1)
    response_embedding = model.encode(response).reshape(1, -1)

    # Calculate similarity
    similarity = cosine_similarity(question_embedding, response_embedding)[0][0]

    # Score based on similarity
    if similarity >= 0.80:
        score = 10.0
        reason = "The response covers all major aspects of the question."
        missing_points = []

    elif similarity >= 0.60:
        score = 8.0
        reason = "The response covers most aspects but some details may be missing."
        missing_points = ["Some supporting details are missing."]

    elif similarity >= 0.40:
        score = 6.0
        reason = "The response is only partially complete."
        missing_points = ["Important aspects of the question are missing."]

    else:
        score = 3.0
        reason = "The response does not adequately answer the complete question."
        missing_points = ["Most required information is missing."]

    return {
        "completeness_score": score,
        "reason": reason,
        "missing_points": missing_points
    }


if __name__ == "__main__":

    question = input("Question: ")
    response = input("Response: ")

    result = completeness_score(question, response)

    print("\nResult:\n")
    print(result)