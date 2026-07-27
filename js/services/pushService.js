// Client-Side WebPush Subscription & Sync Service with Comprehensive Debug Logging

import { Storage } from './storage.js';

export const PushService = {
  async registerSubscription() {
    const logs = [];
    const addLog = (msg) => {
      console.log(`[PUSH-DEBUG] ${msg}`);
      logs.push(msg);
    };

    addLog('Starting iPhone push registration check...');

    if (!('serviceWorker' in navigator)) {
      addLog('❌ ServiceWorker not supported on this browser.');
      return { success: false, logs };
    }

    if (!('PushManager' in window)) {
      addLog('❌ PushManager not supported in this window context. (Make sure app is added to iOS Home Screen).');
      return { success: false, logs };
    }

    try {
      addLog('Waiting for ServiceWorker ready state...');
      const registration = await navigator.serviceWorker.ready;
      addLog(`ServiceWorker active: ${registration.scope}`);

      let subscription = await registration.pushManager.getSubscription();

      const vapidPublicKey = 'BPC9fZVZYUddG_VIqKsR-xtmxiKvCk8SILEG0sf7iYTjb5apBe-gb4wGn4tH4vDLGgXsiVNovUu9P-8T_Iy_-nI';

      if (subscription) {
        addLog('Existing push subscription token found on device.');
      } else {
        addLog(`Notification permission state: ${Notification.permission}`);
        const permission = await Notification.requestPermission();
        addLog(`New notification permission result: ${permission}`);

        if (permission !== 'granted') {
          addLog('❌ User denied notification permission.');
          return { success: false, logs };
        }

        addLog('Generating new PushSubscription token with VAPID key...');
        try {
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey)
          });
          addLog('✅ PushSubscription token generated successfully!');
        } catch (subErr) {
          addLog(`❌ pushManager.subscribe failed: ${subErr.message}`);
          return { success: false, logs };
        }
      }

      if (subscription) {
        const subJson = subscription.toJSON();
        Storage.saveSettings({ pushSubscription: subJson });
        addLog('Saved token to local storage.');

        addLog('Sending POST request to Netlify sync endpoint (/.netlify/functions/daily-ping)...');
        const syncResult = await this.syncTokenToNetlify(subJson, addLog);

        return { success: syncResult, logs };
      }

      return { success: false, logs };
    } catch (err) {
      addLog(`❌ Fatal error in push registration: ${err.message}`);
      return { success: false, logs };
    }
  },

  async syncTokenToNetlify(subscriptionJson, addLog) {
    try {
      const response = await fetch('/.netlify/functions/daily-ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: subscriptionJson })
      });

      addLog(`Netlify sync HTTP status: ${response.status}`);
      const data = await response.json();
      addLog(`Netlify sync response payload: ${JSON.stringify(data)}`);

      return response.ok && data.status === 'success';
    } catch (err) {
      addLog(`❌ Sync request to Netlify failed: ${err.message}`);
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
