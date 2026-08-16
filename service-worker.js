const CACHE_NAME = 'siempre-humilde-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/service.html',
  '/jupe.html',
  '/montre.html',
  '/pagne.html',
  '/talon.html',
  '/veste.html',
  '/veston.html',
  '/contact.html',
  '/bijoux.html',
  '/chaussure.html',
  '/chapau.html',
  '/offline.html',
  '/images',
  '/images/icon-192.png',  // <-- Chemin corrigé
  '/images/icon-512.png'   // <-- Chemin corrigé
  // Ajoute ici ton CSS, JS, et images produits quand tu en auras
];

// Installation : on met tout en cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache SIEMPRE HULIDE ouvert');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Activation : on supprime les anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Ancien cache supprimé:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Stratégie : Internet d'abord, sinon Cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // On met la nouvelle version en cache
        if (event.request.method === 'GET') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Si pas internet, on prend dans le cache
        return caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Si c'est une page, on montre offline.html
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
          });
      })
  );
});