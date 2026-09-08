const CACHE_NAME = 'escale-concursos-cache-v2';

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/escale.jpg',
  '/imagem1.jpg'
];

// Instalação do Service Worker e atualização do cache
self.addEventListener('install', event => {
  self.skipWaiting(); // Força a ativação do novo Service Worker imediatamente
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptação de requisições
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Limpeza e destruição imediata de caches antigos (v1)
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName); // Apaga o cache v1 onde o manifest antigo estava preso
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});
