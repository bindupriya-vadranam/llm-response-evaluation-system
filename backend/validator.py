from data_loader.truthfulqa_loader import load_truthfulqa
from agents.relevance_agent import relevance_score
from agents.accuracy_agent import accuracy_score
from agents.hallucination_agent import hallucination_detection


def validate():

    dataset = load_truthfulqa()

    print("\nStarting Validation...\n")

    for sample in dataset.select(range(5)):

        question = sample["question"]
        response = sample["best_answer"]

        print("=" * 80)
        print("Question :", question)
        print("Response :", response)

        relevance = relevance_score(question, response)

        accuracy = accuracy_score(question, response)

        hallucination = hallucination_detection(question, response)

        print("\nRelevance")
        print(relevance)

        print("\nAccuracy")
        print(accuracy)

        print("\nHallucination")
        print(hallucination)


if __name__ == "__main__":
    validate()