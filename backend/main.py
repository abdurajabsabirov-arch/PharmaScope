from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import (
    health_router,
    companies_router,
    brands_router,
    skus_router,
    molecules_router,
    territories_router,
    secondary_sales_router,
    reference_prices_router,
    iqvia_router,
    budget_router,
    dashboard_router,
    upload_router,
)

app = FastAPI(
    title="PharmaScope API",
    version="1.0.0",
    description="PharmaScope Backend API",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "application": "PharmaScope",
        "status": "running",
        "version": "1.0.0",
    }

app.include_router(health_router)
app.include_router(companies_router)
app.include_router(brands_router)
app.include_router(skus_router)
app.include_router(molecules_router)
app.include_router(territories_router)
app.include_router(secondary_sales_router)
app.include_router(reference_prices_router)
app.include_router(iqvia_router)
app.include_router(budget_router)
app.include_router(dashboard_router)
app.include_router(upload_router)