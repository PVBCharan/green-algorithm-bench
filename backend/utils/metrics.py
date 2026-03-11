"""
Model Evaluation Metrics Module

Provides standalone functions for computing standard ML regression metrics.
These can be used independently of the model classes.
"""

import numpy as np
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


def calculate_mae(y_true, y_pred) -> float:
    """
    Calculate Mean Absolute Error.

    Args:
        y_true: Actual values
        y_pred: Predicted values

    Returns:
        float: MAE value
    """
    return round(float(mean_absolute_error(y_true, y_pred)), 4)


def calculate_rmse(y_true, y_pred) -> float:
    """
    Calculate Root Mean Squared Error.

    Args:
        y_true: Actual values
        y_pred: Predicted values

    Returns:
        float: RMSE value
    """
    return round(float(np.sqrt(mean_squared_error(y_true, y_pred))), 4)


def calculate_r2(y_true, y_pred) -> float:
    """
    Calculate R² (coefficient of determination) score.

    Args:
        y_true: Actual values
        y_pred: Predicted values

    Returns:
        float: R² score
    """
    return round(float(r2_score(y_true, y_pred)), 4)


def calculate_mape(y_true, y_pred) -> float:
    """
    Calculate Mean Absolute Percentage Error.

    Handles zero values in y_true by substituting them with 1
    to avoid division by zero.

    Args:
        y_true: Actual values
        y_pred: Predicted values

    Returns:
        float: MAPE as a percentage
    """
    y_true = np.array(y_true)
    y_pred = np.array(y_pred)
    safe_true = np.where(y_true == 0, 1, y_true)
    mape = float(np.mean(np.abs((y_true - y_pred) / safe_true)) * 100)
    return round(mape, 4)


def calculate_all_metrics(y_true, y_pred) -> dict:
    """
    Calculate all four metrics at once.

    Args:
        y_true: Actual values
        y_pred: Predicted values

    Returns:
        dict: {mae, rmse, r2, mape}
    """
    return {
        "mae": calculate_mae(y_true, y_pred),
        "rmse": calculate_rmse(y_true, y_pred),
        "r2": calculate_r2(y_true, y_pred),
        "mape": calculate_mape(y_true, y_pred),
    }
