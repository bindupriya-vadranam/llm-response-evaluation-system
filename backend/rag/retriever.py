import torch
import chromadb
from sentence_transformers import SentenceTransformer

# Reduce CPU memory usage
torch.set_num_threads(1)

# Model is loaded only when it is actually needed
_model = None


def get_model():
    global _model

    if _model is None:
        _model = SentenceTransformer(
            "all-MiniLM-L6-v2",
            device="cpu"
        )

    return _model


# Connect to existing ChromaDB
client = chromadb.PersistentClient(path="../chromadb")

collection = client.get_collection("knowledge_base")


def retrieve_context(question, top_k=3):
    # Load embedding model only when retrieval is requested
    model = get_model()

    # Convert question into embedding
    embedding = model.encode(
        question,
        convert_to_numpy=True,
        normalize_embeddings=True
    ).tolist()

    # Search similar documents
    results = collection.query(
        query_embeddings=[embedding],
        n_results=top_k
    )

    return results["documents"][0]


if __name__ == "__main__":
    question = input("Enter your question: ")

    docs = retrieve_context(question)

    print("\nRetrieved Context:\n")

    for i, doc in enumerate(docs, 1):
        print(f"{i}. {doc}\n")