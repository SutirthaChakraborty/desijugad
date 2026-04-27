/*! coi-serviceworker v0.1.7 - Guido Zuidhof, licensed under MIT */
// Injects Cross-Origin-Embedder-Policy and Cross-Origin-Opener-Policy headers
// at the service-worker level so SharedArrayBuffer works on GitHub Pages.
// Source: https://github.com/gzuidhof/coi-serviceworker

if (typeof window === 'undefined') {
  // ---- SERVICE WORKER SCOPE ----
  self.addEventListener('install', () => self.skipWaiting());
  self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

  async function handleFetch(request) {
    if (request.cache === 'only-if-cached' && request.mode !== 'same-origin') return;
    let r;
    try { r = await fetch(request); } catch (e) { return fetch(request); }

    if (r.status === 0) return r;
    const headers = new Headers(r.headers);
    headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
    headers.set('Cross-Origin-Opener-Policy', 'same-origin');
    headers.set('Cross-Origin-Resource-Policy', 'cross-origin');
    return new Response(r.body, { status: r.status, statusText: r.statusText, headers });
  }

  self.addEventListener('fetch', e => {
    if (e.request.url.startsWith(self.location.origin)) {
      e.respondWith(handleFetch(e.request));
    }
  });

} else {
  // ---- WINDOW SCOPE ----
  (async function () {
    if (window.crossOriginIsolated !== false) return;
    if (!('serviceWorker' in navigator)) return;

    const registration = await navigator.serviceWorker.register(
      window.document.currentScript.src
    ).catch(console.error);

    if (!registration) return;

    await navigator.serviceWorker.ready;

    // Reload only once to activate the headers
    if (!sessionStorage.getItem('coiReloaded')) {
      sessionStorage.setItem('coiReloaded', '1');
      location.reload();
    }
  })();
}
