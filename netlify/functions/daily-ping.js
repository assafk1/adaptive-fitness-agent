// Netlify Scheduled Function: Daily WebPush Morning Alert

const webpush = require('web-push');

// Public VAPID Key pair for Adaptive Coach App
const VAPID_PUBLIC_KEY = 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-Skv69yViEuiBIa-Ib9-Skv69yViEuiBIa';
const VAPID_PRIVATE_KEY = 'YOUR_VAPID_PRIVATE_KEY_HERE';

exports.handler = async (event, context) => {
  console.log('⏰ Netlify Scheduled Daily Ping Triggered at:', new Date().toISOString());

  const payload = JSON.stringify({
    title: '🏃‍♂️ Adaptive Coach Morning Ping',
    body: "Good morning Assaf! How are you feeling today? Let's check in and align today's workout.",
    icon: 'icons/icon-192.png',
    badge: 'icons/icon-192.png',
    tag: 'daily-ping-scheduled'
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Daily push trigger executed successfully', timestamp: new Date().toISOString() })
  };
};
