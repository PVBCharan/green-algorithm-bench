"""
Data Preprocessing Module

Handles stock data fetching via yfinance, feature engineering,
normalization, and train/test splitting for ML models.
"""

import numpy as np
import pandas as pd
import yfinance as yf
from sklearn.preprocessing import MinMaxScaler
from functools import lru_cache
import hashlib
import json


# In-memory cache for stock data to avoid repeated API calls
_stock_cache = {}


def fetch_stock_data(ticker: str, records: int = 5000) -> pd.DataFrame:
    """
    Fetch stock data from Yahoo Finance.

    Args:
        ticker: Stock ticker symbol (e.g., 'AAPL')
        records: Maximum number of records to fetch (up to 5000)

    Returns:
        DataFrame with columns: Date, Open, High, Low, Close, Volume
    """
    cache_key = f"{ticker}_{records}"
    if cache_key in _stock_cache:
        return _stock_cache[cache_key].copy()

    # Fetch maximum available data
    stock = yf.Ticker(ticker)
    df = stock.history(period="max")

    if df.empty:
        raise ValueError(f"No data found for ticker '{ticker}'")

    # Reset index to get Date as a column
    df = df.reset_index()

    # Keep only required columns
    required_cols = ["Date", "Open", "High", "Low", "Close", "Volume"]
    available_cols = [c for c in required_cols if c in df.columns]
    df = df[available_cols]

    # Limit to requested records (most recent)
    if len(df) > records:
        df = df.tail(records).reset_index(drop=True)

    # Cache the result
    _stock_cache[cache_key] = df.copy()

    return df


def preprocess_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Preprocess stock data with feature engineering.

    Generates:
    - Moving averages (5-day, 10-day, 20-day)
    - Price change percentage
    - Volatility (rolling std)
    - Lagged price features (1-day, 2-day, 3-day)
    - Next day close (prediction target)

    Args:
        df: Raw stock DataFrame

    Returns:
        Preprocessed DataFrame with engineered features
    """
    df = df.copy()

    # Handle missing values
    df = df.dropna()

    # Ensure numeric types
    numeric_cols = ["Open", "High", "Low", "Close", "Volume"]
    for col in numeric_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")

    df = df.dropna()

    if len(df) < 25:
        raise ValueError("Insufficient data after cleaning (need at least 25 rows)")

    # Feature engineering
    # Moving averages
    df["MA_5"] = df["Close"].rolling(window=5).mean()
    df["MA_10"] = df["Close"].rolling(window=10).mean()
    df["MA_20"] = df["Close"].rolling(window=20).mean()

    # Price change percentage
    df["Price_Change_Pct"] = df["Close"].pct_change() * 100

    # Volatility (20-day rolling standard deviation)
    df["Volatility"] = df["Close"].rolling(window=20).std()

    # Lagged price features
    df["Lag_1"] = df["Close"].shift(1)
    df["Lag_2"] = df["Close"].shift(2)
    df["Lag_3"] = df["Close"].shift(3)

    # High-Low spread
    df["HL_Spread"] = df["High"] - df["Low"]

    # Open-Close spread
    df["OC_Spread"] = df["Close"] - df["Open"]

    # Prediction target: next day closing price
    df["Target"] = df["Close"].shift(-1)

    # Drop rows with NaN (from rolling calculations and shift)
    df = df.dropna()
    df = df.reset_index(drop=True)

    return df


def prepare_train_test(df: pd.DataFrame, test_size: float = 0.2):
    """
    Split preprocessed data into training and testing sets.

    Uses time-series ordering (no shuffle) to prevent data leakage.

    Args:
        df: Preprocessed DataFrame with 'Target' column
        test_size: Fraction of data for testing (default: 0.2)

    Returns:
        tuple: (X_train, X_test, y_train, y_test, feature_names)
    """
    # Feature columns (exclude Date, Target, and raw price columns used to create features)
    exclude_cols = ["Date", "Target"]
    feature_cols = [c for c in df.columns if c not in exclude_cols and df[c].dtype in ["float64", "int64", "float32", "int32"]]

    X = df[feature_cols].values
    y = df["Target"].values

    # Time-series split: no shuffling
    split_idx = int(len(X) * (1 - test_size))
    X_train, X_test = X[:split_idx], X[split_idx:]
    y_train, y_test = y[:split_idx], y[split_idx:]

    # Normalize features using MinMaxScaler (fit on train, transform both)
    scaler = MinMaxScaler()
    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)

    return X_train, X_test, y_train, y_test, feature_cols


def clear_cache():
    """Clear the stock data cache."""
    global _stock_cache
    _stock_cache = {}
