# Design: Adventure mapa, Gusarski otok, Profil sadržaj, novčanik — Ljetni park

Datum: 2026-07-27  
Opseg: `ljeto-1razred/`  
Status: odobreno u brainstormingu (hub mapa, sadržaj, UI, arhitektura)

## Cilj

Pretvoriti Ljetni park u **adventure mapu** („Potraga za blagom“) s otključavanjem stanica, odvojenim **Skrivenim gusarskim otokom** (most prema 2. razredu, miješani predmeti + hintovi), proširenim i točnim sadržajem Hrvatskog te Prirode i društva prema **Profil Klett** udžbenicima, te **vidljivim novčanikom** za potrošnju zvjezdica na stvarne dječje pogodnosti.

## Odluke

| Tema | Odabir |
|------|--------|
| Pristup | Puna adventure mapa (ne samo rename) |
| Hub | Mapa otoka: 3 regije predmeta + Gusarski otok |
| Gusarski otok | 4. kartica/zona na hubu; miješana Mat+HR+PiD |
| Težina potrage | Srednje do teško **1. razred** |
| Težina Gusara | Jasno **2. razred**, s hintovima (1× po zadatku, bez troška zvjezdica) |
| Izvori | Profil Klett + službeni kurikulumski ishodi |
| Novčanik | Sticky gumb Novčanik + saldo → Dućan; stvarne nagrade |
| Otključavanje stanice | Sljedeća nakon runde s ≥1 zvjezdicom |
| Otključavanje Gusara | Vidljiv s katancem dok nije ≥1 uspješna stanica u **svakom** od 3 predmeta |

## Izvori sadržaja (obvezno)

Ne izmišljati gradivo. Prije shipanja svaki novi / izmijenjeni faktografski zadatak mora biti usklađen s barem jednim:

**Hrvatski**

- 1. razred: Profil Klett — *Moji tragovi 1* (radni materijali / udžbenik iste serije; autori Budinski, Kolar Billege, Ivančić i suradnici)
- 2. razred (samo Gusarski): *Trag u priči 2* (radni udžbenik, 1. i 2. svezak)

**Priroda i društvo**

- 1. razred: *Nina i Tino Priroda i društvo 1* i/ili *Pogled u svijet 1 — Tragom prirode i društva*
- 2. razred (Gusarski): *Nina i Tino 2* i/ili *Pogled u svijet 2 — Tragom prirode i društva*

**Kurikulum**

- Službeni ishodi / teme za PiD 1. i 2. razred (škola, obitelj, promet, godišnja doba, živa bića; za 2.: strane svijeta, plan, zavičaj, prometne vrste, vremenska orijentacija — samo ono što je u izvoru)

U `ljeto-1razred/SOURCES.md` navesti seriju i razinu za sporne činjenice. Ako se ne može verificirati, zadatak se ne šalje.

## Hub i mapa

- Hub nije popis suhih kartica: jedna **kompozicija mape otoka**.
- Tri regije = matematika, hrvatski, priroda i društvo; copy i framing = **Potraga za blagom**.
- Ulaz u regiju: staza sa **stanicama** (čvorovi). Prva stanica otključana; ostale zaključane dok prethodna nema ≥1 zvjezdicu iz barem jedne odigrane runde.
- **Skriveni gusarski otok**: vizualno odvojen; katanac + uvjet; nakon otključavanja = **jedna** mini-igra, game id `gus-otok`.
- Kratke namjerne animacije (min. 2–3): otključavanje čvora, „blago“ na kraju runde, hint slide-in.

## Stanice i tipovi zadataka

Postojeće igre postaju stanice (isti `game.id` radi kompatibilnosti progressa). Redoslijed unutar predmeta:

### Matematika (1. razred, srednje–teško)

1. `mat-brojevi` — Brojevi do 20  
2. `mat-racun` — Zbrajanje i oduzimanje  
3. `mat-jednadzbe` — Jednačenja  
4. `mat-rijeci` — Zadaci s riječima  
5. `mat-oblici` — Oblici  

