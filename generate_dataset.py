import pandas as pd
import numpy as np

def generate_health_data(num_samples=1000, seed=42):
    np.random.seed(seed)
    
    # Generate features
    age = np.random.randint(18, 85, size=num_samples)
    blood_pressure = np.random.normal(120, 15, size=num_samples)
    cholesterol = np.random.normal(200, 30, size=num_samples)
    bmi = np.random.normal(25, 5, size=num_samples)
    
    # Generate sensitive feature (region)
    # Let's say 40% rural, 60% urban
    region_type = np.random.choice(['rural', 'urban'], size=num_samples, p=[0.4, 0.6])
    
    # Create base risk logic
    # Higher age, BP, cholesterol, BMI -> higher risk
    base_risk = (age - 40) / 20 + (blood_pressure - 120) / 20 + (cholesterol - 200) / 40 + (bmi - 25) / 5
    
    # Add a slight intended bias or difference just to make fairness metrics interesting
    # Let's make rural patients have slightly less predicted risk artificially (so disparate impact is not exactly 1.0)
    region_bias = np.where(region_type == 'rural', -0.5, 0.2)
    
    total_risk = base_risk + region_bias + np.random.normal(0, 1, size=num_samples)
    
    # Convert to binary outcome (top ~30% get risk = 1)
    threshold = np.percentile(total_risk, 70)
    diabetes_risk = (total_risk > threshold).astype(int)
    
    # Create DataFrame
    df = pd.DataFrame({
        'age': age,
        'blood_pressure': blood_pressure,
        'cholesterol': cholesterol,
        'bmi': bmi,
        'region_type': region_type,
        'diabetes_risk': diabetes_risk
    })
    
    # Save to CSV
    output_file = 'dummy_clinic_dataset.csv'
    df.to_csv(output_file, index=False)
    print(f"Generated {num_samples} records and saved to {output_file}")
    print(f"Target Column: 'diabetes_risk'")
    print(f"Sensitive Feature Column: 'region_type'")
    print("\nSample Preview:")
    print(df.head())

if __name__ == "__main__":
    generate_health_data()
