/* ===========================================================================
   Service worker — omogućuje instalaciju (PWA) i rad offline.
   App-shell se predmemorira pri instalaciji; zastave (flagcdn) se spremaju
   usput (network-first) pa rade i bez mreže nakon prvog gledanja.
   =========================================================================== */
var CACHE = "ntz-cache-v1";

// Relativno na opseg (scope) service workera — radi i na /Learn-the-flags/.
var ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./css/styles.css",
  "./js/countries.js",
  "./js/coords.js",
  "./js/worldmap.js",
  "./js/countrypolys.js",
  "./js/confusables.js",
  "./js/i18n.js",
  "./js/i18n-names.js",
  "./js/i18n-knownfor.js",
  "./js/app.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      // Pojedinačno — jedan neuspjeh (npr. 404) ne ruši cijelu instalaciju.
      return Promise.all(ASSETS.map(function (url) {
        return c.add(url).catch(function () {});
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; })
        .map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);

  // Zastave s flagcdn.com — network-first, spremi u cache, offline fallback.
  if (url.hostname === "flagcdn.com") {
    e.respondWith(
      fetch(req).then(function (r) {
        var copy = r.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
        return r;
      }).catch(function () { return caches.match(req); })
    );
    return;
  }

  // Isti origin — cache-first, uz mrežni fallback i spremanje novog.
  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(req).then(function (cached) {
        return cached || fetch(req).then(function (resp) {
          if (resp && resp.ok) {
            var copy = resp.clone();
            caches.open(CACHE).then(function (c) { c.put(req, copy); });
          }
          return resp;
        }).catch(function () {
          // Za navigacije bez mreže vrati početnu stranicu.
          if (req.mode === "navigate") return caches.match("./index.html");
        });
      })
    );
  }
});
