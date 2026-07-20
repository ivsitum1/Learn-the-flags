(function (global) {
  "use strict";

  var MAX = 20;

  function uniqChoices(answer, extras) {
    var set = {};
    var out = [];
    function add(v) {
      if (typeof v !== "number" || v < 0 || v > MAX) return;
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
    for (i = 0; i <= MAX && out.length < 4; i++) add(i);
    return out.slice(0, 4);
  }

  function mcq(id, prompt, answer, choices, explain, visual) {
    return {
      id: id,
      type: "mcq",
      prompt: prompt,
      answer: answer,
      choices: choices,
      explain: explain || ("Točno je " + answer + "."),
      visual: visual || null
    };
  }

  function numQ(id, prompt, answer, explain, visual) {
    return mcq(id, prompt, answer, uniqChoices(answer), explain, visual);
  }

  function tf(id, prompt, answer, explain) {
    return {
      id: id,
      type: "truefalse",
      prompt: prompt,
      answer: answer ? "Točno" : "Netočno",
      choices: ["Točno", "Netočno"],
      explain: explain
    };
  }

  function order(id, prompt, answer, explain) {
    return {
      id: id,
      type: "order",
      prompt: prompt,
      answer: answer,
      items: answer.slice(),
      explain: explain || ("Redoslijed: " + answer.join(", "))
    };
  }

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
          a + " " + cmp + " " + b + "."
        )
      );
    }
  }

  for (n = 0; n < MAX; n++) {
    brojevi.push(
      numQ("after-" + n, "Koji broj dolazi poslije " + n + "?", n + 1, "Poslije " + n + " ide " + (n + 1) + ".")
    );
  }
  for (n = 1; n <= MAX; n++) {
    brojevi.push(
      numQ("before-" + n, "Koji broj dolazi prije " + n + "?", n - 1, "Prije " + n + " ide " + (n - 1) + ".")
    );
  }

  for (start = 0; start <= MAX - 3; start++) {
    var miss = start + 2;
    brojevi.push(
      numQ(
        "miss-" + start,
        "Koji broj nedostaje: " + start + ", " + (start + 1) + ", ?, " + (start + 3) + "?",
        miss,
        "Niz: " + start + ", " + (start + 1) + ", " + miss + ", " + (start + 3) + "."
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
            "Od najmanjeg: " + a + ", " + b + ", " + n + "."
          )
        );
        brojevi.push(
          order(
            "ord-desc-" + n + "-" + b + "-" + a,
            "Poredaj brojeve od najvećeg do najmanjeg.",
            [n, b, a],
            "Od najvećeg: " + n + ", " + b + ", " + a + "."
          )
        );
      }
    }
  }

  for (n = 10; n <= MAX; n++) {
    var tens = Math.floor(n / 10);
    var ones = n % 10;
    brojevi.push(numQ("tens-" + n, "Koliko desetica ima broj " + n + "?", tens, n + " = " + tens + " desetica i " + ones + " jedinica."));
    brojevi.push(numQ("ones-" + n, "Koliko jedinica ima broj " + n + "?", ones, n + " = " + tens + " desetica i " + ones + " jedinica."));
  }

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
      racun.push(
        numQ(
          "add-" + a + "-" + b,
          "Koliko je " + a + " + " + b + "?",
          sum,
          a + " + " + b + " = " + sum + ".",
          a > 0 && b > 0 && a + b <= 12
            ? { kind: "groups", groups: [a, b], token: tokens[(a + b) % tokens.length], op: "+", suffix: "= ?" }
            : null
        )
      );
      racun.push(
        tf("tf-add-" + a + "-" + b, a + " + " + b + " = " + sum, true, a + " + " + b + " = " + sum + ".")
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
      var diff = a - b;
      racun.push(
        numQ(
          "sub-" + a + "-" + b,
          "Koliko je " + a + " − " + b + "?",
          diff,
          a + " − " + b + " = " + diff + ".",
          a <= 12 && b > 0
            ? { kind: "groups", groups: [a], token: "🔵", suffix: "  (−" + b + ")" }
            : null
        )
      );
    }
  }

  // Lančani računi: a + b − c  i  a − b + c
  var c;
  for (a = 0; a <= MAX; a++) {
    for (b = 0; a + b <= MAX; b++) {
      for (c = 0; c <= a + b; c++) {
        var chain = a + b - c;
        racun.push(
          numQ(
            "chain-ap-" + a + "-" + b + "-" + c,
            "Koliko je " + a + " + " + b + " − " + c + "?",
            chain,
            a + " + " + b + " = " + (a + b) + ", zatim " + (a + b) + " − " + c + " = " + chain + "."
          )
        );
      }
    }
  }

  for (a = 0; a <= MAX; a++) {
    for (b = 0; b <= a; b++) {
      for (c = 0; a - b + c <= MAX; c++) {
        var chain2 = a - b + c;
        racun.push(
          numQ(
            "chain-sa-" + a + "-" + b + "-" + c,
            "Koliko je " + a + " − " + b + " + " + c + "?",
            chain2,
            a + " − " + b + " = " + (a - b) + ", zatim " + (a - b) + " + " + c + " = " + chain2 + "."
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
            a + " + " + b + " + " + c + " = " + (a + b + c) + "."
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
            a + " − " + b + " = " + (a - b) + ", zatim " + (a - b) + " − " + c + " = " + (a - b - c) + "."
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
              "Korak po korak: " + a + " − " + b + " = " + (a - b) + ", + " + c + " = " + (a - b + c) + ", − " + d + " = " + mix + "."
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
        numQ("eq-abx-" + a + "-" + b, "Nađi x:  " + a + " + " + b + " = x", x, a + " + " + b + " = " + x + ", dakle x = " + x + ".")
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
            "Lijeva strana je " + (a + b) + ". Dakle x + " + c + " = " + (a + b) + ", pa je x = " + x + "."
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
            "Lijeva strana je " + (a + b) + ". Dakle x − " + c + " = " + (a + b) + ", pa je x = " + x + "."
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
            "Desna strana je " + (b + c) + ". Dakle " + a + " + x = " + (b + c) + ", pa je x = " + x + "."
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
            a + " − " + b + " − " + c + " = " + x + "."
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
              name + " ima " + a + " + " + b + " = " + (a + b) + "."
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
              a + " + " + b + " − " + c + " = " + (a + b - c) + "."
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
              a + " − " + b + " + " + c + " = " + (a - b + c) + "."
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
              a + " + " + b + " + " + c + " = " + (a + b + c) + "."
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
          a + " × 3 + " + b + " × 4 = " + (a * 3 + b * 4) + "."
        )
      );
      oblici.push(
        numQ(
          "mix-tri-rect-" + a + "-" + b,
          "Imaš " + a + " trokuta i " + b + " pravokutnika. Koliko stranica imaš ukupno?",
          a * 3 + b * 4,
          a + " × 3 + " + b + " × 4 = " + (a * 3 + b * 4) + "."
        )
      );
    }
  }
  oblici.push(mcq("no-sides", "Koji oblik nema stranica?", "krug", shapeNames, "Krug nema stranica."));
  oblici.push(mcq("eq-sides", "Koji oblik ima sve stranice jednake?", "kvadrat", shapeNames, "Kod kvadrata su sve stranice jednake."));
  oblici.push(tf("tf-krug4", "Krug ima 4 stranice.", false, "Krug nema stranica."));
  oblici.push(tf("tf-tri3", "Trokut ima 3 kuta.", true, "Trokut ima tri kuta i tri stranice."));
  oblici.push(tf("tf-both4", "Kvadrat i pravokutnik imaju 4 stranice.", true, "Oba imaju četiri stranice."));
  oblici.push({
    id: "match-sides",
    type: "match",
    prompt: "Spoji oblik s brojem stranica.",
    pairs: [["trokut", "3"], ["kvadrat", "4"], ["krug", "0"]],
    explain: "Trokut 3, kvadrat 4, krug 0 stranica."
  });
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

  global.CONTENT_MATEMATIKA = {
    id: "matematika",
    title: "Matematika",
    icon: "🔢",
    blurb: "Tisuće zadataka: brojevi, račun, jednačenja i zadaci s riječima.",
    color: "mat",
    games: [
      {
        id: "mat-brojevi",
        title: "Brojevi do 20",
        emoji: "🔢",
        desc: "Usporedi, nađi što nedostaje i poredaj — velika banka zadataka.",
        roundSize: 12,
        bank: brojevi
      },
      {
        id: "mat-racun",
        title: "Zbrajanje i oduzimanje",
        emoji: "➕",
        desc: "Zbrajanje, oduzimanje i lanci tipa 7 + 3 − 2.",
        roundSize: 12,
        bank: racun
      },
      {
        id: "mat-jednadzbe",
        title: "Jednačenja",
        emoji: "⚖️",
        desc: "Nađi x: npr. 7 + 3 = x + 5 ili x − 4 = 9.",
        roundSize: 12,
        bank: jednadzbe
      },
      {
        id: "mat-rijeci",
        title: "Zadaci s riječima",
        emoji: "📝",
        desc: "Priče s brojevima — zbrajanje, oduzimanje i lanci.",
        roundSize: 10,
        bank: rijeci
      },
      {
        id: "mat-oblici",
        title: "Oblici",
        emoji: "🔷",
        desc: "Krug, trokut, kvadrat i pravokutnik.",
        roundSize: 10,
        bank: oblici
      }
    ]
  };
})(window);
