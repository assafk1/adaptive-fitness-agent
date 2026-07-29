// Service Worker for Adaptive Coach PWA & iOS Native Push Notifications

const CACHE_NAME = 'adaptive-coach-v7';
const ASSETS_TO_CACHE = [
  './',
  './index.html?v=7',
  './css/styles.css?v=7',
  './js/app.js?v=7',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Deleting old Service Worker cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Network-first fetch strategy to ensure fresh updates are always loaded
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).then(response => {
      const responseClone = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
      return response;
    }).catch(() => caches.match(event.request))
  );
});

// Push Notification Listener for iOS Native Notifications
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || '🏃‍♂️ Adaptive Coach Morning Ping';
  const options = {
    body: data.body || "Good morning! How are you feeling today? Let's align today's workout.",
    icon: 'icons/icon-192.png',
    badge: 'icons/icon-192.png',
    tag: 'daily-ping-push'
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('./index.html')
  );
});
