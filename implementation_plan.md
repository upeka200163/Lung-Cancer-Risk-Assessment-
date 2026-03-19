# Project Implementation Plan: Lung Cancer Risk Prediction Web App

## 1. Project Overview
**Goal**: Build a web application that predicts the risk of lung cancer based on a questionnaire of symptoms and lifestyle factors.
**Reference**: "Early Detection of Lung Cancer Using Predictive Modeling Incorporating CTGAN Features and Tree-Based Learning"
**Core Logic**: Use a Random Forest Classifier trained on a dataset (augmented via CTGAN) to classify risk based on 15 tabular features.

---

## 2. Architecture & Tech Stack
This project will use a decoupled architecture: a Python backend for the ML inference and a React frontend for the user interface.

### **Frontend** (The User Interface)
- **Framework**: React (Vite) for fast performance.
- **Styling**: Tailwind CSS.
- **Design Aesthetic**: Modern, clean, "Medical Professional" look with Glassmorphism elements.
- **Key Screens**: 
  - **Landing/Form**: The questionnaire (15 questions).
  - **Result**: Risk Level (Low/Medium/High) + Confidence Score + Disclaimer.

### **Backend** (The Intelligence)
- **Framework**: FastAPI (Python) - chosen for automatic docs and speed.
- **ML Libraries**: 
  - `scikit-learn`: For the Random Forest model.
  - `pandas`: For data manipulation.
  - `joblib`: For saving/loading the trained model.
- **API Endpoints**:
  - `GET /`: Health check.
  - `POST /predict`: Receives JSON (symptoms), returns JSON (risk prediction).

### **Data & Model**
- **Features (15)**: Age, Gender, Smoking, Anxiety, Wheezing, Coughing, Chest Pain, Shortness of Breath, Alcohol, Chronic Disease, etc.
- **Dataset Strategy**: We will use a public Lung Cancer Dataset (likely the one from Kaggle that matches this exact schema: "Lung Cancer Prediction Dataset") to train our initial model.
- **Training**: A script will train the Random Forest model and save it as `lung_cancer_model.pkl`.

---

## 3. Step-by-Step Implementation Roadmap

### **Phase 1: Project Setup & Data Prep**
1.  **Initialize Git & Directories**: Create `backend` and `frontend` folders.
2.  **Dataset Acquisition**: Download/Create a CSV dataset matching the 15 features.
3.  **Model Training Script**: 
    - Write a Python script (`train_model.py`) to load data, preprocess (encode labels), train Random Forest, and save the `.pkl` file.
    - Run the script to generate the model artifact.

### **Phase 2: Backend API Development**
1.  **FastAPI Setup**: Create `main.py`.
2.  **Prediction Endpoint**: 
    - Define a Pydantic model for input validation (ensuring all 15 inputs are correct).
    - Load the `.pkl` model on startup.
    - Implement the logic to predict and return probability.
3.  **Testing**: Test via Swagger UI (`/docs`).

### **Phase 3: Frontend Development**
1.  **Vite Project**: `npm create vite@latest frontend`.
2.  **Tailwind Setup**: Configure Tailwind CSS.
3.  **Component Build**:
    - `QuestionnaireForm.jsx`: A mapped form for all 15 inputs (using select/radios).
    - `ResultModal.jsx`: To display the outcome nicely.
4.  **API Integration**: Use `fetch` or `axios` to send form data to the FastAPI backend.

### **Phase 4: Polish & Refinement**
1.  **UI Polish**: Add smooth transitions, better error handling, and the "Medical Disclaimer" (Critical).
2.  **Deployment Prep**: Create `requirements.txt` for backend and build scripts for frontend.

---

## 4. Feature List (Based on Paper)
- **Inputs**:
    1. Gender (M/F)
    2. Age (Numeric)
    3. Smoking (Yes/No)
    4. Yellow Fingers (Yes/No)
    5. Anxiety (Yes/No)
    6. Peer Pressure (Yes/No) 
    7. Chronic Disease (Yes/No)
    8. Fatigue (Yes/No)
    9. Allergy (Yes/No)
    10. Wheezing (Yes/No)
    11. Alcohol Consuming (Yes/No)
    12. Coughing (Yes/No)
    13. Shortness of Breath (Yes/No)
    14. Swallowing Difficulty (Yes/No)
    15. Chest Pain (Yes/No)

---

## 5. Next Step
**Approve this plan** and we will start with **Phase 1: Project Setup & Model Training**.
