import pandas as pd


def import_reference_prices(file):

    dataframe = pd.read_excel(file)

    dataframe = dataframe.where(pd.notna(dataframe), None)

    return {
        "success": True,
        "source": "Reference Prices",
        "rows": len(dataframe),
        "columns": list(dataframe.columns),
        "preview": dataframe.head(5).to_dict(orient="records"),
    }