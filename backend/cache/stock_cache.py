"""
TTL Cache for Stock Data

In-memory cache with time-to-live (TTL) support to prevent
repeated yfinance API calls for the same stock data.

Cache key format: "{ticker}_{records}"
Default TTL: 5 minutes
"""

import time
from typing import Optional
import pandas as pd


class StockCache:
    """
    Thread-safe in-memory TTL cache for stock data.

    Usage:
        cache = StockCache(ttl_seconds=300)
        cache.set("AAPL_5000", df)
        result = cache.get("AAPL_5000")
    """

    def __init__(self, ttl_seconds: int = 300):
        """
        Initialize the cache.

        Args:
            ttl_seconds: Time-to-live in seconds (default: 300 = 5 minutes)
        """
        self._cache = {}
        self._timestamps = {}
        self.ttl_seconds = ttl_seconds

    def _make_key(self, ticker: str, records: int) -> str:
        """Create a cache key from ticker and record count."""
        return f"{ticker.upper()}_{records}"

    def get(self, ticker: str, records: int) -> Optional[pd.DataFrame]:
        """
        Get cached data if it exists and hasn't expired.

        Args:
            ticker: Stock ticker symbol
            records: Number of records

        Returns:
            DataFrame if cache hit and not expired, None otherwise
        """
        key = self._make_key(ticker, records)
        if key not in self._cache:
            return None

        # Check TTL
        cached_time = self._timestamps.get(key, 0)
        if time.time() - cached_time > self.ttl_seconds:
            # Expired — remove from cache
            self._cache.pop(key, None)
            self._timestamps.pop(key, None)
            return None

        return self._cache[key].copy()

    def set(self, ticker: str, records: int, data: pd.DataFrame) -> None:
        """
        Store data in cache with current timestamp.

        Args:
            ticker: Stock ticker symbol
            records: Number of records
            data: DataFrame to cache
        """
        key = self._make_key(ticker, records)
        self._cache[key] = data.copy()
        self._timestamps[key] = time.time()

    def clear(self) -> None:
        """Clear all cached data."""
        self._cache.clear()
        self._timestamps.clear()

    def size(self) -> int:
        """Return the number of items in the cache."""
        return len(self._cache)

    def cleanup_expired(self) -> int:
        """
        Remove all expired entries from the cache.

        Returns:
            int: Number of entries removed
        """
        now = time.time()
        expired_keys = [
            key for key, ts in self._timestamps.items()
            if now - ts > self.ttl_seconds
        ]
        for key in expired_keys:
            self._cache.pop(key, None)
            self._timestamps.pop(key, None)
        return len(expired_keys)


# Global cache instance (shared across the application)
stock_cache = StockCache(ttl_seconds=300)
