"""
Energy Consumption Estimator

Estimates energy consumption based on CPU power, utilization, and runtime.
Formula: Energy (Wh) = CPU_Power × (CPU_Utilization / 100) × (Runtime / 3600)
"""


def estimate_energy(cpu_usage_pct: float, runtime_sec: float, cpu_power_watts: float = 65.0) -> float:
    """
    Estimate energy consumption in Watt-hours.

    Args:
        cpu_usage_pct: Average CPU utilization percentage (0-100)
        runtime_sec: Total runtime in seconds
        cpu_power_watts: CPU TDP/power draw in watts (default: 65W)

    Returns:
        float: Estimated energy consumption in Watt-hours (Wh)
    """
    energy_wh = cpu_power_watts * (cpu_usage_pct / 100.0) * (runtime_sec / 3600.0)
    return round(energy_wh, 6)
