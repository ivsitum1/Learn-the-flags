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
- **Staze sa stanicama** — prva stanica otključana; sljedeća nakon runde s ≥1 ⭐
- **Gusarski otok** — otključava se kad imaš ≥1 ⭐ u svakom predmetu; miješana runda 2. razreda s besplatnim hintovima (1× po zadatku)
- Po **9 stanica** u matematici i hrvatskom, **3** u PiD-u (runde 8–12 zadataka)
- **Novčanik zvjezdica** — sticky gumb 🎒 Novčanik u headeru; klik otvara **dućan** stvarnih nagrada
- Najbolji rezultat po stanici na karticama; napredak u `localStorage` (`ljeto1_progress`)
- Objašnjenje nakon pogrešnog odgovora

## Izvori sadržaja

Gradivo usklađeno s **Profil Klett** udžbenicima i kurikulumskim ishodima — vidi [`SOURCES.md`](SOURCES.md).

## Struktura

```
index.html
css/styles.css
js/app.js
js/engine.js
js/progress.js
js/rewards.js
js/content/matematika.js
js/content/hrvatski.js
js/content/priroda.js
js/content/gusarski.js
SOURCES.md
```
