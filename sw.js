// Pingolf Live service worker.
// Network first for everything: when online you always get the latest deploy.
// The cache is only a fallback so the app shell still opens on bad venue wifi.
// Scores always go straight to Firestore (never cached here).
var CACHE = 'pingolf-v1';
var SHELL = ['/', '/manifest.webmanifest', '/icons/icon-192.png', '/icons/apple-touch-icon.png'];
var CDN = /^https:\/\/(www\.gstatic\.com\/firebasejs\/|cdnjs\.cloudflare\.com\/)/;

self.addEventListener('install', function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(SHELL); }).then(function(){ return self.skipWaiting(); }));
});

self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});

self.addEventListener('fetch', function(e){
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  var sameOrigin = url.origin === self.location.origin;
  if (!sameOrigin && !CDN.test(req.url)) return; // Firestore etc.: leave alone

  e.respondWith(
    fetch(req).then(function(res){
      if (res && (res.ok || res.type === 'opaque')) {
        var copy = res.clone();
        caches.open(CACHE).then(function(c){ c.put(req, copy); });
      }
      return res;
    }).catch(function(){
      var isPage = req.mode === 'navigate';
      return caches.match(req, {ignoreSearch: isPage}).then(function(hit){
        if (hit) return hit;
        return (isPage ? caches.match('/') : Promise.resolve()).then(function(home){ return home || Response.error(); });
      });
    })
  );
});
