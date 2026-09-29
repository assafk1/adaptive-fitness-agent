// Unconfined Google Gemini AI Coach Engine with Free Routine Generation & Explicit Unilateral Rules

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
- Name: Assaf | Age: 40 years old | Height: 1.85 m | Weight: 85 kg
- Life Context: Busy family man needing a flexible daily coach.
- Long-Term Goals: Tennis footwork/stamina, Snowboard quad/glute/knee prep, Weight maintenance around 85kg.

EQUIPMENT RESTRICTION:
Assaf does NOT have any Pull-up Bar or Parallel Bars! 
DO NOT prescribe any exercise requiring a pull-up bar, dip bar, or gymnastics rings.
Allowed Equipment ONLY: Floor / Yoga Mat, Chair / Bench, Jump Rope, Outdoor Running Shoes, Doorframe Iso Pulls.

FREE GENERATION INSTRUCTION:
You have complete freedom to prescribe ANY exercise, stretch, calisthenics movement, jump rope footwork, or mobility drill without restriction!

UNILATERAL EXERCISE SET & REP RULE (CRITICAL):
For ANY unilateral exercise or stretch (movements performed one leg, arm, or side at a time, such as Bulgarian Split Squats, Reverse Lunges, Single-Leg RDLs, Side Planks, Cossack Squats, 90/90 Hip Swivels, Pigeon Pose, Single-Leg Calf Raises, Doorframe Iso Pulls):
1. You MUST set "isUnilateral": true in the exercise object.
2. In "defaultReps" or "tips", EXPLICITLY specify the reps or duration PER SIDE (e.g., "10 reps per side", "30s hold per leg", or "3 sets x 10 reps EACH SIDE"). Never leave unilateral volume ambiguous!

DATED TRAINING DENSITY & FORM ASSESSMENT:
- Has Completed History Logs: ${isNoHistoryFirstSession ? 'NO (First-time user)' : 'YES'}
- Days Since Last Logged Workout: ${daysSinceLastWorkout !== null ? daysSinceLastWorkout + ' days ago' : 'N/A'}
- Workouts Completed (Last 7 Days): ${sessionsInLast7Days}
- Recent History: ${JSON.stringify(recentLogsFormatted)}

AUTOMATIC FORM & LOAD ADAPTATION RULES:
1. INITIAL NO-HISTORY EDGE CASE:
   - ${isNoHistoryFirstSession ? 'ASSUME LOW INITIAL FORM. Generate an easy 15-20 min ramp-up routine focused on mobility, core stability, and gentle floor calisthenics/jump rope.' : 'Not applicable.'}
2. INACTIVITY GAP (7+ days):
   - If daysSinceLastWorkout >= 7: Reduce intensity & volume by ~30%. Focus on dynamic mobility & smooth floor calisthenics.

CONVERSATION & READINESS PROTOCOL:
1. IF Assaf gives a simple greeting (e.g., "hi", "hello") OR has NOT yet shared how his body feels or his available time today:
   - DO NOT generate a workout plan yet. Set "updatedPlan": null.
   - Warmly greet Assaf, mention your assessment of his training status, and ask for today's inputs (body feeling & available minutes).
   - Provide 3-4 quickChips for time/readiness.

2. ONLY IF Assaf provides specific daily inputs:
   - Generate or update "updatedPlan" with a tailored routine.

Current Active Plan:
${currentPlan ? JSON.stringify(currentPlan) : 'None'}

User Message: "${messageText}"

