(function (global) {
  "use strict";

  function mcq(prompt, answer, choices, explain, visual) {
    return {
      type: "mcq",
      prompt: prompt,
      answer: answer,
      choices: choices,
      explain: explain || ("Točno je „" + answer + "“."),
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
      explain: explain || ("Redoslijed: " + answer.join(" "))
    };
  }

  var ABECEDA = "ABCČĆDDŽEFGHIJKLLJMNNjOPRSŠTUVZŽ".split("");
  // Simpler letter list for grade 1 without digraphs complexity in order games
  var SLOVA = ["A", "B", "C", "Č", "Ć", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "R", "S", "Š", "T", "U", "V", "Z", "Ž"];

  var slova = [];
  var wordFirst = [
    ["mama", "M"], ["tata", "T"], ["auto", "A"], ["šuma", "Š"], ["riba", "R"],
    ["kuća", "K"], ["pas", "P"], ["cvijet", "C"], ["jabuka", "J"], ["olovka", "O"],
    ["sunce", "S"], ["voda", "V"], ["zebra", "Z"], ["brod", "B"], ["lav", "L"]
  ];
  wordFirst.forEach(function (w) {
    var wrong = SLOVA.filter(function (s) { return s !== w[1]; });
    var choices = [w[1], wrong[3], wrong[8], wrong[12]];
    slova.push(mcq(
      "Koje je prvo slovo riječi „" + w[0] + "“?",
      w[1],
      choices,
      "Riječ „" + w[0] + "“ počinje slovom " + w[1] + ".",
      { kind: "text", text: w[0] }
    ));
  });

  var pairsCase = [
    ["A", "a"], ["B", "b"], ["M", "m"], ["S", "s"], ["Š", "š"],
    ["Ž", "ž"], ["Č", "č"], ["Ć", "ć"], ["D", "d"], ["N", "n"]
  ];
  pairsCase.forEach(function (p) {
    slova.push(mcq(
      "Koje je malo slovo za " + p[0] + "?",
      p[1],
      [p[1], "x", "q", p[0].toLowerCase() === p[1] ? "w" : p[0]],
      "Veliko " + p[0] + " → malo " + p[1] + "."
    ));
  });

  slova.push(order("Poredaj slova abecednim redom.", ["A", "B", "C"], "A, pa B, pa C."));
  slova.push(order("Poredaj slova abecednim redom.", ["M", "N", "O"], "M, pa N, pa O."));
  slova.push(order("Poredaj slova abecednim redom.", ["R", "S", "T"], "R, pa S, pa T."));
  slova.push(tf("Slovo A je prvo slovo hrvatske abecede.", true, "Abeceda počinje slovom A."));
  slova.push(tf("Slovo Ž dolazi prije slova A.", false, "Ž je pri kraju abecede."));
  slova.push(mcq("Koliko slova ima riječ „pas“?", 3, [2, 3, 4, 5], "p-a-s → 3 slova."));
  slova.push(mcq("Koliko slova ima riječ „mama“?", 4, [2, 3, 4, 5], "m-a-m-a → 4 slova."));
  slova.push(mcq("Koje slovo dolazi poslije B?", "C", ["A", "C", "D", "E"], "Red: A B C…"));
  slova.push(mcq("Koje slovo dolazi prije M?", "L", ["K", "L", "N", "O"], "Prije M ide L."));

  var slogovi = [];
  var syllableWords = [
    ["ma-ma", 2, "mama"], ["ta-ta", 2, "tata"], ["ku-ća", 2, "kuća"],
    ["olovka", 3, "o-lov-ka"], ["jabuka", 3, "ja-bu-ka"], ["pas", 1, "pas"],
    ["sun-ce", 2, "sunce"], ["či-ko", 2, "čiko"], ["školska", 3, "škol-ska"],
    ["vo-da", 2, "voda"], ["cvijet", 2, "cvijet"], ["prijatelj", 3, "pri-ja-telj"],
    ["auto", 2, "au-to"], ["riba", 2, "ri-ba"], ["zebra", 2, "ze-bra"]
  ];
  // Fix: use clear syllable counts
  var syl = [
    ["mama", 2], ["tata", 2], ["pas", 1], ["kuća", 2], ["voda", 2],
    ["sunce", 2], ["jabuka", 3], ["olovka", 3], ["auto", 2], ["riba", 2],
    ["lav", 1], ["brod", 1], ["šuma", 2], ["ptica", 2], ["cvijet", 2],
    ["škola", 2], ["dijete", 3], ["učiteljica", 5], ["stol", 1], ["prozor", 2]
  ];
  syl.forEach(function (w) {
    slogovi.push(mcq(
      "Koliko slogova ima riječ „" + w[0] + "“?",
      w[1],
      [w[1] - 1 < 1 ? w[1] + 2 : w[1] - 1, w[1], w[1] + 1, w[1] + 2],
      "Riječ „" + w[0] + "“ ima " + w[1] + " sloga/slogova.",
      { kind: "text", text: w[0] }
    ));
  });

  slogovi.push(mcq("Što dobiješ ako spojiš „ma“ + „ma“?", "mama", ["tata", "mama", "pas", "auto"], "ma + ma = mama."));
  slogovi.push(mcq("Što dobiješ ako spojiš „ku“ + „ća“?", "kuća", ["kuća", "kuca", "uka", "ćaku"], "ku + ća = kuća."));
  slogovi.push(mcq("Što dobiješ ako spojiš „ri“ + „ba“?", "riba", ["bari", "riba", "ira", "bra"], "ri + ba = riba."));
  slogovi.push(mcq("Što dobiješ ako spojiš „ta“ + „ta“?", "tata", ["mama", "tata", "pas", "auto"], "ta + ta = tata."));
  slogovi.push(order("Složi slogove u riječ „sunce“.", ["sun", "ce"], "sun + ce = sunce."));
  slogovi.push(order("Složi slogove u riječ „voda“.", ["vo", "da"], "vo + da = voda."));
  slogovi.push(order("Složi slogove u riječ „škola“.", ["ško", "la"], "ško + la = škola."));
  slogovi.push(tf("Riječ „pas“ ima jedan slog.", true, "pas — jedan slog."));
  slogovi.push(tf("Riječ „jabuka“ ima dva sloga.", false, "ja-bu-ka — tri sloga."));
  slogovi.push(mcq("Koja riječ ima 3 sloga?", "jabuka", ["pas", "mama", "jabuka", "lav"], "ja-bu-ka."));
  slogovi.push(mcq("Koja riječ ima 1 slog?", "stol", ["mama", "voda", "stol", "riba"], "stol — 1 slog."));
  slogovi.push({
    type: "match",
    prompt: "Spoji riječ i broj slogova.",
    pairs: [["pas", "1"], ["mama", "2"], ["jabuka", "3"]],
    explain: "pas 1, mama 2, jabuka 3."
  });

  var citanje = [];
  var passages = [
    {
      text: "Ana ima psa. Pas se zove Cuki. Cuki voli trčati.",
      q: "Kako se zove Anin pas?",
      a: "Cuki",
      choices: ["Miki", "Cuki", "Luki", "Buki"]
    },
    {
      text: "Ivan ide u školu. U torbi ima knjigu i olovku.",
      q: "Što Ivan ima u torbi?",
      a: "knjigu i olovku",
      choices: ["lopticu", "knjigu i olovku", "jabuku", "ništa"]
    },
    {
      text: "Sunce sja. Djeca se igraju u parku.",
      q: "Gdje se djeca igraju?",
      a: "u parku",
      choices: ["u školi", "u parku", "kod kuće", "u moru"]
    },
    {
      text: "Mama peče kolač. Miris je fin.",
      q: "Što mama peče?",
      a: "kolač",
      choices: ["kruh", "kolač", "juhu", "meso"]
    },
    {
      text: "Na stolu stoji crvena jabuka.",
      q: "Koje je boje jabuka?",
      a: "crvena",
      choices: ["zelena", "žuta", "crvena", "plava"]
    },
    {
      text: "Marko čita knjigu. Knjiga je o lavovima.",
      q: "O čemu je knjiga?",
      a: "o lavovima",
      choices: ["o psima", "o lavovima", "o školama", "o autima"]
    },
    {
      text: "Kiša pada. Mia uzima kišobran.",
      q: "Što Mia uzima?",
      a: "kišobran",
      choices: ["kapu", "kišobran", "lopticu", "knjigu"]
    },
    {
      text: "U vrtu raste cvijet. Cvijet je žut.",
      q: "Gdje raste cvijet?",
      a: "u vrtu",
      choices: ["u šumi", "u vrtu", "u moru", "u školi"]
    },
    {
      text: "Tata vozi auto. Ide na posao.",
      q: "Kamo tata ide?",
      a: "na posao",
      choices: ["u park", "na posao", "u školu", "na more"]
    },
    {
      text: "Noću se vidi mjesec. Mjesec sja.",
      q: "Kada se vidi mjesec u priči?",
      a: "noću",
      choices: ["ujutro", "noću", "podne", "uvijek"]
    },
    {
      text: "Pčela leti. Traži cvijet.",
      q: "Što pčela traži?",
      a: "cvijet",
      choices: ["med", "cvijet", "drvo", "vodu"]
    },
    {
      text: "Luka crta. Crta plavu kuću.",
      q: "Koje je boje kuća?",
      a: "plava",
      choices: ["crvena", "plava", "zelena", "žuta"]
    },
    {
      text: "U jezeru pliva riba. Riba je mala.",
      q: "Gdje pliva riba?",
      a: "u jezeru",
      choices: ["u moru", "u jezeru", "u čaši", "u zraku"]
    },
    {
      text: "Baka peva. Djed sluša.",
      q: "Tko peva?",
      a: "baka",
      choices: ["djed", "baka", "mama", "tata"]
    },
    {
      text: "Ema pije mlijeko. Mlijeko je toplo.",
      q: "Što Ema pije?",
      a: "mlijeko",
      choices: ["vodu", "sok", "mlijeko", "čaj"]
    },
    {
      text: "Pas laje. Mačka bježi.",
      q: "Tko laje?",
      a: "pas",
      choices: ["mačka", "pas", "ptica", "lav"]
    },
    {
      text: "Na nebu su oblaci. Oblaci su bijeli.",
      q: "Koje su boje oblaci?",
      a: "bijeli",
      choices: ["crni", "bijeli", "plavi", "crveni"]
    },
    {
      text: "Škola počinje. Djeca sjede u klupi.",
      q: "Gdje sjede djeca?",
      a: "u klupi",
      choices: ["u parku", "u klupi", "u autu", "kod kuće"]
    },
    {
      text: "Zima je. Pada snijeg.",
      q: "Koje je godišnje doba?",
      a: "zima",
      choices: ["ljeto", "proljeće", "jesen", "zima"]
    },
    {
      text: "Petar jede krušku. Kruška je slatka.",
      q: "Što Petar jede?",
      a: "krušku",
      choices: ["jabuku", "krušku", "kruh", "sir"]
    },
    {
      text: "U knjižnici je tišina. Djeca čitaju.",
      q: "Što djeca rade?",
      a: "čitaju",
      choices: ["trče", "čitaju", "viču", "spavaju"]
    },
    {
      text: "More je plavo. Valovi su veliki.",
      q: "Koje je boje more?",
      a: "plavo",
      choices: ["zeleno", "plavo", "crveno", "žuto"]
    },
    {
      text: "Mama kaže: „Dobar dan!“",
      q: "Što mama kaže?",
      a: "Dobar dan!",
      choices: ["Laku noć!", "Dobar dan!", "Bok!", "Hvala!"]
    },
    {
      text: "Iva piše slovo A. Piše pažljivo.",
      q: "Koje slovo Iva piše?",
      a: "A",
      choices: ["B", "A", "M", "S"]
    },
    {
      text: "U šumi živi jelen. Jelen ima rogove.",
      q: "Što jelen ima?",
      a: "rogove",
      choices: ["krila", "rogove", "peraje", "kljun"]
    }
  ];
  passages.forEach(function (p) {
    citanje.push({
      type: "mcq",
      prompt: p.text + "\n\n" + p.q,
      answer: p.a,
      choices: p.choices,
      explain: "Točan odgovor: " + p.a + "."
    });
  });
  citanje.push(tf("Na početku rečenice pišemo veliko slovo.", true, "Rečenica počinje velikim slovom."));
  citanje.push(tf("Na kraju rečenice stavljamo točku.", true, "Obična rečenica završava točkom."));
  citanje.push(tf("Riječi u rečenici pišemo bez razmaka.", false, "Između riječi ide razmak."));

  global.CONTENT_HRVATSKI = {
    id: "hrvatski",
    title: "Hrvatski",
    icon: "📖",
    blurb: "Slova, slogovi i kratko čitanje s razumijevanjem.",
    color: "hrv",
    games: [
      {
        id: "hrv-slova",
        title: "Slova i abeceda",
        emoji: "🔤",
        desc: "Prvo slovo, velika i mala slova, red u abecedi.",
        roundSize: 10,
        bank: slova
      },
      {
        id: "hrv-slogovi",
        title: "Slogovi i riječi",
        emoji: "🧩",
        desc: "Broji slogove i sastavljaj jednostavne riječi.",
        roundSize: 10,
        bank: slogovi
      },
      {
        id: "hrv-citanje",
        title: "Čitanje",
        emoji: "📚",
        desc: "Pročitaj kratku priču i odgovori na pitanje.",
        roundSize: 8,
        bank: citanje
      }
    ]
  };
})(window);
