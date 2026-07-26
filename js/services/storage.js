// Local Storage Persistence Manager

const KEYS = {
  PROFILE: 'afa_user_profile',
  CHECKINS: 'afa_daily_checkins',
  WORKOUT_LOGS: 'afa_workout_logs',
  SETTINGS: 'afa_app_settings'
};

export const Storage = {
  // USER PROFILE
  getProfile() {
    const data = localStorage.getItem(KEYS.PROFILE);
    if (!data) {
      return {
        onboarded: false,
        name: 'Assaf',
        age: 30,
        heightCm: 178,
        weightKg: 75,
        fitnessLevel: 'Intermediate', // Beginner, Intermediate, Advanced
        equipment: ['Bodyweight', 'Jump Rope', 'Pull-up Bar'], // Available equipment
        preferredTimeOfDay: 'Morning',
        sports: ['Tennis', 'Soccer'], // Favorite external activities
        goals: ['Maintain fitness', 'Injury prevention', 'Calisthenics strength', 'Cardio endurance']
      };
    }
    return JSON.parse(data);
  },

  saveProfile(profile) {
    const updated = { ...profile, onboarded: true };
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(updated));
    return updated;
  },

  // DAILY CHECK-INS & READINESS
  getCheckIns() {
    const data = localStorage.getItem(KEYS.CHECKINS);
    return data ? JSON.parse(data) : {};
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
      energyLevel: checkInData.energyLevel || 7, // 1 - 10
      sorenessLevel: checkInData.sorenessLevel || 2, // 1 - 10
      sorenessAreas: checkInData.sorenessAreas || [], // e.g. ['Legs', 'Shoulders']
      availableMinutes: checkInData.availableMinutes || 30, // 15, 30, 45, 60, 0
      sportsToday: checkInData.sportsToday || [], // e.g. ['Tennis']
      sportsPlannedTime: checkInData.sportsPlannedTime || '', // e.g. '5:00 PM'
      notes: checkInData.notes || '',
      readinessScore: checkInData.readinessScore || 75 // 0 - 100
    };

    checkIns[todayKey] = entry;
    localStorage.setItem(KEYS.CHECKINS, JSON.stringify(checkIns));
    return entry;
  },

  // LOG COMPLETED WORKOUTS
  getWorkoutLogs() {
    const data = localStorage.getItem(KEYS.WORKOUT_LOGS);
    return data ? JSON.parse(data) : [];
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
    localStorage.setItem(KEYS.WORKOUT_LOGS, JSON.stringify(logs));
    return entry;
  },

  // SETTINGS & PWA PING
  getSettings() {
    const data = localStorage.getItem(KEYS.SETTINGS);
    return data ? JSON.parse(data) : {
      notificationsEnabled: false,
      morningPingTime: '08:00',
      apiKey: '',
      soundEnabled: true
    };
  },

  saveSettings(settings) {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(updated));
    return updated;
  }
};
