(function (global) {
  "use strict";

  function mcq(prompt, answer, choices, explain, visual) {
    return {
      type: "mcq",
      prompt: prompt,
      answer: answer,
      choices: choices,
      explain: explain || ("Točno je " + answer + "."),
      visual: visual || null
    };
  }

  function tf(prompt, answer, explain) {
    return {
      type: "truefalse",
      prompt: prompt,
      answer: answer ? "Točno" : "Netočno",
      choices: ["Točno", "Netočno"],
      explain: explain
    };
  }

  function order(prompt, answer, explain) {
    return {
      type: "order",
      prompt: prompt,
      answer: answer,
      items: answer.slice(),
      explain: explain || ("Redoslijed: " + answer.join(", "))
    };
  }

  function count(prompt, n, token, distractors) {
    var choices = [n].concat(distractors || []);
    return {
      type: "count",
      prompt: prompt,
      answer: n,
      choices: choices,
      explain: "Ima ih " + n + ".",
      visual: { kind: "tokens", count: n, token: token || "⭐" }
    };
  }

  var brojevi = [];
  // comparisons
  [[5, 8], [12, 9], [7, 7], [15, 14], [3, 11], [20, 18], [6, 6], [10, 2], [19, 16], [1, 4]].forEach(function (p) {
    var a = p[0], b = p[1];
    var ans = a > b ? ">" : a < b ? "<" : "=";
    brojevi.push(mcq(
      "Što stoji između " + a + " i " + b + "?",
      ans,
      ["<", "=", ">"],
      a + " " + ans + " " + b + "."
    ));
  });
  // missing number
  [[2, 3, 4, 5], [8, 9, 10, 11], [14, 15, 16, 17], [1, 2, 3, 4], [11, 12, 13, 14], [17, 18, 19, 20]].forEach(function (seq) {
    var missing = seq[2];
    var shown = seq[0] + ", " + seq[1] + ", ?, " + seq[3];
    brojevi.push(mcq(
      "Koji broj nedostaje: " + shown + "?",
      missing,
      [missing - 1, missing, missing + 1, missing + 2],
      "Niz ide redom: " + seq.join(", ") + "."
    ));
  });
  // before/after
  [5, 9, 12, 1, 18, 7, 15, 20].forEach(function (n) {
    if (n < 20) {
      brojevi.push(mcq("Koji broj dolazi poslije " + n + "?", n + 1, [n - 1, n, n + 1, n + 2], "Poslije " + n + " ide " + (n + 1) + "."));
    }
    if (n > 1) {
      brojevi.push(mcq("Koji broj dolazi prije " + n + "?", n - 1, [n - 2, n - 1, n, n + 1], "Prije " + n + " ide " + (n - 1) + "."));
    }
  });
  // order
  brojevi.push(order("Poredaj brojeve od najmanjeg do najvećeg.", [3, 7, 12], "Od najmanjeg: 3, 7, 12."));
  brojevi.push(order("Poredaj brojeve od najmanjeg do najvećeg.", [1, 9, 15], "Od najmanjeg: 1, 9, 15."));
  brojevi.push(order("Poredaj brojeve od najvećeg do najmanjeg.", [18, 10, 4], "Od najvećeg: 18, 10, 4."));
  brojevi.push(order("Poredaj brojeve od najmanjeg do najvećeg.", [6, 8, 20], "Od najmanjeg: 6, 8, 20."));
  brojevi.push(tf("Broj 14 je veći od broja 11.", true, "14 > 11, dakle točno."));
  brojevi.push(tf("Broj 5 je veći od broja 9.", false, "5 < 9, dakle netočno."));
  brojevi.push(mcq("Koliko ima desetica u broju 20?", 2, [0, 1, 2, 3], "20 = 2 desetice."));
  brojevi.push(mcq("Koliko ima jedinica u broju 17?", 7, [1, 7, 10, 17], "17 = 1 desetica i 7 jedinica."));

  var racun = [];
  function addQ(a, b) {
    var s = a + b;
    racun.push(mcq(
      "Koliko je " + a + " + " + b + "?",
      s,
      [s - 1, s, s + 1, s + 2 > 20 ? s - 2 : s + 2],
      a + " + " + b + " = " + s + ".",
      { kind: "groups", groups: [a, b], token: "🍎", op: "+", suffix: "= ?" }
    ));
  }
  function subQ(a, b) {
    var d = a - b;
    racun.push(mcq(
      "Koliko je " + a + " − " + b + "?",
      d,
      [d - 1 < 0 ? d + 2 : d - 1, d, d + 1, d + 2],
      a + " − " + b + " = " + d + ".",
      { kind: "groups", groups: [a], token: "🔵", suffix: "  (−" + b + ")" }
    ));
  }
  [[2, 3], [4, 5], [6, 3], [7, 2], [8, 4], [9, 5], [10, 6], [11, 4], [12, 3], [5, 5], [1, 8], [3, 7], [0, 9], [13, 2], [14, 5]].forEach(function (p) {
    if (p[0] + p[1] <= 20) addQ(p[0], p[1]);
  });
  [[9, 4], [10, 3], [12, 5], [15, 6], [8, 8], [14, 7], [11, 2], [16, 9], [7, 3], [18, 8], [13, 6], [20, 10], [17, 5], [6, 1], [19, 9]].forEach(function (p) {
    subQ(p[0], p[1]);
  });
  racun.push(count("Koliko jabuka vidiš?", 6, "🍎", [4, 5, 7]));
  racun.push(count("Koliko zvjezdica vidiš?", 9, "⭐", [7, 8, 10]));
  racun.push(count("Koliko kuglica vidiš?", 4, "🔵", [2, 3, 5]));
  racun.push(tf("5 + 5 = 10", true, "5 + 5 zaista daje 10."));
  racun.push(tf("8 − 3 = 6", false, "8 − 3 = 5, ne 6."));
  racun.push(mcq("Što je više: 7 + 2 ili 6 + 4?", "6 + 4", ["7 + 2", "6 + 4", "jednako", "ne znam"], "7+2=9, a 6+4=10."));

  // Popuni pribrojnik (kao "popuni tablicu": pribrojnik + pribrojnik = zbroj)
  function missing(a, s) {
    var m = s - a;
    var choices = [m];
    [-1, 1, -2, 2, 3, -3].forEach(function (delta) {
      var v = m + delta;
      if (choices.length < 4 && v >= 0 && v <= 20 && choices.indexOf(v) < 0) choices.push(v);
    });
    return mcq(
      "Koji broj nedostaje: " + a + " + ☐ = " + s + "?",
      m,
      choices,
      a + " + " + m + " = " + s + "."
    );
  }
  [[5, 11], [3, 10], [7, 12], [8, 20], [9, 15], [6, 11], [4, 13], [10, 16]].forEach(function (p) {
    racun.push(missing(p[0], p[1]));
  });

  // Zadaci riječima o eurima (kao zadaci 36.–39. iz radne bilježnice)
  racun.push(mcq(
    "Darko je imao 5 eura. Tata mu je dao 7 eura, a mama još 4 eura. Koliko eura sada ima Darko?",
    16, [14, 15, 16, 17], "5 + 7 + 4 = 16 eura."
  ));
  racun.push(mcq(
    "Luka je imao 5 eura, mama mu je dala još 11 eura, a on je bratu dao 7 eura. Koliko eura mu je ostalo?",
    9, [7, 8, 9, 10], "5 + 11 − 7 = 9 eura."
  ));
  racun.push(mcq(
    "Petar je imao 11 eura. Za čokoladu je platio 6 eura. Koliko eura mu je ostalo?",
    5, [4, 5, 6, 7], "11 − 6 = 5 eura."
  ));
  racun.push(mcq(
    "Marko je imao 20 eura. Kupio je knjigu za 12 eura i sok za 3 eura. Koliko eura mu je ostalo?",
    5, [4, 5, 6, 8], "20 − 12 − 3 = 5 eura."
  ));
  racun.push(mcq(
    "Ana je imala 8 eura. Baka joj je dala još 6 eura. Koliko eura sada ima Ana?",
    14, [12, 13, 14, 15], "8 + 6 = 14 eura."
  ));
  racun.push(mcq(
    "Iva je imala 9 eura. Potrošila je 4 eura, a onda dobila još 8 eura. Koliko eura sada ima?",
    13, [11, 12, 13, 14], "9 − 4 + 8 = 13 eura."
  ));
  racun.push(mcq(
    "Josip ima 6 eura. Mama mu je dala još 9 eura. Ima li dovoljno za autić koji košta 16 eura?",
    "Ne", ["Da", "Ne"], "6 + 9 = 15 eura, a autić košta 16. Fali mu 1 euro."
  ));

  // Lančani računi (računanje slijeva nadesno, s tri ili četiri člana)
  var lanac = [];
  function chain(expr) {
    var parts = expr.trim().split(/\s+/);
    var acc = parseInt(parts[0], 10);
    var pretty = String(acc);
    var steps = [];
    for (var i = 1; i < parts.length; i += 2) {
      var op = parts[i];
      var n = parseInt(parts[i + 1], 10);
      var prev = acc;
      var opDisp = op === "+" ? "+" : "−";
      if (op === "+") acc += n; else acc -= n;
      pretty += " " + opDisp + " " + n;
      steps.push(prev + " " + opDisp + " " + n + " = " + acc);
    }
    var ans = acc;
    var choices = [ans];
    [-1, 1, -2, 2, 3, -3].forEach(function (delta) {
      var v = ans + delta;
      if (choices.length < 4 && v >= 0 && v <= 20 && choices.indexOf(v) < 0) choices.push(v);
    });
    return {
      type: "mcq",
      prompt: "Izračunaj po redu (slijeva nadesno):",
      answer: ans,
      choices: choices,
      explain: steps.join(", ") + ".",
      visual: { kind: "text", text: pretty + " = ?" }
    };
  }
  [
    // tri člana
    "13 - 3 - 6", "18 - 8 - 3", "17 - 7 - 5", "16 - 6 - 4", "12 - 2 - 3",
    "19 - 9 - 7", "19 - 5 + 2", "14 - 6 + 7", "17 - 8 + 3", "14 - 4 - 7",
    "16 - 6 - 5", "20 - 10 - 5", "16 - 7 + 2", "10 - 8 + 3", "13 - 4 - 6",
    "13 - 8 + 11", "1 + 17 - 9", "11 - 1 + 5", "4 + 8 + 1", "5 + 2 - 4",
    "14 + 2 - 5", "16 - 12 + 5", "2 + 9 - 4", "18 - 15 + 6", "5 + 6 - 2",
    "7 - 4 + 11", "4 + 10 - 6", "7 + 8 - 3", "14 + 6 - 3", "15 - 8 + 6",
    "8 - 3 + 15", "13 - 4 + 5", "11 + 1 - 8", "16 - 5 + 2", "20 - 9 + 5",
    "18 - 17 + 6", "16 - 10 + 5", "8 - 6 + 15", "19 - 9 + 3", "11 - 7 + 12",
    // četiri člana
    "20 - 13 + 4 - 5", "16 - 9 + 12 - 7", "11 - 8 + 15 - 3", "14 - 12 + 8 + 7",
    "15 - 8 - 5 + 12", "11 + 5 - 12 + 4", "12 + 6 - 3 + 2", "11 + 2 - 3 + 8",
    "4 + 12 - 7 + 6", "7 - 3 + 14 - 5", "9 + 11 - 7 - 5", "6 + 8 - 10 + 7",
    "17 - 9 + 3 - 6", "13 + 3 - 5 + 7"
  ].forEach(function (expr) {
    lanac.push(chain(expr));
  });

  var oblici = [];
  var shapeNames = ["krug", "trokut", "kvadrat", "pravokutnik"];
  shapeNames.forEach(function (s) {
    oblici.push({
      type: "mcq",
      prompt: "Kako se zove ovaj oblik?",
      answer: s,
      choices: shapeNames.slice(),
      explain: "To je " + s + ".",
      visual: { kind: "shape", shape: s }
    });
  });
  // more shape recognition with different prompts
  [
    ["Koliko stranica ima trokut?", 3, [2, 3, 4, 5]],
    ["Koliko stranica ima kvadrat?", 4, [3, 4, 5, 6]],
    ["Koliko stranica ima pravokutnik?", 4, [2, 3, 4, 5]],
    ["Koliko kutova ima trokut?", 3, [2, 3, 4, 0]],
    ["Koliko kutova ima kvadrat?", 4, [3, 4, 5, 6]]
  ].forEach(function (row) {
    oblici.push(mcq(row[0], row[1], row[2], "Točan odgovor je " + row[1] + "."));
  });
  oblici.push(mcq("Koji oblik nema stranica?", "krug", shapeNames, "Krug nema stranica."));
  oblici.push(mcq("Koji oblik ima sve stranice jednake?", "kvadrat", shapeNames, "Kod kvadrata su sve stranice jednake."));
  oblici.push(tf("Krug ima 4 stranice.", false, "Krug nema stranica."));
  oblici.push(tf("Trokut ima 3 kuta.", true, "Trokut ima tri kuta i tri stranice."));
  oblici.push(tf("Kvadrat i pravokutnik imaju 4 stranice.", true, "Oba imaju četiri stranice."));
  oblici.push({
    type: "match",
    prompt: "Spoji oblik s brojem stranica.",
    pairs: [["trokut", "3"], ["kvadrat", "4"], ["krug", "0"]],
    explain: "Trokut 3, kvadrat 4, krug 0 stranica."
  });
  oblici.push({
    type: "match",
    prompt: "Spoji naziv i oblik.",
    pairs: [["⚪", "krug"], ["🔺", "trokut"], ["⬛", "kvadrat"]],
    explain: "Svaki simbol odgovara jednom obliku."
  });
  // repeat shapes with distractors for volume
  ["lopta je slična…", "prozor je često…", "krov kuće može biti…", "stranica knjige je…"].forEach(function (hint, i) {
    var ans = ["krug", "pravokutnik", "trokut", "pravokutnik"][i];
    oblici.push(mcq("U stvarnom svijetu: " + hint, ans, shapeNames, "Najbliži oblik je " + ans + "."));
  });
  for (var si = 0; si < shapeNames.length; si++) {
    oblici.push({
      type: "mcq",
      prompt: "Odaberi točan naziv oblika.",
      answer: shapeNames[si],
      choices: shapeNames.slice(),
      explain: "To je " + shapeNames[si] + ".",
      visual: { kind: "shape", shape: shapeNames[si] }
    });
  }
  oblici.push(order("Poredaj oblike po broju stranica (od najmanje).", ["krug", "trokut", "kvadrat"], "0, pa 3, pa 4 stranice."));
  oblici.push(mcq("Ako imaš 2 trokuta, koliko imaš stranica ukupno?", 6, [3, 4, 5, 6], "2 × 3 = 6 stranica."));
  oblici.push(mcq("Koliko kvadrata treba za 8 stranica?", 2, [1, 2, 3, 4], "Jedan kvadrat ima 4 stranice."));
  oblici.push(tf("Pravokutnik ima 3 stranice.", false, "Pravokutnik ima 4 stranice."));
  oblici.push(tf("Svi kvadrati su i pravokutnici.", true, "Kvadrat je poseban pravokutnik s jednakim stranicama."));

  global.CONTENT_MATEMATIKA = {
    id: "matematika",
    title: "Matematika",
    icon: "🔢",
    blurb: "Brojevi do 20, zbrajanje, oduzimanje i oblici.",
    color: "mat",
    games: [
      {
        id: "mat-brojevi",
        title: "Brojevi do 20",
        emoji: "🔢",
        desc: "Usporedi brojeve, nađi što nedostaje i poredaj ih.",
        roundSize: 10,
        bank: brojevi
      },
      {
        id: "mat-racun",
        title: "Zbrajanje i oduzimanje",
        emoji: "➕",
        desc: "Računaj do 20, popuni pribrojnik i riješi zadatke o eurima.",
        roundSize: 10,
        bank: racun
      },
      {
        id: "mat-lanac",
        title: "Lančani računi",
        emoji: "🔗",
        desc: "Zbrajaj i oduzimaj po redu, s tri ili četiri broja.",
        roundSize: 10,
        bank: lanac
      },
      {
        id: "mat-oblici",
        title: "Oblici",
        emoji: "🔷",
        desc: "Prepoznaj krug, trokut, kvadrat i pravokutnik.",
        roundSize: 10,
        bank: oblici
      }
    ]
  };
})(window);
