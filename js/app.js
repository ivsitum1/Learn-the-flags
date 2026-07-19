/* ===========================================================================
   Nauči zastave — logika aplikacije
   =========================================================================== */
(function () {
  "use strict";

  var COUNTRIES = window.COUNTRIES || [];
  var byCode = {};
  COUNTRIES.forEach(function (c) { byCode[c.code] = c; });

  var CONTINENTS = ["Europa", "Azija", "Afrika", "Sjeverna Amerika", "Južna Amerika", "Oceanija"];

  // ---- Pomoćne funkcije ----------------------------------------------------
  function flagEmoji(code) {
    return code.toUpperCase().replace(/./g, function (ch) {
      return String.fromCodePoint(127397 + ch.charCodeAt(0));
    });
  }

  // Vraća HTML zastave: emoji je uvijek prikazan u pozadini, a preko njega se
  // (kad ima mreže) učitava oštra SVG zastava s flagcdn. Ako slika ne uspije
  // (offline / blokirano), uklanja se i ostaje emoji — nikad prazno polje.
  function flagHTML(code, cls) {
    var emoji = flagEmoji(code);
    return '<span class="flag ' + (cls || "") + '">' +
      '<span class="emoji">' + emoji + '</span>' +
      '<img src="https://flagcdn.com/' + code + '.svg" alt="" loading="lazy" ' +
      'onerror="this.remove()">' +
      '</span>';
  }

  function fmtPopulation(n) {
    if (n >= 1e9) return (n / 1e9).toFixed(2).replace(/\.?0+$/, "") + " " + T("popB");
    if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + " " + T("popM");
    if (n >= 1e3) return Math.round(n / 1e3) + " " + T("popK");
    return String(n);
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function borderNames(country, asLinks) {
    var out = country.borders
      .map(function (b) { return byCode[b]; })
      .filter(Boolean);
    if (out.length === 0) return '<span class="chip">' + T("noBorders") + '</span>';
    return out.map(function (c) {
      return '<span class="chip' + (asLinks ? " link" : "") + '" data-code="' + c.code + '">' +
        flagEmoji(c.code) + " " + nameOf(c) + "</span>";
    }).join("");
  }

  var $ = function (sel) { return document.querySelector(sel); };
  var $$ = function (sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); };

  // ---- Trajno pohranjeno stanje (localStorage) -----------------------------
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem("ntz_" + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem("ntz_" + k, JSON.stringify(v)); } catch (e) {} }
  };

  // ---- Jezik i prijevodi ----------------------------------------------------
  var lang = store.get("lang", "hr");
  function T(key) { var u = window.I18N.ui[lang] || window.I18N.ui.hr; return (u[key] !== undefined) ? u[key] : (window.I18N.ui.hr[key] || key); }
  function contLabel(canon) { if (lang === "hr") return canon; var m = window.I18N.continent[canon]; return (m && m[lang]) || canon; }
  function nameOf(c) { if (lang === "hr") return c.hr; var n = window.I18N_NAMES && window.I18N_NAMES[c.code]; return (n && n[lang]) || c.en || c.hr; }
  function continentOf(c) { return contLabel(c.continent); }
  function capitalOf(c) { if (lang === "hr") return c.capital; var n = window.I18N_NAMES && window.I18N_NAMES[c.code]; return (n && n.cap) || c.capital; }
  function currencyOf(c) { if (lang === "hr") return c.currency; return window.I18N.currency[c.currency] || c.currency; }
  function religionOf(c) {
    if (lang === "hr") return c.religion;
    return c.religion.split("/").map(function (t) { t = t.trim(); var m = window.I18N.religion[t]; return (m && m[lang]) || t; }).join(" / ");
  }
  function knownForOf(c) { if (lang === "hr") return c.knownFor; var m = window.I18N_KNOWNFOR && window.I18N_KNOWNFOR[c.code]; return (m && m[lang]) || c.knownFor; }
  function tipOf(g) { return (g.tip && g.tip[lang]) || (g.tip && g.tip.hr) || ""; }

  function applyStaticUi() {
    document.documentElement.setAttribute("lang", lang);
    $$("[data-i18n]").forEach(function (el) { el.textContent = T(el.getAttribute("data-i18n")); });
    $$("[data-i18n-ph]").forEach(function (el) { el.setAttribute("placeholder", T(el.getAttribute("data-i18n-ph"))); });
    $$("[data-i18n-title]").forEach(function (el) { el.setAttribute("title", T(el.getAttribute("data-i18n-title"))); });
  }
  function setLanguage(code) {
    lang = code; store.set("lang", code);
    applyStaticUi();
    fillContinentSelect($("#flashContinent"), flash.continent);
    fillContinentSelect($("#quizContinent"), quiz.continent);
    fillContinentSelect($("#encContinent"), $("#encContinent").value || "sve");
    renderFlash();
    if ($("#quizGame").hidden) { renderPlayerNames(); }
    else if (quiz.current) { renderQuestion(quiz.current); }
    renderEncyclopedia();
  }

  // ===========================================================================
  //  NAVIGACIJA
  // ===========================================================================
  function showView(name) {
    $$(".view").forEach(function (v) { v.classList.toggle("active", v.id === "view-" + name); });
    $$(".tab").forEach(function (t) { t.classList.toggle("active", t.dataset.view === name); });
    store.set("lastView", name);
  }
  $$(".tab").forEach(function (t) {
    t.addEventListener("click", function () { showView(t.dataset.view); });
  });

  // Tema
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    $("#themeBtn").textContent = theme === "dark" ? "☀️" : "🌙";
    store.set("theme", theme);
    if (typeof drawMaps === "function") drawMaps(document);
  }
  $("#themeBtn").addEventListener("click", function () {
    var cur = document.documentElement.getAttribute("data-theme");
    if (!cur) cur = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    applyTheme(cur === "dark" ? "light" : "dark");
  });

  // ===========================================================================
  //  KARTICE (FLASHCARD)
  // ===========================================================================
  var flash = {
    deck: [], idx: 0, flipped: false,
    difficulty: store.get("difficulty", "normal"),
    continent: "sve",
    score: store.get("score", 0),
    seen: 0
  };

  function flashPool() {
    return flash.continent === "sve"
      ? COUNTRIES
      : COUNTRIES.filter(function (c) { return c.continent === flash.continent; });
  }

  function newDeck() {
    flash.deck = shuffle(flashPool());
    flash.idx = 0;
    flash.flipped = false;
    flash.seen = 0;
    renderFlash();
  }

  function taskLabel() {
    return T(flash.difficulty === "easy" ? "taskEasy" : flash.difficulty === "hard" ? "taskHard" : "taskNormal");
  }
  function currentAnswer(c) {
    if (flash.difficulty === "easy") return continentOf(c);
    if (flash.difficulty === "hard") return capitalOf(c);
    return nameOf(c);
  }

  function renderFlash() {
    var c = flash.deck[flash.idx];
    if (!c) { newDeck(); return; }
    var total = flash.deck.length;

    $("#flashProgress").style.width = ((flash.idx) / total * 100) + "%";
    $("#flashCount").textContent = (flash.idx + 1) + " / " + total;
    $("#flashScore").textContent = flash.score;

    var card = $("#flashCard");
    card.classList.remove("flipped");
    flash.flipped = false;

    var answer = currentAnswer(c);

    $("#cardFront").innerHTML =
      '<div class="task-label">' + taskLabel() + '</div>' +
      flagHTML(c.code) +
      '<div class="tap-hint">' + T("tapHint") + '</div>';

    $("#cardBack").innerHTML =
      '<div class="task-label">' + taskLabel() + '</div>' +
      '<div class="answer-name">' + answer + '</div>' +
      flagHTML(c.code, "answer-flag") +
      '<div class="answer-name" style="font-size:1.05rem;color:var(--text-soft);margin-top:-6px">' + nameOf(c) + '</div>' +
      '<div class="facts">' +
        fact(T("continent"), continentOf(c)) +
        fact(T("fCapital"), capitalOf(c)) +
        fact(T("fCurrency"), currencyOf(c)) +
        fact(T("fReligion"), religionOf(c)) +
        fact(T("fPopulation"), fmtPopulation(c.population)) +
        fact(T("fCode"), c.code.toUpperCase()) +
        factWide(T("fNeighbors"), borderNames(c, false)) +
        factWide(T("fKnownFor"), knownForOf(c)) +
        miniMapHTML(c) +
        confusablesHTML(c) +
      '</div>';
    drawMaps($("#cardBack"));
  }

  function fact(k, v) {
    return '<div class="fact"><div class="k">' + k + '</div><div class="v">' + v + '</div></div>';
  }
  function factWide(k, v) {
    return '<div class="fact wide"><div class="k">' + k + '</div><div class="v"><div class="chips">' + v + '</div></div></div>';
  }

  // ---- Karte lokacije (svijet + približeno; ispunjena površina države) ----
  // Okviri kontinenata [minLng, minLat, maxLng, maxLat] za zoom kontekst.
  var CONTINENT_FRAMES = {
    "Europa": [-25, 34, 48, 72],
    "Azija": [25, -12, 150, 56],
    "Afrika": [-20, -37, 55, 38],
    "Sjeverna Amerika": [-170, 5, -50, 75],
    "Južna Amerika": [-85, -58, -32, 15],
    "Oceanija": [110, -50, 180, 0]
  };

  function mapTheme() {
    // Karta je didaktički dijagram (ne UI chrome): more = plavo, kopno = zeleno,
    // kao školski atlas — mora biti odmah jasno i osnovnoškolcima.
    var theme = document.documentElement.getAttribute("data-theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    var dark = theme === "dark";
    return {
      ocean: dark ? "#1565c0" : "#42a5f5",
      land: dark ? "#81c784" : "#a5d6a7",
      coast: dark ? "#2e7d32" : "#558b2f",
      border: dark ? "rgba(15, 40, 20, 0.85)" : "rgba(20, 50, 25, 0.7)",
      fill: "#e11d48",
      stroke: "#9f1239"
    };
  }

  function fillLand(ctx, rings, X, Y, colors, lineWidth) {
    ctx.fillStyle = colors.land;
    fillRings(ctx, rings, X, Y);
    // Obrub obale — oštra granica more/kopno
    ctx.strokeStyle = colors.coast;
    ctx.lineWidth = lineWidth || 1.25;
    ctx.lineJoin = "round";
    rings.forEach(function (ring) {
      ctx.beginPath();
      ring.forEach(function (p, i) {
        var x = X(p[0]), y = Y(p[1]);
        if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y);
      });
      ctx.closePath();
      ctx.stroke();
    });
  }

  // Blage granice svih država — kontekst na velikim kontinentima (Azija itd.).
  function drawAllBorders(ctx, X, Y, colors, lineWidth) {
    var all = window.COUNTRY_POLYS;
    if (!all) return;
    ctx.strokeStyle = colors.border;
    ctx.lineWidth = lineWidth || 0.7;
    ctx.lineJoin = "round";
    Object.keys(all).forEach(function (code) {
      var polys = all[code];
      for (var i = 0; i < polys.length; i++) {
        var poly = polys[i];
        // Samo vanjski prsten (bez rupa) — dovoljno za orijentaciju
        var ring = poly[0];
        if (!ring || ring.length < 3) continue;
        ctx.beginPath();
        for (var j = 0; j < ring.length; j++) {
          var p = ring[j];
          var x = X(p[0]), y = Y(p[1]);
          if (j) ctx.lineTo(x, y); else ctx.moveTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      }
    });
  }

  function wrapLng(lng, center) {
    var d = lng - center;
    while (d > 180) d -= 360;
    while (d < -180) d += 360;
    return center + d;
  }

  function countryBBox(code) {
    var polys = window.COUNTRY_POLYS && window.COUNTRY_POLYS[code];
    if (!polys || !polys.length) return null;
    var center = (window.COORDS && window.COORDS[code]) ? window.COORDS[code][1] : 0;
    var minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity;
    polys.forEach(function (poly) {
      poly[0].forEach(function (p) {
        var lng = wrapLng(p[0], center);
        if (lng < minLng) minLng = lng;
        if (lng > maxLng) maxLng = lng;
        if (p[1] < minLat) minLat = p[1];
        if (p[1] > maxLat) maxLat = p[1];
      });
    });
    if (!isFinite(minLng)) return null;
    return { minLng: minLng, minLat: minLat, maxLng: maxLng, maxLat: maxLat, center: center };
  }

  function zoomViewFor(c) {
    var bb = countryBBox(c.code);
    if (!bb) return null;
    var w = bb.maxLng - bb.minLng;
    var h = bb.maxLat - bb.minLat;
    var padLng = Math.max(w * 0.9, 8);
    var padLat = Math.max(h * 0.9, 6);
    var minLng = bb.minLng - padLng;
    var maxLng = bb.maxLng + padLng;
    var minLat = bb.minLat - padLat;
    var maxLat = bb.maxLat + padLat;

    // Proširi do dijela kontinenta ako je država mala; ne širi iznad okvira kontinenta.
    var frame = CONTINENT_FRAMES[c.continent];
    if (frame) {
      var fw = frame[2] - frame[0];
      var fh = frame[3] - frame[1];
      var wantW = Math.min(fw * 0.55, Math.max(maxLng - minLng, fw * 0.28));
      var wantH = Math.min(fh * 0.55, Math.max(maxLat - minLat, fh * 0.28));
      var cx = (minLng + maxLng) / 2;
      var cy = (minLat + maxLat) / 2;
      minLng = cx - wantW / 2;
      maxLng = cx + wantW / 2;
      minLat = cy - wantH / 2;
      maxLat = cy + wantH / 2;
      // Drži unutar kontinenta kad stane; inače ostavi širi okvir (Rusija, SAD…).
      if (w < fw * 0.85 && h < fh * 0.85) {
        minLng = Math.max(minLng, frame[0]);
        maxLng = Math.min(maxLng, frame[2]);
        minLat = Math.max(minLat, frame[1]);
        maxLat = Math.min(maxLat, frame[3]);
      }
    }

    // Uskladi omjer sa canvasom 720×420
    var aspect = 720 / 420;
    w = maxLng - minLng;
    h = maxLat - minLat;
    if (w / h > aspect) {
      var extra = (w / aspect - h) / 2;
      minLat -= extra;
      maxLat += extra;
    } else {
      var extraW = (h * aspect - w) / 2;
      minLng -= extraW;
      maxLng += extraW;
    }
    return { minLng: minLng, minLat: minLat, maxLng: maxLng, maxLat: maxLat, center: bb.center };
  }

  function projectors(view, W, H) {
    if (!view) {
      return {
        X: function (lng) { return (lng + 180) / 360 * W; },
        Y: function (lat) { return (90 - lat) / 180 * H; }
      };
    }
    var spanLng = view.maxLng - view.minLng;
    var spanLat = view.maxLat - view.minLat;
    return {
      X: function (lng) { return (wrapLng(lng, view.center) - view.minLng) / spanLng * W; },
      Y: function (lat) { return (view.maxLat - lat) / spanLat * H; }
    };
  }

  function fillRings(ctx, rings, X, Y) {
    rings.forEach(function (ring) {
      ctx.beginPath();
      ring.forEach(function (p, i) {
        var x = X(p[0]), y = Y(p[1]);
        if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y);
      });
      ctx.closePath();
      ctx.fill();
    });
  }

  function drawCountryFill(ctx, code, X, Y, colors, opts) {
    var polys = window.COUNTRY_POLYS && window.COUNTRY_POLYS[code];
    if (!polys) return;
    opts = opts || {};

    // Na svjetskoj karti mikrodržave bi inače bile nevidljive — blago povećaj
    // projekciju oko središta (i dalje ispunjena površina, ne točka).
    var scale = 1;
    var cx = 0, cy = 0, n = 0;
    var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    polys.forEach(function (poly) {
      poly[0].forEach(function (p) {
        var x = X(p[0]), y = Y(p[1]);
        cx += x; cy += y; n++;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      });
    });
    if (!n) return;
    cx /= n; cy /= n;
    var screenW = maxX - minX;
    var screenH = maxY - minY;
    if (opts.boostSmall) {
      // Na 720×360 svjetskoj karti male države inače nestanu — uvećaj oblik.
      var minPx = 22;
      var span = Math.max(screenW, screenH, 0.5);
      if (span < minPx) scale = minPx / span;
    }

    function px(p) {
      var x = X(p[0]), y = Y(p[1]);
      if (scale === 1) return { x: x, y: y };
      return { x: cx + (x - cx) * scale, y: cy + (y - cy) * scale };
    }

    ctx.fillStyle = colors.fill;
    ctx.strokeStyle = opts.boostSmall ? colors.fill : colors.stroke;
    // Deblji obrub iste boje na svjetskoj karti = čitljiv oblik, ne točka.
    var fat = opts.boostSmall ? Math.max(2.5, 12 / Math.max(screenW * scale, screenH * scale, 1)) : 1.5;
    ctx.lineWidth = fat;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    polys.forEach(function (poly) {
      ctx.beginPath();
      poly.forEach(function (ring) {
        ring.forEach(function (p, i) {
          var pt = px(p);
          if (i) ctx.lineTo(pt.x, pt.y); else ctx.moveTo(pt.x, pt.y);
        });
        ctx.closePath();
      });
      ctx.fill("evenodd");
      ctx.stroke();
    });
  }

  function miniMapHTML(c) {
    if (!window.COUNTRY_POLYS || !window.COUNTRY_POLYS[c.code]) return "";
    return '<div class="fact wide map"><div class="k">' + T("fLocation") + '</div>' +
      '<div class="map-stack">' +
        '<div class="map-caption">' + T("fMapWorld") + '</div>' +
        '<canvas class="minimap" width="720" height="360" data-mode="world" data-code="' + c.code + '"></canvas>' +
        '<div class="map-caption">' + T("fMapZoom") + '</div>' +
        '<canvas class="minimap minimap-zoom" width="720" height="420" data-mode="zoom" data-code="' + c.code + '"></canvas>' +
        '<div class="map-legend" aria-hidden="true">' +
          '<span><i class="swatch ocean"></i>' + T("mapOcean") + '</span>' +
          '<span><i class="swatch land"></i>' + T("mapLand") + '</span>' +
          '<span><i class="swatch country"></i>' + T("mapCountry") + '</span>' +
        '</div>' +
      '</div></div>';
  }

  function drawMiniMap(cv) {
    if (!window.WORLD_LAND) return;
    var code = cv.dataset.code;
    var mode = cv.dataset.mode || "world";
    var W = cv.width, H = cv.height, ctx = cv.getContext("2d");
    var colors = mapTheme();
    var country = byCode[code];
    var view = mode === "zoom" && country ? zoomViewFor(country) : null;
    var proj = projectors(view, W, H);

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = colors.ocean;
    ctx.fillRect(0, 0, W, H);
    fillLand(ctx, window.WORLD_LAND, proj.X, proj.Y, colors, mode === "zoom" ? 1.75 : 1.1);
    // Sve granice blago, zatim crvena ispuna tražene države
    drawAllBorders(ctx, proj.X, proj.Y, colors, mode === "zoom" ? 1.45 : 0.75);
    drawCountryFill(ctx, code, proj.X, proj.Y, colors, { boostSmall: mode === "world" });
  }

  function drawMaps(root) {
    Array.prototype.forEach.call(root.querySelectorAll("canvas.minimap"), drawMiniMap);
  }

  // ---- Kućica sa sličnostima (slična zastava / sličan naziv) ----
  function confusablesHTML(c) {
    if (!window.CONFUSABLES) return "";
    var groups = window.CONFUSABLES.filter(function (g) { return g.members.indexOf(c.code) !== -1; });
    if (!groups.length) return "";
    var inner = groups.map(function (g) {
      var others = g.members.filter(function (m) { return m !== c.code && byCode[m]; });
      var icon = g.type === "flag" ? "🎌" : "🔤";
      var label = g.type === "flag" ? T("confuseFlag") : T("confuseName");
      var chips = others.map(function (code) {
        return '<span class="chip link" data-code="' + code + '">' + flagEmoji(code) + " " + nameOf(byCode[code]) + '</span>';
      }).join("");
      return '<div class="confuse-item"><div class="confuse-h">' + icon + " " + label + '</div>' +
        '<div class="chips">' + chips + '</div><div class="confuse-tip">' + tipOf(g) + '</div></div>';
    }).join("");
    return '<div class="fact wide confuse"><div class="k">' + T("fConfuse") + '</div>' + inner + '</div>';
  }

  function flipCard() {
    flash.flipped = !flash.flipped;
    $("#flashCard").classList.toggle("flipped", flash.flipped);
  }

  function nextCard(knew) {
    if (knew === true) { flash.score += 1; store.set("score", flash.score); }
    flash.idx += 1;
    flash.seen += 1;
    if (flash.idx >= flash.deck.length) { newDeck(); return; }
    renderFlash();
  }

  $("#flashCard").addEventListener("click", flipCard);
  $("#btnFlip").addEventListener("click", function (e) { e.stopPropagation(); flipCard(); });
  $("#btnKnew").addEventListener("click", function () { nextCard(true); });
  $("#btnDidnt").addEventListener("click", function () { nextCard(false); });
  $("#btnSkip").addEventListener("click", function () { nextCard(null); });
  $("#btnShuffle").addEventListener("click", newDeck);
  $("#btnResetScore").addEventListener("click", function () {
    flash.score = 0; store.set("score", 0); $("#flashScore").textContent = 0;
  });

  // klik na susjeda (chip) na poleđini otvara njegov detalj
  $("#cardBack").addEventListener("click", function (e) {
    var chip = e.target.closest(".chip.link");
    if (chip && chip.dataset.code) { e.stopPropagation(); openModal(chip.dataset.code); }
  });

  // Težina
  $$("#diffSeg button").forEach(function (b) {
    b.addEventListener("click", function () {
      flash.difficulty = b.dataset.diff;
      store.set("difficulty", flash.difficulty);
      $$("#diffSeg button").forEach(function (x) { x.classList.toggle("on", x === b); });
      renderFlash();
    });
  });

  // Kontinent (kartice)
  $("#flashContinent").addEventListener("change", function () {
    flash.continent = this.value; newDeck();
  });

  // ===========================================================================
  //  KVIZ (multiple choice) — za 1 ili više igrača (pass & play)
  // ===========================================================================
  var quiz = {
    difficulty: "normal", continent: "sve",
    playerCount: 1, rounds: 5,
    players: [],       // [{name, score, answered}]
    turn: 0,           // redni broj poteza (od 0)
    answered: false, current: null
  };

  function quizPool() {
    return quiz.continent === "sve"
      ? COUNTRIES
      : COUNTRIES.filter(function (c) { return c.continent === quiz.continent; });
  }
  // Opis odgovora za državu: jedinstveni ključ (za usporedbu) + prikaz (za jezik)
  function answerFor(country) {
    if (quiz.difficulty === "easy") return { key: country.continent, label: contLabel(country.continent) };
    if (quiz.difficulty === "hard") { var cap = capitalOf(country); return { key: cap, label: cap }; }
    return { key: country.code, label: nameOf(country) };
  }

  // ---- Postava: broj igrača i imena ----
  function renderPlayerNames() {
    var box = $("#playerNames");
    var existing = {};
    $$("#playerNames input").forEach(function (inp, i) { existing[i] = inp.value; });
    box.innerHTML = "";
    if (quiz.playerCount === 1) {
      box.innerHTML = '<span class="solo-note">' + T("soloNote") + '</span>';
      return;
    }
    for (var i = 0; i < quiz.playerCount; i++) {
      var wrap = document.createElement("div");
      wrap.className = "player-name-input";
      var dot = '<span class="pdot" style="background:' + playerColor(i) + '"></span>';
      wrap.innerHTML = dot + '<input type="text" maxlength="14" value="' +
        (existing[i] || T("player") + " " + (i + 1)) + '" placeholder="' + T("player") + " " + (i + 1) + '">';
      box.appendChild(wrap);
    }
  }

  var PLAYER_COLORS = ["#4f46e5", "#0ea5a4", "#e11d48", "#f59e0b", "#8b5cf6", "#10b981"];
  function playerColor(i) { return PLAYER_COLORS[i % PLAYER_COLORS.length]; }

  $$("#playerCountSeg button").forEach(function (b) {
    b.addEventListener("click", function () {
      quiz.playerCount = parseInt(b.dataset.n, 10);
      $$("#playerCountSeg button").forEach(function (x) { x.classList.toggle("on", x === b); });
      renderPlayerNames();
    });
  });
  $$("#quizDiffSeg button").forEach(function (b) {
    b.addEventListener("click", function () {
      quiz.difficulty = b.dataset.diff;
      $$("#quizDiffSeg button").forEach(function (x) { x.classList.toggle("on", x === b); });
    });
  });
  $$("#quizRoundsSeg button").forEach(function (b) {
    b.addEventListener("click", function () {
      quiz.rounds = parseInt(b.dataset.r, 10);
      $$("#quizRoundsSeg button").forEach(function (x) { x.classList.toggle("on", x === b); });
    });
  });
  $("#quizContinent").addEventListener("change", function () { quiz.continent = this.value; });

  // ---- Pokretanje igre ----
  function startGame() {
    quiz.players = [];
    if (quiz.playerCount === 1) {
      quiz.players.push({ name: T("you"), score: 0 });
    } else {
      $$("#playerNames input").forEach(function (inp, i) {
        var nm = inp.value.trim() || (T("player") + " " + (i + 1));
        quiz.players.push({ name: nm, score: 0 });
      });
    }
    quiz.turn = 0;
    $("#quizSetup").hidden = true;
    $("#quizGame").hidden = false;
    renderScoreboard();
    nextQuestion();
  }
  $("#quizStart").addEventListener("click", startGame);

  function currentPlayer() { return quiz.players[quiz.turn % quiz.players.length]; }
  function currentRound() { return Math.floor(quiz.turn / quiz.players.length) + 1; }
  function gameOver() { return quiz.rounds > 0 && quiz.turn >= quiz.players.length * quiz.rounds; }

  function renderScoreboard() {
    var multi = quiz.players.length > 1;
    var rnd = quiz.rounds > 0 ? (" · Runda " + Math.min(currentRound(), quiz.rounds) + "/" + quiz.rounds) : "";
    var cur = currentPlayer();
    var html = quiz.players.map(function (p, i) {
      var active = multi && p === cur;
      return '<span class="score-chip' + (active ? " active" : "") + '" style="--pc:' + playerColor(i) + '">' +
        '<span class="pdot" style="background:' + playerColor(i) + '"></span>' +
        p.name + ' <b>' + p.score + '</b></span>';
    }).join("");
    $("#scoreboard").innerHTML = html + '<span class="round-tag">' +
      (multi ? T("multi") : T("solo")) + rnd + '</span>';

    var banner = $("#turnBanner");
    if (multi) {
      banner.style.display = "";
      banner.innerHTML = '<span class="pdot" style="background:' +
        playerColor(quiz.turn % quiz.players.length) + '"></span> ' + T("turn") + ' <strong>' + cur.name + '</strong>';
    } else {
      banner.style.display = "none";
    }
  }

  function renderQuestion(country) {
    quiz.current = country;
    quiz.answered = false;
    var correct = answerFor(country);
    var options;
    if (quiz.difficulty === "easy") {
      options = CONTINENTS.map(function (cn) { return { key: cn, label: contLabel(cn) }; });
    } else {
      options = [correct];
      var keys = {}; keys[correct.key] = 1;
      var others = shuffle(COUNTRIES.filter(function (c) { return c.code !== country.code; }));
      for (var i = 0; i < others.length && options.length < 4; i++) {
        var a = answerFor(others[i]);
        if (!keys[a.key]) { keys[a.key] = 1; options.push(a); }
      }
    }
    options = shuffle(options);

    renderScoreboard();
    $("#quizQuestion").textContent = T(quiz.difficulty === "easy" ? "qEasy" : quiz.difficulty === "hard" ? "qHard" : "qNormal");
    $("#quizFlag").innerHTML = flagHTML(country.code);
    $("#quizFeedback").textContent = ""; $("#quizFeedback").className = "quiz-feedback";
    $("#quizNext").style.visibility = "hidden";

    var box = $("#quizOptions");
    box.innerHTML = "";
    options.forEach(function (opt) {
      var b = document.createElement("button");
      b.className = "option";
      b.textContent = opt.label;
      b.dataset.key = opt.key;
      b.addEventListener("click", function () { answerQuiz(b, opt.key, correct); });
      box.appendChild(b);
    });
  }

  function nextQuestion() {
    if (gameOver()) { showResults(); return; }
    var pool = quizPool();
    renderQuestion(pool[Math.floor(Math.random() * pool.length)]);
  }

  function answerQuiz(btn, chosenKey, correct) {
    if (quiz.answered) return;
    quiz.answered = true;
    var ok = chosenKey === correct.key;
    if (ok) currentPlayer().score += 1;

    $$("#quizOptions .option").forEach(function (b) {
      b.disabled = true;
      if (b.dataset.key === correct.key) b.classList.add("correct");
      else if (b === btn) b.classList.add("wrong");
    });

    var fb = $("#quizFeedback");
    if (ok) { fb.textContent = T("correct") + "  (" + nameOf(quiz.current) + ")"; fb.className = "quiz-feedback ok"; }
    else { fb.textContent = T("wrongPrefix") + " " + correct.label + " (" + nameOf(quiz.current) + ")"; fb.className = "quiz-feedback no"; }

    quiz.turn += 1;
    renderScoreboard();
    var btnNext = $("#quizNext");
    btnNext.textContent = gameOver() ? T("results") :
      (quiz.players.length > 1 ? T("handTo") + currentPlayer().name : T("nextQ"));
    btnNext.style.visibility = "visible";
  }

  $("#quizNext").addEventListener("click", nextQuestion);
  $("#quizEnd").addEventListener("click", showResults);

  function showResults() {
    var ranked = quiz.players.slice().sort(function (a, b) { return b.score - a.score; });
    var top = ranked[0].score;
    var multi = quiz.players.length > 1;
    var medals = ["🥇", "🥈", "🥉"];
    var rows = ranked.map(function (p, i) {
      var win = p.score === top;
      return '<div class="result-row' + (win ? " win" : "") + '">' +
        '<span class="rank">' + (multi ? (medals[i] || (i + 1) + ".") : "🎯") + '</span>' +
        '<span class="rname">' + p.name + '</span>' +
        '<span class="rscore">' + p.score + '</span></div>';
    }).join("");

    var title, sub;
    if (multi) {
      var winners = ranked.filter(function (p) { return p.score === top; });
      title = winners.length > 1 ? T("tie") : T("winnerPrefix") + winners[0].name + " 🏆";
      sub = T("finalAfter") + (quiz.rounds > 0 ? quiz.rounds : currentRound() - 1) + " " + T("roundsWord");
    } else {
      var totalQ = quiz.turn;
      title = T("scoreResult") + top + " / " + totalQ + " 🎯";
      sub = top === totalQ && totalQ > 0 ? T("perfect") : T("keepGoing");
    }

    $("#modalBody").innerHTML =
      '<div class="result-head"><h2>' + title + '</h2><div class="sub">' + sub + '</div></div>' +
      '<div class="result-list">' + rows + '</div>' +
      '<div class="result-actions">' +
        '<button class="btn primary" id="playAgain">' + T("playAgain") + '</button>' +
        '<button class="btn ghost" id="newSetup">' + T("newSetup") + '</button>' +
      '</div>';
    $("#modalOverlay").classList.add("open");

    $("#playAgain").addEventListener("click", function () {
      closeModal();
      quiz.players.forEach(function (p) { p.score = 0; });
      quiz.turn = 0;
      renderScoreboard();
      nextQuestion();
    });
    $("#newSetup").addEventListener("click", function () {
      closeModal();
      $("#quizGame").hidden = true;
      $("#quizSetup").hidden = false;
    });
  }

  // ===========================================================================
  //  ENCIKLOPEDIJA
  // ===========================================================================
  function renderEncyclopedia() {
    var q = $("#encSearch").value.trim().toLowerCase();
    var cont = $("#encContinent").value;
    var list = COUNTRIES.filter(function (c) {
      if (cont !== "sve" && c.continent !== cont) return false;
      if (!q) return true;
      return nameOf(c).toLowerCase().indexOf(q) !== -1 ||
             c.hr.toLowerCase().indexOf(q) !== -1 ||
             c.en.toLowerCase().indexOf(q) !== -1 ||
             capitalOf(c).toLowerCase().indexOf(q) !== -1 ||
             c.capital.toLowerCase().indexOf(q) !== -1;
    }).sort(function (a, b) { return nameOf(a).localeCompare(nameOf(b), lang); });

    $("#encCount").textContent = list.length;
    var grid = $("#encGrid");
    if (list.length === 0) { grid.innerHTML = '<div class="empty">' + T("noResults") + '</div>'; return; }
    grid.innerHTML = list.map(function (c) {
      return '<div class="country-card" data-code="' + c.code + '">' +
        flagHTML(c.code) +
        '<div class="cname">' + nameOf(c) + '</div>' +
        '<div class="ccont">' + continentOf(c) + '</div>' +
        '</div>';
    }).join("");
  }

  $("#encGrid").addEventListener("click", function (e) {
    var card = e.target.closest(".country-card");
    if (card) openModal(card.dataset.code);
  });
  $("#encSearch").addEventListener("input", renderEncyclopedia);
  $("#encContinent").addEventListener("change", renderEncyclopedia);

  // ---- Modal detalja -------------------------------------------------------
  function openModal(code) {
    var c = byCode[code];
    if (!c) return;
    $("#modalBody").innerHTML =
      '<div class="modal-head">' +
        flagHTML(c.code) +
        '<div><h2>' + nameOf(c) + '</h2><div class="sub">' + c.en + ' · ' + continentOf(c) + '</div></div>' +
      '</div>' +
      '<div class="facts">' +
        fact(T("fCapital"), capitalOf(c)) +
        fact(T("fCurrency"), currencyOf(c)) +
        fact(T("fReligionDom"), religionOf(c)) +
        fact(T("fPopulation"), fmtPopulation(c.population)) +
        fact(T("fCodeIso"), c.code.toUpperCase()) +
        fact(T("continent"), continentOf(c)) +
        factWide(T("fNeighbors"), borderNames(c, true)) +
        factWide(T("fKnownFor"), knownForOf(c)) +
        miniMapHTML(c) +
        confusablesHTML(c) +
      '</div>';
    drawMaps($("#modalBody"));
    $("#modalOverlay").classList.add("open");
  }
  function closeModal() { $("#modalOverlay").classList.remove("open"); }
  $("#modalClose").addEventListener("click", closeModal);
  $("#modalOverlay").addEventListener("click", function (e) {
    if (e.target === this) closeModal();
    var chip = e.target.closest(".chip.link");
    if (chip && chip.dataset.code) openModal(chip.dataset.code);
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });

  // ===========================================================================
  //  INICIJALIZACIJA
  // ===========================================================================
  function fillContinentSelect(sel, selected) {
    var html = '<option value="sve">' + T("allContinents") + '</option>';
    CONTINENTS.forEach(function (c) { html += '<option value="' + c + '">' + contLabel(c) + '</option>'; });
    sel.innerHTML = html;
    if (selected) sel.value = selected;
  }

  function fillLangSelect() {
    var sel = $("#langSelect");
    sel.innerHTML = window.I18N.langs.map(function (l) {
      return '<option value="' + l.code + '">' + l.flag + " " + l.label + '</option>';
    }).join("");
    sel.value = lang;
    sel.addEventListener("change", function () { setLanguage(this.value); });
  }

  function init() {
    // tema
    var savedTheme = store.get("theme", null);
    if (savedTheme) applyTheme(savedTheme);
    else $("#themeBtn").textContent = window.matchMedia("(prefers-color-scheme: dark)").matches ? "☀️" : "🌙";

    // jezik
    applyStaticUi();
    fillLangSelect();

    // continent selecti
    fillContinentSelect($("#flashContinent"), flash.continent);
    fillContinentSelect($("#quizContinent"), quiz.continent);
    fillContinentSelect($("#encContinent"), "sve");

    // težina početno
    $$("#diffSeg button").forEach(function (x) { x.classList.toggle("on", x.dataset.diff === flash.difficulty); });
    $$("#quizDiffSeg button").forEach(function (x) { x.classList.toggle("on", x.dataset.diff === "normal"); });

    // ukupno država u zaglavlju
    $("#totalCountries").textContent = COUNTRIES.length;

    newDeck();
    renderPlayerNames();   // postava kviza (broj igrača / imena)
    renderEncyclopedia();

    showView(store.get("lastView", "flash"));
  }

  init();
})();
