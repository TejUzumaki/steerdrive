const CACHE_NAME = 'holodrive-v1';
const MODEL_CACHE = 'holodrive-models-v1';
const SHELL_ASSETS = ['./', './index.html', './wheel.svg', './icon.svg', './manifest.json'];
const MODEL_ASSETS = [
  './assets/scene.gltf',
  './assets/scene.bin',
  './assets/textures/Meshpart1Mtl_baseColor.png',
  './assets/textures/Meshpart2Mtl.004_baseColor.png',
  './assets/textures/Meshpart4Mtl_baseColor.png',
  './assets/textures/Meshpart5Mtl_baseColor.png',
  './assets/textures/Meshpart6Mtl_baseColor.png',
  './assets/textures/Meshpart7Mtl_baseColor.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL_ASSETS))
      .then(() => caches.open(MODEL_CACHE).then(cache => cache.addAll(MODEL_ASSETS)))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => {
      if (k !== CACHE_NAME && k !== MODEL_CACHE) return caches.delete(k);
    }))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);

  if (req.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname.endsWith('.js') || url.pathname.endsWith('.json')) {
    e.respondWith(
      fetch(req).then(resp => {
        const clone = resp.clone();
        caches.open(CACHE_NAME).then(c => c.put(req, clone));
        return resp;
      }).catch(() => caches.match(req))
    );
  } else if (url.pathname.includes('/assets/')) {
    e.respondWith(
      caches.match(req).then(cached => {
        return cached || fetch(req).then(resp => {
          const clone = resp.clone();
          caches.open(MODEL_CACHE).then(c => c.put(req, clone));
          return resp;
        });
      })
    );
  } else {
    e.respondWith(caches.match(req).then(c => c || fetch(req)));
  }
});
