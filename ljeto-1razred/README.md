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

- **Hub „Ljetni park“** s tri predmeta
- Po **3 mini-igre** u svakom predmetu (runde 8–10 zadataka)
- Zvjezdice i napredak u `localStorage` (ključ `ljeto1_progress`)
- Objašnjenje nakon pogrešnog odgovora

## Struktura

```
index.html
css/styles.css
js/app.js
js/engine.js
js/progress.js
js/content/matematika.js
js/content/hrvatski.js
js/content/priroda.js
```
