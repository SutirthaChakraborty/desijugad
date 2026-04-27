/* Desi Jugad — Service Worker (offline shell cache)
   Coexists with coi-serviceworker.js: this worker is only registered on
   pages that don't need SharedArrayBuffer (i.e. everything except the 6
   video-tool pages, which keep using coi-serviceworker.js).
   Strategy: stale-while-revalidate for static assets, network-first for HTML. */

const CACHE_VERSION = 'v1';
const SHELL_CACHE   = 'dj-shell-' + CACHE_VERSION;
const ASSET_CACHE   = 'dj-assets-' + CACHE_VERSION;
const RUNTIME_CACHE = 'dj-runtime-' + CACHE_VERSION;

const SHELL_FILES = [
  '/',
  '/index.html',
  '/404.html',
  '/manifest.webmanifest',
  '/assets/css/style.css',
  '/assets/js/main.js',
  '/assets/img/logo.png',
  '/assets/img/favicon-192.png',
  '/assets/img/favicon-512.png',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(SHELL_CACHE).then(c => c.addAll(SHELL_FILES).catch(() => {}))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter(k => k.startsWith('dj-') && !k.endsWith('-' + CACHE_VERSION))
      .map(k => caches.delete(k))
    );
    await self.clients.claim();
  })());
});

function isAsset(url) {
  return /\.(css|js|woff2?|ttf|otf|eot|png|jpg|jpeg|gif|svg|webp|avif|ico|json|webmanifest)$/i.test(url.pathname);
}
function isHTML(req) {
  return req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;            // skip cross-origin
  if (url.pathname.startsWith('/api/')) return;               // never cache API
  if (url.pathname.startsWith('/functions/')) return;         // historical, just in case

  if (isHTML(req)) {
    // Network-first for HTML; fall back to cache, then to /404.html
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const copy = fresh.clone();
        caches.open(RUNTIME_CACHE).then(c => c.put(req, copy)).catch(() => {});
        return fresh;
      } catch {
        const cached = await caches.match(req);
        if (cached) return cached;
        return (await caches.match('/404.html')) || new Response('Offline', { status: 503 });
      }
    })());
    return;
  }

  if (isAsset(url)) {
    // Stale-while-revalidate
    event.respondWith((async () => {
      const cache = await caches.open(ASSET_CACHE);
      const cached = await cache.match(req);
      const fetchAndCache = fetch(req).then(resp => {
        if (resp && resp.status === 200) cache.put(req, resp.clone()).catch(() => {});
        return resp;
      }).catch(() => cached);
      return cached || fetchAndCache;
    })());
  }
});
