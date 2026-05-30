const CACHE_NAME = 'lmo-cache-v1';
const urlsToCache = [
  '/',
  '/dashboard',
  '/quran',
  '/arabic',
  '/styles/globals.css',
  // Ajoutez d'autres URLs statiques si besoin
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});