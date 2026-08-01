/* ===========================================================================
   Service worker — omogućuje instalaciju (PWA) i rad offline.

   VAŽNO: strategija je "network-first" za sve s ovog origina (HTML/JS/CSS),
   pa korisnik UVIJEK dobije najnoviji kôd kad ima mreže; cache služi samo kao
   pričuva kad nema mreže. (Prije je bilo "cache-first" pa su ostajale stare
   verzije — npr. popravci se nisu vidjeli.)
   Verziju cachea povećaj pri svakoj promjeni da se stari obriše.
   =========================================================================== */
var CACHE = "ntz-cache-v3";

// Relativno na opseg (scope) service workera — radi i na /Learn-the-flags/.
var ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./js/update-notice.js",
  "./ljeto-1razred/index.html",
  "./ljeto-1razred/manifest.webmanifest",
  "./ljeto-1razred/icons/icon-192.png",
  "./ljeto-1razred/icons/icon-512.png",
  "./ljeto-1razred/icons/icon-maskable-512.png",
  "./ljeto-1razred/icons/apple-touch-icon.png",
  "./ljeto-1razred/css/styles.css",
  "./ljeto-1razred/js/progress.js",
  "./ljeto-1razred/js/engine.js",
  "./ljeto-1razred/js/rewards.js",
  "./ljeto-1razred/js/app.js",
  "./ljeto-1razred/js/content/matematika.js",
  "./ljeto-1razred/js/content/nina-tino-hrvatski.js",
  "./ljeto-1razred/js/content/hrvatski.js",
  "./ljeto-1razred/js/content/priroda.js",
  "./ljeto-1razred/js/content/gusarski.js",
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

// Skočni gumb „Osvježi“ (js/update-notice.js) traži da novi worker odmah
// preuzme kontrolu umjesto da čeka zatvaranje svih kartica.
self.addEventListener("message", function (e) {
  if (e.data && e.data.type === "SKIP_WAITING") self.skipWaiting();
});

// Network-first: pokušaj mrežu, spremi svježe u cache; ako mreže nema, vrati cache.
function networkFirst(req) {
  return fetch(req).then(function (resp) {
    if (resp && resp.ok) {
      var copy = resp.clone();
      caches.open(CACHE).then(function (c) { c.put(req, copy); });
    }
    return resp;
  }).catch(function () {
    return caches.match(req).then(function (cached) {
      if (cached) return cached;
      if (req.mode === "navigate") return caches.match("./index.html");
      return Response.error();
    });
  });
}

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);

  // Zastave s flagcdn.com — network-first, spremi u cache, offline pričuva.
  if (url.hostname === "flagcdn.com") {
    e.respondWith(networkFirst(req));
    return;
  }

  // Sve s ovog origina — network-first (uvijek najnovije kad ima mreže).
  if (url.origin === location.origin) {
    e.respondWith(networkFirst(req));
  }
});
