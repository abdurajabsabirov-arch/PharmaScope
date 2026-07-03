# ... предыдущий код ...

    @staticmethod
    def get_dashboard_data(filters: Dict = None):
        return {
            "kpis": {
                "total_market_value": 854530000,
                "total_units": 364790000,
                "nobel_sales": 19240000,
                "market_share": 1.96,
            },
            "top_companies": [
                {"name": "Nobel", "value": 19240000},
                {"name": "World Medicine", "value": 37710000},
            ],
            "charts": {
                "sales_trend": []  # можно добавить позже
            }
        }