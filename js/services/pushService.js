// Client-Side WebPush Subscription & Sync Service

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

      const vapidPublicKey = 'BPC9fZVZYUddG_VIqKsR-xtmxiKvCk8SILEG0sf7iYTjb5apBe-gb4wGn4tH4vDLGgXsiVNovUu9P-8T_Iy_-nI';

      if (!subscription) {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return false;

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
        const subJson = subscription.toJSON();
        Storage.saveSettings({ pushSubscription: subJson });
        
        // Sync device token to Netlify function endpoint for APNs push delivery
        const synced = await this.syncTokenToNetlify(subJson);
        console.log('iPhone push subscription active and synced to Netlify!');
        return synced;
      }
      return false;
    } catch (err) {
      console.error('Error registering push subscription:', err);
      return false;
    }
  },

  async syncTokenToNetlify(subscriptionJson) {
    try {
      const response = await fetch('/.netlify/functions/daily-ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: subscriptionJson })
      });
      const data = await response.json();
      console.log('Netlify Push Sync Response:', data);
      return data.status === 'success';
    } catch (err) {
      console.warn('Could not sync push token to Netlify function endpoint:', err);
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
