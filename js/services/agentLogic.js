// Single Model Google Gemini AI Coach Engine (Verified Active Model: gemini-3.6-flash)

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
      text: `Good ${timeOfDay}, Assaf! 👋 I'm your adaptive Gemini AI coach. Tell me how your body feels today or how much time you have, and I'll tailor today's calisthenics/running routine for your tennis and snowboard prep!`,
      quickChips: [
        'Got 15 mins today',
        'Got 30 mins today',
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

    const systemPromptText = `You are Assaf's dedicated, empathetic, evidence-based AI Adaptive Home Fitness & Recovery Coach.

Assaf's Personal Profile & Life Context:
- Name: Assaf
- Age: 40 years old
- Height: 1.85 m (185 cm)
- Weight: 85 kg
- Life Context: Busy family man needing a highly flexible, realistic daily fitness coach. Zero rigid weekly calendar schedules.

Core Fitness Modalities:
- Primary: Calisthenics (bodyweight strength, core, pull-ups, push-ups, dips, mobility flow)
- Secondary: Outdoor running (stamina, HIIT intervals, tempo runs)

Assaf's Specific Long-Term Goals:
1. Tennis Performance: Enhance footwork agility, rotational core power, leg stamina, and shoulder joint health for tennis matches.
2. Snowboard Trip Preparation: Build quad & glute endurance, knee joint resilience, ankle stability, and core rotation for an upcoming snowboard trip.
3. Weight & Health Management: Maintain weight around 85 kg (or lose a few kilos naturally) while prioritizing lean muscle strength and joint longevity for a 40-year-old body.
4. Daily Dynamic Adaptation: Adjust every daily workout based strictly on Assaf's input (how he feels, soreness, energy level, and available time: 15m, 20m, 30m).

Current Active Plan:
${currentPlan ? JSON.stringify(currentPlan) : 'None'}

User Request: "${messageText}"

You MUST respond ONLY with a valid JSON object matching this exact schema:
{
  "speech": "Your natural, encouraging, conversational response directly addressing Assaf, referencing his goals (tennis/snowboard/calisthenics) when relevant, and explaining today's plan adjustments.",
  "quickChips": ["3-4 contextual follow-up quick reply options"],
  "updatedPlan": {
    "type": "Workout Type (e.g. Calisthenics Core & Upper, Snowboard Leg Primer, Tennis Agility, Active Recovery)",
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

    // Verified Active Active Google Gemini Model: gemini-3.6-flash
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
        text: parsed.speech || "I've updated your plan based on our conversation!",
        quickChips: parsed.quickChips || ['Show today\'s plan', 'I feel more tired now'],
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
