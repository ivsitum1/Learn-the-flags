(function (global) {
  "use strict";

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  function pickRandom(arr, n) {
    if (n >= arr.length) return shuffle(arr);
    var copy = arr.slice();
    var out = [];
    var i;
    for (i = 0; i < n; i++) {
      var j = i + Math.floor(Math.random() * (copy.length - i));
      var t = copy[i];
      copy[i] = copy[j];
      copy[j] = t;
      out.push(copy[i]);
    }
    return out;
  }

  function pickRound(bank, n, gameId) {
    var want = Math.min(n, bank.length);
    if (!bank.length) return [];
    if (!gameId || !global.Progress) {
      return pickRandom(bank, want);
    }

    var seen = Progress.getSeen(gameId);
    var seenSet = {};
    seen.forEach(function (id) {
      seenSet[String(id)] = true;
    });

    var fresh = [];
    var used = [];
    var i;
    for (i = 0; i < bank.length; i++) {
      var q = bank[i];
      var id = q.id != null ? String(q.id) : null;
      if (id && seenSet[id]) used.push(q);
      else fresh.push(q);
    }

    if (fresh.length < want) {
      Progress.clearSeen(gameId);
      fresh = bank;
      used = [];
    }

    var picked = pickRandom(fresh, want);
    if (picked.length < want) {
      picked = picked.concat(pickRandom(used, want - picked.length));
    }

    Progress.markSeen(
      gameId,
      picked.map(function (q) {
        return q.id;
      })
    );
    return picked;
  }

  function starsFromScore(correct, total) {
    if (total <= 0) return 0;
    var ratio = correct / total;
    if (ratio >= 0.9) return 3;
    if (ratio >= 0.7) return 2;
    if (ratio >= 0.45) return 1;
    return 0;
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function renderVisual(container, visual) {
    if (!visual) return;
    var wrap = el("div", "q-visual");
    if (visual.kind === "tokens") {
      var count = visual.count || 0;
      var token = visual.token || "●";
      for (var i = 0; i < count; i++) {
        wrap.appendChild(el("span", "token", token));
      }
    } else if (visual.kind === "groups") {
      (visual.groups || []).forEach(function (g, idx) {
        if (idx > 0 && visual.op) {
          wrap.appendChild(el("span", "token", " " + visual.op + " "));
        }
        for (var j = 0; j < g; j++) {
          wrap.appendChild(el("span", "token", visual.token || "🍎"));
        }
      });
      if (visual.suffix) wrap.appendChild(el("span", "token", " " + visual.suffix));
    } else if (visual.kind === "text") {
      wrap.appendChild(el("span", "token", visual.text || ""));
    } else if (visual.kind === "shape") {
      var svgWrap = el("div", "shape-preview");
      svgWrap.innerHTML = shapeSvg(visual.shape);
      container.appendChild(svgWrap);
      return;
    }
    container.appendChild(wrap);
  }

  function shapeSvg(name) {
    var stroke = "#1e3a4c";
    var fill = "#ffc93c";
    if (name === "krug") {
      return '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="' + fill + '" stroke="' + stroke + '" stroke-width="4"/></svg>';
    }
    if (name === "trokut") {
      return '<svg viewBox="0 0 100 100"><polygon points="50,12 90,88 10,88" fill="' + fill + '" stroke="' + stroke + '" stroke-width="4"/></svg>';
    }
    if (name === "kvadrat") {
      return '<svg viewBox="0 0 100 100"><rect x="18" y="18" width="64" height="64" fill="' + fill + '" stroke="' + stroke + '" stroke-width="4"/></svg>';
    }
    if (name === "pravokutnik") {
      return '<svg viewBox="0 0 100 100"><rect x="10" y="28" width="80" height="44" fill="' + fill + '" stroke="' + stroke + '" stroke-width="4"/></svg>';
    }
    return "";
  }

  /**
   * Mount a question into panel/actions/feedback.
   * onAnswer(correct:boolean) called once after user commits.
   */
  function mountQuestion(q, panel, actions, feedback, onAnswer) {
    panel.innerHTML = "";
    actions.innerHTML = "";
    feedback.className = "feedback hidden";
    feedback.textContent = "";

    var answered = false;

    function finish(ok) {
      if (answered) return;
      answered = true;
      feedback.className = "feedback " + (ok ? "ok" : "bad");
      if (ok) {
        feedback.textContent = q.explainOk || "Točno! Super!";
      } else {
        feedback.textContent = q.explain || ("Točan odgovor: " + formatAnswer(q));
      }
      var nextBtn = el("button", "btn primary", "Dalje →");
      nextBtn.type = "button";
      actions.appendChild(nextBtn);
      nextBtn.addEventListener("click", function () {
        onAnswer(ok);
      });
    }

    panel.appendChild(el("p", "q-prompt", q.prompt));
    renderVisual(panel, q.visual);

    var type = q.type || "mcq";

    if (type === "mcq" || type === "truefalse" || type === "count") {
      var choices = shuffle((q.choices || []).slice());
      choices.forEach(function (c) {
        var btn = el("button", "btn choice", String(c));
        btn.type = "button";
        btn.addEventListener("click", function () {
          if (answered) return;
          var ok = String(c) === String(q.answer);
          Array.prototype.forEach.call(panel.querySelectorAll(".btn.choice"), function (b) {
            b.disabled = true;
            if (String(b.textContent) === String(q.answer)) b.classList.add("correct");
            if (b === btn && !ok) b.classList.add("wrong");
          });
          finish(ok);
        });
        panel.appendChild(btn);
      });
      return;
    }

    if (type === "order") {
      var items = shuffle((q.items || []).slice());
      var picked = [];
      var slots = el("div", "order-slots");
      var pool = el("div", "order-pool");
      panel.appendChild(slots);
      panel.appendChild(pool);

      function redrawSlots() {
        slots.innerHTML = "";
        for (var i = 0; i < q.answer.length; i++) {
          var slot = el("div", "order-slot" + (picked[i] != null ? " filled" : ""), picked[i] != null ? String(picked[i]) : "");
          slots.appendChild(slot);
        }
      }

      function checkComplete() {
        if (picked.length < q.answer.length) return;
        var ok = picked.every(function (v, i) {
          return String(v) === String(q.answer[i]);
        });
        Array.prototype.forEach.call(pool.querySelectorAll(".btn.chip"), function (b) {
          b.disabled = true;
        });
        finish(ok);
      }

      items.forEach(function (item) {
        var chip = el("button", "btn chip", String(item));
        chip.type = "button";
        chip.addEventListener("click", function () {
          if (answered || chip.classList.contains("used")) return;
          chip.classList.add("used");
          picked.push(item);
          redrawSlots();
          checkComplete();
        });
        pool.appendChild(chip);
      });
      redrawSlots();

      var undo = el("button", "btn ghost", "Poništi");
      undo.type = "button";
      actions.appendChild(undo);
      undo.addEventListener("click", function () {
        if (answered || !picked.length) return;
        var last = picked.pop();
        Array.prototype.forEach.call(pool.querySelectorAll(".btn.chip"), function (b) {
          if (b.textContent === String(last) && b.classList.contains("used")) {
            b.classList.remove("used");
            b.disabled = false;
          }
        });
        redrawSlots();
      });
      return;
    }

    if (type === "match") {
      var left = shuffle((q.pairs || []).map(function (p) { return p[0]; }));
      var right = shuffle((q.pairs || []).map(function (p) { return p[1]; }));
      var map = {};
      (q.pairs || []).forEach(function (p) {
        map[String(p[0])] = String(p[1]);
      });
      var selectedLeft = null;
      var matched = 0;
      var grid = el("div", "match-grid");
      panel.appendChild(grid);

      function makeSide(items, side) {
        items.forEach(function (item) {
          var btn = el("button", "btn choice", String(item));
          btn.type = "button";
          btn.dataset.side = side;
          btn.dataset.val = String(item);
          btn.addEventListener("click", function () {
            if (answered || btn.classList.contains("correct")) return;
            if (side === "left") {
              if (btn.dataset.matched === "1") return;
              Array.prototype.forEach.call(grid.querySelectorAll('[data-side="left"]'), function (b) {
                if (b.dataset.matched !== "1") {
                  b.style.outline = "";
                }
              });
              selectedLeft = btn;
              btn.style.outline = "3px solid #ffc93c";
              return;
            }
            if (!selectedLeft) return;
            var ok = map[selectedLeft.dataset.val] === btn.dataset.val;
            if (ok) {
              selectedLeft.classList.add("correct");
              btn.classList.add("correct");
              selectedLeft.dataset.matched = "1";
              btn.dataset.matched = "1";
              selectedLeft.style.outline = "";
              selectedLeft.disabled = true;
              btn.disabled = true;
              matched++;
              selectedLeft = null;
              if (matched >= q.pairs.length) finish(true);
            } else {
              btn.classList.add("wrong");
              selectedLeft.classList.add("wrong");
              var L = selectedLeft;
              setTimeout(function () {
                btn.classList.remove("wrong");
                L.classList.remove("wrong");
                L.style.outline = "";
              }, 450);
              selectedLeft = null;
              // one wrong attempt fails the whole match question
              Array.prototype.forEach.call(grid.querySelectorAll(".btn.choice"), function (b) {
                b.disabled = true;
              });
              finish(false);
            }
          });
          grid.appendChild(btn);
        });
      }
      makeSide(left, "left");
      makeSide(right, "right");
      return;
    }

    // fallback
    finish(false);
  }

  function formatAnswer(q) {
    if (Array.isArray(q.answer)) return q.answer.join(", ");
    return String(q.answer);
  }

  global.Engine = {
    shuffle: shuffle,
    pickRound: pickRound,
    starsFromScore: starsFromScore,
    mountQuestion: mountQuestion
  };
})(window);
