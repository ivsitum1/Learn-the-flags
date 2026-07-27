(function (global) {
  "use strict";

  function mcq(id, prompt, answer, choices, explain, diff) {
    return {
      id: id,
      type: "mcq",
      prompt: prompt,
      answer: answer,
      choices: choices,
      explain: explain || ("Točno je „" + answer + "“."),
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

  // --- Čujem, čujem (glasovi / tiho–glasno) ---
  var glasovi = [
    match(
      "nt-glas-match",
      "Spoji sliku (što čuješ) i glas. (Nina i Tino)",
      [
        ["pas", "VAU-VAU"],
        ["mačka", "MIJAU-MIJAU"],
        ["auto", "BRRR-BRRR"],
        ["valovi", "PLJUS-PLJUS"],
        ["vjetar", "FIJU-FIJU"],
        ["lišće", "ŠŠŠŠ-ŠŠŠŠ"]
      ],
      "Svaka stvar ima svoj glas.",
      2
    ),
    mcq("nt-glas-pas", "Koji je glas psa?", "VAU-VAU", ["MIJAU-MIJAU", "VAU-VAU", "PLJUS-PLJUS", "BRRR-BRRR"], "Pas laje: VAU-VAU."),
    mcq("nt-glas-macka", "Koji je glas mačke?", "MIJAU-MIJAU", ["VAU-VAU", "FIJU-FIJU", "MIJAU-MIJAU", "ŠŠŠŠ-ŠŠŠŠ"], "Mačka mjauče: MIJAU-MIJAU."),
    mcq("nt-glas-auto", "Koji je glas auta?", "BRRR-BRRR", ["PLJUS-PLJUS", "VAU-VAU", "BRRR-BRRR", "MIJAU-MIJAU"], "Motor auta: BRRR-BRRR."),
    mcq("nt-glas-more", "Koji je glas valova / mora?", "PLJUS-PLJUS", ["FIJU-FIJU", "PLJUS-PLJUS", "VAU-VAU", "BRRR-BRRR"], "Valovi: PLJUS-PLJUS."),
    mcq(
      "nt-tiho-glista",
      "Je li glista tiha ili glasna životinja?",
      "tiha",
      ["tiha", "glasna"],
      "Glista je tiha — ne čujemo je.",
      1
    ),
    mcq(
      "nt-tiho-leptir",
      "Je li leptir tiha ili glasna životinja?",
      "tiha",
      ["tiha", "glasna"],
      "Leptir je tih.",
      1
    ),
    mcq(
      "nt-tiho-riba",
      "Je li riba tiha ili glasna životinja?",
      "tiha",
      ["tiha", "glasna"],
      "Riba je tiha.",
      1
    ),
    mcq(
      "nt-glas-lav",
      "Je li lav tiha ili glasna životinja?",
      "glasna",
      ["tiha", "glasna"],
      "Lav riče — glasna je životinja.",
      1
    ),
    mcq(
      "nt-glas-pas2",
      "Je li pas tiha ili glasna životinja?",
      "glasna",
      ["tiha", "glasna"],
      "Pas laje — glasna je životinja.",
      1
    ),
    mcq(
      "nt-glas-kokos",
      "Je li kokoš tiha ili glasna životinja?",
      "glasna",
      ["tiha", "glasna"],
      "Kokoš kokoče — glasna je.",
      1
    ),
    mcq(
      "nt-glas-majmun",
      "Je li majmun tiha ili glasna životinja?",
      "glasna",
      ["tiha", "glasna"],
      "Majmun se čuje — glasna je životinja.",
      2
    ),
    mcq(
      "nt-tiho-mis",
      "Je li miš obično tiša ili glasnija životinja od lava?",
      "tiša",
      ["tiša", "glasnija"],
      "Miš je tiši od lava.",
      2
    ),
    tf(
      "nt-tf-krokodil",
      "Krokodil može biti glasna životinja.",
      true,
      "Krokodil može glasno režati ili škljocati čeljustima.",
      2
    ),
    mcq(
      "nt-p-glas",
      "Koje riječi počinju glasom P? (sve točne na P)",
      "pas, pero, pingvin",
      ["pas, pero, pingvin", "mačka, auto, more", "lav, riba, list", "šuma, voda, sunce"],
      "Pas, pero i pingvin počinju glasom P.",
      2
    ),
    mcq(
      "nt-tiha-rijec",
      "Koja je tiša riječ (tiši glas / šapat)?",
      "ššš",
      ["VAU!", "ššš", "BRRR!", "BUUM!"],
      "„ššš“ je tih glas.",
      1
    ),
    match(
      "nt-glas-zivotinje2",
      "Spoji životinju i glas. (Nina i Tino — škola stranih jezika)",
      [
        ["sova", "HUU-HUU"],
        ["golub", "GUGU-GUGU"],
        ["koza", "MEEE"],
        ["pijetao", "KUKURIKUUU"],
        ["vrabac", "ŽIV-ŽIV"],
        ["miš", "CIJUU-CIJUU"]
      ],
      "Svaka životinja ima svoj glas.",
      2
    ),
    mcq(
      "nt-glas-pogresno-ovca",
      "Što je zbrkano: ovca kaže KRE-KRE?",
      "ovca kaže BEE / MEEE, ne KRE-KRE",
      ["ovca kaže BEE / MEEE, ne KRE-KRE", "ovce ne postoje", "KRE-KRE je glas ovce", "sve je točno"],
      "U knjizi životinje zamijene glasove — ovca ne kreketá.",
      2
    ),
    mcq(
      "nt-glas-pogresno-krava",
      "Što je zbrkano: krava kaže MIJAU?",
      "krava kaže MUU, ne MIJAU",
      ["krava kaže MUU, ne MIJAU", "krave mjauču", "MIJAU je glas krave", "sve je točno"],
      "Krava muče: MUU.",
      2
    ),
    mcq(
      "nt-glas-uljez-pčela",
      "U nizu glasova MIJAU, VAU-VAU, MUU, KOKODA, ŽIV-ŽIV — koja životinja NEMA svoj glas u nizu?",
      "pčela",
      ["pas", "mačka", "pčela", "krava"],
      "Pčela zumzi; njezin glas nije u tom nizu.",
      2
    ),
    mcq(
      "nt-glas-hrana-mis",
      "Što ide mišu kao hrana u zadatku s tragom?",
      "sir",
      ["sir", "kost", "mrkva", "banana"],
      "Sir → miš.",
      1
    ),
    mcq(
      "nt-glas-hrana-pas",
      "Što ide psu kao hrana u zadatku s tragom?",
      "kost",
      ["sir", "kost", "mrkva", "med"],
      "Kost → pas.",
      1
    ),
    mcq(
      "nt-glas-hrana-zec",
      "Što ide zecu kao hrana u zadatku s tragom?",
      "mrkva",
      ["sir", "kost", "mrkva", "kostim"],
      "Mrkva → zec.",
      1
    ),
    mcq(
      "nt-glas-m-zivotinja",
      "Koja životinja počinje glasom M?",
      "mačka",
      ["pas", "mačka", "ptica", "riba"],
      "Mačka → M.",
      1
    )
  ];

  // --- Što ide zajedno / usporedbe ---
  var usporedbe = [
    match(
      "nt-usp-pribor",
      "Što ide zajedno? Spoji školski pribor. (Nina i Tino)",
      [
        ["olovka", "šiljilo"],
        ["bojica", "crtež"],
        ["gumica", "brisanje"],
        ["ravnalo", "crta"]
      ],
      "Školski pribor ide u paru po namjeni.",
      2
    ),
    mcq(
      "nt-usp-ne-pripada-1",
      "Što NE pripada nizu: bilježnica, olovka, šiljilo, automobil?",
      "automobil",
      ["bilježnica", "olovka", "šiljilo", "automobil"],
      "Automobil nije školski pribor.",
      1
    ),
    mcq(
      "nt-usp-ne-pripada-2",
      "Što NE pripada nizu: lubenica, jagoda, kruška, sunce?",
      "sunce",
      ["lubenica", "jagoda", "kruška", "sunce"],
      "Sunce nije voće.",
      1
    ),
    mcq(
      "nt-usp-ne-pripada-3",
      "Što NE pripada nizu: mrkva, miš, mjesec, lopta?",
      "lopta",
      ["mrkva", "miš", "mjesec", "lopta"],
      "Mrkva, miš i mjesec počinju glasom M; lopta ne.",
      2
    ),
    mcq(
      "nt-usp-vece",
      "Što znači zadatak „VEĆE“ uz mali crtež sunca?",
      "nacrtati veće sunce",
      ["precrtati sunce", "nacrtati veće sunce", "oboji manje sunce", "napisati riječ sunce"],
      "Uputa je nacrtati veći predmet od uzorka.",
      1
    ),
    mcq(
      "nt-usp-uredno",
      "Knjiga s urednim crtežima je…",
      "uredna",
      ["uredna", "neuredna"],
      "Uredna knjiga se oboji; neuredna se prekriži.",
      1
    ),
    tf(
      "nt-tf-neuredno",
      "Išarana knjiga „Najljepše bajke“ u zadatku je primjer neurednog.",
      true,
      "Neuredno se precrtava križićem.",
      1
    ),
    order(
      "nt-usp-niz-pribor",
      "Nastavi misao niza (redoslijed predmeta u nizu iz knjige):",
      ["olovka", "spužva", "bilježnica"],
      "U knjizi se niz ponavlja: olovka → spužva/gumica → bilježnica.",
      2
    ),
    mcq(
      "nt-usp-jutro",
      "Što od navedenog TIPIČNO radiš ujutro prije škole?",
      "pranje zubi",
      ["pranje zubi", "spavanje u krevetu cijeli dan", "vožnja biciklom noću", "samo igranje loptom"],
      "Ujutro se npr. pere zube i doručkuje; knjiga nudi više točnih izbora za zaokruživanje.",
      2
    ),
    mcq(
      "nt-usp-spoji-olovka",
      "Čemu najbolje ide olovka?",
      "šiljilo",
      ["vilica", "šiljilo", "čarapa", "kišobran"],
      "Olovka se šilji šiljilom.",
      1
    ),
    mcq(
      "nt-usp-uljez-more",
      "Što je ULJEZ u morskoj sceni (rak, riba, jež, zvijezda…)?",
      "pijetao ili slon",
      ["rak", "riba", "pijetao ili slon", "morska zvijezda"],
      "Pijetao i slon ne pripadaju moru.",
      2
    ),
    mcq(
      "nt-usp-knjiga-vrati",
      "Kako treba izgledati slikovnica koju vraćaš u knjižnicu?",
      "uredna i čista",
      ["uredna i čista", "išarana", "sa savijenim kutovima", "s ispadajućim listovima"],
      "Vraćamo urednu knjigu.",
      1
    ),
    mcq(
      "nt-usp-ne-pripada-knjige",
      "Što NE pripada među knjige/novine: kuharica, novine, mačka, slikovnica, bicikl?",
      "mačka i bicikl",
      ["kuharica", "novine", "mačka i bicikl", "slikovnica"],
      "Mačka i bicikl nisu knjige.",
      2
    ),
    mcq(
      "nt-usp-bio",
      "Što ide u BIO OTPAD?",
      "jezgra jabuke / kore banane",
      ["plastična boca", "jezgra jabuke / kore banane", "novine", "staklenka"],
      "Bio otpad su ostaci hrane.",
      2
    ),
    tf(
      "nt-tf-semafor",
      "Na prometnom semaforu crvena znači stati.",
      true,
      "Crveno = stoj.",
      1
    )
  ];

  // --- Pročitaj slike / riječi ---
  var rijeci = [
    match(
      "nt-rij-ima",
      "Pročitaj: tko/što IMA što? Spoji. (Nina i Tino)",
      [
        ["biciklist", "kaciga"],
        ["djevojčica", "kitka"],
        ["bicikl", "pedala"],
        ["cipela", "vezica"]
      ],
      "Čitamo sliku + IMA + dio.",
      2
    ),
    match(
      "nt-rij-parovi",
      "Pročitaj parove. Spoji što ide zajedno.",
      [
        ["puž", "kućica"],
        ["pas", "kost"],
        ["dijete", "sladoled"]
      ],
      "Svaki par „čita“ se slijeva nadesno.",
      1
    ),
    match(
      "nt-rij-boja",
      "Pročitaj: što JE koje boje?",
      [
        ["naranča", "narančasta"],
        ["banana", "žuta"],
        ["lubenica", "crvena"]
      ],
      "Voće i boja: naranča je narančasta, banana žuta, lubenica crvena.",
      1
    ),
    mcq(
      "nt-rij-sreca",
      "Početni glasovi: sir, rak, ekran, ćup, auto → koja riječ?",
      "SREĆA",
      ["ŠKOLA", "SREĆA", "SRCE", "SUNCE"],
      "S+R+E+Ć+A = SREĆA.",
      2
    ),
    mcq(
      "nt-rij-hvala-slova",
      "Koliko slova ima riječ HVALA?",
      "5",
      ["3", "4", "5", "6"],
      "H-V-A-L-A → 5 slova.",
      1
    ),
    mcq(
      "nt-rij-oprostiti-slova",
      "Koliko slova ima riječ OPROSTI?",
      "7",
      ["5", "6", "7", "8"],
      "O-P-R-O-S-T-I → 7 slova.",
      1
    ),
    mcq(
      "nt-rij-ima-kaciga",
      "Što IMA vozač bicikla radi sigurnosti?",
      "kacigu",
      ["kacigu", "kišobran", "jastuk", "vilicu"],
      "Biciklist ima kacigu.",
      1
    ),
    mcq(
      "nt-rij-pas-kost",
      "Što ide uz psa u zadatku „PROČITAJ“?",
      "kost",
      ["kućica", "kost", "sladoled", "lopta"],
      "Pas | kost.",
      1
    ),
    tf(
      "nt-tf-banana",
      "Banana JE žuta.",
      true,
      "U knjizi: banana JE + žuta boja.",
      1
    ),
    tf(
      "nt-tf-lubenica",
      "Lubenica JE plava.",
      false,
      "Lubenica JE crvena.",
      1
    ),
    match(
      "nt-rij-isti-glas",
      "Što počinje istim glasom? Spoji parove.",
      [
        ["miš", "mrav"],
        ["golub", "grožđe"],
        ["puž", "pčela"],
        ["jagoda", "jabuka"]
      ],
      "Isti početni glas: M, G, P, J.",
      2
    ),
    match(
      "nt-rij-zrcalo",
      "Pročitaj zrcalne riječi i spoji s ispravnim oblikom.",
      [
        ["ITSORPO", "OPROSTI"],
        ["ILOVZI", "IZVOLI"],
        ["ALAVH", "HVALA"],
        ["MILOM", "MOLIM"]
      ],
      "Zrcalni zapis lijepe riječi.",
      3
    ),
    mcq(
      "nt-rij-tino-bicikl",
      "Pročitaj: Tino JE NA…",
      "biciklu",
      ["biciklu", "krovu", "mjesecu", "stolu"],
      "Tino JE NA biciklu.",
      1
    ),
    mcq(
      "nt-rij-nina-lopta",
      "Pročitaj: Nina IMA…",
      "loptu",
      ["loptu", "brod", "šator", "kladivo"],
      "Nina IMA loptu.",
      1
    ),
    mcq(
      "nt-rij-lopta-gol",
      "Pročitaj: lopta JE U…",
      "golu",
      ["golu", "krevetu", "akvariju", "pečnici"],
      "Lopta JE U golu.",
      1
    )
  ];

  // --- Ispravi / ispričaj / rečenice ---
  var recenice = [
    mcq(
      "nt-rec-pidzama",
      "Ispravi zbrkanu rečenicu: „Ujutro sam obukla pidžamu.“ Što je logičnije ujutro obuti/obući?",
      "odjeću za dan (ne pidžamu)",
      ["odjeću za dan (ne pidžamu)", "kupaći kostim", "samo čarape", "ništa"],
      "Pidžama je za spavanje; ujutro se oblači dnevna odjeća.",
      2
    ),
    mcq(
      "nt-rec-pas",
      "Što je zbrkano: „U kupaonici se brijao moj pas.“?",
      "pas se ne brije (kao čovjek)",
      ["pas se ne brije (kao čovjek)", "nema kupaonice", "psi nemaju dlaku", "sve je točno"],
      "Brijanje je ljudska radnja — zato je smiješno.",
      2
    ),
    mcq(
      "nt-rec-riba",
      "Što je zbrkano: „Brat je prošetao ribicu.“?",
      "ribica se ne šeta na uzici",
      ["ribica se ne šeta na uzici", "brat ne postoji", "ribe nemaju vodu", "sve je točno"],
      "Ribica živi u vodi; šetnja je za psa.",
      2
    ),
    mcq(
      "nt-rec-akvarij",
      "Što je zbrkano: „Tata je plivao u akvariju.“?",
      "tata ne staje u akvarij (to je za ribe)",
      ["tata ne staje u akvarij (to je za ribe)", "akvarij nema vode", "tate ne plivaju", "sve je točno"],
      "U akvariju plivaju ribe, ne tata.",
      2
    ),
    mcq(
      "nt-rec-hvala",
      "Koja je lijepa riječ kad netko nešto učini za tebe?",
      "hvala",
      ["hvala", "brzo!", "daj!", "šutii"],
      "Kažemo hvala.",
      1
    ),
    mcq(
      "nt-rec-oprosti",
      "Koja je lijepa riječ kad nekoga naljutimo ili pogriješimo?",
      "oprosti",
      ["oprosti", "nisi kriv", "bježi", "šuti"],
      "Kažemo oprosti.",
      1
    ),
    match(
      "nt-rec-bonton",
      "Spoji bon-ton situaciju i odgovor.",
      [
        ["Jeste li vi moja učiteljica?", "Jesam! Dobro došla u prvi razred."],
        ["Dobro došao u prvi razred!", "Hvala! Radujem se druženju s tobom."],
        ["kucanje na vrata", "Dobar dan! / Oprostite na smetnji…"]
      ],
      "Lijepo ponašanje: pozdrav i zahvala.",
      2
    ),
    mcq(
      "nt-rec-molim",
      "Koje riječi pripadaju lijepom ponašanju?",
      "molim, hvala, oprosti, izvoli",
      ["molim, hvala, oprosti, izvoli", "brzo, odmah, šuti, daj", "samo ja, nikad, neću", "va, bu, ci"],
      "U knjizi: MOLIM, HVALA, OPROSTI, IZVOLI.",
      1
    ),
    tf(
      "nt-tf-slusaj",
      "Pažljivo slušam dok drugi govore — to je dobar školski dogovor.",
      true,
      "Jedna od tvrdnji iz „Prvi dani u školi“.",
      1
    ),
    mcq(
      "nt-rec-marta",
      "Iz zagonetke: „Marta je iznad Tonija.“ Gdje je Marta u odnosu na Tonija?",
      "iznad njega",
      ["iznad njega", "ispod njega", "pored učiteljice", "kod kuće"],
      "Trag kaže: Marta je iznad Tonija.",
      2
    ),
    tf(
      "nt-tf-sport-cestitam",
      "Pravi sportaši: pobjedniku se čestita na pobjedi.",
      true,
      "To je lijepo sportsko ponašanje.",
      1
    ),
    tf(
      "nt-tf-sport-rugati",
      "Pravi sportaši: tko pobijedi, smije se rugati.",
      false,
      "Ruganje nije fer-plej.",
      1
    ),
    tf(
      "nt-tf-sport-lose",
      "Ako izgubiš, znači da si loš.",
      false,
      "Normalno je pobjeđivati i gubiti.",
      1
    ),
    tf(
      "nt-tf-sport-normalno",
      "Normalno je pobjeđivati i gubiti.",
      true,
      "Tako stoji u knjizi o pravim sportašima.",
      1
    ),
    mcq(
      "nt-rec-knjiznica-bt",
      "U knjižnici: što kaže knjižničar kad daje knjigu?",
      "Izvoli.",
      ["Izvoli.", "Brzo!", "Šuti!", "Bježi!"],
      "Bon ton: Izvoli.",
      1
    ),
    mcq(
      "nt-rec-tiho-znak",
      "Što znači prst na ustima u knjižnici?",
      "treba biti tiho",
      ["treba biti tiho", "viči glasnije", "trči", "jedi"],
      "Znak za tišinu.",
      1
    )
  ];

  // --- Slova ---
  var slova = [
    mcq(
      "nt-sl-hvala",
      "Riječ HVALA ima koliko slova?",
      "5",
      ["4", "5", "6", "7"],
      "HVALA = 5 slova.",
      1
    ),
    mcq(
      "nt-sl-oprosti",
      "Riječ OPROSTI ima koliko slova?",
      "7",
      ["5", "6", "7", "8"],
      "OPROSTI = 7 slova.",
      1
    ),
    mcq(
      "nt-sl-sreca-s",
      "Koji je početni glas riječi sir?",
      "S",
      ["S", "R", "I", "Š"],
      "Sir → S.",
      1
    ),
    mcq(
      "nt-sl-sreca-r",
      "Koji je početni glas riječi rak?",
      "R",
      ["S", "R", "A", "K"],
      "Rak → R.",
      1
    ),
    mcq(
      "nt-sl-sreca-e",
      "Koji je početni glas riječi ekran?",
      "E",
      ["E", "K", "R", "A"],
      "Ekran → E.",
      1
    ),
    mcq(
      "nt-sl-sreca-c",
      "Koji je početni glas riječi ćup?",
      "Ć",
      ["C", "Č", "Ć", "K"],
      "Ćup → Ć.",
      2
    ),
    mcq(
      "nt-sl-sreca-a",
      "Koji je početni glas riječi auto?",
      "A",
      ["A", "U", "T", "O"],
      "Auto → A.",
      1
    ),
    order(
      "nt-sl-sreca-order",
      "Poredaj početne glasove da dobiješ SREĆA:",
      ["S", "R", "E", "Ć", "A"],
      "S+R+E+Ć+A = SREĆA.",
      2
    ),
    mcq(
      "nt-sl-p",
      "Koja riječ NE počinje glasom P?",
      "mačka",
      ["pas", "pero", "pingvin", "mačka"],
      "Mačka počinje glasom M.",
      1
    ),
    tf(
      "nt-tf-ime",
      "U školi učimo napisati svoje ime.",
      true,
      "Zadatak: NAPIŠI SVOJE IME.",
      1
    )
  ];

  // --- Škola / prvi dani ---
  var skola = [
    mcq(
      "nt-sk-riječi",
      "Koje riječi trebaš upotrebljavati u školi?",
      "molim, hvala, oprosti, izvoli",
      ["molim, hvala, oprosti, izvoli", "samo ja i nikad", "vikaj i guraj", "ništa od toga"],
      "Iz liste „Prvi dani u školi“.",
      1
    ),
    tf(
      "nt-sk-knjiznica",
      "Pristojno se ponašam u školskoj knjižnici.",
      true,
      "Tvrdnja iz samoprocjene.",
      1
    ),
    tf(
      "nt-sk-slušam",
      "Pažljivo slušam dok drugi govore.",
      true,
      "Tvrdnja iz samoprocjene.",
      1
    ),
    mcq(
      "nt-sk-osjecaj",
      "Kako se prvašići mogu osjećati prvog dana?",
      "sretno ili malo zabrinuto",
      ["samo ljutito uvijek", "sretno ili malo zabrinuto", "nikad ništa", "samo pospano"],
      "U knjizi se zaokružuju različita lica — više je moguće.",
      2
    ),
    mcq(
      "nt-sk-jutro-zubi",
      "Što spada u jutarnju pripremu za školu?",
      "pranje zubi",
      ["pranje zubi", "spavanje u školi", "bojanje zidova", "hranjenje lava"],
      "Četkica za zube je na listi jutarnjih radnji.",
      1
    ),
    mcq(
      "nt-sk-pernica",
      "Što može biti u pernici?",
      "olovke, gumica, šiljilo",
      ["olovke, gumica, šiljilo", "samo bicikl", "samo jastuk", "samo riba"],
      "Pernica drži školski pribor.",
      1
    ),
    match(
      "nt-sk-osoba",
      "Spoji tko si u školi.",
      [
        ["djevojčica", "učenica"],
        ["dječak", "učenik"]
      ],
      "Djevojčica → učenica; dječak → učenik.",
      1
    ),
    mcq(
      "nt-sk-paznja-igra",
      "Zašto u igri treba paziti?",
      "tako se nitko neće ozlijediti",
      ["tako se nitko neće ozlijediti", "da bude glasnije", "da se više svađamo", "nema razloga"],
      "Iz knjige: I U IGRI MORAMO PAZITI. TAKO SE NITKO NEĆE OZLIJEDITI.",
      1
    ),
    tf(
      "nt-sk-govorim",
      "Govorim tako da me ostali razumiju — to je važno u razredu.",
      true,
      "Tvrdnja iz „Prvi dani u školi“.",
      1
    ),
    mcq(
      "nt-sk-torba",
      "Što nosiš u školsku torbu?",
      "bilježnice i pribor",
      ["bilježnice i pribor", "samo snjegovića", "samo akvarij", "ništa nikad"],
      "Torba je za školske stvari.",
      1
    )
  ];

  global.CONTENT_NINA_TINO_HRV = {
    games: [
      {
        id: "hrv-nt-glasovi",
        title: "Čujem, čujem",
        emoji: "👂",
        desc: "Nina i Tino: glasovi, onomatopeja, tiho i glasno.",
        roundSize: 10,
        bank: glasovi
      },
      {
        id: "hrv-nt-usporedbe",
        title: "Što ide zajedno",
        emoji: "🔗",
        desc: "Nina i Tino: spoji, nizovi, što ne pripada, uredno/neuredno.",
        roundSize: 8,
        bank: usporedbe
      },
      {
        id: "hrv-nt-rijeci",
        title: "Pročitaj slike",
        emoji: "🖼️",
        desc: "Nina i Tino: IMA, JE, parovi i sastavljanje riječi.",
        roundSize: 8,
        bank: rijeci
      },
      {
        id: "hrv-nt-recenice",
        title: "Ispravi i ispričaj",
        emoji: "💬",
        desc: "Nina i Tino: zbrkane rečenice, hvala/oprosti, bon ton.",
        roundSize: 8,
        bank: recenice
      },
      {
        id: "hrv-nt-slova",
        title: "Slova i glasovi",
        emoji: "🔤",
        desc: "Nina i Tino: broj slova, početni glas, SREĆA.",
        roundSize: 8,
        bank: slova
      },
      {
        id: "hrv-nt-skola",
        title: "Prvi dani",
        emoji: "🏫",
        desc: "Nina i Tino: škola, lijepo ponašanje, jutarnje navike.",
        roundSize: 8,
        bank: skola
      }
    ]
  };
})(window);
