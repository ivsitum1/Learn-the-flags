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
    var ch = [d];
    [d - 1, d + 1, d + 2, d - 2, d + 3].forEach(function (v) {
      if (ch.length < 4 && v >= 0 && v <= 20 && ch.indexOf(v) < 0) ch.push(v);
    });
    racun.push(mcq(
      "Koliko je " + a + " − " + b + "?",
      d,
      ch,
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

  // ---- Dodatni zadaci po uzoru na radnu bilježnicu ----
  function calc(expr) {
    var p = expr.trim().split(/\s+/);
    var a = parseInt(p[0], 10);
    for (var i = 1; i < p.length; i += 2) {
      a = p[i] === "+" ? a + parseInt(p[i + 1], 10) : a - parseInt(p[i + 1], 10);
    }
    return a;
  }
  function prettyExpr(expr) {
    return expr.trim().split(/\s+/).map(function (t) { return t === "-" ? "−" : t; }).join(" ");
  }
  function near(ans) {
    var c = [ans];
    [-1, 1, -2, 2, 3, -3].forEach(function (d) {
      var v = ans + d;
      if (c.length < 4 && v >= 0 && v <= 20 && c.indexOf(v) < 0) c.push(v);
    });
    return c;
  }

  var rijeci = {
    1: "jedan", 2: "dva", 3: "tri", 4: "četiri", 5: "pet", 6: "šest", 7: "sedam",
    8: "osam", 9: "devet", 10: "deset", 11: "jedanaest", 12: "dvanaest", 13: "trinaest",
    14: "četrnaest", 15: "petnaest", 16: "šesnaest", 17: "sedamnaest", 18: "osamnaest",
    19: "devetnaest", 20: "dvadeset"
  };
  var redni = {
    1: "prvi", 2: "drugi", 3: "treći", 4: "četvrti", 5: "peti",
    6: "šesti", 7: "sedmi", 8: "osmi", 9: "deveti", 10: "deseti"
  };
  function wordChoices(n, map) {
    var out = [map[n]];
    [1, -1, 2, -2, 3].forEach(function (d) {
      var w = map[n + d];
      if (out.length < 4 && w && out.indexOf(w) < 0) out.push(w);
    });
    return out;
  }

  // Redni brojevi (kao "Redni brojevi": prvi, drugi, treći …)
  brojevi.push({
    type: "match",
    prompt: "Spoji broj i redni broj.",
    pairs: [["1.", "prvi"], ["2.", "drugi"], ["3.", "treći"]],
    explain: "1. prvi, 2. drugi, 3. treći."
  });
  brojevi.push({
    type: "match",
    prompt: "Spoji broj i redni broj.",
    pairs: [["4.", "četvrti"], ["5.", "peti"], ["6.", "šesti"]],
    explain: "4. četvrti, 5. peti, 6. šesti."
  });
  [3, 4, 7, 9].forEach(function (n) {
    brojevi.push(mcq("Koji je redni broj za " + n + "?", redni[n], wordChoices(n, redni),
      n + ". po redu je " + redni[n] + "."));
  });
  brojevi.push(mcq("Petar je stigao prvi, Goran drugi, a Matija treći. Tko je stigao drugi?",
    "Goran", ["Petar", "Goran", "Matija", "nitko"], "Drugi je stigao Goran."));
  brojevi.push(mcq("Koji redni broj dolazi odmah nakon rednog broja peti?",
    "šesti", ["četvrti", "peti", "šesti", "sedmi"], "Nakon petog dolazi šesti."));
  brojevi.push(order("Poredaj redne brojeve po redu.", ["prvi", "drugi", "treći"],
    "Redom: prvi, drugi, treći."));

  // Brojevne riječi (kao "Zapiši brojkama ili brojevnim riječima")
  [12, 15, 17, 19, 14, 11, 18].forEach(function (n) {
    brojevi.push(mcq("Kako se riječima piše broj " + n + "?", rijeci[n], wordChoices(n, rijeci),
      "Broj " + n + " pišemo: " + rijeci[n] + "."));
  });
  [13, 16, 20].forEach(function (n) {
    brojevi.push(mcq("Koji je to broj: " + rijeci[n] + "?", n, near(n),
      rijeci[n] + " je broj " + n + "."));
  });

  // Brojanje unaprijed i unazad (brojevi veći od 10)
  brojevi.push(mcq("Broji unaprijed: 11, 12, 13, ☐, 15. Koji broj nedostaje?", 14, near(14),
    "Nakon 13 dolazi 14."));
  brojevi.push(mcq("Broji unaprijed: 16, 17, ☐, 19. Koji broj nedostaje?", 18, near(18),
    "Nakon 17 dolazi 18."));
  brojevi.push(mcq("Broji unazad: 20, 19, ☐, 17. Koji broj nedostaje?", 18, near(18),
    "Unazad iza 19 dolazi 18."));
  brojevi.push(mcq("Broji unazad: 15, 14, 13, ☐. Koji broj nedostaje?", 12, near(12),
    "Unazad iza 13 dolazi 12."));
  brojevi.push(order("Poredaj brojeći unazad (od najvećeg do najmanjeg).", [16, 13, 9],
    "Od najvećeg: 16, 13, 9."));

  // Usporedba izraza (kao "upiši znak <, > ili =")
  [
    ["3 + 4", "6 - 5"], ["4 + 2", "8 - 3"], ["6 + 4", "10 - 0"], ["5 + 2", "4 + 3"],
    ["4 - 3", "7 - 6"], ["7 + 2", "9 - 2"], ["8 - 6", "9 - 5"], ["1 + 5", "8 + 2"]
  ].forEach(function (pair) {
    var l = calc(pair[0]), r = calc(pair[1]);
    var ans = l > r ? ">" : l < r ? "<" : "=";
    brojevi.push(mcq(
      "Usporedi: " + prettyExpr(pair[0]) + " ☐ " + prettyExpr(pair[1]) + ". Koji znak ide u kućicu?",
      ans, ["<", "=", ">"],
      prettyExpr(pair[0]) + " = " + l + ", " + prettyExpr(pair[1]) + " = " + r + ", pa je " + l + " " + ans + " " + r + "."
    ));
  });

  // Dopuna do 10 (kao domino-kartice 9+1, 8+2 …)
  function makeTen(a) {
    return mcq("Koliko nedostaje broju " + a + " do 10?", 10 - a, near(10 - a),
      a + " + " + (10 - a) + " = 10.");
  }
  [1, 2, 3, 4, 6, 7, 8, 9].forEach(function (a) { racun.push(makeTen(a)); });

  // Pribrojnik i zbroj (matematički pojmovi)
  racun.push(mcq("Prvi pribrojnik je 15, a drugi pribrojnik je 3. Koliki je zbroj?",
    18, near(18), "Zbroj = 15 + 3 = 18."));
  racun.push(mcq("Prvi pribrojnik je 12, a drugi pribrojnik je 6. Koliki je zbroj?",
    18, near(18), "Zbroj = 12 + 6 = 18."));
  racun.push(mcq("Prvi pribrojnik je 7, a zbroj je 18. Koliki je drugi pribrojnik?",
    11, near(11), "18 − 7 = 11."));
  racun.push(mcq("Kojem broju treba dodati 4 da se dobije 17?",
    13, near(13), "13 + 4 = 17."));
  racun.push(mcq("Kojem broju treba dodati 7 da se dobije 20?",
    13, near(13), "13 + 7 = 20."));

  // Jednadžbe s ravnotežom (kao "izračunaj: 12 + 5 = 6 + ☐")
  function balance(leftStr, known, boxFirst) {
    var L = calc(leftStr);
    var m = L - known;
    var right = boxFirst ? ("☐ + " + known) : (known + " + ☐");
    return mcq(
      "Koji broj nedostaje: " + prettyExpr(leftStr) + " = " + right + "?",
      m, near(m),
      prettyExpr(leftStr) + " = " + L + ", pa u kućicu ide " + m + "."
    );
  }
  [
    ["12 + 5", 6, false], ["13 + 7", 12, true], ["1 + 18", 8, false],
    ["14 + 4", 12, false], ["0 + 14", 12, false], ["15 + 0", 2, true]
  ].forEach(function (b) { racun.push(balance(b[0], b[1], b[2])); });

  // Zadaci riječima "za koliko više" i ukupno (kao zadaci sa str. 36.–37.)
  racun.push(mcq("Tina je izračunala 15 zadataka, a Lana 3 zadatka više. Koliko je zadataka izračunala Lana?",
    18, near(18), "15 + 3 = 18 zadataka."));
  racun.push(mcq("Na lijevoj strani ulice je 11 kuća, a na desnoj 7 kuća više. Koliko kuća ima na desnoj strani?",
    18, near(18), "11 + 7 = 18 kuća."));
  racun.push(mcq("Imam 12 bojica. Seka mi pokloni još 2 bojice. Koliko ću ih ukupno imati?",
    14, near(14), "12 + 2 = 14 bojica."));
  racun.push(mcq("Maja je nacrtala 13 crvenih i 2 plava cvjetića. Koliko je cvjetića nacrtala ukupno?",
    15, near(15), "13 + 2 = 15 cvjetića."));

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
