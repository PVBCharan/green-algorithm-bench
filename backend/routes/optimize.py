"""
Optimization API Route

Provides endpoints for ML algorithm optimization recommendations
based on carbon efficiency, accuracy, and performance metrics.

Legacy sorting algorithm references have been removed.
"""

from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from datetime import datetime

router = APIRouter()


@router.get("/optimize/status", response_model=Dict[str, Any])
async def get_optimize_status():
    """
    Get the status of the optimization module.
    """
    return {
        "status": "ready",
        "model_available": True,
        "strategies": [
            "carbon_first",
            "speed_first",
            "accuracy_first",
            "balanced"
        ],
        "message": "ML optimization module ready"
    }


@router.post("/optimize", response_model=Dict[str, Any])
async def get_optimization(
    strategy: str = "balanced",
):
    """
    Get ML algorithm optimization recommendations for stock prediction.
    
    Args:
        strategy: Optimization strategy
            - "carbon_first": Minimize carbon emissions
            - "speed_first": Maximize speed
            - "accuracy_first": Maximize prediction accuracy
            - "balanced": Balance speed, accuracy, and carbon efficiency
    
    Returns:
        JSON response with recommended ML algorithm and explanation
    """
    try:
        valid_strategies = ["carbon_first", "speed_first", "accuracy_first", "balanced"]
        if strategy not in valid_strategies:
            raise HTTPException(
                status_code=400,
                detail=f"strategy must be one of: {', '.join(valid_strategies)}"
            )

        recommendations = {
            "carbon_first": {
                "best_algorithm": "LinearRegression",
                "optimization_score": 0.95,
                "explanation": "Linear Regression has the lowest energy consumption and carbon emissions while providing reasonable accuracy for stock prediction.",
                "alternatives": [
                    {"algorithm": "KNN", "score": 0.90, "explanation": "KNN is lightweight with moderate energy usage."},
                    {"algorithm": "BayesianNetwork", "score": 0.87, "explanation": "Bayesian Ridge offers probabilistic predictions with low overhead."},
                ]
            },
            "speed_first": {
                "best_algorithm": "LinearRegression",
                "optimization_score": 0.93,
                "explanation": "Linear Regression provides the fastest training and prediction times for stock data.",
                "alternatives": [
                    {"algorithm": "LightGBM", "score": 0.88, "explanation": "LightGBM offers fast boosting with good accuracy."},
                    {"algorithm": "XGBoost", "score": 0.85, "explanation": "XGBoost balances speed with strong boosting performance."},
                ]
            },
            "accuracy_first": {
                "best_algorithm": "RandomForest",
                "optimization_score": 0.92,
                "explanation": "Random Forest typically achieves the highest R² scores for stock prediction tasks.",
                "alternatives": [
                    {"algorithm": "XGBoost", "score": 0.90, "explanation": "XGBoost provides competitive accuracy with gradient boosting."},
                    {"algorithm": "LSTM", "score": 0.88, "explanation": "LSTM captures temporal patterns in stock data."},
                ]
            },
            "balanced": {
                "best_algorithm": "LightGBM",
                "optimization_score": 0.91,
                "explanation": "LightGBM offers the best balance of speed, accuracy, and energy efficiency for stock prediction.",
                "alternatives": [
                    {"algorithm": "RandomForest", "score": 0.88, "explanation": "Strong accuracy with moderate resource usage."},
                    {"algorithm": "XGBoost", "score": 0.86, "explanation": "Reliable boosting performance across metrics."},
                ]
            },
        }

        rec = recommendations[strategy]

        return {
            "strategy": strategy,
            "best_algorithm": rec["best_algorithm"],
            "optimization_score": rec["optimization_score"],
            "explanation": rec["explanation"],
            "alternatives": rec["alternatives"],
            "strategy_applied": f"Prioritizing {'carbon efficiency' if strategy == 'carbon_first' else 'execution speed' if strategy == 'speed_first' else 'prediction accuracy' if strategy == 'accuracy_first' else 'balanced metrics'}",
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "message": "Optimization completed successfully"
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Optimization failed: {str(e)}"
        )


@router.get("/optimize/algorithms", response_model=Dict[str, Any])
async def list_algorithms():
    """
    List all available ML algorithms with their characteristics.
    """
    algorithms = [
        {"name": "LinearRegression", "category": "Traditional ML", "complexity": "Low"},
        {"name": "KNN", "category": "Traditional ML", "complexity": "Low"},
        {"name": "RandomForest", "category": "Ensemble", "complexity": "Medium"},
        {"name": "XGBoost", "category": "Boosting", "complexity": "Medium"},
        {"name": "LightGBM", "category": "Boosting", "complexity": "Medium"},
        {"name": "SVR", "category": "Kernel Methods", "complexity": "Medium"},
        {"name": "BayesianNetwork", "category": "Probabilistic", "complexity": "Low"},
        {"name": "CNN", "category": "Deep Learning", "complexity": "High"},
        {"name": "LSTM", "category": "Deep Learning", "complexity": "High"},
        {"name": "DQN", "category": "Reinforcement Learning", "complexity": "High"},
    ]

    return {
        "algorithms": algorithms,
        "count": len(algorithms),
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "message": "ML algorithm list retrieved successfully"
    }
