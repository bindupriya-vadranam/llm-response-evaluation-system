def verdict_score(relevance, accuracy, hallucination, completeness):

    # Calculate overall score
    overall = round(
        (
            relevance +
            accuracy +
            hallucination +
            completeness
        ) / 4,
        2
    )

    # Decide final verdict
    if overall >= 8:
        verdict = "Pass"
        summary = (
            "The response is relevant, accurate, complete, "
            "and contains minimal hallucination."
        )

    elif overall >= 6:
        verdict = "Needs Improvement"
        summary = (
            "The response is acceptable but requires improvements "
            "in one or more evaluation dimensions."
        )

    else:
        verdict = "Fail"
        summary = (
            "The response has significant quality issues and "
            "requires major improvements."
        )

    return {
        "overall_score": overall,
        "verdict": verdict,
        "summary": summary
    }


if __name__ == "__main__":

    result = verdict_score(
        9,
        8,
        8,
        8
    )

    print(result)