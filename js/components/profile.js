// Bare-Bones API Key & Push Settings Component

import { Storage } from '../services/storage.js';
import { PushService } from '../services/pushService.js';
import { NotificationManager } from './notifications.js';

export const ProfileComponent = {
  async renderModal(containerEl, profile, onSave) {
    const settings = Storage.getSettings();
    const currentKey = settings.apiKey || '';
    const morningPingTime = settings.morningPingTime || '08:00';

    const html = `
      <div class="modal-overlay" id="settings-modal">
        <div class="modal-card glassmorphism animate-fade-in">
          <div class="modal-header">
            <h3>🔑 Key & Settings</h3>
            <button class="btn-icon" id="close-settings-btn">&times;</button>
          </div>

          <form id="settings-form">
            <div class="form-group">
              <label class="form-label">Google Gemini API Key</label>
              <input type="password" id="gemini-key-input" value="${currentKey}" placeholder="AIzaSy..." class="custom-input" required />
              <span class="text-muted" style="font-size: 11px; margin-top: 4px; display: block;">
                Get your free API key at <a href="https://aistudio.google.com/app/apikey" target="_blank" style="color: var(--accent-primary);">aistudio.google.com</a>
              </span>
            </div>

            <div class="settings-section-title">🔔 Push Notifications</div>
            <div class="form-group">
              <label class="form-label">Morning Alert Preferred Time</label>
              <input type="time" id="prof-ping-time" value="${morningPingTime}" class="custom-input" />
            </div>

            <div style="display: flex; gap: 8px; margin-bottom: 16px;">
              <button type="button" class="btn btn-outline btn-sm" id="test-ping-btn" style="flex: 1;">🔔 Test Push Ping</button>
              <button type="button" class="btn btn-outline btn-sm" id="copy-token-btn" style="flex: 1;">📋 Copy Push Token</button>
            </div>

            <div class="modal-footer">
              <button type="submit" class="btn btn-primary btn-block btn-lg">💾 Save Settings</button>
            </div>
          </form>
        </div>
      </div>
    `;

    containerEl.innerHTML = html;

    const closeBtn = document.getElementById('close-settings-btn');
    const form = document.getElementById('settings-form');
    const keyInput = document.getElementById('gemini-key-input');
    const testPingBtn = document.getElementById('test-ping-btn');
    const copyTokenBtn = document.getElementById('copy-token-btn');

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

    closeBtn.addEventListener('click', () => containerEl.innerHTML = '');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const keyVal = keyInput.value.trim();
      const pingTimeVal = document.getElementById('prof-ping-time').value;

      Storage.saveSettings({ 
        apiKey: keyVal, 
        selectedModel: 'gemini-2.0-flash',
        morningPingTime: pingTimeVal 
      });

      containerEl.innerHTML = '';
      onSave(profile);
    });
  }
};
