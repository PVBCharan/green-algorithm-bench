"""
Carbon Footprint Calculator

Estimates CO₂ emissions from energy consumption.
Formula: CO₂ (grams) = Energy (kWh) × Carbon Intensity (kg CO₂/kWh) × 1000
"""


def calculate_carbon(energy_wh: float, carbon_intensity_kg_per_kwh: float = 0.475) -> float:
    """
    Calculate carbon emissions in grams of CO₂.

    Args:
        energy_wh: Energy consumption in Watt-hours
        carbon_intensity_kg_per_kwh: Carbon intensity factor in kg CO₂ per kWh
                                     (default: 0.475 — global average)

    Returns:
        float: Estimated CO₂ emissions in grams
    """
    energy_kwh = energy_wh / 1000.0
    co2_grams = energy_kwh * carbon_intensity_kg_per_kwh * 1000.0
    return round(co2_grams, 6)
