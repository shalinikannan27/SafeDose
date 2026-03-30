import requests
import json

url = "http://localhost:5000/predict"
data = {
  "frac_temp_above_8": 0.12,
  "handling_stress": 2.3,
  "hum_std": 5.1,
  "door_count": 4,
  "temp_max": 9.2,
  "hum_mean": 62.4,
  "light_mean_abs": 800,
  "accel_rms": 1.2,
  "vaccine_brand": "Gardasil-9"
}

try:
    response = requests.post(url, json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"Error: {e}")
