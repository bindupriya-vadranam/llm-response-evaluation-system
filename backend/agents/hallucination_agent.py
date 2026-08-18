from sklearn.metrics.pairwise import cosine_similarity
from rag.retriever import retrieve_context
from model_loader import model


def hallucination_detection(question, response):

    # Retrieve relevant context from ChromaDB
    retrieved_docs = retrieve_context(question)
    context = " ".join(retrieved_docs)

    # No context available
    if context.strip() == "":
        return {
            "hallucination_score": 0.0,
            "status": "Unable to verify because no reference knowledge was retrieved.",
            "hallucinated_claims": ["No evidence available."]
        }

    # Generate embeddings
    response_embedding = model.encode(response).reshape(1, -1)
    context_embedding = model.encode(context).reshape(1, -1)

    similarity = cosine_similarity(response_embedding, context_embedding)[0][0]

    hallucinated_claims = []

    # Convert similarity into score
    if similarity >= 0.75:
        score = 10.0
        status = "No hallucination detected."

    elif similarity >= 0.60:
        score = 8.0
        status = "Minor unsupported information detected."
        hallucinated_claims.append(
            "Most of the response is supported by the retrieved knowledge."
        )

    elif similarity >= 0.40:
        score = 6.0
        status = "Partial hallucination detected."
        hallucinated_claims.append(
            "Some statements could not be verified."
        )

    else:
        score = 3.0
        status = "Hallucination detected."
        hallucinated_claims.append(
            "Response contains unsupported or fabricated claims."
        )

    return {
        "hallucination_score": score,
        "status": status,
        "hallucinated_claims": hallucinated_claims
    }


if __name__ == "__main__":

    question = input("Question: ")
    response = input("Response: ")

    result = hallucination_detection(question, response)

    print("\nResult:\n")
    print(result)