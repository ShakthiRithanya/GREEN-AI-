import pandas as pd
import numpy as np

def calculate_disparate_impact(y_pred, sens_test, y_test):
    if sens_test is None:
        return None
        
    sens_test = np.array(sens_test)
    y_pred = np.array(y_pred)
    y_test = np.array(y_test)
    
    uniques = pd.Series(sens_test).dropna().unique()
    
    if len(uniques) < 2:
        return None
        
    group_A = uniques[0]
    group_B = uniques[1]
    
    mask_A = sens_test == group_A
    mask_B = sens_test == group_B
    
    # Try to dynamically ascertain the positive predicting class
    try:
        pos_class = y_test.max()
    except:
        pos_class = y_test[0]
    
    rate_A = (y_pred[mask_A] == pos_class).mean() if mask_A.sum() > 0 else 0.0
    rate_B = (y_pred[mask_B] == pos_class).mean() if mask_B.sum() > 0 else 0.0
    
    if rate_B == 0:
        return 1.0 if rate_A == 0 else 2.0
        
    return float(min(rate_A / rate_B, 2.0))
