# Design: Vizualni polish adventure mape — Ljetni park

Datum: 2026-07-27  
Opseg: `ljeto-1razred/` (HTML / CSS / minimalni JS)  
Status: odobreno u brainstormingu

## Cilj

Podignuti hub i cijelu appu s razine „stog kartica + statično nebo“ na **živu adventure mapu**: ilustrirani otok, ambient pokret i dramatski trenuci otključavanja/blaga — bez vanjskih asseta i bez canvasa.

## Odluke

| Tema | Odabir |
|------|--------|
| Opseg | Hub mapa + ambient kroz cijelu app |
| Intenzitet | Maksimalan (parallax, čestice, dramatski unlock) unutar CSS/SVG |
| Layout huba | Hibrid: ilustrirani otok-pregled gore + klikabilne zone (`map-region`) dolje |
| Tehnika | Pure CSS/SVG scene (bez canvasa, bez novih libraryja) |
| Interakcija mape | Otok je dekorativan (nije hit-target); klik ostaje na postojećim gumbima |

## Kontekst (trenutno stanje)

- Hub renderira tri regije + gusarski otok kao kartice (`map-region`) na statičnom `.sky` gradientu.
- Postojeće animacije: `fadeIn`, `node-unlock`, `treasure-pop`, `bounceStar` — premalo za „Potraga za blagom“.
- Logika unlocka, progress, sadržaj i dućan ostaju netaknuti (vidi `2026-07-27-ljeto-adventure-mapa-design.md`).

## Hub — hibridna mapa

### Ilustrirani otok (gore)

Inline SVG (+ CSS slojevi) u `#view-hub`, ispod hero teksta ili odmah uz njega:

- Jedna kompozicija otoka s **tri kopnene zone** u bojama predmeta:
  - matematika → zelena (`--mat`)
  - hrvatski → narančasta (`--hrv`)
  - priroda i društvo → plava (`--pid`)
- Odvojeni **gusarski otočić** (tamniji `--gus`), povezan mostom ili maglom.
- Staze (iscrtane linije) između zona; blagi glow na otključanim / „živim“ zonama.
- Gusar zaključan: prigušena zona + katanac overlay; otključan: jasnija boja + živi glow.
- `aria-hidden="true"` na dekorativnom SVG-u; ne prima klikove (`pointer-events: none`).

### Klikabilne zone (dolje)

- Zadržati postojeće `map-region` gumbe (a11y, tipkovnica, mobilni hit-area).
- Vizualno uskladiti s mapom: iste boje/ikone; opcionalno mali pin / indikator koji veže karticu na zonu otoka.
- Ne mijenjati unlock pravila ni copy osim ako treba sitni vizualni hint.

### Stanice (subject trail)

- `station-node` / `station-link` dobivaju jači trail look (sjaj staze, jasniji locked/unlocked).
- Dramatski `just-unlocked` burst (vidi dolje); logika klase ostaje u `app.js` kako je danas.

## Ambient sloj (globalno)

Proširiti `.sky` (i/ili sibling dekor) s elementima `aria-hidden="true"`:

1. **Oblaci** — 2–3 CSS oblaka, spori drift  
2. **Sunce** — pulse / soft glow  
3. **Čestice blaga** — male CSS zvjezdice/točkice, spor float (ne canvas)  
4. **Parallax** — 2–3 sloja (nebo / oblaci / trava) s različitim pomakom na scroll (minimalni JS u `app.js` ili čisti CSS ako dovoljno)

Ambient je vidljiv kroz hub, subject, intro, play, result, shop — ne samo na hubu.

## Namjerni „wow“ momenti

| Trenutak | Efekt |
|----------|--------|
| Ulaz u hub | Stagger fade/slide zona + lagani reveal otoka |
| Otključavanje stanice | Jači glow + kratki CSS spark/confetti burst (ne samo scale) |
| Kraj runde / blago | Prošireni `treasure-pop` + short star shower |
| Hint (gusar) | Slide-in + soft shimmer |

## Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  /* ugasiti petlje, parallax, burstove; zadržati statičnu mapu i layout */
}
```

Bez beskonačnih animacija i bez scroll-parallaxa kad je reduce aktivan.

## Tehnički opseg datoteka

| Datoteka | Promjena |
|----------|----------|
| `ljeto-1razred/index.html` | SVG otok u hubu; ambient markup u/uz `.sky` |
| `ljeto-1razred/css/styles.css` | Scene, petlje, burstovi, reduced-motion, usklađivanje kartica/čvorova |
| `ljeto-1razred/js/app.js` | Sync vizualnog stanja otoka (npr. gusar locked class); opcionalno parallax; stagger |

**Ne dira se:** banke u `js/content/*`, `progress.js`, `engine.js` pravila, `rewards.js` ekonomija, vanjski asseti.

## Izvan opsega

- Canvas particle engine  
- Slike / sprite sheetovi / Lottie  
- Klik direktno na SVG zone (ostaje hibrid)  
- Promjena sadržaja zadataka ili unlock ekonomije  

## Acceptance criteria

1. Hub na ~375px širine: otok čitljiv, zone ispod lako klikabilne, nema overlap hit-area.  
2. Otok vizualno odražava stanje gusara (locked vs unlocked) u skladu s `Progress.gusarUnlocked`.  
3. Najmanje 3 kontinuirane ambient petlje (oblaci, sunce, čestice) kad motion nije reduce.  
4. Najmanje 3 namjerna event animacije: unlock stanice, treasure/result, hint shimmer.  
5. `prefers-reduced-motion: reduce` gasi petlje i burstove; app ostaje potpuno uporabiva.  
6. Nema regresije: navigacija, unlock, runde, novčanik/dućan rade kao prije.  
7. Nema novih network dependencyja (samo postojeći Google Fonts ako već učitani).

## Test plan

- Ručno: hub → regija → stanica → runda → result → natrag; gusar locked/unlocked.  
- Mobilni viewport + desktop.  
- DevTools: emulate `prefers-reduced-motion: reduce`.  
- Brzi smoke: klik svih `map-region` i `station-node` (unlocked).  
