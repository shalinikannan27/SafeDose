import requests
import pandas as pd
import numpy as np
import sys
import os
import json

def validate_dataset(filepath):
    """
    Validates backend formula against ground truth labels
    in the validation dataset. Computes MAE, RMSE, and
    status accuracy. Prints full validation report.
    """

    # Check file exists
    if not os.path.exists(filepath):
        print(f"ERROR: File not found: {filepath}")
        return

    # Load CSV
    df = pd.read_csv(filepath)
    print(f"Loaded: {filepath}")
    print(f"Total rows: {len(df)}")
    print(f"Columns found: {list(df.columns)}")
    print("─" * 50)

    # Check ground truth columns exist
    # Adjust these names to match your friend's CSV
    POTENCY_COL = None
    SHELF_COL = None

    for col in df.columns:
        if col.lower() in ["potency", "potency_percentage", 
                           "potency_pct", "actual_potency"]:
            POTENCY_COL = col
        if col.lower() in ["shelf_life", "shelf_life_hours",
                           "actual_shelf_life", "hours_remaining"]:
            SHELF_COL = col

    if POTENCY_COL is None:
        print("WARNING: Could not find ground truth potency column.")
        print("Switching to INFERENCE MODE (generating predictions without validation)")
        MODE = "INFERENCE"
    else:
        print(f"Ground truth potency column: {POTENCY_COL}")
        if SHELF_COL:
            print(f"Ground truth shelf life column: {SHELF_COL}")
        else:
            print("No shelf life ground truth column found — skipping shelf life validation")
        MODE = "VALIDATION"
    
    print("─" * 50)

    # Feature columns to send to backend
    FEATURE_COLS = [
        "frac_temp_above_8", "handling_stress", "hum_std",
        "door_count", "temp_max", "hum_mean",
        "light_mean_abs", "accel_rms"
    ]

    # Check all feature columns exist
    missing = [c for c in FEATURE_COLS if c not in df.columns]
    if missing:
        print(f"ERROR: Missing feature columns: {missing}")
        print("Please check column names in validation CSV")
        return

    # Check vaccine_brand column
    BRAND_COL = None
    for col in df.columns:
        if col.lower() in ["vaccine_brand", "brand", "vaccine"]:
            BRAND_COL = col

    # Brand mapping for integer IDs
    BRAND_MAP = {
        0: "Gardasil-9",
        1: "Cervarix",
        2: "Gardasil-4",
        3: "Cervavac",
        4: "Vaxelis"
    }

    # Drop rows with nulls in feature columns
    df = df.dropna(subset=FEATURE_COLS)
    print(f"Rows after dropping nulls: {len(df)}")
    print("─" * 50)

    # Run processing row by row
    results = []
    predicted_potencies = []
    actual_potencies = []
    correct_status = 0
    total_processed = 0
    errors = []

    print(f"Running in {MODE} mode...")
    
    # Import local modules for high-speed processing
    try:
        from compute import compute_potency, get_status, generate_warnings
        from model import predict_shelf_life
    except ImportError:
        print("ERROR: Could not import compute.py or model.py for local processing.")
        return

    for idx, row in df.iterrows():
        # Handle brand name or ID (IDs might be float 1.0 from pandas)
        raw_brand = row[BRAND_COL] if BRAND_COL else 0
        try:
            # If numeric (float or int), map to name
            brand_idx = int(float(raw_brand))
            vaccine_brand = BRAND_MAP.get(brand_idx, "Gardasil-9")
        except (ValueError, TypeError):
            # If string name, use as is
            vaccine_brand = str(raw_brand).strip()

        # Build feature dict
        features = {
            "frac_temp_above_8": float(row["frac_temp_above_8"]),
            "handling_stress":   float(row["handling_stress"]),
            "hum_std":           float(row["hum_std"]),
            "door_count":        float(row["door_count"]),
            "temp_max":          float(row["temp_max"]),
            "hum_mean":          float(row["hum_mean"]),
            "light_mean_abs":    float(row["light_mean_abs"]),
            "accel_rms":         float(row["accel_rms"])
        }

        try:
            # Local processing (bypassing slow API)
            pred_potency = compute_potency(features)
            pred_status = get_status(pred_potency)
            pred_shelf, shelf_warning = predict_shelf_life(features, pred_potency, vaccine_brand)

            if MODE == "VALIDATION":
                actual_potency = float(row[POTENCY_COL])
                
                # Compute actual status from ground truth
                if actual_potency >= 85:
                    actual_status = "Safe"
                elif actual_potency >= 60:
                    actual_status = "Use Soon"
                else:
                    actual_status = "Discard"

                predicted_potencies.append(pred_potency)
                actual_potencies.append(actual_potency)

                if pred_status == actual_status:
                    correct_status += 1
            
            # Store result for export
            res_row = row.to_dict()
            res_row["predicted_potency"] = pred_potency
            res_row["predicted_status"] = pred_status
            res_row["predicted_shelf_life"] = pred_shelf
            results.append(res_row)

            total_processed += 1
            
            # Progress update
            if total_processed % 5000 == 0:
                print(f"Processed {total_processed}/{len(df)} rows...")

        except Exception as e:
            errors.append(f"Row {idx}: {str(e)}")

    # Compute metrics if in validation mode
    if MODE == "VALIDATION" and predicted_potencies:
        predicted = np.array(predicted_potencies)
        actual = np.array(actual_potencies)

        mae = np.mean(np.abs(predicted - actual))
        rmse = np.sqrt(np.mean((predicted - actual) ** 2))
        status_accuracy = (correct_status / total_processed * 100) if total_processed > 0 else 0

        # Print report
        print("─" * 50)
        print("VALIDATION REPORT")
        print("─" * 50)
        print(f"Total rows validated:   {total_processed}")
        print(f"Rows skipped (errors):  {len(errors)}")
        print("─" * 50)
        print("POTENCY FORMULA ACCURACY:")
        print(f"  MAE:                  {mae:.2f}%")
        print(f"  RMSE:                 {rmse:.2f}%")
        print(f"  Mean predicted:       {predicted.mean():.2f}%")
        print(f"  Mean actual:          {actual.mean():.2f}%")
        print("─" * 50)
        print("STATUS CLASSIFICATION:")
        print(f"  Correct:              {correct_status}/{total_processed}")
        print(f"  Accuracy:             {status_accuracy:.1f}%")
        print("─" * 50)

        # Verdict
        print("VERDICT:")
        if mae < 5 and status_accuracy > 90:
            print("  ✅ Formula is highly accurate")
        elif mae < 10 and status_accuracy > 80:
            print("  ⚠ Formula is acceptable — minor deviations")
        else:
            print("  ❌ Formula needs review — high deviation")
    
    # Save results to CSV
    if results:
        results_df = pd.DataFrame(results)
        output_file = "validation_results.csv"
        results_df.to_csv(output_file, index=False)
        print("─" * 50)
        print(f"Process complete. Results saved to: {output_file}")
        print(f"Total processed: {total_processed}")
    
    if errors:
        print(f"ERRORS ({len(errors)}):")
        for e in errors[:5]:
            print(f"  {e}")
        if len(errors) > 5:
            print(f"  ... and {len(errors) - 5} more")
        print("─" * 50)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python validate.py <path_to_validation_csv>")
    else:
        validate_dataset(sys.argv[1])
