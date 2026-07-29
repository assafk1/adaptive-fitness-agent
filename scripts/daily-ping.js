// GitHub Actions Daily WebPush Execution Script with Verified P-256 VAPID Keypair

const webpush = require('web-push');

const VAPID_PUBLIC_KEY = 'BGsX0fLhLEJH-Lzm5WOkQPJ3A32BLeszoPShOUXYmMKWT-NC4v4af5uO5-tKfA-eFivOM1drMV7Oy7ZAaDe_UfU';
const VAPID_PRIVATE_KEY = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE';

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
