# Ljetni park — Adventure mapa + Gusarski otok Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adventure mapa „Potraga za blagom“ s otključavanjem stanica, Skriveni gusarski otok (2. razred + hint), Profil-usklađen sadržaj HR/PiD, i vidljiv novčanik za potrošnju zvjezdica.

**Architecture:** Postojeći `Engine` + banke ostaju jezgra. `Progress` dobiva `unlocked` + `gusarUnlocked()`. `app.js` renderira mapu hub → regija (staza stanica) → igra. Nova banka `gusarski.js`. Hint u `engine.js` za mcq/tf. Sticky novčanik otvara postojeći shop.

**Tech Stack:** Vanilla JS, HTML, CSS, `localStorage` (bez builda).

**Spec:** `docs/superpowers/specs/2026-07-27-ljeto-adventure-mapa-design.md`

## Global Constraints

- UI jezik: hrvatski
- Potraga = srednje–teško **1. razred**; Gusarski = **2. razred** + hint (1×/zadatak, bez troška wallet)
- Izvori: Profil Klett (*Moji tragovi 1*, *Trag u priči 2*, *Nina i Tino* / *Pogled u svijet* 1–2) + kurikulum — ne izmišljati činjenice
- Header prikazuje `wallet`, ne `totalStars`
- Otključavanje stanice: sljedeća nakon runde s ≥1 ⭐
- Gusarski vidljiv s katancem dok nema ≥1 ⭐ u svakom od 3 predmeta
- Game id-evi postojećih stanica se ne mijenjaju (`mat-*`, `hrv-*`, `pid-*`)
- Commiti: `git -c user.name="ivsitum1" -c user.email="ivsitum1@users.noreply.github.com" commit ...` (ne dirati git config)

## File structure

| File | Responsibility |
|------|----------------|
| `ljeto-1razred/js/progress.js` | `unlocked`, unlock API, `gusarUnlocked`, migracija |
| `ljeto-1razred/js/engine.js` | `applyHint(q)` |
| `ljeto-1razred/js/app.js` | mapa hub, staza, sticky novčanik, hint gumb, unlock na finish |
| `ljeto-1razred/index.html` | mapa markup, novčanik labela, hint slot |
| `ljeto-1razred/css/styles.css` | sticky header, mapa, čvorovi, katanac, hint, animacije |
| `ljeto-1razred/js/content/gusarski.js` | miješana banka 2. razreda |
| `ljeto-1razred/js/content/hrvatski.js` | tipovi + težina + čišćenje |
| `ljeto-1razred/js/content/priroda.js` | tipovi + fact-check + težina |
| `ljeto-1razred/js/content/matematika.js` | framing / `diff` 1. razred |
| `ljeto-1razred/SOURCES.md` | popis izvora Profil + kurikulum |
| `ljeto-1razred/README.md` | kratki opis nove mape |

---

### Task 1: Progress — unlock API + gusar gate

**Files:**
- Modify: `ljeto-1razred/js/progress.js`

**Interfaces:**
- Consumes: postojeći `load` / `save` / `getStars` / `wallet`
- Produces:
  - `Progress.isUnlocked(subjectId: string, gameId: string): boolean`
  - `Progress.unlockNext(subjectId: string, gameIdsInOrder: string[], completedGameId: string): void`
  - `Progress.gusarUnlocked(subjectGameIds: {matematika:string[], hrvatski:string[], priroda:string[]}): boolean`
  - `Progress.ensureUnlockedDefaults(subjectFirstGameIds: {matematika:string, hrvatski:string, priroda:string}): void`

- [ ] **Step 1: Extend `empty()` and `load()` for `unlocked`**

In `empty()`, add `unlocked: {}`.

In `load()`, after wallet/spent migration:
```javascript
if (!data.unlocked || typeof data.unlocked !== "object") data.unlocked = {};
```

- [ ] **Step 2: Implement helpers**

