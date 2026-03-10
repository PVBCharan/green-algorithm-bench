"""
Benchmark API Route

Legacy sorting benchmarks have been removed. 
This module now provides backward-compatible status endpoints
so existing frontend calls don't break, while actual benchmarking
is handled by stock_benchmark.py.
"""

from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from datetime import datetime

router = APIRouter()


@router.get("/benchmark/status", response_model=Dict[str, Any])
async def get_benchmark_status():
    """
    Get the status of the ML benchmark module.
    """
    return {
        "status": "ready",
        "available_algorithms": [
            "LinearRegression",
            "KNN",
            "RandomForest",
            "XGBoost",
            "LightGBM",
            "SVR",
            "BayesianNetwork",
            "CNN",
            "LSTM",
            "DQN"
        ],
        "message": "ML Stock Prediction Benchmark module ready"
    }


@router.get("/benchmark/results", response_model=Dict[str, Any])
async def get_benchmark_results():
    """
    Placeholder for retrieving past benchmark results.
    """
    return {
        "algorithms": [],
        "results": {},
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "message": "Use POST /api/benchmark/run to execute benchmarks"
    }
