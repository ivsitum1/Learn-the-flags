# Nina i Tino HRVATSKI stations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract all exercise pages from Nina i Tino 1 HRVATSKI 1. dio and add thematic `hrv-nt-*` stations to Ljetni park.

**Architecture:** Flipbook page images → markdown extract → thematic banks in a dedicated content module loaded by `hrvatski.js` → register games + extend `STATION_ORDER.hrvatski` after existing nine stations.

**Tech Stack:** Static HTML/JS (`ljeto-1razred`), existing question helpers (`mcq`, `tf`, `match`, `order`), Profil Klett flip images at `…/flip/12170/files/large/{n}.jpg`.

## Global Constraints

- Scope: exercise/worksheet pages only (skip covers, TOC, blanks, illustration-only).
- New stations only (`hrv-nt-*`); do not merge into existing `hrv-*` banks.
- Digital equivalents of draw/color tasks; no page scans as primary UI.
- Cite source in `SOURCES.md`; do not ship the textbook verbatim as a book.
- New stations append after `hrv-razumijevanje` in unlock order.
- Commit only when the user explicitly asks.

---

## File structure

| File | Role |
|------|------|
| `ljeto-1razred/extract/nina-tino-hrvatski-1.md` | Verbatim-ish exercise extract by flip page |
| `ljeto-1razred/js/content/nina-tino-hrvatski.js` | New banks + `CONTENT_NINA_TINO_HRV` games fragment |
| `ljeto-1razred/js/content/hrvatski.js` | Merge NT games into `CONTENT_HRVATSKI.games` |
| `ljeto-1razred/js/app.js` | Extend `STATION_ORDER.hrvatski` |
| `ljeto-1razred/index.html` | Script tag for new content file (before `hrvatski.js` or after, depending on merge pattern) |
| `ljeto-1razred/SOURCES.md` | Add Nina i Tino 1 HRVATSKI |
| `ljeto-1razred/README.md` | Update station count copy if it says „9 stanica“ |

---

### Task 1: Download flip images and write extract scaffold

**Files:**
- Create: `ljeto-1razred/extract/nina-tino-hrvatski-1.md`
- Create (local only, gitignore if needed): `ljeto-1razred/extract/pages/*.jpg`

**Interfaces:**
- Consumes: flip URLs `https://www.profil-klett.hr/sites/default/files/flip/12170/files/large/{1..154}.jpg`
- Produces: markdown scaffold with per-page sections ready to fill

- [ ] **Step 1: Create extract directory and download pages 1–154**

```powershell
New-Item -ItemType Directory -Force -Path "ljeto-1razred/extract/pages" | Out-Null
1..154 | ForEach-Object {
  $n = $_; $out = "ljeto-1razred/extract/pages/$n.jpg"
  if (-not (Test-Path $out)) {
    Invoke-WebRequest -Uri "https://www.profil-klett.hr/sites/default/files/flip/12170/files/large/$n.jpg" -OutFile $out -UseBasicParsing
  }
}
```

- [ ] **Step 2: Write markdown header**

```markdown
# Nina i Tino 1 HRVATSKI 1. dio — ekstrakt vježbi

Izvor: https://www.profil-klett.hr/sites/default/files/flip/12170/
Pravilo: samo vježbe; preskočene strane u dodatku.

## Vježbe

## Dodatak: preskočeno
```

- [ ] **Step 3: Smoke-check a few files exist**

Run: `(Get-ChildItem ljeto-1razred/extract/pages/*.jpg).Count`
Expected: `154` (or close; note any 404s)

---

### Task 2: Extract all exercise pages into markdown

**Files:**
- Modify: `ljeto-1razred/extract/nina-tino-hrvatski-1.md`

**Interfaces:**
- Consumes: page JPGs
- Produces: for each exercise page:

```markdown
### Flip {n} (tiskano {p} ako vidljivo)
- Zad. {k} **NASLOV**
  - Uputa: …
  - Stavke / sadržaj: …
  - Tema-kandidat: glasovi | usporedbe | slikovno | slova | rijeci | recenice | ostalo
```

