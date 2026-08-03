import pandas as pd

from agents.relevance_agent import relevance_score
from agents.accuracy_agent import accuracy_score
from agents.hallucination_agent import hallucination_detection
from agents.completeness import completeness_score
from agents.verdict_agent import verdict_score


def batch_evaluate(csv_file):

    # Read CSV file
    df = pd.read_csv(csv_file)

    results = []

    for _, row in df.iterrows():

        question = row["question"]
        response = row["response"]

        relevance = relevance_score(question, response)
        accuracy = accuracy_score(question, response)
        hallucination = hallucination_detection(question, response)
        completeness = completeness_score(question, response)

        verdict = verdict_score(
            relevance["score"],
            accuracy["accuracy_score"],
            hallucination["hallucination_score"],
            completeness["completeness_score"]
        )

        results.append({
            "question": question,
            "response": response,
            "overall_score": verdict["overall_score"],
            "verdict": verdict["verdict"]
        })

    return pd.DataFrame(results)
if __name__ == "__main__":

    results = batch_evaluate("sample_questions.csv")

    print(results)
    results.to_csv("batch_results.csv", index=False)

    print("\nBatch evaluation completed.")
    print("Results saved to batch_results.csv")