Tipovi: mcq, truefalse, order, match, vizualni count. Banka se ne olakšava; filtrirati ili podići `diff` gdje je trivialno.

### Hrvatski — proširiti po vrsti/tipu

Stanice:

1. `hrv-slova` — Slova i abeceda  
2. `hrv-slogovi` — Slogovi i riječi  
3. `hrv-citanje` — Čitanje s razumijevanjem  

Proširenja banke (1. razred, Profil):

- Velika/mala slova, red u abecedi, prvo/zadnje slovo, broj slova  
- Broj slogova, sastavljanje slogova, spoji → riječ  
- Početak rečenice, točka / upitnik, razmak  
- Čitanje: kratki tekst + pitanje; zaključivanje mjesta/boje/radnje (bez trivijalnog copy-paste odgovora u istom retku gdje je moguće)  
- Ukloniti ili prepraviti TF gdje je odgovor uvijek očigledan bez čitanja

### Priroda i društvo — proširiti po vrsti/tipu

Stanice:

1. `pid-godisnja` — Godišnja doba / vrijeme / odjeća  
2. `pid-ziva` — Živa bića  
3. `pid-okolina` — Ja i okolina (škola, obitelj, tijelo, promet, Hrvatska)

Proširenja usklađena s Profilom + ishodima 1. razreda:

- Dani u tjednu, doba dana, jučer/danas/sutra  
- Semafor i pješak, put kuća–škola  
- Živo / neživo, domaće / divlje, potrebe biljaka i životinja  
- Obitelj, dom, škola, higijena, otpad  
- Točnost: mjeseci↔doba, glavni grad Zagreb, Jadransko more — verificirati prije shipanja; ispraviti poznate greške (slogovi, lokativ/akuzativ u promptovima)

## Gusarski otok

- Id: `gus-otok`; naslov: **Skriveni gusarski otok**; emoji: piratska zastava (u UI-u)  
- Runda: **12** zadataka, miješano iz tri predmeta, `diff` 2–3, sadržaj **2. razreda**  
- Sadržaj (samo ako je u Profilu/kurikulu za 2.): brojevi i račun u rasponu 2. razreda; duži tekst; strane svijeta; jednostavan plan/naselje; vrste prometa  
- **Hint**: jednom po zadatku; za mcq/tf makne do 2 distraktora (ostaju ≥2 izbora uključujući točan); ako nema dovoljno izbora, pokaži jednu rečenicu `q.hint` bez otkrivanja odgovora; ne troši wallet  
- Framing gusarski; ostatak appa ostaje „potraga za blagom“

## Novčanik i dućan

Problem: gumb zvjezdica u headeru nije dovoljno vidljiv / klikabilan.

### UI

- Sticky topbar (`position: sticky; top: 0; z-index: 40` iznad mape)  
- Gumb: Novčanik + saldo zvjezdica (ikona ruksaka) — veći padding, jasan kontrast, `aria-label`  
- Klik otvara view `shop`  
- Na rezultatu runde: `+N` zvjezdica u novčanik

### Ekonomija (postojeći model)

- `wallet`: potrošive zvjezdice; header pokazuje samo ovo  
- Nakon runde: `Engine.starsFromScore` → `Progress.setStars` (najbolji 0–3 po stanici) **i** `Progress.addToWallet(stars)`  
- `totalStars`: zbroj najboljih; ne prikazivati kao potrošivo  
- Migracija: ako `wallet` nije broj → `wallet = totalStars`; ako nema `unlocked` → prva stanica svakog predmeta otključana; `spent` = `[]` ako nije niz

### Katalog (`rewards.js`)

Fiksna lista stvarnih pogodnosti (roditelj obavi):

| id | Naslov | Cijena |
|----|--------|--------|
| `sladoled` | Sladoled | 10 |
| `park` | Park / igralište | 15 |
| `bicikl-role` | Bicikl / role | 18 |
| `film` | Film / crtani | 20 |
| `obrok` | Omiljeni obrok | 25 |
| `igracka` | Mala igračka | 30 |

