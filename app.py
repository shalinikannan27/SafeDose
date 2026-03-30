import csv
import io
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
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
        # Read file as text
        file_content = file.read().decode('utf-8')
        file_io = io.StringIO(file_content)
        reader = csv.DictReader(file_io)
        rows = list(reader)
        csv_columns = reader.fieldnames if reader.fieldnames else []
    except Exception as e:
        return jsonify({"error": f"Could not read CSV: {str(e)}"}), 400

    if not rows:
        return jsonify({"error": "CSV file is empty"}), 400

    mapping, unmapped = map_columns(csv_columns)
    
    if unmapped:
        return jsonify({
            "error": "Could not map required columns",
            "unmapped_features": unmapped,
            "csv_columns_found": csv_columns,
            "hint": "Please ensure your CSV contains cold-chain logger data with temperature and handling sensor columns"
        }), 400

    # Clean and Map rows
    valid_rows = []
    for row in rows:
        mapped_row = {}
        is_valid = True
        for canonical, csv_col in mapping.items():
            val = row.get(csv_col)
            if val is None or val.strip() == "":
                is_valid = False
                break
            try:
                mapped_row[canonical] = float(val)
            except ValueError:
                is_valid = False
                break
        
        if is_valid:
            # Also keep metadata if present
            for meta_col in ["batch_id", "vaccine_brand"]:
                if meta_col in row and row[meta_col]:
                    mapped_row[meta_col] = row[meta_col]
            valid_rows.append(mapped_row)

    if not valid_rows:
        return jsonify({"error": "All rows contain missing or invalid values for required sensor columns"}), 400

    # Compute stats across ALL valid rows
    last_row = valid_rows[-1]
    
    # Aggregation
    stats = {
        "frac_temp_above_8": max(r["frac_temp_above_8"] for r in valid_rows),
        "handling_stress": max(r["handling_stress"] for r in valid_rows),
        "hum_std": last_row["hum_std"],
        "door_count": int(last_row["door_count"]),
        "temp_max": max(r["temp_max"] for r in valid_rows),
        "hum_mean": sum(r["hum_mean"] for r in valid_rows) / len(valid_rows),
        "light_mean_abs": sum(r["light_mean_abs"] for r in valid_rows) / len(valid_rows),
        "accel_rms": max(r["accel_rms"] for r in valid_rows)
    }

    features = dict(stats)
    vaccine_brand = str(last_row.get("vaccine_brand", "Gardasil-9"))

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
        if col in last_row:
            metadata[col] = str(last_row[col])

    return jsonify({
        "potency_percentage": potency,
        "status": status,
        "shelf_life_hours": shelf_life_hours,
        "warnings": warnings,
        "stats": stats,
        "column_mapping": mapping,
        "metadata": metadata,
        "rows_processed": len(valid_rows),
        "input_source": "csv"
    })


@app.errorhandler(Exception)
def handle_exception(e):
    """Global error handler — catches all unhandled exceptions and returns a JSON 500 response."""
    return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
