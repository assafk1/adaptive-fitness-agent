// Netlify Scheduled Function: Daily WebPush Morning Alert with Netlify Blobs Token Persistence

const webpush = require('web-push');
const { getStore } = require('@netlify/blobs');

const VAPID_PUBLIC_KEY = 'BPC9fZVZYUddG_VIqKsR-xtmxiKvCk8SILEG0sf7iYTjb5apBe-gb4wGn4tH4vDLGgXsiVNovUu9P-8T_Iy_-nI';
const VAPID_PRIVATE_KEY = 'Usu2IShEwZGNihsKImmQ1bAfB6F4BDqo3IdUnsvgtCg';

webpush.setVapidDetails(
  'mailto:adaptive-coach@example.com',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

exports.handler = async (event, context) => {
  const timestamp = new Date().toISOString();
  console.log(`[DAILY-PING LOG ${timestamp}] 🚀 Netlify Scheduled Push Trigger Executed. Method: ${event.httpMethod}`);

  // Get Netlify Blobs store
  let store;
  try {
    store = getStore('push-tokens');
  } catch (e) {
    console.warn('[DAILY-PING LOG] Netlify Blobs getStore notice:', e.message);
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Handle incoming subscription registration HTTP POST request from iPhone app
  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body || '{}');
      if (body.subscription) {
        if (store) {
          await store.set('iphone_device', JSON.stringify(body.subscription));
          console.log('[DAILY-PING LOG] ✅ Saved iPhone device push subscription to Netlify Blobs!');
        }
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ status: 'success', message: 'iPhone Push Token registered & saved to Netlify Blobs!' })
        };
      }
    } catch (err) {
      console.error('[DAILY-PING LOG] ❌ Error parsing subscription payload:', err.message);
      return { statusCode: 400, headers, body: JSON.stringify({ error: err.message }) };
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

  let subscriptionJson = null;
  if (store) {
    try {
      subscriptionJson = await store.get('iphone_device');
    } catch (e) {
      console.log('[DAILY-PING LOG] Store read error:', e.message);
    }
  }

  if (!subscriptionJson) {
    console.warn('[DAILY-PING LOG] ⚠️ No active iPhone push subscription token registered in Netlify Blobs. Open app on iPhone and tap 🔔 Push Ping.');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        status: 'warning',
        message: 'No device token registered in Netlify Blobs yet. Open app on iPhone and tap 🔔 Push Ping.',
        timestamp 
      })
    };
  }

  try {
    const subscription = JSON.parse(subscriptionJson);
    console.log('[DAILY-PING LOG] 📡 Dispatching WebPush notification via Apple APNs to endpoint:', subscription.endpoint);
    
    const result = await webpush.sendNotification(subscription, payload);
    console.log('[DAILY-PING LOG] 🎉 Apple APNs Push Delivery Success! Response Status:', result.statusCode);

    return {
      statusCode: 200,
      headers,
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
      headers,
      body: JSON.stringify({ status: 'error', error: pushErr.message, timestamp })
    };
  }
};
