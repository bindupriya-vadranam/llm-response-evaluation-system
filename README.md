# AI Response Quality Evaluator Agent

## Project Overview

The AI Response Quality Evaluator Agent is designed to evaluate AI-generated responses using a Retrieval-Augmented Generation (RAG) pipeline and multiple evaluation agents. The system analyzes responses based on relevance, factual accuracy, and hallucination detection, and provides an overall quality assessment.

---

## Milestone 1

### Objectives
- Studied LLM evaluation techniques
- Studied hallucination detection methods
- Studied RAG architecture
- Studied evaluation frameworks such as RAGAS and TruLens
- Designed the overall system architecture
- Built the Evaluation Input Module
- Built the Reference Knowledge Base using TruthfulQA and SQuAD datasets
- Generated embeddings using SentenceTransformer
- Indexed embeddings in ChromaDB

### Deliverables
- Evaluation Input Module
- RAG Knowledge Base
- System Architecture Design
- Tech Stack Selection

---

## Milestone 2

### Objectives
- Implemented Relevance Judge Agent
- Implemented Accuracy Judge Agent
- Implemented Hallucination Detection Agent
- Validated the evaluation pipeline using TruthfulQA benchmark dataset

### Features
- Relevance scoring with reasoning
- Accuracy scoring using RAG retrieved evidence
- Hallucination detection
- Overall evaluation score
- Supporting evidence display

---

## Project Architecture

```
User Input
     │
     ▼
React Frontend
     │
     ▼
FastAPI Backend
     │
     ▼
Retriever (ChromaDB)
     │
     ├── Relevance Judge Agent
     ├── Accuracy Judge Agent
     └── Hallucination Detection Agent
     │
     ▼
Evaluation Results
```

---

## Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS

### Backend
- FastAPI
- Python

### AI & RAG
- SentenceTransformer (all-MiniLM-L6-v2)
- ChromaDB

### Datasets
- TruthfulQA
- SQuAD

---

## Project Structure

```
backend/
    agents/
        relevance.py
        accuracy.py
        hallucination.py
    retriever.py
    validator.py
    main.py

src/
public/
README.md
requirements.txt
package.json
```

---

## How to Run

### Backend

```bash
cd backend
python -m uvicorn main:app --reload
```

### Frontend

```bash
npm install
npm run dev
```

---

## Validation

The evaluation agents are validated using the TruthfulQA benchmark dataset to verify scoring consistency and reasoning quality.

---

## Future Enhancements

- Completeness Judge Agent
- Verdict Agent
- Batch Evaluation
- Evaluation Dashboard
- Integration with LLM APIs
