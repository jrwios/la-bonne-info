const CACHE = 'la-bonne-info-v14';
const SHELL = ['./', './index.html', './styles.css', './app.js', './live.js', './scenes.js', './features.js', './art.js', './maps.js', './vendor/leaflet/leaflet.js', './vendor/leaflet/leaflet.css', './manifest.webmanifest', './logo.svg', './icon-192.png', './icon-512.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL.map(u => new Request(u, {cache: 'reload'})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(Promise.all([clients.claim(), caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))]));
});
// Réseau d'abord pour tout : les mises à jour du site et de l'actualité s'affichent dès le premier chargement.
// Le cache ne sert que hors ligne (ou si le réseau échoue).
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  event.respondWith((async () => {
    try {
      const res = await fetch(request, {cache: 'no-cache'});
      if (res.ok) { const cache = await caches.open(CACHE); await cache.put(request, res.clone()); }
      return res;
    } catch (_) {
      const cached = await caches.match(request, {ignoreSearch: true});
      return cached || new Response('', {status: 503, statusText: 'Offline'});
    }
  })());
});
