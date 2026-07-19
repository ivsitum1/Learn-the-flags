/*
 * Skupine država koje se lako zamijene — po IZGLEDU ZASTAVE ili po SLIČNOM NAZIVU.
 * Za svaku skupinu: kako ih razlikovati (savjet na hrvatskom).
 *   type: "flag" (slična zastava) ili "name" (sličan naziv)
 *   tip:  kratko objašnjenje razlike
 *   members: kodovi država u skupini
 */
window.CONFUSABLES = [
  // ---------- SLIČNE ZASTAVE ----------
  { type: "flag", members: ["dk", "se", "no", "fi", "is"],
    tip: "Sve imaju pomaknuti skandinavski križ. Danska: crveno + bijeli križ; Švedska: plavo + žuti; Norveška: crveno + bijelo-plavi; Finska: bijelo + plavi; Island: plavo + bijelo-crveni." },

  { type: "flag", members: ["ro", "td", "ad", "md"],
    tip: "Plavo-žuto-crvene okomite pruge. Rumunjska i Čad su gotovo identični (Čad ima tamniju plavu); Andora i Moldavija imaju grb u sredini." },

  { type: "flag", members: ["nl", "lu"],
    tip: "Crveno-bijelo-plave vodoravne pruge. Luksemburg je svjetlije plav i malo izduženiji od Nizozemske." },

  { type: "flag", members: ["id", "mc", "pl", "sg"],
    tip: "Crveno-bijele. Indonezija i Monako: crveno gore (Monako kvadratniji); Poljska je obrnuta (bijelo gore); Singapur ima polumjesec i zvijezde." },

  { type: "flag", members: ["ie", "it", "ci"],
    tip: "Okomite pruge. Irska: zeleno-bijelo-narančasto; Italija: zeleno-bijelo-crveno; Obala Bjelokosti: narančasto-bijelo-zeleno (obrnuta Irska)." },

  { type: "flag", members: ["ml", "gn", "sn", "cm"],
    tip: "Zeleno-žuto-crvene (panafričke). Mali: bez simbola; Gvineja: obrnuta (crveno-žuto-zeleno); Senegal: zelena zvijezda; Kamerun: crveno u sredini sa zvijezdom." },

  { type: "flag", members: ["co", "ec", "ve"],
    tip: "Žuto-plavo-crvene vodoravne (Velika Kolumbija). Kolumbija: bez grba; Ekvador i Venezuela imaju grb/zvijezde (Venezuela luk od zvijezda)." },

  { type: "flag", members: ["ru", "rs", "si", "sk"],
    tip: "Bijelo-plavo-crvene (panslavenske). Rusija: bez grba; Srbija, Slovenija i Slovačka imaju grb (Slovenija/Slovačka gore lijevo)." },

  { type: "flag", members: ["au", "nz"],
    tip: "Plava zastava s Union Jackom i Južnim križem. Australija: velika zvijezda Commonwealtha + 6 zvijezda; Novi Zeland: 4 crvene zvijezde s bijelim rubom." },

  { type: "flag", members: ["eg", "sy", "iq", "ye", "sd"],
    tip: "Crveno-bijelo-crne pruge (arapske boje). Razlikuju se po sredini: Egipat (orao), Sirija/Irak/Jemen (zvijezde/natpis), Sudan ima zeleni trokut uz jarbol." },

  { type: "flag", members: ["jo", "ps"],
    tip: "Crno-bijelo-zelene pruge s crvenim trokutom. Jordan ima bijelu sedmokraku zvijezdu u trokutu, Palestina nema." },

  { type: "flag", members: ["sv", "ni", "hn"],
    tip: "Plavo-bijelo-plave s grbom/zvijezdama (bivša Srednjoamerička federacija). Honduras ima 5 plavih zvijezda u sredini." },

  { type: "flag", members: ["ar", "uy"],
    tip: "Svijetloplavo-bijele sa 'Suncem svibnja'. Argentina: 3 vodoravne pruge, sunce u sredini; Urugvaj: 9 pruga, sunce u gornjem kutu." },

  { type: "flag", members: ["qa", "bh"],
    tip: "Bijelo-bordo s nazubljenim rubom. Katar je tamnije bordo i izduženiji (9 zubaca); Bahrein je crveniji (5 zubaca)." },

  { type: "flag", members: ["in", "ne"],
    tip: "Narančasto-bijelo-zelene vodoravne pruge. Indija ima plavi kotač (Ashoka) u sredini; Niger ima narančasti krug." },

  // ---------- SLIČNI NAZIVI ----------
  { type: "name", members: ["dm", "do"],
    tip: "Dominika je mali karipski otok; Dominikanska Republika je veća država koja dijeli otok Hispaniolu s Haitijem." },

  { type: "name", members: ["ne", "ng"],
    tip: "Niger (pustinjska, glavni grad Niamey) vs Nigerija (najmnogoljudnija afrička država, glavni grad Abuja)." },

  { type: "name", members: ["si", "sk"],
    tip: "Slovenija (Alpe, glavni grad Ljubljana) vs Slovačka (Tatre, glavni grad Bratislava)." },

  { type: "name", members: ["at", "au"],
    tip: "Austrija (Europa, glavni grad Beč) vs Australija (Oceanija, glavni grad Canberra) — na engleskom Austria vs Australia." },

  { type: "name", members: ["gn", "gw", "gq", "pg"],
    tip: "Četiri 'Gvineje': Gvineja i Gvineja Bisau (zapadna Afrika), Ekvatorska Gvineja (srednja Afrika) i Papua Nova Gvineja (Oceanija)." },

  { type: "name", members: ["kp", "kr"],
    tip: "Sjeverna Koreja (Pjongjang, izolirana) vs Južna Koreja (Seoul, tehnologija i K-pop)." },

  { type: "name", members: ["sd", "ss"],
    tip: "Sudan (sjever, Kartum) vs Južni Sudan (najmlađa svjetska država od 2011., Juba)." },

  { type: "name", members: ["cg", "cd"],
    tip: "Republika Kongo (glavni grad Brazzaville) vs Demokratska Republika Kongo (Kinshasa) — razdvaja ih rijeka Kongo." },

  { type: "name", members: ["ir", "iq"],
    tip: "Iran (perzijski, glavni grad Teheran) vs Irak (arapski, glavni grad Bagdad)." },

  { type: "name", members: ["kn", "lc", "vc"],
    tip: "Karipske države sa 'Sveti': Sveti Kristofor i Nevis, Sveta Lucija te Sveti Vincent i Grenadini." }
];
