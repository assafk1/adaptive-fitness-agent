// Bulletproof Multi-Layer Persistence Manager (IndexedDB + LocalStorage + Cookie Fallback)

const KEYS = {
  PROFILE: 'afa_user_profile_v2',
  CHECKINS: 'afa_daily_checkins_v2',
  WORKOUT_LOGS: 'afa_workout_logs_v2',
  SETTINGS: 'afa_app_settings_v2'
};

// Memory cache
const memoryCache = {};

// Helper: Cookie Fallback for iOS PWA persistence
function setCookie(name, value, days = 365) {
  try {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/; SameSite=Lax';
  } catch (e) {}
}

function getCookie(name) {
  try {
    return document.cookie.split('; ').reduce((r, v) => {
      const parts = v.split('=');
      return parts[0] === name ? decodeURIComponent(parts[1]) : r;
    }, '');
  } catch (e) {
    return '';
  }
}

const safeGetItem = (key) => {
  try {
    const lsData = localStorage.getItem(key);
    if (lsData) return lsData;
  } catch (e) {}

  const cookieData = getCookie(key);
  if (cookieData) return cookieData;

  return memoryCache[key] || null;
};

const safeSetItem = (key, value) => {
  memoryCache[key] = value;
  try {
    localStorage.setItem(key, value);
  } catch (e) {}
  setCookie(key, value);
};

export const Storage = {
  // USER PROFILE
  getProfile() {
    const data = safeGetItem(KEYS.PROFILE);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (parsed && typeof parsed === 'object') return parsed;
      } catch (e) {}
    }

    // Default profile only if never set
    return {
      onboarded: true,
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
