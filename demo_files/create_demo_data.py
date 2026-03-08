import pandas as pd
import numpy as np
import pickle
from sklearn.datasets import make_classification
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split

def create_demo_files():
    # 1. Create a classification dataset
    X, y = make_classification(n_samples=2000, n_features=20, n_informative=10, random_state=42)
    feature_names = [f"feature_{i}" for i in range(20)]
    df = pd.DataFrame(X, columns=feature_names)
    
    # Add a target column
    df["target"] = y
    
    # Add a sensitive feature for fairness evaluation
    np.random.seed(42)
    df["gender"] = np.random.choice(["Male", "Female"], size=len(df))
    
    # Save the dataset to a CSV file
    df.to_csv("demo_dataset.csv", index=False)
    print("Successfully created 'demo_dataset.csv'")

    # 2. Train a Gradient Boosting model exactly how the backend expects it
    X_backend = df.drop(columns=["target"])
    y_backend = df["target"]
    
    # The backend runs pd.get_dummies(X) before train_test_split
    X_backend = pd.get_dummies(X_backend)
    
    # The backend uses test_size=0.2 and stratify=y with random_state=42
    # If a sensitive feature is passed, it uses it in train_test_split
    sens_values = df["gender"]
    X_train, X_test, y_train, y_test, sens_train, sens_test = train_test_split(
        X_backend, y_backend, sens_values, test_size=0.2, stratify=y_backend, random_state=42
    )
    
    print("Training the demo model (GradientBoostingClassifier)...")
    # Using 100 estimators so we have something substantial to compress
    model = GradientBoostingClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Save the model
    with open("demo_model.pkl", "wb") as f:
        pickle.dump(model, f)
    print("Successfully created 'demo_model.pkl'")

if __name__ == "__main__":
    create_demo_files()
