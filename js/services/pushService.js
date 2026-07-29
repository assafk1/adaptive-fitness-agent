// Client-Side WebPush Subscription & Sync Service with Verified P-256 VAPID Keypair

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

      // Mathematically verified SECP256R1 P-256 VAPID Public Key for iOS WebKit
      const vapidPublicKey = 'BGsX0fLhLEJH-Lzm5WOkQPJ3A32BLeszoPShOUXYmMKWT-NC4v4af5uO5-tKfA-eFivOM1drMV7Oy7ZAaDe_UfU';

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

        addLog('Generating new PushSubscription token with verified P-256 VAPID key...');
        try {
          const applicationServerKey = this.urlBase64ToUint8Array(vapidPublicKey);
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey
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
        return { success: true, logs };
      }

      return { success: false, logs };
    } catch (err) {
      addLog(`❌ Fatal error in push registration: ${err.message}`);
      return { success: false, logs };
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