```javascript
function ensureUnlockedDefaults(subjectFirstGameIds) {
  var data = load();
  var changed = false;
  Object.keys(subjectFirstGameIds).forEach(function (sid) {
    if (!Array.isArray(data.unlocked[sid]) || !data.unlocked[sid].length) {
      data.unlocked[sid] = [subjectFirstGameIds[sid]];
      changed = true;
    }
  });
  if (changed) save(data);
}

function isUnlocked(subjectId, gameId) {
  var data = load();
  var list = data.unlocked && data.unlocked[subjectId];
  return Array.isArray(list) && list.indexOf(gameId) !== -1;
}

function unlockNext(subjectId, gameIdsInOrder, completedGameId) {
  var data = load();
  if (!data.unlocked[subjectId]) data.unlocked[subjectId] = [];
  var list = data.unlocked[subjectId];
  if (list.indexOf(completedGameId) === -1) list.push(completedGameId);
  var idx = gameIdsInOrder.indexOf(completedGameId);
  if (idx >= 0 && idx < gameIdsInOrder.length - 1) {
    var nextId = gameIdsInOrder[idx + 1];
    if (list.indexOf(nextId) === -1) list.push(nextId);
  }
  save(data);
}

function gusarUnlocked(subjectGameIds) {
  return ["matematika", "hrvatski", "priroda"].every(function (sid) {
    var ids = subjectGameIds[sid] || [];
    return ids.some(function (gid) {
      return getStars(gid) >= 1;
    });
  });
}
```

Export all four on `global.Progress`.

- [ ] **Step 3: Verify in browser console**

Open `ljeto-1razred/index.html`, run:
```javascript
Progress.ensureUnlockedDefaults({matematika:"mat-brojevi",hrvatski:"hrv-slova",priroda:"pid-godisnja"});
console.assert(Progress.isUnlocked("matematika","mat-brojevi") === true);
Progress.unlockNext("matematika",["mat-brojevi","mat-racun"],"mat-brojevi");
console.assert(Progress.isUnlocked("matematika","mat-racun") === true);
```
Expected: no assertion failures.

- [ ] **Step 4: Commit**

```bash
git add ljeto-1razred/js/progress.js
git -c user.name="ivsitum1" -c user.email="ivsitum1@users.noreply.github.com" commit -m "feat(ljeto): unlock stations and gusar gate in progress"
```

---

### Task 2: Sticky Novčanik (vidljiv dućan)

**Files:**
- Modify: `ljeto-1razred/index.html` (gumb `#starsTotal`)
- Modify: `ljeto-1razred/css/styles.css` (`.topbar`, `.stars-total`)
- Modify: `ljeto-1razred/js/app.js` (`refreshStars`)

**Interfaces:**
- Consumes: `Progress.wallet()`
- Produces: vidljiv sticky gumb koji otvara shop

- [ ] **Step 1: Update header markup**

Replace stars button content/label:
```html
<button type="button" class="stars-total" id="starsTotal"
  title="Novčanik — otvori dućan"
  aria-label="Novčanik — otvori dućan">🎒 Novčanik ⭐ 0</button>
```

- [ ] **Step 2: Sticky + kontrast CSS**

```css
.topbar {
  position: sticky;
  top: 0;
  z-index: 40;
  background: rgba(255, 246, 214, 0.92);
  backdrop-filter: blur(8px);
  max-width: 720px;
  margin: 0 auto;
  /* keep existing flex/padding */
}

.stars-total {
  flex-shrink: 0;
  min-height: 2.6rem;
  padding: 0.45rem 0.9rem;
  font-size: 1rem;
  border: 2px solid rgba(30, 58, 76, 0.15);
  /* keep panel bg, shadow, cursor */
}
```

- [ ] **Step 3: `refreshStars` text**

```javascript
function refreshStars() {
  els.starsTotal.textContent = "🎒 Novčanik ⭐ " + Progress.wallet();
}
```

Keep existing `els.starsTotal.addEventListener("click", openShop)`.

- [ ] **Step 4: Verify**

Resize to ~375px width: gumb ostaje vidljiv desno, klik otvara `#view-shop`.

