// Kapitäns-Karte: Offline-Speicher. Version 20261117-1936
const CACHE="kapitaens-karte-20261117-1936";
const FILES=['./', 'index.html', 'manifest.webmanifest', 'xlsx.full.min.js', 'icon-180.png', 'icon-192.png', 'icon-512.png', 'nunito-600.woff2', 'nunito-700.woff2', 'nunito-800.woff2', 'nunito-900.woff2', 'pirata-one-400.woff2'];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const req=e.request; if(req.method!=="GET") return;
  if(req.mode==="navigate"){
    // Seite: erst Netz (für Updates), nach 3 Sekunden oder offline aus dem Speicher
    e.respondWith(new Promise(res=>{let done=false;
      const fall=()=>caches.match("index.html").then(r=>{if(!done){done=true;res(r)}});
      const t=setTimeout(fall,3000);
      fetch(req).then(r=>{clearTimeout(t);if(r&&r.ok){const c=r.clone();caches.open(CACHE).then(x=>x.put("index.html",c))}if(!done){done=true;res(r)}}).catch(()=>{clearTimeout(t);fall()});
    }));return;
  }
  e.respondWith(caches.match(req).then(r=>r||fetch(req)));
});
