# Ljetni park — ponavljanje 1. razreda

Zabavna statična web-aplikacija za ljetno ponavljanje gradiva **prvog razreda**
osnovne škole: matematika, hrvatski jezik te priroda i društvo.

## Pokretanje

Otvori `index.html` u pregledniku ili pokreni statični server iz korijena repoa:

```bash
python -m http.server 8000
# pa http://localhost:8000/ljeto-1razred/
```

## Što ima

- **Hub „Potraga za blagom“** — adventure mapa s tri regije (matematika, hrvatski, PiD) i **Skrivenim gusarskim otokom**
- **Vizual** — ilustrirani otok na hubu, ambient nebo (oblaci/sunce/čestice), dramatski unlock i blago; poštuje `prefers-reduced-motion`
- **Staze sa stanicama** — prva stanica otključana; sljedeća nakon runde s ≥1 ⭐
- **Gusarski otok** — otključava se kad imaš ≥1 ⭐ u svakom predmetu; miješana runda 2. razreda s besplatnim hintovima (1× po zadatku)
- **10 stanica** u matematici, **9** u PiD-u, **16** u hrvatskom (9 osnovnih + pravopis + 6 „Nina i Tino“); runde 8–12 zadataka
- **Pravopis** — vlastita stanica u hrvatskom (ije/je, č/ć, dž/đ, glas h, „ne“ uz glagol), a u matematičkim
  stanicama *Zadaci s riječima* i *Zadaci i novac* svaka runda nosi i **3 pravopisna zadatka**
- **Novčanik zvjezdica** — sticky gumb 🎒 Novčanik u headeru; klik otvara **dućan** stvarnih nagrada.
  U novčanik ide samo napredak (nove zvjezdice), pa se ponavljanjem iste stanice ne skupljaju nagrade
- **Instalacija na tablet** — vlastiti `manifest.webmanifest` i ikone; radi offline preko service workera glavne aplikacije
- **Gumb „Osvježi“** — kad je objavljena nova verzija, pojavi se skočna obavijest (nema tihog osvježavanja usred zadatka)
- Najbolji rezultat po stanici na karticama; napredak u `localStorage` (`ljeto1_progress`).
  Stari zapisi s preimenovanim stanicama se automatski poprave — 1. stanica je uvijek otvorena
- Objašnjenje nakon pogrešnog odgovora

## Provjera sadržaja

Aplikacija nema build korak pa greške u bankama zadataka nitko ne uhvati prije djeteta.
Prije objave pokreni:

```bash
node ljeto-1razred/tools/check-content.js
```

Provjerava da svaka stanica sa staze postoji, da je svako pitanje rješivo (točan odgovor
je među ponudama, nema dvostrukih ponuda), da runda ima traženi broj zadataka bez
ponavljanja i da staro spremljeno stanje ne ostavi predmet zaključanim.

## Izvori sadržaja

Gradivo usklađeno s **Profil Klett** udžbenicima i kurikulumskim ishodima — vidi [`SOURCES.md`](SOURCES.md).

## Struktura

```
index.html
manifest.webmanifest
icons/
css/styles.css
js/app.js
js/engine.js
js/progress.js
js/rewards.js
js/content/matematika.js
js/content/nina-tino-hrvatski.js
js/content/hrvatski.js
js/content/priroda.js
js/content/gusarski.js
tools/check-content.js
SOURCES.md
```

Skočni gumb „Osvježi“ dolazi iz zajedničke datoteke [`../js/update-notice.js`](../js/update-notice.js).
