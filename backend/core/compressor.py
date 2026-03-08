import pandas as pd
import os
import pickle
import time
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import accuracy_score
from .carbon_tracker import TrackerWrapper
from .fairness import calculate_disparate_impact

def compress_and_evaluate(model_id: str, target_size_ratio: float, data_path: str, target_column: str, sensitive_feature: str, method: str):
    # Load the baseline model
    baseline_path = f"models/{model_id}_baseline.pkl"
    with open(baseline_path, "rb") as f:
        model = pickle.load(f)
        
    if not isinstance(model, GradientBoostingClassifier):
        raise ValueError("Compression currently only supports GradientBoostingClassifier")

    # Simple Compression Strategy: Truncating the ensemble (Pruning estimators)
    original_n = model.n_estimators
    new_n = max(1, int(original_n * target_size_ratio))
    
    # Prune internally
    if hasattr(model, 'estimators_'):
        model.estimators_ = model.estimators_[:new_n]
        model.n_estimators = new_n
        
    os.makedirs("models", exist_ok=True)
    compressed_path = f"models/{model_id}_compressed.pkl"
    with open(compressed_path, "wb") as f:
        pickle.dump(model, f)
        
    model_size_mb = os.path.getsize(compressed_path) / (1024 * 1024)
    
    # Load same test split
    df = pd.read_csv(data_path)
    X = df.drop(columns=[target_column])
    y = df[target_column]
    
    sens_values = df[sensitive_feature] if sensitive_feature and sensitive_feature in df.columns else None
    
    X = pd.get_dummies(X)
    
    if sens_values is not None:
        X_train, X_test, y_train, y_test, sens_train, sens_test = train_test_split(
            X, y, sens_values, test_size=0.2, stratify=y, random_state=42
        )
    else:
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)
        sens_test = None
    
    # CodeCarbon Tracking around Inference
    tracker = TrackerWrapper()
    tracker.start()
    
    start_time = time.time()
    y_pred = model.predict(X_test)
    end_time = time.time()
    
    emissions_kg, energy_kwh = tracker.stop()
    
    inference_time_ms = ((end_time - start_time) / len(X_test)) * 1000
    accuracy = accuracy_score(y_test, y_pred)
    
    fairness_score = calculate_disparate_impact(y_pred, sens_test, y_test)
    
    return {
        "co2_emissions_kg": emissions_kg,
        "energy_consumed_kwh": energy_kwh,
        "accuracy": accuracy,
        "inference_time_ms": inference_time_ms,
        "model_size_mb": model_size_mb,
        "fairness_score": fairness_score
    }
