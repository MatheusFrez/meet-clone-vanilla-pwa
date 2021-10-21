const CACHE_APP_ATUAL = 'meet-cefet-v1';

self.addEventListener('install', onInstall);

self.addEventListener('active', onActivate);

self.addEventListener('fetch', onFetch);

//#region instalação

var appCache;

async function onInstall(event) {
   event.waitUntil(montarCache());
}

async function montarCache() {
   appCache = await caches.open(CACHE_APP_ATUAL);

   self.skipWaiting();

   return appCache.addAll([
      '/',
      './index.html',
      './assets/img/logo-192x192.png',
      './assets/img/logo-512x512.png',
      './assets/img/logo.png',
      './assets/img/logo.svg',
      './assets/css/app.css',
      './meet.webmanifest',
      './index.js',
      './service-worker.js',
      './assets/svgs/close.svg',
      './assets/svgs/camera-video.svg',
      './assets/svgs/chat.svg',
      './assets/svgs/add-person.svg',
      './assets/svgs/display-screen.svg',
      './assets/svgs/exit-fullscreen.svg',
      './assets/svgs/exit-telephone.svg',
      './assets/svgs/fullscreen.svg',
      './assets/svgs/info.svg',
      './assets/svgs/person.svg',
      './assets/svgs/picture-in-picture.svg',
      './assets/svgs/ping.svg',
      './assets/svgs/shield.svg',
      './assets/svgs/sound-mutted.svg',
      './assets/svgs/sound.svg',
      './assets/svgs/switch.svg',
      './assets/svgs/triangle.svg',
      './assets/svgs/tv.svg',
      './assets/svgs/vertical.svg'
   ]);
}

//#endregion

async function onActivate(event) {
   event.waitUntil(providenciarAtivacao(event));
}

async function providenciarAtivacao(event) {
   event.waitUntil(limparCachesNaoUsados(event));
   return self.clients.claim();
}

//#region Baixar recursos

async function onFetch(event) {
   event.respondWith(networkFirst(event));
}

async function networkFirst(event) {
   try {
      const arquivoNoCache = await caches.match(event.request);
      if (arquivoNoCache) {
         return pegarDoCache(event);
      }
      //BAIXA DA NETWORK
      const networkResponse = await fetch(event.request);
      if (networkResponse.status < 400) {
         cache = await caches.open(CACHE_APP_ATUAL);
         await cache.put(event.request, networkResponse.clone());
         return networkResponse;
      }
   } catch(e) {
      return pegarDoCache(event)
   }
}

async function pegarDoCache(event) {
   return caches.match(event.request)
      .then(cachedResponse => cachedResponse);
}

//#endregion

//#region remoção de caches não usados
function removerCachesNaoUsados(nomesCaches) {
   return nomesCaches
      .filter(nomeCache => nomeCache !== CACHE_APP_ATUAL)
      .map(nomeCache => caches.delete(nomeCache))
}

async function limparCachesNaoUsados() {
   const nomesCache = await caches.keys();
   return Promise.all(removerCachesNaoUsados(nomesCache));
}
//#endregion
