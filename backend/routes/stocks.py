"""
Stocks API Route

Provides endpoint to fetch live stock data via yfinance.
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Dict, Any
import sys
import os

# Add backend root to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from data_preprocessing import fetch_stock_data

router = APIRouter()


@router.get("/stocks/data", response_model=Dict[str, Any])
async def get_stock_data(
    ticker: str = Query(..., description="Stock ticker symbol (e.g., AAPL)"),
    records: int = Query(5000, ge=10, le=10000, description="Number of records to fetch"),
):
    """
    Fetch live stock data by ticker symbol.

    Returns stock data with Date, Open, High, Low, Close, Volume fields.

    Example:
        GET /api/stocks/data?ticker=AAPL&records=5000
    """
    try:
        df = fetch_stock_data(ticker, records)

        # Convert DataFrame to JSON-serializable format
        data = df.copy()
        if "Date" in data.columns:
            data["Date"] = data["Date"].astype(str)

        return {
            "ticker": ticker,
            "records": len(data),
            "data": data.to_dict(orient="records"),
            "columns": list(data.columns),
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch stock data: {str(e)}"
        )
