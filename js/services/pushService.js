// Client-Side WebPush Subscription Service for iOS PWA

import { Storage } from './storage.js';

export const PushService = {
  async registerSubscription() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('PushManager not supported on this device/browser.');
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return false;

        // Public VAPID Key
        const vapidPublicKey = 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-Skv69yViEuiBIa-Ib9-Skv69yViEuiBIa';
        
        try {
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey)
          });
        } catch (e) {
          console.log('Push subscription registration notice:', e);
        }
      }

      if (subscription) {
        Storage.saveSettings({ pushSubscription: subscription.toJSON() });
        console.log('iPhone push subscription active!');
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error registering push subscription:', err);
      return false;
    }
  },

  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
};
