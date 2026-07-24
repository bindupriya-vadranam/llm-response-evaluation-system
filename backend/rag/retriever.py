import chromadb
from sentence_transformers import SentenceTransformer

# Load embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")

# Connect to existing ChromaDB
client = chromadb.PersistentClient(path="../chromadb")

collection = client.get_collection("knowledge_base")


def retrieve_context(question, top_k=3):
    # Convert question into embedding
    embedding = model.encode(question).tolist()

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