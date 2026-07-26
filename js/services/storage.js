// Local Storage Persistence Manager with Fallback & iOS PWA Protection

const KEYS = {
  PROFILE: 'afa_user_profile',
  CHECKINS: 'afa_daily_checkins',
  WORKOUT_LOGS: 'afa_workout_logs',
  SETTINGS: 'afa_app_settings'
};

// In-memory fallback in case localStorage is restricted
const memoryFallback = {};

const safeGetItem = (key) => {
  try {
    return localStorage.getItem(key) || memoryFallback[key] || null;
  } catch (e) {
    return memoryFallback[key] || null;
  }
};

const safeSetItem = (key, value) => {
  try {
    localStorage.setItem(key, value);
    memoryFallback[key] = value;
  } catch (e) {
    console.warn('localStorage write failed, using memory fallback:', e);
    memoryFallback[key] = value;
  }
};

export const Storage = {
  // USER PROFILE
  getProfile() {
    const data = safeGetItem(KEYS.PROFILE);
    if (!data) {
      const defaultProfile = {
        onboarded: true, // Set to true by default to avoid annoying pop-up prompts
        name: 'Assaf',
        age: 30,
        heightCm: 178,
        weightKg: 75,
        fitnessLevel: 'Intermediate',
        equipment: ['Bodyweight', 'Jump Rope', 'Pull-up Bar', 'Chair / Bench', 'Running Shoes'],
        preferredTimeOfDay: 'Morning',
        sports: ['Tennis', 'Soccer'],
        goals: ['Maintain fitness', 'Injury prevention', 'Calisthenics strength', 'Cardio endurance']
      };
      this.saveProfile(defaultProfile);
      return defaultProfile;
    }
    try {
      const parsed = JSON.parse(data);
      parsed.onboarded = true; // Ensure onboarded is set
      return parsed;
    } catch (e) {
      return { onboarded: true, name: 'Assaf', age: 30, heightCm: 178, weightKg: 75, fitnessLevel: 'Intermediate', equipment: ['Bodyweight', 'Jump Rope', 'Pull-up Bar'], sports: ['Tennis', 'Soccer'] };
    }
  },

  saveProfile(profile) {
    const updated = { ...profile, onboarded: true };
    safeSetItem(KEYS.PROFILE, JSON.stringify(updated));
    return updated;
  },

  // DAILY CHECK-INS & READINESS
  getCheckIns() {
    const data = safeGetItem(KEYS.CHECKINS);
    if (!data) return {};
    try { return JSON.parse(data); } catch (e) { return {}; }
  },

  getTodayCheckIn() {
    const checkIns = this.getCheckIns();
    const todayKey = new Date().toISOString().split('T')[0];
    return checkIns[todayKey] || null;
  },

  saveDailyCheckIn(checkInData) {
    const checkIns = this.getCheckIns();
    const todayKey = new Date().toISOString().split('T')[0];
    
    const entry = {
      date: todayKey,
      timestamp: new Date().toISOString(),
      energyLevel: checkInData.energyLevel || 7,
      sorenessLevel: checkInData.sorenessLevel || 2,
      sorenessAreas: checkInData.sorenessAreas || [],
      availableMinutes: checkInData.availableMinutes || 30,
      sportsToday: checkInData.sportsToday || [],
      sportsPlannedTime: checkInData.sportsPlannedTime || '',
      notes: checkInData.notes || '',
      readinessScore: checkInData.readinessScore || 75
    };

    checkIns[todayKey] = entry;
    safeSetItem(KEYS.CHECKINS, JSON.stringify(checkIns));
    return entry;
  },

  // LOG COMPLETED WORKOUTS
  getWorkoutLogs() {
    const data = safeGetItem(KEYS.WORKOUT_LOGS);
    if (!data) return [];
    try { return JSON.parse(data); } catch (e) { return []; }
  },

  logCompletedWorkout(log) {
    const logs = this.getWorkoutLogs();
    const entry = {
      id: 'log_' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString(),
      ...log
    };
    logs.unshift(entry);
    safeSetItem(KEYS.WORKOUT_LOGS, JSON.stringify(logs));
    return entry;
  },

  // SETTINGS & PWA PING
  getSettings() {
    const data = safeGetItem(KEYS.SETTINGS);
    if (!data) return { notificationsEnabled: false, morningPingTime: '08:00', apiKey: '', soundEnabled: true };
    try { return JSON.parse(data); } catch (e) { return { notificationsEnabled: false }; }
  },

  saveSettings(settings) {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    safeSetItem(KEYS.SETTINGS, JSON.stringify(updated));
    return updated;
  }
};
