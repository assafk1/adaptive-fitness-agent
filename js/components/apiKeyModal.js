// Gemini API Key & Dynamic Model Selection Component

import { Storage } from '../services/storage.js';
import { AgentLogic } from '../services/agentLogic.js';

export const ApiKeyModalComponent = {
  async renderModal(containerEl, onSave) {
    const settings = Storage.getSettings();
    const currentKey = settings.apiKey || '';
    const currentModel = settings.selectedModel || 'gemini-2.0-flash';

    const html = `
      <div class="modal-overlay" id="apikey-modal">
        <div class="modal-card glassmorphism animate-fade-in">
          <div class="modal-header">
            <h3>🔑 Gemini API & Model Selector</h3>
            <button class="btn-icon" id="close-apikey-btn">&times;</button>
          </div>

          <div class="modal-body">
            <p class="text-muted mb-4">
              Enter your Google Gemini API key to query <code>ModelService.ListModels</code> and select your preferred model.
            </p>

            <form id="apikey-form">
              <div class="form-group">
                <label class="form-label">Gemini API Key</label>
                <div style="display: flex; gap: 8px;">
                  <input type="password" id="gemini-key-input" value="${currentKey}" placeholder="AIzaSy..." class="custom-input" style="flex: 1;" required />
                  <button type="button" class="btn btn-outline btn-sm" id="fetch-models-btn">🔄 Fetch Models</button>
                </div>
                <span class="text-muted" style="font-size: 12px; margin-top: 4px; display: block;">
                  Get your free API key at <a href="https://aistudio.google.com/app/apikey" target="_blank" style="color: var(--accent-primary);">aistudio.google.com</a>
                </span>
              </div>

              <!-- DYNAMIC MODEL SELECTOR -->
              <div class="form-group">
                <label class="form-label">🤖 Selected Gemini AI Model (via ModelService.ListModels)</label>
                <select id="gemini-model-select" class="custom-select">
                  <option value="${currentModel}" selected>Loading available models...</option>
                </select>
                <span class="text-muted" style="font-size: 12px; margin-top: 4px; display: block;" id="model-desc-info">
                  Select which model powers your coach conversation.
                </span>
              </div>

              <div class="modal-footer">
                <button type="submit" class="btn btn-primary btn-block">💾 Save Key & Selected Model</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    containerEl.innerHTML = html;

    const closeBtn = document.getElementById('close-apikey-btn');
    const form = document.getElementById('apikey-form');
    const keyInput = document.getElementById('gemini-key-input');
    const fetchBtn = document.getElementById('fetch-models-btn');
    const modelSelect = document.getElementById('gemini-model-select');

    const loadModels = async (key) => {
      if (!key) return;
      modelSelect.innerHTML = `<option value="">Querying ModelService.ListModels...</option>`;
      const models = await AgentLogic.fetchAvailableModels(key);

      if (models.length === 0) {
        modelSelect.innerHTML = `
          <option value="gemini-2.0-flash" ${currentModel === 'gemini-2.0-flash' ? 'selected' : ''}>gemini-2.0-flash (Recommended)</option>
          <option value="gemini-1.5-flash-latest" ${currentModel === 'gemini-1.5-flash-latest' ? 'selected' : ''}>gemini-1.5-flash-latest</option>
          <option value="gemini-1.5-pro-latest" ${currentModel === 'gemini-1.5-pro-latest' ? 'selected' : ''}>gemini-1.5-pro-latest</option>
        `;
      } else {
        modelSelect.innerHTML = models.map(m => `
          <option value="${m.id}" ${m.id === currentModel ? 'selected' : ''}>
            ${m.id} — ${m.displayName}
          </option>
        `).join('');
      }
    };

    // Auto-fetch if key is present
    if (currentKey) {
      loadModels(currentKey);
    }

    fetchBtn.addEventListener('click', () => loadModels(keyInput.value.trim()));
    closeBtn.addEventListener('click', () => containerEl.innerHTML = '');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const keyVal = keyInput.value.trim();
      const selectedModelVal = modelSelect.value || 'gemini-2.0-flash';
      
      Storage.saveSettings({ apiKey: keyVal, selectedModel: selectedModelVal });
      containerEl.innerHTML = '';
      alert(`💾 Saved! Gemini API Key and Model (${selectedModelVal}) configured.`);
      onSave(keyVal, selectedModelVal);
    });
  }
};
