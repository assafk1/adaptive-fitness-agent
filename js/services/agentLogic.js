// Conversational AI Coach Persona & Dialogue Engine

export const AgentLogic = {
  getMorningGreeting(profile, hasCheckedInToday) {
    const name = profile.name || 'friend';
    const hour = new Date().getHours();
    let timeOfDay = 'morning';
    if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
    if (hour >= 17) timeOfDay = 'evening';

    if (hasCheckedInToday) {
      return {
        text: `Hey ${name}, good ${timeOfDay}! We've already set today's plan. How is your day going so far? Feel free to adjust today's session or ask any workout & recovery questions.`,
        quickChips: ['Show today\'s plan', 'I feel more tired now', 'Update available time', 'Stretching routine']
      };
    }

    return {
      text: `Good ${timeOfDay}, ${name}! 👋 I'm your adaptive coach. Let's align today's schedule and check how your body is feeling. 
      \nDo you have 15-30 minutes for a session today, or any external sports planned (like tennis, soccer, or running)?`,
      quickChips: [
        '⚡ Start Daily Check-in',
        'Got 15 mins today',
        'Playing sports today',
        'Need a recovery day'
      ]
    };
  },

  processUserMessage(messageText, checkIn, profile, plan) {
    const textLower = messageText.toLowerCase();

    // 1. Trigger Check-in
    if (textLower.includes('check-in') || textLower.includes('check in') || textLower.includes('start daily')) {
      return {
        type: 'TRIGGER_CHECKIN_MODAL',
        text: "Awesome! Let's complete your 1-minute readiness check-in to generate today's adaptive plan.",
        quickChips: ['Open Check-in']
      };
    }

    // 2. Soreness / Injury mentions
    if (textLower.includes('sore') || textLower.includes('hurt') || textLower.includes('pain') || textLower.includes('tired')) {
      return {
        type: 'TEXT',
        text: `I hear you! Pain or heavy fatigue is your body's signal to slow down and rebuild. I can immediately switch today's target to active recovery, foam rolling, or gentle hip/shoulder mobility. Would you like a 15-min decompression flow instead?`,
        quickChips: ['Yes, recovery flow', 'I can still do light core', 'Show stretching exercises']
      };
    }

    // 3. Tennis / Soccer / Running sports mentions
    if (textLower.includes('tennis') || textLower.includes('soccer') || textLower.includes('run')) {
      return {
        type: 'TEXT',
        text: `Great to hear! Playing sports is fantastic cardio. To prevent burnout and keep your knees/ankles safe, I recommend doing our 12-min Dynamic Activation Warm-up before your match, and a 15-min lower body relief stretch afterwards.`,
        quickChips: ['Show Pre-match Warm-up', 'Show Post-match Stretch', 'I have 30 mins after']
      };
    }

    // 4. Time constraints
    if (textLower.includes('15') || textLower.includes('quick') || textLower.includes('busy')) {
      return {
        type: 'TEXT',
        text: `Got it! Short sessions done consistently beat long, missed workouts every time. I've tailored a high-efficiency 15-minute express routine for you.`,
        quickChips: ['Start 15-min Workout', 'Show Exercise List', 'Snooze to evening']
      };
    }

    // 5. Default General Coach Response
    return {
      type: 'TEXT',
      text: `I'm here with you every step of the way! Remember: consistency over intensity. How can I adjust your training or recovery right now?`,
      quickChips: ['⚡ Start Daily Check-in', 'Show today\'s plan', 'Calisthenics tips', 'Running warm-up']
    };
  }
};
