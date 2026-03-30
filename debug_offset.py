import pandas as pd
import requests
import json

START = 50
END = 60
df = pd.read_csv("validation_set.csv").iloc[START:END]
BRAND_MAP = {
    0: "Gardasil-9",
    1: "Cervarix",
    2: "Gardasil-4",
    3: "Cervavac",
    4: "Vaxelis"
}

print(f"Starting debug audit for rows {START} to {END}...")

for i, row in df.iterrows():
    raw_brand = row["vaccine_brand"]
    try:
        brand_idx = int(float(raw_brand))
        brand_name = BRAND_MAP.get(brand_idx, "Gardasil-9")
    except:
        brand_name = str(raw_brand).strip()
    
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
    
    try:
        r = requests.post("http://localhost:5000/predict", json=payload, timeout=5)
        print(f"Row {i}: {r.status_code} - {r.text}")
    except Exception as e:
        print(f"Row {i}: Request failed - {e}")

print("\nDebug audit complete.")
