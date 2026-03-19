import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType, Int64TensorType
import os

# 1. Define Feature Columns (Matching the Paper/Frontend)
FEATURES = [
    'GENDER', 'AGE', 'SMOKING', 'YELLOW_FINGERS', 'ANXIETY', 'PEER_PRESSURE',
    'CHRONIC_DISEASE', 'FATIGUE', 'ALLERGY', 'WHEEZING', 'ALCOHOL_CONSUMING',
    'COUGHING', 'SHORTNESS_OF_BREATH', 'SWALLOWING_DIFFICULTY', 'CHEST_PAIN'
]

# 2. Generate Synthetic Data (Mimicking the Dataset)
# In a real scenario, this would be the CTGAN step. Here we simulate it.
def generate_synthetic_data(n_samples=1000):
    np.random.seed(42)
    data = {
        'GENDER': np.random.randint(0, 2, n_samples), # 0=F, 1=M
        'AGE': np.random.randint(20, 80, n_samples),
        # Lifestyle Factors (0 or 1)
        'SMOKING': np.random.randint(0, 2, n_samples),
        'YELLOW_FINGERS': np.random.randint(0, 2, n_samples),
        'ANXIETY': np.random.randint(0, 2, n_samples),
        'PEER_PRESSURE': np.random.randint(0, 2, n_samples),
        'CHRONIC_DISEASE': np.random.randint(0, 2, n_samples),
        'FATIGUE': np.random.randint(0, 2, n_samples),
        'ALLERGY': np.random.randint(0, 2, n_samples),
        'WHEEZING': np.random.randint(0, 2, n_samples),
        'ALCOHOL_CONSUMING': np.random.randint(0, 2, n_samples),
        'COUGHING': np.random.randint(0, 2, n_samples),
        'SHORTNESS_OF_BREATH': np.random.randint(0, 2, n_samples),
        'SWALLOWING_DIFFICULTY': np.random.randint(0, 2, n_samples),
        'CHEST_PAIN': np.random.randint(0, 2, n_samples),
    }
    
    df = pd.DataFrame(data)
    
    # Generate Target 'LUNG_CANCER' based on some rules (to make the model learn something useful)
    # Rule: High risk if Smoking + Coughing + Chest Pain
    # Rule: Age > 60 increases risk
    
    def calculate_risk(row):
        score = 0
        score += row['SMOKING'] * 2
        score += row['COUGHING'] * 1.5
        score += row['CHEST_PAIN'] * 1.5
        score += row['SWALLOWING_DIFFICULTY'] * 1.5
        score += row['WHEEZING'] * 1.0
        score += 1 if row['AGE'] > 60 else 0
        score += row['CHRONIC_DISEASE'] * 1.0
        
        # Random noise
        noise = np.random.normal(0, 1)
        final_score = score + noise
        
        return 1 if final_score > 3.5 else 0 # 1 = Cancer, 0 = No Cancer

    df['LUNG_CANCER'] = df.apply(calculate_risk, axis=1)
    
    return df

print("Generating synthetic dataset...")
df = generate_synthetic_data(2000)

# 3. Train Random Forest Model
X = df[FEATURES]
y = df['LUNG_CANCER']

print("Training Random Forest Classifier...")
clf = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
clf.fit(X, y)

print(f"Model Accuracy (on synthetic training data): {clf.score(X, y):.4f}")

# 4. Convert to ONNX
# We need to define the input types. 
# Although our inputs are mostly integers, ONNX often handles floats easier forprobabilities
# Let's specify Int64 for all since they are categorical/integers.
initial_type = [('float_input', FloatTensorType([None, len(FEATURES)]))] # Use Float for broad compatibility

# We need to cast X to float32 for the conversion to match the initial_type
X_float = X.astype(np.float32)
clf.fit(X_float, y) # Re-fit on float data to ensure schema match

print("Converting to ONNX...")
onx = convert_sklearn(clf, initial_types=initial_type, target_opset=12)

# 5. Save Model to Frontend Public Folder
output_path = os.path.join("..", "frontend", "public", "lung_cancer_model.onnx")
# Ensure the directory exists (relative to where script is run)
# We assume script is run from 'd:/bk/lung cancer/ai_training' or 'd:/bk/lung cancer'
# We will save absolute path to be safe.
abs_output_path = r"d:/bk/lung cancer/frontend/public/lung_cancer_model.onnx"

with open(abs_output_path, "wb") as f:
    f.write(onx.SerializeToString())

print(f"✅ Model saved to: {abs_output_path}")
