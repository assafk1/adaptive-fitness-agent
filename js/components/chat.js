// Conversational Chat Interface Component with Live Layout Debug Inspector

export const ChatComponent = {
  render(containerEl, messages = [], quickChips = [], onSendMessage, onChipClick, onOpenCheckin) {
    const messagesHtml = messages.map(msg => {
      let planWidgetHtml = '';

      if (msg.plan) {
        const { title, type, estimatedMinutes, routines, exercises } = msg.plan;
        let exerciseListHtml = '';

        if (routines && routines.length > 0) {
          routines.forEach(r => {
            if (r.exercises) {
              exerciseListHtml += r.exercises.map(ex => `
                <div class="chat-ex-row">
                  <span><strong>${ex.name}</strong></span>
                  <span class="badge badge-primary">${ex.defaultSets ? ex.defaultSets + ' sets x ' : ''}${ex.defaultReps ? ex.defaultReps + ' reps' : (ex.defaultDurationSec ? Math.round(ex.defaultDurationSec / 60) + ' min hold' : '')}</span>
                </div>
              `).join('');
            }
          });
        } else if (exercises && exercises.length > 0) {
          exerciseListHtml += exercises.map(ex => `
            <div class="chat-ex-row">
              <span><strong>${ex.name}</strong></span>
              <span class="badge badge-primary">${ex.defaultSets ? ex.defaultSets + ' sets x ' : ''}${ex.defaultReps ? ex.defaultReps + ' reps' : (ex.defaultDurationSec ? Math.round(ex.defaultDurationSec / 60) + ' min hold' : '')}</span>
            </div>
          `).join('');
        }

        planWidgetHtml = `
          <div class="chat-plan-card glassmorphism" style="margin-top: 12px; padding: 14px; border-radius: var(--radius-sm); border: 1px solid var(--accent-primary);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span class="badge badge-primary">${type || 'Custom Plan'}</span>
              <span style="font-size: 12px; color: var(--text-secondary);">⏱️ ${estimatedMinutes || 15} Mins</span>
            </div>
            <h4 style="margin-bottom: 8px; color: var(--text-primary);">${title || 'Adaptive Routine'}</h4>
            <div class="chat-exercise-list" style="margin-bottom: 12px;">
              ${exerciseListHtml}
            </div>
            <button class="btn btn-primary btn-sm btn-block view-plan-btn">🏋️ View & Track Full Workout Plan</button>
          </div>
        `;
      }

      return `
        <div class="chat-message ${msg.sender === 'user' ? 'msg-user' : 'msg-agent'} animate-fade-in">
          <div class="msg-avatar">${msg.sender === 'user' ? '👤' : '🏃‍♂️'}</div>
          <div class="msg-content glassmorphism">
            <div class="msg-header">
              <span class="msg-author">${msg.sender === 'user' ? 'You' : 'Adaptive Coach'}</span>
              <span class="msg-time">${msg.time || ''}</span>
            </div>
            <div class="msg-text">${msg.text.replace(/\n/g, '<br/>')}</div>
            ${planWidgetHtml}
          </div>
        </div>
      `;
    }).join('');

    const chipsHtml = quickChips.map(chip => `
      <button class="chip-action animate-pop">${chip}</button>
    `).join('');

    const html = `
      <div class="chat-wrapper glassmorphism">
        <!-- LIVE LAYOUT DEBUG INSPECTOR OVERLAY -->
        <div id="layout-debug-inspector" style="background: rgba(15, 23, 42, 0.95); border: 1px solid var(--accent-amber); border-radius: var(--radius-sm); padding: 8px 12px; font-size: 11px; color: var(--accent-amber); margin-bottom: 8px; font-family: monospace;">
          <div style="display: flex; justify-content: space-between; align-items: center; font-weight: bold; margin-bottom: 4px;">
            <span>📐 FOOTER & VIEWPORT DEBUG INSPECTOR</span>
            <button id="toggle-debug-btn" style="background: none; border: none; color: white; cursor: pointer;">✖</button>
          </div>
          <div id="debug-metrics-content">Calculating layout metrics...</div>
        </div>

        <div class="chat-feed" id="chat-feed-box">
          ${messagesHtml}
        </div>

        <div class="quick-chips-container" id="chips-box">
          ${chipsHtml}
        </div>

        <div class="chat-input-bar">
          <input type="text" id="chat-input-field" placeholder="Tell your coach how you feel today..." />
          <button class="btn btn-primary" id="chat-send-btn">Send 🚀</button>
        </div>
      </div>
    `;

    containerEl.innerHTML = html;

    const feedBox = document.getElementById('chat-feed-box');
    feedBox.scrollTop = feedBox.scrollHeight;

    const inputField = document.getElementById('chat-input-field');
    const sendBtn = document.getElementById('chat-send-btn');
    const debugInspector = document.getElementById('layout-debug-inspector');
    const toggleDebugBtn = document.getElementById('toggle-debug-btn');

    if (toggleDebugBtn) {
      toggleDebugBtn.addEventListener('click', () => {
        debugInspector.style.display = debugInspector.style.display === 'none' ? 'block' : 'none';
      });
    }

    // Real-Time Computed Styles Inspector Function
    const updateDebugMetrics = () => {
      const metricsEl = document.getElementById('debug-metrics-content');
      if (!metricsEl) return;

      const navEl = document.querySelector('.app-nav');
      const containerEl = document.querySelector('.app-container');
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

      let navHeight = 0, navPaddingBottom = '0px', navMarginBottom = '0px', navBottom = '0px';
      let containerPaddingBottom = '0px';

      if (navEl) {
        const csNav = window.getComputedStyle(navEl);
        navHeight = navEl.offsetHeight;
        navPaddingBottom = csNav.paddingBottom;
        navMarginBottom = csNav.marginBottom;
        navBottom = csNav.bottom;
      }

      if (containerEl) {
        const csContainer = window.getComputedStyle(containerEl);
        containerPaddingBottom = csContainer.paddingBottom;
      }

      metricsEl.innerHTML = `
        • <strong>Mode</strong>: ${isStandalone ? '📱 Standalone PWA' : '🌐 Mobile Browser'}<br/>
        • <strong>Inner Height</strong>: ${window.innerHeight}px | <strong>Screen Height</strong>: ${window.screen.height}px<br/>
        • <strong>Footer Height</strong>: ${navHeight}px<br/>
        • <strong>Footer Padding-Bottom</strong>: ${navPaddingBottom}<br/>
        • <strong>Footer Margin-Bottom</strong>: ${navMarginBottom}<br/>
        • <strong>Footer CSS Bottom</strong>: ${navBottom}<br/>
        • <strong>Container Padding-Bottom</strong>: ${containerPaddingBottom}
      `;
    };

    // Update metrics immediately and on resize
    updateDebugMetrics();
    window.addEventListener('resize', updateDebugMetrics);
    setTimeout(updateDebugMetrics, 500);

    // View Plan buttons inside chat
    containerEl.querySelectorAll('.view-plan-btn').forEach(btn => {
      btn.addEventListener('click', () => onChipClick('Show today\'s plan'));
    });

    const handleSend = () => {
      const text = inputField.value.trim();
      if (!text) return;
      inputField.value = '';
      onSendMessage(text);
    };

    sendBtn.addEventListener('click', handleSend);
    inputField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSend();
    });

    const chipsBox = document.getElementById('chips-box');
    chipsBox.addEventListener('click', (e) => {
      if (e.target.classList.contains('chip-action')) {
        const chipText = e.target.textContent;
        onChipClick(chipText);
      }
    });
  }
};
