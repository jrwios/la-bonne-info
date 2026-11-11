const CACHE = 'la-bonne-info-v7';
const SHELL = ['./', './index.html', './styles.css', './app.js', './live.js', './manifest.webmanifest', './logo.svg', './icon-192.png', './icon-512.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL.map(u => new Request(u, {cache: 'reload'})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(Promise.all([clients.claim(), caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))]));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  const isData = url.pathname.includes('/data/');
  event.respondWith((async () => {
    // Réseau d'abord pour l'actualité, jamais de substitution d'un jour à l'autre sans avertissement côté app.
    if (isData) {
      try {
        const res = await fetch(request);
        if (res.ok) { const cache = await caches.open(CACHE); await cache.put(request, res.clone()); }
        return res;
      } catch (_) {
        return (await caches.match(request)) || new Response('', {status: 503, statusText:'Offline'});
      }
    }
    return (await caches.match(request)) || fetch(request).then(async response => {
      if (response.ok) (await caches.open(CACHE)).put(request, response.clone());
      return response;
    });
  })());
});
