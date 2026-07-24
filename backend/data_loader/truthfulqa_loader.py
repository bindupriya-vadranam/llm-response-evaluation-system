from data_loader import load_dataset


def load_truthfulqa():

    dataset = load_dataset(
        "truthful_qa",
        "generation"
    )

    return dataset["validation"]


if __name__ == "__main__":

    dataset = load_truthfulqa()

    print(dataset)