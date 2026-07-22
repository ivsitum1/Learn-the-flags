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
      explain: explain || ("Redoslijed: " + answer.join(", "))
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
  godisnja.push({
    id: "match-season-weather",
    type: "match",
    prompt: "Spoji godišnje doba i tipičnu vremensku sliku.",
    pairs: [["zima", "snijeg"], ["ljeto", "vrućina"], ["jesen", "lišće"], ["proljeće", "cvijeće"]],
    explain: "Zima–snijeg, ljeto–vrućina, jesen–lišće, proljeće–cvijeće."
  });

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

  living.forEach(function (name, idx) {
    if (idx % 2 !== 0) return;
    ziva.push(
      tf("tf-live-" + name, name.charAt(0).toUpperCase() + name.slice(1) + " je živo biće.", true, "Da, " + name + " je živo.")
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
  ziva.push({
    id: "match-animal-home",
    type: "match",
    prompt: "Spoji životinju i mjesto.",
    pairs: [["riba", "voda"], ["ptica", "gnijezdo"], ["pas", "kuća"], ["pčela", "košnica"]],
    explain: "Riba–voda, ptica–gnijezdo, pas–kuća, pčela–košnica."
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
      "Jutro → podne → večer."
    )
  );
  okolina.push(mcq("country", "Koja je naša zemlja?", "Hrvatska", ["Italija", "Hrvatska", "Njemačka", "Francuska"], "Živimo u Hrvatskoj."));
  okolina.push(mcq("capital", "Koji je glavni grad Hrvatske?", "Zagreb", ["Split", "Zagreb", "Rijeka", "Osijek"], "Glavni grad je Zagreb."));
  okolina.push(mcq("sea", "Uz koje more leži Hrvatska?", "Jadransko more", ["Crno more", "Jadransko more", "Sjeverno more", "Baltičko more"], "Hrvatska leži uz Jadransko more."));
  okolina.push(mcq("cross", "Što radimo na pješačkom prijelazu?", "gledamo lijevo i desno", ["trčimo odmah", "gledamo lijevo i desno", "zatvorimo oči", "slušamo glazbu jako"], "Prvo pogledamo cestu."));
  okolina.push(mcq("trash", "Gdje bacamo otpad?", "u koš za smeće", ["na pod", "u koš za smeće", "u rijeku", "na cestu"], "Otpad ide u koš."));
  okolina.push(mcq("listen", "Što je važno u razgovoru?", "slušati drugoga", ["vikati", "slušati drugoga", "prekidati uvijek", "okretati leđa"], "Slušanje pokazuje poštovanje."));
  okolina.push(mcq("sick", "Što radimo kad smo bolesni?", "odmaramo se / idemo liječniku", ["trčimo cijeli dan", "odmaramo se / idemo liječniku", "ne pijemo vodu", "igramo na cesti"], "Brinemo o zdravlju."));
  okolina.push(mcq("helmet", "Koji dio opreme štiti glavu u biciklizmu?", "kaciga", ["rukavice samo", "kaciga", "nema ništa", "šal samo"], "Kaciga štiti glavu."));
  okolina.push(mcq("teacher", "Tko nas uči u školi?", "učitelj / učiteljica", ["vozač autobusa", "učitelj / učiteljica", "prodavač", "policajac uvijek"], "Uči nas učitelj ili učiteljica."));
  okolina.push(tf("tf-teeth", "Zubi se peru ujutro i navečer.", true, "Higijena zubi je važna."));
  okolina.push(tf("tf-respect", "Svatko ima pravo na poštovanje.", true, "Poštujemo sebe i druge."));
  okolina.push(tf("tf-litter", "Otpad bacamo u rijeku.", false, "Otpad ide u koš."));
  okolina.push(tf("tf-red-go", "Na crvenom svjetlu trčimo preko ceste.", false, "Na crvenom stanemo."));
  okolina.push(tf("tf-hr", "Hrvatska je naša domovina.", true, "Da."));
  okolina.push({
    id: "match-place-action",
    type: "match",
    prompt: "Spoji mjesto i što tamo radimo.",
    pairs: [
      ["škola", "učimo"],
      ["park", "igramo se"],
      ["knjižnica", "posuđujemo knjige"]
    ],
    explain: "U školi učimo, u parku se igramo, u knjižnici posuđujemo knjige."
  });
  okolina.push({
    id: "match-light",
    type: "match",
    prompt: "Spoji boju semafora i što radimo.",
    pairs: [["crveno", "stani"], ["žuto", "pripremi se"], ["zeleno", "idi oprezno"]],
    explain: "Crveno–stani, žuto–pripremi se, zeleno–idi."
  });

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

  global.CONTENT_PRIRODA = {
    id: "priroda",
    title: "Priroda i društvo",
    icon: "🌿",
    blurb: "Velika banka: godišnja doba, živa bića te ja i okolina.",
    color: "pid",
    games: [
      {
        id: "pid-godisnja",
        title: "Godišnja doba",
        emoji: "🌤️",
        desc: "Mjeseci, doba, vrijeme i odjeća — bez ponavljanja.",
        roundSize: 12,
        bank: godisnja
      },
      {
        id: "pid-ziva",
        title: "Živa bića",
        emoji: "🐾",
        desc: "Biljke i životinje, domaće i divlje — velika banka.",
        roundSize: 12,
        bank: ziva
      },
      {
        id: "pid-okolina",
        title: "Ja i okolina",
        emoji: "🏠",
        desc: "Tijelo, obitelj, škola, promet i Hrvatska.",
        roundSize: 12,
        bank: okolina
      }
    ]
  };
})(window);
