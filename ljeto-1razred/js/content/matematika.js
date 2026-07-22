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

  // ---- Zajednički pomoćnici ----
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
  // 4 jedinstvena, smislena ponuđena odgovora oko točnog (u rasponu 0–20)
  function near(ans) {
    var c = [ans];
    [1, -1, 2, -2, 3, -3].forEach(function (d) {
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
    [1, -1, 2, -2, 3, -3].forEach(function (d) {
      var w = map[n + d];
      if (out.length < 4 && w && out.indexOf(w) < 0) out.push(w);
    });
    return out;
  }

  // =========================================================
  // 1) BROJEVI DO 20 — usporedba, nizovi, mjesne vrijednosti
  // =========================================================
  var brojevi = [];
  // usporedba brojeva (bliski dvoznamenkasti)
  [[13, 11], [17, 19], [20, 15], [14, 14], [8, 18], [16, 13], [19, 20], [11, 7], [12, 15], [18, 16]].forEach(function (p) {
    var a = p[0], b = p[1];
    var ans = a > b ? ">" : a < b ? "<" : "=";
    brojevi.push(mcq("Koji znak ide u kućicu: " + a + " ☐ " + b + "?", ans, ["<", "=", ">"], a + " " + ans + " " + b + "."));
  });
  // broj između
  [[14, 16], [17, 19], [11, 13], [8, 10], [18, 20]].forEach(function (p) {
    var mid = (p[0] + p[1]) / 2;
    brojevi.push(mcq("Koji je broj između " + p[0] + " i " + p[1] + "?", mid, near(mid), "Između " + p[0] + " i " + p[1] + " je " + mid + "."));
  });
  // za koliko veći/manji
  brojevi.push(mcq("Koji je broj za 3 veći od 12?", 15, near(15), "12 + 3 = 15."));
  brojevi.push(mcq("Koji je broj za 4 manji od 20?", 16, near(16), "20 − 4 = 16."));
  brojevi.push(mcq("Koji je broj za 5 veći od 9?", 14, near(14), "9 + 5 = 14."));
  brojevi.push(mcq("Koji je broj za 6 manji od 15?", 9, near(9), "15 − 6 = 9."));
  brojevi.push(mcq("Koji je broj za 8 veći od 8?", 16, near(16), "8 + 8 = 16."));
  // nizovi s korakom (brojanje po 2, 3, 5 – unaprijed i unazad)
  brojevi.push(mcq("Nastavi niz: 2, 4, 6, ☐, 10. Koji broj nedostaje?", 8, near(8), "Niz raste za 2."));
  brojevi.push(mcq("Nastavi niz: 20, 18, 16, ☐. Koji broj nedostaje?", 14, near(14), "Niz pada za 2."));
  brojevi.push(mcq("Nastavi niz: 5, 10, ☐, 20. Koji broj nedostaje?", 15, near(15), "Niz raste za 5."));
  brojevi.push(mcq("Nastavi niz: 3, 6, 9, ☐. Koji broj nedostaje?", 12, near(12), "Niz raste za 3."));
  brojevi.push(mcq("Nastavi niz: 1, 3, 5, ☐, 9. Koji broj nedostaje?", 7, near(7), "Niz raste za 2."));
  brojevi.push(mcq("Broji unazad: 15, 14, 13, ☐. Koji broj nedostaje?", 12, near(12), "Iza 13 unazad dolazi 12."));
  // mjesne vrijednosti
  brojevi.push(mcq("Koliko je 10 + 7?", 17, near(17), "1 desetica i 7 jedinica je 17."));
  brojevi.push(mcq("Koji broj ima 1 deseticu i 8 jedinica?", 18, near(18), "10 + 8 = 18."));
  brojevi.push(mcq("Koliko jedinica ima broj 16?", 6, [6, 1, 10, 16], "16 = 1 desetica i 6 jedinica."));
  brojevi.push(mcq("Koliko desetica ima broj 14?", 1, [0, 1, 2, 4], "14 = 1 desetica i 4 jedinice."));
  brojevi.push(mcq("Koji broj ima 1 deseticu i 5 jedinica?", 15, near(15), "10 + 5 = 15."));
  brojevi.push(mcq("Dopuni: 17 = 10 + ☐.", 7, near(7), "10 + 7 = 17."));
  brojevi.push(mcq("Koliko je 2 desetice?", 20, near(20), "2 desetice = 20."));
  // najveći / najmanji / poredak
  brojevi.push(mcq("Koji je najveći: 13, 18, 11?", 18, [11, 13, 18, 20], "Najveći je 18."));
  brojevi.push(mcq("Koji je najmanji: 15, 9, 12?", 9, [9, 12, 15, 8], "Najmanji je 9."));
  brojevi.push(order("Poredaj od najmanjeg do najvećeg.", [9, 13, 17], "Redom: 9, 13, 17."));
  brojevi.push(order("Poredaj od najvećeg do najmanjeg.", [20, 14, 8], "Redom: 20, 14, 8."));
  brojevi.push(order("Poredaj od najmanjeg do najvećeg.", [11, 15, 16, 19], "Redom: 11, 15, 16, 19."));
  brojevi.push(tf("Broj 14 je veći od broja 17.", false, "14 < 17, dakle netočno."));
  brojevi.push(tf("Broj 20 je najveći broj u nizu do 20.", true, "Do 20 je 20 najveći."));

  // =========================================================
  // 2) REDNI BROJEVI — prvi … deseti, snalaženje u nizu
  // =========================================================
  var redniB = [];
  redniB.push({ type: "match", prompt: "Spoji broj i redni broj.", pairs: [["1.", "prvi"], ["2.", "drugi"], ["3.", "treći"]], explain: "1. prvi, 2. drugi, 3. treći." });
  redniB.push({ type: "match", prompt: "Spoji broj i redni broj.", pairs: [["4.", "četvrti"], ["5.", "peti"], ["6.", "šesti"]], explain: "4. četvrti, 5. peti, 6. šesti." });
  redniB.push({ type: "match", prompt: "Spoji broj i redni broj.", pairs: [["7.", "sedmi"], ["8.", "osmi"], ["9.", "deveti"], ["10.", "deseti"]], explain: "7. sedmi, 8. osmi, 9. deveti, 10. deseti." });
  [3, 4, 6, 7, 8, 9].forEach(function (n) {
    redniB.push(mcq("Koji je redni broj za " + n + "?", redni[n], wordChoices(n, redni), n + ". po redu je " + redni[n] + "."));
  });
  redniB.push(mcq("Ana je peta u redu. Koliko je djece ispred nje?", 4, near(4), "Ispred pete osobe su četiri osobe."));
  redniB.push(mcq("Ti si šesti u redu. Koliko je ljudi ispred tebe?", 5, near(5), "Ispred šestog je pet ljudi."));
  redniB.push(mcq("U redu je 8 djece, Marko je posljednji. Koji je Marko po redu?", "osmi", ["šesti", "sedmi", "osmi", "deveti"], "Posljednji od 8 je osmi."));
  redniB.push(mcq("Koji je redni broj između trećeg i petog?", "četvrti", ["drugi", "treći", "četvrti", "peti"], "Između trećeg i petog je četvrti."));
  redniB.push(mcq("Redoslijed na cilju: Petar, Goran, Matija, Iva. Tko je ušao treći?", "Matija", ["Petar", "Goran", "Matija", "Iva"], "Treći je Matija."));
  redniB.push(mcq("Koji redni broj dolazi odmah prije osmoga?", "sedmi", ["šesti", "sedmi", "osmi", "deveti"], "Prije osmog je sedmi."));
  redniB.push(mcq("Koji redni broj dolazi odmah nakon devetoga?", "deseti", ["osmi", "deveti", "deseti", "jedanaesti"], "Nakon devetog je deseti."));
  redniB.push(order("Poredaj redne brojeve po redu.", ["prvi", "drugi", "treći", "četvrti"], "Redom: prvi, drugi, treći, četvrti."));
  redniB.push(tf("Peti dolazi poslije šestog.", false, "Peti dolazi prije šestog."));
  redniB.push(tf("Ako si prvi, nitko nije ispred tebe.", true, "Prvi je na početku reda."));

  // =========================================================
  // 3) BROJEVNE RIJEČI — brojka ↔ riječ, računanje pa riječ
  // =========================================================
  var rijeciB = [];
  [12, 15, 17, 19, 14, 11, 18, 16].forEach(function (n) {
    rijeciB.push(mcq("Kako se riječima piše broj " + n + "?", rijeci[n], wordChoices(n, rijeci), "Broj " + n + " pišemo: " + rijeci[n] + "."));
  });
  [13, 16, 20, 11, 17].forEach(function (n) {
    rijeciB.push(mcq("Koji je to broj: " + rijeci[n] + "?", n, near(n), rijeci[n] + " je broj " + n + "."));
  });
  // izračunaj pa napiši riječima (teže: spoj računanja i riječi)
  [["8 + 6", 14], ["20 - 5", 15], ["9 + 9", 18], ["7 + 6", 13], ["11 + 6", 17], ["19 - 8", 11]].forEach(function (p) {
    var v = calc(p[0]);
    rijeciB.push(mcq("Izračunaj i napiši riječima: " + prettyExpr(p[0]) + " = ?", rijeci[v], wordChoices(v, rijeci), prettyExpr(p[0]) + " = " + v + " = " + rijeci[v] + "."));
  });
  rijeciB.push(mcq("Što je veće: trinaest ili petnaest?", "petnaest", ["trinaest", "petnaest", "jednako", "ne znam"], "15 je veće od 13."));
  rijeciB.push(mcq("Što je manje: osamnaest ili četrnaest?", "četrnaest", ["osamnaest", "četrnaest", "jednako", "ne znam"], "14 je manje od 18."));
  rijeciB.push(order("Poredaj brojeve od najmanjeg (napisani su riječima).", ["jedanaest", "petnaest", "dvadeset"], "11, 15, 20 → jedanaest, petnaest, dvadeset."));

  // =========================================================
  // 4) ZBRAJANJE I ODUZIMANJE DO 20 — prijelaz preko desetice
  // =========================================================
  var racun = [];
  function addQ(a, b) {
    var s = a + b;
    racun.push(mcq("Koliko je " + a + " + " + b + "?", s, near(s), a + " + " + b + " = " + s + "."));
  }
  function subQ(a, b) {
    var d = a - b;
    racun.push(mcq("Koliko je " + a + " − " + b + "?", d, near(d), a + " − " + b + " = " + d + "."));
  }
  // zbrajanje s prijelazom preko 10
  [[8, 5], [7, 6], [9, 4], [6, 8], [5, 9], [7, 8], [9, 9], [6, 7], [8, 6], [9, 7], [8, 8], [9, 8], [5, 8], [4, 9]].forEach(function (p) { addQ(p[0], p[1]); });
  // oduzimanje s prijelazom preko 10
  [[13, 5], [15, 8], [12, 7], [16, 9], [14, 6], [11, 4], [17, 8], [20, 13], [13, 7], [15, 9], [18, 9], [14, 8], [16, 7], [11, 5]].forEach(function (p) { subQ(p[0], p[1]); });
  // dopuna do 10 i do 20
  [3, 4, 6, 7, 8, 9].forEach(function (a) {
    racun.push(mcq("Koliko nedostaje broju " + a + " do 10?", 10 - a, near(10 - a), a + " + " + (10 - a) + " = 10."));
  });
  [13, 15, 11, 18, 14, 16].forEach(function (a) {
    racun.push(mcq("Koliko nedostaje broju " + a + " do 20?", 20 - a, near(20 - a), a + " + " + (20 - a) + " = 20."));
  });
  // nepoznati pribrojnik / umanjenik / umanjitelj (razni položaji)
  racun.push(mcq("Koji broj nedostaje: ☐ + 6 = 15?", 9, near(9), "9 + 6 = 15."));
  racun.push(mcq("Koji broj nedostaje: 8 + ☐ = 17?", 9, near(9), "8 + 9 = 17."));
  racun.push(mcq("Koji broj nedostaje: 17 − ☐ = 9?", 8, near(8), "17 − 8 = 9."));
  racun.push(mcq("Koji broj nedostaje: ☐ − 5 = 8?", 13, near(13), "13 − 5 = 8."));
  racun.push(mcq("Koji broj nedostaje: 20 − ☐ = 12?", 8, near(8), "20 − 8 = 12."));
  racun.push(mcq("Koji broj nedostaje: ☐ + 9 = 18?", 9, near(9), "9 + 9 = 18."));
  racun.push(mcq("Koji broj nedostaje: 14 − ☐ = 6?", 8, near(8), "14 − 8 = 6."));
  // usporedba računa i točno/netočno
  racun.push(mcq("Što je više: 7 + 8 ili 20 − 6?", "7 + 8", ["7 + 8", "20 − 6", "jednako", "ne znam"], "7 + 8 = 15, a 20 − 6 = 14."));
  racun.push(tf("8 + 7 = 16", false, "8 + 7 = 15, ne 16."));
  racun.push(tf("13 − 6 = 7", true, "13 − 6 zaista daje 7."));

  // =========================================================
  // 5) LANČANI RAČUNI — tri ili četiri člana, slijeva nadesno
  // =========================================================
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
    return {
      type: "mcq",
      prompt: "Izračunaj po redu (slijeva nadesno):",
      answer: acc,
      choices: near(acc),
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
    "17 - 9 + 3 - 6", "13 + 3 - 5 + 7",
    // teži četveročlani s prijelazom preko desetice
    "8 + 9 - 5 + 3", "7 + 8 - 6 + 4", "13 - 8 + 12 - 9", "6 + 7 - 9 + 8",
    "15 - 7 + 6 - 5", "9 + 8 - 4 - 7", "12 - 9 + 15 - 6", "4 + 9 - 6 + 8",
    "16 - 8 + 7 - 5", "11 + 7 - 9 + 4"
  ].forEach(function (expr) { lanac.push(chain(expr)); });

  // =========================================================
  // 6) JEDNADŽBE I RAVNOTEŽE — obje strane jednake, magični kvadrat
  // =========================================================
  var jednadzbe = [];
  function balance(leftStr, known, boxFirst) {
    var L = calc(leftStr);
    var m = L - known;
    var right = boxFirst ? ("☐ + " + known) : (known + " + ☐");
    return mcq("Koji broj nedostaje: " + prettyExpr(leftStr) + " = " + right + "?", m, near(m),
      prettyExpr(leftStr) + " = " + L + ", pa u kućicu ide " + m + ".");
  }
  [
    ["12 + 5", 6, false], ["13 + 7", 12, true], ["1 + 18", 8, false], ["14 + 4", 12, false],
    ["0 + 14", 12, false], ["15 + 0", 2, true], ["18 - 5", 8, false], ["20 - 6", 9, true],
    ["16 - 3", 7, false]
  ].forEach(function (b) { jednadzbe.push(balance(b[0], b[1], b[2])); });
  // jednakosti s dvije operacije
  jednadzbe.push(mcq("Koji broj nedostaje: 9 + ☐ = 6 + 8?", 5, near(5), "6 + 8 = 14, pa je 9 + 5 = 14."));
  jednadzbe.push(mcq("Koji broj nedostaje: ☐ − 4 = 3 + 5?", 12, near(12), "3 + 5 = 8, pa je 12 − 4 = 8."));
  jednadzbe.push(mcq("Koji broj nedostaje: 7 + 6 = 20 − ☐?", 7, near(7), "7 + 6 = 13, pa je 20 − 7 = 13."));
  jednadzbe.push(mcq("Koji broj nedostaje: 14 = 20 − ☐?", 6, near(6), "20 − 6 = 14."));
  jednadzbe.push(mcq("Koji broj nedostaje: 11 + ☐ = 18 − 2?", 5, near(5), "18 − 2 = 16, pa je 11 + 5 = 16."));
  // magični kvadrat (zbroj u retku je 15)
  [[6, 5], [8, 1], [2, 7], [9, 4], [3, 5], [8, 3]].forEach(function (p) {
    var m = 15 - p[0] - p[1];
    jednadzbe.push(mcq("U magičnom kvadratu zbroj u retku je 15. U retku su " + p[0] + " i " + p[1] + ". Koji broj nedostaje?", m, near(m), p[0] + " + " + p[1] + " + " + m + " = 15."));
  });
  // točno / netočno jednakosti
  jednadzbe.push(tf("12 + 6 = 9 + 9", true, "Obje strane daju 18."));
  jednadzbe.push(tf("15 − 3 = 6 + 5", false, "15 − 3 = 12, a 6 + 5 = 11."));
  jednadzbe.push(tf("7 + 8 = 20 − 5", true, "Obje strane daju 15."));
  jednadzbe.push(tf("14 − 5 = 3 + 5", false, "14 − 5 = 9, a 3 + 5 = 8."));

  // =========================================================
  // 7) ZADACI RIJEČIMA — višekoračni, razlika, „za koliko više"
  // =========================================================
  var zadaci = [];
  zadaci.push(mcq("Darko je imao 5 eura. Tata mu je dao 7 eura, a mama još 4 eura. Koliko eura sada ima Darko?", 16, near(16), "5 + 7 + 4 = 16 eura."));
  zadaci.push(mcq("Luka je imao 5 eura, mama mu je dala još 11 eura, a on je bratu dao 7 eura. Koliko eura mu je ostalo?", 9, near(9), "5 + 11 − 7 = 9 eura."));
  zadaci.push(mcq("Marko je imao 20 eura. Kupio je knjigu za 12 eura i sok za 3 eura. Koliko eura mu je ostalo?", 5, near(5), "20 − 12 − 3 = 5 eura."));
  zadaci.push(mcq("Iva je imala 9 eura. Potrošila je 4 eura, a onda dobila još 8 eura. Koliko eura sada ima?", 13, near(13), "9 − 4 + 8 = 13 eura."));
  zadaci.push(mcq("Josip ima 6 eura. Mama mu je dala još 9 eura. Ima li dovoljno za autić koji košta 16 eura?", "Ne", ["Da", "Ne"], "6 + 9 = 15 eura, a autić košta 16. Fali mu 1 euro."));
  zadaci.push(mcq("Tina je izračunala 15 zadataka, a Lana 3 zadatka više. Koliko je zadataka izračunala Lana?", 18, near(18), "15 + 3 = 18 zadataka."));
  zadaci.push(mcq("Na lijevoj strani ulice je 11 kuća, a na desnoj 7 kuća više. Koliko kuća ima na desnoj strani?", 18, near(18), "11 + 7 = 18 kuća."));
  zadaci.push(mcq("Ana ima 15 eura, a Iva 8 eura. Za koliko eura Ana ima više od Ive?", 7, near(7), "15 − 8 = 7 eura."));
  zadaci.push(mcq("Marko ima 12 sličica, a Ivan 5. Za koliko sličica Marko ima više?", 7, near(7), "12 − 5 = 7 sličica."));
  zadaci.push(mcq("U košari je 8 jabuka i 6 krušaka. Pojeli su 5 komada voća. Koliko je voća ostalo?", 9, near(9), "8 + 6 − 5 = 9 komada."));
  zadaci.push(mcq("U autobusu je 12 putnika. Na stanici izađe 5, a uđu 4 putnika. Koliko je sada putnika?", 11, near(11), "12 − 5 + 4 = 11 putnika."));
  zadaci.push(mcq("Na grani je 14 ptica. Odleti 9, a doleti 3. Koliko je ptica sada na grani?", 8, near(8), "14 − 9 + 3 = 8 ptica."));
  zadaci.push(mcq("Imam 12 bojica. Seka mi pokloni još 2 bojice. Koliko ću ih ukupno imati?", 14, near(14), "12 + 2 = 14 bojica."));
  zadaci.push(mcq("Maja je nacrtala 13 crvenih i 2 plava cvjetića. Koliko je cvjetića nacrtala ukupno?", 15, near(15), "13 + 2 = 15 cvjetića."));
  zadaci.push(mcq("Petar je imao 11 eura. Za čokoladu je platio 6 eura. Koliko eura mu je ostalo?", 5, near(5), "11 − 6 = 5 eura."));
  zadaci.push(mcq("U razredu je 9 djevojčica i 8 dječaka. Koliko je ukupno učenika?", 17, near(17), "9 + 8 = 17 učenika."));

  // =========================================================
  // 8) OBLICI — prepoznavanje i svojstva
  // =========================================================
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
  oblici.push(mcq("Ako imaš 2 trokuta, koliko imaš stranica ukupno?", 6, [3, 4, 5, 6], "2 puta po 3 = 6 stranica."));
  oblici.push(mcq("Koliko kvadrata treba za 8 stranica?", 2, [1, 2, 3, 4], "Jedan kvadrat ima 4 stranice."));
  oblici.push(tf("Pravokutnik ima 3 stranice.", false, "Pravokutnik ima 4 stranice."));
  oblici.push(tf("Svi kvadrati su i pravokutnici.", true, "Kvadrat je poseban pravokutnik s jednakim stranicama."));

  global.CONTENT_MATEMATIKA = {
    id: "matematika",
    title: "Matematika",
    icon: "🔢",
    blurb: "Brojevi do 20, računanje, jednadžbe, zadaci i oblici.",
    color: "mat",
    games: [
      {
        id: "mat-brojevi",
        title: "Brojevi do 20",
        emoji: "🔢",
        desc: "Usporedi, nastavi niz, mjesna vrijednost i poredak.",
        roundSize: 10,
        bank: brojevi
      },
      {
        id: "mat-redni",
        title: "Redni brojevi",
        emoji: "🥇",
        desc: "Prvi do deseti i snalaženje u redu.",
        roundSize: 10,
        bank: redniB
      },
      {
        id: "mat-rijeci",
        title: "Brojevne riječi",
        emoji: "✍️",
        desc: "Brojka ↔ riječ, pa i izračunaj i napiši riječima.",
        roundSize: 10,
        bank: rijeciB
      },
      {
        id: "mat-racun",
        title: "Zbrajanje i oduzimanje",
        emoji: "➕",
        desc: "Računaj do 20 s prijelazom preko desetice.",
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
        id: "mat-jednadzbe",
        title: "Jednadžbe i ravnoteže",
        emoji: "⚖️",
        desc: "Izjednači strane i riješi magični kvadrat.",
        roundSize: 10,
        bank: jednadzbe
      },
      {
        id: "mat-zadaci",
        title: "Zadaci riječima",
        emoji: "📖",
        desc: "Životni zadaci u više koraka.",
        roundSize: 10,
        bank: zadaci
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
