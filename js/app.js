// Main Application Controller - Bare-Bones Minimal Architecture

import { Storage } from './services/storage.js';
import { FitnessEngine } from './services/fitnessEngine.js';
import { AgentLogic } from './services/agentLogic.js';
import { NotificationManager } from './components/notifications.js';
import { PushService } from './services/pushService.js';

import { ChatComponent } from './components/chat.js';
import { WorkoutComponent } from './components/workout.js';
import { ProfileComponent } from './components/profile.js';

class AdaptiveCoachApp {
  constructor() {
    this.profile = Storage.getProfile();
    this.currentPlan = null;
    this.messages = [];
    this.quickChips = [];
    this.activeTab = 'chat';

    this.init();
  }

  init() {
    this.registerServiceWorker();
    this.loadInitialState();
    this.initHeaderButtons();
    this.initTabNavigation();
    this.renderActiveTab();
    this.setupGlobalHandlers();
  }

  setupGlobalHandlers() {
    window.openGeminiKeyModal = () => {
      this.openSettingsDrawer();
    };
  }

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js')
        .then(async reg => {
          console.log('Service Worker registered:', reg.scope);
          await PushService.registerSubscription();
        })
        .catch(err => console.error('Service Worker registration failed:', err));
    }
  }

  loadInitialState() {
    this.profile = Storage.getProfile();

    const greeting = AgentLogic.getMorningGreeting(this.profile);
    this.messages.push({
      sender: 'agent',
      text: greeting.text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    this.quickChips = greeting.quickChips;
  }

  initHeaderButtons() {
    const settingsBtn = document.getElementById('hdr-settings-btn');
    if (settingsBtn) settingsBtn.addEventListener('click', () => this.openSettingsDrawer());
  }

  async triggerTestPush() {
    const result = await PushService.registerSubscription();
    const granted = await NotificationManager.requestPermission();

    const logText = `🔔 **Push Notification Test Result:**\n\n` + 
      (result.logs ? result.logs.map(l => `• ${l}`).join('\n') : '• Permission granted, triggering push alert...');
    
    this.messages.push({
      sender: 'agent',
      text: logText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    
    NotificationManager.sendTestNotification();
    this.renderActiveTab();
  }

  initTabNavigation() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.activeTab = tab.dataset.tab;
        this.renderActiveTab();
      });
    });
  }

  renderActiveTab() {
    const viewContainer = document.getElementById('main-view');

    if (this.activeTab === 'chat') {
      ChatComponent.render(
        viewContainer,
        this.messages,
        this.quickChips,
        (msgText) => this.handleUserMessage(msgText),
        (chipText) => this.handleChipClick(chipText)
      );
    } else if (this.activeTab === 'plan') {
      WorkoutComponent.renderWorkoutCard(
        viewContainer,
        this.currentPlan,
        (workoutLog) => this.handleLogWorkout(workoutLog)
      );
    }
  }

  async handleUserMessage(text) {
    if (text.toLowerCase().includes('test push') || text.toLowerCase().includes('push test')) {
      await this.triggerTestPush();
      return;
    }

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.messages.push({ sender: 'user', text, time: timeStr });

    const thinkingMsgIndex = this.messages.length;
    this.messages.push({
      sender: 'agent',
      text: `🤖 *Thinking and customizing your plan with Gemini 2.0...*`,
      time: timeStr
    });
    this.renderActiveTab();

    const response = await AgentLogic.processUserMessage(text, null, this.profile, this.currentPlan, this.messages);

    if (response.updatedPlan) {
      this.currentPlan = response.updatedPlan;
    }

    this.messages[thinkingMsgIndex] = {
      sender: 'agent',
      text: response.text,
      plan: response.updatedPlan || null,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (response.quickChips) {
      this.quickChips = response.quickChips;
    }

    this.renderActiveTab();
  }

  handleChipClick(chipText) {
    if (chipText.includes('Test Push Alert') || chipText.includes('Push Ping')) {
      this.triggerTestPush();
    } else if (chipText.includes('🔑 Set Gemini Key') || chipText.includes('Check Gemini Key')) {
      this.openSettingsDrawer();
    } else if (chipText.includes('Show today\'s plan')) {
      this.activeTab = 'plan';
      document.querySelectorAll('.tab-btn').forEach(t => t.classList.toggle('active', t.dataset.tab === 'plan'));
      this.renderActiveTab();
    } else {
      this.handleUserMessage(chipText);
    }
  }

  openSettingsDrawer() {
    this.profile = Storage.getProfile();
    const modalContainer = document.getElementById('modal-container');
    ProfileComponent.renderModal(modalContainer, this.profile, () => {
      alert('⚙️ Settings saved successfully!');
      this.renderActiveTab();
    });
  }

  handleLogWorkout(workoutLog) {
    Storage.logCompletedWorkout(workoutLog);
    this.messages.push({
      sender: 'agent',
      text: `🎉 Awesome job completing **${workoutLog.title}**! Session logged to your history.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    this.activeTab = 'chat';
    document.querySelectorAll('.tab-btn').forEach(t => t.classList.toggle('active', t.dataset.tab === 'chat'));
    this.renderActiveTab();
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  window.app = new AdaptiveCoachApp();
});
