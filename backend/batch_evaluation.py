import pandas as pd
from datetime import datetime

from agents.relevance_agent import relevance_score
from agents.accuracy_agent import accuracy_score
from agents.hallucination_agent import hallucination_detection
from agents.completeness import completeness_score
from agents.verdict_agent import verdict_score


def batch_evaluate(csv_file):

    df = pd.read_csv(csv_file)

    required_columns = ["question", "response"]

    missing_columns = [
        column
        for column in required_columns
        if column not in df.columns
    ]

    if missing_columns:
        raise ValueError(
            f"CSV is missing required columns: "
            f"{', '.join(missing_columns)}"
        )

    results = []

    for _, row in df.iterrows():

        question = str(row["question"]).strip()
        response = str(row["response"]).strip()

        if not question or not response:
            continue

        model = str(row.get("model", "Unknown")).strip()
        dataset = str(row.get("dataset", "Unknown")).strip()
        evaluation_mode = str(
            row.get("evaluation_mode", "Batch")
        ).strip()

        timestamp = datetime.now().isoformat()

        relevance = relevance_score(
            question,
            response
        )

        accuracy = accuracy_score(
            question,
            response
        )

        hallucination = hallucination_detection(
            question,
            response
        )

        completeness = completeness_score(
            question,
            response
        )

        verdict = verdict_score(
            relevance["score"],
            accuracy["accuracy_score"],
            hallucination["hallucination_score"],
            completeness["completeness_score"]
        )

        results.append({
            "question": question,
            "response": response,
            "model": model,
            "dataset": dataset,
            "evaluation_mode": evaluation_mode,
            "timestamp": timestamp,
            "relevance_score": relevance["score"],
            "accuracy_score": accuracy["accuracy_score"],
            "hallucination_score": hallucination["hallucination_score"],
            "completeness_score": completeness["completeness_score"],
            "overall_score": verdict["overall_score"],
            "verdict": verdict["verdict"],
            "hallucinated_claims": hallucination.get(
                "hallucinated_claims",
                []
            ),
            "recommendation": verdict.get(
                "recommendation",
                ""
            ) if isinstance(verdict, dict) else ""
        })

    total_evaluations = len(results)

    pass_count = sum(
        1
        for result in results
        if str(result["verdict"]).strip().lower() == "pass"
    )

    needs_improvement_count = sum(
        1
        for result in results
        if str(result["verdict"]).strip().lower()
        == "needs improvement"
    )

    fail_count = sum(
        1
        for result in results
        if str(result["verdict"]).strip().lower() == "fail"
    )

    hallucinated_evaluations = sum(
        1
        for result in results
        if result.get("hallucinated_claims")
        and len(result.get("hallucinated_claims")) > 0
    )

    if total_evaluations > 0:

        hallucination_frequency = round(
            (hallucinated_evaluations / total_evaluations) * 100,
            2
        )

        average_relevance = round(
            sum(
                result["relevance_score"]
                for result in results
            ) / total_evaluations,
            2
        )

        average_accuracy = round(
            sum(
                result["accuracy_score"]
                for result in results
            ) / total_evaluations,
            2
        )

        average_hallucination = round(
            sum(
                result["hallucination_score"]
                for result in results
            ) / total_evaluations,
            2
        )

        average_completeness = round(
            sum(
                result["completeness_score"]
                for result in results
            ) / total_evaluations,
            2
        )

        average_overall = round(
            sum(
                result["overall_score"]
                for result in results
            ) / total_evaluations,
            2
        )

    else:

        hallucination_frequency = 0
        average_relevance = 0
        average_accuracy = 0
        average_hallucination = 0
        average_completeness = 0
        average_overall = 0

    summary = {
        "total_evaluations": total_evaluations,
        "pass_count": pass_count,
        "needs_improvement_count": needs_improvement_count,
        "fail_count": fail_count,
        "hallucinated_evaluations": hallucinated_evaluations,
        "hallucination_frequency": hallucination_frequency,
        "average_relevance": average_relevance,
        "average_accuracy": average_accuracy,
        "average_hallucination": average_hallucination,
        "average_completeness": average_completeness,
        "average_overall": average_overall
    }

    return {
        "results": results,
        "summary": summary
    }


if __name__ == "__main__":

    batch_data = batch_evaluate("sample_questions.csv")

    print("\n================================")
    print("BATCH EVALUATION RESULTS")
    print("================================")

    print("\nSummary:")
    print(batch_data["summary"])

    print("\nIndividual Results:")

    for result in batch_data["results"]:
        print(result)

    pd.DataFrame(
        batch_data["results"]
    ).to_csv(
        "batch_results.csv",
        index=False
    )

    print("\n================================")
    print("Batch evaluation completed.")
    print("Results saved to batch_results.csv")
    print("================================")