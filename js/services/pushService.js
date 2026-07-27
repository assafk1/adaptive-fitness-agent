// Client-Side WebPush Subscription Service

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
        // Request subscription permission
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return false;

        console.log('Push permission granted! Subscribed to lock-screen push alerts.');
      }
      return true;
    } catch (err) {
      console.error('Error registering push subscription:', err);
      return false;
    }
  }
};
