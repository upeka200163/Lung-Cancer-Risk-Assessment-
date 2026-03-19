# 🏥 Lung Cancer Risk Assessment System

## Overview
An AI-powered web application for early detection and risk assessment of lung cancer based on clinical symptoms and lifestyle factors. This tool provides instant risk analysis and personalized health recommendations.

---

## 🎯 Project Purpose

Lung cancer is one of the leading causes of cancer-related deaths worldwide. Early detection significantly improves survival rates. This application aims to:

- Provide accessible preliminary risk screening
- Educate users about lung cancer risk factors
- Encourage high-risk individuals to seek professional medical evaluation
- Leverage AI for personalized health guidance

**⚠️ IMPORTANT:** This is an educational tool, NOT a medical diagnosis system. Always consult healthcare professionals for proper evaluation.

---

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- **React 19** with Vite for fast development
- **Tailwind CSS** for modern, responsive UI
- **JavaScript (ES6+)** for application logic

**AI Integration:**
- **Google Gemini API** for generating personalized health advice

**No Backend Required:**
- 100% client-side application
- No server costs
- Instant deployment to static hosting (Vercel, Netlify, etc.)

---

## 🧮 Risk Calculation Logic

### Algorithm Overview

The system uses a **weighted scoring algorithm** based on clinical research and established risk factors for lung cancer. Each symptom and factor is assigned a point value based on its correlation with lung cancer risk.

### Scoring System (Total: 100 points)

#### 1. **Age Factor** (0-20 points)
Age is a significant risk factor for lung cancer:
```
Age > 60:  20 points
Age > 50:  15 points
Age > 40:  10 points
Age > 30:   5 points
Age ≤ 30:   0 points
```

**Rationale:** Lung cancer incidence increases significantly after age 50, with peak occurrence in the 65-75 age range.

---

#### 2. **Critical Symptoms** (High Weight: 67 points total)

These are primary indicators strongly associated with lung cancer:

| Symptom | Points | Clinical Significance |
|---------|--------|----------------------|
| **Smoking** | 25 | Strongest risk factor; 85-90% of lung cancers are smoking-related |
| **Persistent Coughing** | 15 | Common early symptom, especially if lasting >3 weeks |
| **Chest Pain** | 15 | May indicate tumor growth or pleural involvement |
| **Shortness of Breath** | 12 | Suggests airway obstruction or pleural effusion |

**Total Critical Symptoms:** 67 points

---

#### 3. **Secondary Symptoms** (Medium Weight: 22 points total)

These symptoms support the diagnosis but are less specific:

| Symptom | Points | Clinical Significance |
|---------|--------|----------------------|
| **Swallowing Difficulty** | 8 | May indicate esophageal compression by tumor |
| **Yellow Fingers** | 7 | Nicotine staining; indirect smoking indicator |
| **Chronic Disease** | 7 | Pre-existing conditions increase susceptibility |
| **Fatigue** | 5 | Common in advanced stages |

**Total Secondary Symptoms:** 27 points (capped at 22 in implementation)

---

#### 4. **Lifestyle & Environmental Factors** (Low Weight: 12 points total)

Contributing factors that increase overall risk:

| Factor | Points | Clinical Significance |
|--------|--------|----------------------|
| **Alcohol Consumption** | 5 | Synergistic effect with smoking |
| **Anxiety** | 3 | May delay seeking medical care |
| **Peer Pressure** | 2 | Social smoking influence |
| **Allergy** | 2 | Chronic inflammation factor |

**Total Lifestyle Factors:** 12 points

---

### Risk Level Classification

The total score is converted to a **percentage** and classified into three risk categories:

```javascript
Total Score → Percentage = (Score / 100) × 100

Risk Levels:
- Low Risk:      0% - 34%   (Green)
- Moderate Risk: 35% - 59%  (Yellow)
- High Risk:     60% - 100% (Red)
```

#### Risk Level Definitions:

| Level | Range | Meaning | Recommended Action |
|-------|-------|---------|-------------------|
| **Low Risk** | 0-34% | Minimal concerning symptoms | Maintain healthy lifestyle, routine check-ups |
| **Moderate Risk** | 35-59% | Some risk factors present | Consult primary care physician, monitor symptoms |
| **High Risk** | 60-100% | Multiple significant risk factors | **Immediate medical evaluation**, consider LDCT scan |

---

## 📊 Example Calculations

### Example 1: High Risk Patient
```
Patient Profile:
- Age: 65 (20 points)
- Smoking: Yes (25 points)
- Coughing: Yes (15 points)
- Chest Pain: Yes (15 points)
- Shortness of Breath: Yes (12 points)
- Chronic Disease: Yes (7 points)

Total Score: 94 points
Risk Percentage: 94%
Classification: HIGH RISK ⚠️
```

### Example 2: Low Risk Patient
```
Patient Profile:
- Age: 28 (0 points)
- Smoking: No (0 points)
- Coughing: No (0 points)
- Chest Pain: No (0 points)
- Anxiety: Yes (3 points)
- Allergy: Yes (2 points)

Total Score: 5 points
Risk Percentage: 5%
Classification: LOW RISK ✅
```

