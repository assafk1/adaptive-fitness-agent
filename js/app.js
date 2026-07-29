// Main Application Controller - Mobile-First Architecture

import { Storage } from './services/storage.js';
import { FitnessEngine } from './services/fitnessEngine.js';
import { AgentLogic } from './services/agentLogic.js';
import { NotificationManager } from './components/notifications.js';
import { PushService } from './services/pushService.js';

import { ChatComponent } from './components/chat.js';
import { CheckInComponent } from './components/checkin.js';
import { WorkoutComponent } from './components/workout.js';
import { ProfileComponent } from './components/profile.js';
import { DashboardComponent } from './components/dashboard.js';

class AdaptiveCoachApp {
  constructor() {
    this.profile = Storage.getProfile();
    this.todayCheckIn = Storage.getTodayCheckIn();
    this.currentPlan = null;
    this.messages = [];
    this.quickChips = [];
    this.activeTab = 'chat';

    this.init();
  }

  init() {
    this.registerServiceWorker();
    this.loadTodayState();
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

  loadTodayState() {
    this.profile = Storage.getProfile();
    if (this.todayCheckIn) {
      this.currentPlan = FitnessEngine.generateDailyPlan(this.todayCheckIn, this.profile);
    }

    const greeting = AgentLogic.getMorningGreeting(this.profile, !!this.todayCheckIn);
    this.messages.push({
      sender: 'agent',
      text: greeting.text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    this.quickChips = [...greeting.quickChips, '🔔 Test Push Alert'];

    if (this.currentPlan) {
      this.messages.push({
        sender: 'agent',
        text: `🎯 **Today's Adaptive Plan:** ${this.currentPlan.title} (${this.currentPlan.estimatedMinutes} Mins)\nReadiness Score: ${this.currentPlan.readinessScore}%`,
        plan: this.currentPlan,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }
  }

  initHeaderButtons() {
    const checkinBtn = document.getElementById('hdr-checkin-btn');
    const settingsBtn = document.getElementById('hdr-settings-btn');

    if (checkinBtn) checkinBtn.addEventListener('click', () => this.openCheckinModal());
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
        (chipText) => this.handleChipClick(chipText),
        () => this.openCheckinModal()
      );
    } else if (this.activeTab === 'plan') {
      WorkoutComponent.renderWorkoutCard(
        viewContainer,
        this.currentPlan,
        (workoutLog) => this.handleLogWorkout(workoutLog)
      );
    } else if (this.activeTab === 'dashboard') {
      const checkIns = Storage.getCheckIns();
      const logs = Storage.getWorkoutLogs();
      DashboardComponent.render(viewContainer, checkIns, logs);
    }
  }

  async handleUserMessage(text) {
    if (text.toLowerCase().includes('test push') || text.toLowerCase().includes('push test')) {
      await this.triggerTestPush();
      return;
    }

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.messages.push({ sender: 'user', text, time: timeStr });

    const selectedModel = AgentLogic.getSelectedModel();
    const thinkingMsgIndex = this.messages.length;
    this.messages.push({
      sender: 'agent',
      text: `🤖 *Thinking and customizing your plan with ${selectedModel}...*`,
      time: timeStr
    });
    this.renderActiveTab();

    const response = await AgentLogic.processUserMessage(text, this.todayCheckIn, this.profile, this.currentPlan, this.messages);

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
    } else if (chipText.includes('Check-in') || chipText.includes('Start Daily')) {
      this.openCheckinModal();
    } else if (chipText.includes('Show today\'s plan')) {
      this.activeTab = 'plan';
      document.querySelectorAll('.tab-btn').forEach(t => t.classList.toggle('active', t.dataset.tab === 'plan'));
      this.renderActiveTab();
    } else {
      this.handleUserMessage(chipText);
    }
  }

  openCheckinModal() {
    const modalContainer = document.getElementById('modal-container');
    CheckInComponent.renderModal(modalContainer, this.todayCheckIn, async (checkInData) => {
      this.todayCheckIn = Storage.saveDailyCheckIn(checkInData);
      this.currentPlan = FitnessEngine.generateDailyPlan(this.todayCheckIn, this.profile);

      const promptText = `I completed my daily check-in: Energy ${checkInData.energyLevel}/10, Soreness ${checkInData.sorenessLevel}/10, Available time: ${checkInData.availableMinutes} mins, Sports today: ${checkInData.sportsToday.join(', ') || 'None'}. Please generate today's adaptive plan.`;
      await this.handleUserMessage(promptText);
    });
  }

  openSettingsDrawer() {
    this.profile = Storage.getProfile();
    const modalContainer = document.getElementById('modal-container');
    ProfileComponent.renderModal(modalContainer, this.profile, (updatedProfile) => {
      this.profile = Storage.saveProfile(updatedProfile);
      alert('⚙️ All settings & profile saved!');
      this.renderActiveTab();
    });
  }

  handleLogWorkout(workoutLog) {
    Storage.logCompletedWorkout(workoutLog);
    this.messages.push({
      sender: 'agent',
      text: `🎉 Awesome job completing **${workoutLog.title}**! Session logged to your analytics timeline.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    this.activeTab = 'dashboard';
    document.querySelectorAll('.tab-btn').forEach(t => t.classList.toggle('active', t.dataset.tab === 'dashboard'));
    this.renderActiveTab();
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  window.app = new AdaptiveCoachApp();
});
