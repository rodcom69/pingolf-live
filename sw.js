// Pingolf no longer has a home-screen app (removed 2026-11-26). This file stays so phones that
// installed the old service worker pick up this one, which clears its cache and removes itself.
self.addEventListener('install', function(){ self.skipWaiting(); });
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(ks){ return Promise.all(ks.map(function(k){ return caches.delete(k); })); })
    .then(function(){ return self.registration.unregister(); }));
});
