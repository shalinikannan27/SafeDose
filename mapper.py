import difflib

ALIASES = {
    "frac_temp_above_8": [
        "frac_temp_above_8", "temp_above_8", "fraction_above_8", 
        "frac_above_8c", "temp_exceedance", "pct_above_8", 
        "fraction_temp_above_8", "frac_temp_8"
    ],
    "handling_stress": [
        "handling_stress", "stress", "mechanical_stress", 
        "accel_stress", "vibration_stress", "handling_score", 
        "transport_stress"
    ],
    "hum_std": [
        "hum_std", "humidity_std", "humidity_stddev", 
        "hum_stddev", "humidity_sd", "hum_sd"
    ],
    "door_count": [
        "door_count", "door_opens", "opens", "door_open_count", 
        "cold_box_opens", "num_door_opens", "door_events"
    ],
    "temp_max": [
        "temp_max", "max_temp", "temperature_max", 
        "max_temperature", "peak_temp", "highest_temp"
    ],
    "hum_mean": [
        "hum_mean", "humidity_mean", "mean_humidity", "avg_humidity", 
        "humidity_avg", "hum_avg", "average_humidity"
    ],
    "light_mean_abs": [
        "light_mean_abs", "light_mean", "light_abs", "mean_light", 
        "avg_light", "light_average", "lux_mean", "light_level", "lux_avg"
    ],
    "accel_rms": [
        "accel_rms", "acceleration_rms", "rms_accel", "vibration_rms", 
        "accel_vibration", "rms_acceleration", "g_force_rms", "accel_g"
    ]
}

def map_columns(csv_columns):
    """
    Maps raw CSV column names to canonical feature names using aliases and fuzzy matching.

    Args:
        csv_columns (list): A list of raw CSV column names.

    Returns:
        tuple: (mapping_dict, unmapped_list)
            - mapping_dict: {canonical_name: matched_csv_column, ...}
            - unmapped_list: [canonical names that could not be mapped]
    """
    # Create a mapping of cleaned columns to their original names
    cleaned_to_raw = {c.lower().strip(): c for c in csv_columns}
    cleaned_cols = list(cleaned_to_raw.keys())
    
    mapping_dict = {}
    unmapped_list = []
    
    for canonical, aliases in ALIASES.items():
        matched_col = None
        
        # 1. Check for exact alias matches (after cleaning)
        for alias in aliases:
            cleaned_alias = alias.lower().strip()
            if cleaned_alias in cleaned_cols:
                matched_col = cleaned_to_raw[cleaned_alias]
                break
        
        # 2. Fallback to fuzzy matching
        if not matched_col:
            matches = difflib.get_close_matches(canonical.lower().strip(), cleaned_cols, n=1, cutoff=0.6)
            if matches:
                matched_col = cleaned_to_raw[matches[0]]
        
        if matched_col:
            mapping_dict[canonical] = matched_col
        else:
            unmapped_list.append(canonical)
            
    return mapping_dict, unmapped_list
