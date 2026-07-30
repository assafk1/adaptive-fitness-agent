// Unified Settings & Profile Bottom Sheet Component with Reliable Model Selection

import { Storage } from '../services/storage.js';
import { AgentLogic } from '../services/agentLogic.js';
import { PushService } from '../services/pushService.js';
import { NotificationManager } from './notifications.js';

export const ProfileComponent = {
  async renderModal(containerEl, profile, onSave) {
    const settings = Storage.getSettings();
    const currentKey = settings.apiKey || '';
    let chosenModel = settings.selectedModel || 'gemini-2.0-flash';
    const morningPingTime = settings.morningPingTime || '08:00';

    const { name = 'Assaf', age = 30, heightCm = 178, weightKg = 75, fitnessLevel = 'Intermediate', equipment = [], sports = [] } = profile;

    const eqOptions = ['Bodyweight', 'Jump Rope', 'Pull-up Bar', 'Chair / Bench', 'Resistance Bands', 'Running Shoes'];
    const sportOptions = ['Tennis', 'Soccer', 'Running', 'Basketball', 'Swimming'];

    const html = `
      <div class="modal-overlay" id="settings-drawer-modal">
        <div class="modal-card glassmorphism animate-fade-in">
          <div class="modal-header">
            <h3>⚙️ Settings & Coach Tools</h3>
            <button class="btn-icon" id="close-settings-btn">&times;</button>
          </div>

          <form id="settings-form">
            <!-- SECTION 1: GEMINI AI ENGINE & MODEL SELECTOR -->
            <div class="settings-section-title">🤖 Gemini AI Model Config</div>
            <div class="form-group">
              <label class="form-label">Gemini API Key</label>
              <div style="display: flex; gap: 8px;">
                <input type="password" id="gemini-key-input" value="${currentKey}" placeholder="AIzaSy..." class="custom-input" style="flex: 1;" />
                <button type="button" class="btn btn-outline btn-sm" id="fetch-models-btn">🔄 Fetch</button>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Active Gemini AI Model (via ListModels API)</label>
              <select id="gemini-model-select" class="custom-select">
                <option value="${chosenModel}" selected>${chosenModel}</option>
              </select>
            </div>

            <!-- SECTION 2: PUSH NOTIFICATION SETTINGS -->
            <div class="settings-section-title">🔔 Push Notifications (iOS WebPush)</div>
            <div class="form-group">
              <label class="form-label">Morning Alert Preferred Time</label>
              <input type="time" id="prof-ping-time" value="${morningPingTime}" class="custom-input" />
            </div>

            <div style="display: flex; gap: 8px; margin-bottom: 16px;">
              <button type="button" class="btn btn-outline btn-sm" id="test-ping-btn" style="flex: 1;">🔔 Test Push Ping</button>
              <button type="button" class="btn btn-outline btn-sm" id="copy-token-btn" style="flex: 1;">📋 Copy Push Token</button>
            </div>

            <!-- SECTION 3: USER PROFILE & EQUIPMENT -->
            <div class="settings-section-title">👤 User Profile & Equipment</div>
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
                <option value="Beginner" ${fitnessLevel === 'Beginner' ? 'selected' : ''}>Beginner</option>
                <option value="Intermediate" ${fitnessLevel === 'Intermediate' ? 'selected' : ''}>Intermediate</option>
                <option value="Advanced" ${fitnessLevel === 'Advanced' ? 'selected' : ''}>Advanced</option>
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

            <!-- SECTION 4: APP TOOLS -->
            <div class="settings-section-title">🔄 App Tools</div>
            <button type="button" class="btn btn-outline btn-block" id="force-reload-btn" style="margin-bottom: 20px; color: var(--accent-rose); border-color: rgba(244, 63, 94, 0.4);">🔄 Force Reload App & Clear Cache</button>

            <div class="modal-footer">
              <button type="submit" class="btn btn-primary btn-block btn-lg">💾 Save All Settings</button>
            </div>
          </form>
        </div>
      </div>
    `;

    containerEl.innerHTML = html;

    const closeBtn = document.getElementById('close-settings-btn');
    const form = document.getElementById('settings-form');
    const keyInput = document.getElementById('gemini-key-input');
    const fetchBtn = document.getElementById('fetch-models-btn');
    const modelSelect = document.getElementById('gemini-model-select');
    const testPingBtn = document.getElementById('test-ping-btn');
    const copyTokenBtn = document.getElementById('copy-token-btn');
    const forceReloadBtn = document.getElementById('force-reload-btn');

    // Track chosen model
    modelSelect.addEventListener('change', (e) => {
      if (e.target.value) {
        chosenModel = e.target.value;
      }
    });

    // Populate dropdown dynamically via ModelService.ListModels
    const loadModels = async (key) => {
      if (!key) return;
      const models = await AgentLogic.fetchAvailableModels(key);

      if (models.length === 0) {
        const fallbackList = ['gemini-2.0-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-pro-latest'];
        modelSelect.innerHTML = fallbackList.map(m => `
          <option value="${m}" ${m === chosenModel ? 'selected' : ''}>${m}</option>
        `).join('');
      } else {
        modelSelect.innerHTML = models.map(m => `
          <option value="${m.id}" ${m.id === chosenModel ? 'selected' : ''}>
            ${m.id} — ${m.displayName}
          </option>
        `).join('');
      }
    };

    if (currentKey) loadModels(currentKey);

    fetchBtn.addEventListener('click', () => loadModels(keyInput.value.trim()));

    testPingBtn.addEventListener('click', async () => {
      const granted = await NotificationManager.requestPermission();
      await PushService.registerSubscription();
      if (granted) NotificationManager.sendTestNotification();
      else alert('Notification permission denied or blocked on device.');
    });

    copyTokenBtn.addEventListener('click', async () => {
      copyTokenBtn.textContent = '⌛ Generating...';
      await PushService.registerSubscription();
      const latestSettings = Storage.getSettings();
      const tokenObj = latestSettings.pushSubscription;

      if (tokenObj) {
        const tokenStr = JSON.stringify(tokenObj);
        try {
          await navigator.clipboard.writeText(tokenStr);
          alert('📋 iPhone Push Token copied to clipboard!');
        } catch (e) {
          prompt('📋 Copy your iPhone Push Token:', tokenStr);
        }
        copyTokenBtn.textContent = '📋 Copied!';
      } else {
        alert('⚠️ Please allow notifications on your iPhone first.');
        copyTokenBtn.textContent = '📋 Copy Push Token';
      }
    });

    forceReloadBtn.addEventListener('click', async () => {
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        for (let r of regs) await r.unregister();
      }
      if ('caches' in window) {
        const keys = await caches.keys();
        for (let k of keys) await caches.delete(k);
      }
      window.location.reload(true);
    });

    closeBtn.addEventListener('click', () => containerEl.innerHTML = '');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const keyVal = keyInput.value.trim();
      const selectedModelVal = modelSelect.value || chosenModel || 'gemini-2.0-flash';
      const pingTimeVal = document.getElementById('prof-ping-time').value;

      Storage.saveSettings({ 
        apiKey: keyVal, 
        selectedModel: selectedModelVal,
        morningPingTime: pingTimeVal 
      });

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
      onSave(updatedProfile, selectedModelVal);
    });
  }
};
