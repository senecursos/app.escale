const CACHE_NAME = 'escale-concursos-cache-v1';

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/escale.jpg',
  '/imagem1.jpg'
];

// Instalação do Service Worker e adição dos arquivos ao cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptação de requisições: serve do cache primeiro, ou busca na rede se não encontrar
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

// Limpeza de caches antigos quando houver atualização de versão
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
