// Gemini API Key Settings Component

import { Storage } from '../services/storage.js';

export const ApiKeyModalComponent = {
  renderModal(containerEl, onSave) {
    const settings = Storage.getSettings();
    const currentKey = settings.apiKey || '';

    const html = `
      <div class="modal-overlay" id="apikey-modal">
        <div class="modal-card glassmorphism animate-fade-in">
          <div class="modal-header">
            <h3>🔑 Google Gemini AI API Setup</h3>
            <button class="btn-icon" id="close-apikey-btn">&times;</button>
          </div>

          <div class="modal-body">
            <p class="text-muted mb-4">
              Enter your free Google Gemini API key to enable full AI conversation, open-ended coaching, and dynamic workout adjustments.
            </p>

            <form id="apikey-form">
              <div class="form-group">
                <label class="form-label">Gemini API Key</label>
                <input type="password" id="gemini-key-input" value="${currentKey}" placeholder="AIzaSy..." class="custom-input" required />
                <span class="text-muted" style="font-size: 12px; margin-top: 4px; display: block;">
                  Don't have a key? Get one for free at <a href="https://aistudio.google.com/app/apikey" target="_blank" style="color: var(--accent-primary);">aistudio.google.com</a>
                </span>
              </div>

              <div class="modal-footer">
                <button type="submit" class="btn btn-primary btn-block">💾 Save API Key</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    containerEl.innerHTML = html;

    const closeBtn = document.getElementById('close-apikey-btn');
    const form = document.getElementById('apikey-form');

    closeBtn.addEventListener('click', () => containerEl.innerHTML = '');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const keyVal = document.getElementById('gemini-key-input').value.trim();
      Storage.saveSettings({ apiKey: keyVal });
      containerEl.innerHTML = '';
      alert('🔑 Gemini API Key saved successfully!');
      onSave(keyVal);
    });
  }
};
