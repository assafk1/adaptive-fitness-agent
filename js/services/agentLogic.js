// Bare-Bones Google Gemini AI Coach Engine

import { Storage } from './storage.js';

export const AgentLogic = {
  getApiKey() {
    const settings = Storage.getSettings();
    return (settings.apiKey || '').trim();
  },

  getMorningGreeting(profile) {
    const name = profile.name || 'Assaf';
    const hour = new Date().getHours();
    let timeOfDay = 'morning';
    if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
    if (hour >= 17) timeOfDay = 'evening';

    return {
      text: `Good ${timeOfDay}, ${name}! 👋 I'm your adaptive Gemini AI coach. Tell me how your body feels today or how much time you have, and I'll build today's routine!`,
      quickChips: [
        'Got 15 mins today',
        'Got 30 mins today',
        'Playing sports today',
        'Need a recovery stretch'
      ]
    };
  },

  async processUserMessage(messageText, checkIn, profile, currentPlan, conversationHistory = []) {
    const apiKey = this.getApiKey();

    if (!apiKey) {
      return {
        type: 'TEXT',
        text: `⚠️ **Gemini API Key Required**: Please click **🔑 Gemini Key** in the header to enter your free Google Gemini API key!`,
        quickChips: ['🔑 Set Gemini Key']
      };
    }

    const systemPromptText = `You are an expert, empathetic, evidence-based AI Adaptive Home Fitness & Recovery Coach.
Your user is ${profile.name || 'Assaf'}.
Core philosophy: 100% adaptive, daily readiness, zero rigid calendar schedules, injury/burnout prevention, and recovery prioritization.

Current Active Plan:
${currentPlan ? JSON.stringify(currentPlan) : 'None'}

User Request: "${messageText}"

You MUST respond with a JSON object matching this exact schema:
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

    // Bare-bones: Stable Gemini 2.0 Flash
    const model = 'gemini-2.0-flash';
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const payload = {
        system_instruction: {
          parts: [{ text: systemPromptText }]
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: messageText }]
          }
        ],
        generationConfig: {
          response_mime_type: 'application/json'
        }
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || `API Error ${response.status}`);
      }

      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const jsonText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(jsonText);

      return {
        type: 'TEXT',
        text: parsed.speech || "I've updated your plan based on our conversation!",
        quickChips: parsed.quickChips || ['Show today\'s plan', 'I feel more tired now'],
        updatedPlan: parsed.updatedPlan || null
      };
    } catch (err) {
      console.warn(`Gemini call failed:`, err.message);
      return {
        type: 'TEXT',
        text: `⚠️ **Gemini AI Error**: ${err.message}. Please check your API key by tapping 🔑 Key in the header.`,
        quickChips: ['🔑 Check Gemini Key']
      };
    }
  }
};
