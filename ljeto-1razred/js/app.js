(function () {
  "use strict";

  var SUBJECTS = [
    window.CONTENT_MATEMATIKA,
    window.CONTENT_HRVATSKI,
    window.CONTENT_PRIRODA
  ];

  var STATION_ORDER = {
    matematika: ["mat-brojevi", "mat-racun", "mat-jednadzbe", "mat-rijeci", "mat-oblici"],
    hrvatski: ["hrv-slova", "hrv-slogovi", "hrv-citanje"],
    priroda: ["pid-godisnja", "pid-ziva", "pid-okolina"]
  };

  var REGION_COPY = {
    matematika: "Brojčana laguna — prvi trag blaga",
    hrvatski: "Književna šuma — riječi i tragovi",
    priroda: "Zelena dolina — priroda i društvo"
  };

  Progress.ensureUnlockedDefaults({
    matematika: "mat-brojevi",
    hrvatski: "hrv-slova",
    priroda: "pid-godisnja"
  });

  var state = {
    view: "hub",
    subject: null,
    game: null,
    queue: [],
    index: 0,
    correct: 0,
    justUnlockedGameId: null,
    hintUsed: false
  };

  var els = {
    views: {
      hub: document.getElementById("view-hub"),
      shop: document.getElementById("view-shop"),
      subject: document.getElementById("view-subject"),
      intro: document.getElementById("view-intro"),
      play: document.getElementById("view-play"),
      result: document.getElementById("view-result")
    },
    btnBack: document.getElementById("btnBack"),
    starsTotal: document.getElementById("starsTotal"),
    subjectGrid: document.getElementById("subjectGrid"),
    shopGrid: document.getElementById("shopGrid"),
    shopHistory: document.getElementById("shopHistory"),
    subjectIcon: document.getElementById("subjectIcon"),
    subjectTitle: document.getElementById("subjectTitle"),
    subjectBlurb: document.getElementById("subjectBlurb"),
    gameGrid: document.getElementById("gameGrid"),
    introEmoji: document.getElementById("introEmoji"),
    introTitle: document.getElementById("introTitle"),
    introDesc: document.getElementById("introDesc"),
    introCount: document.getElementById("introCount"),
    btnStart: document.getElementById("btnStart"),
    playProgress: document.getElementById("playProgress"),
    playCounter: document.getElementById("playCounter"),
    playCorrect: document.getElementById("playCorrect"),
    playPanel: document.getElementById("playPanel"),
    feedback: document.getElementById("feedback"),
    playActions: document.getElementById("playActions"),
    resultStars: document.getElementById("resultStars"),
    resultTitle: document.getElementById("resultTitle"),
    resultMsg: document.getElementById("resultMsg"),
    resultScore: document.getElementById("resultScore"),
    btnReplay: document.getElementById("btnReplay"),
    btnToSubject: document.getElementById("btnToSubject")
  };

  function showView(name) {
    state.view = name;
    Object.keys(els.views).forEach(function (key) {
      els.views[key].classList.toggle("active", key === name);
    });
    els.btnBack.classList.toggle("hidden", name === "hub");
    refreshStars();
  }

  function refreshStars() {
    els.starsTotal.textContent = "🎒 Novčanik ⭐ " + Progress.wallet();
  }

  function gameIdsFor(subject) {
    return subject.games.map(function (g) {
      return g.id;
    });
  }

  function gusarSubjectGameIds() {
    return {
      matematika: STATION_ORDER.matematika,
      hrvatski: STATION_ORDER.hrvatski,
      priroda: STATION_ORDER.priroda
    };
  }

  function renderHub() {
    els.subjectGrid.className = "island-map";
    els.subjectGrid.innerHTML = "";
    SUBJECTS.forEach(function (sub) {
      var max = sub.games.length * 3;
      var got = Progress.subjectStars(gameIdsFor(sub));
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "map-region";
      btn.dataset.id = sub.id;
      btn.innerHTML =
        '<span class="icon">' +
        sub.icon +
        "</span><div><h3>" +
        sub.title +
        "</h3><p>" +
        (REGION_COPY[sub.id] || sub.blurb) +
        '</p></div><span class="pill-stars">⭐ ' +
        got +
        "/" +
        max +
        "</span>";
      btn.addEventListener("click", function () {
        openSubject(sub);
      });
      els.subjectGrid.appendChild(btn);
    });
    renderGusarRegion();
  }

  function renderGusarRegion() {
    var gusarContent = window.CONTENT_GUSARSKI;
    var unlocked = Progress.gusarUnlocked(gusarSubjectGameIds());
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "map-region gusar";
    if (!gusarContent || !unlocked) {
      btn.classList.add("locked");
      btn.innerHTML =
        '<span class="icon">🏴‍☠️</span><div><h3>🔒 Skriveni gusarski otok</h3><p>' +
        (gusarContent
          ? "Treba barem 1 ⭐ u svakom predmetu da otključaš otok."
          : "Skrivena zona — sadržaj stiže uskoro. Prvo završi potragu u regijama.") +
        "</p></div>";
      btn.addEventListener("click", function () {
        if (!gusarContent) {
          window.alert(
            "Gusarski otok još nije spreman. Prati staze u svim regijama!"
          );
        } else {
          window.alert(
            "Treba barem 1 ⭐ u matematici, hrvatskom i prirodi da otključaš skriveni otok."
          );
        }
      });
    } else {
      var game = gusarContent.games[0];
      btn.innerHTML =
        '<span class="icon">🏴‍☠️</span><div><h3>' +
        gusarContent.title +
        "</h3><p>Miješana potraga 2. razreda — posljednji trag blaga.</p></div>";
      btn.addEventListener("click", function () {
        state.subject = gusarContent;
        openIntro(game);
      });
    }
    els.subjectGrid.appendChild(btn);
  }

  function openShop() {
    if (state.view === "shop") return;
    renderShop();
    showView("shop");
  }

  function renderShop() {
    var bal = Progress.wallet();
    els.shopGrid.innerHTML = "";
    (window.REWARDS || []).forEach(function (reward) {
      var card = document.createElement("div");
      card.className = "shop-card";
      var need = reward.cost - bal;
      var action = document.createElement("div");
      action.className = "shop-action";
      if (need > 0) {
        var needEl = document.createElement("p");
        needEl.className = "shop-need";
        needEl.textContent = "Trebaš još " + need + " ⭐";
        action.appendChild(needEl);
        var disabled = document.createElement("button");
        disabled.type = "button";
        disabled.className = "btn primary";
        disabled.textContent = "Iskoristi";
        disabled.disabled = true;
        action.appendChild(disabled);
      } else {
        var buy = document.createElement("button");
        buy.type = "button";
        buy.className = "btn primary";
        buy.textContent = "Iskoristi";
        buy.addEventListener("click", function () {
          var msg =
            "Stvarno potrošiti " +
            reward.cost +
            "⭐ za " +
            reward.title +
            "?";
          if (!window.confirm(msg)) return;
          var res = Progress.spend(reward);
          if (!res.ok) return;
          refreshStars();
          renderShop();
        });
        action.appendChild(buy);
      }
      card.innerHTML =
        '<span class="icon">' +
        reward.emoji +
        "</span><div><h3>" +
        reward.title +
        '</h3><p class="shop-cost">⭐ ' +
        reward.cost +
        "</p></div>";
      card.appendChild(action);
      els.shopGrid.appendChild(card);
    });
    renderHistory();
  }

  function renderHistory() {
    var list = Progress.getSpent().slice(0, 10);
    els.shopHistory.innerHTML = "";
    if (!list.length) {
      var empty = document.createElement("li");
      empty.className = "shop-history-empty";
      empty.textContent = "Još nema iskorištenih nagrada.";
      els.shopHistory.appendChild(empty);
      return;
    }
    list.forEach(function (item) {
      var li = document.createElement("li");
      var when = "";
      try {
        when = new Date(item.at).toLocaleDateString("hr-HR");
      } catch (e) {
        when = "";
      }
      li.innerHTML =
        "<span>" +
        item.title +
        " · ⭐ " +
        item.cost +
        '</span><span class="shop-hist-meta">' +
        when +
        "</span>";
      els.shopHistory.appendChild(li);
    });
  }

  function openSubject(sub) {
    state.subject = sub;
    els.subjectIcon.textContent = sub.icon;
    els.subjectTitle.textContent = sub.title;
    els.subjectBlurb.textContent = REGION_COPY[sub.id] || sub.blurb;
    els.gameGrid.className = "station-trail";
    els.gameGrid.innerHTML = "";
    var gamesById = {};
    sub.games.forEach(function (g) {
      gamesById[g.id] = g;
    });
    var order = STATION_ORDER[sub.id] || sub.games.map(function (g) {
      return g.id;
    });
    order.forEach(function (gid, i) {
      var game = gamesById[gid];
      if (!game) return;
      if (i > 0) {
        var link = document.createElement("div");
        link.className = "station-link";
        link.setAttribute("aria-hidden", "true");
        els.gameGrid.appendChild(link);
      }
      var unlocked = Progress.isUnlocked(sub.id, game.id);
      var stars = Progress.getStars(game.id);
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "station-node" + (unlocked ? "" : " locked");
      if (state.justUnlockedGameId === game.id) {
        btn.classList.add("just-unlocked");
      }
      btn.innerHTML =
        '<span class="icon">' +
        (unlocked ? game.emoji : "🔒") +
        "</span><div><h3>" +
        game.title +
        "</h3><p>" +
        game.desc +
        '</p></div><span class="pill-stars">' +
        starText(stars) +
        "</span>";
      if (unlocked) {
        btn.addEventListener("click", function () {
          openIntro(game);
        });
      } else {
        btn.disabled = true;
      }
      els.gameGrid.appendChild(btn);
    });
    state.justUnlockedGameId = null;
    showView("subject");
  }

  function starText(n) {
    var s = "";
    for (var i = 0; i < 3; i++) s += i < n ? "⭐" : "☆";
    return s;
  }

  function openIntro(game) {
    state.game = game;
    els.introEmoji.textContent = game.emoji;
    els.introTitle.textContent = "Trag: " + game.title;
    els.introDesc.textContent = game.desc;
    els.introCount.textContent = String(game.roundSize || 10);
    showView("intro");
  }

  function startGame() {
    var game = state.game;
    if (!game) return;
    state.queue = Engine.pickRound(game.bank, game.roundSize || 10, game.id);
    state.index = 0;
    state.correct = 0;
    showView("play");
    showQuestion();
  }

  function applyHintToQuestion(q, panel, hintBtn) {
    if (state.hintUsed) return;
    state.hintUsed = true;
    if (hintBtn) hintBtn.disabled = true;

    var result = Engine.applyHint(q);
    if (result.hintText) {
      els.feedback.className = "feedback info";
      els.feedback.textContent = result.hintText;
      els.feedback.classList.remove("hidden");
    }
    if (
      result.choices &&
      (q.type === "mcq" || q.type === "truefalse" || q.type === "count")
    ) {
      var allowed = {};
      result.choices.forEach(function (c) {
        allowed[String(c)] = true;
      });
      Array.prototype.forEach.call(panel.querySelectorAll(".btn.choice"), function (btn) {
        if (!allowed[btn.textContent]) btn.remove();
      });
    }
  }

  function mountHintButton(q, panel) {
    if (!state.game || !state.game.allowHint) return;
    state.hintUsed = false;
    var hintBtn = document.createElement("button");
    hintBtn.type = "button";
    hintBtn.className = "btn ghost hint-btn";
    hintBtn.id = "btnHint";
    hintBtn.textContent = "💡 Hint";
    hintBtn.addEventListener("click", function () {
      applyHintToQuestion(q, panel, hintBtn);
    });
    els.playActions.insertBefore(hintBtn, els.playActions.firstChild);
  }

  function showQuestion() {
    var total = state.queue.length;
    var i = state.index;
    els.playCounter.textContent = i + 1 + " / " + total;
    els.playCorrect.textContent = String(state.correct);
    els.playProgress.style.width = Math.round((i / total) * 100) + "%";
    var q = state.queue[i];
    Engine.mountQuestion(
      q,
      els.playPanel,
      els.playActions,
      els.feedback,
      function (ok) {
        if (ok) state.correct++;
        state.index++;
        if (state.index >= total) {
          els.playProgress.style.width = "100%";
          finishGame();
        } else {
          showQuestion();
        }
      }
    );
    mountHintButton(q, els.playPanel);
  }

  function finishGame() {
    var total = state.queue.length;
    var stars = Engine.starsFromScore(state.correct, total);
    Progress.setStars(state.game.id, stars, state.correct);
    Progress.addToWallet(stars);
    if (
      stars >= 1 &&
      state.game &&
      state.game.id !== "gus-otok" &&
      state.subject &&
      STATION_ORDER[state.subject.id]
    ) {
      var order = STATION_ORDER[state.subject.id];
      var idx = order.indexOf(state.game.id);
      Progress.unlockNext(state.subject.id, order, state.game.id);
      if (idx >= 0 && idx < order.length - 1) {
        state.justUnlockedGameId = order[idx + 1];
      }
    }
    els.resultStars.textContent = starText(stars);
    els.resultStars.classList.remove("treasure-pop");
    void els.resultStars.offsetWidth;
    if (stars >= 1) els.resultStars.classList.add("treasure-pop");
    els.resultScore.textContent =
      "Točno " +
      state.correct +
      " od " +
      total +
      " zadataka · +" +
      stars +
      " ⭐ u novčanik";
    if (stars === 3) {
      els.resultTitle.textContent = "Sjajno!";
      els.resultMsg.textContent = "Skoro savršeno — skupio/la si 3 zvjezdice!";
    } else if (stars === 2) {
      els.resultTitle.textContent = "Bravo!";
      els.resultMsg.textContent = "Odličan trud — još malo do 3 zvjezdice.";
    } else if (stars === 1) {
      els.resultTitle.textContent = "Dobro ide!";
      els.resultMsg.textContent = "Uvježbaj još jednom i bit će još bolje.";
    } else {
      els.resultTitle.textContent = "Probaj opet!";
      els.resultMsg.textContent = "Svaka greška uči — ti možeš!";
    }
    refreshStars();
    showView("result");
  }

  function goBack() {
    if (state.view === "shop") {
      renderHub();
      showView("hub");
      return;
    }
    if (state.view === "play" || state.view === "intro" || state.view === "result") {
      if (state.subject) openSubject(state.subject);
      else {
        renderHub();
        showView("hub");
      }
      return;
    }
    if (state.view === "subject") {
      state.subject = null;
      renderHub();
      showView("hub");
    }
  }

  els.btnBack.addEventListener("click", goBack);
  els.starsTotal.addEventListener("click", openShop);
  els.btnStart.addEventListener("click", startGame);
  els.btnReplay.addEventListener("click", function () {
    openIntro(state.game);
  });
  els.btnToSubject.addEventListener("click", function () {
    openSubject(state.subject);
  });

  renderHub();
  showView("hub");
})();
