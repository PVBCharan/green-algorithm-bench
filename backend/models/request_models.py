"""
Pydantic Request/Response Models

Centralized data models for API request validation and response typing.
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any


class BenchmarkRequest(BaseModel):
    """Request body for running a stock benchmark."""
    ticker: Optional[str] = Field(None, description="Single stock ticker (backward compat)")
    tickers: Optional[List[str]] = Field(None, description="Multiple stock tickers")
    records: int = Field(5000, ge=10, le=10000, description="Number of stock records")
    algorithms: Optional[List[str]] = Field(
        None,
        description="List of algorithm names. If null, runs all available."
    )


class AlgorithmResult(BaseModel):
    """Result for a single algorithm benchmark run."""
    algorithm: str
    status: str
    runtime: float = 0
    cpu_usage: float = 0
    memory_usage: str = "0MB"
    memory_usage_mb: float = 0
    energy_wh: float = 0
    co2_g: float = 0
    mae: float = 0
    rmse: float = 0
    r2: float = 0
    mape: float = 0
    predictions_sample: Optional[List[float]] = None
    actuals_sample: Optional[List[float]] = None
    error: Optional[str] = None


class BenchmarkResult(BaseModel):
    """Complete benchmark result for a single ticker."""
    ticker: str
    records: int
    train_size: int
    test_size: int
    features: List[str]
    results: List[AlgorithmResult]
    recommendations: Optional[Dict[str, Any]] = None
    timestamp: str
    multi: Optional[bool] = False


class MultiBenchmarkResult(BaseModel):
    """Response for multi-ticker benchmark."""
    multi: bool = True
    tickers: List[str]
    records: int
    stock_results: Dict[str, Any]


class HealthResponse(BaseModel):
    """Health check response."""
    status: str
    service: str
    version: str


class StockDataResponse(BaseModel):
    """Stock data fetch response."""
    ticker: str
    records: int
    data: List[Dict[str, Any]]
    columns: List[str]