- [ ] **Step 5: Commit**

```bash
git add ljeto-1razred/index.html ljeto-1razred/css/styles.css ljeto-1razred/js/app.js
git -c user.name="ivsitum1" -c user.email="ivsitum1@users.noreply.github.com" commit -m "fix(ljeto): sticky visible star wallet button"
```

---

### Task 3: Engine — `applyHint`

**Files:**
- Modify: `ljeto-1razred/js/engine.js`

**Interfaces:**
- Produces: `Engine.applyHint(q): { choices?: any[], hintText?: string }`  
  Mutira kopiju choices (ne original bank item ako je dijeljen — raditi na shallow copy `choices`).

- [ ] **Step 1: Implement `applyHint`**

```javascript
function applyHint(q) {
  var type = (q && q.type) || "mcq";
  if (type === "mcq" || type === "truefalse" || type === "count") {
    var choices = uniqueStrings((q.choices || []).slice());
    if (q.answer != null && choices.indexOf(String(q.answer)) === -1) {
      choices.push(String(q.answer));
    }
    var wrong = choices.filter(function (c) {
      return String(c) !== String(q.answer);
    });
    // makni do 2 distraktora; ostavi ≥1 wrong ako postoji, ukupno ≥2 choices
    var remove = Math.min(2, Math.max(0, wrong.length - 1));
    var shuffledWrong = shuffle(wrong);
    var keepWrong = shuffledWrong.slice(remove);
    var next = shuffle([String(q.answer)].concat(keepWrong));
    if (next.length < 2 && q.hint) {
      return { choices: choices, hintText: String(q.hint) };
    }
    return { choices: next, hintText: q.hint ? String(q.hint) : null };
  }
  if (q && q.hint) return { hintText: String(q.hint) };
  return { hintText: "Pogledaj pažljivo pitanje još jednom." };
}
```

Export `applyHint` on `global.Engine`.

- [ ] **Step 2: Console check**

```javascript
var r = Engine.applyHint({type:"mcq", answer:"A", choices:["A","B","C","D"]});
console.assert(r.choices.indexOf("A") !== -1);
console.assert(r.choices.length >= 2 && r.choices.length <= 3);
```

- [ ] **Step 3: Commit**

```bash
git add ljeto-1razred/js/engine.js
git -c user.name="ivsitum1" -c user.email="ivsitum1@users.noreply.github.com" commit -m "feat(ljeto): applyHint for pirate-island questions"
```

---

### Task 4: Adventure hub mapa + staza stanica

**Files:**
- Modify: `ljeto-1razred/index.html` — hub hero copy; zadrži `#subjectGrid` (puni se mapom)
- Modify: `ljeto-1razred/css/styles.css` — `.island-map`, `.map-region`, `.station-node`, `.locked`, unlock animacija
- Modify: `ljeto-1razred/js/app.js` — `renderHub`, `openSubject` → staza, finish unlock

**Interfaces:**
- Consumes: `Progress.isUnlocked`, `unlockNext`, `gusarUnlocked`, `ensureUnlockedDefaults`, `wallet`
- Produces: navigacija mapa → regija → intro/play

- [ ] **Step 1: Subject meta + defaults on boot**

U `app.js` na vrhu (nakon SUBJECTS):
```javascript
var STATION_ORDER = {
  matematika: ["mat-brojevi","mat-racun","mat-jednadzbe","mat-rijeci","mat-oblici"],
  hrvatski: ["hrv-slova","hrv-slogovi","hrv-citanje"],
  priroda: ["pid-godisnja","pid-ziva","pid-okolina"]
};

Progress.ensureUnlockedDefaults({
  matematika: "mat-brojevi",
  hrvatski: "hrv-slova",
  priroda: "pid-godisnja"
});
```

- [ ] **Step 2: `renderHub` kao mapa**

