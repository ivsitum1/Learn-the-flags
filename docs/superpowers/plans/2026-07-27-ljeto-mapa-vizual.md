# Ljetni park — Mapa vizualni polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pretvoriti hub i pozadinu Ljetnog parka u živu adventure mapu (ilustrirani otok + ambient + dramatski unlock/blago/hint) bez canvasa i vanjskih asseta.

**Architecture:** Dekorativni ambient i SVG otok žive u HTML/CSS; `app.js` samo sinkronizira locked/unlocked klasu gusara na otoku, pokreće lagani parallax (ako `matchMedia` dopušta) i proširuje postojeće event klase (`just-unlocked`, `treasure-pop`, hint). Klik ostaje na `map-region` / `station-node`.

**Tech Stack:** Vanilla HTML/CSS/JS u `ljeto-1razred/` (bez builda, bez canvasa, bez novih libraryja).

**Spec:** `docs/superpowers/specs/2026-07-27-ljeto-mapa-vizual-design.md`

## Global Constraints

- UI jezik: hrvatski
- Pure CSS/SVG; **bez** canvasa, Lottie, sprite sheetova, novih network dependencyja
- Otok je dekorativan (`aria-hidden`, `pointer-events: none`); klik = postojeći gumbi
- `prefers-reduced-motion: reduce` gasi petlje, parallax i burstove
- Ne dirati banke zadataka, `progress.js` unlock logiku, `engine.js` pravila, `rewards.js`
- Commiti: `git -c user.name="ivsitum1" -c user.email="ivsitum1@users.noreply.github.com" commit ...` (ne dirati git config)

## File structure

| File | Responsibility |
|------|----------------|
| `ljeto-1razred/index.html` | Ambient markup u `.sky`; SVG otok u hubu |
| `ljeto-1razred/css/styles.css` | Scene, petlje, burstovi, trail polish, reduced-motion |
| `ljeto-1razred/js/app.js` | Sync `#islandScene` gusar state; parallax; stagger/burst hookovi |
| `.superpowers/sdd/mapa-vizual-verify.js` | Smoke asserts na HTML/CSS/JS markere |

---

### Task 1: Ambient nebo (oblaci, sunce, čestice) + reduced-motion

**Files:**
- Modify: `ljeto-1razred/index.html`
- Modify: `ljeto-1razred/css/styles.css`
- Create: `.superpowers/sdd/mapa-vizual-verify.js` (početni asserts za Task 1)

**Interfaces:**
- Consumes: postojeći `.sky` wrapper
- Produces: DOM klase `.sky-sun`, `.sky-cloud`, `.sky-cloud--n`, `.sky-spark`, `.sky-ground`; CSS keyframes `cloud-drift`, `sun-pulse`, `spark-float`

- [ ] **Step 1: Write failing verify script (ambient markers)**

Create `.superpowers/sdd/mapa-vizual-verify.js`:

```javascript
"use strict";
var fs = require("fs");
var path = require("path");
var ROOT = path.join(__dirname, "..", "..", "ljeto-1razred");
var html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
var css = fs.readFileSync(path.join(ROOT, "css", "styles.css"), "utf8");
var results = [];
function pass(name, ok, detail) {
  results.push({ name: name, ok: ok });
  console.log((ok ? "PASS" : "FAIL") + " " + name + (detail ? " — " + detail : ""));
}
pass("sky-sun markup", /class="[^"]*sky-sun/.test(html) || /class='[^']*sky-sun/.test(html));
pass("sky-cloud markup", /sky-cloud/.test(html));
pass("sky-spark markup", /sky-spark/.test(html));
pass("cloud-drift keyframes", /@keyframes\s+cloud-drift/.test(css));
pass("sun-pulse keyframes", /@keyframes\s+sun-pulse/.test(css));
pass("spark-float keyframes", /@keyframes\s+spark-float/.test(css));
pass("reduced-motion block", /prefers-reduced-motion:\s*reduce/.test(css));
var failed = results.filter(function (r) { return !r.ok; });
process.exit(failed.length ? 1 : 0);
```

- [ ] **Step 2: Run verify — expect FAIL**

Run: `node .superpowers/sdd/mapa-vizual-verify.js`  
Expected: FAIL on missing ambient markers / keyframes

