// Service worker mínimo — existe principalmente para o Android reconhecer
// o portal como um app instalável de verdade (WebAPK), com mais confiança
// do que a versão anterior registrada via Blob.
const CACHE_NAME = 'portal-cargas-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Estratégia "network first": sempre tenta buscar a versão mais recente da rede
// (os dados da planilha mudam o tempo todo); só usa cache se a rede falhar.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
