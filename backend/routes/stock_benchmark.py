"""
Stock Benchmark API Route

Provides endpoint to run ML benchmarks on stock prediction.
Supports both single and multiple stock tickers.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional
import sys
import os

# Add backend root to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from benchmark_runner import run_benchmark
from ml_models import AVAILABLE_ALGORITHMS

router = APIRouter()


class BenchmarkRequest(BaseModel):
    """Request body for running a stock benchmark.
    
    Supports both single ticker (backward-compatible) and multiple tickers.
    """
    ticker: Optional[str] = Field(None, description="Single stock ticker (backward compat)")
    tickers: Optional[List[str]] = Field(None, description="Multiple stock tickers")
    records: int = Field(5000, ge=10, le=10000, description="Number of stock records")
    algorithms: Optional[List[str]] = Field(
        None,
        description="List of algorithm names. If null, runs all available."
    )


@router.get("/benchmark/algorithms", response_model=Dict[str, Any])
async def get_available_algorithms():
    """
    Get list of available ML algorithms for stock benchmarking.
    """
    return {
        "available_algorithms": AVAILABLE_ALGORITHMS,
        "total": len(AVAILABLE_ALGORITHMS),
    }


@router.post("/benchmark/run", response_model=Dict[str, Any])
async def run_stock_benchmark(request: BenchmarkRequest):
    """
    Run stock prediction benchmark with selected algorithms.

    Accepts tickers as an array for multi-stock benchmarking.
    Falls back to single ticker field for backward compatibility.

    Example request (multi-stock):
        {
            "tickers": ["AAPL", "TSLA", "MSFT"],
            "records": 5000,
            "algorithms": ["LinearRegression", "RandomForest", "XGBoost"]
        }
    """
    try:
        # Resolve tickers list — support both single and multi
        tickers = request.tickers or []
        if not tickers and request.ticker:
            tickers = [request.ticker]
        
        if not tickers:
            raise HTTPException(
                status_code=400,
                detail="At least one ticker is required. Provide 'tickers' array or 'ticker' string."
            )

        # Validate algorithms if provided
        if request.algorithms:
            invalid = [a for a in request.algorithms if a not in AVAILABLE_ALGORITHMS]
            if invalid:
                raise HTTPException(
                    status_code=400,
                    detail=f"Unknown algorithms: {invalid}. Available: {AVAILABLE_ALGORITHMS}"
                )

        # Run benchmark for each ticker
        all_results = {}
        for ticker in tickers:
            ticker = ticker.upper().strip()
            try:
                result = run_benchmark(
                    ticker=ticker,
                    records=request.records,
                    algorithms=request.algorithms,
                )
                all_results[ticker] = result
            except Exception as e:
                all_results[ticker] = {
                    "ticker": ticker,
                    "error": str(e),
                    "results": [],
                    "recommendations": None,
                }

        # If only one ticker, return flat result for backward compatibility
        if len(tickers) == 1:
            single = all_results[tickers[0]]
            single["multi"] = False
            return single

        # Multi-ticker response
        return {
            "multi": True,
            "tickers": tickers,
            "records": request.records,
            "stock_results": all_results,
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Benchmark execution failed: {str(e)}"
        )
