from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi import UploadFile, File
import shutil
import os
from batch_evaluation import batch_evaluate

from agents.relevance_agent import relevance_score
from agents.accuracy_agent import accuracy_score
from agents.hallucination_agent import hallucination_detection
from agents.completeness import completeness_score
from agents.verdict_agent import verdict_score
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

    completeness = completeness_score(
    request.question,
    request.response
   )
    verdict = verdict_score(
    relevance["score"],
    accuracy["accuracy_score"],
    hallucination["hallucination_score"],
    completeness["completeness_score"]
)

    return {
        "question": request.question,
        "response": request.response,
        "relevance": relevance,
        "accuracy": accuracy,
        "hallucination": hallucination,
        "completeness": completeness,
        "verdict": verdict
    }
@app.post("/batch-evaluate")
async def batch_evaluate_api(file: UploadFile = File(...)):

    os.makedirs("uploads", exist_ok=True)

    file_path = os.path.join("uploads", file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    results = batch_evaluate(file_path)

    return {
        "message": "Batch Evaluation Completed",
        "results": results
    }