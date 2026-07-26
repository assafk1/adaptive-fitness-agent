// Conversational Chat Interface Component

export const ChatComponent = {
  render(containerEl, messages = [], quickChips = [], onSendMessage, onChipClick, onOpenCheckin) {
    const messagesHtml = messages.map(msg => `
      <div class="chat-message ${msg.sender === 'user' ? 'msg-user' : 'msg-agent'} animate-fade-in">
        <div class="msg-avatar">${msg.sender === 'user' ? '👤' : '🏃‍♂️'}</div>
        <div class="msg-content glassmorphism">
          <div class="msg-header">
            <span class="msg-author">${msg.sender === 'user' ? 'You' : 'Adaptive Coach'}</span>
            <span class="msg-time">${msg.time || ''}</span>
          </div>
          <div class="msg-text">${msg.text.replace(/\n/g, '<br/>')}</div>
        </div>
      </div>
    `).join('');

    const chipsHtml = quickChips.map(chip => `
      <button class="chip-action animate-pop">${chip}</button>
    `).join('');

    const html = `
      <div class="chat-wrapper glassmorphism">
        <!-- PROACTIVE MORNING PING BANNER -->
        <div class="proactive-ping-banner" id="ping-banner">
          <div class="ping-info">
            <span class="ping-icon">🔔</span>
            <div>
              <strong>Morning Check-in Alert</strong>
              <p>Ready to align today's workout & recovery plan?</p>
            </div>
          </div>
          <button class="btn btn-primary btn-sm" id="banner-checkin-btn">⚡ Start Daily Check-in</button>
        </div>

        <div class="chat-feed" id="chat-feed-box">
          ${messagesHtml}
        </div>

        <div class="quick-chips-container" id="chips-box">
          ${chipsHtml}
        </div>

        <div class="chat-input-bar">
          <input type="text" id="chat-input-field" placeholder="Tell your coach how you feel today, e.g. 'Playing tennis at 5pm'..." />
          <button class="btn btn-primary" id="chat-send-btn">Send 🚀</button>
        </div>
      </div>
    `;

    containerEl.innerHTML = html;

    const feedBox = document.getElementById('chat-feed-box');
    feedBox.scrollTop = feedBox.scrollHeight;

    const inputField = document.getElementById('chat-input-field');
    const sendBtn = document.getElementById('chat-send-btn');
    const bannerBtn = document.getElementById('banner-checkin-btn');

    if (bannerBtn) {
      bannerBtn.addEventListener('click', () => onOpenCheckin());
    }

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

    // Quick chip click
    const chipsBox = document.getElementById('chips-box');
    chipsBox.addEventListener('click', (e) => {
      if (e.target.classList.contains('chip-action')) {
        const chipText = e.target.textContent;
        onChipClick(chipText);
      }
    });
  }
};
