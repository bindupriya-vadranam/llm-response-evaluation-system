from datasets import load_dataset
from sentence_transformers import SentenceTransformer
import chromadb

print("Loading TruthfulQA...")
truthfulqa = load_dataset("truthful_qa", "generation")["validation"]

print("Loading SQuAD...")
squad = load_dataset("squad")["validation"]

model = SentenceTransformer("all-MiniLM-L6-v2")

client = chromadb.PersistentClient(path="../chromadb")
collection = client.get_or_create_collection("knowledge_base")

print("Adding TruthfulQA...")

for i, row in enumerate(truthfulqa):
    text = row["question"] + " " + row["best_answer"]
    embedding = model.encode(text).tolist()

    collection.add(
        ids=[f"truthfulqa_{i}"],
        documents=[text],
        embeddings=[embedding]
    )

print("Adding SQuAD...")

for i, row in enumerate(squad):
    text = row["question"] + " " + row["context"]
    embedding = model.encode(text).tolist()

    collection.add(
        ids=[f"squad_{i}"],
        documents=[text],
        embeddings=[embedding]
    )

print("Knowledge Base Created Successfully!")