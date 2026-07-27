(function (global) {
  "use strict";

  var MAX = 20;

  function uniqChoices(answer, extras) {
    var set = {};
    var out = [];
    // Dopusti točan odgovor i iznad MAX (npr. zbroj stranica oblika),
    // inače ponuda ostane bez točnog broja ili s nasumičnim 0–3.
    var lim = Math.max(MAX, Number(answer) || 0);
    function add(v) {
      if (typeof v !== "number" || !isFinite(v) || v < 0 || v > lim) return;
      var k = String(v);
      if (set[k]) return;
      set[k] = true;
      out.push(v);
    }
    add(answer);
    (extras || []).forEach(add);
    var deltas = [-3, -2, -1, 1, 2, 3, 4, -4, 5, -5];
    var i;
    for (i = 0; i < deltas.length && out.length < 4; i++) add(answer + deltas[i]);
    for (i = 0; i <= lim && out.length < 4; i++) add(i);
    return out.slice(0, 4);
  }

  function mcq(id, prompt, answer, choices, explain, visual, diff) {
    if (typeof visual === "number") {
      diff = visual;
      visual = null;
    }
    return {
      id: id,
      type: "mcq",
      prompt: prompt,
      answer: answer,
      choices: choices,
      explain: explain || ("Točno je " + answer + "."),
      visual: visual || null,
      diff: diff == null ? 2 : diff
    };
  }

  function numQ(id, prompt, answer, explain, visual, diff) {
    if (typeof visual === "number") {
      diff = visual;
      visual = null;
    }
    return mcq(id, prompt, answer, uniqChoices(answer), explain, visual, diff);
  }

  function tf(id, prompt, answer, explain, diff) {
    return {
      id: id,
      type: "truefalse",
      prompt: prompt,
      answer: answer ? "Točno" : "Netočno",
      choices: ["Točno", "Netočno"],
      explain: explain,
      diff: diff == null ? 2 : diff
    };
  }

  function order(id, prompt, answer, explain, diff) {
    return {
      id: id,
      type: "order",
      prompt: prompt,
      answer: answer,
      items: answer.slice(),
      explain: explain || ("Redoslijed: " + answer.join(", ")),
      diff: diff == null ? 2 : diff
    };
  }

  function match(id, prompt, pairs, explain, diff) {
    return {
      id: id,
      type: "match",
      prompt: prompt,
      pairs: pairs,
      explain: explain,
      diff: diff == null ? 2 : diff
    };
  }

  /* ===================== PROSTORNI ODNOSI (Super matematika 1. dio) ===================== */
  var prostor = [];
  [
    ["sm-prostor-dulji", "Koja je riječ za predmet koji ima veću duljinu?", "dulji", ["dulji", "kraći", "širi", "tanji"], "Dulji predmet ima veću duljinu.", 1],
    ["sm-prostor-kraci", "Koja je riječ za predmet koji ima manju duljinu?", "kraći", ["dulji", "kraći", "veći", "teži"], "Kraći predmet ima manju duljinu.", 1],
    ["sm-prostor-veci", "Lopta A je veća od lopte B. Koja je manja?", "lopta B", ["lopta A", "lopta B", "jednake su", "ne znam"], "Ako je A veća, B je manja.", 1],
    ["sm-prostor-manji", "Torba je manja od ruksaka. Što je veće?", "ruksak", ["torba", "ruksak", "jednako", "kutija"], "Ruksak je veći od torbe.", 1],
    ["sm-prostor-iznad", "Ptica je na grani. Gdje je ptica u odnosu na travu?", "iznad", ["iznad", "ispod", "lijevo", "desno"], "Grana je iznad trave, pa je i ptica iznad.", 2],
    ["sm-prostor-ispod", "Mačka je ispod stola. Gdje je stol u odnosu na mačku?", "iznad", ["ispod", "iznad", "između", "pokraj"], "Ako je mačka ispod, stol je iznad nje.", 2],
    ["sm-prostor-ispred", "Tin stoji ispred vratiju. Što je iza Tina?", "vrata", ["vrata", "prozor", "stolica", "nebo"], "Tin je ispred vratiju, pa su vrata iza njega.", 2],
    ["sm-prostor-iza", "Lopta je iza kutije. Što vidiš prvo ako gledaš sprijeda?", "kutiju", ["loptu", "kutiju", "oboje jednako", "ništa"], "Predmet ispred zaklanja onaj iza.", 2],
    ["sm-prostor-lijevo", "Na slici u knjizi: olovka je lijevo od gumice. Što je desno od olovke?", "gumica", ["olovka", "gumica", "bilježnica", "stol"], "Desno od olovke je gumica.", 2],
    ["sm-prostor-desno", "Šalica je desno od tanjura. Što je lijevo od šalice?", "tanjur", ["šalica", "tanjur", "žlica", "kuhinja"], "Lijevo od šalice je tanjur.", 2],
    ["sm-prostor-izmedu", "Broj 5 je između 4 i 6. Koji je broj između 7 i 9?", "8", ["6", "7", "8", "9"], "Između 7 i 9 je 8.", 2],
    ["sm-prostor-blizi", "Škola je bliža kući od parka. Što je dalje od kuće?", "park", ["škola", "park", "jednako", "trgovina"], "Park je dalje.", 2]
  ].forEach(function (row) {
    prostor.push(mcq(row[0], row[1], row[2], row[3], row[4], null, row[5]));
  });
  prostor.push(match(
    "sm-prostor-match",
    "Spoji parove riječi koje su suprotne.",
    [["dulji", "kraći"], ["veći", "manji"], ["iznad", "ispod"]],
    "Suprotnosti: dulji↔kraći, veći↔manji, iznad↔ispod.",
    2
  ));
  prostor.push(match(
    "sm-prostor-match2",
    "Spoji odnos s primjerom.",
    [["ispred", "dijete pred vratima"], ["iza", "lopta iza stolice"], ["pokraj", "knjiga pokraj olovke"]],
    "Ispred = pred nečim; iza = iza nečega; pokraj = uz nešto.",
    2
  ));
  [
    ["sm-prostor-tf1", "Ako je traka dulja, ona je kraća.", false, "Dulja i kraća su suprotnosti.", 1],
    ["sm-prostor-tf2", "Predmet iznad stola nije na podu ispod stola.", true, "Iznad i ispod su različiti položaji.", 1],
    ["sm-prostor-tf3", "Lijevo i desno ovise o tome kako stojiš i gledaš.", true, "Lijevo/desno su u odnosu na gledatelja.", 2],
    ["sm-prostor-tf4", "Broj 10 je između 8 i 9.", false, "Između 8 i 9 nema cijelog broja; 10 je poslije 9.", 2]
  ].forEach(function (row) {
    prostor.push(tf(row[0], row[1], row[2], row[3], row[4]));
  });
  prostor.push(order(
    "sm-prostor-ord-size",
    "Poredaj od najmanjeg do najvećeg: mrav, pas, slon.",
    ["mrav", "pas", "slon"],
    "Od najmanjeg: mrav, pas, slon.",
    1
  ));

  /* ===================== BROJEVI ===================== */
  var brojevi = [];
  var a, b, n, start;

  for (a = 0; a <= MAX; a++) {
    for (b = 0; b <= MAX; b++) {
      var cmp = a > b ? ">" : a < b ? "<" : "=";
      brojevi.push(
        mcq(
          "cmp-" + a + "-" + b,
          "Što stoji između " + a + " i " + b + "?",
          cmp,
          ["<", "=", ">"],
          a + " " + cmp + " " + b + ".",
          null,
          a <= 5 && b <= 5 ? 1 : 2
        )
      );
    }
  }

  for (n = 0; n < MAX; n++) {
    brojevi.push(
      numQ("after-" + n, "Koji broj dolazi poslije " + n + "?", n + 1, "Poslije " + n + " ide " + (n + 1) + ".", null, 1)
    );
  }
  for (n = 1; n <= MAX; n++) {
    brojevi.push(
      numQ("before-" + n, "Koji broj dolazi prije " + n + "?", n - 1, "Prije " + n + " ide " + (n - 1) + ".", null, 1)
    );
  }

  for (start = 0; start <= MAX - 3; start++) {
    var miss = start + 2;
    brojevi.push(
      numQ(
        "miss-" + start,
        "Koji broj nedostaje: " + start + ", " + (start + 1) + ", ?, " + (start + 3) + "?",
        miss,
        "Niz: " + start + ", " + (start + 1) + ", " + miss + ", " + (start + 3) + ".",
        null,
        2
      )
    );
  }

  for (a = 0; a <= MAX; a++) {
    for (b = a + 1; b <= MAX; b++) {
      for (n = b + 1; n <= MAX; n++) {
        brojevi.push(
          order(
            "ord-asc-" + a + "-" + b + "-" + n,
            "Poredaj brojeve od najmanjeg do najvećeg.",
            [a, b, n],
            "Od najmanjeg: " + a + ", " + b + ", " + n + ".",
            3
          )
        );
        brojevi.push(
          order(
            "ord-desc-" + n + "-" + b + "-" + a,
            "Poredaj brojeve od najvećeg do najmanjeg.",
            [n, b, a],
            "Od najvećeg: " + n + ", " + b + ", " + a + ".",
            3
          )
        );
      }
    }
  }

  for (n = 10; n <= MAX; n++) {
    var tens = Math.floor(n / 10);
    var ones = n % 10;
    brojevi.push(numQ("tens-" + n, "Koliko desetica ima broj " + n + "?", tens, n + " = " + tens + " desetica i " + ones + " jedinica.", null, 2));
    brojevi.push(numQ("ones-" + n, "Koliko jedinica ima broj " + n + "?", ones, n + " = " + tens + " desetica i " + ones + " jedinica.", null, 2));
    brojevi.push(
      mcq(
        "sm-compose-" + n,
        "Koji broj ima " + tens + " desetica i " + ones + " jedinica?",
        n,
        uniqChoices(n, [tens * 10, ones, n + 1, n - 1]),
        tens + " desetica i " + ones + " jedinica = " + n + ".",
        null,
        2
      )
    );
    brojevi.push(
      tf(
        "sm-digit-" + n,
        "Broj " + n + " je " + (n < 10 ? "jednoznamenkast" : "dvoznamenkast") + ".",
        true,
        n < 10 ? "Brojevi 0–9 imaju jednu znamenku." : "Brojevi 10–20 imaju dvije znamenke.",
        n < 10 ? 1 : 2
      )
    );
  }
  for (n = 0; n <= 9; n++) {
    brojevi.push(
      tf("sm-onedigit-" + n, "Broj " + n + " je dvoznamenkast.", false, "Brojevi 0–9 su jednoznamenkasti.", 1)
    );
  }
  brojevi.push(match(
    "sm-tens-match",
    "Spoji broj s rastavljanjem na desetice i jedinice.",
    [["12", "1 desetica i 2 jedinice"], ["15", "1 desetica i 5 jedinica"], ["20", "2 desetice i 0 jedinica"]],
    "12 = 1 d + 2 j; 15 = 1 d + 5 j; 20 = 2 d + 0 j.",
    2
  ));
  brojevi.push(mcq(
    "sm-ten-block",
    "Što je jedna desetica?",
    "10 jedinica",
    ["10 jedinica", "1 jedinica", "20 jedinica", "5 jedinica"],
    "Jedna desetica = 10 jedinica.",
    null,
    1
  ));

  for (a = 0; a <= MAX; a++) {
    for (b = 0; b <= MAX; b++) {
      if (a === b) continue;
      brojevi.push(
        tf(
          "tf-gt-" + a + "-" + b,
          "Broj " + a + " je veći od broja " + b + ".",
          a > b,
          a > b ? a + " > " + b + "." : a + " nije veći od " + b + "."
        )
      );
    }
  }

  /* ===================== ZBRAJANJE / ODUZIMANJE / LANCI ===================== */
  var racun = [];
  var tokens = ["🍎", "⭐", "🔵", "🟢", "🟡"];

  for (a = 0; a <= MAX; a++) {
    for (b = 0; a + b <= MAX; b++) {
      var sum = a + b;
      var addDiff = sum <= 10 ? 1 : 2;
      racun.push(
        numQ(
          "add-" + a + "-" + b,
          "Koliko je " + a + " + " + b + "?",
          sum,
          a + " + " + b + " = " + sum + ".",
          a > 0 && b > 0 && a + b <= 12
            ? { kind: "groups", groups: [a, b], token: tokens[(a + b) % tokens.length], op: "+", suffix: "= ?" }
            : null,
          addDiff
        )
      );
      racun.push(
        tf("tf-add-" + a + "-" + b, a + " + " + b + " = " + sum, true, a + " + " + b + " = " + sum + ".", addDiff)
      );
      if (sum < MAX) {
        racun.push(
          tf(
            "tf-add-wrong-" + a + "-" + b,
            a + " + " + b + " = " + (sum + 1),
            false,
            "Netočno: " + a + " + " + b + " = " + sum + "."
          )
        );
      }
    }
  }

  for (a = 0; a <= MAX; a++) {
    for (b = 0; b <= a; b++) {
      var subAns = a - b;
      var subDiff = a <= 10 ? 1 : 2;
      racun.push(
        numQ(
          "sub-" + a + "-" + b,
          "Koliko je " + a + " − " + b + "?",
          subAns,
          a + " − " + b + " = " + subAns + ".",
          a <= 12 && b > 0
            ? { kind: "groups", groups: [a], token: "🔵", suffix: "  (−" + b + ")" }
            : null,
          subDiff
        )
      );
    }
  }

  // Veza zbrajanja i oduzimanja + zamjena mjesta pribrojnika (Super matematika 2. dio)
  for (a = 1; a <= 10; a++) {
    for (b = 1; a + b <= MAX; b++) {
      var sumAb = a + b;
      racun.push(
        tf(
          "sm-comm-" + a + "-" + b,
          a + " + " + b + " = " + b + " + " + a,
          true,
          "Pribrojnici mogu zamijeniti mjesta: zbroj ostaje " + sumAb + ".",
          a + b <= 10 ? 1 : 2
        )
      );
      racun.push(
        numQ(
          "sm-inv-sub-" + a + "-" + b,
          "Znamo da je " + a + " + " + b + " = " + sumAb + ". Koliko je " + sumAb + " − " + a + "?",
          b,
          "Oduzimanje poništava zbrajanje: " + sumAb + " − " + a + " = " + b + ".",
          null,
          2
        )
      );
      racun.push(
        numQ(
          "sm-inv-sub2-" + a + "-" + b,
          "Znamo da je " + a + " + " + b + " = " + sumAb + ". Koliko je " + sumAb + " − " + b + "?",
          a,
          sumAb + " − " + b + " = " + a + ".",
          null,
          2
        )
      );
    }
  }
  racun.push(mcq(
    "sm-comm-pick",
    "Koji izraz daje isti zbroj kao 4 + 9?",
    "9 + 4",
    ["9 + 4", "9 − 4", "4 − 9", "14 − 9"],
    "Zamjena mjesta pribrojnika: 4 + 9 = 9 + 4.",
    null,
    1
  ));
  racun.push(mcq(
    "sm-inv-pick",
    "Ako je 8 + 5 = 13, koji oduzimak je točan?",
    "13 − 5 = 8",
    ["13 − 5 = 8", "13 − 8 = 13", "8 − 5 = 13", "5 − 8 = 13"],
    "Iz zbroja oduzmemo jedan pribrojnik i dobijemo drugi.",
    null,
    2
  ));

  // Lančani računi: a + b − c  i  a − b + c
  var c;
  for (a = 0; a <= MAX; a++) {
    for (b = 0; a + b <= MAX; b++) {
      for (c = 0; c <= a + b; c++) {
        var chain = a + b - c;
        var chainDiff = c > 0 ? 3 : 2;
        racun.push(
          numQ(
            "chain-ap-" + a + "-" + b + "-" + c,
            "Koliko je " + a + " + " + b + " − " + c + "?",
            chain,
            a + " + " + b + " = " + (a + b) + ", zatim " + (a + b) + " − " + c + " = " + chain + ".",
            null,
            chainDiff
          )
        );
      }
    }
  }

  for (a = 0; a <= MAX; a++) {
    for (b = 0; b <= a; b++) {
      for (c = 0; a - b + c <= MAX; c++) {
        var chain2 = a - b + c;
        var chain2Diff = c > 0 && b > 0 ? 3 : 2;
        racun.push(
          numQ(
            "chain-sa-" + a + "-" + b + "-" + c,
            "Koliko je " + a + " − " + b + " + " + c + "?",
            chain2,
            a + " − " + b + " = " + (a - b) + ", zatim " + (a - b) + " + " + c + " = " + chain2 + ".",
            null,
            chain2Diff
          )
        );
      }
    }
  }

  // Tri zbrajanja / oduzimanja: a + b + c
  for (a = 0; a <= MAX; a++) {
    for (b = 0; a + b <= MAX; b++) {
      for (c = 0; a + b + c <= MAX; c++) {
        if (c === 0 && b === 0) continue;
        racun.push(
          numQ(
            "add3-" + a + "-" + b + "-" + c,
            "Koliko je " + a + " + " + b + " + " + c + "?",
            a + b + c,
            a + " + " + b + " + " + c + " = " + (a + b + c) + ".",
            null,
            2
          )
        );
      }
    }
  }

  // Dva oduzimanja: a − b − c (teži kraj 1. razreda)
  for (a = 0; a <= MAX; a++) {
    for (b = 0; b <= a; b++) {
      for (c = 0; c <= a - b; c++) {
        if (b === 0 && c === 0) continue;
        racun.push(
          numQ(
            "sub2-" + a + "-" + b + "-" + c,
            "Koliko je " + a + " − " + b + " − " + c + "?",
            a - b - c,
            a + " − " + b + " = " + (a - b) + ", zatim " + (a - b) + " − " + c + " = " + (a - b - c) + ".",
            null,
            3
          )
        );
      }
    }
  }

  // Miješani lanac: a − b + c − d (samo kad sve međuvrijednosti ≥ 0 i ≤ MAX)
  var d;
  for (a = 2; a <= MAX; a++) {
    for (b = 1; b < a; b++) {
      for (c = 0; a - b + c <= MAX; c++) {
        for (d = 0; d <= a - b + c; d++) {
          if ((a + b + c + d) % 3 !== 0) continue; // uzorkovanje — banka ostaje brza
          var mix = a - b + c - d;
          racun.push(
            numQ(
              "mix4-" + a + "-" + b + "-" + c + "-" + d,
              "Koliko je " + a + " − " + b + " + " + c + " − " + d + "?",
              mix,
              "Korak po korak: " + a + " − " + b + " = " + (a - b) + ", + " + c + " = " + (a - b + c) + ", − " + d + " = " + mix + ".",
              null,
              3
            )
          );
        }
      }
    }
  }

  /* ===================== JEDNAČENJA ===================== */
  var jednadzbe = [];
  var x;

  // a + b = x  → x = a+b
  for (a = 0; a <= MAX; a++) {
    for (b = 0; a + b <= MAX; b++) {
      x = a + b;
      jednadzbe.push(
        numQ("eq-abx-" + a + "-" + b, "Nađi x:  " + a + " + " + b + " = x", x, a + " + " + b + " = " + x + ", dakle x = " + x + ".", null, 2)
      );
      jednadzbe.push(
        numQ("eq-xab-" + a + "-" + b, "Nađi x:  x = " + a + " + " + b, x, "x = " + a + " + " + b + " = " + x + ".")
      );
    }
  }

  // a − b = x
  for (a = 0; a <= MAX; a++) {
    for (b = 0; b <= a; b++) {
      x = a - b;
      jednadzbe.push(
        numQ("eq-subx-" + a + "-" + b, "Nađi x:  " + a + " − " + b + " = x", x, a + " − " + b + " = " + x + ".")
      );
    }
  }

  // a + b = x + c  → x = a + b − c
  for (a = 0; a <= MAX; a++) {
    for (b = 0; a + b <= MAX; b++) {
      for (c = 0; c <= a + b; c++) {
        x = a + b - c;
        jednadzbe.push(
          numQ(
            "eq-bal-add-" + a + "-" + b + "-" + c,
            "Nađi x:  " + a + " + " + b + " = x + " + c,
            x,
            "Lijeva strana je " + (a + b) + ". Dakle x + " + c + " = " + (a + b) + ", pa je x = " + x + ".",
            null,
            3
          )
        );
      }
    }
  }

  // a + b = x − c  → x = a + b + c (ako ≤ MAX)
  for (a = 0; a <= MAX; a++) {
    for (b = 0; a + b <= MAX; b++) {
      for (c = 0; a + b + c <= MAX; c++) {
        x = a + b + c;
        jednadzbe.push(
          numQ(
            "eq-bal-sub-" + a + "-" + b + "-" + c,
            "Nađi x:  " + a + " + " + b + " = x − " + c,
            x,
            "Lijeva strana je " + (a + b) + ". Dakle x − " + c + " = " + (a + b) + ", pa je x = " + x + ".",
            null,
            3
          )
        );
      }
    }
  }

  // x + a = b  → x = b − a
  for (a = 0; a <= MAX; a++) {
    for (b = a; b <= MAX; b++) {
      x = b - a;
      jednadzbe.push(
        numQ("eq-xpa-" + a + "-" + b, "Nađi x:  x + " + a + " = " + b, x, "x + " + a + " = " + b + " ⇒ x = " + x + ".")
      );
    }
  }

  // x − a = b  → x = a + b
  for (a = 0; a <= MAX; a++) {
    for (b = 0; a + b <= MAX; b++) {
      x = a + b;
      jednadzbe.push(
        numQ("eq-xma-" + a + "-" + b, "Nađi x:  x − " + a + " = " + b, x, "x − " + a + " = " + b + " ⇒ x = " + x + ".")
      );
    }
  }

  // a − b = x + c
  for (a = 0; a <= MAX; a++) {
    for (b = 0; b <= a; b++) {
      for (c = 0; c <= a - b; c++) {
        x = a - b - c;
        jednadzbe.push(
          numQ(
            "eq-subbal-" + a + "-" + b + "-" + c,
            "Nađi x:  " + a + " − " + b + " = x + " + c,
            x,
            "Lijeva strana je " + (a - b) + ". Dakle x = " + x + "."
          )
        );
      }
    }
  }

  // a + b − c = x
  for (a = 0; a <= MAX; a++) {
    for (b = 0; a + b <= MAX; b++) {
      for (c = 0; c <= a + b; c++) {
        x = a + b - c;
        jednadzbe.push(
          numQ(
            "eq-chainx-" + a + "-" + b + "-" + c,
            "Nađi x:  " + a + " + " + b + " − " + c + " = x",
            x,
            a + " + " + b + " − " + c + " = " + x + "."
          )
        );
      }
    }
  }

  // a + x = b + c  → x = b + c − a
  for (a = 0; a <= MAX; a++) {
    for (b = 0; b <= MAX; b++) {
      for (c = 0; b + c <= MAX; c++) {
        if (b + c < a) continue;
        x = b + c - a;
        jednadzbe.push(
          numQ(
            "eq-axbc-" + a + "-" + b + "-" + c,
            "Nađi x:  " + a + " + x = " + b + " + " + c,
            x,
            "Desna strana je " + (b + c) + ". Dakle " + a + " + x = " + (b + c) + ", pa je x = " + x + ".",
            null,
            3
          )
        );
      }
    }
  }

  // a − b − c = x
  for (a = 0; a <= MAX; a++) {
    for (b = 0; b <= a; b++) {
      for (c = 0; c <= a - b; c++) {
        x = a - b - c;
        jednadzbe.push(
          numQ(
            "eq-sub2x-" + a + "-" + b + "-" + c,
            "Nađi x:  " + a + " − " + b + " − " + c + " = x",
            x,
            a + " − " + b + " − " + c + " = " + x + ".",
            null,
            3
          )
        );
      }
    }
  }

  // a + b = c + x  (isti tip kao balans, druga formulacija)
  for (a = 0; a <= MAX; a++) {
    for (b = 0; a + b <= MAX; b++) {
      for (c = 0; c <= a + b; c++) {
        x = a + b - c;
        jednadzbe.push(
          numQ(
            "eq-abcx-" + a + "-" + b + "-" + c,
            "Nađi x:  " + a + " + " + b + " = " + c + " + x",
            x,
            "Lijeva strana je " + (a + b) + ". Dakle " + c + " + x = " + (a + b) + ", pa je x = " + x + "."
          )
        );
      }
    }
  }

  /* ===================== TEKSTUALNI ZADACI ===================== */
  var rijeci = [];
  var names = ["Ana", "Ivan", "Mia", "Luka", "Ema", "Marko", "Iva", "Petar", "Lara", "Tin"];
  var things = [
    ["jabuka", "jabuke", "jabuka"],
    ["olovka", "olovke", "olovaka"],
    ["balon", "baloni", "balona"],
    ["kolač", "kolači", "kolača"],
    ["naljepnica", "naljepnice", "naljepnica"],
    ["kockica", "kockice", "kockica"],
    ["cvijet", "cvjetovi", "cvjetova"],
    ["štapić", "štapići", "štapića"]
  ];

  function thingForm(thing, count) {
    if (count === 1) return thing[0];
    if (count >= 2 && count <= 4) return thing[1];
    return thing[2];
  }

  var ni, ti, name, thing;

  // Zbrajanje i oduzimanje — sve kombinacije, svi likovi i predmeti
  for (ni = 0; ni < names.length; ni++) {
    name = names[ni];
    for (ti = 0; ti < things.length; ti++) {
      thing = things[ti];
      for (a = 1; a <= MAX; a++) {
        for (b = 1; a + b <= MAX; b++) {
          rijeci.push(
            numQ(
              "w-add-" + ni + "-" + ti + "-" + a + "-" + b,
              name + " ima " + a + " " + thingForm(thing, a) + ". Dobila/dobio je još " + b + ". Koliko ih sada ima?",
              a + b,
              name + " ima " + a + " + " + b + " = " + (a + b) + ".",
              null,
              2
            )
          );
        }
        for (b = 1; b < a; b++) {
          rijeci.push(
            numQ(
              "w-sub-" + ni + "-" + ti + "-" + a + "-" + b,
              name + " ima " + a + " " + thingForm(thing, a) + ". Dao/dala je " + b + ". Koliko mu/joj ostaje?",
              a - b,
              a + " − " + b + " = " + (a - b) + "."
            )
          );
        }
      }
    }
  }

  // Lanac u riječima (ima → dobije → da) — uzorkovanje da banka ostane brza
  for (ni = 0; ni < names.length; ni++) {
    name = names[ni];
    thing = things[ni % things.length];
    for (a = 3; a <= 16; a += 1) {
      for (b = 1; a + b <= MAX; b += 1) {
        for (c = 1; c <= a + b - 1; c += 1) {
          if ((a + b + c + ni) % 2 !== 0) continue;
          rijeci.push(
            numQ(
              "w-chain-" + ni + "-" + a + "-" + b + "-" + c,
              name +
                " ima " +
                a +
                " " +
                thingForm(thing, a) +
                ". Dobije još " +
                b +
                ", a zatim da " +
                c +
                ". Koliko ih ostaje?",
              a + b - c,
              a + " + " + b + " − " + c + " = " + (a + b - c) + ".",
              null,
              3
            )
          );
        }
      }
    }
  }

  // Dvije djece — koliko više
  for (ni = 0; ni < names.length - 1; ni++) {
    thing = things[ni % things.length];
    for (a = 1; a <= MAX; a++) {
      for (b = 1; b <= MAX; b++) {
        if (a === b) continue;
        var more = a > b ? names[ni] : names[ni + 1];
        var diffAbs = Math.abs(a - b);
        rijeci.push(
          numQ(
            "w-cmp-" + ni + "-" + a + "-" + b,
            names[ni] +
              " ima " +
              a +
              " " +
              thingForm(thing, a) +
              ", a " +
              names[ni + 1] +
              " ima " +
              b +
              ". Za koliko " +
              thingForm(thing, 5) +
              " više ima " +
              more +
              "?",
            diffAbs,
            "Razlika je " + diffAbs + "."
          )
        );
      }
    }
  }

  // „U košari…“ zbrajanje dviju skupina
  for (ti = 0; ti < things.length; ti++) {
    thing = things[ti];
    for (a = 1; a <= 15; a++) {
      for (b = 1; a + b <= MAX; b++) {
        rijeci.push(
          numQ(
            "w-basket-" + ti + "-" + a + "-" + b,
            "U košari je " + a + " " + thingForm(thing, a) + " i još " + b + " " + thingForm(thing, b) + ". Koliko ih ima ukupno?",
            a + b,
            a + " + " + b + " = " + (a + b) + "."
          )
        );
      }
    }
  }

  // Teži tekst: ima → da → dobije (oduzimanje pa zbrajanje)
  for (ni = 0; ni < names.length; ni++) {
    name = names[ni];
    thing = things[(ni + 3) % things.length];
    for (a = 4; a <= MAX; a++) {
      for (b = 1; b < a; b++) {
        for (c = 1; a - b + c <= MAX; c++) {
          if ((a + b + c + ni) % 3 !== 0) continue;
          rijeci.push(
            numQ(
              "w-subadd-" + ni + "-" + a + "-" + b + "-" + c,
              name +
                " ima " +
                a +
                " " +
                thingForm(thing, a) +
                ". Dao/dala je " +
                b +
                ", a zatim dobije " +
                c +
                ". Koliko ih sada ima?",
              a - b + c,
              a + " − " + b + " + " + c + " = " + (a - b + c) + ".",
              null,
              3
            )
          );
        }
      }
    }
  }

  // Dvije skupine + još jedna (a + b + c u riječima)
  for (ti = 0; ti < things.length; ti++) {
    thing = things[ti];
    for (a = 1; a <= 10; a++) {
      for (b = 1; a + b <= 15; b++) {
        for (c = 1; a + b + c <= MAX; c++) {
          if ((a + b + c + ti) % 2 !== 0) continue;
          rijeci.push(
            numQ(
              "w-three-" + ti + "-" + a + "-" + b + "-" + c,
              "Na stolu je " +
                a +
                " " +
                thingForm(thing, a) +
                ", u kutiji " +
                b +
                ", a u torbi još " +
                c +
                ". Koliko ih ima ukupno?",
              a + b + c,
              a + " + " + b + " + " + c + " = " + (a + b + c) + ".",
              null,
              3
            )
          );
        }
      }
    }
  }

  /* ===================== OBLICI (prošireno malo) ===================== */
  var oblici = [];
  var shapeNames = ["krug", "trokut", "kvadrat", "pravokutnik"];
  var si;
  for (si = 0; si < shapeNames.length; si++) {
    var s = shapeNames[si];
    oblici.push({
      id: "shape-" + s + "-1",
      type: "mcq",
      prompt: "Kako se zove ovaj oblik?",
      answer: s,
      choices: shapeNames.slice(),
      explain: "To je " + s + ".",
      visual: { kind: "shape", shape: s }
    });
    oblici.push({
      id: "shape-" + s + "-2",
      type: "mcq",
      prompt: "Odaberi točan naziv oblika.",
      answer: s,
      choices: shapeNames.slice(),
      explain: "To je " + s + ".",
      visual: { kind: "shape", shape: s }
    });
  }
  [
    ["Koliko stranica ima trokut?", 3, [2, 3, 4, 5], "str-t"],
    ["Koliko stranica ima kvadrat?", 4, [3, 4, 5, 6], "str-k"],
    ["Koliko stranica ima pravokutnik?", 4, [2, 3, 4, 5], "str-p"],
    ["Koliko kutova ima trokut?", 3, [2, 3, 4, 0], "kut-t"],
    ["Koliko kutova ima kvadrat?", 4, [3, 4, 5, 6], "kut-k"],
    ["Koliko kutova ima pravokutnik?", 4, [2, 3, 4, 5], "kut-p"]
  ].forEach(function (row) {
    oblici.push(mcq(row[3], row[0], row[1], row[2], "Točan odgovor je " + row[1] + "."));
  });
  for (n = 1; n <= 5; n++) {
    oblici.push(numQ("tri-sides-" + n, "Koliko stranica imaju " + n + " trokuta zajedno?", n * 3, n + " × 3 = " + n * 3 + "."));
    oblici.push(numQ("sq-sides-" + n, "Koliko stranica imaju " + n + " kvadrata zajedno?", n * 4, n + " × 4 = " + n * 4 + "."));
  }
  // Brojanje stranica / kutova za više oblika (do 5 komada)
  for (n = 1; n <= 5; n++) {
    oblici.push(numQ("rect-sides-" + n, "Koliko stranica imaju " + n + " pravokutnika zajedno?", n * 4, n + " × 4 = " + n * 4 + "."));
    oblici.push(numQ("tri-angles-" + n, "Koliko kutova imaju " + n + " trokuta zajedno?", n * 3, n + " × 3 = " + n * 3 + "."));
    oblici.push(numQ("sq-angles-" + n, "Koliko kutova imaju " + n + " kvadrata zajedno?", n * 4, n + " × 4 = " + n * 4 + "."));
  }
  // Miješani skupovi oblika (zbrajanje stranica)
  for (a = 1; a <= 4; a++) {
    for (b = 1; b <= 4; b++) {
      oblici.push(
        numQ(
          "mix-tri-sq-" + a + "-" + b,
          "Imaš " + a + " trokuta i " + b + " kvadrata. Koliko stranica imaš ukupno?",
          a * 3 + b * 4,
          a + " × 3 + " + b + " × 4 = " + (a * 3 + b * 4) + ".",
          null,
          3
        )
      );
      oblici.push(
        numQ(
          "mix-tri-rect-" + a + "-" + b,
          "Imaš " + a + " trokuta i " + b + " pravokutnika. Koliko stranica imaš ukupno?",
          a * 3 + b * 4,
          a + " × 3 + " + b + " × 4 = " + (a * 3 + b * 4) + ".",
          null,
          3
        )
      );
    }
  }
  oblici.push(mcq("no-sides", "Koji oblik nema stranica?", "krug", shapeNames, "Krug nema stranica."));
  oblici.push(mcq("eq-sides", "Koji oblik ima sve stranice jednake?", "kvadrat", shapeNames, "Kod kvadrata su sve stranice jednake."));
  oblici.push(tf("tf-krug4", "Krug ima 4 stranice.", false, "Krug nema stranica."));
  oblici.push(tf("tf-tri3", "Trokut ima 3 kuta.", true, "Trokut ima tri kuta i tri stranice."));
  oblici.push(tf("tf-both4", "Kvadrat i pravokutnik imaju 4 stranice.", true, "Oba imaju četiri stranice."));
  oblici.push(match("match-sides", "Spoji oblik s brojem stranica.", [["trokut", "3"], ["kvadrat", "4"], ["krug", "0"]], "Trokut 3, kvadrat 4, krug 0 stranica.", 3));
  [
    ["lopta je slična…", "krug"],
    ["prozor je često…", "pravokutnik"],
    ["krov kuće može biti…", "trokut"],
    ["stranica knjige je…", "pravokutnik"],
    ["sat na zidu često je…", "krug"],
    ["pločica na podu može biti…", "kvadrat"]
  ].forEach(function (row, i) {
    oblici.push(mcq("real-" + i, "U stvarnom svijetu: " + row[0], row[1], shapeNames, "Najbliži oblik je " + row[1] + "."));
  });

  // Geometrijska tijela + točka/crta (Super matematika 1. dio)
  var tijela = ["kugla", "valjak", "kocka", "kvadar", "piramida", "stožac"];
  [
    ["sm-tijelo-lopta", "Lopta je najsličnija kojem tijelu?", "kugla", "Lopta je okrugla u svim smjerovima — to je kugla."],
    ["sm-tijelo-konzerva", "Konzerva juhe najviše sliči na…", "valjak", "Valjak ima dva okrugla dna i zakrivljeni plašt."],
    ["sm-tijelo-secer", "Kocka šećera ima oblik…", "kocka", "Sve stranice kocke su kvadrati jednake veličine."],
    ["sm-tijelo-kutija", "Kutija cipela najčešće je…", "kvadar", "Kvadar ima pravokutne strane (kao kutija)."],
    ["sm-tijelo-kapa", "Rođendanska kapica najviše sliči na…", "stožac", "Stožac ima kružnu bazu i vrh."],
    ["sm-tijelo-egipat", "Poznata egipatska građevina ima oblik…", "piramida", "Piramida ima trokutaste strane koje se susreću u vrhu."]
  ].forEach(function (row) {
    oblici.push(mcq(row[0], row[1], row[2], tijela.slice(), row[3], null, 2));
  });
  oblici.push(mcq(
    "sm-tijelo-round",
    "Koje tijelo možeš kotrljati u svim smjerovima?",
    "kugla",
    tijela.slice(),
    "Kugla se kotrlja u svim smjerovima.",
    null,
    1
  ));
  oblici.push(mcq(
    "sm-tijelo-flat",
    "Koje tijelo ima sve strane kvadratne i jednake?",
    "kocka",
    tijela.slice(),
    "Kod kocke su sve strane jednaki kvadrati.",
    null,
    2
  ));
  oblici.push(match(
    "sm-tijelo-match",
    "Spoji predmet s geometrijskim tijelom.",
    [["lopta", "kugla"], ["konzerva", "valjak"], ["kutija", "kvadar"]],
    "Lopta→kugla, konzerva→valjak, kutija→kvadar.",
    2
  ));
  oblici.push(match(
    "sm-tijelo-match2",
    "Spoji predmet s tijelom.",
    [["kocka leda", "kocka"], ["sladoledni vaflek", "stožac"], ["šator s trokutastim stranama", "piramida"]],
    "Led→kocka, vaflek→stožac, šator→piramida.",
    2
  ));
  [
    ["sm-tijelo-tf1", "Kugla ima vrhove kao kocka.", false, "Kugla nema vrhove ni bridove.", 2],
    ["sm-tijelo-tf2", "Valjak ima dva okrugla dna.", true, "Valjak ima dva kruga i plašt.", 2],
    ["sm-tijelo-tf3", "Kvadar i kocka su isto tijelo.", false, "Kocka je poseban kvadar s jednakim bridovima.", 3],
    ["sm-tijelo-tf4", "Stožac ima jedan vrh.", true, "Stožac završava u jednom vrhu.", 1]
  ].forEach(function (row) {
    oblici.push(tf(row[0], row[1], row[2], row[3], row[4]));
  });
  oblici.push(mcq(
    "sm-tocka",
    "Što je točka u geometriji?",
    "mjesto bez duljine",
    ["mjesto bez duljine", "duga crta", "krug", "kutija"],
    "Točka označava položaj; nema duljinu ni širinu.",
    null,
    2
  ));
  oblici.push(mcq(
    "sm-crta",
    "Što dobiješ kad spojiš dvije točke?",
    "crtu / dužinu",
    ["crtu / dužinu", "kuglu", "broj", "boju"],
    "Dvije točke određuju crtu (dužinu) između njih.",
    null,
    2
  ));
  oblici.push(tf("sm-tf-tocka", "Točka ima duljinu od 2 centimetra.", false, "Točka nema duljinu.", 2));
  oblici.push(tf("sm-tf-lik-tijelo", "Krug je geometrijski lik, a kugla je geometrijsko tijelo.", true, "Likovi su ravni; tijela zauzimaju prostor.", 2));
  oblici.push(mcq(
    "sm-lik-vs-tijelo",
    "Što je ravni oblik koji možeš nacrtati na papiru?",
    "geometrijski lik",
    ["geometrijski lik", "geometrijsko tijelo", "desetica", "novčić samo"],
    "Likovi (krug, trokut…) crtamo u ravnini.",
    null,
    2
  ));

  /* ===================== DODATNE STANICE (Pages) ===================== */
  function calc(expr) {
    var p = expr.trim().split(/\s+/);
    var acc = parseInt(p[0], 10);
    for (var ci = 1; ci < p.length; ci += 2) {
      acc = p[ci] === "+" ? acc + parseInt(p[ci + 1], 10) : acc - parseInt(p[ci + 1], 10);
    }
    return acc;
  }

  function prettyExpr(expr) {
    return expr.trim().split(/\s+/).map(function (t) {
      return t === "-" ? "−" : t;
    }).join(" ");
  }

  var brojRijeciMap = {
    1: "jedan", 2: "dva", 3: "tri", 4: "četiri", 5: "pet", 6: "šest", 7: "sedam",
    8: "osam", 9: "devet", 10: "deset", 11: "jedanaest", 12: "dvanaest", 13: "trinaest",
    14: "četrnaest", 15: "petnaest", 16: "šesnaest", 17: "sedamnaest", 18: "osamnaest",
    19: "devetnaest", 20: "dvadeset"
  };
  var redniMap = {
    1: "prvi", 2: "drugi", 3: "treći", 4: "četvrti", 5: "peti",
    6: "šesti", 7: "sedmi", 8: "osmi", 9: "deveti", 10: "deseti",
    11: "jedanaesti", 12: "dvanaesti", 13: "trinaesti", 14: "četrnaesti", 15: "petnaesti",
    16: "šesnaesti", 17: "sedamnaesti", 18: "osamnaesti", 19: "devetnaesti", 20: "dvadeseti"
  };

  function wordChoices(n, map) {
    var out = [map[n]];
    [1, -1, 2, -2, 3, -3].forEach(function (d) {
      var w = map[n + d];
      if (out.length < 4 && w && out.indexOf(w) < 0) out.push(w);
    });
    return out;
  }

  var redniB = [];
  redniB.push(match("red-m1", "Spoji broj i redni broj.", [["1.", "prvi"], ["2.", "drugi"], ["3.", "treći"]], "1. prvi, 2. drugi, 3. treći."));
  redniB.push(match("red-m2", "Spoji broj i redni broj.", [["4.", "četvrti"], ["5.", "peti"], ["6.", "šesti"]], "4. četvrti, 5. peti, 6. šesti."));
  redniB.push(match("red-m3", "Spoji broj i redni broj.", [["7.", "sedmi"], ["8.", "osmi"], ["9.", "deveti"], ["10.", "deseti"]], "7. sedmi, 8. osmi, 9. deveti, 10. deseti."));
  redniB.push(match("sm-red-m4", "Spoji broj i redni broj (do 20).", [["11.", "jedanaesti"], ["12.", "dvanaesti"], ["15.", "petnaesti"]], "11. jedanaesti, 12. dvanaesti, 15. petnaesti.", 2));
  redniB.push(match("sm-red-m5", "Spoji broj i redni broj (do 20).", [["18.", "osamnaesti"], ["19.", "devetnaesti"], ["20.", "dvadeseti"]], "18. osamnaesti, 19. devetnaesti, 20. dvadeseti.", 2));
  [3, 4, 6, 7, 8, 9, 11, 12, 14, 16, 17, 19, 20].forEach(function (num) {
    redniB.push(mcq("red-q-" + num, "Koji je redni broj za " + num + "?", redniMap[num], wordChoices(num, redniMap), num + ". po redu je " + redniMap[num] + ".", null, num <= 10 ? 1 : 2));
  });
  redniB.push(numQ("red-before-5", "Ana je peta u redu. Koliko je djece ispred nje?", 4, "Ispred pete osobe su četiri osobe."));
  redniB.push(numQ("red-before-6", "Ti si šesti u redu. Koliko je ljudi ispred tebe?", 5, "Ispred šestog je pet ljudi."));
  redniB.push(numQ("sm-red-before-15", "Luka je 15. u redu. Koliko je djece ispred njega?", 14, "Ispred 15. stoji 14 djece.", null, 2));
  redniB.push(mcq("red-last", "U redu je 8 djece, Marko je posljednji. Koji je Marko po redu?", "osmi", ["šesti", "sedmi", "osmi", "deveti"], "Posljednji od 8 je osmi."));
  redniB.push(mcq("red-between", "Koji je redni broj između trećeg i petog?", "četvrti", ["drugi", "treći", "četvrti", "peti"], "Između trećeg i petog je četvrti."));
  redniB.push(mcq("sm-red-between-20", "Koji je redni broj između 18. i 20.?", "devetnaesti", ["sedamnaesti", "osamnaesti", "devetnaesti", "dvadeseti"], "Između 18. i 20. je 19. (devetnaesti).", null, 2));
  redniB.push(mcq("red-race", "Redoslijed na cilju: Petar, Goran, Matija, Iva. Tko je ušao treći?", "Matija", ["Petar", "Goran", "Matija", "Iva"], "Treći je Matija."));
  redniB.push(mcq("red-before-8", "Koji redni broj dolazi odmah prije osmoga?", "sedmi", ["šesti", "sedmi", "osmi", "deveti"], "Prije osmog je sedmi."));
  redniB.push(mcq("red-after-9", "Koji redni broj dolazi odmah nakon devetoga?", "deseti", ["osmi", "deveti", "deseti", "jedanaesti"], "Nakon devetog je deseti."));
  redniB.push(mcq("sm-red-after-19", "Koji redni broj dolazi odmah nakon 19.?", "dvadeseti", ["osamnaesti", "devetnaesti", "dvadeseti", "jedanaesti"], "Nakon 19. je 20. (dvadeseti).", null, 2));
  redniB.push(order("red-ord", "Poredaj redne brojeve po redu.", ["prvi", "drugi", "treći", "četvrti"], "Redom: prvi, drugi, treći, četvrti."));
  redniB.push(order("sm-red-ord2", "Poredaj redne brojeve po redu.", ["jedanaesti", "petnaesti", "dvadeseti"], "11., 15., 20.", 2));
  redniB.push(tf("red-tf1", "Peti dolazi poslije šestog.", false, "Peti dolazi prije šestog."));
  redniB.push(tf("red-tf2", "Ako si prvi, nitko nije ispred tebe.", true, "Prvi je na početku reda."));
  redniB.push(tf("sm-red-tf3", "Dvadeseti dolazi poslije devetnaestog.", true, "19. pa 20.", 1));
  redniB.push(tf("sm-red-tf4", "Jedanaesti je prije desetog.", false, "Jedanaesti dolazi poslije desetog.", 2));

  var brojRijeci = [];
  [12, 15, 17, 19, 14, 11, 18, 16].forEach(function (num) {
    brojRijeci.push(mcq("br-w-" + num, "Kako se riječima piše broj " + num + "?", brojRijeciMap[num], wordChoices(num, brojRijeciMap), "Broj " + num + " pišemo: " + brojRijeciMap[num] + "."));
  });
  [13, 16, 20, 11, 17].forEach(function (num) {
    brojRijeci.push(numQ("br-n-" + num, "Koji je to broj: " + brojRijeciMap[num] + "?", num, brojRijeciMap[num] + " je broj " + num + "."));
  });
  [["8 + 6", 14], ["20 - 5", 15], ["9 + 9", 18], ["7 + 6", 13], ["11 + 6", 17], ["19 - 8", 11]].forEach(function (pair, idx) {
    var val = calc(pair[0]);
    brojRijeci.push(mcq("br-calc-" + idx, "Izračunaj i napiši riječima: " + prettyExpr(pair[0]) + " = ?", brojRijeciMap[val], wordChoices(val, brojRijeciMap), prettyExpr(pair[0]) + " = " + val + " = " + brojRijeciMap[val] + "."));
  });
  brojRijeci.push(mcq("br-cmp1", "Što je veće: trinaest ili petnaest?", "petnaest", ["trinaest", "petnaest", "jednako", "ne znam"], "15 je veće od 13."));
  brojRijeci.push(mcq("br-cmp2", "Što je manje: osamnaest ili četrnaest?", "četrnaest", ["osamnaest", "četrnaest", "jednako", "ne znam"], "14 je manje od 18."));
  brojRijeci.push(order("br-ord", "Poredaj brojeve od najmanjeg (napisani su riječima).", ["jedanaest", "petnaest", "dvadeset"], "11, 15, 20 → jedanaest, petnaest, dvadeset."));

  var lanac = [];
  function chainQ(id, expr) {
    var parts = expr.trim().split(/\s+/);
    var acc = parseInt(parts[0], 10);
    var pretty = String(acc);
    var steps = [];
    for (var li = 1; li < parts.length; li += 2) {
      var op = parts[li];
      var num = parseInt(parts[li + 1], 10);
      var prev = acc;
      var opDisp = op === "+" ? "+" : "−";
      if (op === "+") acc += num;
      else acc -= num;
      pretty += " " + opDisp + " " + num;
      steps.push(prev + " " + opDisp + " " + num + " = " + acc);
    }
    lanac.push({
      id: id,
      type: "mcq",
      prompt: "Izračunaj po redu (slijeva nadesno):",
      answer: acc,
      choices: uniqChoices(acc),
      explain: steps.join(", ") + ".",
      visual: { kind: "text", text: pretty + " = ?" },
      diff: 3
    });
  }
  [
    "13 - 3 - 6", "18 - 8 - 3", "17 - 7 - 5", "16 - 6 - 4", "12 - 2 - 3",
    "19 - 9 - 7", "19 - 5 + 2", "14 - 6 + 7", "17 - 8 + 3", "14 - 4 - 7",
    "16 - 6 - 5", "20 - 10 - 5", "16 - 7 + 2", "10 - 8 + 3", "13 - 4 - 6",
    "13 - 8 + 11", "1 + 17 - 9", "11 - 1 + 5", "4 + 8 + 1", "5 + 2 - 4",
    "14 + 2 - 5", "16 - 12 + 5", "2 + 9 - 4", "18 - 15 + 6", "5 + 6 - 2",
    "7 - 4 + 11", "4 + 10 - 6", "7 + 8 - 3", "14 + 6 - 3", "15 - 8 + 6",
    "8 - 3 + 15", "13 - 4 + 5", "11 + 1 - 8", "16 - 5 + 2", "20 - 9 + 5",
    "18 - 17 + 6", "16 - 10 + 5", "8 - 6 + 15", "19 - 9 + 3", "11 - 7 + 12",
    "20 - 13 + 4 - 5", "16 - 9 + 12 - 7", "11 - 8 + 15 - 3", "14 - 12 + 8 + 7",
    "15 - 8 - 5 + 12", "11 + 5 - 12 + 4", "12 + 6 - 3 + 2", "11 + 2 - 3 + 8",
    "4 + 12 - 7 + 6", "7 - 3 + 14 - 5", "9 + 11 - 7 - 5", "6 + 8 - 10 + 7",
    "17 - 9 + 3 - 6", "13 + 3 - 5 + 7", "8 + 9 - 5 + 3", "7 + 8 - 6 + 4",
    "13 - 8 + 12 - 9", "6 + 7 - 9 + 8", "15 - 7 + 6 - 5", "9 + 8 - 4 - 7",
    "12 - 9 + 15 - 6", "4 + 9 - 6 + 8", "16 - 8 + 7 - 5", "11 + 7 - 9 + 4"
  ].forEach(function (expr, idx) {
    chainQ("lan-" + idx, expr);
  });

  var zadaci = [];
  [
    ["zad-01", "Darko je imao 5 eura. Tata mu je dao 7 eura, a mama još 4 eura. Koliko eura sada ima Darko?", 16],
    ["zad-02", "Luka je imao 5 eura, mama mu je dala još 11 eura, a on je bratu dao 7 eura. Koliko eura mu je ostalo?", 9],
    ["zad-03", "Marko je imao 20 eura. Kupio je knjigu za 12 eura i sok za 3 eura. Koliko eura mu je ostalo?", 5],
    ["zad-04", "Iva je imala 9 eura. Potrošila je 4 eura, a onda dobila još 8 eura. Koliko eura sada ima?", 13],
    ["zad-05", "Josip ima 6 eura. Mama mu je dala još 9 eura. Ima li dovoljno za autić koji košta 16 eura?", "Ne", ["Da", "Ne"], "6 + 9 = 15 eura, a autić košta 16. Fali mu 1 euro."],
    ["zad-06", "Tina je izračunala 15 zadataka, a Lana 3 zadatka više. Koliko je zadataka izračunala Lana?", 18],
    ["zad-07", "Na lijevoj strani ulice je 11 kuća, a na desnoj 7 kuća više. Koliko kuća ima na desnoj strani?", 18],
    ["zad-08", "Ana ima 15 eura, a Iva 8 eura. Za koliko eura Ana ima više od Ive?", 7],
    ["zad-09", "Marko ima 12 sličica, a Ivan 5. Za koliko sličica Marko ima više?", 7],
    ["zad-10", "U košari je 8 jabuka i 6 krušaka. Pojeli su 5 komada voća. Koliko je voća ostalo?", 9],
    ["zad-11", "U autobusu je 12 putnika. Na stanici izađe 5, a uđu 4 putnika. Koliko je sada putnika?", 11],
    ["zad-12", "Na grani je 14 ptica. Odleti 9, a doleti 3. Koliko je ptica sada na grani?", 8],
    ["zad-13", "Imam 12 bojica. Seka mi pokloni još 2 bojice. Koliko ću ih ukupno imati?", 14],
    ["zad-14", "Maja je nacrtala 13 crvenih i 2 plava cvjetića. Koliko je cvjetića nacrtala ukupno?", 15],
    ["zad-15", "Petar je imao 11 eura. Za čokoladu je platio 6 eura. Koliko eura mu je ostalo?", 5],
    ["zad-16", "U razredu je 9 djevojčica i 8 dječaka. Koliko je ukupno učenika?", 17],
    ["sm-novac-01", "Mia ima 10 eura. Igračka košta 7 eura. Koliko eura joj ostaje nakon kupnje?", 3],
    ["sm-novac-02", "Tin ima 4 eura, a baka mu doda 8 eura. Može li kupiti knjigu od 12 eura?", "Da", ["Da", "Ne"], "4 + 8 = 12 eura — točno za knjigu."],
    ["sm-novac-03", "Jedan sok košta 2 eura. Koliko koštaju 5 sokova?", 10],
    ["sm-novac-04", "Ema ima 15 eura. Kupila je naljepnice za 6 eura i gumicu za 3 eura. Koliko eura joj ostaje?", 6],
    ["sm-novac-05", "Autić košta 18 eura. Luka ima 9 eura. Koliko mu još fali?", 9],
    ["sm-novac-06", "U trgovini: lopta 5 eura, zmaj 8 eura. Koliko koštaju zajedno?", 13],
    ["sm-novac-07", "Ana ima 20 eura. Kupila je dvije igračke: jednu za 7 i drugu za 6 eura. Koliko joj ostaje?", 7],
    ["sm-novac-08", "Marko ima 3 novčića od 1 eura i jednu novčanicu od 5 eura. Koliko eura ima ukupno?", 8],
    ["sm-novac-09", "Iva treba 14 eura za ulaznicu. Ima 9 eura. Koliko još treba uštedjeti?", 5],
    ["sm-novac-10", "Petar je platio 16 eura i dobio ostatak 4 eura. Koliko je koštala roba?", 12]
  ].forEach(function (row) {
    if (typeof row[2] === "number") {
      zadaci.push(numQ(row[0], row[1], row[2], row[3] || null, null, row[0].indexOf("sm-novac") === 0 ? 2 : 2));
    } else {
      zadaci.push(mcq(row[0], row[1], row[2], row[3], row[4] || null, null, 2));
    }
  });
  zadaci.push(mcq(
    "sm-novac-enough",
    "Imam 11 eura. Igračka košta 11 eura. Imam li dovoljno?",
    "Da",
    ["Da", "Ne"],
    "11 = 11 — imaš točno dovoljno.",
    null,
    1
  ));
  zadaci.push(match(
    "sm-novac-match",
    "Spoji kupnju s izračunom.",
    [["ima 10, kupi za 3", "10 − 3"], ["ima 4, dobije 5", "4 + 5"], ["fali do 12 od 7", "12 − 7"]],
    "Ostaje oduzimanje; dobivanje zbrajanje; fali razlika.",
    2
  ));

  global.CONTENT_MATEMATIKA = {
    id: "matematika",
    title: "Matematika",
    icon: "🔢",
    blurb: "Potraga za blagom po Profilu: prostorni odnosi, oblici i tijela, brojevi do 20, račun, novac i zadaci riječima.",
    color: "mat",
    games: [
      {
        id: "mat-prostor",
        title: "Prostorni odnosi",
        emoji: "📐",
        desc: "Trag: dulji/kraći, veći/manji, iznad/ispod, lijevo/desno.",
        roundSize: 10,
        bank: prostor
      },
      {
        id: "mat-oblici",
        title: "Oblici i tijela",
        emoji: "🔷",
        desc: "Trag: likovi, geometrijska tijela, točka i crta.",
        roundSize: 10,
        bank: oblici
      },
      {
        id: "mat-brojevi",
        title: "Brojevi do 20",
        emoji: "🔢",
        desc: "Trag: usporedi, desetice i jedinice, jedno-/dvoznamenkasti.",
        roundSize: 12,
        bank: brojevi
      },
      {
        id: "mat-redni",
        title: "Redni brojevi",
        emoji: "🥇",
        desc: "Trag: prvi do dvadeseti i snalaženje u redu.",
        roundSize: 10,
        bank: redniB
      },
      {
        id: "mat-broj-rijeci",
        title: "Brojevne riječi",
        emoji: "✍️",
        desc: "Trag: brojka ↔ riječ, pa i izračunaj i napiši riječima.",
        roundSize: 10,
        bank: brojRijeci
      },
      {
        id: "mat-racun",
        title: "Zbrajanje i oduzimanje",
        emoji: "➕",
        desc: "Trag: + i − do 20, zamjena pribrojnika i veza s oduzimanjem.",
        roundSize: 12,
        bank: racun
      },
      {
        id: "mat-lanac",
        title: "Lančani računi",
        emoji: "🔗",
        desc: "Trag: zbrajaj i oduzimaj po redu, s tri ili četiri broja.",
        roundSize: 10,
        bank: lanac
      },
      {
        id: "mat-jednadzbe",
        title: "Jednačenja",
        emoji: "⚖️",
        desc: "Trag: nađi x — npr. 7 + 3 = x + 5 ili x − 4 = 9.",
        roundSize: 12,
        bank: jednadzbe
      },
      {
        id: "mat-rijeci",
        title: "Zadaci s riječima",
        emoji: "📝",
        desc: "Trag: priče s brojevima — zbrajanje, oduzimanje i višekoraci.",
        roundSize: 10,
        bank: rijeci
      },
      {
        id: "mat-zadaci",
        title: "Zadaci i novac",
        emoji: "💶",
        desc: "Trag: životni zadaci, cijene i ostatak novca.",
        roundSize: 10,
        bank: zadaci
      }
    ]
  };
})(window);
