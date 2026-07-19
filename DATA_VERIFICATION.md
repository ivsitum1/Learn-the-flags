# ✅ Provjera podataka

Podaci o državama (`js/countries.js`) unakrsno su provjereni s vanjskim izvorima,
a ne samo pretpostavljeni.

## Izvori
- **[mledoze/countries](https://github.com/mledoze/countries)** — ISO 3166 baza (izvor iza
  `restcountries.com`): glavni grad, kontinent (regija/podregija), valuta, susjedi i
  hrvatski nazivi.
- **[samayo/country-json](https://github.com/samayo/country-json)** — populacija i dominantna religija.
- **Wikipedia / World Bank** (preko web pretrage) — ciljana provjera pojedinih brojki.

## Rezultat provjere (197 država)

| Polje | Rezultat |
|-------|----------|
| **Kontinent** | 0 neslaganja — svih 197 se poklapa, uključujući transkontinentalne (Rusija→Europa, Turska→Azija). |
| **Glavni grad** | 56 „razlika" — sve su hrvatski/lokalni egzonimi naspram engleskog (Beč/Vienna, Rim/Rome, Peking/Beijing). Točni. |
| **Hrvatski nazivi** | 10 razlika — provjereno s hrvatskom Wikipedijom; korišteni su standardni oblici (Fidži, Tadžikistan, Salomonski Otoci…). |
| **Populacija** | Vrijednosti su novije (2023./24.) od zastarjelih (2018.) u `samayo`; velike razlike potvrđene pretragom (npr. Eritreja ~3,6 mil., Sirija ~24 mil.). |
| **Religija** | 182/184 se poklapa s izvorom; Tajvan i Vijetnam („folk religion") opisani kao budizam/taoizam. |
| **Susjedi** | Ispravljene 2 stvarne greške: **Španjolska–Maroko** (Ceuta/Melilla) i **Azerbajdžan–Turska** (egzeklava Nahičevan). |

## Napomena
Podaci su na „edukacijskoj" razini točnosti. Brojka stanovništva je zaokružena
procjena; „poznato po" je opisno polje. Za Šri Lanku je zadržano „nema kopnenih
granica" (razdvaja je Palkov tjesnac od Indije).
