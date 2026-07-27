// Netlify Scheduled Function: Daily WebPush Morning Alert

const webpush = require('web-push');

const VAPID_PUBLIC_KEY = 'BPC9fZVZYUddG_VIqKsR-xtmxiKvCk8SILEG0sf7iYTjb5apBe-gb4wGn4tH4vDLGgXsiVNovUu9P-8T_Iy_-nI';
const VAPID_PRIVATE_KEY = 'Usu2IShEwZGNihsKImmQ1bAfB6F4BDqo3IdUnsvgtCg';

webpush.setVapidDetails(
  'mailto:adaptive-coach@example.com',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

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
    body: JSON.stringify({ message: 'Daily push function executed successfully', timestamp: new Date().toISOString() })
  };
};
