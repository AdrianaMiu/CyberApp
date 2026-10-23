const BUILD = '__BUILD__';
const SHELL_CACHE = `cyberquiz-shell-${BUILD}`;
const DATA_CACHE = 'cyberquiz-data';
const SCOPE_PATH = new URL('./', self.registration.scope).pathname;

const relPath = (url) => new URL(url, self.registration.scope).pathname.slice(SCOPE_PATH.length);

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL_CACHE);
    let list = ['./'];
    try {
      const res = await fetch('precache.json', { cache: 'no-cache' });
      if (res.ok) list = await res.json();
    } catch (e) {
      // no precache list (dev server): runtime caching still fills the shell cache
    }
    await cache.addAll(list);
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    for (const name of await caches.keys()) {
      if (name !== SHELL_CACHE && name !== DATA_CACHE) await caches.delete(name);
    }
    await self.clients.claim();
  })());
});

async function cacheFirst(request, cacheName) {
  const hit = await caches.match(request, { ignoreSearch: request.mode === 'navigate' });
  if (hit) return hit;
  if (request.mode === 'navigate') {
    const shell = await caches.match('./');
    if (shell) return shell;
  }
  const res = await fetch(request);
  if (res.ok) (await caches.open(cacheName)).put(request, res.clone());
  return res;
}

async function networkFirst(request, cacheName) {
  try {
    const res = await fetch(request);
    if (res.ok) (await caches.open(cacheName)).put(request, res.clone());
    return res;
  } catch (e) {
    const hit = await caches.match(request);
    if (hit) return hit;
    throw e;
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  const path = relPath(request.url);
  if (path === 'data/index.json') event.respondWith(networkFirst(request, DATA_CACHE));
  else if (path.startsWith('data/')) event.respondWith(cacheFirst(request, DATA_CACHE));
  else event.respondWith(cacheFirst(request, SHELL_CACHE));
});

async function precacheData(urls) {
  const cache = await caches.open(DATA_CACHE);
  await Promise.all(urls.map((u) => cache.add(u).catch(() => {})));
}

async function pruneData(keep) {
  const wanted = new Set(keep.map((u) => new URL(u, self.registration.scope).href));
  const cache = await caches.open(DATA_CACHE);
  for (const request of await cache.keys()) {
    if (!wanted.has(request.url)) await cache.delete(request);
  }
}

self.addEventListener('message', (event) => {
  const msg = event.data || {};
  if (msg.type === 'skip-waiting') self.skipWaiting();
  else if (msg.type === 'precache-data') event.waitUntil(precacheData(msg.urls || []));
  else if (msg.type === 'prune-data') event.waitUntil(pruneData(msg.keep || []));
});
