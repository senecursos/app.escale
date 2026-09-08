const CACHE_NAME = 'escale-concursos-cache-v5';

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json?v=3',
  '/escale.jpg',
  '/imagem1.jpg'
];

// Instalação do Service Worker e precache inicial
self.addEventListener('install', event => {
  self.skipWaiting(); // Assume o controle imediatamente sem esperar reiniciar
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Estratégia NETWORK FIRST: Busca direto do GitHub/Servidor primeiro
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // Se encontrou no servidor com sucesso, atualiza o cache local e entrega a nova versão
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Se estiver sem conexão (offline), entrega o arquivo salvo no cache local
        return caches.match(event.request);
      })
  );
});

// Limpeza e destruição de caches das versões anteriores
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName); // Deleta v1, v2, v3, v4 antigos
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});