You MUST respond ONLY with a valid JSON object matching this exact schema:
{
  "speech": "Your natural response directly addressing Assaf.",
  "quickChips": ["3-4 contextual follow-up quick reply options"],
  "updatedPlan": null OR {
    "type": "Workout Type (e.g. Calisthenics & Jump Rope, Snowboard Leg Primer, Tennis Agility & Mobility, Active Recovery)",
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
            "name": "Exact Exercise Name",
            "isUnilateral": true,
            "defaultSets": 3,
            "defaultReps": 10,
            "defaultDurationSec": 0,
            "restSec": 45,
            "tips": "10 reps per side. Keep torso upright."
          }
        ]
      }
    ]
  }
}`;

    const settings = Storage.getSettings();
    let configuredModel = settings.selectedModel || 'gemini-3.8-flash';
    // Auto-migrate retired models
    if (configuredModel === 'gemini-2.0-flash' || configuredModel === 'gemini-1.5-flash' || configuredModel === 'gemini-1.5-pro' || configuredModel === 'gemini-3.6-flash') {
      configuredModel = 'gemini-3.8-flash';
      Storage.saveSettings({ selectedModel: 'gemini-3.8-flash' });
    }

    const modelsToTry = [configuredModel];
    if (!modelsToTry.includes('gemini-3.8-flash')) modelsToTry.push('gemini-3.8-flash');
    if (!modelsToTry.includes('gemini-3.5-flash')) modelsToTry.push('gemini-3.5-flash');
    if (!modelsToTry.includes('gemini-3.0-flash')) modelsToTry.push('gemini-3.0-flash');
    if (!modelsToTry.includes('gemini-2.5-flash')) modelsToTry.push('gemini-2.5-flash');

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

    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const isRetryableError = (status, msg = '') => {
      const lower = msg.toLowerCase();
      return (
        status === 429 ||
        status === 503 ||
        status === 500 ||
        status === 502 ||
        status === 504 ||
        lower.includes('high demand') ||
        lower.includes('spikes in demand') ||
        lower.includes('try again later') ||
        lower.includes('resource_exhausted') ||
        lower.includes('rate limit') ||
        lower.includes('overloaded')
      );
    };

    const isModelAvailabilityError = (msg = '') => {
      const lower = msg.toLowerCase();
      return (
        lower.includes('not found') ||
        lower.includes('404') ||
        lower.includes('no longer available') ||
        lower.includes('unsupported') ||
        lower.includes('deprecated') ||
        lower.includes('retired')
      );
    };

    let lastError = null;
    const MAX_RETRIES = 3;
    const INITIAL_BACKOFF_MS = 1000;

    modelLoop:
    for (const model of modelsToTry) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        if (attempt > 0) {
          const backoff = (INITIAL_BACKOFF_MS * Math.pow(2, attempt - 1)) + Math.floor(Math.random() * 500);
          console.warn(`[Gemini AI] Model ${model} busy/high-demand. Retrying in ${backoff}ms (attempt ${attempt}/${MAX_RETRIES})...`);
          await wait(backoff);
        }

        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          const data = await response.json();

          if (!response.ok) {
            const errorMsg = data.error?.message || `API Error ${response.status}`;
            const err = new Error(errorMsg);
            err.status = response.status;
            throw err;
          }

          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const jsonText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(jsonText);

          return {
            type: 'TEXT',
            text: parsed.speech || "How is your body feeling today, Assaf?",
            quickChips: parsed.quickChips || ['Got 20 mins & feeling good', 'Rope & Calisthenics (15m)', 'Playing tennis today'],
            updatedPlan: parsed.updatedPlan || null
          };
        } catch (err) {
          lastError = err;
          const errMsg = err.message || '';

          if (isModelAvailabilityError(errMsg)) {
            console.warn(`[Gemini AI] Model ${model} unavailable: ${errMsg}. Trying next model...`);
            continue modelLoop;
          }

          if (isRetryableError(err.status, errMsg)) {
            console.warn(`[Gemini AI] Model ${model} high demand notice: ${errMsg}`);
            if (attempt < MAX_RETRIES) {
              continue;
            } else {
              console.warn(`[Gemini AI] Retries exhausted for ${model}. Cascading to next fallback model...`);
              continue modelLoop;
            }
          }

          console.error(`[Gemini AI] Non-retryable error on ${model}:`, errMsg);
          break modelLoop;
        }
      }
    }

    const errMsg = lastError ? lastError.message : 'Unknown error';
    const isDemandError = isRetryableError(lastError?.status, errMsg);

    return {
      type: 'TEXT',
      text: isDemandError
        ? `⚠️ **Gemini High Demand**: Google's AI servers are temporarily experiencing high demand. Please tap **🔄 Retry Now** or wait a moment.`
        : `⚠️ **Gemini AI Error**: ${errMsg}. Please check your API key by tapping 🔑 Key in the header.`,
      quickChips: isDemandError ? ['🔄 Retry Now', 'Got 20 mins & feeling good', 'Playing tennis today'] : ['🔑 Check Gemini Key']
    };
  }
};
