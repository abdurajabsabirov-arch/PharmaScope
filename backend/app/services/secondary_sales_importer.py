import pandas as pd


def import_secondary_sales(file):

    dataframe = pd.read_excel(file)

    dataframe = dataframe.where(pd.notna(dataframe), None)

    return {
        "success": True,
        "source": "Secondary Sales",
        "rows": len(dataframe),
        "columns": list(dataframe.columns),
        "preview": dataframe.head(5).to_dict(orient="records"),
    }