- [ ] **Step 3: Add ambient markup inside `.sky`**

In `ljeto-1razred/index.html`, replace:

```html
  <div class="sky" aria-hidden="true"></div>
```

with:

```html
  <div class="sky" aria-hidden="true">
    <div class="sky-sun"></div>
    <div class="sky-cloud sky-cloud--1"></div>
    <div class="sky-cloud sky-cloud--2"></div>
    <div class="sky-cloud sky-cloud--3"></div>
    <div class="sky-sparks">
      <span class="sky-spark"></span>
      <span class="sky-spark"></span>
      <span class="sky-spark"></span>
      <span class="sky-spark"></span>
      <span class="sky-spark"></span>
      <span class="sky-spark"></span>
    </div>
    <div class="sky-ground"></div>
  </div>
```

- [ ] **Step 4: Add ambient CSS (after existing `.sky::after` block)**

Append to `ljeto-1razred/css/styles.css` (keep existing `.sky` gradient; remove or override the old `.sky::after` grass strip if it conflicts — prefer moving ground into `.sky-ground`):

```css
.sky-sun {
  position: absolute;
  top: 4%;
  right: 8%;
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #ffe9a0, var(--sun) 55%, rgba(255, 201, 60, 0.2) 70%, transparent 72%);
  box-shadow: 0 0 40px rgba(255, 201, 60, 0.55);
  animation: sun-pulse 4.5s ease-in-out infinite;
  pointer-events: none;
}

.sky-cloud {
  position: absolute;
  background: rgba(255, 255, 255, 0.78);
  border-radius: 999px;
  filter: blur(0.5px);
  opacity: 0.85;
  animation: cloud-drift linear infinite;
  pointer-events: none;
}

.sky-cloud::before,
.sky-cloud::after {
  content: "";
  position: absolute;
  background: inherit;
  border-radius: 50%;
}

.sky-cloud--1 {
  width: 7rem;
  height: 2.2rem;
  top: 10%;
  left: -10%;
  animation-duration: 48s;
}
.sky-cloud--1::before {
  width: 2.8rem;
  height: 2.8rem;
  top: -1.3rem;
  left: 1.2rem;
}
.sky-cloud--1::after {
  width: 2.2rem;
  height: 2.2rem;
  top: -0.9rem;
  left: 3.4rem;
}

.sky-cloud--2 {
  width: 5.5rem;
  height: 1.7rem;
  top: 22%;
  left: -20%;
  animation-duration: 62s;
  animation-delay: -12s;
  opacity: 0.7;
}
.sky-cloud--2::before {
  width: 2.2rem;
  height: 2.2rem;
  top: -1rem;
  left: 0.9rem;
}
.sky-cloud--2::after {
  width: 1.8rem;
  height: 1.8rem;
  top: -0.7rem;
  left: 2.8rem;
}

.sky-cloud--3 {
  width: 6rem;
  height: 1.9rem;
  top: 16%;
  left: -15%;
  animation-duration: 55s;
  animation-delay: -28s;
  opacity: 0.65;
}
.sky-cloud--3::before {
  width: 2.4rem;
  height: 2.4rem;
  top: -1.1rem;
  left: 1rem;
}
.sky-cloud--3::after {
  width: 2rem;
  height: 2rem;
  top: -0.8rem;
  left: 3rem;
}

.sky-sparks {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.sky-spark {
  position: absolute;
  width: 0.35rem;
  height: 0.35rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 6px rgba(255, 201, 60, 0.8);
  animation: spark-float 7s ease-in-out infinite;
}

.sky-spark:nth-child(1) { left: 12%; top: 40%; animation-delay: 0s; }
.sky-spark:nth-child(2) { left: 28%; top: 55%; animation-delay: -1.2s; }
.sky-spark:nth-child(3) { left: 48%; top: 35%; animation-delay: -2.4s; }
.sky-spark:nth-child(4) { left: 62%; top: 60%; animation-delay: -3.1s; }
.sky-spark:nth-child(5) { left: 78%; top: 45%; animation-delay: -4s; }
.sky-spark:nth-child(6) { left: 88%; top: 70%; animation-delay: -5.2s; }

.sky-ground {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 22%;
  background: linear-gradient(180deg, transparent, rgba(61, 154, 95, 0.28));
  pointer-events: none;
}

@keyframes sun-pulse {
  0%, 100% { transform: scale(1); opacity: 0.95; }
  50% { transform: scale(1.08); opacity: 1; }
}

@keyframes cloud-drift {
  from { transform: translateX(0); }
  to { transform: translateX(120vw); }
}

@keyframes spark-float {
  0%, 100% { transform: translateY(0) scale(1); opacity: 0.35; }
  50% { transform: translateY(-18px) scale(1.35); opacity: 0.95; }
}

@media (prefers-reduced-motion: reduce) {
  .sky-sun,
  .sky-cloud,
  .sky-spark {
    animation: none !important;
  }
}
```

