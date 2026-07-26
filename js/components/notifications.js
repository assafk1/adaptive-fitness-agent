// PWA & iOS Push Notifications Manager

export const NotificationManager = {
  isSupported() {
    return 'Notification' in window && 'serviceWorker' in navigator;
  },

  getPermissionState() {
    if (!('Notification' in window)) return 'unsupported';
    return Notification.permission; // 'default', 'granted', 'denied'
  },

  async requestPermission() {
    if (!this.isSupported()) {
      alert('Notifications are not supported in this browser. To use push notifications on iPhone, tap Share -> Add to Home Screen first.');
      return false;
    }

    try {
      const permission = await Notification.permissionState ? await Notification.requestPermission() : await Notification.requestPermission();
      if (permission === 'granted') {
        this.scheduleDailyMorningPing();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error requesting notification permission:', err);
      return false;
    }
  },

  scheduleDailyMorningPing() {
    if (this.getPermissionState() !== 'granted') return;

    // Register background service worker push or local interval check
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        console.log('Service Worker ready for push & daily reminders');
      });
    }
  },

  sendTestNotification() {
    if (this.getPermissionState() !== 'granted') {
      alert('Please enable notifications first!');
      return;
    }

    const title = '🏃‍♂️ Adaptive Coach Morning Ping';
    const options = {
      body: "Good morning! How are you feeling today? Let's check in and align today's workout.",
      icon: 'icons/icon-192.png',
      badge: 'icons/icon-192.png',
      vibrate: [200, 100, 200],
      tag: 'daily-ping'
    };

    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then(reg => {
        reg.showNotification(title, options);
      });
    } else {
      new Notification(title, options);
    }
  }
};
