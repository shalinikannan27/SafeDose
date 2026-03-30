import pandas as pd
import requests
import json

df = pd.read_csv("validation_set.csv").head(10)
BRAND_MAP = {
    0: "Gardasil-9",
    1: "Cervarix",
    2: "Gardasil-4",
    3: "Cervavac",
    4: "Vaxelis"
}

print("Starting debug audit...")

for i, row in df.iterrows():
    brand_idx = int(row["vaccine_brand"])
    brand_name = BRAND_MAP.get(brand_idx, "Gardasil-9")
    
    payload = {
        "frac_temp_above_8": float(row["frac_temp_above_8"]),
        "handling_stress":   float(row["handling_stress"]),
        "hum_std":           float(row["hum_std"]),
        "door_count":        float(row["door_count"]),
        "temp_max":          float(row["temp_max"]),
        "hum_mean":          float(row["hum_mean"]),
        "light_mean_abs":    float(row["light_mean_abs"]),
        "accel_rms":         float(row["accel_rms"]),
        "vaccine_brand":     brand_name
    }
    
    print(f"\n--- Row {i} ---")
    print(f"Payload: {json.dumps(payload, indent=2)}")
    
    try:
        r = requests.post("http://localhost:5000/predict", json=payload, timeout=5)
        print(f"Status Code: {r.status_code}")
        print(f"Response: {r.text}")
    except Exception as e:
        print(f"Request failed: {e}")

print("\nDebug audit complete.")