Also delete or empty the old `.sky::after` grass rule so it does not double-stack with `.sky-ground`.

- [ ] **Step 5: Run verify — expect PASS for Task 1 asserts**

Run: `node .superpowers/sdd/mapa-vizual-verify.js`  
Expected: all current asserts PASS (exit 0)

- [ ] **Step 6: Commit**

```bash
git add ljeto-1razred/index.html ljeto-1razred/css/styles.css .superpowers/sdd/mapa-vizual-verify.js
git -c user.name="ivsitum1" -c user.email="ivsitum1@users.noreply.github.com" commit -m "feat(ljeto): add ambient sky motion for adventure map"
```

---

### Task 2: Ilustrirani SVG otok + sync gusar stanja

**Files:**
- Modify: `ljeto-1razred/index.html` (`#view-hub`)
- Modify: `ljeto-1razred/css/styles.css`
- Modify: `ljeto-1razred/js/app.js` (`renderHub` / `renderGusarRegion`)
- Modify: `.superpowers/sdd/mapa-vizual-verify.js`

**Interfaces:**
- Consumes: `Progress.gusarUnlocked(gusarSubjectGameIds())`
- Produces:
  - `#islandScene` root with classes `.island-scene` and optionally `.gusar-locked`
  - Zones: `.island-zone--mat`, `.island-zone--hrv`, `.island-zone--pid`, `.island-zone--gus`
  - `syncIslandScene(unlocked: boolean): void`

- [ ] **Step 1: Extend verify for island markers**

Append asserts to `mapa-vizual-verify.js`:

```javascript
pass("islandScene id", /id="islandScene"/.test(html));
pass("island zones", /island-zone--mat/.test(html) && /island-zone--gus/.test(html));
pass("island-scene css", /\.island-scene\b/.test(css));
pass("gusar-locked css", /\.island-scene\.gusar-locked|\.gusar-locked\s+\.island-zone--gus/.test(css));
var app = fs.readFileSync(path.join(ROOT, "js", "app.js"), "utf8");
pass("syncIslandScene fn", /function\s+syncIslandScene\s*\(/.test(app));
```

Run: `node .superpowers/sdd/mapa-vizual-verify.js`  
Expected: FAIL on new island asserts

- [ ] **Step 2: Insert SVG scene in hub HTML**

In `ljeto-1razred/index.html`, inside `#view-hub`, **after** `.hero` and **before** `#subjectGrid`, add:

