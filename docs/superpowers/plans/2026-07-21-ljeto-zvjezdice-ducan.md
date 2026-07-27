# Ljetni park — Dućan zvjezdica Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dijete skuplja potrošive zvjezdice u novčanik i troši ih na stvarne nagrade preko dućana otvorenog klikom na ⭐ u headeru.

**Architecture:** `Progress` drži `wallet` + `spent` uz postojeće `games`/`totalStars`. Katalog je fiksna lista. Novi view `shop` u `app.js`; header ⭐ otvara dućan. Nakon runde zvjezdice idu u novčanik.

**Tech Stack:** Vanilla JS, HTML, CSS, `localStorage` (bez build koraka).

**Spec:** `docs/superpowers/specs/2026-07-21-ljeto-zvjezdice-ducan-design.md`

## Global Constraints

- Jezik UI: hrvatski
- Bez roditeljskog PIN-a; `window.confirm` za potvrdu kupnje
- Header pokazuje `wallet`, ne `totalStars`
- Migracija: nedostajući `wallet` ← `totalStars`

## File structure

| File | Responsibility |
|------|----------------|
| `ljeto-1razred/js/progress.js` | wallet, spend, migracija |
| `ljeto-1razred/js/rewards.js` | fiksni katalog nagrada |
| `ljeto-1razred/js/app.js` | shop UI, header klik, addToWallet na finish |
| `ljeto-1razred/index.html` | `#view-shop` + script tag |
| `ljeto-1razred/css/styles.css` | stilovi dućana |

---

### Task 1: Progress — wallet API

**Files:**
- Modify: `ljeto-1razred/js/progress.js`

**Produces:**
- `Progress.wallet(): number`
- `Progress.addToWallet(n: number): number`
- `Progress.spend(reward: {id, title, cost}): {ok: boolean, wallet: number}`
- `Progress.getSpent(): Array<{id, title, cost, at}>`

- [ ] **Step 1: Extend `empty()` and `load()` with wallet/spent + migration**

In `empty()`, return `{ games: {}, totalStars: 0, wallet: 0, spent: [] }`.

In `load()`, after validating `games`/`totalStars`:
- if `typeof data.wallet !== "number"`, set `data.wallet = data.totalStars || 0`
- if `!Array.isArray(data.spent)`, set `data.spent = []`
- return data

- [ ] **Step 2: Add wallet helpers and export them**

```javascript
function wallet() {
  return load().wallet || 0;
}

function addToWallet(n) {
  var data = load();
  var add = Math.max(0, Math.floor(Number(n) || 0));
  data.wallet = (data.wallet || 0) + add;
  save(data);
  return data.wallet;
}

function spend(reward) {
  var data = load();
  var cost = reward && typeof reward.cost === "number" ? reward.cost : 0;
  if (cost <= 0 || (data.wallet || 0) < cost) {
    return { ok: false, wallet: data.wallet || 0 };
  }
  data.wallet -= cost;
  data.spent = data.spent || [];
  data.spent.push({
    id: reward.id,
    title: reward.title,
    cost: cost,
    at: new Date().toISOString()
  });
  save(data);
  return { ok: true, wallet: data.wallet };
}

function getSpent() {
  var list = load().spent || [];
  return list.slice().reverse();
}
```

Export on `global.Progress`: `wallet`, `addToWallet`, `spend`, `getSpent`.

- [ ] **Step 3: Manual verify in browser console** (open `ljeto-1razred/index.html`)

```javascript
Progress.addToWallet(5);
Progress.wallet(); // >= 5
Progress.spend({ id: "t", title: "Test", cost: 3 }); // ok:true
Progress.getSpent()[0].title; // "Test"
```

- [ ] **Step 4: Commit**

```bash
git add ljeto-1razred/js/progress.js
git commit -m "feat(ljeto): add spendable star wallet to progress"
```

---

### Task 2: Katalog nagrada

**Files:**
- Create: `ljeto-1razred/js/rewards.js`
- Modify: `ljeto-1razred/index.html` (script before `app.js`)

**Produces:** `window.REWARDS` array

- [ ] **Step 1: Create rewards.js**

```javascript
(function (global) {
  "use strict";
  global.REWARDS = [
    { id: "sladoled", emoji: "🍦", title: "Sladoled", cost: 10 },
    { id: "park", emoji: "🏞️", title: "Park / igralište", cost: 15 },
    { id: "bicikl-role", emoji: "🚲", title: "Bicikl / role", cost: 18 },
    { id: "film", emoji: "🍿", title: "Film / crtani", cost: 20 },
    { id: "obrok", emoji: "🍕", title: "Omiljeni obrok", cost: 25 },
    { id: "igracka", emoji: "🧸", title: "Mala igračka", cost: 30 }
  ];
})(window);
```

- [ ] **Step 2: Add script tag in index.html before app.js**

`<script src="js/rewards.js"></script>`

- [ ] **Step 3: Commit**

```bash
git add ljeto-1razred/js/rewards.js ljeto-1razred/index.html
git commit -m "feat(ljeto): add fixed real-reward catalog"
```

---

### Task 3: Shop UI (HTML + CSS + app)

**Files:**
- Modify: `ljeto-1razred/index.html`
- Modify: `ljeto-1razred/css/styles.css`
- Modify: `ljeto-1razred/js/app.js`

**Consumes:** `Progress.wallet`, `spend`, `getSpent`, `addToWallet`; `REWARDS`

- [ ] **Step 1: Add `#view-shop` markup after hub section**

```html
<section class="view" id="view-shop" data-view="shop">
  <div class="shop-head">
    <h2>Dućan nagrada</h2>
    <p class="shop-blurb">Potroši zvjezdice na stvarne nagrade — roditelj ih obavi.</p>
  </div>
  <div class="shop-grid" id="shopGrid"></div>
  <div class="shop-history">
    <h3>Nedavno iskorišteno</h3>
    <ul id="shopHistory"></ul>
  </div>
</section>
```

Make `#starsTotal` a `<button type="button">` (keep class `stars-total`) for accessibility.

- [ ] **Step 2: CSS for shop** — reuse card look from `.subject-card` / `.game-card`; add `.shop-card`, disabled state, history list.

- [ ] **Step 3: Wire app.js**

- `els.views.shop`, `shopGrid`, `shopHistory`; `starsTotal` click → `openShop()`
- `refreshStars()` uses `Progress.wallet()`
- `finishGame`: after `setStars`, call `Progress.addToWallet(stars)`; show “+N ⭐ u novčanik” in result (e.g. append to `resultMsg` or `resultScore`)
- `renderShop()`: for each reward, card + Iskoristi / disabled “Trebaš još X ⭐”; confirm then spend; re-render
- `renderHistory()`: last 10 from `getSpent()`, format date with `toLocaleDateString("hr-HR")`
- `goBack`: if `view === "shop"` → hub
- `showView("shop")` shows back button

- [ ] **Step 4: Manual test**

1. Play a game → wallet increases; result shows +N  
2. Click header ⭐ → shop  
3. Buy with enough stars → wallet down, history entry  
4. Try expensive item without stars → disabled  

- [ ] **Step 5: Commit**

```bash
git add ljeto-1razred/index.html ljeto-1razred/css/styles.css ljeto-1razred/js/app.js
git commit -m "feat(ljeto): star shop for real-world rewards"
```
