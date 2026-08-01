#!/usr/bin/env node
/* ===========================================================================
   Provjera sadržaja Ljetnog parka — pokreni s:

       node ljeto-1razred/tools/check-content.js

   Aplikacija nema build korak pa greške u bankama zadataka nitko ne uhvati
   dok dijete ne naiđe na njih. Ova skripta učita iste datoteke kao preglednik
   i provjeri ono što se u praksi lomilo:

     • svaka stanica sa staze postoji u sadržaju (i obratno),
     • staro spremljeno stanje (preimenovane stanice) i dalje otključa 1. stanicu,
     • svako pitanje je rješivo: točan odgovor je među ponuđenima,
       nema dvostrukih ponuda, parovi za spajanje su jednoznačni,
     • runda uvijek ima traženi broj zadataka i ne ponavlja isti,
     • stanice s oznakom „quota“ doista dobiju tražene zadatke.

   Izlazni kôd 1 = nešto ne valja.
   =========================================================================== */
"use strict";

var path = require("path");
var ROOT = path.join(__dirname, "..");

var store = {};
global.localStorage = {
  getItem: function (k) {
    return Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null;
  },
  setItem: function (k, v) {
    store[k] = String(v);
  },
  removeItem: function (k) {
    delete store[k];
  }
};
global.window = global;

[
  "js/progress.js",
  "js/engine.js",
  "js/rewards.js",
  "js/content/matematika.js",
  "js/content/nina-tino-hrvatski.js",
  "js/content/hrvatski.js",
  "js/content/priroda.js",
  "js/content/gusarski.js"
].forEach(function (rel) {
  require(path.join(ROOT, rel));
});

var problems = [];
function fail(msg) {
  problems.push(msg);
}

// Isti redoslijed stanica kao u js/app.js.
var STATION_ORDER = {
  matematika: [
    "mat-prostor", "mat-brojevi", "mat-redni", "mat-broj-rijeci", "mat-racun",
    "mat-lanac", "mat-jednadzbe", "mat-rijeci", "mat-zadaci", "mat-oblici"
  ],
  hrvatski: [
    "hrv-prvo-zadnje", "hrv-duljina", "hrv-velika-mala", "hrv-abeceda",
    "hrv-slogovi", "hrv-sastavi", "hrv-recenica", "hrv-pravopis", "hrv-citanje",
    "hrv-razumijevanje", "hrv-nt-glasovi", "hrv-nt-slova", "hrv-nt-rijeci",
    "hrv-nt-usporedbe", "hrv-nt-recenice", "hrv-nt-skola"
  ],
  priroda: [
    "pid-godisnja", "pid-mjeseci", "pid-vrijeme", "pid-zivo", "pid-zivotinje",
    "pid-biljke", "pid-tijelo", "pid-dani", "pid-okolina"
  ]
};

var SUBJECTS = {
  matematika: global.CONTENT_MATEMATIKA,
  hrvatski: global.CONTENT_HRVATSKI,
  priroda: global.CONTENT_PRIRODA,
  gusarski: global.CONTENT_GUSARSKI
};

/* --- 1. Staza i sadržaj se poklapaju --------------------------------------- */
Object.keys(STATION_ORDER).forEach(function (sid) {
  var sub = SUBJECTS[sid];
  if (!sub) return fail("nema sadržaja za predmet " + sid);
  var have = {};
  sub.games.forEach(function (g) {
    have[g.id] = true;
  });
  STATION_ORDER[sid].forEach(function (gid) {
    if (!have[gid]) fail(sid + ": staza traži stanicu „" + gid + "“ koje nema u sadržaju");
  });
  sub.games.forEach(function (g) {
    if (STATION_ORDER[sid].indexOf(g.id) === -1) {
      fail(sid + ": stanica „" + g.id + "“ postoji, ali nije na stazi — nedostupna je");
    }
  });
});

/* --- 2. Staro spremljeno stanje ne smije zaključati predmet ----------------- */
store["ljeto1_progress"] = JSON.stringify({
  games: { "hrv-slova": { stars: 3 } },
  totalStars: 3,
  wallet: 3,
  spent: [],
  unlocked: { hrvatski: ["hrv-slova"], matematika: ["mat-brojevi"] }
});
global.Progress.ensureUnlockedDefaults(STATION_ORDER);
Object.keys(STATION_ORDER).forEach(function (sid) {
  var first = STATION_ORDER[sid][0];
  if (!global.Progress.isUnlocked(sid, first)) {
    fail(sid + ": prva stanica („" + first + "“) ostala je zaključana nakon migracije");
  }
});

