"""
Benchmark Runner

Orchestrates the full stock prediction benchmarking pipeline:
1. Fetch stock data
2. Preprocess and engineer features
3. Run selected ML algorithms with resource monitoring
4. Compute energy consumption and carbon emissions
5. Collect accuracy metrics
6. Return aggregated results with recommendations
"""

import traceback
from datetime import datetime

from data_preprocessing import fetch_stock_data, preprocess_data, prepare_train_test
from resource_monitor import ResourceMonitor
from energy_estimator import estimate_energy
from carbon_calculator import calculate_carbon
from ml_models import MODEL_REGISTRY, AVAILABLE_ALGORITHMS


def run_benchmark(ticker: str, records: int = 5000, algorithms: list = None) -> dict:
    """
    Run the complete stock prediction benchmark pipeline.

    Args:
        ticker: Stock ticker symbol (e.g., 'AAPL')
        records: Number of stock records to use
        algorithms: List of algorithm names to benchmark (default: all available)

    Returns:
        dict: Structured benchmark results with metrics and recommendations
    """
    # Default to all algorithms if none specified
    if algorithms is None:
        algorithms = AVAILABLE_ALGORITHMS.copy()

    # Validate algorithms
    invalid = [a for a in algorithms if a not in MODEL_REGISTRY]
    if invalid:
        raise ValueError(
            f"Unknown algorithms: {invalid}. Available: {AVAILABLE_ALGORITHMS}"
        )

    # Step 1: Fetch stock data
    raw_df = fetch_stock_data(ticker, records)
    actual_records = len(raw_df)

    # Step 2: Preprocess data
    processed_df = preprocess_data(raw_df)

    # Step 3: Prepare train/test split
    X_train, X_test, y_train, y_test, feature_names = prepare_train_test(processed_df)

    # Dynamically reduce dataset if too large for heavy algorithms
    max_train_size = 4000
    if len(X_train) > max_train_size:
        X_train = X_train[-max_train_size:]
        y_train = y_train[-max_train_size:]

    # Step 4: Run each algorithm
    results = []
    for algo_name in algorithms:
        result = _run_single_algorithm(
            algo_name, X_train, X_test, y_train, y_test
        )
        results.append(result)

    # Step 5: Generate recommendations
    successful = [r for r in results if r["status"] == "success"]
    recommendations = _generate_recommendations(successful)

    return {
        "ticker": ticker,
        "records": actual_records,
        "train_size": len(X_train),
        "test_size": len(X_test),
        "features": feature_names,
        "results": results,
        "recommendations": recommendations,
        "timestamp": datetime.utcnow().isoformat() + "Z",
    }


def _run_single_algorithm(
    algo_name: str, X_train, X_test, y_train, y_test
) -> dict:
    """
    Run a single algorithm with resource monitoring.

    Returns:
        dict: Result for this algorithm including metrics and resource usage
    """
    try:
        # Initialize model
        model_class = MODEL_REGISTRY[algo_name]
        model = model_class()

        # Monitor resources during training and prediction
        monitor = ResourceMonitor()
        monitor.start()

        # Train
        model.train(X_train, y_train)

        # Predict
        y_pred = model.predict(X_test)

        # Stop monitoring
        monitor.stop()

        # Get resource metrics
        resources = monitor.get_metrics()

        # Evaluate accuracy
        metrics = model.evaluate(y_test, y_pred)

        # Compute energy and carbon
        energy_wh = estimate_energy(
            resources["cpu_usage"], resources["runtime_sec"]
        )
        co2_g = calculate_carbon(energy_wh)

        return {
            "algorithm": algo_name,
            "status": "success",
            "runtime": resources["runtime_sec"],
            "cpu_usage": resources["cpu_usage"],
            "memory_usage": f"{resources['memory_usage_mb']:.1f}MB",
            "memory_usage_mb": resources["memory_usage_mb"],
            "energy_wh": energy_wh,
            "co2_g": co2_g,
            "mae": metrics["mae"],
            "rmse": metrics["rmse"],
            "r2": metrics["r2"],
            "predictions_sample": y_pred[:10].tolist(),
            "actuals_sample": y_test[:10].tolist(),
        }

    except Exception as e:
        return {
            "algorithm": algo_name,
            "status": "error",
            "error": str(e),
            "runtime": 0,
            "cpu_usage": 0,
            "memory_usage": "0MB",
            "memory_usage_mb": 0,
            "energy_wh": 0,
            "co2_g": 0,
            "mae": 0,
            "rmse": 0,
            "r2": 0,
        }


def _generate_recommendations(results: list) -> dict:
    """
    Generate recommendations: fastest, greenest, most accurate.

    Args:
        results: List of successful result dicts

    Returns:
        dict: Recommendations with algorithm names
    """
    if not results:
        return {
            "fastest": None,
            "greenest": None,
            "most_accurate": None,
        }

    fastest = min(results, key=lambda r: r["runtime"])
    greenest = min(results, key=lambda r: r["energy_wh"])
    most_accurate = max(results, key=lambda r: r["r2"])

    return {
        "fastest": {
            "algorithm": fastest["algorithm"],
            "runtime": fastest["runtime"],
        },
        "greenest": {
            "algorithm": greenest["algorithm"],
            "energy_wh": greenest["energy_wh"],
            "co2_g": greenest["co2_g"],
        },
        "most_accurate": {
            "algorithm": most_accurate["algorithm"],
            "r2": most_accurate["r2"],
            "rmse": most_accurate["rmse"],
        },
    }
