// Bare-Bones Single Model Google Gemini AI Coach Engine with Workout History & Rope Skipping

import { Storage } from './storage.js';

export const AgentLogic = {
  getApiKey() {
    const settings = Storage.getSettings();
    return (settings.apiKey || '').trim();
  },

  getMorningGreeting() {
    const hour = new Date().getHours();
    let timeOfDay = 'morning';
    if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
    if (hour >= 17) timeOfDay = 'evening';

    return {
      text: `Good ${timeOfDay}, Assaf! 👋 How is your body feeling today, and how much time do you have for a session?`,
      quickChips: [
        'Got 15 mins & feeling good',
        'Got 30 mins (Rope & Calisthenics)',
        'Playing tennis today',
        'Snowboard leg prep'
      ]
    };
  },

  async processUserMessage(messageText, checkIn, profile, currentPlan, conversationHistory = []) {
    const apiKey = this.getApiKey();

    if (!apiKey) {
      return {
        type: 'TEXT',
        text: `⚠️ **Gemini API Key Required**: Please click **🔑 Key & Settings** in the header to enter your free Google Gemini API key!`,
        quickChips: ['🔑 Set Gemini Key']
      };
    }

    // Fetch recent completed workout logs (last 5 sessions) for intelligent routine diversification
    const recentLogs = Storage.getWorkoutLogs().slice(0, 5);

    const systemPromptText = `You are Assaf's dedicated, empathetic, evidence-based AI Adaptive Home Fitness & Recovery Coach.

Assaf's Profile & Life Context:
- Name: Assaf
- Age: 40 years old | Height: 1.85 m | Weight: 85 kg
- Life Context: Busy family man needing a flexible daily coach.
- Primary Fitness Modalities: 
  1. Calisthenics (bodyweight strength, core, pull-ups, push-ups, dips, mobility)
  2. Rope Skipping (Jump Rope HIIT, footwork stamina, calf/ankle resilience)
  3. Outdoor Running (endurance, tempo runs)

Assaf's Long-Term Goals:
1. Tennis Performance: Enhance footwork agility, rotational core power, leg stamina, and shoulder joint health.
2. Snowboard Trip Prep: Build quad & glute endurance, knee joint resilience, ankle stability, and core rotation for an upcoming snowboard trip.
3. Weight & Health Management: Maintain weight around 85kg with lean muscle preservation.

ROUTINE DIVERSITY & RECENT WORKOUT HISTORY:
Assaf's Last 5 Completed Sessions:
${recentLogs.length > 0 ? JSON.stringify(recentLogs.map(l => ({ date: l.date, title: l.title, type: l.type }))) : 'No recent sessions logged yet.'}

Use this workout history to DIVERSIFY today's training! Avoid repeating the exact same routine blocks or muscle groups from yesterday. Balance Calisthenics, Rope Skipping, and Mobility across the week.

CONVERSATION & READINESS PROTOCOL:
1. IF Assaf gives a simple greeting (e.g., "hi", "hello", "good morning") OR has NOT yet shared how his body feels or his available time today:
   - DO NOT generate a workout plan yet. Set "updatedPlan": null.
   - In "speech", warmly greet Assaf and ask for his daily inputs: how his body is feeling today (energy/soreness) and how much time he has for a session.
   - Provide 3-4 quickChips for time/readiness.

2. ONLY IF Assaf provides specific daily inputs (e.g., available minutes, energy level, soreness, or asks for a routine):
   - Generate or update the "updatedPlan" object with a tailored routine.

Current Active Plan:
${currentPlan ? JSON.stringify(currentPlan) : 'None'}

User Message: "${messageText}"

You MUST respond ONLY with a valid JSON object matching this exact schema:
{
  "speech": "Your natural, encouraging response directly addressing Assaf. Explain how today's plan diversifies from recent workouts.",
  "quickChips": ["3-4 contextual follow-up quick reply options"],
  "updatedPlan": null OR {
    "type": "Workout Type (e.g. Calisthenics & Jump Rope HIIT, Snowboard Leg Primer, Tennis Agility & Footwork, Active Recovery)",
    "title": "Title of today's plan",
    "summary": "Brief summary",
    "readinessScore": 85,
    "estimatedMinutes": 20,
    "aiAdvice": "Targeted coach advice for Assaf",
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

    const model = 'gemini-3.6-flash';
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
        text: parsed.speech || "How is your body feeling today, Assaf?",
        quickChips: parsed.quickChips || ['Got 20 mins & feeling good', 'Jump Rope & Calisthenics', 'Playing tennis today'],
        updatedPlan: parsed.updatedPlan || null
      };
    } catch (err) {
      console.warn(`Model ${model} call failed:`, err.message);
      return {
        type: 'TEXT',
        text: `⚠️ **Gemini AI Error**: ${err.message}. Please check your API key by tapping 🔑 Key in the header.`,
        quickChips: ['🔑 Check Gemini Key']
      };
    }
  }
};
