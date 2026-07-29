// GitHub Actions Daily WebPush Execution Script

const webpush = require('web-push');

const VAPID_PUBLIC_KEY = 'BPC9fZVZYUddG_VIqKsR-xtmxiKvCk8SILEG0sf7iYTjb5apBe-gb4wGn4tH4vDLGgXsiVNovUu9P-8T_Iy_-nI';
const VAPID_PRIVATE_KEY = 'Usu2IShEwZGNihsKImmQ1bAfB6F4BDqo3IdUnsvgtCg';

webpush.setVapidDetails(
  'mailto:adaptive-coach@example.com',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

console.log('⏰ Running GitHub Actions Daily Push Ping Script at:', new Date().toISOString());

const payload = JSON.stringify({
  title: '🏃‍♂️ Adaptive Coach Morning Ping',
  body: "Good morning Assaf! How are you feeling today? Let's check in and align today's workout.",
  icon: 'icons/icon-192.png',
  badge: 'icons/icon-192.png',
  tag: 'daily-ping-github-actions'
});

async function run() {
  const tokenEnv = process.env.IPHONE_PUSH_TOKEN;

  if (!tokenEnv) {
    console.warn('⚠️ No IPHONE_PUSH_TOKEN secret found in GitHub Secrets. Please add IPHONE_PUSH_TOKEN to GitHub Repository Secrets.');
    return;
  }

  try {
    const subscription = JSON.parse(tokenEnv);
    console.log('📡 Dispatching WebPush payload via Apple APNs to endpoint:', subscription.endpoint);
    const result = await webpush.sendNotification(subscription, payload);
    console.log('🎉 Apple APNs Push Delivery Success! Response Status:', result.statusCode);
  } catch (err) {
    console.error('❌ Failed to deliver push notification via APNs:', err);
    process.exit(1);
  }
}

run();
