from data_loader import load_dataset


def load_squad():

    dataset = load_dataset("squad")

    return dataset["validation"]


if __name__ == "__main__":

    dataset = load_squad()

    print(dataset)