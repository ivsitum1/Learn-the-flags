# 🌍 Nauči zastave

Edukacijska web-aplikacija za učenje zastava svih država svijeta — na hrvatskom.
Čisti statični web (HTML + CSS + vanilla JavaScript), **bez build koraka**, radi i
offline. Sadrži **197 država** s bogatim podacima.

## ✨ Značajke

### 🃏 Kartice (flashcard)
Prikaže se zastava; klikom okreneš karticu i vidiš odgovor te sve detalje o državi.
Tri razine težine mijenjaju što pogađaš:

| Razina | Pogađaš |
|--------|---------|
| **Lako** | na kojem je kontinentu |
| **Normalno** | ime države |
| **Teško** | glavni grad |

Uz to: samo-ocjena (znao / nisam znao), rezultat, filtriranje po kontinentu i miješanje špila.

### ❓ Kviz — za 1 ili više igrača 🎮
Pitanja s ponuđenim odgovorima. Igraj **sam za vježbu** ili u načinu **"pass & play"**
za **do 6 igrača** na istom uređaju:

- unos imena igrača (svaki dobije svoju boju),
- izmjena igrača na potezu uz jasnu poruku „Predaj uređaj → …",
- živa ploča s rezultatima svih igrača,
- odabir broja rundi (5 / 10 / 15 / bez kraja),
- završni poredak s medaljama 🥇🥈🥉 i pobjednikom.

Prilagođeno najmlađima (od ~7 g.):

- **💡 Pomoć** — natuknica (kontinent i prvo slovo) za svako pitanje,
- **📍 karta ispravne države** pojavi se odmah nakon odgovora,
- **🔊 Pročitaj naglas** — klik na ime države pročita ga (nježno potiče čitanje),
- zastave nisu odrezane (cijela zastava vidljiva), krupnija slova,
- **bez ponavljanja** država dok se ne prođe cijeli špil,
- jednako pregledno uspravno i položeno (portrait / landscape).

### 📚 Enciklopedija
Pregled svih država (pretraga po imenu ili glavnom gradu, filter po kontinentu).
Klikom na državu otvara se kartica s punim detaljima; susjedi su klikabilni.

## 📊 Podaci po državi
- ime (hrvatski i engleski)
- kontinent
- glavni grad
- valuta
- dominantna vjera
- broj stanovnika
- susjedne države (kopnene granice)
- po čemu je zemlja poznata

## 🚩 Zastave
Zastava se uvijek prikazuje kao **emoji** (radi i offline), a preko njega se — kad
ima mreže — učita oštra SVG zastava s [flagcdn.com](https://flagcdn.com). Ako slika
ne uspije, ostaje emoji, pa polje nikad nije prazno.

## 🌐 Jezici
Sučelje i podaci dostupni su na **5 jezika** (prekidač u zaglavlju): 🇭🇷 hrvatski,
🇬🇧 engleski, 🇩🇪 njemački, 🇮🇹 talijanski i 🇪🇸 španjolski. Prevedeni su sučelje,
imena država, kontinenti, vjere, savjeti za razlikovanje i **opisi „poznato po"
za svih 197 država**. Nazivi valuta prikazuju se u međunarodnom (engleskom)
obliku za jezike osim hrvatskog. Odabir jezika pamti se.

## 🎨 Ostalo
- Svijetla i tamna tema (automatski prema sustavu + ručni prekidač).
- Napredak i rezultati pamte se u pregledniku (localStorage).
- Potpuno responzivno (mobitel / tablet / desktop).

## 🚀 Pokretanje lokalno

```bash
# bilo koji statični server, npr.:
python3 -m http.server 8000
# pa otvori http://localhost:8000
```

Ili jednostavno otvori `index.html` u pregledniku.

## 📁 Struktura

```
index.html         # sučelje
css/styles.css     # stilovi (uklj. tamnu temu)
js/countries.js    # baza od 197 država
js/app.js          # logika (kartice, kviz, enciklopedija, multiplayer)
```

## 📝 Napomena
Podaci (stanovništvo, vjera, „poznato po") približni su i služe u edukacijske svrhe.
Provjera podataka opisana je u [`DATA_VERIFICATION.md`](DATA_VERIFICATION.md).

## ⚖️ Licenca i prava
Copyright © 2026 **ivsitum1**. Sva prava pridržana. Nositelj svih prava na
repozitorij, aplikaciju izrađenu na temelju njega te na ideju i koncept jest
ivsitum1. Detalji u datoteci [`LICENSE`](LICENSE).