```html
      <div class="island-scene gusar-locked" id="islandScene" aria-hidden="true">
        <svg class="island-svg" viewBox="0 0 360 220" xmlns="http://www.w3.org/2000/svg" focusable="false">
          <defs>
            <linearGradient id="seaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#7ec8f5"/>
              <stop offset="100%" stop-color="#3d8ec9"/>
            </linearGradient>
          </defs>
          <rect width="360" height="220" fill="url(#seaGrad)" rx="18"/>
          <!-- main island -->
          <ellipse cx="175" cy="130" rx="130" ry="58" fill="#6fbf73"/>
          <ellipse cx="175" cy="118" rx="118" ry="48" fill="#8fd18a"/>
          <!-- mat zone -->
          <g class="island-zone island-zone--mat">
            <ellipse cx="110" cy="115" rx="38" ry="28" fill="#2f8f6b"/>
            <text x="110" y="120" text-anchor="middle" font-size="22">🔢</text>
          </g>
          <!-- hrv zone -->
          <g class="island-zone island-zone--hrv">
            <ellipse cx="175" cy="95" rx="36" ry="26" fill="#d97706"/>
            <text x="175" y="100" text-anchor="middle" font-size="22">📖</text>
          </g>
          <!-- pid zone -->
          <g class="island-zone island-zone--pid">
            <ellipse cx="240" cy="120" rx="38" ry="28" fill="#2563a8"/>
            <text x="240" y="125" text-anchor="middle" font-size="22">🌿</text>
          </g>
          <!-- paths -->
          <path class="island-path" d="M140 115 Q175 105 210 118" fill="none" stroke="#ffc93c" stroke-width="3" stroke-dasharray="6 5" stroke-linecap="round"/>
          <path class="island-path" d="M175 118 Q200 140 230 130" fill="none" stroke="#ffc93c" stroke-width="3" stroke-dasharray="6 5" stroke-linecap="round"/>
          <!-- bridge / mist to gusar -->
          <path class="island-bridge" d="M285 145 Q310 150 325 155" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="4" stroke-dasharray="4 6"/>
          <!-- gusar islet -->
          <g class="island-zone island-zone--gus">
            <ellipse cx="325" cy="165" rx="28" ry="18" fill="#1e3a4c"/>
            <text class="gus-flag" x="325" y="168" text-anchor="middle" font-size="18">🏴‍☠️</text>
            <text class="gus-lock" x="325" y="170" text-anchor="middle" font-size="16">🔒</text>
          </g>
        </svg>
      </div>
```

- [ ] **Step 3: Island CSS**

```css
.island-scene {
  margin: 0 auto 1.25rem;
  max-width: 420px;
  pointer-events: none;
  filter: drop-shadow(0 10px 24px rgba(30, 58, 76, 0.18));
  animation: island-reveal 0.7s ease both;
}

.island-svg {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 18px;
}

.island-zone--mat,
.island-zone--hrv,
.island-zone--pid {
  filter: drop-shadow(0 0 6px rgba(255, 201, 60, 0.35));
}

.island-zone--gus .gus-lock { display: none; }
.island-zone--gus .gus-flag { display: inline; }

.island-scene.gusar-locked .island-zone--gus {
  opacity: 0.55;
  filter: grayscale(0.35);
}
.island-scene.gusar-locked .island-zone--gus .gus-lock { display: inline; }
.island-scene.gusar-locked .island-zone--gus .gus-flag { display: none; }

.island-scene:not(.gusar-locked) .island-zone--gus {
  animation: gus-glow 2.4s ease-in-out infinite;
}

@keyframes island-reveal {
  from { opacity: 0; transform: translateY(12px) scale(0.96); }
  to { opacity: 1; transform: none; }
}

@keyframes gus-glow {
  0%, 100% { filter: drop-shadow(0 0 4px rgba(255, 201, 60, 0.25)); }
  50% { filter: drop-shadow(0 0 14px rgba(255, 201, 60, 0.75)); }
}

@media (prefers-reduced-motion: reduce) {
  .island-scene,
  .island-scene:not(.gusar-locked) .island-zone--gus {
    animation: none !important;
  }
}
```

- [ ] **Step 4: Wire `syncIslandScene` in `app.js`**

Near other helpers, add:

```javascript
  function syncIslandScene(unlocked) {
    var scene = document.getElementById("islandScene");
    if (!scene) return;
    scene.classList.toggle("gusar-locked", !unlocked);
  }
```

At end of `renderGusarRegion` (after deciding `unlocked`), call:

```javascript
    syncIslandScene(!!(gusarContent && unlocked));
```

Also call once at startup after `renderHub()` is fine because `renderGusarRegion` already runs inside `renderHub`.

- [ ] **Step 5: Run verify — expect PASS**

Run: `node .superpowers/sdd/mapa-vizual-verify.js`  
Expected: exit 0

- [ ] **Step 6: Manual check**

Open `ljeto-1razred/index.html` in browser: otok vidljiv iznad kartica; s praznim progressom gusar zona ima katanac; nakon unlocka (ili privremenog forsiranja lokalnog storagea) glow + zastava.

- [ ] **Step 7: Commit**

