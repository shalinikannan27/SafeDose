from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from mapper import map_columns
from compute import compute_potency, get_status, generate_warnings
from model import predict_shelf_life

# Constants
VALID_BRANDS = ["Gardasil-9", "Cervarix", "Gardasil-4", "Cervavac", "Vaxelis"]

CANONICAL_FEATURES = [
    "frac_temp_above_8", "handling_stress", "hum_std",
    "door_count", "temp_max", "hum_mean",
    "light_mean_abs", "accel_rms"
]

# Setup
app = Flask(__name__)
CORS(app)


@app.route("/health", methods=["GET"])
def health():
    """Returns the health status and version of the API."""
    return jsonify({"status": "ok", "version": "1.0"})


@app.route("/predict", methods=["POST"])
def predict():
    """Manual input endpoint. Accepts JSON with 8 sensor features and vaccine brand. Returns potency, status, shelf life and warnings."""
    data = request.get_json(force=True)

    # Step 1 — validate 8 numeric fields
    for field in CANONICAL_FEATURES:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400
        try:
            float(data[field])
        except (TypeError, ValueError):
            return jsonify({"error": f"Field {field} must be a number"}), 400

    # Step 2 — validate vaccine_brand
    if "vaccine_brand" not in data:
        return jsonify({"error": "Missing required field: vaccine_brand"}), 400
    
    vaccine_brand = str(data["vaccine_brand"]).strip()
    if vaccine_brand not in VALID_BRANDS:
        return jsonify({
            "error": f"Invalid vaccine_brand '{vaccine_brand}'. Must be one of: {', '.join(VALID_BRANDS)}"
        }), 400

    # Logic
    features = {f: float(data[f]) for f in CANONICAL_FEATURES}
    vaccine_brand = data["vaccine_brand"]

    potency = compute_potency(features)
    status = get_status(potency)
    warnings = generate_warnings(features)
    shelf_life_hours, shelf_warning = predict_shelf_life(features, potency, vaccine_brand)

    if shelf_warning is not None:
        warnings.append(shelf_warning)

    return jsonify({
        "potency_percentage": potency,
        "status": status,
        "shelf_life_hours": shelf_life_hours,
        "warnings": warnings,
        "stats": features,
        "metadata": {
            "vaccine_brand": vaccine_brand
        },
        "input_source": "manual"
    })


@app.route("/predict-csv", methods=["POST"])
def predict_csv():
    """CSV upload endpoint. Accepts multipart/form-data with field named 'file'. Processes cold-chain logger CSV, maps columns, computes potency and shelf life."""
    # Validation
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file uploaded"}), 400
    
    if not file.filename.lower().endswith(".csv"):
        return jsonify({"error": "Only CSV files are accepted"}), 400

    # Processing
    try:
        df = pd.read_csv(file)
    except Exception as e:
        return jsonify({"error": f"Could not read CSV: {str(e)}"}), 400

    if df.empty:
        return jsonify({"error": "CSV file is empty"}), 400

    mapping, unmapped = map_columns(list(df.columns))
    
    if unmapped:
        return jsonify({
            "error": "Could not map required columns",
            "unmapped_features": unmapped,
            "csv_columns_found": list(df.columns),
            "hint": "Please ensure your CSV contains cold-chain logger data with temperature and handling sensor columns"
        }), 400

    # Rename CSV columns
    reverse_mapping = {v: k for k, v in mapping.items()}
    df = df.rename(columns=reverse_mapping)

    # Drop rows where any of the 8 canonical features is null
    df = df.dropna(subset=CANONICAL_FEATURES)

    if df.empty:
        return jsonify({"error": "All rows contain missing values for required sensor columns"}), 400

    # Compute stats across ALL rows
    last_row = df.iloc[-1]
    stats = {
        "frac_temp_above_8": float(df["frac_temp_above_8"].max()),
        "handling_stress": float(df["handling_stress"].max()),
        "hum_std": float(last_row["hum_std"]),
        "door_count": int(last_row["door_count"]),
        "temp_max": float(df["temp_max"].max()),
        "hum_mean": float(df["hum_mean"].mean()),
        "light_mean_abs": float(df["light_mean_abs"].mean()),
        "accel_rms": float(df["accel_rms"].max())
    }

    # Build features dict from stats
    features = dict(stats)

    # Extract vaccine_brand from last row if column exists
    vaccine_brand = str(last_row["vaccine_brand"]) if "vaccine_brand" in df.columns and pd.notna(last_row.get("vaccine_brand")) else "Gardasil-9"

    # Calculations
    potency = compute_potency(features)
    status = get_status(potency)
    warnings = generate_warnings(features)
    shelf_life_hours, shelf_warning = predict_shelf_life(features, potency, vaccine_brand)

    if shelf_warning is not None:
        warnings.append(shelf_warning)

    # Extract metadata
    metadata = {}
    for col in ["batch_id", "vaccine_brand"]:
        if col in df.columns:
            val = last_row[col]
            if pd.notna(val):
                metadata[col] = str(val)

    return jsonify({
        "potency_percentage": potency,
        "status": status,
        "shelf_life_hours": shelf_life_hours,
        "warnings": warnings,
        "stats": stats,
        "column_mapping": mapping,
        "metadata": metadata,
        "rows_processed": len(df),
        "input_source": "csv"
    })


@app.errorhandler(Exception)
def handle_exception(e):
    """Global error handler — catches all unhandled exceptions and returns a JSON 500 response."""
    return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
