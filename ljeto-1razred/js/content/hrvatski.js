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
    citanje.push(
      tf(
        "tf-cap-" + i,
        "Rečenica „" + sentences[i][0] + "“ počinje velikim slovom.",
        true,
        "Da — počinje s „" + sentences[i][1] + "“.",
        1
      )
    );
  }

  citanje.push(tf("tf-dot", "Na kraju rečenice stavljamo točku.", true, "Obična rečenica završava točkom.", 1));
  citanje.push(tf("tf-qmark", "Upitna rečenica završava upitnikom.", true, "Pitanje završava znakom ?.", 1));
  citanje.push(tf("tf-nospace", "Riječi pišemo jednu uz drugu bez razmaka.", false, "Između riječi ide razmak.", 1));
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
