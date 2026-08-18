from sklearn.metrics.pairwise import cosine_similarity
from rag.retriever import retrieve_context
from model_loader import model


def accuracy_score(question, response):

    # Retrieve relevant documents
    retrieved_docs = retrieve_context(question)

    # Join retrieved documents into one context
    context = " ".join(retrieved_docs)

    # If no context is found
    if context.strip() == "":
        return {
            "accuracy_score": 0.0,
            "evidence": "No reference knowledge was retrieved.",
            "retrieved_context": retrieved_docs
        }

    # Generate embeddings
    response_embedding = model.encode(response).reshape(1, -1)
    context_embedding = model.encode(context).reshape(1, -1)

    # Compute similarity
    similarity = cosine_similarity(response_embedding, context_embedding)[0][0]

    # Convert similarity into score
    if similarity >= 0.75:
        score = 10.0
        evidence = "The response is fully supported by the retrieved knowledge."

    elif similarity >= 0.60:
        score = 8.0
        evidence = "The response is mostly supported by the retrieved knowledge."

    elif similarity >= 0.40:
        score = 6.0
        evidence = "The response is partially supported by the retrieved knowledge."

    else:
        score = 3.0
        evidence = "The response is not supported by the retrieved knowledge."

    return {
        "accuracy_score": score,
        "evidence": evidence,
        "retrieved_context": retrieved_docs
    }


if __name__ == "__main__":

    question = input("Question: ")
    response = input("Response: ")

    result = accuracy_score(question, response)

    print("\nResult:\n")
    print(result)