```bash
git add ljeto-1razred/index.html ljeto-1razred/css/styles.css ljeto-1razred/js/app.js .superpowers/sdd/mapa-vizual-verify.js
git -c user.name="ivsitum1" -c user.email="ivsitum1@users.noreply.github.com" commit -m "feat(ljeto): add decorative treasure island scene on hub"
```

---

### Task 3: Uskladiti kartice/stazu + hub stagger

**Files:**
- Modify: `ljeto-1razred/css/styles.css`
- Modify: `ljeto-1razred/js/app.js` (`renderHub` region buttons)
- Modify: `.superpowers/sdd/mapa-vizual-verify.js`

**Interfaces:**
- Consumes: `.map-region`, `.station-node`, `.station-link`
- Produces: `.map-region--enter`, staggered `animation-delay`; richer `.station-link` / unlocked node glow

- [ ] **Step 1: Extend verify**

```javascript
pass("map-region enter animation", /map-region--enter|@keyframes\s+region-enter/.test(css));
pass("station-link polish", /\.station-link/.test(css) && /station-link/.test(css));
```

(Keep asserts honest: check for `region-enter` keyframes and e.g. `station-link::after` or `box-shadow` enrichment — use a unique marker comment in CSS: `/* trail-polish */` next to `.station-link` rules and assert `/trail-polish/.test(css)`.)

Add to CSS near station-link: `/* trail-polish */`  
Assert: `pass("trail-polish marker", /trail-polish/.test(css));`  
Assert: `pass("region-enter keyframes", /@keyframes\s+region-enter/.test(css));`  
Assert: `pass("map-region--enter class in app", /map-region--enter/.test(app));`

Run verify — expect FAIL

- [ ] **Step 2: CSS for stagger + trail**

```css
@keyframes region-enter {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: none; }
}

.map-region.map-region--enter {
  animation: region-enter 0.45s ease both;
}

.map-region.map-region--enter:nth-child(1) { animation-delay: 0.05s; }
.map-region.map-region--enter:nth-child(2) { animation-delay: 0.12s; }
.map-region.map-region--enter:nth-child(3) { animation-delay: 0.19s; }
.map-region.map-region--enter:nth-child(4) { animation-delay: 0.26s; }

/* trail-polish */
.station-link {
  width: 4px;
  height: 1.35rem;
  margin: 0 auto;
  background: linear-gradient(180deg, rgba(255, 201, 60, 0.75), rgba(61, 154, 95, 0.65));
  border-radius: 999px;
  box-shadow: 0 0 10px rgba(255, 201, 60, 0.45);
  position: relative;
}

.station-link::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: 8px;
  height: 8px;
  margin: -4px 0 0 -4px;
  border-radius: 50%;
  background: var(--sun);
  box-shadow: 0 0 8px rgba(255, 201, 60, 0.8);
}

.station-node:not(.locked) {
  box-shadow: var(--shadow), 0 0 0 1px rgba(255, 201, 60, 0.25);
}

@media (prefers-reduced-motion: reduce) {
  .map-region.map-region--enter {
    animation: none !important;
  }
}
```

- [ ] **Step 3: Add enter class in `renderHub` / `renderGusarRegion`**

When creating each region button:

```javascript
      btn.className = "map-region map-region--enter";
```

For gusar:

```javascript
    btn.className = "map-region gusar map-region--enter";
```

- [ ] **Step 4: Run verify — PASS; quick visual on subject trail**

- [ ] **Step 5: Commit**

```bash
git add ljeto-1razred/css/styles.css ljeto-1razred/js/app.js .superpowers/sdd/mapa-vizual-verify.js
git -c user.name="ivsitum1" -c user.email="ivsitum1@users.noreply.github.com" commit -m "feat(ljeto): stagger hub regions and polish station trail"
```

---

### Task 4: Wow momenti — unlock burst, treasure shower, hint shimmer

**Files:**
- Modify: `ljeto-1razred/css/styles.css`
- Modify: `ljeto-1razred/js/app.js` (`openSubject` unlock, `finishGame`, `applyHintToQuestion` / `mountHintButton`)
- Modify: `.superpowers/sdd/mapa-vizual-verify.js`

