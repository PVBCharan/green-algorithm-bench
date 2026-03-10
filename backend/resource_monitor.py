"""
Resource Monitor Module

Captures CPU usage, memory consumption, and execution runtime
for each algorithm execution using psutil and tracemalloc.
"""

import time
import psutil
import tracemalloc


class ResourceMonitor:
    """
    Context manager that monitors system resource usage during code execution.

    Usage:
        monitor = ResourceMonitor()
        monitor.start()
        # ... run algorithm ...
        monitor.stop()
        metrics = monitor.get_metrics()
    """

    def __init__(self):
        self.start_time = None
        self.end_time = None
        self.cpu_readings = []
        self.peak_memory_mb = 0.0
        self.runtime_sec = 0.0
        self.avg_cpu_percent = 0.0

    def start(self):
        """Start monitoring resources."""
        # Initialize tracemalloc for memory tracking
        if not tracemalloc.is_tracing():
            tracemalloc.start()
        else:
            tracemalloc.reset_peak()

        # Warm up CPU measurement (first call returns 0.0)
        psutil.cpu_percent(interval=None)

        self.start_time = time.perf_counter()

    def stop(self):
        """Stop monitoring and collect final metrics."""
        self.end_time = time.perf_counter()
        self.runtime_sec = self.end_time - self.start_time

        # Get CPU usage
        self.avg_cpu_percent = psutil.cpu_percent(interval=None)

        # Get peak memory from tracemalloc
        _, peak = tracemalloc.get_traced_memory()
        self.peak_memory_mb = peak / (1024 * 1024)  # Convert bytes to MB

    def get_metrics(self):
        """
        Return collected resource metrics.

        Returns:
            dict: {
                "cpu_usage": float (percentage),
                "memory_usage_mb": float,
                "runtime_sec": float
            }
        """
        return {
            "cpu_usage": round(self.avg_cpu_percent, 2),
            "memory_usage_mb": round(self.peak_memory_mb, 2),
            "runtime_sec": round(self.runtime_sec, 4),
        }
