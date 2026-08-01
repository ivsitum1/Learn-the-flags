(function (global) {
  "use strict";

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
      explain: explain || ("Točno je „" + answer + "“."),
      visual: visual || null,
      diff: diff == null ? 2 : diff
    };
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
      explain: explain || ("Redoslijed: " + answer.join(" ")),
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
        { kind: "text", text: w[0] },
        1
      )
    );
    slova.push(
      mcq(
        "last-" + w[0],
        "Koje je zadnje slovo riječi „" + w[0] + "“?",
        w[2],
        uniqChoices(w[2], shuffleInPlace(MALA.slice().concat(SLOVA.map(function (s) { return s.toLowerCase(); })))),
        "Riječ „" + w[0] + "“ završava slovom " + w[2] + ".",
        { kind: "text", text: w[0] },
        1
      )
    );
    slova.push(
      mcq(
        "len-" + w[0],
        "Koliko slova ima riječ „" + w[0] + "“?",
        w[0].length,
        uniqChoices(w[0].length, [w[0].length - 1, w[0].length + 1, w[0].length + 2, w[0].length - 2, 2, 3, 4, 5, 6, 7, 8].filter(function (n) { return n > 0; })),
        "Riječ „" + w[0] + "“ ima " + w[0].length + " slova.",
        { kind: "text", text: w[0] },
        2
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
        "Veliko " + SLOVA[i] + " → malo " + MALA[i] + ".",
        null,
        2
      )
    );
    slova.push(
      mcq(
        "upper-" + MALA[i],
        "Koje je veliko slovo za „" + MALA[i] + "“?",
        SLOVA[i],
        uniqChoices(SLOVA[i], shuffleInPlace(SLOVA.slice())),
        "Malo " + MALA[i] + " → veliko " + SLOVA[i] + ".",
        null,
        2
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
        "Poslije " + SLOVA[i] + " ide " + next + ".",
        null,
        i % 2 === 0 ? 2 : 3
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
        "Prije " + SLOVA[i] + " ide " + prev + ".",
        null,
        i % 2 === 0 ? 3 : 2
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
          SLOVA[i] + ", pa " + SLOVA[j] + ", pa " + SLOVA[k] + ".",
          2 + ((i + j) % 2)
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
            : SLOVA[i] + " ne dolazi prije " + SLOVA[j] + ".",
          2 + (i % 2)
        )
      );
    }
  }

  slova.push(match(
    "match-diac-all",
    "Spoji veliko slovo s odgovarajućim malim.",
    [["Č", "č"], ["Ć", "ć"], ["Š", "š"], ["Ž", "ž"]],
    "Č–č, Ć–ć, Š–š, Ž–ž.",
    2
  ));
  slova.push(match(
    "match-diac-caron",
    "Spoji slova s kvačicom (caron).",
    [["Č", "č"], ["Š", "š"]],
    "Č ide s č, Š ide s š.",
    2
  ));
  slova.push(match(
    "match-diac-acute",
    "Spoji slova s akutom.",
    [["Ć", "ć"], ["Ž", "ž"]],
    "Ć ide s ć, Ž ide s ž.",
    2
  ));
  slova.push(match(
    "match-diac-c-c",
    "Spoji slična slova Č i Ć s malim oblicima.",
    [["Č", "č"], ["Ć", "ć"]],
    "Pazi: Č i Ć nisu isto slovo.",
    3
  ));
  slova.push(match(
    "match-diac-s-z",
    "Spoji Š i Ž s malim oblicima.",
    [["Š", "š"], ["Ž", "ž"]],
    "Š–š, Ž–ž.",
    3
  ));

  slova.push(tf("tf-a-first", "Slovo A je prvo slovo hrvatske abecede (u našem popisu bez digrafa).", true, "Abeceda počinje slovom A.", 1));
  slova.push(tf("tf-sent-cap", "Na početku rečenice pišemo veliko slovo.", true, "Rečenica počinje velikim slovom.", 1));
  slova.push(tf("tf-end-dot", "Na kraju obične rečenice stavljamo točku.", true, "Obična rečenica završava točkom.", 1));
  slova.push(tf("tf-space", "Riječi u rečenici pišemo bez razmaka.", false, "Između riječi ide razmak.", 1));
  slova.push(tf("tf-lowercase-start", 'Rečenica „mama peče kolač." počinje velikim slovom.', false, 'Na početku treba „Mama", ne „mama".', 2));
  slova.push(tf("tf-missing-dot", 'Rečenica „Pas trči brzo" završava točkom.', false, "Nedostaje točka na kraju.", 2));

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
        { kind: "text", text: w[0] },
        sylCount >= 3 ? 3 : 2
      )
    );
    if (sylCount > 1) {
      slogovi.push(
        tf(
          "tf-syl-wrong-" + w[0],
          "Riječ „" + w[0] + "“ ima " + (sylCount - 1) + " sloga/slogova.",
          false,
          "Netočno: „" + w[0] + "“ ima " + sylCount + " sloga/slogova.",
          sylCount >= 3 ? 3 : 2
        )
      );
      if (sylCount < 5) {
        slogovi.push(
          tf(
            "tf-syl-wrong2-" + w[0],
            "Riječ „" + w[0] + "“ ima " + (sylCount + 1) + " sloga/slogova.",
            false,
            "Netočno: „" + w[0] + "“ ima " + sylCount + " sloga/slogova.",
            sylCount >= 3 ? 3 : 2
          )
        );
      }
    }
    if (w[4] && w[4].length >= 2 && w[4].length <= 3) {
      slogovi.push(
        order(
          "join-" + w[0],
          "Složi slogove u riječ „" + w[0] + "“.",
          w[4].slice(),
          w[4].join(" + ") + " = " + w[0] + ".",
          2
        )
      );
    }
  }

  var multiSylOrder = [
    ["jabuka", ["ja", "bu", "ka"]],
    ["olovka", ["o", "lov", "ka"]],
    ["planina", ["pla", "ni", "na"]],
    ["čokolada", ["čo", "ko", "la", "da"]],
    ["rečenica", ["re", "če", "ni", "ca"]],
    ["abeceda", ["a", "be", "ce", "da"]],
    ["učitelj", ["uči", "te", "lj"]],
    ["prijatelj", ["pri", "ja", "telj"]]
  ];
  multiSylOrder.forEach(function (row, idx) {
    slogovi.push(
      order(
        "syl-order-" + row[0],
        "Poredaj slogove riječi „" + row[0] + "“.",
        row[1].slice(),
        row[1].join(" + ") + " = " + row[0] + ".",
        row[1].length >= 4 ? 3 : 2
      )
    );
  });

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
  var girls = {
    Ana: 1,
    Mia: 1,
    Ema: 1,
    Iva: 1,
    Lara: 1,
    Nika: 1
  };
  function isGirl(n) {
    return !!girls[n];
  }
  function bioBila(n) {
    return isGirl(n) ? "bila" : "bio";
  }
  function otisaoOtisla(n) {
    return isGirl(n) ? "otišla" : "otišao";
  }
  function njeNjega(n) {
    return isGirl(n) ? "nje" : "njega";
  }
  function sKim(n) {
    var map = {
      Ana: "Anom",
      Ivan: "Ivanom",
      Mia: "Miom",
      Luka: "Lukom",
      Ema: "Emom",
      Marko: "Markom",
      Iva: "Ivom",
      Petar: "Petrom",
      Lara: "Larom",
      Tin: "Tinom",
      Nika: "Nikom",
      Josip: "Josipom"
    };
    return map[n] || n;
  }

  // loc = gdje? (lokativ), dir = kamo? (akuzativ / ustaljeni smjer)
  var placeDefs = [
    { id: "park", loc: "u parku", dir: "u park" },
    { id: "skola", loc: "u školi", dir: "u školu" },
    { id: "vrt", loc: "u vrtu", dir: "u vrt" },
    { id: "suma", loc: "u šumi", dir: "u šumu" },
    { id: "more", loc: "na moru", dir: "na more" },
    { id: "kuca", loc: "u kući", dir: "kući" },
    { id: "knjiznica", loc: "u knjižnici", dir: "u knjižnicu" },
    { id: "igraliste", loc: "na igralištu", dir: "na igralište" },
    { id: "dvoriste", loc: "u dvorištu", dir: "u dvorište" },
    { id: "selo", loc: "u selu", dir: "u selo" }
  ];
  function placeLocChoices(answer) {
    return uniqChoices(
      answer,
      placeDefs.map(function (p) {
        return p.loc;
      })
    );
  }
  function placeDirChoices(answer) {
    return uniqChoices(
      answer,
      placeDefs.map(function (p) {
        return p.dir;
      })
    );
  }

  var colors = ["crvena", "plava", "zelena", "žuta", "bijela", "crna", "narančasta", "smeđa"];
  var animals = ["pas", "mačka", "ptica", "riba", "zec", "konj", "krava", "pile"];
  var foods = ["jabuku", "krušku", "kruh", "sir", "kolač", "juhu", "jogurt"];
  var drinks = ["mlijeko", "vodu", "sok", "čaj"];
  var actions = ["čita", "crta", "trči", "pjeva", "piše", "skače", "pliva", "igra se"];
  var objects = ["knjigu", "olovku", "lopticu", "kišobran", "torbu", "cvijet", "balon", "igračku"];

  function animalAcc(a) {
    var map = {
      pas: "psa",
      mačka: "mačku",
      ptica: "pticu",
      riba: "ribu",
      zec: "zeca",
      konj: "konja",
      krava: "kravu",
      pile: "pile"
    };
    return map[a] || a;
  }

  var ni, pi, ci, ai, fi, oi, di;

  // Lagano: ime ljubimca — ime je u tekstu, ali treba pažljivo pročitati
  for (ni = 0; ni < names.length; ni++) {
    for (ai = 0; ai < animals.length; ai++) {
      var petName = ["Cuki", "Miki", "Luki", "Buki", "Žućo", "Piki"][(ni + ai) % 6];
      citanje.push(
        mcq(
          "read-pet-" + ni + "-" + ai,
          names[ni] +
            " ima " +
            animalAcc(animals[ai]) +
            ". Zove se " +
            petName +
            ".\n\nKako se zove " +
            (animals[ai] === "mačka" ? "mačka" : animals[ai]) +
            "?",
          petName,
          uniqChoices(petName, ["Cuki", "Miki", "Luki", "Buki", "Žućo", "Piki", "Rex", "Bobi"]),
          "Zove se " + petName + ".",
          null,
          1
        )
      );
    }
  }

  // Mjesto — zaključivanje; odgovor u lokativu (gdje?)
  var placeScenes = {
    park: function (n) {
      return (
        n +
        " sjedi na klupi. Oko " +
        njeNjega(n) +
        " su stabla i staze za šetnju. Netko vozi bicikl stazom.\n\nGdje je " +
        n +
        "?"
      );
    },
    skola: function (n) {
      return (
        n +
        " sjedi u klupi i gleda na ploču. Učiteljica piše brojeve. Zvono će uskoro zazvoniti.\n\nGdje je " +
        n +
        "?"
      );
    },
    vrt: function (n) {
      return (
        n +
        " zalijeva biljke i bere zrele rajčice. Miris zemlje je ugodan.\n\nGdje je " +
        n +
        "?"
      );
    },
    suma: function (n) {
      return (
        n +
        " hoda među visokim stablima. Čuje se pjev ptica i šuštanje lišća.\n\nGdje je " +
        n +
        "?"
      );
    },
    more: function (n) {
      return (
        n +
        " gazi po valovima. Osjeća slanu vodu i topli pijesak pod nogama.\n\nGdje je " +
        n +
        "?"
      );
    },
    kuca: function (n) {
      return (
        n +
        " leži u svom krevetu i čita priču pred spavanje. Soba je tiha.\n\nGdje je " +
        n +
        "?"
      );
    },
    knjiznica: function (n) {
      return (
        n +
        " tiho lista knjige. Svi govore šapatom. Na policama su stotine naslova.\n\nGdje je " +
        n +
        "?"
      );
    },
    igraliste: function (n) {
      return (
        n +
        " se ljulja i skače u pijesku s prijateljima. Čuje se smijeh.\n\nGdje je " +
        n +
        "?"
      );
    },
    dvoriste: function (n) {
      return (
        n +
        " trči između kuće i ograde. Mama gleda s terase i maše.\n\nGdje je " +
        n +
        "?"
      );
    },
    selo: function (n) {
      return (
        n +
        " vidi traktore, kokoši i široka polja. Daleko laje pas.\n\nGdje je " +
        n +
        "?"
      );
    }
  };

  for (ni = 0; ni < names.length; ni++) {
    for (pi = 0; pi < placeDefs.length; pi++) {
      var pd = placeDefs[pi];
      citanje.push(
        mcq(
          "read-place-" + ni + "-" + pi,
          placeScenes[pd.id](names[ni]),
          pd.loc,
          placeLocChoices(pd.loc),
          names[ni] + " je " + pd.loc + ".",
          null,
          2
        )
      );
    }
  }

  // Boja — zaključivanje iz konteksta, bez imenovanja boje
  var colorScenes = {
    crvena: function (n, thing) {
      return "Napolju zriju jagode. " + n + " crta " + thing + " kao jagodu.\n\nKoje je boje " + thing + "?";
    },
    plava: function (n, thing) {
      return n + " gleda vedro nebo bez oblaka i crta " + thing + ".\n\nKoje je boje " + thing + "?";
    },
    zelena: function (n, thing) {
      return "Trava je posvuda. " + n + " crta " + thing + " kao travu.\n\nKoje je boje " + thing + "?";
    },
    žuta: function (n, thing) {
      return "Sunce jako sja. " + n + " crta " + thing + " kao sunce.\n\nKoje je boje " + thing + "?";
    },
    bijela: function (n, thing) {
      return "Pao je snijeg. " + n + " crta " + thing + ".\n\nKoje je boje " + thing + "?";
    },
    crna: function (n, thing) {
      return "Noć je i zvijezde se jedva vide. " + n + " crta " + thing + ".\n\nKoje je boje " + thing + "?";
    },
    narančasta: function (n, thing) {
      return n + " gleda zalazak sunca i crta " + thing + ".\n\nKoje je boje " + thing + "?";
    },
    smeđa: function (n, thing) {
      return n + " gleda stablo i koru drveta, pa crta " + thing + ".\n\nKoje je boje " + thing + "?";
    }
  };

  for (ni = 0; ni < names.length; ni++) {
    for (ci = 0; ci < colors.length; ci++) {
      var thing = ["kuću", "lopticu", "majicu", "kapu", "torbu", "olovku"][(ni + ci) % 6];
      var col = colors[ci];
      citanje.push(
        mcq(
          "read-color-" + ni + "-" + ci,
          colorScenes[col](names[ni], thing),
          col,
          uniqChoices(col, shuffleInPlace(colors.slice())),
          thing.charAt(0).toUpperCase() + thing.slice(1) + " je " + col + ".",
          null,
          2
        )
      );
    }
  }

  // Hrana — zaključivanje
  var foodScenes = {
    jabuku: function (n) {
      return n + " grize nešto crveno i okruglo s drveta. Sok curi po bradi.\n\nŠto " + n + " jede?";
    },
    krušku: function (n) {
      return n + " jede voće koje je dolje šire, a gore uže.\n\nŠto " + n + " jede?";
    },
    kruh: function (n) {
      return "Miris pečenja širi se kuhinjom. " + n + " jede topli doručak iz pećnice.\n\nŠto " + n + " jede?";
    },
    sir: function (n) {
      return n + " jede žuti komadić koji se pravi od mlijeka.\n\nŠto " + n + " jede?";
    },
    kolač: function (n) {
      return "Rođendan je! " + n + " jede slatki desert sa svjećicom.\n\nŠto " + n + " jede?";
    },
    juhu: function (n) {
      return n + " jede toplo jelo iz zdjelice žlicom.\n\nŠto " + n + " jede?";
    },
    jogurt: function (n) {
      return n + " jede kiselo-slatko iz čašice žličicom.\n\nŠto " + n + " jede?";
    }
  };

  for (ni = 0; ni < names.length; ni++) {
    for (fi = 0; fi < foods.length; fi++) {
      var food = foods[fi];
      citanje.push(
        mcq(
          "read-food-" + ni + "-" + fi,
          foodScenes[food](names[ni]),
          food,
          uniqChoices(food, shuffleInPlace(foods.slice())),
          names[ni] + " jede " + food + ".",
          null,
          2
        )
      );
    }
  }

  // Piće — samo „pije“, nikad „jede“
  var drinkScenes = {
    mlijeko: function (n) {
      return n + " pije bijelo piće iz čaše uz doručak.\n\nŠto " + n + " pije?";
    },
    vodu: function (n) {
      return (
        n +
        " je " +
        (isGirl(n) ? "žedna" : "žedan") +
        " i pije bistru tekućinu iz čaše.\n\nŠto " +
        n +
        " pije?"
      );
    },
    sok: function (n) {
      return n + " pije voćni napitak narančaste boje.\n\nŠto " + n + " pije?";
    },
    čaj: function (n) {
      return n + " pije topli napitak iz šalice, s mirisom bilja.\n\nŠto " + n + " pije?";
    }
  };

  for (ni = 0; ni < names.length; ni++) {
    for (di = 0; di < drinks.length; di++) {
      var drink = drinks[di];
      citanje.push(
        mcq(
          "read-drink-" + ni + "-" + di,
          drinkScenes[drink](names[ni]),
          drink,
          uniqChoices(drink, shuffleInPlace(drinks.slice())),
          names[ni] + " pije " + drink + ".",
          null,
          2
        )
      );
    }
  }

  // Predmet — zaključivanje (kišobran i ostalo)
  var objectScenes = {
    kišobran: function (name) {
      return "Kiša pada. " + name + " izlazi iz kuće.\n\nŠto " + name + " uzima?";
    },
    knjigu: function (name) {
      return name + " ide u knjižnicu čitati. Treba nešto za tihi kutak.\n\nŠto " + name + " uzima?";
    },
    olovku: function (name) {
      return name + " sjeda za stol da piše zadaću.\n\nŠto " + name + " uzima?";
    },
    lopticu: function (name) {
      return name + " ide na igralište igrati se s prijateljima.\n\nŠto " + name + " uzima?";
    },
    torbu: function (name) {
      return name + " ide u školu kad zazvoni jutarnje zvono.\n\nŠto " + name + " uzima?";
    },
    cvijet: function (name) {
      return name + " bere u vrtu nešto lijepo i mirisno za mamu.\n\nŠto " + name + " uzima?";
    },
    balon: function (name) {
      return "Na rođendanu svi se veselo smiju. " + name + " bira jednu stvar koja leti na vrpci.\n\nŠto " + name + " uzima?";
    },
    igračku: function (name) {
      return name + " ide se igrati u svoju sobu.\n\nŠto " + name + " uzima?";
    }
  };

  for (ni = 0; ni < names.length; ni++) {
    for (oi = 0; oi < objects.length; oi++) {
      var obj = objects[oi];
      citanje.push(
        mcq(
          "read-obj-" + ni + "-" + oi,
          objectScenes[obj](names[ni]),
          obj,
          uniqChoices(obj, shuffleInPlace(objects.slice())),
          "Iz teksta slijedi da " + names[ni] + " uzima " + obj + ".",
          null,
          2
        )
      );
    }
  }

  // Radnja — jedna povezana pričica; odgovor se zaključuje
  var actionScenes = {
    čita: function (n) {
      return (
        n +
        " sjedi mirno, drži otvorenu knjigu i očima prati redove.\n\nŠto " +
        n +
        " radi?"
      );
    },
    crta: function (n) {
      return (
        n +
        " ima papir i bojice pred sobom te polako nastaje slika.\n\nŠto " +
        n +
        " radi?"
      );
    },
    trči: function (n) {
      return (
        n +
        " žuri stazom dok " +
        (isGirl(n) ? "joj" : "mu") +
        " noge brzo udaraju o tlo.\n\nŠto " +
        n +
        " radi?"
      );
    },
    pjeva: function (n) {
      return (
        n +
        " otvara usta i prostorom se širi poznata melodija.\n\nŠto " +
        n +
        " radi?"
      );
    },
    piše: function (n) {
      return (
        n +
        " drži olovku i na papiru se redom pojavljuju slova.\n\nŠto " +
        n +
        " radi?"
      );
    },
    skače: function (n) {
      return (
        n +
        " poskakuje gore-dolje na obje noge, baš kao na trampolinu.\n\nŠto " +
        n +
        " radi?"
      );
    },
    pliva: function (n) {
      return (
        n +
        " je u bazenu, miče rukama i nogama i veselo ide prema drugoj strani.\n\nŠto " +
        n +
        " radi?"
      );
    },
    "igra se": function (n) {
      return (
        n +
        " se smije s prijateljima dok zajedno pomiču igračke po podu.\n\nŠto " +
        n +
        " radi?"
      );
    }
  };

  for (ni = 0; ni < names.length; ni++) {
    for (oi = 0; oi < actions.length; oi++) {
      var act = actions[oi];
      citanje.push(
        mcq(
          "read-act-" + ni + "-" + oi,
          actionScenes[act](names[ni]),
          act,
          uniqChoices(act, shuffleInPlace(actions.slice())),
          names[ni] + " " + act + ".",
          null,
          2
        )
      );
    }
  }

  // Teški: duži tekst; smjer = akuzativ / ustaljeni oblik (kamo?), lokacija = lokativ (gdje?)
  var weatherCarry = [
    ["Kiša pada.", "kišobran", ["kišobran", "sunčane naočale", "lopticu", "kupaći"]],
    ["Sunce jako peče.", "sunčane naočale", ["sunčane naočale", "kišobran", "čizme", "kapu za snijeg"]],
    ["Pao je snijeg.", "čizme", ["čizme", "sandale", "kupaći", "kišobran"]]
  ];

  for (ni = 0; ni < names.length - 1; ni++) {
    for (pi = 0; pi < placeDefs.length; pi++) {
      if ((ni + pi) % 2 !== 0) continue;
      var a = names[ni];
      var b = names[ni + 1];
      var place = placeDefs[pi];
      citanje.push(
        mcq(
          "read-long-" + ni + "-" + pi,
          "Jutros su " +
            a +
            " i " +
            b +
            " stajali pred kućom. Uzeli su lopticu i krenuli. Put je bio kratak. Sunce je sjalo. Napokon su stigli " +
            place.dir +
            ".\n\nKamo su stigli " +
            a +
            " i " +
            b +
            "?",
          place.dir,
          placeDirChoices(place.dir),
          "Stigli su " + place.dir + ".",
          null,
          3
        )
      );
      citanje.push(
        mcq(
          "read-long2-" + ni + "-" + pi,
          a +
            " nosi knjigu pod rukom. " +
            b +
            " u ruci drži lopticu. Smiju se i žure. Idu " +
            place.dir +
            " jer tamo ih čekaju prijatelji.\n\nŠto nosi " +
            b +
            "?",
          "lopticu",
          uniqChoices("lopticu", ["lopticu", "knjigu", "kišobran", "torbu", "jabuku"]),
          b + " nosi lopticu.",
          null,
          3
        )
      );
      citanje.push(
        mcq(
          "read-long3-" + ni + "-" + pi,
          "Jutros je " +
            a +
            " " +
            bioBila(a) +
            " u kući. Poslije je " +
            otisaoOtisla(a) +
            " " +
            place.dir +
            " s " +
            sKim(b) +
            ". Ondje su se igrali i razgovarali. Sad se vraćaju.\n\nGdje su " +
            a +
            " i " +
            b +
            " bili nakon kuće?",
          place.loc,
          placeLocChoices(place.loc),
          "Nakon kuće bili su " + place.loc + ".",
          null,
          3
        )
      );
    }
  }

  for (ni = 0; ni < names.length; ni++) {
    for (oi = 0; oi < weatherCarry.length; oi++) {
      var w = weatherCarry[oi];
      citanje.push(
        mcq(
          "read-infer-" + ni + "-" + oi,
          w[0] +
            " " +
            names[ni] +
            " stoji na vratima. Trenutak kasnije izlazi van.\n\nŠto " +
            names[ni] +
            " najprije uzima?",
          w[1],
          uniqChoices(w[1], w[2]),
          "Zbog vremena " + names[ni] + " uzima: " + w[1] + ".",
          null,
          3
        )
      );
    }
  }

  // Pravopis / rečenica — srednje / lagano
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
        "Rečenica počinje riječju „" + sentences[i][1] + "“.",
        null,
        1
      )
    );
  }

  var sentenceWrite = [
    ["Ana voli crvenu jabuku.", ["ana voli crvenu jabuku.", "Ana voli crvenu jabuku", "Anavoli crvenu jabuku.", "Ana voli Crvenu jabuku."]],
    ["Luka trči u park.", ["Luka trči u park", "luka trči u park.", "Luka  trči u park.", "Luka trči u Park."]],
    ["Mama peče kolač.", ["mama peče kolač.", "Mama peče kolač", "Mama peče  kolač.", "Mama Peče kolač."]],
    ["Pas spava na krevetu.", ["Pas spava na krevetu", "pas spava na krevetu.", "Pas spava nakrevetu.", "Pas spava na Krevetu."]],
    ["Sunce sja danas.", ["sunce sja danas.", "Sunce sja danas", "Sunce  sja danas.", "Sunce Sja danas."]],
    ["Ema čita knjigu.", ["ema čita knjigu.", "Ema čita knjigu", "Emacita knjigu.", "Ema Čita knjigu."]],
    ["Kiša pada cijeli dan.", ["Kiša pada cijeli dan", "kiša pada cijeli dan.", "Kiša pada  cijeli dan.", "Kiša Pada cijeli dan."]],
    ["Marko piše domaću zadaću.", ["marko piše domaću zadaću.", "Marko piše domaću zadaću", "Marko piše domaćuzadaću.", "Marko Piše domaću zadaću."]],
    ["Ptica pjeva ujutro.", ["Ptica pjeva ujutro", "ptica pjeva ujutro.", "Ptica  pjeva ujutro.", "Ptica Pjeva ujutro."]],
    ["Ivan ide u školu autobusom.", ["ivan ide u školu autobusom.", "Ivan ide u školu autobusom", "Ivan ide u Školu autobusom.", "Ivanide u školu autobusom."]]
  ];
  sentenceWrite.forEach(function (row, idx) {
    citanje.push(
      mcq(
        "sent-write-" + idx,
        "Koja rečenica je točno napisana?",
        row[0],
        uniqChoices(row[0], row[1]),
        "Točno: „" + row[0] + "“ — veliko slovo na početku i točka na kraju.",
        null,
        2
      )
    );
  });

  citanje.push(tf("tf-dot", "Na kraju rečenice stavljamo točku.", true, "Obična rečenica završava točkom.", 1));
  citanje.push(tf("tf-qmark", "Upitna rečenica završava upitnikom.", true, "Pitanje završava znakom ?.", 1));
  citanje.push(tf("tf-nospace", "Riječi pišemo jednu uz drugu bez razmaka.", false, "Između riječi ide razmak.", 1));
  citanje.push(tf("tf-wrong-cap", 'Rečenica „tata ide na posao." je pravilno napisana.', false, 'Na početku treba veliko slovo: „Tata".', 2));
  citanje.push(tf("tf-wrong-end", 'Rečenica „Mama peče kolač" završava točkom.', false, "Nedostaje točka na kraju.", 2));
  citanje.push(
    mcq(
      "end-mark",
      "Čime završava obična rečenica?",
      "točkom",
      ["zarezom", "točkom", "crtica", "ništa"],
      "Obična rečenica završava točkom.",
      null,
      1
    )
  );

  /* ===================== PARTICIJA U 9 STANICA + DOPUNE ===================== */
  function idStarts(q, prefixes) {
    var id = String(q.id || "");
    var p;
    for (p = 0; p < prefixes.length; p++) {
      if (id.indexOf(prefixes[p]) === 0) return true;
    }
    return false;
  }

  function pickBank(source, prefixes) {
    return source.filter(function (q) {
      return idStarts(q, prefixes);
    });
  }

  var prvoZadnje = pickBank(slova, ["first-", "last-"]);
  var duljina = pickBank(slova, ["len-"]);
  var velikaMala = pickBank(slova, ["case-", "upper-", "match-diac-"]);
  var abeceda = pickBank(slova, ["after-", "before-", "ord-", "tf-ord-", "tf-a-first"]);
  var slogBroj = slogovi.filter(function (q) {
    var id = String(q.id || "");
    if (id.indexOf("syl-order-") === 0) return false;
    return (
      id.indexOf("syl-") === 0 ||
      id.indexOf("tf-syl-") === 0 ||
      id.indexOf("which-syl-") === 0
    );
  });
  var slogSastavi = pickBank(slogovi, ["join-", "concat-", "syl-order-"]);
  var recenica = pickBank(slova, [
    "tf-sent-cap",
    "tf-end-dot",
    "tf-space",
    "tf-lowercase-start",
    "tf-missing-dot"
  ]).concat(
    pickBank(citanje, [
      "cap-",
      "sent-write-",
      "tf-dot",
      "tf-qmark",
      "tf-nospace",
      "tf-wrong-",
      "end-mark"
    ])
  );
  var citanjeKratko = pickBank(citanje, [
    "read-pet-",
    "read-place-",
    "read-color-",
    "read-food-",
    "read-drink-",
    "read-obj-",
    "read-act-"
  ]);
  var razumijevanje = pickBank(citanje, ["read-long", "read-infer-"]);

  /* ===================== PRAVOPIS =====================
     ije/je, č/ć, dž/đ, glas h, lj/nj i pisanje „ne“ uz glagol.
     Priprema za 2. razred: dijete bira točno napisanu riječ, dopunjava
     slovo koje nedostaje i prepoznaje pogrešno napisanu riječ.
     ==================================================== */

  // grupa: "ije" i "je" (jat), "cc" (č/ć), "dzdj" (dž/đ), "ostalo"
  var PRAVOPIS_RIJECI = [
    // --- ije (dugi jat) ---
    { ok: "cvijet", bad: ["cvjet", "cvet"], grupa: "ije", dio: "ije",
      sent: "Na livadi je izrastao žuti ___.",
      why: "Jedan cvijet piše se s ije, a više njih su cvjetovi — s je." },
    { ok: "mlijeko", bad: ["mljeko", "mleko"], grupa: "ije", dio: "ije",
      sent: "Ujutro pijem toplo ___.",
      why: "Mlijeko ima ije, ali mliječni proizvodi imaju je." },
    { ok: "dijete", bad: ["djete", "dete"], grupa: "ije", dio: "ije",
      sent: "Malo ___ spava u kolijevci.",
      why: "Jedno dijete piše se s ije, a više njih su djeca — s je." },
    { ok: "snijeg", bad: ["snjeg", "sneg"], grupa: "ije", dio: "ije",
      sent: "Zimi s neba pada bijeli ___.",
      why: "Snijeg ima ije, a snjegović i snježno imaju je." },
    { ok: "lijep", bad: ["ljep", "lep"], grupa: "ije", dio: "ije",
      sent: "Danas je ___ i sunčan dan.",
      why: "Lijep ima ije, a ljepota i ljepši imaju je." },
    { ok: "vrijeme", bad: ["vrjeme", "vreme"], grupa: "ije", dio: "ije",
      sent: "Vani je sunčano ___.",
      why: "Vrijeme ima ije, ali u množini kažemo vremena." },
    { ok: "riječ", bad: ["rječ", "reč"], grupa: "ije", dio: "ije",
      sent: "Napiši jednu ___ na ploču.",
      why: "Riječ ima ije, a rječnik i rječica imaju je." },
    { ok: "bijela", bad: ["bjela", "bela"], grupa: "ije", dio: "ije",
      sent: "Ovca ima meku ___ vunu.",
      why: "Bijela ima ije, a bjelina i bjelkast imaju je." },
    { ok: "dvije", bad: ["dvje", "dve"], grupa: "ije", dio: "ije",
      sent: "Na stolu su ___ jabuke.",
      why: "Kažemo dvije jabuke (ženski rod) i dva ključa (muški rod)." },
    { ok: "cvijeće", bad: ["cvjeće", "cveće"], grupa: "ije", dio: "ije",
      sent: "U vazi je mirisno ___.",
      why: "Cvijeće ima ije — kao i cvijet." },
    { ok: "lijek", bad: ["ljek", "lek"], grupa: "ije", dio: "ije",
      sent: "Kad smo bolesni, uzimamo ___.",
      why: "Lijek ima ije, a ljekarna i ljekovit imaju je." },
    { ok: "rijeka", bad: ["rjeka", "reka"], grupa: "ije", dio: "ije",
      sent: "Kroz naš grad teče velika ___.",
      why: "Rijeka ima ije, a rječica (mala rijeka) ima je." },
    { ok: "sijeno", bad: ["sjeno", "seno"], grupa: "ije", dio: "ije",
      sent: "Konj u staji jede suho ___.",
      why: "Sijeno se piše s ije." },
    { ok: "bijeg", bad: ["bjeg", "beg"], grupa: "ije", dio: "ije",
      sent: "Zec je nagli u ___.",
      why: "Bijeg ima ije, a bježati ima je." },

    // --- je (kratki jat) ---
    { ok: "mjesec", bad: ["mijesec", "mesec"], grupa: "je", dio: "je",
      sent: "Noću na nebu sja ___.",
      why: "Mjesec se piše s je — kratko, bez i." },
    { ok: "djeca", bad: ["dijeca", "deca"], grupa: "je", dio: "je",
      sent: "U dvorištu se igraju vesela ___.",
      why: "Jedno je dijete (ije), a više njih su djeca (je)." },
    { ok: "vjetar", bad: ["vijetar", "vetar"], grupa: "je", dio: "je",
      sent: "Nad morem puše jak ___.",
      why: "Vjetar se piše s je." },
    { ok: "pjesma", bad: ["pijesma", "pesma"], grupa: "je", dio: "je",
      sent: "U školi smo naučili novu ___.",
      why: "Pjesma i pjevati pišu se s je." },
    { ok: "vjeverica", bad: ["vijeverica", "veverica"], grupa: "je", dio: "je",
      sent: "Po granama skakuće riđa ___.",
      why: "Vjeverica se piše s je." },
    { ok: "medvjed", bad: ["medvijed", "medved"], grupa: "je", dio: "je",
      sent: "U šumskoj špilji spava smeđi ___.",
      why: "Medvjed se piše s je." },
    { ok: "djevojčica", bad: ["dijevojčica", "devojčica"], grupa: "je", dio: "je",
      sent: "___ crta cvijet u bilježnicu.",
      why: "Djevojčica ima je na početku i č u sredini." },
    { ok: "mjesto", bad: ["mijesto", "mesto"], grupa: "je", dio: "je",
      sent: "Vrati se na svoje ___ u klupi.",
      why: "Mjesto se piše s je." },
    { ok: "snjegović", bad: ["snijegović", "snegović"], grupa: "je", dio: "je",
      sent: "Od snijega smo napravili velikog ___a.",
      why: "Snijeg ima ije, ali snjegović ima je." },
    { ok: "sjeme", bad: ["sijeme", "seme"], grupa: "je", dio: "je",
      sent: "U zemlju smo posadili ___ suncokreta.",
      why: "Sjeme se piše s je." },
    { ok: "tjedan", bad: ["tijedan", "tedan"], grupa: "je", dio: "je",
      sent: "Jedan ___ ima sedam dana.",
      why: "Tjedan se piše s je." },
    { ok: "djed", bad: ["dijed", "ded"], grupa: "je", dio: "je",
      sent: "Moj ___ ima bijelu bradu.",
      why: "Djed se piše s je — kao i djeca." },
    { ok: "ljeto", bad: ["lijeto", "leto"], grupa: "je", dio: "je",
      sent: "Nakon proljeća dolazi vruće ___.",
      why: "Ljeto se piše s je, iza slova lj." },
    { ok: "proljeće", bad: ["prolijeće", "proleće"], grupa: "je", dio: "je",
      sent: "U ___ cvjetaju voćke.",
      why: "Proljeće se piše s je." },

    // --- č / ć ---
    { ok: "čokolada", bad: ["ćokolada", "cokolada"], grupa: "cc", dio: "č",
      sent: "Za desert smo pojeli slatku ___.",
      why: "Čokolada počinje glasom č." },
    { ok: "čarapa", bad: ["ćarapa", "carapa"], grupa: "cc", dio: "č",
      sent: "Obuci toplu vunenu ___.",
      why: "Čarapa počinje glasom č." },
    { ok: "mačka", bad: ["maćka", "macka"], grupa: "cc", dio: "č",
      sent: "___ vreba miša ispod stola.",
      why: "Mačka se piše s č." },
    { ok: "ključ", bad: ["kljuć", "kljuc"], grupa: "cc", dio: "č",
      sent: "Vrata otvaramo ___em.",
      why: "Ključ završava glasom č." },
    { ok: "učiteljica", bad: ["ućiteljica", "uciteljica"], grupa: "cc", dio: "č",
      sent: "Naša ___ čita priču.",
      why: "Učiteljica se piše s č." },
    { ok: "ručak", bad: ["rućak", "rucak"], grupa: "cc", dio: "č",
      sent: "U podne jedemo ___.",
      why: "Ručak se piše s č." },
    { ok: "četiri", bad: ["ćetiri", "cetiri"], grupa: "cc", dio: "č",
      sent: "Stol ima ___ noge.",
      why: "Četiri počinje glasom č." },
    { ok: "čitati", bad: ["ćitati", "citati"], grupa: "cc", dio: "č",
      sent: "U prvom razredu naučili smo ___.",
      why: "Čitati počinje glasom č." },
    { ok: "čizme", bad: ["ćizme", "cizme"], grupa: "cc", dio: "č",
      sent: "Kad pada kiša, obuci gumene ___.",
      why: "Čizme počinju glasom č." },
    // Napomena: „kolac“ je stvarna riječ (drveni štap), pa nije ponuđen kao
    // pogrešan zapis — dijete bi ga s pravom moglo smatrati točnim.
    { ok: "kolač", bad: ["kolać"], grupa: "cc", dio: "č",
      sent: "Baka je ispekla veliki ___.",
      why: "Kolač završava glasom č." },
    { ok: "čekić", bad: ["ćekić", "čekič"], grupa: "cc", dio: "č",
      sent: "Čavao zabijamo ___em.",
      why: "Čekić počinje s č, a završava s ć." },
    { ok: "kuća", bad: ["kuča"], grupa: "cc", dio: "ć",
      sent: "Naša ___ ima crveni krov.",
      why: "Kuća se piše s ć." },
    { ok: "voće", bad: ["voče"], grupa: "cc", dio: "ć",
      sent: "Jabuka, kruška i šljiva su ___.",
      why: "Voće se piše s ć — kao i cvijeće." },
    { ok: "noć", bad: ["noč"], grupa: "cc", dio: "ć",
      sent: "Poslije dana dolazi ___.",
      why: "Noć završava glasom ć." },
    { ok: "sreća", bad: ["sreča"], grupa: "cc", dio: "ć",
      sent: "Djetelina s četiri lista donosi ___u.",
      why: "Sreća se piše s ć." },
    { ok: "kći", bad: ["kči"], grupa: "cc", dio: "ć",
      sent: "Ana je mamina ___.",
      why: "Kći se piše s ć." },
    { ok: "ptičica", bad: ["ptićica", "pticica"], grupa: "cc", dio: "č",
      sent: "Na grani pjeva mala ___.",
      why: "Od riječi ptica nastaje ptičica — s č." },
    { ok: "cvjetić", bad: ["cvjetič", "cvijetić"], grupa: "cc", dio: "ć",
      sent: "U travi se skriva sitni ___.",
      why: "Umanjenice na -ić pišu se s ć: cvjetić, brodić, ključić." },

    // --- dž / đ ---
    { ok: "džem", bad: ["đem", "dzem"], grupa: "dzdj", dio: "dž",
      sent: "Na kruh smo namazali slatki ___.",
      why: "Džem počinje glasom dž — dva slova, jedan glas." },
    { ok: "džep", bad: ["đep", "dzep"], grupa: "dzdj", dio: "dž",
      sent: "Ključ mi je u ___u od hlača.",
      why: "Džep počinje glasom dž." },
    { ok: "džungla", bad: ["đungla", "dzungla"], grupa: "dzdj", dio: "dž",
      sent: "U ___i žive majmuni i papige.",
      why: "Džungla počinje glasom dž." },
    { ok: "patlidžan", bad: ["patliđan", "patlidzan"], grupa: "dzdj", dio: "dž",
      sent: "Ljubičasto povrće zove se ___.",
      why: "Patlidžan se piše s dž." },
    // „Džak“ je stvarna riječ (vreća) pa nije među ponudama; spominje se samo
    // u objašnjenju, kao razlika koju vrijedi zapamtiti.
    { ok: "đak", bad: ["dak", "dzak"], grupa: "dzdj", dio: "đ", bezPraznine: true,
      sent: "Svaki ___ nosi torbu u školu.",
      why: "Đak je učenik i piše se s đ. Džak je vreća — to je druga riječ!" },
    { ok: "đurđica", bad: ["džurdžica", "đurdica"], grupa: "dzdj", dio: "đ",
      sent: "U šumi u svibnju cvjeta bijela ___.",
      why: "Đurđica ima dva slova đ." },
    { ok: "rođak", bad: ["rodžak", "rodak"], grupa: "dzdj", dio: "đ",
      sent: "Na proslavu je došao moj ___.",
      why: "Rođak se piše s đ." },
    // „Leda“ je stvarna riječ (od led) — zato „leđja“ kao druga ponuda.
    { ok: "leđa", bad: ["ledža", "leđja"], grupa: "dzdj", dio: "đ", bezPraznine: true,
      sent: "Ruksak nosim na ___ima.",
      why: "Leđa se pišu s đ." },
    { ok: "žeđ", bad: ["žedž", "žed"], grupa: "dzdj", dio: "đ",
      sent: "Kad je vruće, imam veliku ___.",
      why: "Žeđ završava glasom đ." },
    { ok: "anđeo", bad: ["andžeo", "andeo"], grupa: "dzdj", dio: "đ",
      sent: "Na vrhu bora stoji ___.",
      why: "Anđeo se piše s đ." },

    // --- glas h, lj i nj ---
    { ok: "kruh", bad: ["kru", "kruv"], grupa: "ostalo",
      sent: "Za doručak jedemo svježi ___.",
      why: "Kruh na kraju ima glas h — izgovori ga jasno." },
    { ok: "hlače", bad: ["lače", "hlaće"], grupa: "ostalo",
      sent: "Obuci plave ___.",
      why: "Hlače počinju glasom h i imaju č." },
    { ok: "hrvatski", bad: ["rvatski", "hrvacki"], grupa: "ostalo",
      sent: "U školi učimo ___ jezik.",
      why: "Hrvatski počinje glasom h." },
    { ok: "hrabar", bad: ["rabar", "hrabaar"], grupa: "ostalo",
      sent: "Vitez u priči bio je jako ___.",
      why: "Hrabar počinje glasom h." },
    { ok: "njuška", bad: ["nuška", "njuvška"], grupa: "ostalo",
      sent: "Pas ima hladnu i mokru ___.",
      why: "Njuška počinje glasom nj — jedan glas, dva slova." },
    { ok: "ljubav", bad: ["lubav", "ljubaf"], grupa: "ostalo",
      sent: "Mama i tata daju nam puno ___i.",
      why: "Ljubav počinje glasom lj." }
  ];

  var GAP_CHOICES = {
    ije: ["ije", "je", "e"],
    je: ["je", "ije", "e"],
    cc: ["č", "ć", "c"],
    dzdj: ["dž", "đ", "ž"]
  };

  var pravopis = [];

  PRAVOPIS_RIJECI.forEach(function (entry, idx) {
    var key = "prav-" + idx;
    var choices = [entry.ok].concat(entry.bad);

    // 1) Kako se piše? (izolirana riječ)
    pravopis.push(
      mcq(
        key + "-pisi",
        "Koja je riječ napisana točno?",
        entry.ok,
        choices.slice(),
        entry.why,
        1
      )
    );

    // 2) Ista riječ u rečenici — pravopis u zadatku s riječima
    if (entry.sent) {
      pravopis.push(
        mcq(
          key + "-recenica",
          "Dopuni rečenicu točno napisanom riječi.",
          entry.ok,
          choices.slice(),
          entry.why,
          { kind: "text", text: entry.sent },
          2
        )
      );
    }

    // 3) Koje slovo/slova nedostaju
    var group = entry.bezPraznine ? null : GAP_CHOICES[entry.grupa];
    if (group && entry.dio && entry.ok.indexOf(entry.dio) !== -1) {
      var at = entry.ok.indexOf(entry.dio);
      var gap =
        entry.ok.slice(0, at) + "__" + entry.ok.slice(at + entry.dio.length);
      pravopis.push(
        mcq(
          key + "-slovo",
          "Što nedostaje u riječi „" + gap + "“?",
          entry.dio,
          group.slice(),
          "Točno je „" + entry.ok + "“. " + entry.why,
          { kind: "text", text: gap },
          2
        )
      );
    }

    // 4) Prepoznaj pogrešku — naizmjence pokaži točan i pogrešan zapis
    // da odgovor „Netočno“ nikad ne postane navika.
    if (idx % 2 === 0) {
      pravopis.push(
        tf(
          key + "-tocno",
          "Je li ovako napisano točno: „" + entry.bad[0] + "“?",
          false,
          "Nije — točno se piše „" + entry.ok + "“. " + entry.why,
          2
        )
      );
    } else {
      pravopis.push(
        tf(
          key + "-tocno",
          "Je li ovako napisano točno: „" + entry.ok + "“?",
          true,
          "Jest! " + entry.why,
          2
        )
      );
    }
  });

  // --- Pravilo: „ne“ uz glagol piše se odvojeno ---
  [
    ["Ne znam gdje mi je ključ.", "Neznam gdje mi je ključ.", "ne znam"],
    ["Ja ne volim gorku čokoladu.", "Ja nevolim gorku čokoladu.", "ne volim"],
    ["Danas ne mogu doći na igralište.", "Danas nemogu doći na igralište.", "ne mogu"],
    ["Ne želim se svađati s prijateljem.", "Neželim se svađati s prijateljem.", "ne želim"],
    ["Ne pišem po klupi.", "Nepišem po klupi.", "ne pišem"]
  ].forEach(function (row, i) {
    pravopis.push(
      mcq(
        "prav-ne-" + i,
        "Koja je rečenica napisana točno?",
        row[0],
        [row[0], row[1]],
        "Riječca „ne“ uz glagol piše se odvojeno: " + row[2] + ".",
        2
      )
    );
  });
  pravopis.push(
    tf(
      "prav-ne-pravilo",
      "Riječcu „ne“ uz glagol pišemo odvojeno (ne trčim, ne pjevam).",
      true,
      "Točno — „ne“ se odvaja od glagola.",
      1
    )
  );

  // --- Veliko početno slovo u imenima i mjestima ---
  [
    ["Ivana živi u Zagrebu.", "ivana živi u zagrebu.", "Imena ljudi i gradova pišu se velikim početnim slovom."],
    ["Moj prijatelj Marko ima psa Rexa.", "moj prijatelj marko ima psa rexa.", "Imena ljudi i životinja pišu se velikim slovom."],
    ["Ljeti idemo na more u Split.", "ljeti idemo na more u split.", "Split je ime grada — veliko slovo."],
    ["Rijeka Sava teče kroz Hrvatsku.", "rijeka sava teče kroz hrvatsku.", "Sava i Hrvatska su imena — veliko slovo."]
  ].forEach(function (row, i) {
    pravopis.push(
      mcq(
        "prav-veliko-" + i,
        "Koja je rečenica napisana točno?",
        row[0],
        [row[0], row[1]],
        row[2],
        2
      )
    );
  });

  // --- Spoji parove: ije ↔ je u istoj obitelji riječi ---
  pravopis.push(
    match(
      "prav-match-jat1",
      "Spoji riječ s njezinim parom.",
      [["cvijet", "cvjetovi"], ["dijete", "djeca"], ["snijeg", "snjegović"]],
      "U jednini ije, a u izvedenoj riječi je: cvijet–cvjetovi, dijete–djeca, snijeg–snjegović.",
      3
    )
  );
  pravopis.push(
    match(
      "prav-match-jat2",
      "Spoji riječ s njezinim parom.",
      [["mlijeko", "mliječni"], ["lijep", "ljepota"], ["riječ", "rječnik"]],
      "Mlijeko–mliječni, lijep–ljepota, riječ–rječnik.",
      3
    )
  );
  pravopis.push(
    match(
      "prav-match-glas",
      "Spoji riječ s glasom koji nedostaje.",
      [["ku__a (dom)", "ć"], ["__arapa", "č"], ["__em (namaz)", "dž"], ["__ak (učenik)", "đ"]],
      "Kuća – ć, čarapa – č, džem – dž, đak – đ.",
      3
    )
  );
  pravopis.push(
    match(
      "prav-match-um",
      "Spoji riječ s umanjenicom.",
      [["ključ", "ključić"], ["brod", "brodić"], ["cvijet", "cvjetić"]],
      "Umanjenice na -ić uvijek se pišu s ć.",
      3
    )
  );

  // --- Pravila za pamćenje ---
  [
    ["prav-pravilo-ije", "U riječi „cvijet“ pišemo ije, a u riječi „cvjetovi“ pišemo je.", true, "Točno — duga ije u jednini, kratka je u izvedenici."],
    ["prav-pravilo-ic", "Umanjenice na -ić (ključić, brodić) pišu se s ć.", true, "Točno — nastavak -ić uvijek ima ć."],
    ["prav-pravilo-dz", "Slova dž i đ označavaju dva različita glasa.", true, "Točno — dž je tvrđi (džem), a đ mekši (đak)."],
    ["prav-pravilo-djeca", "Riječ „djeca“ piše se s ije.", false, "Ne — piše se djeca, s je. S ije je samo dijete."],
    ["prav-pravilo-kuca", "Riječ „kuća“ piše se s č.", false, "Ne — kuća se piše s ć."],
    ["prav-pravilo-kruh", "Riječ „kruh“ na kraju ima glas h.", true, "Točno — kruh, a ne „kru“."]
  ].forEach(function (row) {
    pravopis.push(tf(row[0], row[1], row[2], row[3], 2));
  });

  // Dopuna: nedostajuće slovo u riječi (Profil — slova / riječi)
  var nedostaje = [];
  for (i = 0; i < words.length; i++) {
    w = words[i];
    if (w[0].length < 3) continue;
    if (i % 2 !== 0) continue;
    var mid = Math.floor(w[0].length / 2);
    var missing = w[0].charAt(mid);
    var blank =
      w[0].slice(0, mid) + "_" + w[0].slice(mid + 1);
    nedostaje.push(
      mcq(
        "miss-" + w[0],
        "Koje slovo nedostaje: „" + blank + "“?",
        missing,
        uniqChoices(
          missing,
          shuffleInPlace(
            MALA.slice().concat(SLOVA.map(function (s) {
              return s.toLowerCase();
            }))
          )
        ),
        "Riječ je „" + w[0] + "“ — nedostaje „" + missing + "“.",
        { kind: "text", text: blank },
        2
      )
    );
  }

  // Dopuna: upitna vs obična rečenica
  [
    ["Gdje je lopta?", "upitna", 1],
    ["Pas laje.", "obična", 1],
    ["Što radi Ana?", "upitna", 1],
    ["Sunce sja.", "obična", 1],
    ["Kada ideš u školu?", "upitna", 2],
    ["Mama peče kolač.", "obična", 1],
    ["Zašto kiša pada?", "upitna", 2],
    ["Djeca čitaju knjigu.", "obična", 1]
  ].forEach(function (row, idx) {
    recenica.push(
      mcq(
        "sent-type-" + idx,
        "Je li ovo obična ili upitna rečenica?\n\n„" + row[0] + "“",
        row[1],
        ["obična", "upitna"],
        row[1] === "upitna"
          ? "Završava upitnikom — upitna rečenica."
          : "Završava točkom — obična rečenica.",
        null,
        row[2]
      )
    );
  });

  // Dopuna: spoji početak i nastavak riječi (dvosložne)
  var spoji = [];
  for (i = 0; i < words.length; i++) {
    w = words[i];
    if (!w[4] || w[4].length !== 2) continue;
    var wrongEnds = words
      .filter(function (x) {
        return x[4] && x[4].length === 2 && x[0] !== w[0];
      })
      .map(function (x) {
        return x[4][1];
      });
    spoji.push(
      mcq(
        "pair-end-" + w[0],
        "Što ide uz „" + w[4][0] + "“ da nastane riječ?",
        w[4][1],
        uniqChoices(w[4][1], shuffleInPlace(wrongEnds.slice())),
        w[4][0] + " + " + w[4][1] + " = " + w[0] + ".",
        null,
        2
      )
    );
  }

  duljina = duljina.concat(nedostaje);
  slogSastavi = slogSastavi.concat(spoji);

  var hrvGames = [
    {
      id: "hrv-prvo-zadnje",
      title: "Prvo i zadnje slovo",
      emoji: "🔠",
      roundSize: 12,
      bank: prvoZadnje
    },
    {
      id: "hrv-duljina",
      title: "Broj slova",
      emoji: "🔢",
      roundSize: 10,
      bank: duljina
    },
    {
      id: "hrv-velika-mala",
      title: "Velika i mala slova",
      emoji: "🔤",
      roundSize: 12,
      bank: velikaMala
    },
    {
      id: "hrv-abeceda",
      title: "Abeceda",
      emoji: "🔠",
      roundSize: 12,
      bank: abeceda
    },
    {
      id: "hrv-slogovi",
      title: "Broj slogova",
      emoji: "🧩",
      roundSize: 12,
      bank: slogBroj
    },
    {
      id: "hrv-sastavi",
      title: "Sastavi riječ",
      emoji: "🧱",
      roundSize: 10,
      bank: slogSastavi
    },
    {
      id: "hrv-recenica",
      title: "Rečenica i pravopis",
      emoji: "✏️",
      roundSize: 10,
      bank: recenica
    },
    {
      id: "hrv-pravopis",
      title: "Pravopis",
      emoji: "🖋️",
      roundSize: 12,
      bank: pravopis
    },
    {
      id: "hrv-citanje",
      title: "Čitanje",
      emoji: "📚",
      roundSize: 10,
      bank: citanjeKratko
    },
    {
      id: "hrv-razumijevanje",
      title: "Razumijevanje",
      emoji: "🕵️",
      roundSize: 10,
      bank: razumijevanje
    }
  ];

  var ntGames =
    (global.CONTENT_NINA_TINO_HRV && global.CONTENT_NINA_TINO_HRV.games) || [];

  global.CONTENT_HRVATSKI = {
    id: "hrvatski",
    title: "Hrvatski",
    icon: "📖",
    blurb:
      "Potraga za blagom: stanice slova i čitanja + Nina i Tino (1. razred).",
    color: "hrv",
    games: hrvGames.concat(ntGames)
  };
})(window);
