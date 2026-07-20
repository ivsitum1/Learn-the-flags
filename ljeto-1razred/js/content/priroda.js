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
      explain: explain || ("Redoslijed: " + answer.join(", "))
    };
  }

  var godisnja = [];
  var seasons = ["proljeće", "ljeto", "jesen", "zima"];
  godisnja.push(order("Poredaj godišnja doba kako idu u godini (od proljeća).", seasons, "proljeće → ljeto → jesen → zima"));
  godisnja.push(mcq("Kad najčešće pada snijeg?", "zima", seasons, "Snijeg obično pada zimi."));
  godisnja.push(mcq("Kad je najtoplije?", "ljeto", seasons, "Ljeto je najtoplije godišnje doba."));
  godisnja.push(mcq("Kad lišće pada s drveća?", "jesen", seasons, "U jesen lišće žuti i pada."));
  godisnja.push(mcq("Kad cvjetaju mnogi cvjetovi?", "proljeće", seasons, "Proljeće je doba cvjetanja."));
  godisnja.push(mcq("Što obično nosimo zimi?", "kapu i jaknu", ["kratke hlače", "kapu i jaknu", "sandale", "majicu bez rukava"], "Zimi se toplo oblačimo."));
  godisnja.push(mcq("Što obično nosimo ljeti?", "kratke hlače", ["kaput", "čizme", "kratke hlače", "vunene rukavice"], "Ljeti je toplo."));
  godisnja.push(mcq("Koje je doba godine ako pada kiša i nosimo kišobran u ožujku?", "proljeće", seasons, "Ožujak je u proljeću."));
  godisnja.push(mcq("Što najbolje opisuje sunčan dan?", "vedro i toplo", ["magla i snijeg", "vedro i toplo", "led i mraz", "noć bez zvijezda"], "Sunčan dan je vedar."));
  [
    ["❄️", "zima"], ["☀️", "ljeto"], ["🍂", "jesen"], ["🌸", "proljeće"]
  ].forEach(function (row) {
    godisnja.push(mcq(
      "Koje godišnje doba podsjeća ovaj znak?",
      row[1],
      seasons,
      "Znak " + row[0] + " povezujemo s " + row[1] + ".",
      { kind: "text", text: row[0] }
    ));
  });
  godisnja.push(tf("Ljeto dolazi poslije proljeća.", true, "Red: proljeće, ljeto, jesen, zima."));
  godisnja.push(tf("Zima je najtoplije godišnje doba.", false, "Najtoplije je ljeto."));
  godisnja.push(tf("U jesen dani postaju kraći i hladniji.", true, "Jesen je prijelaz prema zimi."));
  godisnja.push(mcq("Što treba za kišni dan?", "kišobran", ["sunčane naočale", "kišobran", "kupaći kostim", "ventilator"], "Kišobran štiti od kiše."));
  godisnja.push(mcq("Koji mjesec je u ljetu?", "srpanj", ["siječanj", "ožujak", "srpanj", "listopad"], "Srpanj je ljetni mjesec."));
  godisnja.push(mcq("Koji mjesec je u zimi?", "siječanj", ["srpanj", "svibanj", "siječanj", "rujan"], "Siječanj je zimski mjesec."));
  godisnja.push(mcq("Što biljke trebaju da rastu?", "svjetlost i vodu", ["samo kamenje", "svjetlost i vodu", "samo vjetar", "plastiku"], "Biljke trebaju svjetlost, vodu i hranjive tvari."));
  godisnja.push({
    type: "match",
    prompt: "Spoji godišnje doba i tipičnu vremensku sliku.",
    pairs: [["zima", "snijeg"], ["ljeto", "vrućina"], ["jesen", "lišće"]],
    explain: "Zima–snijeg, ljeto–vrućina, jesen–lišće."
  });
  godisnja.push(mcq("Što radimo da se zaštitimo od sunca ljeti?", "stavimo kremu / šešir", ["jedemo snijeg", "stavimo kremu / šešir", "gasimo grijanje", "nosimo čizme"], "Štitimo kožu i glavu."));
  // padding to 25+
  ["prosinac", "lipanj", "rujan", "travanj"].forEach(function (m, i) {
    var ans = ["zima", "ljeto", "jesen", "proljeće"][i];
    godisnja.push(mcq("U koje godišnje doba spada " + m + "?", ans, seasons, m + " je u dobu: " + ans + "."));
  });
  godisnja.push(mcq("Što vjetar radi?", "miče zrak", ["zaustavlja kišu", "miče zrak", "gasi sunce", "pravi snijeg sam"], "Vjetar je gibanje zraka."));
  godisnja.push(tf("Oblaci mogu donijeti kišu.", true, "Iz oblaka može pasti kiša."));
  godisnja.push(tf("Zimi uvijek mora biti snijeg.", false, "Zima može biti hladna i bez snijega."));

  var ziva = [];
  var animals = ["pas", "mačka", "krava", "lav", "ptica", "riba", "pčela", "žaba"];
  ziva.push(mcq("Što je živo biće?", "pas", ["kamen", "pas", "stol", "lopta"], "Pas je živo biće."));
  ziva.push(mcq("Što nije živo biće?", "kamen", ["cvijet", "ptica", "kamen", "riba"], "Kamen nije živ."));
  ziva.push(mcq("Koja je domaća životinja?", "krava", ["lav", "krava", "vuk", "medvjed"], "Krava živi uz čovjeka."));
  ziva.push(mcq("Koja je divlja životinja?", "lav", ["pas", "mačka", "krava", "lav"], "Lav živi u divljini."));
  ziva.push(mcq("Što biljke rade na suncu?", "rastu / hrane se", ["trče", "rastu / hrane se", "laju", "čitaju"], "Biljke koriste svjetlost."));
  ziva.push(mcq("Gdje živi riba?", "u vodi", ["na drvetu", "u vodi", "u zraku", "u pustinji bez vode"], "Ribe žive u vodi."));
  ziva.push(mcq("Što pčela skuplja?", "nektar / pelud", ["kamenje", "nektar / pelud", "snijeg", "papir"], "Pčele skupljaju nektar i pelud."));
  ziva.push(mcq("Tko ima perje?", "ptica", ["pas", "riba", "ptica", "žaba"], "Ptice imaju perje."));
  ziva.push(mcq("Tko ima krzno?", "mačka", ["riba", "ptica", "mačka", "zmija"], "Mačka ima krzno."));
  ziva.push(tf("Biljke trebaju vodu.", true, "Bez vode biljke uvenu."));
  ziva.push(tf("Životinje ne trebaju hranu.", false, "Sva živa bića trebaju hranu."));
  ziva.push(tf("Drvo je biljka.", true, "Drvo je velika biljka."));
  ziva.push(mcq("Što treba svim živim bićima?", "zrak, voda, hrana", ["samo igračke", "zrak, voda, hrana", "samo TV", "samo kamen"], "Osnovne potrebe života."));
  ziva.push({
    type: "match",
    prompt: "Spoji životinju i gdje živi.",
    pairs: [["riba", "voda"], ["ptica", "zrak / gnijezdo"], ["krava", "štala / pašnjak"]],
    explain: "Svaka životinja ima svoje stanište."
  });
  ziva.push(mcq("Što je plod stabla jabuke?", "jabuka", ["list", "jabuka", "korijen", "grana"], "Jabuka je plod."));
  ziva.push(mcq("Koji dio biljke je u zemlji?", "korijen", ["cvijet", "list", "korijen", "plod"], "Korijen je u tlu."));
  [
    ["🐶", "pas"], ["🐱", "mačka"], ["🐮", "krava"], ["🦁", "lav"],
    ["🐦", "ptica"], ["🐟", "riba"], ["🐝", "pčela"], ["🐸", "žaba"]
  ].forEach(function (row) {
    ziva.push(mcq(
      "Koja je ovo životinja?",
      row[1],
      animals,
      "To je " + row[1] + ".",
      { kind: "text", text: row[0] }
    ));
  });
  ziva.push(mcq("Što mačka najčešće jede (u prirodi / kao mesožder)?", "meso", ["samo travu", "meso", "kamenje", "papir"], "Mačka je mesožder."));
  ziva.push(mcq("Što krava daje čovjeku?", "mlijeko", ["med", "mlijeko", "jaja od krave", "vunu kao ovca uvijek"], "Krave daju mlijeko."));
  ziva.push(tf("Cvijet je dio biljke.", true, "Cvijet pripada biljci."));
  ziva.push(tf("Auto je živo biće.", false, "Auto nije živ."));

  var okolina = [];
  okolina.push(mcq("Čime vidimo?", "očima", ["ušima", "očima", "nosom", "rukama"], "Vidimo očima."));
  okolina.push(mcq("Čime čujemo?", "ušima", ["očima", "ušima", "jezikom", "nogama"], "Čujemo ušima."));
  okolina.push(mcq("Čime mirišemo?", "nosom", ["ušima", "očima", "nosom", "kosom"], "Miris osjećamo nosom."));
  okolina.push(mcq("Čime hodamo?", "nogama", ["rukama", "nogama", "očima", "ušima"], "Hodamo nogama."));
  okolina.push(mcq("Tko živi u obitelji?", "roditelji i djeca", ["samo učitelji", "roditelji i djeca", "samo auti", "samo životinje"], "Obitelj su bliske osobe koje žive zajedno."));
  okolina.push(mcq("Gdje učimo čitati i pisati?", "u školi", ["na igralištu samo", "u školi", "u trgovini", "u šumi"], "U školi učimo."));
  okolina.push(mcq("Što radimo na zebri na cesti?", "oprezno prelazimo", ["trčimo zatvorenih očiju", "oprezno prelazimo", "igramo nogomet", "spavamo"], "Na zebri oprezno prelazimo cestu."));
  okolina.push(mcq("Koja boja na semaforu znači „stani“?", "crvena", ["zelena", "žuta", "crvena", "plava"], "Crvena = stani."));
  okolina.push(mcq("Koja boja na semaforu znači „idi“?", "zelena", ["crvena", "zelena", "plava", "narančasta"], "Zelena = idi."));
  okolina.push(mcq("Glavni grad Hrvatske je…", "Zagreb", ["Split", "Zagreb", "Rijeka", "Osijek"], "Glavni grad je Zagreb."));
  okolina.push(mcq("Na hrvatskoj zastavi ima…", "crvena, bijela i plava", ["samo zelena", "crvena, bijela i plava", "samo žuta", "crna i narančasta"], "Zastava je crveno-bijelo-plava."));
  okolina.push(tf("Treba prati ruke prije jela.", true, "Čiste ruke štite zdravlje."));
  okolina.push(tf("Smijemo trčati na cesti među autima.", false, "Cesta nije mjesto za igru."));
  okolina.push(tf("U školi pomažemo jedni drugima.", true, "Prijateljstvo i pomoć su važni."));
  okolina.push({
    type: "match",
    prompt: "Spoji dio tijela i osjetilo.",
    pairs: [["oko", "vid"], ["uho", "sluh"], ["nos", "njuh"]],
    explain: "Oko–vid, uho–sluh, nos–njuh."
  });
  okolina.push(mcq("Što pripada školi?", "učionica", ["plaža samo", "učionica", "šuma samo", "tvornica auta"], "Učionica je dio škole."));
  okolina.push(mcq("Tko nas uči u školi?", "učitelj / učiteljica", ["vozač autobusa", "učitelj / učiteljica", "prodavač", "policajac uvijek"], "Uči nas učitelj ili učiteljica."));
  okolina.push(mcq("Što radimo kad smo bolesni?", "odmaramo se / idemo liječniku", ["trčimo cijeli dan", "odmaramo se / idemo liječniku", "ne pijemo vodu", "igramo na cesti"], "Brinemo o zdravlju."));
  okolina.push(mcq("Gdje bacamo otpad?", "u koš za smeće", ["na pod", "u koš za smeće", "u rijeku", "na cestu"], "Otpad ide u koš."));
  okolina.push(mcq("Što je važno u razgovoru?", "slušati drugoga", ["vikati", "slušati drugoga", "prekidati uvijek", "okretati leđa"], "Slušanje pokazuje poštovanje."));
  okolina.push(order("Poredaj: jutro, podne, večer.", ["jutro", "podne", "večer"], "Dan ide od jutra do večeri."));
  okolina.push(mcq("Koja je naša zemlja?", "Hrvatska", ["Italija", "Hrvatska", "Njemačka", "Francuska"], "Živimo u Hrvatskoj."));
  okolina.push(mcq("Što radimo na pješačkom prijelazu?", "gledamo lijevo i desno", ["trčimo odmah", "gledamo lijevo i desno", "zatvorimo oči", "slušamo glazbu jako"], "Prvo pogledamo cestu."));
  okolina.push(tf("Zubi se peru ujutro i navečer.", true, "Higijena zubi je važna."));
  okolina.push(tf("Svatko ima pravo na poštovanje.", true, "Poštujemo sebe i druge."));
  okolina.push(mcq("Koji dio tijela štiti glavu u biciklizmu?", "kaciga", ["rukavice samo", "kaciga", "nema ništa", "šal samo"], "Kaciga štiti glavu."));
  okolina.push({
    type: "match",
    prompt: "Spoji mjesto i što tamo radimo.",
    pairs: [["škola", "učimo"], ["park", "igramo se"], ["kuća", "odmaramo se"]],
    explain: "Škola–učimo, park–igra, kuća–odmor."
  });

  global.CONTENT_PRIRODA = {
    id: "priroda",
    title: "Priroda i društvo",
    icon: "🌿",
    blurb: "Godišnja doba, živa bića te ja i moja okolina.",
    color: "pid",
    games: [
      {
        id: "pid-godisnja",
        title: "Godišnja doba",
        emoji: "🌤️",
        desc: "Proljeće, ljeto, jesen, zima — vrijeme i odjeća.",
        roundSize: 10,
        bank: godisnja
      },
      {
        id: "pid-ziva",
        title: "Živa bića",
        emoji: "🐾",
        desc: "Biljke i životinje, domaće i divlje.",
        roundSize: 10,
        bank: ziva
      },
      {
        id: "pid-okolina",
        title: "Ja i okolina",
        emoji: "🏠",
        desc: "Tijelo, obitelj, škola, promet i Hrvatska.",
        roundSize: 10,
        bank: okolina
      }
    ]
  };
})(window);
