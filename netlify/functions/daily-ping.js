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
  console.log(`[DAILY-PING LOG ${timestamp}] 🚀 Netlify Scheduled Push Trigger Executed.`);

  const store = getStore({ name: 'push-tokens', siteID: process.env.SITE_ID, token: process.env.NETLIFY_PURPOSE_TOKEN });

  // Handle incoming subscription registration HTTP POST request from iPhone app
  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body || '{}');
      if (body.subscription) {
        await store.set('iphone_device', JSON.stringify(body.subscription));
        console.log('[DAILY-PING LOG] ✅ Saved iPhone device push subscription to Netlify Blobs!');
        return {
          statusCode: 200,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ message: 'Push subscription token saved to Netlify Blobs persistently!' })
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

  let subscriptionJson = null;
  try {
    subscriptionJson = await store.get('iphone_device');
  } catch (e) {
    console.log('[DAILY-PING LOG] Reading store fallback:', e.message);
  }

  if (!subscriptionJson) {
    console.warn('[DAILY-PING LOG] ⚠️ No active iPhone push subscription token registered yet. Open the app on your iPhone and tap 🔔 Push Ping.');
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        status: 'warning',
        message: 'No device token registered yet. Open app on iPhone and tap 🔔 Push Ping.',
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
