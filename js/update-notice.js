/* ===========================================================================
   „Nova verzija“ — skočni gumb za osvježavanje nakon deploya.

   Kako radi:
   1. Pri objavi (GitHub Actions) nastane datoteka „version.json“ s oznakom
      verzije. Skripta ju pročita pri učitavanju i zapamti kao „svoju“.
   2. Povremeno — i svaki put kad se korisnik vrati na karticu — provjeri
      je li se oznaka promijenila. Ako jest, objavljena je nova verzija.
   3. Tada se pojavi skočni gumb „Osvježi“. NE osvježavamo sami: dijete može
      biti usred zadatka. Odluku prepuštamo korisniku.

   Radi u obje aplikacije (Zastave i Ljetni park) i ne treba build korak.
   Ako version.json ne postoji (npr. lokalno otvoren index.html), skripta
   tiho miruje.
   =========================================================================== */
(function (global) {
  "use strict";

  var CHECK_MS = 5 * 60 * 1000; // redovita provjera
  var MIN_GAP_MS = 30 * 1000; // ne provjeravaj češće od ovoga

  var doc = global.document;
  if (!doc || typeof global.fetch !== "function") return;

  // Bazu računamo iz putanje ove skripte (…/js/update-notice.js → …/),
  // pa isti file radi i iz podmape (ljeto-1razred) i s GitHub Pages podputanje.
  function baseUrl() {
    var src = null;
    if (doc.currentScript && doc.currentScript.src) {
      src = doc.currentScript.src;
    } else {
      var all = doc.getElementsByTagName("script");
      for (var i = all.length - 1; i >= 0; i--) {
        if (all[i].src && all[i].src.indexOf("update-notice.js") !== -1) {
          src = all[i].src;
          break;
        }
      }
    }
    if (!src) return "./";
    return src.replace(/js\/update-notice\.js.*$/, "");
  }

  var VERSION_URL = baseUrl() + "version.json";
  var known = null;
  var shown = false;
  var lastCheck = 0;
  var checking = false;

  function readVersion() {
    return global
      .fetch(VERSION_URL + "?_=" + Date.now(), { cache: "no-store" })
      .then(function (res) {
        if (!res || !res.ok) return null;
        return res.json();
      })
      .then(function (data) {
        if (!data) return null;
        return String(data.version || data.commit || data.builtAt || "");
      })
      .catch(function () {
        return null;
      });
  }

  function injectStyles() {
    if (doc.getElementById("update-notice-style")) return;
    var css = [
      ".update-notice{position:fixed;left:50%;bottom:16px;transform:translate(-50%,140%);",
      "z-index:9999;display:flex;align-items:center;gap:12px;max-width:calc(100vw - 24px);",
      "padding:12px 14px;border-radius:16px;background:#1f2937;color:#fff;",
      "box-shadow:0 12px 30px rgba(0,0,0,.35);font:600 15px/1.3 system-ui,-apple-system,'Segoe UI',sans-serif;",
      "transition:transform .28s ease;}",
      ".update-notice.is-open{transform:translate(-50%,0);}",
      ".update-notice__text{flex:1 1 auto;min-width:0;}",
      ".update-notice__btn{flex:0 0 auto;border:0;cursor:pointer;border-radius:12px;",
      "padding:10px 16px;background:#ffc93c;color:#1f2937;font:inherit;font-weight:800;}",
      ".update-notice__btn:disabled{opacity:.6;cursor:default;}",
      ".update-notice__close{flex:0 0 auto;border:0;cursor:pointer;background:transparent;",
      "color:#cbd5e1;font-size:20px;line-height:1;padding:6px;border-radius:10px;}",
      "@media (prefers-reduced-motion: reduce){.update-notice{transition:none;}}"
    ].join("");
    var style = doc.createElement("style");
    style.id = "update-notice-style";
    style.textContent = css;
    doc.head.appendChild(style);
  }

  function reloadFresh() {
    var done = function () {
      // Zaobiđi cache preglednika pri ponovnom učitavanju.
      var url = global.location.href.split("#")[0];
      url += (url.indexOf("?") === -1 ? "?" : "&") + "v=" + Date.now();
      global.location.replace(url);
    };

    var jobs = [];
    if (global.caches && global.caches.keys) {
      jobs.push(
        global.caches
          .keys()
          .then(function (keys) {
            return Promise.all(
              keys.map(function (k) {
                return global.caches.delete(k);
              })
            );
          })
          .catch(function () {})
      );
    }
    if (global.navigator && global.navigator.serviceWorker) {
      jobs.push(
        global.navigator.serviceWorker
          .getRegistrations()
          .then(function (regs) {
            return Promise.all(
              regs.map(function (reg) {
                if (reg.waiting) reg.waiting.postMessage({ type: "SKIP_WAITING" });
                return reg.update().catch(function () {});
              })
            );
          })
          .catch(function () {})
      );
    }

    // Ne dopusti da čišćenje cachea zablokira osvježavanje.
    var guard = setTimeout(done, 2500);
    Promise.all(jobs).then(function () {
      clearTimeout(guard);
      done();
    });
  }

  function show() {
    if (shown) return;
    shown = true;
    injectStyles();

    var box = doc.createElement("div");
    box.className = "update-notice";
    box.setAttribute("role", "status");
    box.setAttribute("aria-live", "polite");

    var text = doc.createElement("span");
    text.className = "update-notice__text";
    text.textContent = "🎉 Stigla je nova verzija!";

    var btn = doc.createElement("button");
    btn.type = "button";
    btn.className = "update-notice__btn";
    btn.textContent = "Osvježi";

    var close = doc.createElement("button");
    close.type = "button";
    close.className = "update-notice__close";
    close.setAttribute("aria-label", "Zatvori obavijest");
    close.textContent = "×";

    btn.addEventListener("click", function () {
      btn.disabled = true;
      btn.textContent = "Osvježavam…";
      reloadFresh();
    });
    close.addEventListener("click", function () {
      box.classList.remove("is-open");
      setTimeout(function () {
        if (box.parentNode) box.parentNode.removeChild(box);
      }, 300);
      // „Kasnije“ — ponudi ponovno kad korisnik idući put dođe na karticu.
      shown = false;
    });

    box.appendChild(text);
    box.appendChild(btn);
    box.appendChild(close);
    doc.body.appendChild(box);
    // Sljedeći frame da CSS prijelaz uhvati početno stanje.
    global.requestAnimationFrame(function () {
      box.classList.add("is-open");
    });
  }

  function check(force) {
    var now = Date.now();
    if (checking || (!force && now - lastCheck < MIN_GAP_MS)) return;
    checking = true;
    lastCheck = now;
    readVersion().then(function (version) {
      checking = false;
      if (!version) return;
      if (known === null) {
        known = version;
        return;
      }
      if (version !== known) show();
    });
  }

  function start() {
    check(true);
    setInterval(function () {
      if (!doc.hidden) check(false);
    }, CHECK_MS);
    doc.addEventListener("visibilitychange", function () {
      if (!doc.hidden) check(false);
    });
    global.addEventListener("focus", function () {
      check(false);
    });
    global.addEventListener("online", function () {
      check(true);
    });

    // Ako service worker javi da je spremna nova verzija, ne čekaj anketu.
    if (global.navigator && global.navigator.serviceWorker) {
      global.navigator.serviceWorker.ready
        .then(function (reg) {
          if (reg.waiting) show();
          reg.addEventListener("updatefound", function () {
            var sw = reg.installing;
            if (!sw) return;
            sw.addEventListener("statechange", function () {
              if (sw.state === "installed" && global.navigator.serviceWorker.controller) {
                show();
              }
            });
          });
        })
        .catch(function () {});
    }
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }

  global.UpdateNotice = { check: function () { check(true); }, show: show };
})(window);
