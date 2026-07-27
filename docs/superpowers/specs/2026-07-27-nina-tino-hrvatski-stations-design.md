# Design: Nina i Tino HRVATSKI — ekstrakcija vježbi i nove stanice

Datum: 2026-07-27  
Opseg: `ljeto-1razred/` + izvorni flipbook  
Status: odobreno u brainstormingu (pristup, opseg, nove tematske stanice)

## Cilj

Iz Profil Klett flipbooka **Nina i Tino 1 HRVATSKI 1. dio** ekstrahirati **samo radne vježbe**, prilagoditi ih tipovima koje app već podržava, te ih ugraditi kao **nove tematske stanice** unutar predmeta Hrvatski (ne miješati u postojećih 9 stanica).

Izvor: https://www.profil-klett.hr/sites/default/files/flip/12170/ (~154 flip stranice; tiskani broj ≠ flip indeks)

## Odluke

| Tema | Odabir |
|------|--------|
| Opseg ekstrakcije | Samo vježbe / radni listovi (preskočiti naslovnice, sadržaj, prazne, čisto ilustrativne strane bez zadatka) |
| Gdje u app | **Nove** stanice Hrvatskog (ne proširivati postojeće banke) |
| Podjela | Više stanica **po temama** iz knjige |
| Pipeline | Batch ekstrakt → strukturirani izvor → banke + `games` + `STATION_ORDER` |
| Adaptacija | Pedagoška namjera vježbe, ne sken/OCR cijele stranice kao slika u UI |
| Autorska prava | Ne reproducirati udžbenik doslovno kao knjigu; digitalni ekvivalenti (MCQ/match/order/TF) inspirirani zadacima; izvor citirati u `SOURCES.md` |

## Odnos prema postojećem dizajnu

U `2026-07-27-ljeto-adventure-mapa-design.md` serija *Nina i Tino* navedena je za **Prirodu i društvo**. Ovaj izvor je zaseban svezak: **Nina i Tino 1 HRVATSKI 1. dio**. Zadaci idu u **Hrvatski**, ne u PiD.

Postojećih 9 hrvatskih stanica (`hrv-prvo-zadnje` … `hrv-razumijevanje`) ostaju netaknute. Nove stanice dolaze **nakon** njih u `STATION_ORDER.hrvatski`, pa se otključavaju u istom lancu (≥1 ⭐ na prethodnoj).

## Pipeline (dva koraka)

### Korak 1 — Ekstrakcija

1. Proći flip stranice (slike `…/files/large/{n}.jpg`).
2. Za svaku stranicu s vježbom zapisati:
   - flip indeks + tiskani broj stranice (ako vidljiv)
   - broj/naslov zadatka iz knjige
   - uputa (tekst + značenje ikona: npr. precrtaj / obojaj / nacrtaj)
   - sadržaj (stavke, parovi, riječi)
   - predložena tema (privremena oznaka)
3. Izlaz: `ljeto-1razred/extract/nina-tino-hrvatski-1.md` (jedan dokument, grupiran po stranicama).
4. Preskočiti strane bez zadatka; kratko ih nabrojati u dodatku „preskočeno“ da se vidi kompletnost.

### Korak 2 — Ugradnja u app

1. Grupirati ekstrakt u tematske banke (konačna lista tema **nakon** ekstrakcije; privremeni nacrt dolje).
2. Svaku vježbu pretvoriti u 1+ itema tipa: `mcq` | `truefalse` | `match` | `order` (isti helperi kao u `hrvatski.js`).
3. Crtanje / bojanje / „pročitaj slike“ → digitalni ekvivalent:
   - tiho/glasno → MCQ ili klasifikacija po stavci
   - „nacrtaj veće“ → MCQ usporedbe veličine / što je veće
   - slikovni parovi → `match` ili kratko čitanje s izborom značenja
4. Dodati `games[]` u `CONTENT_HRVATSKI` + id-eve u `STATION_ORDER.hrvatski`.
5. Ažurirati `SOURCES.md` i blurb Hrvatskog ako spominje „9 stanica“.
6. `roundSize`: 8–12 po stanici; banka ≥ roundSize (inače spojiti srodne teme).

## Privremene teme stanica (do kraja ekstrakcije)

Konačni id-evi i broj stanica ovise o stvarnom sadržaju knjige. Radni nacrt (mijenja se nakon Koraka 1):

| Privremeni id | Tema (radni naslov) | Primjer iz str. 18/flip 20 |
|---------------|---------------------|----------------------------|
| `hrv-nt-glasovi` | Tiho / glasno, zvukovi | zad. 6 |
| `hrv-nt-usporedbe` | Veće / manje, usporedbe | zad. 7 |
| `hrv-nt-slikovno` | Slikovno čitanje / parovi | zad. 8 |
| `hrv-nt-slova` | Slova / početni glas (ako ima u knjizi) | — |
| `hrv-nt-rijeci` | Riječi / slogovi (ako ima) | — |
| `hrv-nt-recenice` | Rečenice / pravopis (ako ima) | — |

Pravilo: ako tema ima < 8 pretvorivih zadataka, spoji s najbližom; ako > ~40, podijeli.

Prefix id-eva: `hrv-nt-…` (Nina i Tino), da ne sudara s postojećim `hrv-*`.

## Datoteke koje se mijenjaju (Korak 2)

| Datoteka | Promjena |
|----------|----------|
| `ljeto-1razred/extract/nina-tino-hrvatski-1.md` | novi ekstrakt (Korak 1) |
| `ljeto-1razred/js/content/hrvatski.js` | nove banke + `games` |
| `ljeto-1razred/js/app.js` | `STATION_ORDER.hrvatski` |
| `ljeto-1razred/SOURCES.md` | Nina i Tino 1 HRVATSKI |
| `ljeto-1razred/README.md` | broj stanica / opis ako zastari |

Nema novih tipova u `engine.js` u ovom opsegu. Nema promjene Gusara osim ako kasnije eksplicitno zatraženo.

## Otključavanje i progress

- Nove stanice na kraju hrvatskog lanca: nakon `hrv-razumijevanje`.
- Prva nova (`hrv-nt-…`) otključava se kad `hrv-razumijevanje` ima ≥1 ⭐.
- Postojeći `localStorage` ključevi i id-evi starih stanica se ne diraju.
- Hub mapa i Gusarski uvjet (≥1 ⭐ po predmetu) ostaju isti; više hrvatskih stanica ne mijenja uvjet Gusara.

## Uspjeh

- Ekstrakt pokriva sve vježbe u flipbooku (preskočene strane dokumentirane).
- Svaka nova stanica ima dovoljnu banku i radi u postojećem play flowu.
- Izvor je naveden u `SOURCES.md`.
- Nema doslovnog umetanja skenova stranica kao glavnog UI sadržaja.

## Van opsega

- Nina i Tino PiD / drugi svesci
- Novi tipovi zadataka (npr. free drawing canvas)
- Prepisivanje postojećih 9 hrvatskih stanica
- Objava / hosting udžbeničkog PDF-a
