window.addEventListener('load', onLoad);

async function onLoad() {
   try {
      var serviceWorker;
      if ('serviceWorker' in navigator) {
         serviceWorker = await navigator.serviceWorker.register('service-worker.js');
      }
   } catch (e) {
      console.log(e);
   }
}
