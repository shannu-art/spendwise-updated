const CACHE='spendwise-v10';
const FILES=['./','./index.html','./styles.css','./app.js','./manifest.json'];
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(FILES);await self.skipWaiting()})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith('spendwise-')&&k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim()})()));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin) return;
  const networkFirst=event.request.mode==='navigate'||['index.html','app.js','styles.css','manifest.json'].some(name=>url.pathname.endsWith('/'+name));
  if(networkFirst){event.respondWith((async()=>{try{const response=await fetch(event.request,{cache:'no-store'});if(response&&response.ok){const cache=await caches.open(CACHE);cache.put(event.request,response.clone())}return response}catch(error){return (await caches.match(event.request))||(await caches.match('./index.html'))}})());return}
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{if(response&&response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy))}return response}).catch(()=>caches.match('./index.html'))));
});
