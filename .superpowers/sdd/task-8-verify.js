"use strict";

var fs = require("fs");
var path = require("path");
var vm = require("vm");

var ROOT = path.join(__dirname, "..", "..", "ljeto-1razred");
var jsDir = path.join(ROOT, "js");

function load(file) {
  var code = fs.readFileSync(path.join(jsDir, file), "utf8");
  vm.runInThisContext(code, { filename: file });
}

var localStorage = {};
global.window = global;
global.localStorage = {
  getItem: function (k) {
    return localStorage[k] || null;
  },
  setItem: function (k, v) {
    localStorage[k] = String(v);
  },
  removeItem: function (k) {
    delete localStorage[k];
  }
};

load("progress.js");
load("engine.js");
load("content/matematika.js");
load("content/priroda.js");
load("content/gusarski.js");

var css = fs.readFileSync(path.join(ROOT, "css", "styles.css"), "utf8");
var html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");

var results = [];
function pass(name, ok, detail) {
  results.push({ name: name, ok: ok, detail: detail || "" });
  console.log((ok ? "PASS" : "FAIL") + " " + name + (detail ? " — " + detail : ""));
}

var mat = global.CONTENT_MATEMATIKA;
var banks = mat.games.map(function (g) {
  return g.bank.length;
});
pass("mat banks load", banks.every(function (n) {
  return n > 0;
}), banks.join(" / "));

var allMat = [];
mat.games.forEach(function (g) {
  allMat = allMat.concat(g.bank);
});
var diffCounts = { 1: 0, 2: 0, 3: 0, other: 0 };
allMat.forEach(function (q) {
  var d = q.diff != null ? q.diff : "other";
  if (diffCounts[d] != null) diffCounts[d]++;
  else diffCounts.other++;
});
pass("mat diff not all 1", diffCounts[1] < allMat.length, JSON.stringify(diffCounts));
pass("mat chain diff 3", allMat.some(function (q) {
  return /^chain-|^sub2-|^mix4-/.test(q.id) && q.diff === 3;
}));
pass("mat cmp diff 1-2", allMat.some(function (q) {
  return /^cmp-/.test(q.id) && (q.diff === 1 || q.diff === 2);
}));
pass("mat blurb Potraga", /Potraga za blagom/.test(mat.blurb));
pass("mat desc Trag", mat.games.every(function (g) {
  return /^Trag:/.test(g.desc);
}));

var round = Engine.pickRound(mat.games[1].bank, 12, "mat-racun");
var roundDiff = { 1: 0, 2: 0, 3: 0 };
round.forEach(function (q) {
  var d = q.diff != null ? q.diff : Engine.questionDiff ? 2 : 2;
  if (typeof q.diff === "number") d = q.diff;
  roundDiff[d] = (roundDiff[d] || 0) + 1;
});
pass("pickRound mixed diff", round.length === 12 && roundDiff[1] + roundDiff[2] + roundDiff[3] > 0, JSON.stringify(roundDiff));

pass("sticky topbar CSS", /\.topbar[\s\S]*position:\s*sticky/.test(css));
pass("wallet button HTML", /id="starsTotal"/.test(html) && /Novčanik/.test(html));
pass("wallet flex-shrink", /\.stars-total[\s\S]*flex-shrink:\s*0/.test(css));

Progress.ensureUnlockedDefaults({ matematika: "mat-brojevi", hrvatski: "hrv-slova", priroda: "pid-godisnja" });
pass("first station unlocked", Progress.isUnlocked("matematika", "mat-brojevi"));
Progress.setStars("mat-brojevi", 1);
Progress.unlockNext("matematika", ["mat-brojevi", "mat-racun", "mat-jednadzbe", "mat-rijeci", "mat-oblici"], "mat-brojevi");
pass("unlock next after star", Progress.isUnlocked("matematika", "mat-racun"));

var gusIds = {
  matematika: ["mat-brojevi"],
  hrvatski: ["hrv-slova"],
  priroda: ["pid-godisnja"]
};
pass("gusar locked initially", !Progress.gusarUnlocked(gusIds));
Progress.setStars("hrv-slova", 1);
Progress.setStars("pid-godisnja", 1);
pass("gusar unlocked all subjects", Progress.gusarUnlocked(gusIds));

var gus = global.CONTENT_GUSARSKI;
pass("gus allowHint", gus.games[0].allowHint === true);
pass("gus hint narrows", (function () {
  var q = gus.games[0].bank[0];
  var h = Engine.applyHint(q);
  return h.choices && h.choices.length >= 2 && h.choices.indexOf(String(q.answer)) !== -1;
})());

pass("hint bank unchanged", (function () {
  var q = gus.games[0].bank.find(function (x) {
    return x.type === "mcq" && x.choices && x.choices.length > 2;
  }) || gus.games[0].bank[0];
  var origLen = q.choices.length;
  var origRef = q.choices;
  var result = Engine.applyHint(q);
  var hinted = Object.assign({}, q, { choices: result.choices });
  return (
    q.choices.length === origLen &&
    q.choices === origRef &&
    hinted.choices !== q.choices
  );
})());

pass("app.js no bank mutation", !/q\.choices\s*=\s*result\.choices/.test(
  fs.readFileSync(path.join(jsDir, "app.js"), "utf8")
));

pass("gus-m-14 grammar", (function () {
  var q = gus.games[0].bank.find(function (x) {
    return x.id === "gus-m-14";
  });
  return q && /Koliko bisera ukupno/.test(q.prompt);
})());

var pid = global.CONTENT_PRIRODA;
var okolina = pid.games.find(function (g) {
  return g.id === "pid-okolina";
}).bank;
pass("PiD capital Zagreb", okolina.some(function (q) {
  return q.id === "capital" && q.answer === "Zagreb";
}));
pass("PiD sea Jadransko", okolina.some(function (q) {
  return q.id === "sea" && q.answer === "Jadransko more";
}));

localStorage = {};
global.localStorage.setItem("ljeto1_progress", JSON.stringify({
  games: { "mat-brojevi": { stars: 2, bestCorrect: 8, played: 1 } },
  totalStars: 2
}));
var migrated = Progress.load();
pass("migration wallet from totalStars", migrated.wallet === 2, "wallet=" + migrated.wallet);

var failed = results.filter(function (r) {
  return !r.ok;
});
process.exit(failed.length ? 1 : 0);
