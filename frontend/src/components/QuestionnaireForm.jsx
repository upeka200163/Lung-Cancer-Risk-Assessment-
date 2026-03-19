import { useState } from 'react';
import { generateHealthAdvice } from '../utils/gemini';

const FEATURE_LABELS = {
    AGE: "Age",
    GENDER: "Gender",
    SMOKING: "Smoking",
    YELLOW_FINGERS: "Yellow Fingers",
    ANXIETY: "Anxiety",
    PEER_PRESSURE: "Peer Pressure",
    CHRONIC_DISEASE: "Chronic Disease",
    FATIGUE: "Fatigue",
    ALLERGY: "Allergy",
    WHEEZING: "Wheezing",
    ALCOHOL_CONSUMING: "Alcohol Consuming",
    COUGHING: "Coughing",
    SHORTNESS_OF_BREATH: "Shortness of Breath",
    SWALLOWING_DIFFICULTY: "Swallowing Difficulty",
    CHEST_PAIN: "Chest Pain"
};

const QuestionnaireForm = () => {
    const [formData, setFormData] = useState({
        GENDER: 'M',
        AGE: '',
        SMOKING: 0,
        YELLOW_FINGERS: 0,
        ANXIETY: 0,
        PEER_PRESSURE: 0,
        CHRONIC_DISEASE: 0,
        FATIGUE: 0,
        ALLERGY: 0,
        WHEEZING: 0,
        ALCOHOL_CONSUMING: 0,
        COUGHING: 0,
        SHORTNESS_OF_BREATH: 0,
        SWALLOWING_DIFFICULTY: 0,
        CHEST_PAIN: 0
    });

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [aiAdvice, setAiAdvice] = useState("");
    const [loadingAdvice, setLoadingAdvice] = useState(false);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value) || 0 : value
        }));
    };

    const handleToggle = (name, val) => {
        setFormData(prev => ({
            ...prev,
            [name]: val
        }));
    };

    // Simple Risk Calculation Algorithm
    const calculateRisk = (data) => {
        let riskScore = 0;
        let maxScore = 100;

        // Age Factor (0-20 points)
        const age = parseInt(data.AGE) || 0;
        if (age > 60) riskScore += 20;
        else if (age > 50) riskScore += 15;
        else if (age > 40) riskScore += 10;
        else if (age > 30) riskScore += 5;

        // Critical Symptoms (High Weight)
        if (data.SMOKING) riskScore += 25;
        if (data.COUGHING) riskScore += 15;
        if (data.CHEST_PAIN) riskScore += 15;
        if (data.SHORTNESS_OF_BREATH) riskScore += 12;
        if (data.WHEEZING) riskScore += 10;

        // Secondary Symptoms (Medium Weight)
        if (data.SWALLOWING_DIFFICULTY) riskScore += 8;
        if (data.YELLOW_FINGERS) riskScore += 7;
        if (data.CHRONIC_DISEASE) riskScore += 7;
        if (data.FATIGUE) riskScore += 5;

        // Lifestyle Factors (Lower Weight)
        if (data.ALCOHOL_CONSUMING) riskScore += 5;
        if (data.ANXIETY) riskScore += 3;
        if (data.PEER_PRESSURE) riskScore += 2;
        if (data.ALLERGY) riskScore += 2;

        // Calculate percentage
        const percentage = Math.min((riskScore / maxScore) * 100, 100);

        // Determine risk level
        let riskLevel = "Low Risk";
        if (percentage >= 60) riskLevel = "High Risk";
        else if (percentage >= 35) riskLevel = "Moderate Risk";

        return {
            percentage: percentage.toFixed(1),
            level: riskLevel,
            score: riskScore
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Calculate risk
            const risk = calculateRisk(formData);

            setResult({
                prediction: risk.level,
                probability: risk.percentage / 100,
                percentage: risk.percentage
            });

            // Generate AI Advice (non-blocking)
            setLoadingAdvice(true);
            const patientData = {
                AGE: parseInt(formData.AGE) || 0,
                GENDER: formData.GENDER === 'M' ? 1 : 0,
                SMOKING: formData.SMOKING,
                COUGHING: formData.COUGHING,
                CHEST_PAIN: formData.CHEST_PAIN,
                SHORTNESS_OF_BREATH: formData.SHORTNESS_OF_BREATH,
                CHRONIC_DISEASE: formData.CHRONIC_DISEASE
            };

            // Don't await - let it load in background
            generateHealthAdvice(risk.level, patientData)
                .then(advice => {
                    setAiAdvice(advice || "AI analysis unavailable at this time.");
                    setLoadingAdvice(false);
                })
                .catch(err => {
                    console.error("AI advice generation failed:", err);
                    setAiAdvice("AI analysis unavailable at this time.");
                    setLoadingAdvice(false);
                });

        } catch (e) {
            console.error("Calculation failed", e);
        } finally {
            setLoading(false);
        }
    };

    const YesNoToggle = ({ name, label, value }) => (
        <div className="flex flex-col space-y-2 p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <span className="font-medium text-gray-700">{label}</span>
            <div className="flex space-x-2">
                <button
                    type="button"
                    onClick={() => handleToggle(name, 0)}
                    className={`flex-1 py-2 rounded-md transition-all ${value === 0 ? 'bg-green-100 text-green-700 font-bold border-2 border-green-400' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                >
                    No
                </button>
                <button
                    type="button"
                    onClick={() => handleToggle(name, 1)}
                    className={`flex-1 py-2 rounded-md transition-all ${value === 1 ? 'bg-red-100 text-red-700 font-bold border-2 border-red-400' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                >
                    Yes
                </button>
            </div>
        </div>
    );

    return (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/50">
            {result ? (
                <div className="text-center py-10">
                    <div className={`text-6xl mb-6 animate-bounce ${result.prediction === 'High Risk' ? 'text-red-500' :
                        result.prediction === 'Moderate Risk' ? 'text-yellow-500' :
                            'text-green-500'
                        }`}>
                        {result.prediction === 'High Risk' ? '⚠️' :
                            result.prediction === 'Moderate Risk' ? '⚡' :
                                '✅'}
                    </div>

                    <h2 className="text-4xl font-bold text-gray-800 mb-2">{result.prediction}</h2>
                    <p className="text-2xl text-gray-600 mb-6">Risk Score: {result.percentage}%</p>

                    <div className="w-full bg-gray-200 rounded-full h-4 mb-8">
                        <div
                            className={`h-4 rounded-full transition-all duration-1000 ${result.prediction === 'High Risk' ? 'bg-red-500' :
                                result.prediction === 'Moderate Risk' ? 'bg-yellow-500' :
                                    'bg-green-500'
                                }`}
                            style={{ width: `${result.percentage}%` }}
                        ></div>
                    </div>

                    <div className="mt-8 space-y-4">
                        {result.prediction === 'High Risk' ? (
                            <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-6 text-left">
                                <h3 className="text-red-800 font-bold text-lg mb-3">⚠️ Immediate Actions Recommended:</h3>
                                <ul className="list-disc list-inside text-red-700 space-y-2">
                                    <li>Schedule an appointment with a pulmonologist immediately</li>
                                    <li>Consider a Low-Dose CT Scan (LDCT) for early detection</li>
                                    <li>Monitor persistent symptoms (cough, chest pain, breathing issues)</li>
                                    <li>If you smoke, seek cessation support urgently</li>
                                </ul>
                            </div>
                        ) : result.prediction === 'Moderate Risk' ? (
                            <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-xl p-6 text-left">
                                <h3 className="text-yellow-800 font-bold text-lg mb-3">⚡ Precautionary Measures:</h3>
                                <ul className="list-disc list-inside text-yellow-700 space-y-2">
                                    <li>Consult with your primary care physician</li>
                                    <li>Monitor your symptoms closely</li>
                                    <li>Consider lifestyle modifications (quit smoking, reduce alcohol)</li>
                                    <li>Schedule regular health check-ups</li>
                                </ul>
                            </div>
                        ) : (
                            <div className="bg-green-50 border-l-4 border-green-500 rounded-xl p-6 text-left">
                                <h3 className="text-green-800 font-bold text-lg mb-3">✅ Good News:</h3>
                                <p className="text-green-700">Your risk profile appears low based on the provided inputs. Continue maintaining a healthy lifestyle with regular exercise, balanced diet, and avoid smoking.</p>
                            </div>
                        )}
                    </div>

                    {aiAdvice && (
                        <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl text-left shadow-sm">
                            <h3 className="flex items-center text-blue-800 font-bold text-lg mb-3">
                                ✨ AI Doctor's Analysis
                                {loadingAdvice && <span className="ml-2 text-sm font-normal text-blue-600 animate-pulse">(Generating...)</span>}
                            </h3>
                            <div className="text-blue-900 leading-relaxed whitespace-pre-line">
                                {loadingAdvice ? "Analyzing your health profile to provide personalized advice..." : aiAdvice}
                            </div>
                        </div>
                    )}

                    <div className="mt-8">
                        <button
                            onClick={() => { setResult(null); setAiAdvice(""); }}
                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition shadow-lg transform hover:scale-105"
                        >
                            Start New Assessment
                        </button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {/* Demographics */}
                        <div className="md:col-span-2 lg:col-span-3 pb-4 border-b-2 border-blue-100 mb-4">
                            <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center">
                                <span className="mr-2">👤</span> Patient Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col space-y-2">
                                    <label className="font-semibold text-gray-700">Age *</label>
                                    <input
                                        type="number"
                                        name="AGE"
                                        value={formData.AGE}
                                        onChange={handleChange}
                                        required
                                        min="1"
                                        max="120"
                                        placeholder="Enter your age"
                                        className="p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    />
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <label className="font-semibold text-gray-700">Gender *</label>
                                    <select
                                        name="GENDER"
                                        value={formData.GENDER}
                                        onChange={handleChange}
                                        className="p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    >
                                        <option value="M">Male</option>
                                        <option value="F">Female</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Health Factors */}
                        <div className="md:col-span-2 lg:col-span-3">
                            <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center">
                                <span className="mr-2">🏥</span> Health & Lifestyle Assessment
                            </h3>
                        </div>

                        {Object.keys(FEATURE_LABELS).map((key) => {
                            if (key === 'AGE' || key === 'GENDER') return null;
                            return (
                                <YesNoToggle
                                    key={key}
                                    name={key}
                                    label={FEATURE_LABELS[key]}
                                    value={formData[key]}
                                />
                            );
                        })}
                    </div>

                    <div className="flex justify-end pt-6 border-t-2 border-gray-100">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-10 py-4 rounded-xl font-bold text-white shadow-xl transform transition hover:scale-105 active:scale-95 ${loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                                }`}
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Analyzing...
                                </span>
                            ) : (
                                '🔍 Calculate Risk'
                            )}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default QuestionnaireForm;
