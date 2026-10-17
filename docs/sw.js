const cacheName = 'firewall-detective-17500611da8bf9a5';
const resources = ["./","./academy-data.js","./academy.css","./academy.html","./academy.js","./app.js","./guide.html","./guide.js","./help.js","./index.html","./manual.css","./style.css","./visuals-data.js","./visuals.css","./visuals.html","./visuals.js","./analyzer.js","./cases.js","./offline.js"];
const resourceURLs = new Set(resources.map(path => new URL(path, self.registration.scope).href));
self.addEventListener('install', event => event.waitUntil(caches.open(cacheName).then(cache => cache.addAll(resources))));
self.addEventListener('activate', event => event.waitUntil(Promise.all([
  caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('firewall-detective-') && key !== cacheName).map(key => caches.delete(key)))),
  self.clients.claim()
])));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  url.search = '';
  if (!resourceURLs.has(url.href)) return;
  event.respondWith(caches.open(cacheName).then(async cache => (await cache.match(url.href)) || fetch(event.request)));
});
