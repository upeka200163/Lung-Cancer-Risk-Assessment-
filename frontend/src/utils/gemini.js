const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export const generateHealthAdvice = async (riskLevel, patientData) => {
    console.log("Groq API Key loaded:", GROQ_API_KEY ? `${GROQ_API_KEY.substring(0, 15)}...` : "NOT SET");

    if (!GROQ_API_KEY || GROQ_API_KEY.length < 20) {
        console.error("Groq API key not configured properly");
        return "AI advice unavailable - API key not configured.";
    }

    try {
        const advice = await callGroqAPI(riskLevel, patientData);
        return advice || "Unable to generate AI advice at this time.";
    } catch (error) {
        console.error("Groq API failed:", error);
        return "Unable to generate AI advice at this time.";
    }
};

// Groq API Implementation (OpenAI-compatible endpoint)
const callGroqAPI = async (riskLevel, patientData) => {
    const prompt = `You are a compassionate lung health specialist. A patient completed a lung cancer risk assessment.

Patient Profile:
- Age: ${patientData.AGE} years
- Gender: ${patientData.GENDER === 1 ? 'Male' : 'Female'}
- Smoking: ${patientData.SMOKING ? 'Yes' : 'No'}
- Persistent Coughing: ${patientData.COUGHING ? 'Yes' : 'No'}
- Chest Pain: ${patientData.CHEST_PAIN ? 'Yes' : 'No'}
- Shortness of Breath: ${patientData.SHORTNESS_OF_BREATH ? 'Yes' : 'No'}
- Chronic Disease: ${patientData.CHRONIC_DISEASE ? 'Yes' : 'No'}

Risk Assessment Result: ${riskLevel}

Provide a brief, supportive medical analysis (max 100 words):
1. Explain what this risk level means
2. Recommend specific next steps (lifestyle changes, doctor consultation, screening tests)
3. Use cautious language ("may indicate", "consider", "suggest") - do NOT diagnose

Keep it professional, compassionate, and actionable.`;

    console.log("Calling Groq API...");

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
            messages: [
                {
                    role: "system",
                    content: "You are a compassionate medical AI assistant specializing in lung health and cancer risk assessment."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 200
        }),
    });

    console.log("Groq Response Status:", response.status);

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Groq API HTTP Error:", response.status, errorText);
        throw new Error(`Groq API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("Groq API Response:", data);

    if (data.error) {
        console.error("Groq API Error:", data.error);
        throw new Error(data.error.message || "Groq API error");
    }

    if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
        return data.choices[0].message.content;
    }

    console.error("Unexpected Groq response format:", data);
    throw new Error("Unexpected response format from Groq");
};
