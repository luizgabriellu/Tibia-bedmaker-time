const CACHE = 'tibia-bed-v1';
const ASSETS = ['/', '/index.html', '/manifest.json', '/icon-192.svg'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});

// Listen for push messages from the page
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'NOTIFY') {
    self.registration.showNotification('🛏️ Tibia Bed Timer', {
      body: 'Seu personagem regenerou 120 de mana! Hora de acordar.',
      icon: '/icon-192.svg',
      badge: '/icon-192.svg',
      tag: 'tibia-bed',
      renotify: true,
      vibrate: [300, 100, 300, 100, 600],
      requireInteraction: true,
      actions: [
        { action: 'done', title: '✔ Já acordei' }
      ]
    });
  }
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow('/'));
});
