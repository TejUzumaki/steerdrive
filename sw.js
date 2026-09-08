const CACHE_NAME = 'aerof1-v4';

const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './wheel.svg',

    './assets/scene.gltf',
    './assets/scene.bin',

    './assets/textures/Meshpart1Mtl_baseColor.png',
    './assets/textures/Meshpart2Mtl.004_baseColor.png',
    './assets/textures/Meshpart4Mtl_baseColor.png',
    './assets/textures/Meshpart5Mtl_baseColor.png',
    './assets/textures/Meshpart6Mtl_baseColor.png',
    './assets/textures/Meshpart7Mtl_baseColor.png',

    './vendor/three.module.js',
    './vendor/GLTFLoader.js',
    './vendor/hands.js',
    './vendor/drawing_utils.js',
    './vendor/hand_landmark_full.tflite',
    './vendor/hands_solution_packed_assets.data'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then(cached => {
            if (cached) return cached;

            return fetch(event.request).then(response => {
                if (response.ok) {
                    const copy = response.clone();

                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, copy);
                    });
                }

                return response;
            });
        })
    );
});