**Interfaces:**
- Consumes: existing `.just-unlocked`, `.treasure-pop`, `.hint-btn`
- Produces: `.unlock-burst` pseudo/children, `.star-shower`, `.hint-btn.hint-shimmer`, `.feedback.info.hint-slide`

- [ ] **Step 1: Extend verify**

```javascript
pass("unlock-burst keyframes", /@keyframes\s+unlock-burst|unlock-burst/.test(css));
pass("star-shower", /star-shower/.test(css));
pass("hint-shimmer", /hint-shimmer/.test(css));
pass("hint-slide", /hint-slide/.test(css));
pass("app star-shower hook", /star-shower/.test(app));
pass("app hint-shimmer hook", /hint-shimmer/.test(app));
```

Run — expect FAIL

- [ ] **Step 2: CSS bursts**

Replace/extend existing unlock + treasure rules:

```css
.station-node.just-unlocked {
  animation: node-unlock 0.55s ease;
  position: relative;
  overflow: visible;
}

.station-node.just-unlocked::before {
  content: "✨";
  position: absolute;
  right: 0.6rem;
  top: -0.35rem;
  font-size: 1.4rem;
  animation: unlock-burst 0.7s ease both;
  pointer-events: none;
}

@keyframes unlock-burst {
  0% { transform: scale(0.4) translateY(8px); opacity: 0; }
  40% { transform: scale(1.3) translateY(-4px); opacity: 1; }
  100% { transform: scale(1) translateY(-12px); opacity: 0; }
}

@keyframes node-unlock {
  0% { transform: scale(0.92); box-shadow: 0 0 0 0 rgba(255, 201, 60, 0); }
  50% { transform: scale(1.05); box-shadow: 0 0 28px rgba(255, 201, 60, 0.7); }
  100% { transform: scale(1); box-shadow: var(--shadow); }
}

.result-stars.treasure-pop {
  animation: treasure-pop 0.65s ease;
  position: relative;
}

.result-panel.has-star-shower::after {
  content: "⭐ ✦ ⭐ ✦ ⭐";
  position: absolute;
  left: 50%;
  top: 12%;
  transform: translateX(-50%);
  letter-spacing: 0.35em;
  font-size: 1.1rem;
  animation: star-shower 1.1s ease both;
  pointer-events: none;
}

@keyframes star-shower {
  0% { opacity: 0; transform: translate(-50%, -8px) scale(0.7); }
  30% { opacity: 1; }
  100% { opacity: 0; transform: translate(-50%, 28px) scale(1.1); }
}

.hint-btn.hint-shimmer {
  animation: hint-shimmer 0.85s ease;
}

@keyframes hint-shimmer {
  0% { box-shadow: 0 0 0 rgba(255, 201, 60, 0); }
  40% { box-shadow: 0 0 18px rgba(255, 201, 60, 0.65); }
  100% { box-shadow: var(--shadow); }
}

.feedback.info.hint-slide {
  animation: hint-slide 0.4s ease both;
}

@keyframes hint-slide {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: none; }
}

@media (prefers-reduced-motion: reduce) {
  .station-node.just-unlocked,
  .station-node.just-unlocked::before,
  .result-stars.treasure-pop,
  .result-panel.has-star-shower::after,
  .hint-btn.hint-shimmer,
  .feedback.info.hint-slide {
    animation: none !important;
  }
}
```

Ensure `.result-panel` has `position: relative` (add if missing).

- [ ] **Step 3: JS hooks**

In `finishGame`, after applying `treasure-pop`:

```javascript
    var resultPanel = els.resultStars.closest(".result-panel");
    if (resultPanel) {
      resultPanel.classList.remove("has-star-shower");
      void resultPanel.offsetWidth;
      if (stars >= 1) resultPanel.classList.add("has-star-shower");
    }
```

In `mountHintButton`, after creating the button:

```javascript
    hintBtn.classList.add("hint-shimmer");
```

In `applyHintToQuestion`, when showing feedback:

```javascript
      els.feedback.className = "feedback info hint-slide";
```

- [ ] **Step 4: Run verify — PASS**

- [ ] **Step 5: Commit**

```bash
git add ljeto-1razred/css/styles.css ljeto-1razred/js/app.js .superpowers/sdd/mapa-vizual-verify.js
git -c user.name="ivsitum1" -c user.email="ivsitum1@users.noreply.github.com" commit -m "feat(ljeto): add unlock burst, treasure shower, and hint shimmer"
```