- Hero: naslov „Potraga za blagom“, kicker „Ljetni park · 1. razred“.
- Za svaki SUBJECT: gumb `.map-region` s ikonom, naslovom, kratkim „regija na karti“, pill ⭐ got/max.
- Dodatni gumb `.map-region.gusar` za Gusara:
  - ako `!Progress.gusarUnlocked({matematika: STATION_ORDER.matematika, ...})` → class `locked`, tekst „🔒 Skriveni gusarski otok“, klik pokaže kratku poruku (npr. `alert` ili inline tip: treba ≥1 ⭐ u svakom predmetu).
  - inače otvori intro za `CONTENT_GUSARSKI.games` (kad postoji Task 5).

Dok `CONTENT_GUSARSKI` još nije učitan, renderiraj zaključanu zonu s placeholder copyjem.

- [ ] **Step 3: `openSubject` = staza stanica**

Umjesto flat game grid: horizontalna/vertikalna staza `.station-trail`.
Za svaki `game` u `sub.games`:
- ako `Progress.isUnlocked(sub.id, game.id)` → klikiv čvor → `openIntro(game)`
- inače → `.station-node.locked` (disabled), ikona katanac

Copy: `game.title` može dobiti prefix framing u intro (`„Trag: “ + title`) bez mijenjanja id-a.

- [ ] **Step 4: Na `finishGame` — unlock**

Nakon `Progress.setStars` / `addToWallet`:
```javascript
if (stars >= 1 && state.subject && STATION_ORDER[state.subject.id]) {
  Progress.unlockNext(state.subject.id, STATION_ORDER[state.subject.id], state.game.id);
}
```
Za gusarsku rundu (`state.game.id === "gus-otok"`) ne zovi `unlockNext`.

- [ ] **Step 5: CSS mapa + animacije**

Minimalno:
- `.island-map` flex column gap
- `.map-region` velika kartica s blagim gradientom (ne purple-default AI look — koristi postojeće `--mat/--hrv/--pid` + sun/leaf)
- `.station-node.locked { opacity: 0.55; }`
- `@keyframes node-unlock` (scale + glow 400ms) class `.just-unlocked`
- result panel: class `.treasure-pop` na `#resultStars`

- [ ] **Step 6: Verify**

Svi subjecti otvaraju stazu; druga stanica locked dok prva nema ≥1 ⭐; nakon 1 ⭐ otključa se iduća.

- [ ] **Step 7: Commit**

```bash
git add ljeto-1razred/index.html ljeto-1razred/css/styles.css ljeto-1razred/js/app.js
git -c user.name="ivsitum1" -c user.email="ivsitum1@users.noreply.github.com" commit -m "feat(ljeto): adventure map hub and station trail"
```

---

### Task 5: Gusarski otok — banka + wiring + hint UI

**Files:**
- Create: `ljeto-1razred/js/content/gusarski.js`
- Modify: `ljeto-1razred/index.html` (script tag + hint button u play actions area)
- Modify: `ljeto-1razred/js/app.js` (SUBJECTS / hub gusar, hint state)
- Modify: `ljeto-1razred/css/styles.css` (`.hint-btn`, gusar region)

**Interfaces:**
- Consumes: `Engine.applyHint`, `Progress.gusarUnlocked`
- Produces: `window.CONTENT_GUSARSKI` s `games: [{ id:"gus-otok", roundSize:12, bank:[...] }]`

- [ ] **Step 1: Create `gusarski.js`**

IIFE kao ostali content fajlovi. Uključi samo verificirane 2. razred teme:

Mat (do 100, zbrajanje/oduzimanje bez množenja kao teži fokus): npr. `47+28`, usporedba do 100.  
HR (*Trag u priči 2* razina): duži odlomak 3–5 rečenica + pitanje; veliko slovo / znakovi.  
PiD (*Pogled u svijet 2* / kurikulum): 4 glavne strane svijeta; kopneni/zračni/vodeni promet; jednostavan „plan“ (što je bliže).  

