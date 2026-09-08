const CACHE_NAME = 'f1-p2p-v1';
const ASSETS = [
  './',
  './index.html',
  './wheel.svg',
  './manifest.json',
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
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE_NAME ? caches.delete(k) : null))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(c => c || fetch(e.request)));
});