---

### Task 5: Parallax slojevi + final verify + README note

**Files:**
- Modify: `ljeto-1razred/js/app.js`
- Modify: `ljeto-1razred/css/styles.css` (parallax transform hooks)
- Modify: `ljeto-1razred/README.md` (jedna rečenica o vizualu)
- Modify: `.superpowers/sdd/mapa-vizual-verify.js`

**Interfaces:**
- Consumes: `.sky-sun`, `.sky-cloud`, `.sky-ground`, `matchMedia('(prefers-reduced-motion: reduce)')`
- Produces: `initSkyParallax(): void` — sets `--parallax-y` or inline `translate3d` on layers; no-op when reduce

- [ ] **Step 1: Extend verify**

```javascript
pass("initSkyParallax", /function\s+initSkyParallax\s*\(/.test(app));
pass("parallax respects reduced motion", /prefers-reduced-motion/.test(app));
```

Run — expect FAIL

- [ ] **Step 2: CSS parallax hooks**

```css
.sky-sun,
.sky-cloud,
.sky-ground {
  will-change: transform;
}
```

(Transforms from JS stack with animation — apply parallax on a wrapper if conflict; preferred: set `style.transform` only on `.sky-ground` and a new `.sky-parallax` wrapper around sparks, leave cloud CSS animation alone. Simpler approach for this task:)

Wrap is optional. Minimal approach — only translate `.sky-ground` and `.sky-sparks` via JS:

```javascript
  function initSkyParallax() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var ground = document.querySelector(".sky-ground");
    var sparks = document.querySelector(".sky-sparks");
    var sun = document.querySelector(".sky-sun");
    if (!ground && !sparks && !sun) return;
    function onScroll() {
      var y = window.scrollY || 0;
      if (sun) sun.style.transform = "translate3d(0," + y * 0.05 + "px,0)";
      if (sparks) sparks.style.transform = "translate3d(0," + y * 0.08 + "px,0)";
      if (ground) ground.style.transform = "translate3d(0," + y * 0.12 + "px,0)";
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
```

Note: sun also has `sun-pulse` scale animation — combining inline `transform` will override keyframes. **Fix:** apply parallax only to `.sky-sparks` and `.sky-ground`, leave `.sky-sun` on pure CSS pulse.

Use this final version in the plan:

```javascript
  function initSkyParallax() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var ground = document.querySelector(".sky-ground");
    var sparks = document.querySelector(".sky-sparks");
    if (!ground && !sparks) return;
    function onScroll() {
      var y = window.scrollY || 0;
      if (sparks) sparks.style.transform = "translate3d(0," + (y * 0.08) + "px,0)";
      if (ground) ground.style.transform = "translate3d(0," + (y * 0.12) + "px,0)";
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
```

Call `initSkyParallax()` once at bottom next to `renderHub()`.

- [ ] **Step 3: README**

In `ljeto-1razred/README.md`, under hub bullet, add one line:

```markdown
- **Vizual** — ilustrirani otok na hubu, ambient nebo (oblaci/sunce/čestice), dramatski unlock i blago; poštuje `prefers-reduced-motion`
```

- [ ] **Step 4: Full verify PASS**

Run: `node .superpowers/sdd/mapa-vizual-verify.js`  
Expected: exit 0, all asserts PASS

- [ ] **Step 5: Manual acceptance (spec checklist)**

1. ~375px: otok + zone klikabilne  
2. Gusar locked/unlocked vizual sync  
3. ≥3 ambient petlje (oblaci, sunce, sparks)  
4. Unlock burst + treasure shower + hint shimmer  
5. DevTools reduced-motion: petlje/parallax/burst off  
6. Navigacija/unlock/shop bez regresije  

- [ ] **Step 6: Commit**

```bash
git add ljeto-1razred/js/app.js ljeto-1razred/css/styles.css ljeto-1razred/README.md .superpowers/sdd/mapa-vizual-verify.js
git -c user.name="ivsitum1" -c user.email="ivsitum1@users.noreply.github.com" commit -m "feat(ljeto): add sky parallax and finish map visual polish"
```

---