/* --- 3. Svako pitanje mora biti rješivo ------------------------------------- */
function checkQuestion(q, where) {
  var type = q.type || "mcq";
  if (!q.prompt) fail(where + "/" + q.id + ": nema teksta pitanja");

  if (type === "mcq" || type === "truefalse" || type === "count") {
    var choices = (q.choices || []).map(String);
    if (choices.indexOf(String(q.answer)) === -1) {
      fail(where + "/" + q.id + ": točan odgovor nije među ponuđenima");
    }
    if (choices.length < 2) fail(where + "/" + q.id + ": manje od dvije ponude");
    var seen = {};
    choices.forEach(function (c) {
      if (seen[c]) fail(where + "/" + q.id + ": dvije jednake ponude („" + c + "“)");
      seen[c] = true;
    });
  } else if (type === "order") {
    if (!Array.isArray(q.answer) || !q.answer.length) {
      fail(where + "/" + q.id + ": nedostaje redoslijed");
    }
    var items = (q.items || []).map(String).sort().join("|");
    var answer = (q.answer || []).map(String).sort().join("|");
    if (items !== answer) fail(where + "/" + q.id + ": ponuđeni dijelovi ne odgovaraju rješenju");
  } else if (type === "match") {
    if (!Array.isArray(q.pairs) || q.pairs.length < 2) {
      fail(where + "/" + q.id + ": premalo parova");
    }
    var left = {};
    var right = {};
    (q.pairs || []).forEach(function (p) {
      if (left[p[0]]) fail(where + "/" + q.id + ": dvaput isti lijevi pojam („" + p[0] + "“)");
      if (right[p[1]]) fail(where + "/" + q.id + ": dvaput isti desni pojam („" + p[1] + "“)");
      left[p[0]] = true;
      right[p[1]] = true;
    });
  } else {
    fail(where + "/" + q.id + ": nepoznat tip pitanja „" + type + "“");
  }
}

var ROUNDS = 25;
var totalQuestions = 0;

Object.keys(SUBJECTS).forEach(function (sid) {
  var sub = SUBJECTS[sid];
  if (!sub) return;
  sub.games.forEach(function (game) {
    if (!Array.isArray(game.bank) || !game.bank.length) {
      return fail(sid + "/" + game.id + ": prazna banka zadataka");
    }
    totalQuestions += game.bank.length;

    var ids = {};
    game.bank.forEach(function (q) {
      if (q.id == null) return fail(sid + "/" + game.id + ": pitanje bez id-a");
      if (ids[q.id]) fail(sid + "/" + game.id + ": dva pitanja s id-om „" + q.id + "“");
      ids[q.id] = true;
      checkQuestion(q, sid + "/" + game.id);
    });

    var want = Math.min(game.roundSize || 10, game.bank.length);
    var quotaSeen = 0;
    for (var r = 0; r < ROUNDS; r++) {
      var round = global.Engine.pickRound(game.bank, game.roundSize || 10, game.id, game.quota);
      if (round.length !== want) {
        fail(sid + "/" + game.id + ": runda ima " + round.length + " zadataka umjesto " + want);
        break;
      }
      var inRound = {};
      round.forEach(function (q) {
        if (inRound[q.id]) fail(sid + "/" + game.id + ": isti zadatak dvaput u rundi");
        inRound[q.id] = true;
      });
      if (game.quota) {
        Object.keys(game.quota).forEach(function (tag) {
          var got = round.filter(function (q) {
            return q.tag === tag;
          }).length;
          var expect = Math.min(
            game.quota[tag],
            game.bank.filter(function (q) {
              return q.tag === tag;
            }).length
          );
          if (got < expect) {
            fail(sid + "/" + game.id + ": runda ima " + got + " „" + tag + "“ zadataka, treba " + expect);
          }
          quotaSeen += got;
        });
      }
    }
    if (game.quota && quotaSeen === 0) {
      fail(sid + "/" + game.id + ": oznaka „quota“ postoji, ali nijedan zadatak nije označen");
    }
  });
});

if (problems.length) {
  console.error("✗ Pronađeno " + problems.length + " problema:\n");
  problems.slice(0, 50).forEach(function (p) {
    console.error("  • " + p);
  });
  if (problems.length > 50) console.error("  … i još " + (problems.length - 50));
  process.exit(1);
}

console.log("✓ Sadržaj je u redu — " + totalQuestions + " zadataka, sve staze prohodne.");
