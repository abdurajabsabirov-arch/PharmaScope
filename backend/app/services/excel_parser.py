import pandas as pd


def read_excel(file):

    dataframe = pd.read_excel(file)

    return {
        "rows": len(dataframe),
        "columns": list(dataframe.columns),
    }