import pandas as pd
import numpy as np
import pickle
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
import os

def generate_loan_approval():
    np.random.seed(123)
    num_samples = 2000
    
    # Features
    income = np.random.normal(60000, 20000, size=num_samples)
    credit_score = np.random.normal(700, 50, size=num_samples)
    years_employed = np.random.randint(0, 40, size=num_samples)
    
    # Sensitive feature
    gender = np.random.choice(['male', 'female'], size=num_samples, p=[0.5, 0.5])
    
    # Base logic
    base_score = (income / 10000) * 0.5 + (credit_score - 500) / 50 + years_employed * 0.1
    
    # Bias
    gender_bias = np.where(gender == 'female', -1.5, 1.0)
    
    total_score = base_score + gender_bias + np.random.normal(0, 2, size=num_samples)
    
    approved = (total_score > np.percentile(total_score, 60)).astype(int)
    
    df = pd.DataFrame({
        'income': income,
        'credit_score': credit_score,
        'years_employed': years_employed,
        'gender': gender,
        'approved': approved
    })
    
    # Save CSV
    df.to_csv('loan_approval_dataset.csv', index=False)
    
    # Train dummy model
    X = pd.get_dummies(df.drop('approved', axis=1))
    y = df['approved']
    
    model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
    model.fit(X, y)
    
    with open('loan_approval_model.pkl', 'wb') as f:
        pickle.dump(model, f)
        
    print("Generated loan_approval_dataset.csv and loan_approval_model.pkl")

def generate_fraud_detection():
    np.random.seed(456)
    num_samples = 5000
    
    # Features
    transaction_amount = np.random.exponential(scale=100, size=num_samples)
    distance_from_home = np.random.exponential(scale=50, size=num_samples)
    distance_from_last_tx = np.random.exponential(scale=20, size=num_samples)
    
    # Sensitive feature
    age_group = np.random.choice(['young', 'adult', 'senior'], size=num_samples, p=[0.3, 0.5, 0.2])
    
    # Base logic
    base_risk = (transaction_amount / 50) + (distance_from_home / 20) + (distance_from_last_tx / 10)
    
    bias = np.where(age_group == 'senior', 2.0, -0.5)
    
    total_risk = base_risk + bias + np.random.normal(0, 3, size=num_samples)
    
    fraud = (total_risk > np.percentile(total_risk, 90)).astype(int)
    
    df = pd.DataFrame({
        'transaction_amount': transaction_amount,
        'distance_from_home': distance_from_home,
        'distance_from_last_tx': distance_from_last_tx,
        'age_group': age_group,
        'fraud': fraud
    })
    
    # Save CSV
    df.to_csv('fraud_detection_dataset.csv', index=False)
    
    # Train dummy model
    X = pd.get_dummies(df.drop('fraud', axis=1))
    y = df['fraud']
    
    model = LogisticRegression(max_iter=1000)
    model.fit(X, y)
    
    with open('fraud_detection_model.pkl', 'wb') as f:
        pickle.dump(model, f)
        
    print("Generated fraud_detection_dataset.csv and fraud_detection_model.pkl")

def generate_clinic_model():
    # just create a model for the existing dummy_clinic_dataset.csv if it exists
    if os.path.exists('dummy_clinic_dataset.csv'):
        df = pd.read_csv('dummy_clinic_dataset.csv')
        X = pd.get_dummies(df.drop('diabetes_risk', axis=1))
        y = df['diabetes_risk']
        
        model = RandomForestClassifier(n_estimators=50, max_depth=5, random_state=42)
        model.fit(X, y)
        
        with open('dummy_clinic_model.pkl', 'wb') as f:
            pickle.dump(model, f)
        print("Generated dummy_clinic_model.pkl")

if __name__ == "__main__":
    generate_loan_approval()
    generate_fraud_detection()
    generate_clinic_model()

