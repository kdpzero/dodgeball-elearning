var C="dodgeball-elearning-v6";
var F=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png"];
self.addEventListener("install",function(e){
  e.waitUntil(caches.open(C).then(function(c){
    return Promise.all(F.map(function(u){
      return fetch(u,{cache:"reload"}).then(function(r){ if(!r.ok) throw new Error(u); return c.put(u,r); });
    }));
  }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener("activate",function(e){
  e.waitUntil(caches.keys().then(function(k){ return Promise.all(k.filter(function(x){return x!==C;}).map(function(x){return caches.delete(x);})); }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener("fetch",function(e){
  var q=e.request;
  var u=new URL(q.url);
  if(q.method!=="GET"||u.origin!==location.origin||u.searchParams.has("_")) return;
  if(q.mode==="navigate"){
    /* a lap mindig a hálózatról frissül, ha van net; offline a mentett példány jön */
    e.respondWith(
      fetch(q,{cache:"no-cache"}).then(function(r){
        var cp=r.clone(); caches.open(C).then(function(c){ c.put("./index.html",cp); }); return r;
      }).catch(function(){ return caches.match("./index.html").then(function(r){ return r||caches.match("./"); }); })
    );
    return;
  }
  e.respondWith(caches.match(q,{ignoreSearch:true}).then(function(r){ return r||fetch(q); }));
});