### Example 3: Moderate Risk Patient
```
Patient Profile:
- Age: 52 (15 points)
- Smoking: Yes (25 points)
- Alcohol: Yes (5 points)
- Fatigue: Yes (5 points)

Total Score: 50 points
Risk Percentage: 50%
Classification: MODERATE RISK ⚡
```

---

## 🤖 AI Integration (Gemini API)

After calculating the numerical risk score, the system calls **Google Gemini 1.5 Flash** to generate:

1. **Personalized Health Advice** based on the patient's specific symptoms
2. **Contextual Recommendations** (lifestyle changes, when to see a doctor)
3. **Educational Information** about the risk factors present

### API Flow:
```
User Submits Form
    ↓
Calculate Risk Score (Client-Side)
    ↓
Display Numerical Result
    ↓
Call Gemini API with Patient Data
    ↓
Display AI-Generated Advice
```

**API Configuration:**
- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`
- Method: POST
- Authentication: API Key (stored in `.env`)

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+ and npm
- Google Gemini API Key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation Steps

1. **Clone the repository:**
```bash
cd "d:/bk/lung cancer"
```

2. **Install dependencies:**
```bash
cd frontend
npm install
```

3. **Configure Gemini API:**
Create a `.env` file in the `frontend` folder:
```env
VITE_GEMINI_API_KEY=your_api_key_here
```

4. **Run the development server:**
```bash
npm run dev
```

5. **Open in browser:**
```
http://localhost:5173
```

---

## 📁 Project Structure

```
lung cancer/
├── frontend/
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   └── QuestionnaireForm.jsx  # Main form & logic
│   │   ├── utils/
│   │   │   └── gemini.js              # Gemini API integration
│   │   ├── App.jsx                     # Main app component
│   │   └── index.css                   # Tailwind styles
│   ├── .env                            # API keys (not committed)
│   ├── package.json
│   └── vite.config.js
├── train_model.py           # (Optional) ML model training script
├── implementation_plan.md   # Original project plan
└── README.md               # This file
```

---

## 🎨 Features

### User Interface
- ✅ Clean, medical-grade design with gradient backgrounds
- ✅ Responsive layout (mobile, tablet, desktop)
- ✅ Interactive Yes/No toggles for symptoms
- ✅ Real-time form validation
- ✅ Animated result display with progress bar
- ✅ Color-coded risk levels (Green/Yellow/Red)

### Functionality
- ✅ Instant risk calculation (no loading time)
- ✅ Detailed risk breakdown
- ✅ Personalized recommendations per risk level
- ✅ AI-generated health advice
- ✅ Medical disclaimer prominently displayed
- ✅ "Start New Assessment" to reset

---

## 🔬 Clinical Basis

This risk assessment is based on established medical research:

### Key Risk Factors (Source: WHO, American Cancer Society)

1. **Smoking:** 
   - Accounts for 85-90% of lung cancer cases
   - Risk increases with duration and intensity

2. **Age:**
   - Median age of diagnosis: 70 years
   - Rare before age 40

3. **Symptoms:**
   - Persistent cough (>3 weeks)
   - Hemoptysis (coughing blood)
   - Chest pain
   - Dyspnea (shortness of breath)
   - Weight loss and fatigue

4. **Environmental Factors:**
   - Secondhand smoke exposure
   - Occupational exposures (asbestos, radon)
   - Air pollution

---

## 🚨 Limitations

1. **Not a Diagnostic Tool:** This system provides risk estimation only, not medical diagnosis.
2. **Simplified Model:** Real clinical assessment involves imaging (CT scans), biopsies, and comprehensive medical history.
3. **Self-Reported Data:** Accuracy depends on honest and accurate user input.
4. **No Medical History:** Does not account for family history, genetic factors, or previous medical conditions beyond what's asked.

---

## 🛡️ Privacy & Security

- **No Data Storage:** All calculations happen in the browser; no data is sent to our servers.
- **API Calls:** Only anonymized symptom data is sent to Gemini API for advice generation.
- **No Personal Identifiable Information (PII):** The app does not collect names, addresses, or contact information.

---

## 📈 Future Enhancements

- [ ] PDF report generation for doctor consultations
- [ ] Multi-language support (Tamil, Hindi, Spanish, etc.)
- [ ] Integration with telemedicine platforms
- [ ] Historical tracking (with user consent and local storage)
- [ ] Educational resources library
- [ ] Comparison with population statistics

---

## 📚 References

1. World Health Organization (WHO) - Lung Cancer Statistics
2. American Cancer Society - Lung Cancer Risk Factors
3. National Cancer Institute - Early Detection Research
4. Research Paper: "Early Detection of Lung Cancer Using Predictive Modeling Incorporating CTGAN Features and Tree-Based Learning" (2025)

---

## 📄 License

This project is for educational purposes. Not licensed for commercial medical use.

---

## 👨‍⚕️ Disclaimer

**THIS SOFTWARE IS PROVIDED "AS IS" FOR EDUCATIONAL PURPOSES ONLY.**

This application is NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read or calculated using this tool.

If you think you may have a medical emergency, call your doctor or emergency services immediately.

---


