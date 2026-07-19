# ✅ Provjera podataka

Podaci o državama (`js/countries.js`) unakrsno su provjereni s vanjskim izvorima,
a ne samo pretpostavljeni.

## Izvori
- **[mledoze/countries](https://github.com/mledoze/countries)** — ISO 3166 baza (izvor iza
  `restcountries.com`): glavni grad, kontinent (regija/podregija), valuta, susjedi i
  hrvatski nazivi.
- **[samayo/country-json](https://github.com/samayo/country-json)** — populacija i dominantna religija.
- **Wikipedia / World Bank / ECB** — ciljana provjera pojedinih brojki i valuta.
- **[Natural Earth 50m](https://www.naturalearthdata.com/)** — poligoni država za karte
  (`js/countrypolys.js`).

## Rezultat provjere (197 država)

| Polje | Rezultat |
|-------|----------|
| **Kontinent** | 0 neslaganja — svih 197 se poklapa, uključujući transkontinentalne (Rusija→Europa, Turska→Azija). |
| **Glavni grad** | Hrvatski/lokalni egzonimi naspram engleskog (Beč/Vienna, Rim/Rome, Peking/Beijing). Točni. |
| **Hrvatski nazivi** | Provjereno s hrvatskom Wikipedijom; korišteni su standardni oblici. |
| **Populacija** | Zaokružene procjene (~2023./24.); 0 outliera (>2× / <0,5×) naspram mledoze. |
| **Religija** | Uglavnom usklađeno; Tajvan i Vijetnam („folk religion") opisani kao budizam/taoizam. |
| **Susjedi** | Ispravljene ranije greške (Španjolska–Maroko, Azerbajdžan–Turska). Namjerno: Šri Lanka bez Indije (Palkov tjesnac); bez Gibraltar/HK/Macao (nisu u skupu). |
| **Valute (2026.)** | **Bugarska → Euro** (ECB, 1. 1. 2026.). **Zimbabve → ZiG** (umjesto starog dolara). |

## Karte
- Svjetska + približena (kontinent / dio kontinenta).
- Država se iscrtava ispunjenom površinom (ne točkom), iz Natural Earth poligona.

## Napomena
Podaci su na „edukacijskoj" razini točnosti. Brojka stanovništva je zaokružena
procjena; „poznato po" je opisno polje. Kodovi `eh` (Zapadna Sahara) i `gf`
(Francuska Gvajana) pojavljuju se u susjedima, ali nemaju vlastiti zapis u bazi.
