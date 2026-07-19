/*
 * Skupine država koje se lako zamijene — po IZGLEDU ZASTAVE ili SLIČNOM NAZIVU.
 *   type: "flag" | "name"
 *   tip:  { hr, en, de, it, es } — kako ih razlikovati
 *   members: kodovi država u skupini
 */
window.CONFUSABLES = [
  // ---------- SLIČNE ZASTAVE ----------
  { type: "flag", members: ["dk", "se", "no", "fi", "is"], tip: {
    hr: "Sve imaju pomaknuti skandinavski križ. Danska: crveno + bijeli križ; Švedska: plavo + žuti; Norveška: crveno + bijelo-plavi; Finska: bijelo + plavi; Island: plavo + bijelo-crveni.",
    en: "All have an off-centre Nordic cross. Denmark: red + white cross; Sweden: blue + yellow; Norway: red + white-blue; Finland: white + blue; Iceland: blue + white-red.",
    de: "Alle haben ein verschobenes skandinavisches Kreuz. Dänemark: Rot + weißes Kreuz; Schweden: Blau + gelb; Norwegen: Rot + weiß-blau; Finnland: Weiß + blau; Island: Blau + weiß-rot.",
    it: "Tutte hanno una croce nordica spostata. Danimarca: rosso + croce bianca; Svezia: blu + gialla; Norvegia: rosso + bianco-blu; Finlandia: bianco + blu; Islanda: blu + bianco-rosso.",
    es: "Todas tienen una cruz nórdica descentrada. Dinamarca: rojo + cruz blanca; Suecia: azul + amarilla; Noruega: rojo + blanco-azul; Finlandia: blanco + azul; Islandia: azul + blanco-rojo." } },

  { type: "flag", members: ["ro", "td", "ad", "md"], tip: {
    hr: "Plavo-žuto-crvene okomite pruge. Rumunjska i Čad su gotovo identični (Čad ima tamniju plavu); Andora i Moldavija imaju grb u sredini.",
    en: "Blue-yellow-red vertical stripes. Romania and Chad are almost identical (Chad's blue is darker); Andorra and Moldova have a coat of arms in the centre.",
    de: "Blau-gelb-rote senkrechte Streifen. Rumänien und Tschad sind fast identisch (Tschads Blau ist dunkler); Andorra und Moldau haben ein Wappen in der Mitte.",
    it: "Strisce verticali blu-giallo-rosso. Romania e Ciad sono quasi identiche (il blu del Ciad è più scuro); Andorra e Moldavia hanno uno stemma al centro.",
    es: "Franjas verticales azul-amarillo-rojo. Rumanía y Chad son casi idénticas (el azul de Chad es más oscuro); Andorra y Moldavia tienen un escudo en el centro." } },

  { type: "flag", members: ["nl", "lu"], tip: {
    hr: "Crveno-bijelo-plave vodoravne pruge. Luksemburg je svjetlije plav i malo izduženiji od Nizozemske.",
    en: "Red-white-blue horizontal stripes. Luxembourg is a lighter blue and slightly longer than the Netherlands.",
    de: "Rot-weiß-blaue waagerechte Streifen. Luxemburg ist heller blau und etwas länger als die Niederlande.",
    it: "Strisce orizzontali rosso-bianco-blu. Il Lussemburgo ha un blu più chiaro ed è un po' più allungato dei Paesi Bassi.",
    es: "Franjas horizontales rojo-blanco-azul. Luxemburgo tiene un azul más claro y es algo más alargada que los Países Bajos." } },

  { type: "flag", members: ["id", "mc", "pl", "sg"], tip: {
    hr: "Crveno-bijele. Indonezija i Monako: crveno gore (Monako kvadratniji); Poljska je obrnuta (bijelo gore); Singapur ima polumjesec i zvijezde.",
    en: "Red and white. Indonesia and Monaco: red on top (Monaco more square); Poland is reversed (white on top); Singapore has a crescent and stars.",
    de: "Rot-weiß. Indonesien und Monaco: Rot oben (Monaco quadratischer); Polen ist umgekehrt (Weiß oben); Singapur hat Halbmond und Sterne.",
    it: "Rosso e bianco. Indonesia e Monaco: rosso in alto (Monaco più quadrata); Polonia è invertita (bianco in alto); Singapore ha mezzaluna e stelle.",
    es: "Rojo y blanco. Indonesia y Mónaco: rojo arriba (Mónaco más cuadrada); Polonia está invertida (blanco arriba); Singapur tiene media luna y estrellas." } },

  { type: "flag", members: ["ie", "it", "ci"], tip: {
    hr: "Okomite pruge. Irska: zeleno-bijelo-narančasto; Italija: zeleno-bijelo-crveno; Obala Bjelokosti: narančasto-bijelo-zeleno (obrnuta Irska).",
    en: "Vertical stripes. Ireland: green-white-orange; Italy: green-white-red; Côte d'Ivoire: orange-white-green (reversed Ireland).",
    de: "Senkrechte Streifen. Irland: grün-weiß-orange; Italien: grün-weiß-rot; Elfenbeinküste: orange-weiß-grün (umgekehrtes Irland).",
    it: "Strisce verticali. Irlanda: verde-bianco-arancione; Italia: verde-bianco-rosso; Costa d'Avorio: arancione-bianco-verde (Irlanda invertita).",
    es: "Franjas verticales. Irlanda: verde-blanco-naranja; Italia: verde-blanco-rojo; Costa de Marfil: naranja-blanco-verde (Irlanda invertida)." } },

  { type: "flag", members: ["ml", "gn", "sn", "cm"], tip: {
    hr: "Zeleno-žuto-crvene (panafričke). Mali: bez simbola; Gvineja: obrnuta (crveno-žuto-zeleno); Senegal: zelena zvijezda; Kamerun: crveno u sredini sa zvijezdom.",
    en: "Green-yellow-red (Pan-African). Mali: no symbol; Guinea: reversed (red-yellow-green); Senegal: green star; Cameroon: red in the middle with a star.",
    de: "Grün-gelb-rot (panafrikanisch). Mali: kein Symbol; Guinea: umgekehrt (rot-gelb-grün); Senegal: grüner Stern; Kamerun: Rot in der Mitte mit Stern.",
    it: "Verde-giallo-rosso (panafricane). Mali: nessun simbolo; Guinea: invertita (rosso-giallo-verde); Senegal: stella verde; Camerun: rosso al centro con stella.",
    es: "Verde-amarillo-rojo (panafricanas). Malí: sin símbolo; Guinea: invertida (rojo-amarillo-verde); Senegal: estrella verde; Camerún: rojo al centro con estrella." } },

  { type: "flag", members: ["co", "ec", "ve"], tip: {
    hr: "Žuto-plavo-crvene vodoravne (Velika Kolumbija). Kolumbija: bez grba; Ekvador i Venezuela imaju grb/zvijezde (Venezuela luk od zvijezda).",
    en: "Yellow-blue-red horizontal (Gran Colombia). Colombia: no emblem; Ecuador and Venezuela have an emblem/stars (Venezuela an arc of stars).",
    de: "Gelb-blau-rot waagerecht (Großkolumbien). Kolumbien: kein Wappen; Ecuador und Venezuela haben Wappen/Sterne (Venezuela einen Sternenbogen).",
    it: "Giallo-blu-rosso orizzontali (Grande Colombia). Colombia: senza stemma; Ecuador e Venezuela hanno stemma/stelle (Venezuela un arco di stelle).",
    es: "Amarillo-azul-rojo horizontales (Gran Colombia). Colombia: sin escudo; Ecuador y Venezuela tienen escudo/estrellas (Venezuela un arco de estrellas)." } },

  { type: "flag", members: ["ru", "rs", "si", "sk"], tip: {
    hr: "Bijelo-plavo-crvene (panslavenske). Rusija: bez grba; Srbija, Slovenija i Slovačka imaju grb (Slovenija/Slovačka gore lijevo).",
    en: "White-blue-red (Pan-Slavic). Russia: no emblem; Serbia, Slovenia and Slovakia have an emblem (Slovenia/Slovakia top-left).",
    de: "Weiß-blau-rot (panslawisch). Russland: kein Wappen; Serbien, Slowenien und die Slowakei haben ein Wappen (Slowenien/Slowakei oben links).",
    it: "Bianco-blu-rosso (panslave). Russia: senza stemma; Serbia, Slovenia e Slovacchia hanno uno stemma (Slovenia/Slovacchia in alto a sinistra).",
    es: "Blanco-azul-rojo (paneslavas). Rusia: sin escudo; Serbia, Eslovenia y Eslovaquia tienen escudo (Eslovenia/Eslovaquia arriba a la izquierda)." } },

  { type: "flag", members: ["au", "nz"], tip: {
    hr: "Plava zastava s Union Jackom i Južnim križem. Australija: velika zvijezda Commonwealtha + 6 zvijezda; Novi Zeland: 4 crvene zvijezde s bijelim rubom.",
    en: "Blue flag with the Union Jack and Southern Cross. Australia: large Commonwealth star + 6 stars; New Zealand: 4 red stars with white borders.",
    de: "Blaue Flagge mit Union Jack und Kreuz des Südens. Australien: großer Commonwealth-Stern + 6 Sterne; Neuseeland: 4 rote Sterne mit weißem Rand.",
    it: "Bandiera blu con Union Jack e Croce del Sud. Australia: grande stella del Commonwealth + 6 stelle; Nuova Zelanda: 4 stelle rosse con bordo bianco.",
    es: "Bandera azul con la Union Jack y la Cruz del Sur. Australia: gran estrella de la Commonwealth + 6 estrellas; Nueva Zelanda: 4 estrellas rojas con borde blanco." } },

  { type: "flag", members: ["eg", "sy", "iq", "ye", "sd"], tip: {
    hr: "Crveno-bijelo-crne pruge (arapske boje). Razlikuju se po sredini: Egipat (orao), Sirija/Irak/Jemen (zvijezde/natpis), Sudan ima zeleni trokut uz jarbol.",
    en: "Red-white-black stripes (Arab colours). They differ by the centre: Egypt (eagle), Syria/Iraq/Yemen (stars/text), Sudan has a green triangle at the hoist.",
    de: "Rot-weiß-schwarze Streifen (arabische Farben). Unterschied in der Mitte: Ägypten (Adler), Syrien/Irak/Jemen (Sterne/Schrift), Sudan mit grünem Dreieck am Mast.",
    it: "Strisce rosso-bianco-nero (colori arabi). Si distinguono al centro: Egitto (aquila), Siria/Iraq/Yemen (stelle/scritte), Sudan ha un triangolo verde all'asta.",
    es: "Franjas rojo-blanco-negro (colores árabes). Se distinguen por el centro: Egipto (águila), Siria/Irak/Yemen (estrellas/texto), Sudán con triángulo verde junto al asta." } },

  { type: "flag", members: ["jo", "ps"], tip: {
    hr: "Crno-bijelo-zelene pruge s crvenim trokutom. Jordan ima bijelu sedmokraku zvijezdu u trokutu, Palestina nema.",
    en: "Black-white-green stripes with a red triangle. Jordan has a white seven-pointed star in the triangle; Palestine does not.",
    de: "Schwarz-weiß-grüne Streifen mit rotem Dreieck. Jordanien hat einen weißen siebenzackigen Stern im Dreieck, Palästina nicht.",
    it: "Strisce nero-bianco-verde con triangolo rosso. La Giordania ha una stella bianca a sette punte nel triangolo; la Palestina no.",
    es: "Franjas negro-blanco-verde con triángulo rojo. Jordania tiene una estrella blanca de siete puntas en el triángulo; Palestina no." } },

  { type: "flag", members: ["sv", "ni", "hn"], tip: {
    hr: "Plavo-bijelo-plave s grbom/zvijezdama (bivša Srednjoamerička federacija). Honduras ima 5 plavih zvijezda u sredini.",
    en: "Blue-white-blue with an emblem/stars (former Federal Republic of Central America). Honduras has 5 blue stars in the centre.",
    de: "Blau-weiß-blau mit Wappen/Sternen (ehem. Zentralamerikanische Föderation). Honduras hat 5 blaue Sterne in der Mitte.",
    it: "Blu-bianco-blu con stemma/stelle (ex Repubblica Federale Centroamericana). L'Honduras ha 5 stelle blu al centro.",
    es: "Azul-blanco-azul con escudo/estrellas (antigua Federación Centroamericana). Honduras tiene 5 estrellas azules en el centro." } },

  { type: "flag", members: ["ar", "uy"], tip: {
    hr: "Svijetloplavo-bijele sa 'Suncem svibnja'. Argentina: 3 vodoravne pruge, sunce u sredini; Urugvaj: 9 pruga, sunce u gornjem kutu.",
    en: "Light-blue and white with the 'Sun of May'. Argentina: 3 horizontal stripes, sun in the centre; Uruguay: 9 stripes, sun in the top corner.",
    de: "Hellblau-weiß mit der 'Maisonne'. Argentinien: 3 waagerechte Streifen, Sonne in der Mitte; Uruguay: 9 Streifen, Sonne in der oberen Ecke.",
    it: "Azzurro e bianco con il 'Sole di Maggio'. Argentina: 3 strisce orizzontali, sole al centro; Uruguay: 9 strisce, sole nell'angolo in alto.",
    es: "Celeste y blanco con el 'Sol de Mayo'. Argentina: 3 franjas horizontales, sol al centro; Uruguay: 9 franjas, sol en la esquina superior." } },

  { type: "flag", members: ["qa", "bh"], tip: {
    hr: "Bijelo-bordo s nazubljenim rubom. Katar je tamnije bordo i izduženiji (9 zubaca); Bahrein je crveniji (5 zubaca).",
    en: "White and maroon with a serrated edge. Qatar is darker maroon and more elongated (9 points); Bahrain is redder (5 points).",
    de: "Weiß-bordeaux mit gezacktem Rand. Katar ist dunkler bordeaux und länger (9 Zacken); Bahrain ist röter (5 Zacken).",
    it: "Bianco e bordeaux con bordo dentellato. Il Qatar è bordeaux più scuro e allungato (9 punte); il Bahrein è più rosso (5 punte).",
    es: "Blanco y granate con borde dentado. Catar es granate más oscuro y alargada (9 puntas); Baréin es más roja (5 puntas)." } },

  { type: "flag", members: ["in", "ne"], tip: {
    hr: "Narančasto-bijelo-zelene vodoravne pruge. Indija ima plavi kotač (Ashoka) u sredini; Niger ima narančasti krug.",
    en: "Orange-white-green horizontal stripes. India has a blue wheel (Ashoka) in the centre; Niger has an orange circle.",
    de: "Orange-weiß-grüne waagerechte Streifen. Indien hat ein blaues Rad (Ashoka) in der Mitte; Niger einen orangen Kreis.",
    it: "Strisce orizzontali arancione-bianco-verde. L'India ha una ruota blu (Ashoka) al centro; il Niger un cerchio arancione.",
    es: "Franjas horizontales naranja-blanco-verde. India tiene una rueda azul (Ashoka) en el centro; Níger un círculo naranja." } },

  // ---------- SLIČNI NAZIVI ----------
  { type: "name", members: ["dm", "do"], tip: {
    hr: "Dominika je mali karipski otok; Dominikanska Republika je veća država koja dijeli otok Hispaniolu s Haitijem.",
    en: "Dominica is a small Caribbean island; the Dominican Republic is a larger country sharing the island of Hispaniola with Haiti.",
    de: "Dominica ist eine kleine Karibikinsel; die Dominikanische Republik ist ein größeres Land, das sich die Insel Hispaniola mit Haiti teilt.",
    it: "La Dominica è una piccola isola caraibica; la Repubblica Dominicana è uno Stato più grande che condivide l'isola di Hispaniola con Haiti.",
    es: "Dominica es una pequeña isla caribeña; la República Dominicana es un país mayor que comparte la isla La Española con Haití." } },

  { type: "name", members: ["ne", "ng"], tip: {
    hr: "Niger (pustinjska, glavni grad Niamey) vs Nigerija (najmnogoljudnija afrička država, glavni grad Abuja).",
    en: "Niger (desert country, capital Niamey) vs Nigeria (Africa's most populous country, capital Abuja).",
    de: "Niger (Wüstenland, Hauptstadt Niamey) vs Nigeria (bevölkerungsreichstes Land Afrikas, Hauptstadt Abuja).",
    it: "Niger (Paese desertico, capitale Niamey) vs Nigeria (Paese più popoloso d'Africa, capitale Abuja).",
    es: "Níger (país desértico, capital Niamey) vs Nigeria (país más poblado de África, capital Abuya)." } },

  { type: "name", members: ["si", "sk"], tip: {
    hr: "Slovenija (Alpe, glavni grad Ljubljana) vs Slovačka (Tatre, glavni grad Bratislava).",
    en: "Slovenia (Alps, capital Ljubljana) vs Slovakia (Tatras, capital Bratislava).",
    de: "Slowenien (Alpen, Hauptstadt Ljubljana) vs Slowakei (Tatra, Hauptstadt Bratislava).",
    it: "Slovenia (Alpi, capitale Lubiana) vs Slovacchia (Tatra, capitale Bratislava).",
    es: "Eslovenia (Alpes, capital Liubliana) vs Eslovaquia (Tatras, capital Bratislava)." } },

  { type: "name", members: ["at", "au"], tip: {
    hr: "Austrija (Europa, glavni grad Beč) vs Australija (Oceanija, glavni grad Canberra) — na engleskom Austria vs Australia.",
    en: "Austria (Europe, capital Vienna) vs Australia (Oceania, capital Canberra) — often mixed up in English.",
    de: "Österreich (Europa, Hauptstadt Wien) vs Australien (Ozeanien, Hauptstadt Canberra) — im Englischen leicht zu verwechseln.",
    it: "Austria (Europa, capitale Vienna) vs Australia (Oceania, capitale Canberra) — in inglese si confondono spesso.",
    es: "Austria (Europa, capital Viena) vs Australia (Oceanía, capital Canberra) — en inglés se confunden a menudo." } },

  { type: "name", members: ["gn", "gw", "gq", "pg"], tip: {
    hr: "Četiri 'Gvineje': Gvineja i Gvineja Bisau (zapadna Afrika), Ekvatorska Gvineja (srednja Afrika) i Papua Nova Gvineja (Oceanija).",
    en: "Four 'Guineas': Guinea and Guinea-Bissau (West Africa), Equatorial Guinea (Central Africa) and Papua New Guinea (Oceania).",
    de: "Vier 'Guineas': Guinea und Guinea-Bissau (Westafrika), Äquatorialguinea (Zentralafrika) und Papua-Neuguinea (Ozeanien).",
    it: "Quattro 'Guinee': Guinea e Guinea-Bissau (Africa occidentale), Guinea Equatoriale (Africa centrale) e Papua Nuova Guinea (Oceania).",
    es: "Cuatro 'Guineas': Guinea y Guinea-Bisáu (África occidental), Guinea Ecuatorial (África central) y Papúa Nueva Guinea (Oceanía)." } },

  { type: "name", members: ["kp", "kr"], tip: {
    hr: "Sjeverna Koreja (Pjongjang, izolirana) vs Južna Koreja (Seoul, tehnologija i K-pop).",
    en: "North Korea (Pyongyang, isolated) vs South Korea (Seoul, technology and K-pop).",
    de: "Nordkorea (Pjöngjang, isoliert) vs Südkorea (Seoul, Technologie und K-Pop).",
    it: "Corea del Nord (Pyongyang, isolata) vs Corea del Sud (Seul, tecnologia e K-pop).",
    es: "Corea del Norte (Pionyang, aislada) vs Corea del Sur (Seúl, tecnología y K-pop)." } },

  { type: "name", members: ["sd", "ss"], tip: {
    hr: "Sudan (sjever, Kartum) vs Južni Sudan (najmlađa svjetska država od 2011., Juba).",
    en: "Sudan (north, Khartoum) vs South Sudan (the world's youngest country, 2011, Juba).",
    de: "Sudan (Norden, Khartum) vs Südsudan (jüngstes Land der Welt, 2011, Juba).",
    it: "Sudan (nord, Khartoum) vs Sud Sudan (Paese più giovane del mondo, 2011, Giuba).",
    es: "Sudán (norte, Jartum) vs Sudán del Sur (el país más joven del mundo, 2011, Yuba)." } },

  { type: "name", members: ["cg", "cd"], tip: {
    hr: "Republika Kongo (glavni grad Brazzaville) vs Demokratska Republika Kongo (Kinshasa) — razdvaja ih rijeka Kongo.",
    en: "Republic of the Congo (capital Brazzaville) vs Democratic Republic of the Congo (Kinshasa) — separated by the Congo River.",
    de: "Republik Kongo (Hauptstadt Brazzaville) vs Demokratische Republik Kongo (Kinshasa) — getrennt durch den Kongo-Fluss.",
    it: "Repubblica del Congo (capitale Brazzaville) vs Repubblica Democratica del Congo (Kinshasa) — divise dal fiume Congo.",
    es: "República del Congo (capital Brazzaville) vs República Democrática del Congo (Kinshasa) — separadas por el río Congo." } },

  { type: "name", members: ["ir", "iq"], tip: {
    hr: "Iran (perzijski, glavni grad Teheran) vs Irak (arapski, glavni grad Bagdad).",
    en: "Iran (Persian, capital Tehran) vs Iraq (Arab, capital Baghdad).",
    de: "Iran (persisch, Hauptstadt Teheran) vs Irak (arabisch, Hauptstadt Bagdad).",
    it: "Iran (persiano, capitale Teheran) vs Iraq (arabo, capitale Baghdad).",
    es: "Irán (persa, capital Teherán) vs Irak (árabe, capital Bagdad)." } },

  { type: "name", members: ["kn", "lc", "vc"], tip: {
    hr: "Karipske države sa 'Sveti': Sveti Kristofor i Nevis, Sveta Lucija te Sveti Vincent i Grenadini.",
    en: "Caribbean 'Saint' states: Saint Kitts and Nevis, Saint Lucia, and Saint Vincent and the Grenadines.",
    de: "Karibische 'Saint'-Staaten: St. Kitts und Nevis, St. Lucia sowie St. Vincent und die Grenadinen.",
    it: "Stati caraibici 'Saint': Saint Kitts e Nevis, Santa Lucia e Saint Vincent e Grenadine.",
    es: "Estados caribeños 'San': San Cristóbal y Nieves, Santa Lucía y San Vicente y las Granadinas." } }
];
