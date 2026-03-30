import os
import joblib

# Encoding constants
BRAND_ENCODING = {
    "Gardasil-9": 0,
    "Cervarix":   1,
    "Gardasil-4": 2,
    "Cervavac":   3,
    "Vaxelis":    4
}

# Model file paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SHELF_MODEL_PATH = os.path.join(BASE_DIR, "models", "shelf_life_model.pkl")

# Attempt to load model at module load time
try:
    if os.path.exists(SHELF_MODEL_PATH):
        shelf_model = joblib.load(SHELF_MODEL_PATH)
    else:
        print("WARNING: shelf_life_model.pkl not found in models/ folder. Shelf life prediction will be disabled.")
        shelf_model = None
except Exception as e:
    print(f"WARNING: Error loading model: {e}. Shelf life prediction will be disabled.")
    shelf_model = None


def predict_shelf_life(features, potency, vaccine_brand):
    """
    Predicts shelf life hours using Random Forest model. 
    Takes 8 sensor features, computed potency percentage, and vaccine brand. 
    Returns (shelf_life_hours, warning).
    """
    if shelf_model is None:
        return (None, "Shelf life model not loaded — place shelf_life_model.pkl in models/")

    if potency is not None and potency < 60:
        return (0, None)

    try:
        # Build 10 features (8 sensors + 1 brand + 1 potency)
        # RF model expects raw features as per latest requirement
        final_input = [
            features.get("frac_temp_above_8", 0),
            features.get("handling_stress", 0),
            features.get("hum_std", 0),
            features.get("door_count", 0),
            features.get("temp_max", 0),
            features.get("hum_mean", 0),
            features.get("light_mean_abs", 0),
            features.get("accel_rms", 0),
            BRAND_ENCODING.get(vaccine_brand, 0),
            potency
        ]

        # Predict using raw features
        prediction = shelf_model.predict([final_input])[0]
        shelf_life_hours = max(0, min(72, round(float(prediction))))

        return (shelf_life_hours, None)
    except Exception as e:
        return (None, f"Shelf life prediction error: {e}")
