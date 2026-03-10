"""
FastAPI application for GreenAlgoBench - Carbon-Aware Algorithm Optimization Platform

This application exposes the existing Python logic as REST APIs:
- System Footprint: Get current system carbon footprint
- Benchmark: Run algorithm benchmarks
- Optimize: Get algorithm optimization recommendations
- Stocks: Fetch live stock data and run ML benchmarks
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import system, benchmark, optimize, analyze, stocks, stock_benchmark

# Initialize FastAPI app
app = FastAPI(
    title="GreenAlgoBench API",
    description="Carbon-Aware Algorithm Optimization Platform",
    version="1.0.0"
)

# Enable CORS for frontend (localhost:5173 and production URLs)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for production (can restrict later if needed)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include route modules
app.include_router(system.router, prefix="/api", tags=["System"])
app.include_router(benchmark.router, prefix="/api", tags=["Benchmark"])
app.include_router(optimize.router, prefix="/api", tags=["Optimization"])
app.include_router(analyze.router, prefix="/api", tags=["Analysis"])
app.include_router(stocks.router, prefix="/api", tags=["Stocks"])
app.include_router(stock_benchmark.router, prefix="/api", tags=["Stock Benchmark"])

# Health check endpoint
@app.get("/health")
async def health_check():
    """
    Simple health check endpoint to verify server is running.
    """
    return {
        "status": "online",
        "service": "GreenAlgoBench API",
        "version": "1.0.0"
    }

# Root endpoint
@app.get("/")
async def root():
    """
    API root endpoint with welcome message and documentation links.
    """
    return {
        "message": "Welcome to GreenAlgoBench API",
        "documentation": "/docs",
        "endpoints": {
            "health": "/health",
            "system_footprint": "/api/system-footprint",
            "run_benchmark": "/api/benchmark",
            "optimize": "/api/optimize",
            "analyze": "/api/analyze",
            "analyze_quick": "/api/analyze/quick",
            "analyze_status": "/api/analyze/status",
            "stocks_data": "/api/stocks/data",
            "benchmark_run": "/api/benchmark/run",
            "benchmark_algorithms": "/api/benchmark/algorithms"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
