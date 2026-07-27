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

// Payload for iPhone Lock-screen Alert
const payload = JSON.stringify({
  title: '🏃‍♂️ Adaptive Coach Morning Ping',
  body: "Good morning Assaf! How are you feeling today? Let's check in and align today's workout.",
  icon: 'icons/icon-192.png',
  badge: 'icons/icon-192.png',
  tag: 'daily-ping-github-actions'
});

console.log('🎉 GitHub Actions Daily Push Workflow Ready!');
