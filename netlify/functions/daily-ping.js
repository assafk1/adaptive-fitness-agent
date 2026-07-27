// Netlify Scheduled Function: Daily WebPush Morning Alert with Execution Logs & APNs Dispatch

const webpush = require('web-push');

const VAPID_PUBLIC_KEY = 'BPC9fZVZYUddG_VIqKsR-xtmxiKvCk8SILEG0sf7iYTjb5apBe-gb4wGn4tH4vDLGgXsiVNovUu9P-8T_Iy_-nI';
const VAPID_PRIVATE_KEY = 'Usu2IShEwZGNihsKImmQ1bAfB6F4BDqo3IdUnsvgtCg';

webpush.setVapidDetails(
  'mailto:adaptive-coach@example.com',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

// In-memory / stored subscription fallback container
let globalSubscriptionStore = null;

exports.handler = async (event, context) => {
  const timestamp = new Date().toISOString();
  console.log(`[DAILY-PING LOG ${timestamp}] 🚀 Netlify Scheduled Push Trigger Executed.`);

  // Handle incoming subscription registration HTTP POST request
  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body || '{}');
      if (body.subscription) {
        globalSubscriptionStore = body.subscription;
        console.log('[DAILY-PING LOG] ✅ Successfully received & registered iPhone push subscription token:', JSON.stringify(body.subscription));
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Push subscription token saved successfully!' })
        };
      }
    } catch (err) {
      console.error('[DAILY-PING LOG] ❌ Error parsing subscription payload:', err.message);
    }
  }

  // Handle Push Dispatch
  const payload = JSON.stringify({
    title: '🏃‍♂️ Adaptive Coach Morning Ping',
    body: "Good morning Assaf! How are you feeling today? Let's check in and align today's workout.",
    icon: 'icons/icon-192.png',
    badge: 'icons/icon-192.png',
    tag: 'daily-ping-scheduled'
  });

  if (!globalSubscriptionStore) {
    console.warn('[DAILY-PING LOG] ⚠️ No active iPhone push subscription endpoint found in memory store. Send an update from app first.');
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        status: 'warning',
        message: 'Function executed, but no device subscription token registered yet. Open the app on your iPhone and tap 🔔 Push Ping to register your device.',
        timestamp 
      })
    };
  }

  try {
    console.log('[DAILY-PING LOG] 📡 Dispatching WebPush notification via Apple APNs to endpoint:', globalSubscriptionStore.endpoint);
    const result = await webpush.sendNotification(globalSubscriptionStore, payload);
    console.log('[DAILY-PING LOG] 🎉 Apple APNs Push Delivery Success! Response Status:', result.statusCode);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        status: 'success',
        message: 'Lock-screen push notification sent successfully via APNs!',
        apnsStatus: result.statusCode,
        timestamp 
      })
    };
  } catch (pushErr) {
    console.error('[DAILY-PING LOG] ❌ APNs Push Delivery Failed:', pushErr);
    return {
      statusCode: 500,
      body: JSON.stringify({ status: 'error', error: pushErr.message, timestamp })
    };
  }
};
