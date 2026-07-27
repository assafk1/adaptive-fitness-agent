// User Profile & Onboarding Component with Morning Notification Time Picker

import { Storage } from '../services/storage.js';

export const ProfileComponent = {
  renderModal(containerEl, profile, onSave) {
    const settings = Storage.getSettings();
    const morningPingTime = settings.morningPingTime || '08:00';

    const { name = 'Assaf', age = 30, heightCm = 178, weightKg = 75, fitnessLevel = 'Intermediate', equipment = [], sports = [] } = profile;

    const eqOptions = ['Bodyweight', 'Jump Rope', 'Pull-up Bar', 'Chair / Bench', 'Resistance Bands', 'Running Shoes'];
    const sportOptions = ['Tennis', 'Soccer', 'Running', 'Basketball', 'Swimming'];

    const html = `
      <div class="modal-overlay" id="profile-modal">
        <div class="modal-card glassmorphism animate-fade-in">
          <div class="modal-header">
            <h3>⚙️ Profile & Daily Push Notification Settings</h3>
            <button class="btn-icon" id="close-profile-btn">&times;</button>
          </div>

          <form id="profile-form">
            <!-- 1. DAILY MORNING PING TIME -->
            <div class="form-group" style="background: rgba(16, 185, 129, 0.1); padding: 14px; border-radius: var(--radius-sm); border: 1px solid var(--accent-primary);">
              <label class="form-label">⏰ Preferred Daily Push Notification Time</label>
              <input type="time" id="prof-ping-time" value="${morningPingTime}" class="custom-input" style="font-size: 16px; font-weight: bold; color: var(--accent-primary);" required />
              <span class="text-muted" style="font-size: 12px; margin-top: 4px; display: block;">
                Your iPhone will send your daily morning check-in alert at this exact time every day.
              </span>
            </div>

            <div class="form-row">
              <div class="form-group col-6">
                <label class="form-label">Name</label>
                <input type="text" id="prof-name" value="${name}" class="custom-input" required />
              </div>
              <div class="form-group col-6">
                <label class="form-label">Age</label>
                <input type="number" id="prof-age" value="${age}" class="custom-input" required />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group col-6">
                <label class="form-label">Height (cm)</label>
                <input type="number" id="prof-height" value="${heightCm}" class="custom-input" required />
              </div>
              <div class="form-group col-6">
                <label class="form-label">Weight (kg)</label>
                <input type="number" id="prof-weight" value="${weightKg}" class="custom-input" required />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Fitness Experience Level</label>
              <select id="prof-level" class="custom-select">
                <option value="Beginner" ${fitnessLevel === 'Beginner' ? 'selected' : ''}>Beginner (Building foundation & mobility)</option>
                <option value="Intermediate" ${fitnessLevel === 'Intermediate' ? 'selected' : ''}>Intermediate (Consistent calisthenics & sports)</option>
                <option value="Advanced" ${fitnessLevel === 'Advanced' ? 'selected' : ''}>Advanced (High volume & complex progressions)</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">🛠️ Available Equipment</label>
              <div class="tag-chips-grid">
                ${eqOptions.map(eq => `
                  <label class="checkbox-tag">
                    <input type="checkbox" name="profEquipment" value="${eq}" ${equipment.includes(eq) ? 'checked' : ''} /> ${eq}
                  </label>
                `).join('')}
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">⚽ External Sports You Enjoy</label>
              <div class="tag-chips-grid">
                ${sportOptions.map(sp => `
                  <label class="checkbox-tag">
                    <input type="checkbox" name="profSports" value="${sp}" ${sports.includes(sp) ? 'checked' : ''} /> ${sp}
                  </label>
                `).join('')}
              </div>
            </div>

            <div class="modal-footer">
              <button type="submit" class="btn btn-primary btn-block">💾 Save Settings</button>
            </div>
          </form>
        </div>
      </div>
    `;

    containerEl.innerHTML = html;

    const closeBtn = document.getElementById('close-profile-btn');
    const form = document.getElementById('profile-form');

    closeBtn.addEventListener('click', () => containerEl.innerHTML = '');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const pingTimeVal = document.getElementById('prof-ping-time').value;
      Storage.saveSettings({ morningPingTime: pingTimeVal });

      const updatedProfile = {
        ...profile,
        name: document.getElementById('prof-name').value.trim(),
        age: parseInt(document.getElementById('prof-age').value, 10),
        heightCm: parseInt(document.getElementById('prof-height').value, 10),
        weightKg: parseInt(document.getElementById('prof-weight').value, 10),
        fitnessLevel: document.getElementById('prof-level').value,
        equipment: Array.from(form.querySelectorAll('input[name="profEquipment"]:checked')).map(cb => cb.value),
        sports: Array.from(form.querySelectorAll('input[name="profSports"]:checked')).map(cb => cb.value)
      };

      containerEl.innerHTML = '';
      onSave(updatedProfile);
    });
  }
};
