// Live Google Gemini AI Agent & Persona Engine

import { Storage } from './storage.js';

export const AgentLogic = {
  getApiKey() {
    const settings = Storage.getSettings();
    return settings.apiKey || '';
  },

  getMorningGreeting(profile, hasCheckedInToday) {
    const name = profile.name || 'Assaf';
    const hour = new Date().getHours();
    let timeOfDay = 'morning';
    if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
    if (hour >= 17) timeOfDay = 'evening';

    if (hasCheckedInToday) {
      return {
        text: `Hey ${name}, good ${timeOfDay}! We've already set today's plan. How is your day going so far? Feel free to ask me to adjust today's workout, swap exercises, or add recovery stretching!`,
        quickChips: ['Show today\'s plan', 'I feel more tired now', 'Change today to 15 mins', 'Stretching routine']
      };
    }

    return {
      text: `Good ${timeOfDay}, ${name}! 👋 I'm your adaptive Gemini AI coach. Let's align today's schedule and check how your body is feeling. 
      \nDo you have 15-30 minutes for a session today, or any external sports planned (like tennis, soccer, or running)?`,
      quickChips: [
        '⚡ Start Daily Check-in',
        'Got 15 mins today',
        'Playing sports today',
        'Need a recovery day'
      ]
    };
  },

  async processUserMessage(messageText, checkIn, profile, currentPlan, conversationHistory = []) {
    const apiKey = this.getApiKey();

    if (!apiKey) {
      return {
        type: 'TEXT',
        text: `⚠️ **Gemini API Key Required**: To have a full-blown AI conversation and dynamic plan adjustments powered by Gemini, please click **🔑 Gemini Key** in the header to enter your free Google Gemini API key!`,
        quickChips: ['🔑 Set Gemini Key', '⚡ Start Daily Check-in']
      };
    }

    try {
      const systemInstruction = `You are an expert, empathetic, evidence-based AI Adaptive Home Fitness & Recovery Coach.
Your user is ${profile.name || 'Assaf'}.
Core philosophy: 100% adaptive, daily readiness, zero rigid calendar schedules, injury/burnout prevention, and recovery prioritization.

User Profile:
- Age: ${profile.age}, Height: ${profile.heightCm}cm, Weight: ${profile.weightKg}kg
- Fitness Level: ${profile.fitnessLevel}
- Available Equipment: ${profile.equipment.join(', ')}
- Favorite External Sports: ${profile.sports.join(', ')}

Today's Check-in Data:
${checkIn ? JSON.stringify(checkIn) : 'No check-in completed yet today.'}

Current Active Plan:
${currentPlan ? JSON.stringify(currentPlan) : 'None'}

User Message: "${messageText}"

CRITICAL: You MUST respond ONLY with a valid JSON object matching this exact schema (no markdown formatting around the JSON):
{
  "speech": "Your natural, encouraging, conversational response directly addressing the user's message and explaining any adjustments.",
  "quickChips": ["3-4 contextual follow-up quick reply options"],
  "updatedPlan": {
    "type": "Workout Type (e.g. Express Calisthenics, Active Recovery, Sports Support, Running HIIT)",
    "title": "Title of today's plan",
    "summary": "Brief summary",
    "readinessScore": 85,
    "estimatedMinutes": 20,
    "aiAdvice": "Targeted coach advice for today",
    "routines": [
      {
        "name": "Routine Block Name",
        "description": "Routine description",
        "exercises": [
          {
            "name": "Exercise Name",
            "defaultSets": 3,
            "defaultReps": 12,
            "defaultDurationSec": 0,
            "restSec": 45,
            "tips": "Form tip"
          }
        ]
      }
    ]
  }
}`;

      // Call Google Gemini REST API (gemini-2.5-flash or fallback gemini-1.5-flash)
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemInstruction }] }]
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `Gemini API returned status ${response.status}`);
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      // Clean markdown code fence if returned
      const jsonText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(jsonText);

      return {
        type: 'TEXT',
        text: parsed.speech || "I've updated your plan based on our conversation!",
        quickChips: parsed.quickChips || ['Show today\'s plan', 'I feel more tired now'],
        updatedPlan: parsed.updatedPlan || null
      };

    } catch (err) {
      console.error('Error calling Gemini API:', err);
      return {
        type: 'TEXT',
        text: `⚠️ **Gemini AI Connection Error**: ${err.message}. Please check your API key or network connection.`,
        quickChips: ['🔑 Check Gemini Key', 'Retry message']
      };
    }
  }
};
