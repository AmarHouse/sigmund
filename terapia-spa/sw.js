const CACHE = 'sigmund-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/sigmund.webp',
  '/avatar.webp',
  '/user-avatar.png',
  '/manifest.json',
  '/css/variables.css',
  '/css/base.css',
  '/css/layout.css',
  '/css/chat.css',
  '/css/components.css',
  '/js/utils.js',
  '/js/crypto.js',
  '/js/stripe.js',
  '/js/dashboard.js',
  '/js/onboarding.js',
  '/js/session.js',
  '/js/prompts.js',
  '/js/router.js',
  '/js/chat.js',
  '/js/api.js',
  '/js/app.js',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.url.includes('/api/')) return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      const fetched = fetch(event.request).then(resp => {
        const clone = resp.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, clone));
        return resp;
      });
      return cached || fetched;
    }).catch(() => caches.match('/'))
  );
});

self.addEventListener('push', event => {
  const data = event.data?.json() || { title: 'SIGMUND', body: 'Sua sessão de hoje está disponível.' };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/sigmund.webp',
      badge: '/sigmund.webp',
      vibrate: [100, 50, 100],
    })
  );
});
