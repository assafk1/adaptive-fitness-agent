// Main Application Controller

import { Storage } from './services/storage.js';
import { FitnessEngine } from './services/fitnessEngine.js';
import { AgentLogic } from './services/agentLogic.js';
import { NotificationManager } from './components/notifications.js';

import { ChatComponent } from './components/chat.js';
import { CheckInComponent } from './components/checkin.js';
import { WorkoutComponent } from './components/workout.js';
import { ProfileComponent } from './components/profile.js';
import { DashboardComponent } from './components/dashboard.js';
import { ApiKeyModalComponent } from './components/apiKeyModal.js';

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
  }

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js')
        .then(reg => console.log('Service Worker registered:', reg.scope))
        .catch(err => console.error('Service Worker registration failed:', err));
    }
  }

  loadTodayState() {
    if (this.todayCheckIn) {
      this.currentPlan = FitnessEngine.generateDailyPlan(this.todayCheckIn, this.profile);
    }

    const greeting = AgentLogic.getMorningGreeting(this.profile, !!this.todayCheckIn);
    this.messages.push({
      sender: 'agent',
      text: greeting.text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    this.quickChips = greeting.quickChips;

    if (this.currentPlan) {
      this.messages.push({
        sender: 'agent',
        text: `🎯 **Today's Adaptive Plan:** ${this.currentPlan.title} (${this.currentPlan.estimatedMinutes} Mins)\nReadiness Score: ${this.currentPlan.readinessScore}%`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }
  }

  initHeaderButtons() {
    const checkinBtn = document.getElementById('hdr-checkin-btn');
    const keyBtn = document.getElementById('hdr-key-btn');
    const pingBtn = document.getElementById('hdr-ping-btn');
    const profileBtn = document.getElementById('hdr-profile-btn');

    if (checkinBtn) checkinBtn.addEventListener('click', () => this.openCheckinModal());
    if (keyBtn) keyBtn.addEventListener('click', () => this.openApiKeyModal());

    if (pingBtn) {
      pingBtn.addEventListener('click', async () => {
        const granted = await NotificationManager.requestPermission();
        if (granted) {
          NotificationManager.sendTestNotification();
        } else {
          alert('Notifications requested! Check your device settings.');
        }
      });
    }

    if (profileBtn) profileBtn.addEventListener('click', () => this.openProfileModal());
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
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.messages.push({ sender: 'user', text, time: timeStr });

    // Show temporary thinking message
    const thinkingMsgIndex = this.messages.length;
    this.messages.push({
      sender: 'agent',
      text: '🤖 *Thinking and customizing your plan with Gemini AI...*',
      time: timeStr
    });
    this.renderActiveTab();

    const response = await AgentLogic.processUserMessage(text, this.todayCheckIn, this.profile, this.currentPlan, this.messages);

    // Replace thinking message with real Gemini response
    this.messages[thinkingMsgIndex] = {
      sender: 'agent',
      text: response.text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (response.quickChips) {
      this.quickChips = response.quickChips;
    }

    if (response.updatedPlan) {
      this.currentPlan = response.updatedPlan;
    }

    this.renderActiveTab();
  }

  handleChipClick(chipText) {
    if (chipText.includes('🔑 Set Gemini Key') || chipText.includes('Check Gemini Key')) {
      this.openApiKeyModal();
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

      // Trigger Gemini to summarize & customize checkin
      const promptText = `I completed my daily check-in: Energy ${checkInData.energyLevel}/10, Soreness ${checkInData.sorenessLevel}/10, Available time: ${checkInData.availableMinutes} mins, Sports today: ${checkInData.sportsToday.join(', ') || 'None'}. Please generate today's adaptive plan.`;
      await this.handleUserMessage(promptText);
    });
  }

  openApiKeyModal() {
    const modalContainer = document.getElementById('modal-container');
    ApiKeyModalComponent.renderModal(modalContainer, (newKey) => {
      this.messages.push({
        sender: 'agent',
        text: '🔑 **Gemini API Key Connected!** I am now powered by Google Gemini 2.5 Flash. Feel free to talk to me about any adjustments, soreness, or workout goals!',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      this.renderActiveTab();
    });
  }

  openProfileModal() {
    const modalContainer = document.getElementById('modal-container');
    ProfileComponent.renderModal(modalContainer, this.profile, (updatedProfile) => {
      this.profile = Storage.saveProfile(updatedProfile);
      alert('⚙️ Profile & equipment updated!');
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
