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
    if (n >= 1e9) return (n / 1e9).toFixed(2).replace(/\.?0+$/, "") + " mlrd.";
    if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + " mil.";
    if (n >= 1e3) return Math.round(n / 1e3) + " tis.";
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
    if (out.length === 0) return '<span class="chip">Nema kopnenih granica (otok/izolirana)</span>';
    return out.map(function (c) {
      return '<span class="chip' + (asLinks ? " link" : "") + '" data-code="' + c.code + '">' +
        flagEmoji(c.code) + " " + c.hr + "</span>";
    }).join("");
  }

  var $ = function (sel) { return document.querySelector(sel); };
  var $$ = function (sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); };

  // ---- Trajno pohranjeno stanje (localStorage) -----------------------------
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem("ntz_" + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem("ntz_" + k, JSON.stringify(v)); } catch (e) {} }
  };

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

  var taskText = {
    easy: "Na kojem je kontinentu?",
    normal: "Koja je ovo država?",
    hard: "Koji je glavni grad?"
  };

  function currentAnswer(c) {
    if (flash.difficulty === "easy") return c.continent;
    if (flash.difficulty === "hard") return c.capital;
    return c.hr;
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
      '<div class="task-label">' + taskText[flash.difficulty] + '</div>' +
      flagHTML(c.code) +
      '<div class="tap-hint">Klikni karticu da vidiš odgovor</div>';

    $("#cardBack").innerHTML =
      '<div class="task-label">' + taskText[flash.difficulty] + '</div>' +
      '<div class="answer-name">' + answer + '</div>' +
      flagHTML(c.code, "answer-flag") +
      '<div class="answer-name" style="font-size:1.05rem;color:var(--text-soft);margin-top:-6px">' + c.hr + '</div>' +
      '<div class="facts">' +
        fact("Kontinent", c.continent) +
        fact("Glavni grad", c.capital) +
        fact("Valuta", c.currency) +
        fact("Vjera", c.religion) +
        fact("Stanovništvo", fmtPopulation(c.population)) +
        fact("Kod", c.code.toUpperCase()) +
        factWide("Susjedi", borderNames(c, false)) +
        factWide("Poznato po", c.knownFor) +
      '</div>';
  }

  function fact(k, v) {
    return '<div class="fact"><div class="k">' + k + '</div><div class="v">' + v + '</div></div>';
  }
  function factWide(k, v) {
    return '<div class="fact wide"><div class="k">' + k + '</div><div class="v"><div class="chips">' + v + '</div></div></div>';
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
  function quizValue(c) {
    if (quiz.difficulty === "easy") return c.continent;
    if (quiz.difficulty === "hard") return c.capital;
    return c.hr;
  }
  var quizQuestion = {
    easy: "Na kojem se kontinentu nalazi ova država?",
    normal: "Koja je ovo država?",
    hard: "Koji je glavni grad ove države?"
  };

  // ---- Postava: broj igrača i imena ----
  function renderPlayerNames() {
    var box = $("#playerNames");
    var existing = {};
    $$("#playerNames input").forEach(function (inp, i) { existing[i] = inp.value; });
    box.innerHTML = "";
    if (quiz.playerCount === 1) {
      box.innerHTML = '<span class="solo-note">Solo vježba — samo ti protiv zastava. 🎯</span>';
      return;
    }
    for (var i = 0; i < quiz.playerCount; i++) {
      var wrap = document.createElement("div");
      wrap.className = "player-name-input";
      var dot = '<span class="pdot" style="background:' + playerColor(i) + '"></span>';
      wrap.innerHTML = dot + '<input type="text" maxlength="14" value="' +
        (existing[i] || "Igrač " + (i + 1)) + '" placeholder="Igrač ' + (i + 1) + '">';
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
      quiz.players.push({ name: "Ti", score: 0 });
    } else {
      $$("#playerNames input").forEach(function (inp, i) {
        var nm = inp.value.trim() || ("Igrač " + (i + 1));
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
      (multi ? "Više igrača" : "Solo") + rnd + '</span>';

    var banner = $("#turnBanner");
    if (multi) {
      banner.style.display = "";
      banner.innerHTML = '<span class="pdot" style="background:' +
        playerColor(quiz.turn % quiz.players.length) + '"></span> Na redu: <strong>' + cur.name + '</strong>';
    } else {
      banner.style.display = "none";
    }
  }

  function nextQuestion() {
    if (gameOver()) { showResults(); return; }
    var pool = quizPool();
    var country = pool[Math.floor(Math.random() * pool.length)];
    quiz.current = country;
    quiz.answered = false;

    var correct = quizValue(country);
    var options = [correct];
    if (quiz.difficulty === "easy") {
      options = CONTINENTS.slice();
    } else {
      var others = shuffle(COUNTRIES.filter(function (c) { return quizValue(c) !== correct; }));
      var i = 0;
      while (options.length < 4 && i < others.length) {
        var v = quizValue(others[i]); i++;
        if (options.indexOf(v) === -1) options.push(v);
      }
    }
    options = shuffle(options);

    renderScoreboard();
    $("#quizQuestion").textContent = quizQuestion[quiz.difficulty];
    $("#quizFlag").innerHTML = flagHTML(country.code);
    $("#quizFeedback").textContent = ""; $("#quizFeedback").className = "quiz-feedback";
    $("#quizNext").style.visibility = "hidden";

    var box = $("#quizOptions");
    box.innerHTML = "";
    options.forEach(function (opt) {
      var b = document.createElement("button");
      b.className = "option";
      b.textContent = opt;
      b.addEventListener("click", function () { answerQuiz(b, opt, correct); });
      box.appendChild(b);
    });
  }

  function answerQuiz(btn, chosen, correct) {
    if (quiz.answered) return;
    quiz.answered = true;
    var ok = chosen === correct;
    if (ok) currentPlayer().score += 1;

    $$("#quizOptions .option").forEach(function (b) {
      b.disabled = true;
      if (b.textContent === correct) b.classList.add("correct");
      else if (b === btn) b.classList.add("wrong");
    });

    var fb = $("#quizFeedback");
    if (ok) { fb.textContent = "Točno! 🎉  (" + quiz.current.hr + ")"; fb.className = "quiz-feedback ok"; }
    else { fb.textContent = "Netočno — točno: " + correct + " (" + quiz.current.hr + ")"; fb.className = "quiz-feedback no"; }

    quiz.turn += 1;
    renderScoreboard();
    var btnNext = $("#quizNext");
    btnNext.textContent = gameOver() ? "🏁 Rezultati" :
      (quiz.players.length > 1 ? "Predaj uređaj → " + currentPlayer().name : "Sljedeće pitanje →");
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
      title = winners.length > 1 ? "Neriješeno! 🤝" : "Pobjednik: " + winners[0].name + " 🏆";
      sub = "Konačni poredak nakon " + (quiz.rounds > 0 ? quiz.rounds + " rundi" : currentRound() - 1 + " rundi");
    } else {
      var totalQ = quiz.turn;
      title = "Rezultat: " + top + " / " + totalQ + " 🎯";
      sub = top === totalQ && totalQ > 0 ? "Savršeno! Sve točno! 🌟" : "Odlično napredovanje — probaj opet!";
    }

    $("#modalBody").innerHTML =
      '<div class="result-head"><h2>' + title + '</h2><div class="sub">' + sub + '</div></div>' +
      '<div class="result-list">' + rows + '</div>' +
      '<div class="result-actions">' +
        '<button class="btn primary" id="playAgain">🔁 Igraj ponovno</button>' +
        '<button class="btn ghost" id="newSetup">⚙️ Nova postava</button>' +
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
      return c.hr.toLowerCase().indexOf(q) !== -1 ||
             c.en.toLowerCase().indexOf(q) !== -1 ||
             c.capital.toLowerCase().indexOf(q) !== -1;
    }).sort(function (a, b) { return a.hr.localeCompare(b.hr, "hr"); });

    $("#encCount").textContent = list.length;
    var grid = $("#encGrid");
    if (list.length === 0) { grid.innerHTML = '<div class="empty">Nema rezultata za tvoju pretragu.</div>'; return; }
    grid.innerHTML = list.map(function (c) {
      return '<div class="country-card" data-code="' + c.code + '">' +
        flagHTML(c.code) +
        '<div class="cname">' + c.hr + '</div>' +
        '<div class="ccont">' + c.continent + '</div>' +
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
        '<div><h2>' + c.hr + '</h2><div class="sub">' + c.en + ' · ' + c.continent + '</div></div>' +
      '</div>' +
      '<div class="facts">' +
        fact("Glavni grad", c.capital) +
        fact("Valuta", c.currency) +
        fact("Dominantna vjera", c.religion) +
        fact("Stanovništvo", fmtPopulation(c.population)) +
        fact("ISO kod", c.code.toUpperCase()) +
        fact("Kontinent", c.continent) +
        factWide("Susjedi", borderNames(c, true)) +
        factWide("Poznato po", c.knownFor) +
      '</div>';
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
  function fillContinentSelect(sel, includeAll) {
    var html = includeAll ? '<option value="sve">Svi kontinenti</option>' : "";
    CONTINENTS.forEach(function (c) { html += '<option value="' + c + '">' + c + '</option>'; });
    sel.innerHTML = html;
  }

  function init() {
    // tema
    var savedTheme = store.get("theme", null);
    if (savedTheme) applyTheme(savedTheme);
    else $("#themeBtn").textContent = window.matchMedia("(prefers-color-scheme: dark)").matches ? "☀️" : "🌙";

    // continent selecti
    fillContinentSelect($("#flashContinent"), true);
    fillContinentSelect($("#quizContinent"), true);
    fillContinentSelect($("#encContinent"), true);

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
