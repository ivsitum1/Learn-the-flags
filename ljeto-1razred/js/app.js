(function () {
  "use strict";

  var SUBJECTS = [
    window.CONTENT_MATEMATIKA,
    window.CONTENT_HRVATSKI,
    window.CONTENT_PRIRODA
  ];

  var QUEST = window.CONTENT_IZAZOV;
  var QUEST_GAME_ID = "izazov-blago";

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
      subject: document.getElementById("view-subject"),
      intro: document.getElementById("view-intro"),
      play: document.getElementById("view-play"),
      quest: document.getElementById("view-quest"),
      result: document.getElementById("view-result")
    },
    btnBack: document.getElementById("btnBack"),
    starsTotal: document.getElementById("starsTotal"),
    subjectGrid: document.getElementById("subjectGrid"),
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
    btnToSubject: document.getElementById("btnToSubject"),
    questTitle: document.getElementById("questTitle"),
    questStory: document.getElementById("questStory"),
    questMap: document.getElementById("questMap"),
    questPanel: document.getElementById("questPanel"),
    questFeedback: document.getElementById("questFeedback"),
    questActions: document.getElementById("questActions")
  };

  var quest = { queue: [], index: 0, correct: 0, results: [], done: false };

  function showView(name) {
    state.view = name;
    Object.keys(els.views).forEach(function (key) {
      els.views[key].classList.toggle("active", key === name);
    });
    els.btnBack.classList.toggle("hidden", name === "hub");
    refreshStars();
  }

  function refreshStars() {
    els.starsTotal.textContent = "⭐ " + Progress.totalStars();
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

    if (QUEST) {
      var qStars = Progress.getStars(QUEST_GAME_ID);
      var qBtn = document.createElement("button");
      qBtn.type = "button";
      qBtn.className = "subject-card quest-card";
      qBtn.innerHTML =
        '<span class="icon">' + QUEST.icon + "</span><div><h3>" + QUEST.title +
        "</h3><p>" + QUEST.blurb + '</p></div><span class="pill-stars">' +
        starText(qStars) + "</span>";
      qBtn.addEventListener("click", openQuest);
      els.subjectGrid.appendChild(qBtn);
    }
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
    state.queue = Engine.pickRound(game.bank, game.roundSize || 10);
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
    els.resultStars.textContent = starText(stars);
    els.resultScore.textContent =
      "Točno " + state.correct + " od " + total + " zadataka";
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

  // ---- Potraga za blagom (izazov) ----
  function openQuest() {
    quest.queue = Engine.pickRound(QUEST.bank, QUEST.roundSize || 8);
    quest.index = 0;
    quest.correct = 0;
    quest.results = [];
    quest.done = false;
    els.questTitle.textContent = QUEST.title;
    els.questStory.textContent = QUEST.story;
    showView("quest");
    questStep();
  }

  function renderQuestMap() {
    els.questMap.innerHTML = "";
    var total = quest.queue.length;
    for (var i = 0; i < total; i++) {
      var stop = document.createElement("span");
      stop.className = "quest-stop";
      var isLast = i === total - 1;
      var label;
      if (quest.results[i] === true) {
        stop.classList.add("solved");
        label = "💎";
      } else if (quest.results[i] === false) {
        stop.classList.add("missed");
        label = "•";
      } else if (i === quest.index && !quest.done) {
        stop.classList.add("current");
        label = isLast ? "🗝️" : "📍";
      } else {
        stop.classList.add("locked");
        label = isLast ? "🧰" : "•";
      }
      if (quest.done && isLast) label = "💰";
      stop.textContent = label;
      var name = (QUEST.stations && QUEST.stations[i]) || ("Postaja " + (i + 1));
      stop.title = name;
      els.questMap.appendChild(stop);
      if (!isLast) {
        var link = document.createElement("span");
        link.className = "quest-link" + (quest.results[i] != null ? " passed" : "");
        els.questMap.appendChild(link);
      }
    }
  }

  function questStep() {
    renderQuestMap();
    var total = quest.queue.length;
    var i = quest.index;
    var name = (QUEST.stations && QUEST.stations[i]) || ("Postaja " + (i + 1));
    var q = quest.queue[i];
    Engine.mountQuestion(q, els.questPanel, els.questActions, els.questFeedback, function (ok) {
      quest.results[i] = ok;
      if (ok) quest.correct++;
      quest.index++;
      if (quest.index >= total) finishQuest();
      else questStep();
    });
    var tag = document.createElement("p");
    tag.className = "quest-station-tag";
    tag.textContent = "Postaja " + (i + 1) + "/" + total + " · " + name;
    els.questPanel.insertBefore(tag, els.questPanel.firstChild);
  }

  function finishQuest() {
    quest.done = true;
    renderQuestMap();
    var total = quest.queue.length;
    var correct = quest.correct;
    var stars = Engine.starsFromScore(correct, total);
    Progress.setStars(QUEST_GAME_ID, stars, correct);
    els.questFeedback.className = "feedback hidden";
    els.questFeedback.textContent = "";

    var chest, title, msg;
    if (stars === 3) {
      chest = "💎"; title = "Blago je tvoje!";
      msg = "Nevjerojatno — otključao/la si zlatnu škrinju! Ti si pravi istraživač.";
    } else if (stars === 2) {
      chest = "🏆"; title = "Skoro pa blago!";
      msg = "Sjajno snalaženje na karti — probaj opet za zlatnu škrinju.";
    } else if (stars === 1) {
      chest = "🧭"; title = "Dobar trag!";
      msg = "Na pravom si putu. Još malo vježbe i blago je tvoje.";
    } else {
      chest = "🗺️"; title = "Potraga se nastavlja!";
      msg = "Svaka zagonetka te uči. Kreni ponovno i naći ćeš blago!";
    }

    els.questPanel.innerHTML =
      '<div class="quest-treasure">' +
      '<div class="quest-chest">' + chest + "</div>" +
      "<h3>" + title + "</h3>" +
      '<div class="result-stars">' + starText(stars) + "</div>" +
      "<p class=\"result-msg\">" + msg + "</p>" +
      '<p class="result-score">Skupljeno drago kamenje: ' + correct + " / " + total + "</p>" +
      "</div>";

    els.questActions.innerHTML = "";
    var again = document.createElement("button");
    again.type = "button";
    again.className = "btn primary";
    again.textContent = "Nova potraga";
    again.addEventListener("click", openQuest);
    var home = document.createElement("button");
    home.type = "button";
    home.className = "btn ghost";
    home.textContent = "Natrag u park";
    home.addEventListener("click", function () {
      renderHub();
      showView("hub");
    });
    els.questActions.appendChild(again);
    els.questActions.appendChild(home);
    refreshStars();
  }

  function goBack() {
    if (state.view === "quest") {
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
