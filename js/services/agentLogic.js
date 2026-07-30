// Bare-Bones Google Gemini AI Coach Engine with No-History Low Form Edge Case

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

    // Fetch all completed workout logs
    const allLogs = Storage.getWorkoutLogs();
    const today = new Date();
    
    let daysSinceLastWorkout = null;
    let sessionsInLast7Days = 0;
    let sessionsInLast30Days = 0;
    let isNoHistoryFirstSession = false;

    if (!allLogs || allLogs.length === 0) {
      isNoHistoryFirstSession = true;
    } else {
      const lastWorkoutDate = new Date(allLogs[0].timestamp || allLogs[0].date);
      const diffTime = Math.abs(today - lastWorkoutDate);
      daysSinceLastWorkout = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      sessionsInLast7Days = allLogs.filter(l => new Date(l.timestamp || l.date) >= sevenDaysAgo).length;
      sessionsInLast30Days = allLogs.filter(l => new Date(l.timestamp || l.date) >= thirtyDaysAgo).length;
    }

    const recentLogsFormatted = allLogs.slice(0, 7).map(l => ({
      date: l.date,
      title: l.title,
      type: l.type,
      durationMin: l.durationMin || l.estimatedMinutes || 15
    }));

    const systemPromptText = `You are Assaf's dedicated, empathetic, evidence-based AI Adaptive Home Fitness & Recovery Coach.

Assaf's Profile & Life Context:
- Name: Assaf
- Age: 40 years old | Height: 1.85 m | Weight: 85 kg
- Life Context: Busy family man needing a flexible daily coach.
- Primary Modalities: Calisthenics (bodyweight/core/mobility), Rope Skipping (Jump Rope HIIT/stamina), Outdoor Running.
- Long-Term Goals: Tennis footwork/stamina, Snowboard quad/glute/knee prep, Weight maintenance around 85kg.

DATED TRAINING DENSITY & FORM ASSESSMENT:
- Has Completed History Logs: ${isNoHistoryFirstSession ? 'NO (First-time user or empty history)' : 'YES'}
- Days Since Last Logged Workout: ${daysSinceLastWorkout !== null ? daysSinceLastWorkout + ' days ago' : 'N/A (No history)'}
- Workouts Completed (Last 7 Days): ${sessionsInLast7Days} sessions
- Workouts Completed (Last 30 Days): ${sessionsInLast30Days} sessions
- Recent Dated History: ${JSON.stringify(recentLogsFormatted)}

AUTOMATIC FORM & LOAD ADAPTATION RULES:
1. INITIAL NO-HISTORY EDGE CASE (First session / empty history):
   - ${isNoHistoryFirstSession ? 'CRITICAL: ASSUME LOW INITIAL FORM & CONSERVATIVE BASELINE. Generate an easy 15-20 min ramp-up routine focused on mobility, core stability, and gentle calisthenics/jump rope. Explicitly state in "speech": "Welcome Assaf! Since this is our first logged session together, we are starting with a gentle baseline routine to assess your form and protect your joints."' : 'Not applicable.'}

2. INACTIVITY GAP (7+ days since last workout):
   - If daysSinceLastWorkout >= 7: Assaf is "Ramping Back Up". Reduce intensity & volume by ~30%. Focus on dynamic mobility, smooth calisthenics, or light jump rope. Mention in "speech": "Since it has been ${daysSinceLastWorkout} days since your last session, today we are easing back in to protect your joints and prevent injury."

3. HIGH DENSITY (3+ workouts in last 4 days):
   - Prioritize active recovery, shoulder/hip mobility, or light skill work.

4. CONSISTENT TRAINING (2-4 workouts per week):
   - Deliver full progressive overload tailored to tennis & snowboard goals.

CONVERSATION & READINESS PROTOCOL:
1. IF Assaf gives a simple greeting (e.g., "hi", "hello") OR has NOT yet shared how his body feels or his available time today:
   - DO NOT generate a workout plan yet. Set "updatedPlan": null.
   - Warmly greet Assaf, mention your assessment of his training status (e.g. first session baseline or days break), and ask for today's inputs (body feeling & available minutes).
   - Provide 3-4 quickChips for time/readiness.

2. ONLY IF Assaf provides specific daily inputs:
   - Generate or update "updatedPlan" scaled appropriately for his form assessment.

Current Active Plan:
${currentPlan ? JSON.stringify(currentPlan) : 'None'}

User Message: "${messageText}"

You MUST respond ONLY with a valid JSON object matching this exact schema:
{
  "speech": "Your natural response directly addressing Assaf, acknowledging his baseline/form status when relevant.",
  "quickChips": ["3-4 contextual follow-up quick reply options"],
  "updatedPlan": null OR {
    "type": "Workout Type (e.g. Baseline Calisthenics Primer, Ramp-Up Session, Snowboard Leg Primer, Active Recovery)",
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
        quickChips: parsed.quickChips || ['Got 20 mins & feeling good', 'Gentle baseline start (15 mins)', 'Playing tennis today'],
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
