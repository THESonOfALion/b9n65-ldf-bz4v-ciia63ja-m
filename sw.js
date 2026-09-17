const C='manual-v4';
const F=['./','./index.html','./manifest.webmanifest','./icon-180.png','./icon-512.png'];
self.addEventListener('install',e=>{self.skipWaiting();
  e.waitUntil(caches.open(C).then(c=>c.addAll(F)).catch(()=>{}));});
self.addEventListener('activate',e=>{e.waitUntil(
  caches.keys().then(k=>Promise.all(k.filter(n=>n!==C).map(n=>caches.delete(n))))
    .then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    fetch(e.request).then(r=>{const cp=r.clone();
      caches.open(C).then(c=>c.put(e.request,cp)).catch(()=>{});return r;})
    .catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html')))
  );});