- [ ] **Step 1: Process pages in batches (≈20)** — read each JPG, record exercises or list under „preskočeno“ with reason (naslovnica / sadržaj / prazno / samo ilustracija).
- [ ] **Step 2: After all batches, count exercise pages vs skipped** — ensure no silent gaps in flip index range.
- [ ] **Step 3: Cluster into final themes** — apply merge/split rule from spec (<8 → merge; >40 → split). Write final theme list at top of extract file.

---

### Task 3: Content module with helpers and first theme bank

**Files:**
- Create: `ljeto-1razred/js/content/nina-tino-hrvatski.js`
- Modify: `ljeto-1razred/index.html` (add script)

**Interfaces:**
- Consumes: extract themes + items
- Produces: `window.CONTENT_NINA_TINO_HRV = { games: [ ... ] }` where each game matches existing shape:

```javascript
{
  id: "hrv-nt-glasovi",
  title: "…",
  emoji: "…",
  desc: "…",
  roundSize: 10,
  bank: [ /* mcq|truefalse|match|order items */ ]
}
```

- [ ] **Step 1: Scaffold file** with same helper pattern as `hrvatski.js` (`mcq`, `tf`, `match`, `order`) scoped inside IIFE.
- [ ] **Step 2: Implement banks for each finalized theme** from Task 2 (one array per `hrv-nt-*` id).
- [ ] **Step 3: Export `CONTENT_NINA_TINO_HRV.games`**.
- [ ] **Step 4: Add script tag in `index.html` before `js/content/hrvatski.js`.**

---

### Task 4: Wire into Hrvatski subject and unlock order

**Files:**
- Modify: `ljeto-1razred/js/content/hrvatski.js` (end of `CONTENT_HRVATSKI`)
- Modify: `ljeto-1razred/js/app.js` (`STATION_ORDER.hrvatski`)

**Interfaces:**
- Consumes: `window.CONTENT_NINA_TINO_HRV.games`
- Produces: extended `CONTENT_HRVATSKI.games` and matching `STATION_ORDER`

- [ ] **Step 1: Append NT games**

```javascript
games: (function () {
  var base = [ /* existing 9 game objects */ ];
  var nt = (window.CONTENT_NINA_TINO_HRV && window.CONTENT_NINA_TINO_HRV.games) || [];
  return base.concat(nt);
})()
```

(or push after array literal — keep existing ids unchanged)

- [ ] **Step 2: Update blurb** to mention Nina i Tino stanice / total count.
- [ ] **Step 3: Append each `hrv-nt-*` id to `STATION_ORDER.hrvatski` after `hrv-razumijevanje`.**
- [ ] **Step 4: Manual test** — open hub → Hrvatski → confirm new cards appear locked after razumijevanje; play one round.

---

### Task 5: Docs

**Files:**
- Modify: `ljeto-1razred/SOURCES.md`
- Modify: `ljeto-1razred/README.md`

- [ ] **Step 1: SOURCES** — under Hrvatski add: `Profil Klett: Nina i Tino 1 HRVATSKI 1. dio (flip 12170)`.
- [ ] **Step 2: README** — replace hard-coded „9 stanica“ for hrvatski with accurate count / wording.
- [ ] **Step 3: Ensure `extract/pages/` is not committed** (add to `.gitignore` if images were downloaded).

---

### Task 6: Verification

- [ ] **Step 1: Load app** via static server; no console errors on missing `CONTENT_NINA_TINO_HRV`.
- [ ] **Step 2: Each new station** — start round, answer one correct / one wrong, confirm explain + stars.
- [ ] **Step 3: Unlock chain** — with progress cleared or test unlock, confirm first `hrv-nt-*` unlocks only after `hrv-razumijevanje` has ≥1 star (or document if test uses forced unlock).

---

## Spec coverage

| Spec requirement | Task |
|------------------|------|
| Extract exercises only | 1–2 |
| Structured extract file | 1–2 |
| Thematic new stations `hrv-nt-*` | 3–4 |
| Digital adaptation of draw/color | 3 |
| Wire `STATION_ORDER` after existing 9 | 4 |
| SOURCES + README | 5 |
| No new engine types | 3 (reuses helpers) |
| Skip non-exercises documented | 2 |

## Execution

User requested immediate start (`da. kreni`) → **inline execution** in this session (executing-plans style), beginning with Task 1–2 extraction.