Svaki zadatak: `diff: 2|3`, opcionalno `hint: "..."`.  
Banka ≥ 36 stavki da runda 12 ne ponavlja brzo.  
Export:
```javascript
global.CONTENT_GUSARSKI = {
  id: "gusarski",
  title: "Skriveni gusarski otok",
  icon: "🏴‍☠️",
  blurb: "Most prema 2. razredu — matematika, hrvatski i priroda zajedno.",
  color: "gus",
  games: [{
    id: "gus-otok",
    title: "Skriveni gusarski otok",
    emoji: "🏴‍☠️",
    desc: "12 zadataka iz sva 3 predmeta. Imaš 1 hint po pitanju.",
    roundSize: 12,
    bank: bank,
    allowHint: true
  }]
};
```

- [ ] **Step 2: Script tag** u `index.html` nakon `priroda.js`:
```html
<script src="js/content/gusarski.js"></script>
```

- [ ] **Step 3: Hub + play hint**

U `renderHub` spoji stvarni `CONTENT_GUSARSKI`.  
U `showQuestion`, ako `state.game.allowHint`:
- reset `state.hintUsed = false`
- gumb `#btnHint` „💡 Hint“ u `playActions` (prije odgovora)
- on click: `Engine.applyHint(q)` → ako `choices`, remount MCQ s novim choices (ili update buttons); ako `hintText`, prikaži u `#feedback` kao info; disable hint gumb

Ne troši wallet.

- [ ] **Step 4: Verify**

Zaključan gusar dok nema ⭐ po predmetu; nakon unlocka runda 12; hint sužava izbore jednom.

- [ ] **Step 5: Commit**

```bash
git add ljeto-1razred/js/content/gusarski.js ljeto-1razred/index.html ljeto-1razred/js/app.js ljeto-1razred/css/styles.css
git -c user.name="ivsitum1" -c user.email="ivsitum1@users.noreply.github.com" commit -m "feat(ljeto): pirate island mixed grade-2 round with hints"
```

---

### Task 6: Hrvatski — tipovi, težina, čišćenje

**Files:**
- Modify: `ljeto-1razred/js/content/hrvatski.js`
- Create/update notes in `ljeto-1razred/SOURCES.md`

**Interfaces:**
- Produces: banke s `diff` 1–3; manje trivijalnih TF; framing copy u `CONTENT_HRVATSKI` (title/blurb „Potraga“)

- [ ] **Step 1: Subject framing**

```javascript
blurb: "Potraga za blagom: slova, slogovi i čitanje — srednje do teže 1. razred.",
```
Game titles mogu ostati; `desc` dodati „Trag: …“.

- [ ] **Step 2: Težina**

- Osiguraj `diff` na generatorima: kratki first/last letter = 1; abeceda order/match = 2–3; duga čitanja već imaju 3.
- Ukloni ili prepravi TF koji su uvijek `true` s odgovorom u samom promptu bez potrebe za znanjem (npr. „Riječ X ima N slogova“ kad je N točan iz banke — zamijeni dijelom s netočnim varijantama koje već postoje, smanji udio „uvijek true“).

- [ ] **Step 3: Novi tipovi (Profil 1. razred)**

Dodaj barem:
- 8–12 MCQ „Koja rečenica je točno napisana?“ (veliko slovo + točka) — originalni kratki primjeri, ne citat iz udžbenika
- 6–8 order: slogovi poznatih riječi 3–4 sloga
- 4–6 match: veliko↔malo za dijakritike Č/Ć/Š/Ž/Đ ako Đ nije u abecedi appa — samo slova iz postojećeg `SLOVA` niza

- [ ] **Step 4: SOURCES.md upis**

```markdown
## Hrvatski
- Profil Klett: Moji tragovi 1 (1. razred)
- Gusarski: Trag u priči 2
```

- [ ] **Step 5: Smoke**

Pokreni `hrv-slova` rundu: nema očitih grešaka u abecedi; `diff` raspodjela nije sve 1.

- [ ] **Step 6: Commit**

```bash
git add ljeto-1razred/js/content/hrvatski.js ljeto-1razred/SOURCES.md
git -c user.name="ivsitum1" -c user.email="ivsitum1@users.noreply.github.com" commit -m "feat(ljeto): expand Croatian task types and difficulty"
```

