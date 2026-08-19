from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel

import shutil
import os

from batch_evaluation import batch_evaluate
from report_generator import generate_pdf_report

from agents.relevance_agent import relevance_score
from agents.accuracy_agent import accuracy_score
from agents.hallucination_agent import hallucination_detection
from agents.completeness import completeness_score
from agents.verdict_agent import verdict_score


app = FastAPI(
    title="AI Response Quality Evaluator Agent"
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# REQUEST MODEL
# --------------------------------------------------

class EvaluationRequest(BaseModel):
    question: str
    response: str


# --------------------------------------------------
# HOME
# --------------------------------------------------

@app.get("/")
def home():
    return {
        "message": "AI Response Quality Evaluator Agent API is running."
    }


# --------------------------------------------------
# SINGLE EVALUATION
# --------------------------------------------------

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


# --------------------------------------------------
# BATCH EVALUATION
# --------------------------------------------------

@app.post("/batch-evaluate")
async def batch_evaluate_api(
    file: UploadFile = File(...)
):

    os.makedirs("uploads", exist_ok=True)

    file_path = os.path.join(
        "uploads",
        file.filename
    )

    try:

        # Save uploaded CSV
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(
                file.file,
                buffer
            )

        # Run batch evaluation
        batch_data = batch_evaluate(file_path)

        # Extract results and summary
        results = batch_data["results"]
        summary = batch_data["summary"]

        return {
            "message": "Batch Evaluation Completed",

            "total": summary["total_evaluations"],

            "completed": summary["total_evaluations"],

            "summary": summary,

            "results": results
        }

    except ValueError as e:

        return JSONResponse(
            status_code=400,
            content={
                "message": "Invalid CSV file",
                "error": str(e),
                "total": 0,
                "completed": 0,
                "summary": {
                    "total_evaluations": 0,
                    "pass_count": 0,
                    "needs_improvement_count": 0,
                    "fail_count": 0,
                    "average_relevance": 0,
                    "average_accuracy": 0,
                    "average_completeness": 0,
                    "average_hallucination": 0,
                    "average_overall": 0
                },
                "results": []
            }
        )

    except Exception as e:

        return JSONResponse(
            status_code=500,
            content={
                "message": "Batch Evaluation Failed",
                "error": str(e),
                "total": 0,
                "completed": 0,
                "summary": {
                    "total_evaluations": 0,
                    "pass_count": 0,
                    "needs_improvement_count": 0,
                    "fail_count": 0,
                    "average_relevance": 0,
                    "average_accuracy": 0,
                    "average_completeness": 0,
                    "average_hallucination": 0,
                    "average_overall": 0
                },
                "results": []
            }
        )


# --------------------------------------------------
# PDF REPORT GENERATION
# --------------------------------------------------

@app.post("/generate-report")
async def generate_report(data: dict):

    try:

        # Create reports folder
        os.makedirs(
            "reports",
            exist_ok=True
        )

        # PDF file path
        report_path = os.path.join(
            "reports",
            "evaluation_report.pdf"
        )

        # Generate PDF
        generate_pdf_report(
            data,
            report_path
        )

        # Return PDF to frontend
        return FileResponse(
            path=report_path,
            media_type="application/pdf",
            filename="evaluation_report.pdf"
        )

    except Exception as e:

        return {
            "message": "PDF report generation failed",
            "error": str(e)
        }