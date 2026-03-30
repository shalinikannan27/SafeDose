import math

def compute_potency(features):
    """
    Computes vaccine potency percentage using Arrhenius-based cumulative stress formula.

    Args:
        features (dict): Dictionary containing the 8 canonical features.

    Returns:
        float: Computed potency percentage clamped between 0 and 100, rounded to 1 decimal place.
    """
    frac_temp_above_8 = features.get("frac_temp_above_8", 0)
    handling_stress = features.get("handling_stress", 0)
    door_count = features.get("door_count", 0)
    temp_max = features.get("temp_max", 0)
    light_mean_abs = features.get("light_mean_abs", 0)
    accel_rms = features.get("accel_rms", 0)

    cumulative_stress = (
        (frac_temp_above_8 * 40) +
        (handling_stress * 0.8) +
        (door_count * 0.3) +
        (max(0, temp_max - 8) * 1.5) +
        (max(0, light_mean_abs - 50) * 0.002) +
        (accel_rms * 0.5)
    )

    potency = 100 * math.exp(-0.045 * cumulative_stress)
    potency = max(0.0, min(100.0, round(potency, 1)))

    return float(potency)


def get_status(potency):
    """
    Returns safety status string based on potency percentage.

    Args:
        potency (float): The computed potency percentage.

    Returns:
        str: "Safe", "Use Soon", or "Discard".
    """
    if potency >= 85:
        return "Safe"
    elif potency >= 60:
        return "Use Soon"
    else:
        return "Discard"


def generate_warnings(features):
    """
    Generates list of warning strings based on sensor feature values.

    Args:
        features (dict): Dictionary containing the 8 canonical features.

    Returns:
        list: A list of warning strings.
    """
    warnings = []
    
    frac_temp_above_8 = features.get("frac_temp_above_8", 0)
    temp_max = features.get("temp_max", 0)
    door_count = features.get("door_count", 0)
    handling_stress = features.get("handling_stress", 0)
    hum_std = features.get("hum_std", 0)
    light_mean_abs = features.get("light_mean_abs", 0)
    accel_rms = features.get("accel_rms", 0)

    if frac_temp_above_8 > 0.05:
        pct = round(frac_temp_above_8 * 100, 1)
        warnings.append(f"Temperature exceeded 8°C for {pct}% of transit")

    if temp_max > 12:
        warnings.append(f"Critical temperature spike: {temp_max}°C recorded (safe max is 8°C)")
    elif temp_max > 8:
        warnings.append(f"Temperature peaked at {temp_max}°C above safe threshold")

    if door_count > 5:
        warnings.append(f"Cold box opened {door_count} times — increased contamination risk")

    if handling_stress > 6:
        warnings.append(f"High mechanical stress detected ({handling_stress}) — check vial integrity")

    if hum_std > 15:
        warnings.append("Unstable humidity conditions during transit")

    if light_mean_abs > 1000:
        warnings.append("Direct sunlight exposure detected — potency may have degraded significantly")
    elif light_mean_abs > 50:
        warnings.append("Ambient light exposure recorded — safe if under 1 hour")

    if accel_rms > 3:
        warnings.append(f"High vibration detected ({accel_rms}g) — check vial integrity")

    if not warnings:
        return ["No breaches detected — all parameters within safe range"]

    return warnings
