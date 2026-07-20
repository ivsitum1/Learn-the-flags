(function (global) {
  "use strict";

  function mcq(id, prompt, answer, choices, explain, visual) {
    return {
      id: id,
      type: "mcq",
      prompt: prompt,
      answer: answer,
      choices: choices,
      explain: explain || ("Točno je „" + answer + "“."),
      visual: visual || null
    };
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
      explain: explain || ("Redoslijed: " + answer.join(" "))
    };
  }

  function uniqChoices(answer, pool, n) {
    var set = {};
    var out = [];
    function add(v) {
      var k = String(v);
      if (set[k]) return;
      set[k] = true;
      out.push(v);
    }
    add(answer);
    var i;
    for (i = 0; i < pool.length && out.length < (n || 4); i++) add(pool[i]);
    return out.slice(0, n || 4);
  }

  function shuffleInPlace(arr) {
    var i;
    for (i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i];
      arr[i] = arr[j];
      arr[j] = t;
    }
    return arr;
  }

  var SLOVA = [
    "A", "B", "C", "Č", "Ć", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
    "N", "O", "P", "R", "S", "Š", "T", "U", "V", "Z", "Ž"
  ];
  var MALA = [
    "a", "b", "c", "č", "ć", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
    "n", "o", "p", "r", "s", "š", "t", "u", "v", "z", "ž"
  ];

  var words = [
    ["mama", "M", "a", 2, ["ma", "ma"]],
    ["tata", "T", "a", 2, ["ta", "ta"]],
    ["pas", "P", "s", 1, ["pas"]],
    ["kuća", "K", "a", 2, ["ku", "ća"]],
    ["voda", "V", "a", 2, ["vo", "da"]],
    ["sunce", "S", "e", 2, ["sun", "ce"]],
    ["jabuka", "J", "a", 3, ["ja", "bu", "ka"]],
    ["olovka", "O", "a", 3, ["o", "lov", "ka"]],
    ["auto", "A", "o", 2, ["au", "to"]],
    ["riba", "R", "a", 2, ["ri", "ba"]],
    ["lav", "L", "v", 1, ["lav"]],
    ["brod", "B", "d", 1, ["brod"]],
    ["šuma", "Š", "a", 2, ["šu", "ma"]],
    ["ptica", "P", "a", 2, ["pti", "ca"]],
    ["cvijet", "C", "t", 2, ["cvij", "et"]],
    ["škola", "Š", "a", 2, ["ško", "la"]],
    ["dijete", "D", "e", 3, ["di", "je", "te"]],
    ["stol", "S", "l", 1, ["stol"]],
    ["prozor", "P", "r", 2, ["pro", "zor"]],
    ["zebra", "Z", "a", 2, ["ze", "bra"]],
    ["knjiga", "K", "a", 2, ["knji", "ga"]],
    ["lopta", "L", "a", 2, ["lop", "ta"]],
    ["mačka", "M", "a", 2, ["mač", "ka"]],
    ["more", "M", "e", 2, ["mo", "re"]],
    ["planina", "P", "a", 3, ["pla", "ni", "na"]],
    ["učitelj", "U", "j", 3, ["uči", "te", "lj"]],
    ["prijatelj", "P", "j", 3, ["pri", "ja", "telj"]],
    ["banana", "B", "a", 3, ["ba", "na", "na"]],
    ["čokolada", "Č", "a", 4, ["čo", "ko", "la", "da"]],
    ["kruška", "K", "a", 2, ["kruš", "ka"]],
    ["zvijezda", "Z", "a", 3, ["zvi", "jez", "da"]],
    ["oblaci", "O", "i", 3, ["o", "bla", "ci"]],
    ["vrata", "V", "a", 2, ["vra", "ta"]],
    ["prozorčić", "P", "ć", 3, ["pro", "zor", "čić"]],
    ["slovo", "S", "o", 2, ["slo", "vo"]],
    ["rečenica", "R", "a", 4, ["re", "če", "ni", "ca"]],
    ["abeceda", "A", "a", 4, ["a", "be", "ce", "da"]],
    ["cvijeće", "C", "e", 3, ["cvi", "je", "će"]],
    ["igračka", "I", "a", 3, ["i", "grač", "ka"]],
    ["boja", "B", "a", 2, ["bo", "ja"]],
    ["crvena", "C", "a", 3, ["cr", "ve", "na"]],
    ["plava", "P", "a", 2, ["pla", "va"]],
    ["zelena", "Z", "a", 3, ["ze", "le", "na"]],
    ["žuta", "Ž", "a", 2, ["žu", "ta"]],
    ["bijela", "B", "a", 3, ["bi", "je", "la"]],
    ["crna", "C", "a", 2, ["cr", "na"]],
    ["park", "P", "k", 1, ["park"]],
    ["grad", "G", "d", 1, ["grad"]],
    ["selo", "S", "o", 2, ["se", "lo"]],
    ["rijeka", "R", "a", 3, ["ri", "je", "ka"]],
    ["jezero", "J", "o", 3, ["je", "ze", "ro"]],
    ["drvo", "D", "o", 2, ["dr", "vo"]],
    ["lišće", "L", "e", 2, ["liš", "će"]],
    ["snijeg", "S", "g", 2, ["sni", "jeg"]],
    ["kiša", "K", "a", 2, ["ki", "ša"]],
    ["vjetar", "V", "r", 2, ["vje", "tar"]],
    ["sunčan", "S", "n", 2, ["sun", "čan"]],
    ["noć", "N", "ć", 1, ["noć"]],
    ["dan", "D", "n", 1, ["dan"]],
    ["jutro", "J", "o", 2, ["ju", "tro"]],
    ["večer", "V", "r", 2, ["ve", "čer"]],
    ["sestra", "S", "a", 2, ["ses", "tra"]],
    ["brat", "B", "t", 1, ["brat"]],
    ["baka", "B", "a", 2, ["ba", "ka"]],
    ["djed", "D", "d", 1, ["djed"]],
    ["priča", "P", "a", 2, ["pri", "ča"]],
    ["pjesma", "P", "a", 2, ["pjes", "ma"]],
    ["glazba", "G", "a", 2, ["glaz", "ba"]],
    ["ples", "P", "s", 1, ["ples"]],
    ["školarac", "Š", "c", 3, ["ško", "la", "rac"]],
    ["učenik", "U", "k", 3, ["u", "če", "nik"]],
    ["učionica", "U", "a", 4, ["u", "či", "o", "ni", "ca"].slice(0, 4)],
    ["klupa", "K", "a", 2, ["klu", "pa"]],
    ["ploča", "P", "a", 2, ["plo", "ča"]],
    ["kreda", "K", "a", 2, ["kre", "da"]],
    ["torba", "T", "a", 2, ["tor", "ba"]],
    ["olovčica", "O", "a", 4, ["o", "lov", "či", "ca"]],
    ["gumica", "G", "a", 3, ["gu", "mi", "ca"]],
    ["bojica", "B", "a", 3, ["bo", "ji", "ca"]],
    ["flomaster", "F", "r", 3, ["flo", "mas", "ter"]],
    ["papir", "P", "r", 2, ["pa", "pir"]],
    ["bojaonica", "B", "a", 5, ["bo", "ja", "o", "ni", "ca"]],
    ["prijateljica", "P", "a", 5, ["pri", "ja", "te", "lji", "ca"]],
    ["obitelj", "O", "j", 3, ["o", "bi", "telj"]],
    ["kućica", "K", "a", 3, ["ku", "ći", "ca"]],
    ["vrtić", "V", "ć", 2, ["vr", "tić"]],
    ["autobus", "A", "s", 3, ["au", "to", "bus"]],
    ["bicikl", "B", "l", 2, ["bi", "cikl"]],
    ["vlak", "V", "k", 1, ["vlak"]],
    ["avion", "A", "n", 3, ["a", "vi", "on"]],
    ["brodić", "B", "ć", 2, ["bro", "dić"]],
    ["zvono", "Z", "o", 2, ["zvo", "no"]],
    ["sat", "S", "t", 1, ["sat"]],
    ["kalendar", "K", "r", 3, ["ka", "len", "dar"]],
    ["mjesec", "M", "c", 2, ["mje", "sec"]],
    ["zvijezde", "Z", "e", 3, ["zvi", "jez", "de"]],
    ["duga", "D", "a", 2, ["du", "ga"]],
    ["lepto", "L", "o", 2, ["lep", "tir"].slice(0, 2)]
  ];

  // Ispravi greške u podacima slogova
  words[words.length - 1] = ["leptir", "L", "r", 2, ["lep", "tir"]];
  // učionica — 5 slogova
  for (var wi = 0; wi < words.length; wi++) {
    if (words[wi][0] === "učionica") {
      words[wi] = ["učionica", "U", "a", 5, ["u", "či", "o", "ni", "ca"]];
      break;
    }
  }

  /* ===================== SLOVA ===================== */
  var slova = [];
  var i, j, w, letter, next, prev;

  for (i = 0; i < words.length; i++) {
    w = words[i];
    slova.push(
      mcq(
        "first-" + w[0],
        "Koje je prvo slovo riječi „" + w[0] + "“?",
        w[1],
        uniqChoices(w[1], shuffleInPlace(SLOVA.slice())),
        "Riječ „" + w[0] + "“ počinje slovom " + w[1] + ".",
        { kind: "text", text: w[0] }
      )
    );
    slova.push(
      mcq(
        "last-" + w[0],
        "Koje je zadnje slovo riječi „" + w[0] + "“?",
        w[2],
        uniqChoices(w[2], shuffleInPlace(MALA.slice().concat(SLOVA.map(function (s) { return s.toLowerCase(); })))),
        "Riječ „" + w[0] + "“ završava slovom " + w[2] + ".",
        { kind: "text", text: w[0] }
      )
    );
    slova.push(
      mcq(
        "len-" + w[0],
        "Koliko slova ima riječ „" + w[0] + "“?",
        w[0].length,
        uniqChoices(w[0].length, [w[0].length - 1, w[0].length + 1, w[0].length + 2, w[0].length - 2, 2, 3, 4, 5, 6, 7, 8].filter(function (n) { return n > 0; })),
        "Riječ „" + w[0] + "“ ima " + w[0].length + " slova.",
        { kind: "text", text: w[0] }
      )
    );
  }

  for (i = 0; i < SLOVA.length; i++) {
    slova.push(
      mcq(
        "case-" + SLOVA[i],
        "Koje je malo slovo za " + SLOVA[i] + "?",
        MALA[i],
        uniqChoices(MALA[i], shuffleInPlace(MALA.slice())),
        "Veliko " + SLOVA[i] + " → malo " + MALA[i] + "."
      )
    );
    slova.push(
      mcq(
        "upper-" + MALA[i],
        "Koje je veliko slovo za „" + MALA[i] + "“?",
        SLOVA[i],
        uniqChoices(SLOVA[i], shuffleInPlace(SLOVA.slice())),
        "Malo " + MALA[i] + " → veliko " + SLOVA[i] + "."
      )
    );
  }

  for (i = 0; i < SLOVA.length - 1; i++) {
    next = SLOVA[i + 1];
    slova.push(
      mcq(
        "after-" + SLOVA[i],
        "Koje slovo dolazi poslije " + SLOVA[i] + "?",
        next,
        uniqChoices(next, shuffleInPlace(SLOVA.slice())),
        "Poslije " + SLOVA[i] + " ide " + next + "."
      )
    );
  }
  for (i = 1; i < SLOVA.length; i++) {
    prev = SLOVA[i - 1];
    slova.push(
      mcq(
        "before-" + SLOVA[i],
        "Koje slovo dolazi prije " + SLOVA[i] + "?",
        prev,
        uniqChoices(prev, shuffleInPlace(SLOVA.slice())),
        "Prije " + SLOVA[i] + " ide " + prev + "."
      )
    );
  }

  for (i = 0; i < SLOVA.length - 2; i++) {
    for (j = i + 1; j < SLOVA.length - 1; j++) {
      var k = j + 1;
      if (k >= SLOVA.length) continue;
      if ((i + j + k) % 2 !== 0) continue;
      slova.push(
        order(
          "ord-" + SLOVA[i] + "-" + SLOVA[j] + "-" + SLOVA[k],
          "Poredaj slova abecednim redom.",
          [SLOVA[i], SLOVA[j], SLOVA[k]],
          SLOVA[i] + ", pa " + SLOVA[j] + ", pa " + SLOVA[k] + "."
        )
      );
    }
  }

  for (i = 0; i < SLOVA.length; i++) {
    for (j = 0; j < SLOVA.length; j++) {
      if (i === j) continue;
      if ((i + j) % 3 !== 0) continue;
      slova.push(
        tf(
          "tf-ord-" + SLOVA[i] + "-" + SLOVA[j],
          "Slovo " + SLOVA[i] + " dolazi prije slova " + SLOVA[j] + " u abecedi.",
          i < j,
          i < j
            ? SLOVA[i] + " dolazi prije " + SLOVA[j] + "."
            : SLOVA[i] + " ne dolazi prije " + SLOVA[j] + "."
        )
      );
    }
  }

  slova.push(tf("tf-a-first", "Slovo A je prvo slovo hrvatske abecede (u našem popisu bez digrafa).", true, "Abeceda počinje slovom A."));
  slova.push(tf("tf-sent-cap", "Na početku rečenice pišemo veliko slovo.", true, "Rečenica počinje velikim slovom."));
  slova.push(tf("tf-end-dot", "Na kraju obične rečenice stavljamo točku.", true, "Obična rečenica završava točkom."));
  slova.push(tf("tf-space", "Riječi u rečenici pišemo bez razmaka.", false, "Između riječi ide razmak."));

  /* ===================== SLOGOVI ===================== */
  var slogovi = [];
  for (i = 0; i < words.length; i++) {
    w = words[i];
    var sylCount = w[3];
    slogovi.push(
      mcq(
        "syl-" + w[0],
        "Koliko slogova ima riječ „" + w[0] + "“?",
        sylCount,
        uniqChoices(sylCount, [1, 2, 3, 4, 5, sylCount - 1, sylCount + 1].filter(function (n) { return n >= 1; })),
        "Riječ „" + w[0] + "“ ima " + sylCount + " sloga/slogova.",
        { kind: "text", text: w[0] }
      )
    );
    slogovi.push(
      tf(
        "tf-syl-" + w[0] + "-" + sylCount,
        "Riječ „" + w[0] + "“ ima " + sylCount + " sloga/slogova.",
        true,
        "Točno: " + w[0] + " → " + sylCount + "."
      )
    );
    if (sylCount > 1) {
      slogovi.push(
        tf(
          "tf-syl-wrong-" + w[0],
          "Riječ „" + w[0] + "“ ima " + (sylCount - 1) + " sloga/slogova.",
          false,
          "Netočno: „" + w[0] + "“ ima " + sylCount + " sloga/slogova."
        )
      );
    }
    if (w[4] && w[4].length >= 2 && w[4].length <= 3) {
      slogovi.push(
        order(
          "join-" + w[0],
          "Složi slogove u riječ „" + w[0] + "“.",
          w[4].slice(),
          w[4].join(" + ") + " = " + w[0] + "."
        )
      );
    }
  }

  // Spoji dva sloga → riječ (samo dvosložne)
  for (i = 0; i < words.length; i++) {
    w = words[i];
    if (!w[4] || w[4].length !== 2) continue;
    var wrongWords = words
      .filter(function (x) { return x[0] !== w[0]; })
      .map(function (x) { return x[0]; });
    slogovi.push(
      mcq(
        "concat-" + w[0],
        "Što dobiješ ako spojiš „" + w[4][0] + "“ + „" + w[4][1] + "“?",
        w[0],
        uniqChoices(w[0], shuffleInPlace(wrongWords.slice())),
        w[4][0] + " + " + w[4][1] + " = " + w[0] + "."
      )
    );
  }

  // Koja riječ ima N slogova
  var bySyl = {};
  for (i = 0; i < words.length; i++) {
    w = words[i];
    if (!bySyl[w[3]]) bySyl[w[3]] = [];
    bySyl[w[3]].push(w[0]);
  }
  [1, 2, 3, 4, 5].forEach(function (n) {
    var list = bySyl[n] || [];
    list.forEach(function (ans, idx) {
      var distractors = [];
      Object.keys(bySyl).forEach(function (key) {
        if (Number(key) === n) return;
        distractors = distractors.concat(bySyl[key]);
      });
      slogovi.push(
        mcq(
          "which-syl-" + n + "-" + idx + "-" + ans,
          "Koja riječ ima " + n + " sloga/slogova?",
          ans,
          uniqChoices(ans, shuffleInPlace(distractors.slice())),
          "„" + ans + "“ ima " + n + " sloga/slogova."
        )
      );
    });
  });

  /* ===================== ČITANJE ===================== */
  var citanje = [];
  var names = ["Ana", "Ivan", "Mia", "Luka", "Ema", "Marko", "Iva", "Petar", "Lara", "Tin", "Nika", "Josip"];
  var places = ["parku", "školi", "vrtu", "šumi", "moru", "kući", "knjižnici", "igralištu", "dvorištu", "selu"];
  var colors = ["crvena", "plava", "zelena", "žuta", "bijela", "crna", "narančasta", "smeđa"];
  var animals = ["pas", "mačka", "ptica", "riba", "zec", "konj", "krava", "pile"];
  var foods = ["jabuku", "krušku", "kruh", "sir", "kolač", "juhu", "mlijeko", "jogurt"];
  var actions = ["čita", "crta", "trči", "pjeva", "piše", "skače", "pliva", "igra se"];
  var objects = ["knjigu", "olovku", "lopticu", "kišobran", "torbu", "cvijet", "balon", "igračku"];

  var ni, pi, ci, ai, fi, oi;

  for (ni = 0; ni < names.length; ni++) {
    for (ai = 0; ai < animals.length; ai++) {
      var petName = ["Cuki", "Miki", "Luki", "Buki", "Žućo", "Piki"][(ni + ai) % 6];
      citanje.push(
        mcq(
          "read-pet-" + ni + "-" + ai,
          names[ni] + " ima " + (animals[ai] === "mačka" ? "mačku" : animals[ai] === "ptica" ? "pticu" : animals[ai] === "riba" ? "ribu" : animals[ai] === "krava" ? "kravu" : animals[ai]) +
            ". Zove se " + petName + ".\n\nKako se zove " + (animals[ai] === "mačka" ? "mačka" : animals[ai]) + "?",
          petName,
          uniqChoices(petName, ["Cuki", "Miki", "Luki", "Buki", "Žućo", "Piki", "Rex", "Bobi"]),
          "Zove se " + petName + "."
        )
      );
    }
  }

  for (ni = 0; ni < names.length; ni++) {
    for (pi = 0; pi < places.length; pi++) {
      citanje.push(
        mcq(
          "read-place-" + ni + "-" + pi,
          names[ni] + " se igra u " + places[pi] + ". Veselo je.\n\nGdje se " + names[ni] + " igra?",
          "u " + places[pi],
          uniqChoices("u " + places[pi], places.map(function (p) { return "u " + p; })),
          names[ni] + " se igra u " + places[pi] + "."
        )
      );
    }
  }

  for (ni = 0; ni < names.length; ni++) {
    for (ci = 0; ci < colors.length; ci++) {
      var thing = ["kuću", "lopticu", "majicu", "kapu", "torbu", "olovku"][(ni + ci) % 6];
      citanje.push(
        mcq(
          "read-color-" + ni + "-" + ci,
          names[ni] + " crta " + colors[ci] + " " + thing + ".\n\nKoje je boje " + thing + "?",
          colors[ci],
          uniqChoices(colors[ci], shuffleInPlace(colors.slice())),
          thing.charAt(0).toUpperCase() + thing.slice(1) + " je " + colors[ci] + "."
        )
      );
    }
  }

  for (ni = 0; ni < names.length; ni++) {
    for (fi = 0; fi < foods.length; fi++) {
      citanje.push(
        mcq(
          "read-food-" + ni + "-" + fi,
          names[ni] + " jede " + foods[fi] + ". Ukusno je.\n\nŠto " + names[ni] + " jede?",
          foods[fi],
          uniqChoices(foods[fi], shuffleInPlace(foods.slice())),
          names[ni] + " jede " + foods[fi] + "."
        )
      );
    }
  }

  for (ni = 0; ni < names.length; ni++) {
    for (oi = 0; oi < objects.length; oi++) {
      citanje.push(
        mcq(
          "read-obj-" + ni + "-" + oi,
          names[ni] + " uzima " + objects[oi] + ". Pažljivo nosi.\n\nŠto " + names[ni] + " uzima?",
          objects[oi],
          uniqChoices(objects[oi], shuffleInPlace(objects.slice())),
          names[ni] + " uzima " + objects[oi] + "."
        )
      );
    }
  }

  for (ni = 0; ni < names.length; ni++) {
    for (oi = 0; oi < actions.length; oi++) {
      citanje.push(
        mcq(
          "read-act-" + ni + "-" + oi,
          names[ni] + " " + actions[oi] + ". Veselo je.\n\nŠto " + names[ni] + " radi?",
          actions[oi],
          uniqChoices(actions[oi], shuffleInPlace(actions.slice())),
          names[ni] + " " + actions[oi] + "."
        )
      );
    }
  }

  // Duži tekst — 2–3 rečenice, teži kraj 1. razreda
  for (ni = 0; ni < names.length - 1; ni++) {
    for (pi = 0; pi < places.length; pi++) {
      if ((ni + pi) % 2 !== 0) continue;
      citanje.push(
        mcq(
          "read-long-" + ni + "-" + pi,
          names[ni] +
            " i " +
            names[ni + 1] +
            " idu u " +
            places[pi] +
            ". Nose lopticu. Sunce sja.\n\nKamo idu " +
            names[ni] +
            " i " +
            names[ni + 1] +
            "?",
          "u " + places[pi],
          uniqChoices("u " + places[pi], places.map(function (p) { return "u " + p; })),
          "Idu u " + places[pi] + "."
        )
      );
      citanje.push(
        mcq(
          "read-long2-" + ni + "-" + pi,
          names[ni] +
            " i " +
            names[ni + 1] +
            " idu u " +
            places[pi] +
            ". Nose lopticu. Sunce sja.\n\nŠto nose?",
          "lopticu",
          uniqChoices("lopticu", ["lopticu", "knjigu", "kišobran", "torbu", "jabuku"]),
          "Nose lopticu."
        )
      );
    }
  }

  // Pravopis / rečenica
  var sentences = [
    ["Ana ide u školu.", "Ana"],
    ["Pas laje u dvorištu.", "Pas"],
    ["Sunce sja jako.", "Sunce"],
    ["Mama peče kolač.", "Mama"],
    ["Djeca čitaju knjigu.", "Djeca"],
    ["Kiša pada cijeli dan.", "Kiša"],
    ["Marko piše slovo A.", "Marko"],
    ["Ptica leti nad šumom.", "Ptica"]
  ];
  for (i = 0; i < sentences.length; i++) {
    citanje.push(
      mcq(
        "cap-" + i,
        "Koja riječ u rečenici „" + sentences[i][0] + "“ počinje velikim slovom?",
        sentences[i][1],
        uniqChoices(sentences[i][1], sentences[i][0].replace(".", "").split(" ")),
        "Rečenica počinje riječju „" + sentences[i][1] + "“."
      )
    );
    citanje.push(
      tf(
        "tf-cap-" + i,
        "Rečenica „" + sentences[i][0] + "“ počinje velikim slovom.",
        true,
        "Da — počinje s „" + sentences[i][1] + "“."
      )
    );
  }

  citanje.push(tf("tf-dot", "Na kraju rečenice stavljamo točku.", true, "Obična rečenica završava točkom."));
  citanje.push(tf("tf-qmark", "Upitna rečenica završava upitnikom.", true, "Pitanje završava znakom ?."));
  citanje.push(tf("tf-nospace", "Riječi pišemo jednu uz drugu bez razmaka.", false, "Između riječi ide razmak."));
  citanje.push(mcq("end-mark", "Čime završava obična rečenica?", "točkom", ["zarezom", "točkom", "crtica", "ništa"], "Obična rečenica završava točkom."));

  global.CONTENT_HRVATSKI = {
    id: "hrvatski",
    title: "Hrvatski",
    icon: "📖",
    blurb: "Tisuće zadataka: slova, slogovi i čitanje s razumijevanjem.",
    color: "hrv",
    games: [
      {
        id: "hrv-slova",
        title: "Slova i abeceda",
        emoji: "🔤",
        desc: "Prvo i zadnje slovo, velika/mala slova, red u abecedi.",
        roundSize: 12,
        bank: slova
      },
      {
        id: "hrv-slogovi",
        title: "Slogovi i riječi",
        emoji: "🧩",
        desc: "Broji slogove i sastavljaj riječi — velika banka.",
        roundSize: 12,
        bank: slogovi
      },
      {
        id: "hrv-citanje",
        title: "Čitanje",
        emoji: "📚",
        desc: "Pročitaj priču i odgovori — mnogo različitih tekstova.",
        roundSize: 10,
        bank: citanje
      }
    ]
  };
})(window);
