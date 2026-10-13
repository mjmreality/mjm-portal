// Service worker portálu nájemníků MJM.
// Stránky aplikace bere vždy nejdřív z internetu (aby nájemníci měli nejnovější verzi),
// uloženou kopii použije jen bez připojení. Data z Firebase sem nejdou vůbec.
const CACHE = 'mjm-v1';
const SHELL = ['./', './index.html', './navod.html', './manifest.webmanifest', './ikony/ikona-192.png', './ikony/ikona-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => { if (r.ok) { const k = r.clone(); caches.open(CACHE).then(c => c.put(e.request, k)); } return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html'))));
});
