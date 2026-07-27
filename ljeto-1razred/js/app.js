(function () {
  "use strict";

  var SUBJECTS = [
    window.CONTENT_MATEMATIKA,
    window.CONTENT_HRVATSKI,
    window.CONTENT_PRIRODA
  ];

  var state = {
    view: "hub",
    subject: null,
    game: null,
    queue: [],
    index: 0,
    correct: 0
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

  function renderHub() {
    els.subjectGrid.innerHTML = "";
    SUBJECTS.forEach(function (sub) {
      var max = sub.games.length * 3;
      var got = Progress.subjectStars(gameIdsFor(sub));
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "subject-card";
      btn.dataset.id = sub.id;
      btn.innerHTML =
        '<span class="icon">' +
        sub.icon +
        "</span><div><h3>" +
        sub.title +
        "</h3><p>" +
        sub.blurb +
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
    els.subjectBlurb.textContent = sub.blurb;
    els.gameGrid.innerHTML = "";
    sub.games.forEach(function (game) {
      var stars = Progress.getStars(game.id);
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "game-card";
      btn.innerHTML =
        '<span class="icon">' +
        game.emoji +
        "</span><div><h3>" +
        game.title +
        "</h3><p>" +
        game.desc +
        '</p></div><span class="pill-stars">' +
        starText(stars) +
        "</span>";
      btn.addEventListener("click", function () {
        openIntro(game);
      });
      els.gameGrid.appendChild(btn);
    });
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
    els.introTitle.textContent = game.title;
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
  }

  function finishGame() {
    var total = state.queue.length;
    var stars = Engine.starsFromScore(state.correct, total);
    Progress.setStars(state.game.id, stars, state.correct);
    Progress.addToWallet(stars);
    els.resultStars.textContent = starText(stars);
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
