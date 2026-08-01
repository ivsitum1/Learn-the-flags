(function (global) {
  "use strict";

  function mcq(id, prompt, answer, choices, explain, diff, hint) {
    return {
      id: id,
      type: "mcq",
      prompt: prompt,
      answer: answer,
      choices: choices,
      explain: explain || ("Točno je „" + answer + "“."),
      diff: diff == null ? 2 : diff,
      hint: hint || null
    };
  }

  function tf(id, prompt, answer, explain, diff, hint) {
    return {
      id: id,
      type: "truefalse",
      prompt: prompt,
      answer: answer ? "Točno" : "Netočno",
      choices: ["Točno", "Netočno"],
      explain: explain,
      diff: diff == null ? 2 : diff,
      hint: hint || null
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

  var bank = [
    /* ===== MATEMATIKA (do 100) ===== */
    mcq(
      "gus-m-01",
      "Gusar je na brodu našao 34 zlatnika, a u škrinji još 25. Koliko ih je ukupno?",
      "59",
      uniqChoices("59", ["54", "59", "69", "49"]),
      "34 + 25 = 59 zlatnika.",
      2,
      "Zbroji desetice pa jedinice: 30+20, pa 4+5."
    ),
    mcq(
      "gus-m-02",
      "U koferu je bilo 72 žetona. Gusar je potrošio 38. Koliko je ostalo?",
      "34",
      uniqChoices("34", ["34", "44", "110", "30"]),
      "72 − 38 = 34 žetona.",
      2,
      "Oduzmi desetice: 72 − 30 = 42, pa još 8."
    ),
    mcq(
      "gus-m-03",
      "47 + 28 = ?",
      "75",
      uniqChoices("75", ["65", "75", "85", "70"]),
      "47 + 28 = 75.",
      2,
      "40 + 20 = 60, pa 7 + 8 = 15; 60 + 15 = 75."
    ),
    mcq(
      "gus-m-04",
      "85 − 29 = ?",
      "56",
      uniqChoices("56", ["66", "56", "54", "76"]),
      "85 − 29 = 56.",
      3,
      "85 − 30 = 55, pa dodaj 1 jer si oduzeo previše."
    ),
    mcq(
      "gus-m-05",
      "Koliko je 56 + 44?",
      "100",
      uniqChoices("100", ["90", "100", "110", "98"]),
      "56 + 44 = 100.",
      2,
      "56 + 40 = 96, pa +4."
    ),
    mcq(
      "gus-m-06",
      "Na karti piše „100 koraka do blaga“. Već si prošao 63. Koliko koraka još?",
      "37",
      uniqChoices("37", ["47", "37", "163", "27"]),
      "100 − 63 = 37 koraka.",
      3,
      "Do 100 od 63 nedostaje manje od 40."
    ),
    mcq(
      "gus-m-07",
      "38 + 51 = ?",
      "89",
      uniqChoices("89", ["79", "89", "99", "88"]),
      "38 + 51 = 89.",
      2,
      "30 + 50 = 80, pa 8 + 1."
    ),
    mcq(
      "gus-m-08",
      "91 − 47 = ?",
      "44",
      uniqChoices("44", ["54", "44", "34", "48"]),
      "91 − 47 = 44.",
      3,
      "91 − 40 = 51, pa −7."
    ),
    mcq(
      "gus-m-09",
      "Koji znak stoji između 67 i 72?",
      "<",
      ["<", "=", ">"],
      "67 je manje od 72, zato <.",
      2,
      "67 dolazi prije 72 na brojčanoj crti."
    ),
    mcq(
      "gus-m-10",
      "Koji je veći broj: 58 ili 85?",
      "85",
      uniqChoices("85", ["58", "85", "jednaki", "43"]),
      "85 je veći od 58.",
      2,
      "85 ima više desetica od 58."
    ),
    mcq(
      "gus-m-11",
      "29 + 36 = ?",
      "65",
      uniqChoices("65", ["55", "65", "75", "59"]),
      "29 + 36 = 65.",
      2,
      "30 + 36 = 66, pa −1."
    ),
    mcq(
      "gus-m-12",
      "80 − 25 = ?",
      "55",
      uniqChoices("55", ["65", "55", "45", "105"]),
      "80 − 25 = 55.",
      2,
      "80 − 20 = 60, pa −5."
    ),
    mcq(
      "gus-m-13",
      "Koji broj nedostaje: 42, 52, ?, 72?",
      "62",
      uniqChoices("62", ["60", "62", "64", "72"]),
      "Niz raste po 10: 42, 52, 62, 72.",
      2,
      "Svaki sljedeći broj je za 10 veći."
    ),
    mcq(
      "gus-m-14",
      "U sanduku je 53 biser, u vreći 47. Koliko bisera ukupno?",
      "100",
      uniqChoices("100", ["90", "100", "110", "94"]),
      "53 + 47 = 100 bisera.",
      3,
      "50 + 47 = 97, pa +3."
    ),

    /* ===== HRVATSKI (Trag u priči 2) ===== */
    mcq(
      "gus-hr-01",
      "Pročitaj:\n\nMara i Luka su pronašli staru kartu u potkrovlju. Na njoj je bio crtež otoka i crveni X. Odlučili su krenuti u potragu već sutra ujutro. Mama im je dala sendviče i bocu vode.\n\nŠto su djeca pronašla u potkrovlju?",
      "kartu",
      uniqChoices("kartu", ["ključ", "kartu", "novac", "igračku"]),
      "U tekstu piše da su pronašli staru kartu.",
      2,
      "Prva rečenica otkriva predmet potrage."
    ),
    mcq(
      "gus-hr-02",
      "Pročitaj:\n\nGusari su plovili Jadranskim morem. Sunce je bilo jarko, a more plavo. Posada je pjevala pjesme dok je brod lagano njihao. Uvečer su sidrili kod malog otoka.\n\nGdje su gusari sidrili?",
      "kod malog otoka",
      uniqChoices("kod malog otoka", ["u luci Zagreba", "kod malog otoka", "u rijeci", "u planinama"]),
      "Posljednja rečenica kaže da su sidrili kod malog otoka.",
      3,
      "Pročitaj zadnju rečenicu ove kratke priče."
    ),
    mcq(
      "gus-hr-03",
      "Koja rečenica je napisana ispravno?",
      "Ana ide u školu.",
      ["ana ide u školu.", "Ana ide u školu.", "Ana Ide u školu.", "ana Ide u školu."],
      "Ime Ana i početak rečenice pišu se velikim početnim slovom.",
      2,
      "Imena i prva riječ rečenice imaju veliko slovo."
    ),
    mcq(
      "gus-hr-04",
      "Koji znak stoji na kraju pitanja: „Gdje je blago“?",
      "?",
      [".", "!", "?", ","],
      "Pitanje završava upitnikom (?).",
      2,
      "Rečenica počinje s „Gdje“ — traži odgovor."
    ),
    mcq(
      "gus-hr-05",
      "Pročitaj:\n\nMarko je svaki dan čitao po dvadeset minuta. Knjiga mu se svidjela jer je bila o moreplovcima. Jednog dana je došao do stranice na kojoj je opisan olujni dan na moru.\n\nO čemu je knjiga?",
      "o moreplovcima",
      uniqChoices("o moreplovcima", ["o dinosaurusima", "o moreplovcima", "o kuhanju", "o nogometu"]),
      "U tekstu piše da je knjiga bila o moreplovcima.",
      2,
      "Druga rečenica kaže o čemu je knjiga."
    ),
    mcq(
      "gus-hr-06",
      "Pročitaj:\n\nNa stolu su ležali kompas, svjetiljka i stara knjiga. Oko stola su sjele mačke i gledale u svjetlo. Vjetar je stucao kroz otvoreni prozor.\n\nKoje je od navedenog predmet na stolu?",
      "kompas",
      uniqChoices("kompas", ["bicikl", "kompas", "avion", "autobus"]),
      "Kompas je naveden među predmetima na stolu.",
      2,
      "Prva rečenica nabrojava predmete na stolu."
    ),
    tf(
      "gus-hr-07",
      "Pročitaj:\n\n„Brzo!“ je viknula Sara. „Oluja dolazi!“\n\nJe li ovo usklik?",
      true,
      "„Brzo!“ i „Oluja dolazi!“ su usklik — završavaju uskličnikom.",
      2,
      "Usklici izražavaju snažan osjećaj i često imaju !."
    ),
    mcq(
      "gus-hr-08",
      "Koja riječ treba veliko početno slovo?",
      "Hrvatska",
      uniqChoices("Hrvatska", ["more", "sunce", "Hrvatska", "brod"]),
      "Imena država pišu se velikim početnim slovom: Hrvatska.",
      2,
      "Imena posebnih zemljopisnih naziva imaju veliko slovo."
    ),
    mcq(
      "gus-hr-09",
      "Pročitaj:\n\nTino je bio tužan jer je izgubio crvenu kapelu. Nina mu je pomogla tražiti po cijelom dvorištu. Kapa je bila ispod klupice kod sandboxa.\n\nTko je pomogao Tinu?",
      "Nina",
      uniqChoices("Nina", ["Marko", "Nina", "učitelj", "pas"]),
      "U tekstu piše: Nina mu je pomogla tražiti.",
      2,
      "Potraži rečenicu u kojoj netko pomaže Tinu."
    ),
    mcq(
      "gus-hr-10",
      "Koji znak stoji na kraju: „Pronašli smo blago“?",
      ".",
      [".", "?", "!", ","],
      "Obična izjava završava točkom (.).",
      2,
      "Ovo nije pitanje ni usklik."
    ),
    mcq(
      "gus-hr-11",
      "Pročitaj:\n\nJutros je bilo vedro. Djeca su nosila kape i naočale za sunce. Poslijepodne se pojavile male oblake, ali kiše nije bilo.\n\nKakvo je vrijeme bilo jutros?",
      "vedro",
      uniqChoices("vedro", ["snježno", "vedro", "oluja", "maglovito"]),
      "Prva rečenica kaže da je jutros bilo vedro.",
      2,
      "Prva rečenica opisuje jutarnje vrijeme."
    ),
    mcq(
      "gus-hr-12",
      "Pročitaj:\n\nKapetan je naredio posadu da spusti jedra. Brod se polako kretao prema istoku. Svi su gledali u horizont.\n\nPrema kojoj strani svijeta brod ide?",
      "istok",
      uniqChoices("istok", ["zapad", "istok", "sjever", "jug"]),
      "U tekstu piše: prema istoku.",
      3,
      "Potraži riječ koja označava stranu svijeta."
    ),

    /* ===== PRIRODA I DRUŠTVO (Pogled u svijet 2) ===== */
    mcq(
      "gus-pid-01",
      "Sunce izlazi na strani svijeta koja se zove:",
      "istok",
      uniqChoices("istok", ["zapad", "istok", "sjever", "jug"]),
      "Sunce izlazi na istoku.",
      2,
      "Ujutro gledamo prema strani gdje sunce dolazi."
    ),
    mcq(
      "gus-pid-02",
      "Na karti je gore obično označeno:",
      "sjever",
      uniqChoices("sjever", ["jug", "sjever", "istok", "zapad"]),
      "Na karti je sjever (S) obično gore.",
      2,
      "Gornji rub karte = S."
    ),
    mcq(
      "gus-pid-03",
      "Avion je prijevoz:",
      "zračni",
      uniqChoices("zračni", ["zračni", "vodeni", "kopneni", "podzemni"]),
      "Avion leti — to je zračni prijevoz.",
      2,
      "Avion kreće se kroz zrak."
    ),
    mcq(
      "gus-pid-04",
      "Brod je prijevoz:",
      "vodeni",
      uniqChoices("vodeni", ["kopneni", "vodeni", "zračni", "skijski"]),
      "Brod plovi po moru ili rijeci — vodeni prijevoz.",
      2,
      "Brod ide po vodi."
    ),
    mcq(
      "gus-pid-05",
      "Autobus je prijevoz:",
      "kopneni",
      uniqChoices("kopneni", ["zračni", "vodeni", "kopneni", "svemirski"]),
      "Autobus vozi cestom — kopneni prijevoz.",
      2,
      "Autobus ide cestom, ne po vodi ni zraku."
    ),
    mcq(
      "gus-pid-06",
      "Glavni grad Hrvatske je:",
      "Zagreb",
      uniqChoices("Zagreb", ["Split", "Zagreb", "Rijeka", "Dubrovnik"]),
      "Glavni grad Hrvatske je Zagreb.",
      2,
      "Zagreb je glavni grad naše države."
    ),
    mcq(
      "gus-pid-07",
      "Hrvatska leži uz:",
      "Jadransko more",
      uniqChoices("Jadransko more", ["Crno more", "Jadransko more", "Sjeverno more", "Indijski ocean"]),
      "Hrvatska ima obalu na Jadranskom moru.",
      2,
      "Naše more uz obalu zove se Jadransko."
    ),
    mcq(
      "gus-pid-08",
      "Na crtežu: škola je 2 ulice od kuće, a park 5 ulica. Što je bliže kući?",
      "škola",
      uniqChoices("škola", ["park", "škola", "jednako daleko", "trgovina"]),
      "2 ulice je manje od 5 — škola je bliže.",
      2,
      "Manji broj ulica znači manju udaljenost."
    ),
    mcq(
      "gus-pid-09",
      "Suprotno od sjevera je:",
      "jug",
      uniqChoices("jug", ["istok", "jug", "zapad", "sjever"]),
      "Suprotno od sjevera (S) je jug (J).",
      2,
      "Na karti: gore S, dolje J."
    ),
    mcq(
      "gus-pid-10",
      "Vlak je prijevoz:",
      "kopneni",
      uniqChoices("kopneni", ["vodeni", "kopneni", "zračni", "podvodni"]),
      "Vlak vozi po tračnicama na kopnu.",
      2,
      "Vlak ide po željezničkim prugama."
    ),
    mcq(
      "gus-pid-11",
      "Sunce zalazi na:",
      "zapadu",
      uniqChoices("zapadu", ["istoku", "zapadu", "sjeveru", "jugu"]),
      "Sunce zalazi na zapadu.",
      2,
      "Uvečer sunce nestaje na zapadnoj strani."
    ),
    mcq(
      "gus-pid-12",
      "Na planu grada: trgovina je odmah pored trga, a bolnica tri ulice dalje. Što je bliže trgu?",
      "trgovina",
      uniqChoices("trgovina", ["bolnica", "trgovina", "aerodrom", "jednako"]),
      "Trgovina je odmah pored — bliže je od bolnice.",
      3,
      "„Odmah pored“ znači vrlo blizu."
    )
  ];

  global.CONTENT_GUSARSKI = {
    id: "gusarski",
    title: "Skriveni gusarski otok",
    icon: "🏴‍☠️",
    blurb: "Most prema 2. razredu — matematika, hrvatski i priroda zajedno.",
    color: "gus",
    games: [
      {
        id: "gus-otok",
        title: "Skriveni gusarski otok",
        emoji: "🏴‍☠️",
        roundSize: 12,
        bank: bank,
        allowHint: true
      }
    ]
  };
})(window);