---

### Task 7: Priroda i društvo — tipovi, fact-check, težina

**Files:**
- Modify: `ljeto-1razred/js/content/priroda.js`
- Modify: `ljeto-1razred/SOURCES.md`

- [ ] **Step 1: Framing** — blurb „Potraga za blagom…“; `diff` helper kao u hrvatskom (`mcq`/`tf`/`order` primaju `diff`).

- [ ] **Step 2: Fact-check checklist (ispraviti ako krivo)**

| Tvrdnja | Očekivano |
|---------|-----------|
| Glavni grad HR | Zagreb |
| More | Jadransko more |
| Mjeseci ↔ doba | kalendarska podjela već u fajlu — potvrdi 12 redova |
| Žaba noge | 4 (tipično) |
| Pčela / leptir / mrav noge | 6 |
| Riba / dupin „noge“ | 0 |
| Semafor | crveno stani, zeleno idi oprezno |

Ispravi svaku netočnost + `explain`.

- [ ] **Step 3: Novi tipovi (Profil/kurikulum 1.)**

Dodaj:
- jučer / danas / sutra MCQ (3–6)
- match: dio tijela ↔ funkcija (već djelomično — proširi)
- order: jutro → podne → večer (postoji) + TF netrivijalni
- Smanji udio TF „X je živo biće“ true bez distraktora — više MCQ živo/neživo

- [ ] **Step 4: SOURCES.md**

```markdown
## Priroda i društvo
- Profil: Nina i Tino 1 / Pogled u svijet 1
- Gusarski: Nina i Tino 2 / Pogled u svijet 2
- Kurikulumski ishodi 1.–2. razred (teme)
```

- [ ] **Step 5: Commit**

```bash
git add ljeto-1razred/js/content/priroda.js ljeto-1razred/SOURCES.md
git -c user.name="ivsitum1" -c user.email="ivsitum1@users.noreply.github.com" commit -m "feat(ljeto): expand PiD tasks and verify facts"
```

---

### Task 8: Matematika framing + README + final verify

**Files:**
- Modify: `ljeto-1razred/js/content/matematika.js` (blurb/desc framing; `diff` na težim lancima = 3, jednostavnim usporedbama = 1–2)
- Modify: `ljeto-1razred/README.md`

- [ ] **Step 1: Framing only + diff tags** na representative generators (ne dirati MAX=20 opseg potrage).

- [ ] **Step 2: README**

Ažuriraj: hub mapa, Gusarski otok, novčanik gumb, Profil izvori → `SOURCES.md`.

- [ ] **Step 3: End-to-end checklist**

1. Sticky Novčanik vidljiv na 375px → dućan  
2. Unlock staze nakon ≥1 ⭐  
3. Gusarski katanac → unlock → hint  
4. Nema inventiranih PiD činjenica iz checkliste  
5. Migracija: stari progress zadrži wallet  

- [ ] **Step 4: Commit**

```bash
git add ljeto-1razred/js/content/matematika.js ljeto-1razred/README.md
git -c user.name="ivsitum1" -c user.email="ivsitum1@users.noreply.github.com" commit -m "docs(ljeto): adventure README and math framing"
```

---

## Spec coverage (self-review)

| Spec zahtjev | Task |
|--------------|------|
| Adventure mapa hub | 4 |
| Stanice + unlock ≥1 ⭐ | 1, 4 |
| Gusarski otok 4. zona + katanac | 4, 5 |
| Hint 1×, bez wallet | 3, 5 |
| Novčanik vidljiv / shop | 2 |
| HR/PiD proširenje tipova | 6, 7 |
| Težina 1. vs 2. razred | 5–8 |
| Profil izvori + SOURCES | 6, 7 |
| Fact-check | 7 |
| Migracija unlocked/wallet | 1, 2 |
| Animacije 2–3 | 4 |

## Placeholder scan

Nema TBD. Gusarski banka mora biti napunjena verificiranim stavkama u Task 5 (ne prazan array).
