// Progress & Readiness Dashboard Component

export const DashboardComponent = {
  render(containerEl, checkIns = {}, workoutLogs = []) {
    const dates = Object.keys(checkIns).sort().reverse();
    const totalWorkouts = workoutLogs.length;

    // Calculate streak
    let streakDays = 0;
    const todayStr = new Date().toISOString().split('T')[0];
    if (checkIns[todayStr]) streakDays++;

    const historyHtml = workoutLogs.map(log => `
      <div class="log-item-card glassmorphism">
        <div class="log-icon">✅</div>
        <div class="log-info">
          <h4>${log.title}</h4>
          <span class="log-meta">📅 ${log.date} | ⏱️ ${log.durationMin} Mins | Type: ${log.type}</span>
        </div>
        <div class="readiness-badge-sm">${log.readinessScore || 80}% Readiness</div>
      </div>
    `).join('');

    const html = `
      <div class="dashboard-wrapper glassmorphism animate-fade-in">
        <div class="dashboard-header">
          <h3>📊 Fitness Readiness & Activity Analytics</h3>
          <p class="text-muted">Tracking your adaptive journey, recovery, and daily consistency.</p>
        </div>

        <div class="stats-grid">
          <div class="stat-card glassmorphism">
            <span class="stat-icon">🔥</span>
            <div class="stat-data">
              <span class="stat-value">${streakDays} Days</span>
              <span class="stat-label">Active Streak</span>
            </div>
          </div>

          <div class="stat-card glassmorphism">
            <span class="stat-icon">🏋️</span>
            <div class="stat-data">
              <span class="stat-value">${totalWorkouts}</span>
              <span class="stat-label">Sessions Completed</span>
            </div>
          </div>

          <div class="stat-card glassmorphism">
            <span class="stat-icon">💚</span>
            <div class="stat-data">
              <span class="stat-value">Adaptive</span>
              <span class="stat-label">Recovery Ratio</span>
            </div>
          </div>
        </div>

        <div class="history-section">
          <h4>Completed Workouts & Recovery History</h4>
          ${workoutLogs.length === 0 ? '<p class="text-muted">No sessions logged yet. Complete today\'s workout to start your timeline!</p>' : historyHtml}
        </div>
      </div>
    `;

    containerEl.innerHTML = html;
  }
};