Emoji ostaju kao u postojećem `rewards.js`. Dopuna kataloga dopuštena samo stvarnim dječjim pogodnostima (bez in-app kozmetike, bez PIN-a).

## Podaci (`localStorage`, ključ `ljeto1_progress`)

```json
{
  "games": {
    "mat-brojevi": { "stars": 2, "bestCorrect": 8, "played": 3 }
  },
  "unlocked": {
    "matematika": ["mat-brojevi", "mat-racun"],
    "hrvatski": ["hrv-slova"],
    "priroda": ["pid-godisnja"]
  },
  "wallet": 14,
  "spent": [],
  "totalStars": 6
}
```

API (`progress.js`): postojeći wallet API + `isUnlocked(subjectId, gameId)`, `unlockNext(subjectId, gameId)`, `gusarUnlocked()` — true samo ako svaki od tri predmeta ima **≥1 zvjezdicu na barem jednoj stanici**.

## Tehnički sloj

| Datoteka | Promjena |
|----------|----------|
| `index.html` | Markup mape / stanica; jasniji novčanik; hint slot u play |
| `css/styles.css` | Mapa, čvorovi, katanac, sticky header, gusarski, hint |
| `js/app.js` | Navigacija hub-mapa → regija → stanica → intro/play; unlock; shop |
| `js/progress.js` | `unlocked`, gusar gate, migracija |
| `js/engine.js` | `applyHint(q)` za mcq/tf; zadržati ramp težine |
| `js/content/hrvatski.js` | Proširenje tipova; čišćenje trivijalnog; `diff` |
| `js/content/priroda.js` | Isto + fact-check |
| `js/content/matematika.js` | Framing i `diff` usklađeni sa srednje–teškim 1. razredom; bez sadržaja 2. razreda u potrazi |
| `js/content/gusarski.js` | Nova miješana banka 2. razreda |
| `js/rewards.js` | Katalog |
| `ljeto-1razred/SOURCES.md` | Izvori Profil + kurikulum |

Postojeći `Engine.mountQuestion` ostaje jezgra; adventure je sloj navigacije i copyja, ne novi motor tipova pitanja u MVP-u.

## Provjera uspjeha

1. Na mobitelu i desktopu sticky **Novčanik** se vidi i otvara dućan; kupnja smanjuje `wallet`.  
2. Hub je mapa; stanice se otključavaju redom nakon ≥1 zvjezdice.  
3. Gusarski otok zaključan dok nema ≥1 zvjezdicu u svakom predmetu; zatim igriv s Hintom.  
4. Hrvatski i PiD imaju šire tipove zadataka; težina potrage srednje–teška 1. razred.  
5. Sve prikazane činjenice verificirane naspram Profil/kurikula; greške ispravljene.  
6. Stari localStorage migrira bez gubitka wallet salda.

## Izvan opsega

- Uređivanje kataloga nagrada u UI-u  
- Roditeljski PIN / potvrda kupnje  
- Sinkronizacija među uređajima  
- Zasebna full app samo za 2. razred  
- Novi tipovi pitanja izvan postojećih (mcq, tf, order, match, count/visual) u ovoj iteraciji  
- Točno reproduciranje stranica udžbenika (copyright); samo ishodi i tipične vježbe u originalnom tekstu aplikacije

## Faze implementacije (za plan)

Jedan plan, tri faze u istom PR-u ili uzastopnim commitovima:

1. **Novčanik + unlock API** — sticky Novčanik, migracija `unlocked`, gate za Gusara  
2. **Adventure UI** — mapa hub, staze/stanice, animacije, hint u engineu, `gusarski.js` skeleton  
3. **Sadržaj Profil** — proširenje HR/PiD tipova, težina, fact-check, `SOURCES.md`, puna gusarska banka 2. razreda
