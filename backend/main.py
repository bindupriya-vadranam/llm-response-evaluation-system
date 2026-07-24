from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from agents.relevance_agent import relevance_score
from agents.accuracy_agent import accuracy_score
from agents.hallucination_agent import hallucination_detection

app = FastAPI(title="AI Response Quality Evaluator Agent")

# Allow React frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class EvaluationRequest(BaseModel):
    question: str
    response: str


@app.get("/")
def home():
    return {
        "message": "AI Response Quality Evaluator Agent API is running."
    }


@app.post("/evaluate")
def evaluate(request: EvaluationRequest):

    relevance = relevance_score(
        request.question,
        request.response
    )

    accuracy = accuracy_score(
        request.question,
        request.response
    )

    hallucination = hallucination_detection(
        request.question,
        request.response
    )

    return {
        "question": request.question,
        "response": request.response,
        "relevance": relevance,
        "accuracy": accuracy,
        "hallucination": hallucination
    }