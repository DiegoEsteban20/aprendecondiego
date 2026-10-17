import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const root = new URL('../', import.meta.url);
const destination = new URL('docs/', root);
await mkdir(destination, { recursive: true });
const filenames = (await readdir(new URL('public/', root))).filter(name => /\.(html|js|css|jpg|mp4|vtt)$/.test(name));
const outputs = new Map();
for (const filename of filenames) {
  if (/\.(jpg|mp4)$/.test(filename)) { outputs.set(filename, await readFile(new URL(`public/${filename}`, root))); continue; }
  let content = await readFile(new URL(`public/${filename}`, root), 'utf8');
  content = content.replace(/href="\/academy(?=["#])/g, 'href="./academy.html').replace(/href="\/guide(?=["#])/g, 'href="./guide.html').replace(/href="\/(?=["#])/g, 'href="./index.html').replace(/(href|src)="\/(?!\/)/g, '$1="./');
  if (filename.endsWith('.html')) {
    content = content.replace('</body>', '<script type="module" src="./offline.js"></script></body>');
    content = content.replace('<head>', '<head><meta http-equiv="Content-Security-Policy" content="default-src \'self\'; script-src \'self\'; style-src \'self\'; connect-src \'self\'; worker-src \'self\'; object-src \'none\'; base-uri \'none\'; form-action \'none\'">');
    content = content.replace('● &nbsp; DEMO INTERACTIVA', '● &nbsp; GRATIS · SIN CUENTA');
  }
  outputs.set(filename, content);
}
for (const filename of ['analyzer.js', 'cases.js']) outputs.set(filename, await readFile(new URL(`lib/${filename}`, root), 'utf8'));
outputs.set('offline.js', `if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js', { scope: './', updateViaCache: 'none' }).then(async registration => {
    await navigator.serviceWorker.ready;
    const status = document.createElement('p');
    status.className = 'footnote';
    status.textContent = 'Sin cuentas ni pagos. Aplicación preparada para uso sin conexión en este navegador; la caché puede eliminarse. Conserva también una copia descargada.';
    document.querySelector('footer')?.before(status);
    registration.update().catch(() => {});
  }).catch(() => {});
}
`);
const hash = createHash('sha256');
for (const [filename, content] of outputs) hash.update(filename).update(content);
const version = hash.digest('hex').slice(0, 16);
const resources = ['./', ...[...outputs.keys()].filter(name => !name.endsWith('.mp4')).map(name => `./${name}`)];
outputs.set('sw.js', `const cacheName = 'firewall-detective-${version}';
const resources = ${JSON.stringify(resources)};
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
`);
outputs.set('.nojekyll', '\n');
for (const [filename, content] of outputs) await writeFile(new URL(filename, destination), content, 'utf8');
console.log(`Sitio estático: docs/ · ${outputs.size} archivos · caché ${version}`);
