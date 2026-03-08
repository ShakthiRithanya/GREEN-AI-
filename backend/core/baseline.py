import pandas as pd
import os
import pickle
import time
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import accuracy_score
from .carbon_tracker import TrackerWrapper
from .fairness import calculate_disparate_impact

def run_baseline_analysis(data_path: str, target_column: str, sensitive_feature: str, model_id: str):
    df = pd.read_csv(data_path)
    if target_column not in df.columns:
        raise ValueError(f"Target column '{target_column}' not found in dataset")
        
    X = df.drop(columns=[target_column])
    y = df[target_column]
    
    sens_values = df[sensitive_feature] if sensitive_feature and sensitive_feature in df.columns else None
    
    # Simple imputation/encoding (Basic categorical encoding to ensure it works)
    X = pd.get_dummies(X)
    
    if sens_values is not None:
        X_train, X_test, y_train, y_test, sens_train, sens_test = train_test_split(
            X, y, sens_values, test_size=0.2, stratify=y, random_state=42
        )
    else:
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)
        sens_test = None
    
    tracker = TrackerWrapper()
    tracker.start()
    
    model = GradientBoostingClassifier(random_state=42)
    model.fit(X_train, y_train)
    
    emissions_kg, energy_kwh = tracker.stop()
    
    start_time = time.time()
    y_pred = model.predict(X_test)
    end_time = time.time()
    
    inference_time_ms = ((end_time - start_time) / len(X_test)) * 1000
    accuracy = accuracy_score(y_test, y_pred)
    
    os.makedirs("models", exist_ok=True)
    model_path = f"models/{model_id}_baseline.pkl"
    with open(model_path, "wb") as f:
        pickle.dump(model, f)
        
    model_size_mb = os.path.getsize(model_path) / (1024 * 1024)

    fairness_score = calculate_disparate_impact(y_pred, sens_test, y_test)
    
    return {
        "co2_emissions_kg": emissions_kg,
        "energy_consumed_kwh": energy_kwh,
        "accuracy": accuracy,
        "inference_time_ms": inference_time_ms,
        "model_size_mb": model_size_mb,
        "fairness_score": fairness_score
    }

def evaluate_existing_model(data_path: str, target_column: str, sensitive_feature: str, model_id: str, suffix: str = "_baseline"):
    df = pd.read_csv(data_path)
    if target_column not in df.columns:
        raise ValueError(f"Target column '{target_column}' not found in dataset")
        
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
        
    model_path = f"models/{model_id}{suffix}.pkl"
    with open(model_path, "rb") as f:
        model = pickle.load(f)

    # Feature alignment
    if hasattr(model, "feature_names_in_"):
        expected_features = list(model.feature_names_in_)
        # Add missing columns with 0
        for col in expected_features:
            if col not in X.columns:
                X[col] = 0
        # Select and reorder columns
        X = X[expected_features]

    tracker = TrackerWrapper()
    tracker.start()
    
    start_time = time.time()
    y_pred = model.predict(X_test)
    end_time = time.time()
    
    emissions_kg, energy_kwh = tracker.stop()
    
    inference_time_ms = ((end_time - start_time) / len(X_test)) * 1000
    accuracy = accuracy_score(y_test, y_pred)
    
    model_size_mb = os.path.getsize(model_path) / (1024 * 1024)

    fairness_score = calculate_disparate_impact(y_pred, sens_test, y_test)
    
    return {
        "co2_emissions_kg": emissions_kg,
        "energy_consumed_kwh": energy_kwh,
        "accuracy": accuracy,
        "inference_time_ms": inference_time_ms,
        "model_size_mb": model_size_mb,
        "fairness_score": fairness_score
    }

