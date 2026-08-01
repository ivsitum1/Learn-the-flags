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

  function shuffleCopy(arr) {
    var a = arr.slice();
    var i;
    for (i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  var seasons = ["proljeće", "ljeto", "jesen", "zima"];
  var months = [
    ["siječanj", "zima"],
    ["veljača", "zima"],
    ["ožujak", "proljeće"],
    ["travanj", "proljeće"],
    ["svibanj", "proljeće"],
    ["lipanj", "ljeto"],
    ["srpanj", "ljeto"],
    ["kolovoz", "ljeto"],
    ["rujan", "jesen"],
    ["listopad", "jesen"],
    ["studeni", "jesen"],
    ["prosinac", "zima"]
  ];

  /* ===================== GODIŠNJA DOBA ===================== */
  var godisnja = [];
  var i, j, m;

  godisnja.push(order("ord-seasons", "Poredaj godišnja doba kako idu u godini (od proljeća).", seasons.slice(), "proljeće → ljeto → jesen → zima"));

  for (i = 0; i < months.length; i++) {
    m = months[i];
    godisnja.push(
      mcq(
        "month-" + m[0],
        "U koje godišnje doba spada " + m[0] + "?",
        m[1],
        seasons.slice(),
        m[0] + " je u dobu: " + m[1] + "."
      )
    );
    godisnja.push(
      tf(
        "tf-month-" + m[0] + "-" + m[1],
        m[0].charAt(0).toUpperCase() + m[0].slice(1) + " je u " + m[1] + ".",
        true,
        "Točno."
      )
    );
    seasons.forEach(function (s) {
      if (s === m[1]) return;
      godisnja.push(
        tf(
          "tf-month-wrong-" + m[0] + "-" + s,
          m[0].charAt(0).toUpperCase() + m[0].slice(1) + " je u " + s + ".",
          false,
          "Netočno: " + m[0] + " je u " + m[1] + "."
        )
      );
    });
  }

  var seasonFacts = [
    ["zima", "Kad najčešće pada snijeg?", "Snijeg obično pada zimi."],
    ["ljeto", "Kad je najtoplije?", "Ljeto je najtoplije godišnje doba."],
    ["jesen", "Kad lišće pada s drveća?", "U jesen lišće žuti i pada."],
    ["proljeće", "Kad cvjetaju mnogi cvjetovi?", "Proljeće je doba cvjetanja."]
  ];
  seasonFacts.forEach(function (row, idx) {
    godisnja.push(mcq("fact-" + idx, row[1], row[0], seasons.slice(), row[2]));
  });

  var clothes = [
    ["zima", "kapu i jaknu", ["kratke hlače", "kapu i jaknu", "sandale", "majicu bez rukava"]],
    ["ljeto", "kratke hlače", ["kaput", "čizme", "kratke hlače", "vunene rukavice"]],
    ["jesen", "jaknu ili kaputić", ["kupaći kostim", "jaknu ili kaputić", "samo majicu", "sandale uvijek"]],
    ["proljeće", "lakšu jaknu", ["tešku bundu", "lakšu jaknu", "skijaško odijelo", "rukavice od vune uvijek"]]
  ];
  clothes.forEach(function (row) {
    godisnja.push(
      mcq("clothes-" + row[0], "Što obično nosimo u " + row[0] + "?", row[1], row[2], "U " + row[0] + " se oblačimo prikladno vremenu.")
    );
  });

  [
    ["❄️", "zima"],
    ["☀️", "ljeto"],
    ["🍂", "jesen"],
    ["🌸", "proljeće"],
    ["⛄", "zima"],
    ["🌻", "ljeto"],
    ["🍁", "jesen"],
    ["🌼", "proljeće"]
  ].forEach(function (row, idx) {
    godisnja.push(
      mcq(
        "emoji-" + idx,
        "Koje godišnje doba podsjeća ovaj znak?",
        row[1],
        seasons.slice(),
        "Znak " + row[0] + " povezujemo s " + row[1] + ".",
        { kind: "text", text: row[0] }
      )
    );
  });

  for (i = 0; i < seasons.length; i++) {
    for (j = 0; j < seasons.length; j++) {
      if (i === j) continue;
      var nextOk = (i + 1) % 4 === j;
      godisnja.push(
        tf(
          "tf-next-" + seasons[i] + "-" + seasons[j],
          seasons[j].charAt(0).toUpperCase() + seasons[j].slice(1) + " dolazi odmah poslije " + seasons[i] + ".",
          nextOk,
          nextOk
            ? "Da: poslije " + seasons[i] + " ide " + seasons[j] + "."
            : "Ne: poslije " + seasons[i] + " ide " + seasons[(i + 1) % 4] + "."
        )
      );
    }
  }

  var weather = [
    ["kišobran", "Što treba za kišni dan?", ["sunčane naočale", "kišobran", "kupaći kostim", "ventilator"]],
    ["vedro i toplo", "Što najbolje opisuje sunčan dan?", ["magla i snijeg", "vedro i toplo", "led i mraz", "noć bez zvijezda"]],
    ["stavimo kremu / šešir", "Što radimo da se zaštitimo od sunca ljeti?", ["jedemo snijeg", "stavimo kremu / šešir", "gasimo grijanje", "nosimo čizme"]],
    ["miče zrak", "Što vjetar radi?", ["zaustavlja kišu", "miče zrak", "gasi sunce", "pravi snijeg sam"]]
  ];
  weather.forEach(function (row, idx) {
    godisnja.push(mcq("weather-" + idx, row[1], row[0], row[2], "Točan odgovor: " + row[0] + "."));
  });

  godisnja.push(tf("tf-clouds", "Oblaci mogu donijeti kišu.", true, "Iz oblaka može pasti kiša."));
  godisnja.push(tf("tf-snow-always", "Zimi uvijek mora biti snijeg.", false, "Zima može biti hladna i bez snijega."));
  godisnja.push(tf("tf-autumn-cold", "U jesen dani postaju kraći i hladniji.", true, "Jesen je prijelaz prema zimi."));
  godisnja.push(tf("tf-summer-hot", "Ljeto je najtoplije godišnje doba.", true, "Da."));
  godisnja.push(tf("tf-winter-hot", "Zima je najtoplije godišnje doba.", false, "Najtoplije je ljeto."));
  godisnja.push(
    match(
      "match-season-weather",
      "Spoji godišnje doba i tipičnu vremensku sliku.",
      [["zima", "snijeg"], ["ljeto", "vrućina"], ["jesen", "lišće"], ["proljeće", "cvijeće"]],
      "Zima–snijeg, ljeto–vrućina, jesen–lišće, proljeće–cvijeće.",
      3
    )
  );

  // Koji mjesec pripada dobu — obrnuti tip
  seasons.forEach(function (s) {
    var inSeason = months.filter(function (row) { return row[1] === s; }).map(function (row) { return row[0]; });
    var outSeason = months.filter(function (row) { return row[1] !== s; }).map(function (row) { return row[0]; });
    inSeason.forEach(function (mon) {
      godisnja.push(
        mcq(
          "which-month-" + s + "-" + mon,
          "Koji mjesec je u " + s + "?",
          mon,
          uniqChoices(mon, shuffleCopy(outSeason).concat(inSeason)),
          mon + " je u " + s + "."
        )
      );
    });
  });

  // Odjeća × doba (točno / netočno)
  var clothItems = [
    ["kapa i jakna", "zima", true],
    ["kratke hlače", "ljeto", true],
    ["kupaći kostim", "zima", false],
    ["vunene rukavice", "ljeto", false],
    ["sandale", "zima", false],
    ["čizme", "zima", true],
    ["majica bez rukava", "ljeto", true],
    ["teška bunda", "ljeto", false],
    ["kišobran", "jesen", true],
    ["skijaško odijelo", "proljeće", false]
  ];
  clothItems.forEach(function (row) {
    godisnja.push(
      tf(
        "tf-cloth-" + row[0].replace(/\s+/g, "-") + "-" + row[1],
        "U " + row[1] + " obično nosimo: " + row[0] + ".",
        row[2],
        row[2] ? "To ima smisla za " + row[1] + "." : "To nije tipično za " + row[1] + "."
      )
    );
  });

  // Redoslijed mjeseci unutar doba
  var seasonMonthGroups = {
    proljeće: ["ožujak", "travanj", "svibanj"],
    ljeto: ["lipanj", "srpanj", "kolovoz"],
    jesen: ["rujan", "listopad", "studeni"],
    zima: ["prosinac", "siječanj", "veljača"]
  };
  Object.keys(seasonMonthGroups).forEach(function (s) {
    var g = seasonMonthGroups[s];
    var prompt =
      s === "zima"
        ? "Poredaj zimske mjesece redom kako zima teče (od prosinca)."
        : "Poredaj mjesece u " + s + " kalendarskim redom.";
    godisnja.push(order("ord-months-" + s, prompt, g.slice(), g.join(" → ")));
  });

  /* ===================== ŽIVA BIĆA ===================== */
  var ziva = [];
  var animals = [
    ["pas", "domaća", "kuća / dvorište", "4", "laje"],
    ["mačka", "domaća", "kuća", "4", "mijauče"],
    ["krava", "domaća", "farma", "4", "muče"],
    ["konj", "domaća", "farma / pašnjak", "4", "reže"],
    ["svinja", "domaća", "farma", "4", "rokće"],
    ["kokoš", "domaća", "farma", "2", "koka"],
    ["ovca", "domaća", "pašnjak", "4", "bleji"],
    ["lav", "divlja", "savana", "4", "riče"],
    ["vuk", "divlja", "šuma", "4", "tuje"],
    ["medvjed", "divlja", "šuma", "4", "reži"],
    ["lisica", "divlja", "šuma", "4", "laje tiho"],
    ["zec", "divlja", "polje / šuma", "4", "šuti / skače"],
    ["jelen", "divlja", "šuma", "4", "rikče"],
    ["ptica", "divlja", "zrak / gnijezdo", "2", "cvrlja"],
    ["riba", "divlja", "voda", "0", "pliva"],
    ["žaba", "divlja", "jezero / bara", "4", "krekeće"],
    ["pčela", "divlja", "cvijet / košnica", "6", "zuči"],
    ["leptir", "divlja", "vrt / livada", "6", "leti"],
    ["mrav", "divlja", "zemlja", "6", "radi"],
    ["dupin", "divlja", "more", "0", "skače u vodi"]
  ];

  var plants = [
    ["hrast", "drvo", "šuma"],
    ["jela", "drvo", "šuma"],
    ["jabuka", "voćka", "vrt / voćnjak"],
    ["ruža", "cvijet", "vrt"],
    ["trava", "biljka", "livada"],
    ["kukuruz", "biljka", "polje"],
    ["pšenica", "biljka", "polje"],
    ["suncokret", "cvijet", "polje"],
    ["kaktus", "biljka", "suho mjesto"],
    ["mahovina", "biljka", "šuma / kamen"]
  ];

  var living = animals.map(function (a) { return a[0]; }).concat(plants.map(function (p) { return p[0]; }));
  var nonLiving = ["kamen", "stol", "auto", "lopta", "kišobran", "olovka", "kuća", "cesta", "čaša", "sat"];

  animals.forEach(function (a) {
    ziva.push(
      mcq(
        "dom-" + a[0],
        "Je li " + a[0] + " domaća ili divlja životinja?",
        a[1],
        ["domaća", "divlja"],
        a[0].charAt(0).toUpperCase() + a[0].slice(1) + " je " + a[1] + " životinja."
      )
    );
    ziva.push(
      mcq(
        "hab-" + a[0],
        "Gdje najčešće živi " + a[0] + "?",
        a[2],
        uniqChoices(a[2], animals.map(function (x) { return x[2]; }).concat(["svemir", "hladnjak"])),
        a[0].charAt(0).toUpperCase() + a[0].slice(1) + " živi: " + a[2] + "."
      )
    );
    ziva.push(
      mcq(
        "legs-" + a[0],
        "Koliko nogu tipično ima " + a[0] + "?",
        a[3],
        uniqChoices(a[3], ["0", "2", "4", "6", "8"]),
        a[0].charAt(0).toUpperCase() + a[0].slice(1) + " tipično ima " + a[3] + " nogu."
      )
    );
    ziva.push(
      tf(
        "tf-dom-" + a[0],
        a[0].charAt(0).toUpperCase() + a[0].slice(1) + " je " + a[1] + " životinja.",
        true,
        "Točno."
      )
    );
    ziva.push(
      tf(
        "tf-dom-wrong-" + a[0],
        a[0].charAt(0).toUpperCase() + a[0].slice(1) + " je " + (a[1] === "domaća" ? "divlja" : "domaća") + " životinja.",
        false,
        "Netočno: " + a[0] + " je " + a[1] + "."
      )
    );
  });

  plants.forEach(function (p) {
    ziva.push(
      mcq(
        "plant-type-" + p[0],
        "Što je " + p[0] + "?",
        p[1],
        uniqChoices(p[1], ["drvo", "cvijet", "biljka", "voćka", "životinja"]),
        p[0].charAt(0).toUpperCase() + p[0].slice(1) + " je " + p[1] + "."
      )
    );
    ziva.push(
      mcq(
        "plant-where-" + p[0],
        "Gdje najčešće raste " + p[0] + "?",
        p[2],
        uniqChoices(p[2], plants.map(function (x) { return x[2]; }).concat(["more", "oblak"])),
        p[0].charAt(0).toUpperCase() + p[0].slice(1) + " raste: " + p[2] + "."
      )
    );
  });

  nonLiving.forEach(function (name) {
    ziva.push(
      tf("tf-nonlive-" + name, name.charAt(0).toUpperCase() + name.slice(1) + " je živo biće.", false, name.charAt(0).toUpperCase() + name.slice(1) + " nije živo biće.")
    );
    ziva.push(
      mcq(
        "live-or-not-" + name,
        "Što od navedenog NIJE živo biće?",
        name,
        uniqChoices(name, shuffleCopy(living).concat(nonLiving)),
        name.charAt(0).toUpperCase() + name.slice(1) + " nije živo."
      )
    );
  });

  living.forEach(function (name, idx) {
    if (idx % 3 !== 0) return;
    ziva.push(
      mcq(
        "is-live-" + name,
        "Što od navedenog JE živo biće?",
        name,
        uniqChoices(name, shuffleCopy(nonLiving).concat(living)),
        name.charAt(0).toUpperCase() + name.slice(1) + " je živo biće."
      )
    );
  });

  ziva.push(mcq("need-plant", "Što biljke trebaju da rastu?", "svjetlost i vodu", ["samo kamenje", "svjetlost i vodu", "samo vjetar", "plastiku"], "Biljke trebaju svjetlost, vodu i hranjive tvari."));
  ziva.push(mcq("need-animal", "Što životinje trebaju za život?", "hranu, vodu i zrak", ["samo igračke", "hranu, vodu i zrak", "samo sunce", "plastiku"], "Životinje trebaju hranu, vodu i zrak."));
  ziva.push(tf("tf-plants-water", "Biljke trebaju vodu.", true, "Da."));
  ziva.push(tf("tf-fish-air", "Ribe žive na suhom kopnu.", false, "Ribe žive u vodi."));
  ziva.push(
    match(
      "match-animal-home",
      "Spoji životinju i mjesto.",
      [["riba", "voda"], ["ptica", "gnijezdo"], ["pas", "kuća"], ["pčela", "košnica"]],
      "Riba–voda, ptica–gnijezdo, pas–kuća, pčela–košnica.",
      2
    )
  );

  ziva.push(
    match(
      "match-legs",
      "Spoji životinju i broj nogu (tipično).",
      [["žaba", "4 noge"], ["pčela", "6 nogu"], ["riba", "0 nogu"], ["pauk", "8 nogu"]],
      "Žaba ima 4 noge, pčela 6, pauk 8, a riba nema noge za hodanje.",
      3
    )
  );

  [
    ["Što NIJE živo biće?", "kamen", ["pas", "kamen", "mačka", "ruža"]],
    ["Što JE živo biće?", "hrast", ["stol", "auto", "hrast", "olovka"]],
    ["Što od navedenog je životinja?", "dupin", ["trava", "dupin", "kamen", "stol"]],
    ["Što od navedenog je biljka?", "suncokret", ["mrav", "suncokret", "lopta", "auto"]],
    ["Što NIJE živo biće?", "cesta", ["kokoš", "cesta", "jabuka", "leptir"]],
    ["Što JE živo biće?", "medvjed", ["sat", "medvjed", "kuća", "kišobran"]]
  ].forEach(function (row, idx) {
    var cap = row[1].charAt(0).toUpperCase() + row[1].slice(1);
    var explain = living.indexOf(row[1]) >= 0 ? cap + " je živo biće." : cap + " nije živo biće.";
    ziva.push(mcq("live-mix-" + idx, row[0], row[1], row[2], explain, 2));
  });

  // Usporedi životinje: tko ima više nogu / domaća vs divlja kombinacije
  for (i = 0; i < animals.length; i++) {
    for (j = 0; j < animals.length; j++) {
      if (i === j) continue;
      if ((i + j) % 2 !== 0) continue;
      var ai = animals[i];
      var aj = animals[j];
      var moreLegs = Number(ai[3]) > Number(aj[3]) ? ai[0] : Number(aj[3]) > Number(ai[3]) ? aj[0] : null;
      if (moreLegs) {
        ziva.push(
          mcq(
            "cmp-legs-" + ai[0] + "-" + aj[0],
            "Tko tipično ima više nogu: " + ai[0] + " ili " + aj[0] + "?",
            moreLegs,
            uniqChoices(moreLegs, [ai[0], aj[0], "oba jednako", "nitko"]),
            moreLegs.charAt(0).toUpperCase() + moreLegs.slice(1) + " ima više nogu."
          )
        );
      }
      ziva.push(
        tf(
          "tf-same-type-" + ai[0] + "-" + aj[0],
          ai[0].charAt(0).toUpperCase() + ai[0].slice(1) + " i " + aj[0] + " su oboje " + ai[1] + " životinje.",
          ai[1] === aj[1],
          ai[1] === aj[1]
            ? "Oboje su " + ai[1] + "."
            : ai[0] + " je " + ai[1] + ", a " + aj[0] + " je " + aj[1] + "."
        )
      );
    }
  }

  // Biljke vs životinje
  plants.forEach(function (p) {
    animals.forEach(function (a) {
      if ((p[0].length + a[0].length) % 3 !== 0) return;
      ziva.push(
        mcq(
          "plant-or-animal-" + p[0] + "-" + a[0],
          "Što od navedenog je biljka?",
          p[0],
          uniqChoices(p[0], [p[0], a[0], "pas", "auto"]),
          p[0].charAt(0).toUpperCase() + p[0].slice(1) + " je biljka."
        )
      );
      ziva.push(
        mcq(
          "animal-or-plant-" + a[0] + "-" + p[0],
          "Što od navedenog je životinja?",
          a[0],
          uniqChoices(a[0], [a[0], p[0], "kamen", "stol"]),
          a[0].charAt(0).toUpperCase() + a[0].slice(1) + " je životinja."
        )
      );
    });
  });

  /* ===================== JA I OKOLINA ===================== */
  var okolina = [];
  var body = [
    ["glava", "na njoj su oči i usta"],
    ["ruka", "njome držimo stvari"],
    ["noga", "njome hodamo"],
    ["oko", "njime gledamo"],
    ["uho", "njime slušamo"],
    ["nos", "njime mirišemo"],
    ["usta", "njima govorimo i jedemo"],
    ["zubi", "njima žvačemo"],
    ["srce", "pumpa krv"],
    ["koža", "štiti tijelo"]
  ];
  var family = ["mama", "tata", "baka", "djed", "sestra", "brat", "stric", "teta"];
  var schoolThings = ["učionica", "klupa", "ploča", "knjiga", "olovka", "torba", "zvono", "dvorište"];
  var traffic = [
    ["crveno", "stanemo"],
    ["žuto", "pripremimo se"],
    ["zeleno", "idemo oprezno"]
  ];
  // [naziv, lokativna fraza (gdje?), radnja]
  var placesHome = [
    ["škola", "u školi", "učimo"],
    ["park", "u parku", "igramo se"],
    ["kuća", "u kući", "odmaramo se"],
    ["bolnica", "u bolnici", "liječimo se"],
    ["trgovina", "u trgovini", "kupujemo"],
    ["knjižnica", "u knjižnici", "posuđujemo knjige"],
    ["igralište", "na igralištu", "trčimo i igramo"],
    ["ambulanta", "u ambulanti", "idemo liječniku"]
  ];

  function placeSentence(loc, action) {
    var head = loc.charAt(0).toUpperCase() + loc.slice(1);
    if (/ se$/.test(action)) {
      return head + " se najčešće " + action.replace(/ se$/, "") + ".";
    }
    return head + " najčešće " + action + ".";
  }

  body.forEach(function (b) {
    okolina.push(
      mcq(
        "body-" + b[0],
        "Koji dio tijela " + b[1] + "?",
        b[0],
        uniqChoices(b[0], body.map(function (x) { return x[0]; })),
        b[0].charAt(0).toUpperCase() + b[0].slice(1) + " — " + b[1] + "."
      )
    );
    okolina.push(
      tf(
        "tf-body-" + b[0],
        b[0].charAt(0).toUpperCase() + b[0].slice(1) + " " + b[1] + ".",
        true,
        "Točno."
      )
    );
  });

  family.forEach(function (f, idx) {
    okolina.push(
      mcq(
        "family-" + f,
        "Tko pripada obitelji?",
        f,
        uniqChoices(f, family.concat(["autobus", "ploča", "kamen", "oblaci"])),
        f.charAt(0).toUpperCase() + f.slice(1) + " je član obitelji."
      )
    );
    okolina.push(
      tf("tf-family-" + f, f.charAt(0).toUpperCase() + f.slice(1) + " može biti član obitelji.", true, "Da.")
    );
  });

  schoolThings.forEach(function (s) {
    okolina.push(
      mcq(
        "school-" + s,
        "Što pripada školi?",
        s,
        uniqChoices(s, schoolThings.concat(["plaža", "svemirski brod", "vulkan", "pustinjska oaza"])),
        s.charAt(0).toUpperCase() + s.slice(1) + " pripada školskom okruženju."
      )
    );
  });

  traffic.forEach(function (t) {
    okolina.push(
      mcq(
        "light-" + t[0],
        "Što radimo kad je na semaforu " + t[0] + "?",
        t[1],
        uniqChoices(t[1], traffic.map(function (x) { return x[1]; }).concat(["spavamo", "jedemo"])),
        "Na " + t[0] + ": " + t[1] + "."
      )
    );
    okolina.push(
      tf(
        "tf-light-" + t[0],
        "Kad je semafor " + t[0] + ", " + t[1] + ".",
        true,
        "Točno."
      )
    );
  });

  placesHome.forEach(function (p) {
    okolina.push(
      mcq(
        "place-" + p[0],
        "Što najčešće radimo " + p[1] + "?",
        p[2],
        uniqChoices(
          p[2],
          placesHome.map(function (x) {
            return x[2];
          })
        ),
        placeSentence(p[1], p[2])
      )
    );
  });

  okolina.push(
    order(
      "ord-day",
      "Poredaj dijelove dana redom (od ranijeg prema kasnijem).",
      ["jutro", "podne", "večer"],
      "Jutro → podne → večer.",
      2
    )
  );

  okolina.push(
    order(
      "ord-yesterday-today-tomorrow",
      "Poredaj redom: jučer, danas, sutra.",
      ["jučer", "danas", "sutra"],
      "Jučer je prošao, danas je sada, sutra dolazi poslije danas.",
      2
    )
  );

  [
    ["Što znači jučer?", "dan prije današnjeg", ["dan prije današnjeg", "danas", "dan poslije sutra", "tjedan dana"]],
    ["Što znači danas?", "dan u kojem smo sada", ["jučer", "dan u kojem smo sada", "sutra", "prošla godina"]],
    ["Što znači sutra?", "dan poslije današnjeg", ["dan prije jučer", "prošli mjesec", "dan poslije današnjeg", "jučer"]],
    ["Koji dan dolazi poslije danas?", "sutra", ["jučer", "danas", "sutra", "prosinac"]],
    ["Koji dan je bio prije danas?", "jučer", ["sutra", "jučer", "petak", "ljeto"]]
  ].forEach(function (row, idx) {
    okolina.push(mcq("rel-day-" + idx, row[0], row[1], row[2], "Točno: " + row[1] + ".", 2));
  });

  okolina.push(tf("tf-tomorrow-after", "Sutra dolazi poslije današnjeg dana.", true, "Sutra je dan poslije danas.", 2));
  okolina.push(tf("tf-yesterday-before", "Jučer je bilo prije današnjeg dana.", true, "Jučer je prošao dan.", 2));
  okolina.push(tf("tf-today-now", "Danas je dan u kojem smo sada.", true, "Danas je sadašnji dan.", 1));
  okolina.push(tf("tf-yesterday-future", "Jučer je dan koji tek dolazi.", false, "Jučer je već prošao — dolazi sutra.", 3));

  okolina.push(
    match(
      "match-body-func",
      "Spoji dio tijela i što radimo.",
      [
        ["glava", "gledamo očima"],
        ["ruka", "držimo stvari"],
        ["noga", "hodamo"],
        ["uho", "slušamo"],
        ["nos", "mirišemo"],
        ["usta", "govorimo i jedemo"]
      ],
      "Svaki dio tijela ima svoju važnu ulogu.",
      2
    )
  );

  okolina.push(
    match(
      "match-body-sense",
      "Spoji osjetilo i dio tijela.",
      [["vid", "oko"], ["sluh", "uho"], ["miris", "nos"], ["okus", "usta"]],
      "Oko vidi, uho sluša, nos miriše, ustima okusimo.",
      3
    )
  );
  okolina.push(mcq("country", "Koja je naša zemlja?", "Hrvatska", ["Italija", "Hrvatska", "Njemačka", "Francuska"], "Živimo u Hrvatskoj.", 1));
  okolina.push(mcq("capital", "Koji je glavni grad Hrvatske?", "Zagreb", ["Split", "Zagreb", "Rijeka", "Osijek"], "Glavni grad je Zagreb.", 1));
  okolina.push(mcq("sea", "Uz koje more leži Hrvatska?", "Jadransko more", ["Crno more", "Jadransko more", "Sjeverno more", "Baltičko more"], "Hrvatska leži uz Jadransko more.", 2));
  okolina.push(mcq("cross", "Što radimo na pješačkom prijelazu?", "gledamo lijevo i desno", ["trčimo odmah", "gledamo lijevo i desno", "zatvorimo oči", "slušamo glazbu jako"], "Prvo pogledamo cestu."));
  okolina.push(mcq("trash", "Gdje bacamo otpad?", "u koš za smeće", ["na pod", "u koš za smeće", "u rijeku", "na cestu"], "Otpad ide u koš."));
  okolina.push(mcq("listen", "Što je važno u razgovoru?", "slušati drugoga", ["vikati", "slušati drugoga", "prekidati uvijek", "okretati leđa"], "Slušanje pokazuje poštovanje."));
  okolina.push(mcq("sick", "Što radimo kad smo bolesni?", "odmaramo se / idemo liječniku", ["trčimo cijeli dan", "odmaramo se / idemo liječniku", "ne pijemo vodu", "igramo na cesti"], "Brinemo o zdravlju."));
  okolina.push(mcq("helmet", "Koji dio opreme štiti glavu u biciklizmu?", "kaciga", ["rukavice samo", "kaciga", "nema ništa", "šal samo"], "Kaciga štiti glavu."));
  okolina.push(mcq("teacher", "Tko nas uči u školi?", "učitelj / učiteljica", ["vozač autobusa", "učitelj / učiteljica", "prodavač", "policajac uvijek"], "Uči nas učitelj ili učiteljica."));
  okolina.push(tf("tf-teeth", "Zubi se peru ujutro i navečer.", true, "Higijena zubi je važna."));
  okolina.push(tf("tf-respect", "Svatko ima pravo na poštovanje.", true, "Poštujemo sebe i druge."));
  okolina.push(tf("tf-litter", "Otpad bacamo u rijeku.", false, "Otpad ide u koš."));
  okolina.push(tf("tf-red-go", "Na crvenom svjetlu trčimo preko ceste.", false, "Na crvenom stanemo i čekamo.", 2));
  okolina.push(tf("tf-green-careful", "Na zelenom svjetlu idemo oprezno i gledamo lijevo-desno.", true, "Zeleno znači da možemo ići, ali oprezno.", 2));
  okolina.push(tf("tf-hr", "Hrvatska je naša domovina.", true, "Da.", 1));
  okolina.push(
    match(
      "match-place-action",
      "Spoji mjesto i što tamo radimo.",
      [
        ["škola", "učimo"],
        ["park", "igramo se"],
        ["knjižnica", "posuđujemo knjige"],
        ["bolnica", "liječimo se"]
      ],
      "U školi učimo, u parku se igramo, u knjižnici posuđujemo knjige, u bolnici liječimo se.",
      2
    )
  );
  okolina.push(
    match(
      "match-light",
      "Spoji boju semafora i što radimo.",
      [["crveno", "stani"], ["žuto", "pripremi se"], ["zeleno", "idi oprezno"]],
      "Crveno–stani, žuto–pripremi se, zeleno–idi oprezno.",
      2
    )
  );

  // Kombinacije: dijelovi dana × aktivnosti
  var dayActs = [
    ["ujutro", "peremo zube i doručkujemo"],
    ["podne", "ručamo"],
    ["navečer", "večeramo i spremamo se za spavanje"]
  ];
  dayActs.forEach(function (row) {
    okolina.push(
      mcq(
        "dayact-" + row[0],
        "Što najčešće radimo " + row[0] + "?",
        row[1],
        uniqChoices(row[1], dayActs.map(function (x) { return x[1]; }).concat(["spavamo cijeli dan", "igramo na cesti"])),
        row[0].charAt(0).toUpperCase() + row[0].slice(1) + " najčešće " + row[1] + "."
      )
    );
  });

  // Redoslijed dijelova dana (imenice + genitiv uz „prije“)
  var dayOrder = [
    { key: "jutro", prije: "jutra" },
    { key: "podne", prije: "podneva" },
    { key: "večer", prije: "večeri" }
  ];
  dayOrder.forEach(function (a, i1) {
    dayOrder.forEach(function (b, i2) {
      if (i1 === i2) return;
      var earlier = i1 < i2;
      okolina.push(
        tf(
          "tf-dayord-" + a.key + "-" + b.key,
          a.key.charAt(0).toUpperCase() + a.key.slice(1) + " je prije " + b.prije + ".",
          earlier,
          earlier
            ? "Da. U danu red ide: jutro, zatim podne, zatim večer."
            : "Ne. U danu prvo dolazi jutro, zatim podne, a tek onda večer."
        )
      );
    });
  });

  // Više kombinacija: obitelj × škola × promet (TF)
  family.forEach(function (f) {
    schoolThings.forEach(function (s) {
      if ((f.length + s.length) % 2 !== 0) return;
      okolina.push(
        tf(
          "tf-notfam-" + f + "-" + s,
          s.charAt(0).toUpperCase() + s.slice(1) + " je član obitelji.",
          false,
          s.charAt(0).toUpperCase() + s.slice(1) + " nije član obitelji."
        )
      );
    });
  });

  placesHome.forEach(function (p, pi) {
    placesHome.forEach(function (q, qi) {
      if (pi === qi) return;
      if ((pi + qi) % 2 !== 0) return;
      okolina.push(
        tf(
          "tf-placewrong-" + p[0] + "-" + q[0],
          placeSentence(p[1], q[2]),
          false,
          placeSentence(p[1], p[2])
        )
      );
    });
  });

  body.forEach(function (b, bi) {
    body.forEach(function (other, oi) {
      if (bi === oi) return;
      if ((bi + oi) % 3 !== 0) return;
      okolina.push(
        tf(
          "tf-bodywrong-" + b[0] + "-" + other[0],
          b[0].charAt(0).toUpperCase() + b[0].slice(1) + " " + other[1] + ".",
          false,
          b[0].charAt(0).toUpperCase() + b[0].slice(1) + " — " + b[1] + "."
        )
      );
    });
  });

  // Dani u tjednu
  var weekdays = ["ponedjeljak", "utorak", "srijeda", "četvrtak", "petak", "subota", "nedjelja"];
  for (i = 0; i < weekdays.length - 1; i++) {
    okolina.push(
      mcq(
        "weekday-after-" + weekdays[i],
        "Koji dan dolazi poslije " + weekdays[i] + "?",
        weekdays[i + 1],
        uniqChoices(weekdays[i + 1], shuffleCopy(weekdays)),
        "Poslije " + weekdays[i] + " ide " + weekdays[i + 1] + "."
      )
    );
  }
  for (i = 1; i < weekdays.length; i++) {
    okolina.push(
      mcq(
        "weekday-before-" + weekdays[i],
        "Koji dan dolazi prije " + weekdays[i] + "?",
        weekdays[i - 1],
        uniqChoices(weekdays[i - 1], shuffleCopy(weekdays)),
        "Prije " + weekdays[i] + " ide " + weekdays[i - 1] + "."
      )
    );
  }
  for (i = 0; i < weekdays.length; i++) {
    for (var wj = i + 1; wj < weekdays.length; wj++) {
      for (var wk = wj + 1; wk < weekdays.length; wk++) {
        // Preskoči tri uzastopna dana — prelagano i predvidljivo
        if (wj === i + 1 && wk === wj + 1) continue;
        okolina.push(
          order(
            "ord-week-" + i + "-" + wj + "-" + wk,
            "Poredaj dane redom u tjednu (od ranijeg prema kasnijem).",
            [weekdays[i], weekdays[wj], weekdays[wk]],
            weekdays[i] + " → " + weekdays[wj] + " → " + weekdays[wk] + "."
          )
        );
      }
    }
  }

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

  function pickExact(source, ids) {
    var set = {};
    ids.forEach(function (id) {
      set[id] = true;
    });
    return source.filter(function (q) {
      return set[q.id];
    });
  }

  var bankDoba = pickBank(godisnja, [
    "ord-seasons",
    "fact-",
    "emoji-",
    "tf-next-"
  ]).concat(
    pickExact(godisnja, ["tf-autumn-cold", "tf-summer-hot", "tf-winter-hot"])
  );

  var bankMjeseci = pickBank(godisnja, [
    "month-",
    "tf-month-",
    "which-month-",
    "ord-months-"
  ]);

  var bankVrijeme = pickBank(godisnja, [
    "clothes-",
    "weather-",
    "tf-cloth-",
    "match-season-weather"
  ]).concat(pickExact(godisnja, ["tf-clouds", "tf-snow-always"]));

  var bankZivo = pickBank(ziva, [
    "tf-nonlive-",
    "live-or-not-",
    "is-live-",
    "live-mix-"
  ]);

  var bankZivotinje = pickBank(ziva, [
    "dom-",
    "hab-",
    "legs-",
    "tf-dom-",
    "cmp-legs-",
    "tf-same-type-",
    "animal-or-plant-",
    "match-animal-home",
    "match-legs",
    "need-animal",
    "tf-fish-air"
  ]);

  var bankBiljke = pickBank(ziva, [
    "plant-type-",
    "plant-where-",
    "plant-or-animal-",
    "need-plant",
    "tf-plants-water"
  ]);

  var bankTijelo = pickBank(okolina, [
    "body-",
    "tf-body-",
    "match-body-",
    "tf-bodywrong-",
    "tf-teeth",
    "sick"
  ]);

  var bankDani = pickBank(okolina, [
    "weekday-",
    "ord-week-",
    "ord-day",
    "ord-yesterday-today-tomorrow",
    "rel-day-",
    "tf-tomorrow-",
    "tf-yesterday-",
    "tf-today-",
    "dayact-",
    "tf-dayord-"
  ]);

  var bankOkolina = pickBank(okolina, [
    "family-",
    "tf-family-",
    "tf-notfam-",
    "school-",
    "teacher",
    "light-",
    "tf-light-",
    "match-light",
    "cross",
    "helmet",
    "tf-red-go",
    "tf-green-careful",
    "place-",
    "tf-placewrong-",
    "match-place-action",
    "country",
    "capital",
    "sea",
    "tf-hr",
    "trash",
    "tf-litter",
    "listen",
    "tf-respect"
  ]);

  // Dopuna: dijelovi biljke (Profil / 1. razred)
  [
    ["korijen", "dio biljke u zemlji", ["korijen", "list", "cvijet", "plod"]],
    ["list", "zeleni dio koji hvata svjetlost", ["korijen", "list", "sjeme", "stabljika samo u zemlji"]],
    ["stabljika", "dio koji drži biljku uspravno", ["korijen", "stabljika", "voda", "kamen"]],
    ["cvijet", "šareni dio mnogih biljaka", ["cvijet", "korijen", "kamen", "auto"]]
  ].forEach(function (row, idx) {
    bankBiljke.push(
      mcq(
        "plant-part-" + idx,
        "Što je " + row[0] + "?",
        row[1],
        uniqChoices(row[1], [
          row[1],
          "životinja u šumi",
          "dio auta",
          "oblak na nebu",
          "igračka"
        ]),
        row[0].charAt(0).toUpperCase() + row[0].slice(1) + " — " + row[1] + ".",
        null,
        2
      )
    );
    bankBiljke.push(
      mcq(
        "plant-name-" + idx,
        "Kako zovemo " + row[1] + "?",
        row[0],
        row[2],
        "To je " + row[0] + ".",
        null,
        2
      )
    );
  });

  // Dopuna: vremenske pojave
  [
    ["kiša", "Što pada s neba kad je mokro?", ["snijeg uvijek", "kiša", "pijesak", "lišće samo"]],
    ["snijeg", "Što je bijelo i pada zimi?", ["kiša", "snijeg", "pijesak", "dim"]],
    ["sunce", "Što grije Zemlju danju?", ["mjesec", "sunce", "zvijezde noću", "oblaci samo"]],
    ["vjetar", "Što miče grane i zastave?", ["vjetar", "kamen", "stol", "knjiga"]]
  ].forEach(function (row, idx) {
    bankVrijeme.push(
      mcq(
        "wx-extra-" + idx,
        row[1],
        row[0],
        row[2],
        "Točno: " + row[0] + ".",
        null,
        1
      )
    );
  });

  bankVrijeme.push(
    tf("tf-wx-umbrella", "Kad pada kiša, koristan je kišobran.", true, "Kišobran štiti od kiše.", 1)
  );
  bankVrijeme.push(
    tf("tf-wx-swim-snow", "Po snijegu se kupaš u moru.", false, "U snijegu je hladno — more je za plivanje ljeti.", 2)
  );

  // Dopuna: briga o okolini
  bankOkolina.push(
    mcq(
      "recycle-hint",
      "Što radimo s papirom, plastikom i staklom kad možemo?",
      "odvajamo otpad",
      ["bacamo sve u rijeku", "odvajamo otpad", "palimo u šumi", "ostavljamo na cesti"],
      "Odvajamo otpad da manje zagađujemo.",
      null,
      2
    )
  );
  bankOkolina.push(
    tf("tf-water-save", "Vodu treba trošiti pažljivo, ne uzalud.", true, "Voda je dragocjena.", 2)
  );

  /* ===================== DOPUNA: Nina i Tino 1 PRIRODA (flip 11269) ===================== */
  // Dom / škola / odgovorno ponašanje
  bankOkolina.push(
    match(
      "nina-match-family",
      "Spoji riječi koje pripadaju istoj obiteljskoj vezi (Nina i Tino 1).",
      [
        ["sin", "otac"],
        ["kći", "majka"],
        ["baka", "djed"],
        ["sestra", "brat"]
      ],
      "Sin–otac, kći–majka, baka–djed, sestra–brat.",
      2
    )
  );
  bankOkolina.push(
    mcq(
      "nina-room-home",
      "Koja se prostorija nalazi samo u domu (ne u školi)?",
      "spavaća soba",
      ["učionica", "spavaća soba", "školsko dvorište", "zbornica"],
      "Spavaća soba je u domu; učionica i zbornica su u školi.",
      null,
      2
    )
  );
  bankOkolina.push(
    mcq(
      "nina-room-school",
      "Što pripada školi, a ne domu?",
      "učionica",
      ["kuhinja", "spavaća soba", "učionica", "dnevni boravak"],
      "Učionica je školska prostorija.",
      null,
      1
    )
  );
  bankOkolina.push(
    tf(
      "nina-tf-shortest",
      "Najkraći put od kuće do škole uvijek je najsigurniji.",
      false,
      "Najkraći put nije uvijek najsigurniji — biramo siguran put.",
      2
    )
  );
  bankOkolina.push(
    mcq(
      "nina-112",
      "Koji broj zovemo kad treba hitna pomoć?",
      "112",
      ["122", "211", "121", "112"],
      "Hitni broj je 112.",
      null,
      2
    )
  );
  bankOkolina.push(
    tf(
      "nina-tf-adult-devices",
      "Nekim uređajima u domu smiju se služiti samo odrasli.",
      true,
      "Odrasli koriste uređaje koji mogu biti opasni za djecu.",
      2
    )
  );
  bankOkolina.push(
    match(
      "nina-match-material",
      "Spoji materijal i tipičan predmet (Nina i Tino 1).",
      [
        ["drvo", "stol / klupa"],
        ["staklo", "prozor / čaša"],
        ["metal", "vilica / ključ"],
        ["plastika", "bočica / posuda"],
        ["tekstil", "majica / ručnik"]
      ],
      "Predmeti su od različitih materijala: drvo, staklo, metal, plastika, tekstil.",
      2
    )
  );
  bankOkolina.push(
    mcq(
      "nina-right-duty",
      "Što je dužnost (ne samo pravo) u domu ili školi?",
      "pomagati u kućanskim poslovima",
      ["imati ime", "pomagati u kućanskim poslovima", "imati roditelje", "živjeti u Hrvatskoj"],
      "Dužnosti su poslovi i odgovornosti koje obavljamo.",
      null,
      2
    )
  );

  // Promet (proširenje iz udžbenika)
  bankOkolina.push(
    mcq(
      "nina-plocnik",
      "Po čemu se kreću pješaci?",
      "pločniku",
      ["kolniku", "pločniku", "pruzi", "moru"],
      "Pješaci hodaju pločnikom.",
      null,
      1
    )
  );
  bankOkolina.push(
    mcq(
      "nina-kolnik",
      "Po čemu se kreću vozila?",
      "kolniku",
      ["pločniku", "kolniku", "krovu", "igralištu"],
      "Vozila se kreću kolnikom.",
      null,
      1
    )
  );
  bankOkolina.push(
    mcq(
      "nina-desna",
      "Kojom se stranom pločnika krećemo u prometu?",
      "desnom",
      ["lijevom", "desnom", "sredinom kolnika", "unatrag"],
      "Krećemo se desnom stranom.",
      null,
      2
    )
  );
  bankOkolina.push(
    mcq(
      "nina-zebra",
      "Koja životinja dijeli ime s pješačkim prijelazom?",
      "zebra",
      ["lav", "zebra", "pas", "mačka"],
      "Pješački prijelaz zovemo i zebrom.",
      null,
      1
    )
  );
  bankOkolina.push(
    order(
      "nina-ord-look",
      "Poredaj što radiš prije prelaska zebre.",
      ["lijevo", "desno", "lijevo"],
      "Uvijek: lijevo → desno → lijevo.",
      2
    )
  );
  bankOkolina.push(
    tf(
      "nina-tf-play-road",
      "Igranje na kolniku je sigurno.",
      false,
      "Kolnik je za vozila — igranje tamo je opasno.",
      1
    )
  );
  bankOkolina.push(
    tf(
      "nina-tf-zebra-safe",
      "Prelazak preko zebre sigurniji je od trčanja preko kolnika.",
      true,
      "Cestu prelazimo na označenom pješačkom prijelazu.",
      1
    )
  );
  bankOkolina.push(
    tf(
      "nina-tf-belt",
      "U vozilu se vežemo sigurnosnim pojasom.",
      true,
      "Pojas štiti putnike.",
      1
    )
  );
  bankOkolina.push(
    mcq(
      "nina-bike-path",
      "Kako se zove dio prometnice za bicikliste?",
      "biciklistička staza",
      ["kolnik samo za auta", "biciklistička staza", "željeznička pruga", "pločnik za trčanje"],
      "Biciklisti koriste biciklističku stazu.",
      null,
      2
    )
  );
  bankOkolina.push(
    mcq(
      "nina-who-look",
      "Tko mora pogledati lijevo–desno–lijevo prije prelaska zebre?",
      "pješak",
      ["samo vozač", "pješak", "samo policajac", "nitko"],
      "Pješak uvijek gleda lijevo–desno–lijevo.",
      null,
      2
    )
  );

  // Jesen / zima → godišnja doba i vrijeme
  bankDoba.push(
    tf(
      "nina-tf-autumn-days",
      "Ujesen dani postaju kraći, a noći dulje.",
      true,
      "U jeseni dani se skraćuju.",
      2
    )
  );
  bankDoba.push(
    mcq(
      "nina-selice",
      "Kako zovemo ptice koje se ujesen sele?",
      "selice",
      ["stanarice", "selice", "grabljivice", "noćne ptice"],
      "Ptice koje se sele zovu se selice; one koje ostaju — stanarice.",
      null,
      2
    )
  );
  bankDoba.push(
    mcq(
      "nina-stanarice",
      "Kako zovemo ptice koje se ujesen ne sele?",
      "stanarice",
      ["selice", "stanarice", "galebovi svi", "pingvini"],
      "Stanarice ostaju u okolini i zimi.",
      null,
      2
    )
  );
  bankVrijeme.push(
    tf(
      "nina-tf-sandals",
      "Ujesen obuvamo sandale jer je toplo kao ljeti.",
      false,
      "Ujesen je hladnije — biramo topliju obuću.",
      2
    )
  );
  bankVrijeme.push(
    tf(
      "nina-tf-late-autumn-hot",
      "U kasnoj jeseni vani je toplo kao ljeti.",
      false,
      "Kasna jesen je hladnija; pijemo tople napitke.",
      2
    )
  );
  bankVrijeme.push(
    tf(
      "nina-tf-warm-drinks",
      "U kasnoj jeseni često pijemo tople napitke.",
      true,
      "Hladnije je, pa nam trebaju topli napitci.",
      1
    )
  );
  bankVrijeme.push(
    tf(
      "nina-tf-winter-coldest",
      "Zima je najhladnije godišnje doba.",
      true,
      "Zima je najhladnija.",
      1
    )
  );
  bankVrijeme.push(
    tf(
      "nina-tf-winter-nights",
      "Zimi su dani kratki, a noći duge.",
      true,
      "Zimi noći traju dulje od dana.",
      2
    )
  );
  bankVrijeme.push(
    mcq(
      "nina-winter-clothes",
      "Što radimo s odjećom na kraju jeseni / početkom zime?",
      "vadimo topliju odjeću",
      ["vadimo sandale", "vadimo topliju odjeću", "samo kratke hlače", "ništa ne mijenjamo"],
      "Pospremamo lakšu, vadimo topliju odjeću i obuću.",
      null,
      2
    )
  );
  bankDoba.push(
    mcq(
      "nina-winter-holiday",
      "Koji blagdan pripada zimskom vremenu?",
      "Božić",
      ["Uskrs", "Božić", "Ivanje", "Martinje samo ljeti"],
      "Zimi su npr. Sveti Nikola, Badnjak, Božić i Nova godina.",
      null,
      2
    )
  );
  bankDoba.push(
    match(
      "nina-match-winter-holidays",
      "Spoji zimski blagdan / praznik (Nina i Tino 1).",
      [
        ["Sveti Nikola", "početak prosinca"],
        ["Badnjak", "dan prije Božića"],
        ["Božić", "zimski blagdan"],
        ["Nova godina", "1. siječnja"]
      ],
      "Zimi obilježavamo blagdane i praznike u obitelji.",
      2
    )
  );

  // Dani, pozdravi, jučer–danas–sutra
  bankDani.push(
    match(
      "nina-match-greet",
      "Spoji pozdrav i doba dana (Nina i Tino 1).",
      [
        ["Dobro jutro", "jutro"],
        ["Dobar dan", "dan / prijepodne"],
        ["Dobra večer", "večer"],
        ["Laku noć", "noć"]
      ],
      "Pozdravljamo prema dobu dana.",
      2
    )
  );
  bankDani.push(
    tf(
      "nina-tf-day-parts",
      "Dan se sastoji od svijetlog i tamnog dijela.",
      true,
      "Dan ima dan (svjetlo) i noć (tama).",
      2
    )
  );
  bankDani.push(
    mcq(
      "nina-week-7",
      "Koliko dana ima jedan tjedan?",
      "7",
      ["5", "6", "7", "10"],
      "Tjedan ima sedam dana.",
      null,
      1
    )
  );
  bankDani.push(
    mcq(
      "nina-workdays",
      "Koji su radni dani u tjednu?",
      "ponedjeljak do petka",
      ["samo subota", "ponedjeljak do petka", "samo nedjelja", "samo srijeda"],
      "Radnim danima idemo u školu: pon–pet.",
      null,
      1
    )
  );
  bankDani.push(
    mcq(
      "nina-weekend",
      "Koji dani čine vikend (neradne dane)?",
      "subota i nedjelja",
      ["ponedjeljak i utorak", "subota i nedjelja", "srijeda i četvrtak", "samo petak"],
      "Subota i nedjelja su neradni dani / vikend.",
      null,
      1
    )
  );
  bankDani.push(tf("nina-tf-fri-after-thu", "Petak je poslije četvrtka.", true, "Redoslijed: … četvrtak, petak …", 1));
  bankDani.push(tf("nina-tf-before-tue", "Prije utorka je srijeda.", false, "Prije utorka je ponedjeljak.", 2));
  bankDani.push(tf("nina-tf-sat-between", "Subota je između petka i nedjelje.", true, "Petak → subota → nedjelja.", 1));
  bankDani.push(tf("nina-tf-week-ends-fri", "Tjedan završava u petak.", false, "Tjedan završava u nedjelju; nakon nje opet je ponedjeljak.", 2));
  bankDani.push(tf("nina-tf-week-starts-mon", "Tjedan počinje u ponedjeljak.", true, "Od ponedjeljka počinje novi tjedan.", 1));
  bankDani.push(tf("nina-tf-tue-second", "Drugi dan u tjednu je utorak.", true, "1. ponedjeljak, 2. utorak.", 2));
  bankDani.push(tf("nina-tf-sat-fifth", "Subota je peti dan u tjednu.", false, "Peti dan je petak; subota je šesti.", 3));
  bankDani.push(
    mcq(
      "nina-mid-weekday",
      "Kako se zove radni dan u sredini tjedna?",
      "srijeda",
      ["ponedjeljak", "srijeda", "subota", "nedjelja"],
      "Srijeda je u sredini radnog tjedna.",
      null,
      2
    )
  );
  bankDani.push(
    tf(
      "nina-tf-ydt-1",
      "Ako je jučer bila srijeda, danas je utorak.",
      false,
      "Ako je jučer bila srijeda, danas je četvrtak.",
      3
    )
  );
  bankDani.push(
    tf(
      "nina-tf-ydt-2",
      "Danas je subota, znači sutra je petak.",
      false,
      "Ako je danas subota, sutra je nedjelja.",
      2
    )
  );
  bankDani.push(
    tf(
      "nina-tf-ydt-3",
      "Sutra je nedjelja, znači danas je subota.",
      true,
      "Dan prije nedjelje je subota.",
      2
    )
  );
  bankDani.push(
    tf(
      "nina-tf-ydt-4",
      "Ako je sutra utorak, jučer je bio ponedjeljak.",
      false,
      "Ako je sutra utorak, danas je ponedjeljak, a jučer je bila nedjelja.",
      3
    )
  );

  // Dodatni kvizovi iz istog udžbenika (sigurnost, doba dana, jesen)
  bankOkolina.push(
    mcq(
      "nina-safe-play",
      "Što je SIGURNO u prometu?",
      "prelazak zebre",
      ["igranje na kolniku", "hodanje prugom", "prelazak zebre", "trčanje preko kolnika"],
      "Cestu prelazimo na zebri — igranje na kolniku i hodanje prugom su opasni.",
      null,
      2
    )
  );
  bankOkolina.push(
    mcq(
      "nina-roles-traffic",
      "U prometu mogu biti…",
      "pješak, putnik ili biciklist",
      ["samo vozač auta", "pješak, putnik ili biciklist", "samo policajac", "samo učenik u učionici"],
      "Kao dijete sudjeluješ kao pješak, putnik ili biciklist.",
      null,
      2
    )
  );
  bankOkolina.push(
    tf(
      "nina-tf-green-run",
      "Na zelenom svjetlu smiješ trčati preko ceste bez gledanja.",
      false,
      "Bez obzira na semafor: stani–pogledaj–slušaj–kreni.",
      2
    )
  );
  bankOkolina.push(
    mcq(
      "nina-class-not",
      "Što ne bi trebalo biti u učionici za vrijeme nastave?",
      "loptanje / trčanje po razredu",
      ["knjiga", "olovka", "loptanje / trčanje po razredu", "ploča"],
      "Za nastave pazimo na mir i red u učionici.",
      null,
      2
    )
  );
  bankOkolina.push(
    match(
      "nina-match-traffic",
      "Spoji prometni pojam (Nina i Tino 1).",
      [
        ["pločnik", "za pješake"],
        ["kolnik", "za vozila"],
        ["zebra", "pješački prijelaz"],
        ["kaciga", "štiti glavu na biciklu"]
      ],
      "Pločnik–pješaci, kolnik–vozila, zebra–prijelaz, kaciga–sigurnost.",
      2
    )
  );

  bankDani.push(
    mcq(
      "nina-greet-morning",
      "Kako pozdravljaš ujutro?",
      "Dobro jutro",
      ["Laku noć", "Dobro jutro", "Dobra večer", "Sretan Božić"],
      "Ujutro kažemo: Dobro jutro.",
      null,
      1
    )
  );
  bankDani.push(
    mcq(
      "nina-greet-night",
      "Kako pozdravljaš prije spavanja?",
      "Laku noć",
      ["Dobro jutro", "Dobar dan", "Laku noć", "Dobar tek"],
      "Prije spavanja: Laku noć.",
      null,
      1
    )
  );
  bankDani.push(
    order(
      "nina-ord-dayparts",
      "Poredaj doba dana od ranijeg prema kasnijem.",
      ["jutro", "podne", "večer", "noć"],
      "Jutro → podne → večer → noć.",
      2
    )
  );
  bankDani.push(
    mcq(
      "nina-word-yesterday",
      "Za dan prije današnjeg kažemo…",
      "jučer",
      ["sutra", "jučer", "prekosutra", "danas"],
      "Dan prije = jučer.",
      null,
      1
    )
  );
  bankDani.push(
    mcq(
      "nina-word-tomorrow",
      "Za sljedeći dan kažemo…",
      "sutra",
      ["jučer", "prekjuče", "sutra", "prošli tjedan"],
      "Sljedeći dan = sutra.",
      null,
      1
    )
  );
  bankDani.push(
    mcq(
      "nina-prekjuce",
      "Što znači prekjuče?",
      "dan prije jučer",
      ["danas", "sutra", "dan prije jučer", "prekosutra"],
      "Prekjuče = dan prije jučer.",
      null,
      3
    )
  );
  bankDani.push(
    mcq(
      "nina-prekosutra",
      "Što znači prekosutra?",
      "dan poslije sutra",
      ["jučer", "danas", "dan poslije sutra", "prekjuče"],
      "Prekosutra = dan poslije sutra.",
      null,
      3
    )
  );
  bankDani.push(
    tf(
      "nina-tf-after-sun",
      "Nakon nedjelje opet je ponedjeljak — počinje novi tjedan.",
      true,
      "Tjedan se ponavlja: nakon nedjelje dolazi ponedjeljak.",
      1
    )
  );

  bankDoba.push(
    mcq(
      "nina-evergreen",
      "Koji list ujesen obično NE mijenja boju (ostaje zelen)?",
      "zimzeleni / četinjača",
      ["javorov list", "zimzeleni / četinjača", "hrastov list", "lipov list"],
      "Neka stabla (zimzelena) zimi zadrže zeleno lišće.",
      null,
      3
    )
  );
  bankDoba.push(
    tf(
      "nina-tf-autumn-insects",
      "U kasnoj jeseni u prirodi ima puno kukaca kao ljeti.",
      false,
      "Kasna jesen je tiša — manje kukaca i zvukova.",
      2
    )
  );
  bankVrijeme.push(
    mcq(
      "nina-autumn-dress",
      "Kako se odijevamo ujesen kad zahladi?",
      "toplije (jakna, zatvorena obuća)",
      ["samo kupaći", "toplije (jakna, zatvorena obuća)", "samo sandale", "ništa"],
      "S promjenom vremena mijenja se i odjeća.",
      null,
      1
    )
  );
  bankVrijeme.push(
    match(
      "nina-match-season-clothes",
      "Spoji godišnje doba i tipičnu odjeću (Nina i Tino 1).",
      [
        ["ljeto", "majica / sandale"],
        ["jesen", "jakna / zatvorene cipele"],
        ["zima", "kapa / rukavice / čizme"],
        ["proljeće", "lakša jakna"]
      ],
      "Odijevamo se prema vremenu i godišnjem dobu.",
      2
    )
  );

  global.CONTENT_PRIRODA = {
    id: "priroda",
    title: "Priroda i društvo",
    icon: "🌿",
    blurb:
      "Potraga za blagom: 9 stanica prema Profilu (Nina i Tino 1) — doba, vrijeme, živa bića, tijelo, dani i okolina.",
    color: "pid",
    games: [
      {
        id: "pid-godisnja",
        title: "Godišnja doba",
        emoji: "🌸",
        desc: "Trag: proljeće–zima, selice/stanarice, zimski blagdani.",
        roundSize: 12,
        bank: bankDoba
      },
      {
        id: "pid-mjeseci",
        title: "Mjeseci",
        emoji: "📅",
        desc: "Trag: koji mjesec pripada kojem godišnjem dobu.",
        roundSize: 12,
        bank: bankMjeseci
      },
      {
        id: "pid-vrijeme",
        title: "Vrijeme i odjeća",
        emoji: "☔",
        desc: "Trag: kiša, sunce, snijeg, jesen/zima i što nosimo.",
        roundSize: 10,
        bank: bankVrijeme
      },
      {
        id: "pid-zivo",
        title: "Živo i neživo",
        emoji: "✨",
        desc: "Trag: što je živo biće, a što nije.",
        roundSize: 10,
        bank: bankZivo
      },
      {
        id: "pid-zivotinje",
        title: "Životinje",
        emoji: "🐾",
        desc: "Trag: domaće i divlje, stanište i noge.",
        roundSize: 12,
        bank: bankZivotinje
      },
      {
        id: "pid-biljke",
        title: "Biljke",
        emoji: "🌱",
        desc: "Trag: biljke, dijelovi i što trebaju za rast.",
        roundSize: 10,
        bank: bankBiljke
      },
      {
        id: "pid-tijelo",
        title: "Moje tijelo",
        emoji: "🧍",
        desc: "Trag: dijelovi tijela, osjetila i zdravlje.",
        roundSize: 10,
        bank: bankTijelo
      },
      {
        id: "pid-dani",
        title: "Dani i doba dana",
        emoji: "🗓️",
        desc: "Trag: tjedan, pozdravi, jučer–danas–sutra (Nina i Tino).",
        roundSize: 12,
        bank: bankDani
      },
      {
        id: "pid-okolina",
        title: "Ja i okolina",
        emoji: "🏠",
        desc: "Trag: škola, obitelj, promet (zebra, 112) i okolina.",
        roundSize: 12,
        bank: bankOkolina
      }
    ]
  };
})(window);
