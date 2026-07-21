# Design: Dućan zvjezdica (stvarne nagrade) — Ljetni park

Datum: 2026-07-21  
Opseg: `ljeto-1razred/`

## Cilj

Dijete skuplja potrošive zvjezdice igranjem i može ih u app-u “potrošiti” na stvarne nagrade (sladoled, park, …). Roditelj to obavi izvan app-a; app samo vodi saldo i povijest.

## Odluke

| Tema | Odabir |
|------|--------|
| Vrsta nagrada | Stvarne (roditelj obavlja) |
| Tko kupuje | Dijete samo, odmah oduzima saldo |
| Katalog | Fiksna lista (~6 stavki) u kodu |
| Ulaz u dućan | Klik na ⭐ u headeru |
| Ekonomija | Odvojeni **novčanik** (`wallet`); najbolji rezultat po igri ostaje zasebno |

## Podaci (`localStorage`, ključ `ljeto1_progress`)

Proširiti postojeći objekt:

```json
{
  "games": { "...": { "stars": 0, "bestCorrect": 0, "played": 0 } },
  "totalStars": 0,
  "wallet": 0,
  "spent": [
    { "id": "sladoled", "title": "Sladoled", "cost": 10, "at": "2026-07-21T08:00:00.000Z" }
  ]
}
```

### Pravila

- **`wallet`**: potrošive zvjezdice; header pokazuje samo ovo.
- **Nakon runde**: `Engine.starsFromScore` → i dalje `Progress.setStars` (najbolji 0–3 po igri) **i** `Progress.addToWallet(stars)` (dodaj 0–3 u novčanik).
- **`totalStars`**: i dalje zbroj najboljih po igrama (za subject kartice / eventualnu statistiku); **ne** prikazivati u headeru kao potrošivo.
- **Migracija**: ako `wallet` nije broj, postavi `wallet = totalStars` (postojeći napredak ne nestane). Ako `spent` nije niz, `spent = []`.
- **`spend(reward)`**: ako `wallet < cost` → neuspjeh; inače `wallet -= cost`, push u `spent`, spremi. Bez PIN-a / roditeljske potvrde.

### API (`progress.js`)

- `wallet()` / `addToWallet(n)` / `spend(reward)` → `{ ok, wallet }`  
- `getSpent()` → niz (novije prvo ili najnovije na vrhu u UI)  
- Postojeći `getStars` / `setStars` / `subjectStars` / `totalStars` ostaju.

## Katalog nagrada

Fiksno u kodu (`rewards.js` ili konstanta u `app.js`):

| id | Emoji | Naslov | Cijena |
|----|-------|--------|--------|
| `sladoled` | 🍦 | Sladoled | 10 |
| `park` | 🏞️ | Park / igralište | 15 |
| `film` | 🍿 | Film / crtani | 20 |
| `obrok` | 🍕 | Omiljeni obrok | 25 |
| `bicikl-role` | 🚲 | Bicikl / role | 18 |
| `igracka` | 🧸 | Mala igračka | 30 |

Nema igrica; “role” umjesto “rolalice”.

## UI

### Header

- `#starsTotal` prikazuje `⭐ {wallet}`.
- Klik otvara view `shop` (osim ako je već u shopu — tada ništa ili refresh).
- `title` / aria: npr. “Zvjezdice — otvori dućan”.

### View Dućan (`#view-shop`)

- Naslov tipa “Dućan nagrada”, kratki podnaslov da su nagrade stvarne (roditelj ih obavi).
- Lista kartica: emoji, naziv, cijena, gumb **Iskoristi**.
  - Dovoljno zvjezdica: gumb aktivan → `confirm("Stvarno potrošiti N⭐ za …?")` → `spend` → refresh.
  - Premalo: gumb disabled + “Trebaš još X ⭐”.
- Povijest: zadnjih ~10 stavki iz `spent` (naslov, cijena, datum na čitljiv način).
- Natrag: postojeći `#btnBack` (shop → hub, ili prethodni view ako se otvori iz drugog ekrana — jednostavno: shop → hub).

### Ekran rezultata

- Uz postojeći tekst, prikazati zaradu u novčanik, npr. “+2 ⭐ u novčanik” (0 ako 0 zvjezdica).

## Datoteke

| Datoteka | Promjena |
|----------|----------|
| `js/progress.js` | wallet, spend, migracija, API |
| `js/app.js` | shop view, header klik, addToWallet na finish, refresh |
| `index.html` | `#view-shop` markup |
| `css/styles.css` | stilovi dućana (usklađeno s postojećim karticama) |
| opcionalno `js/rewards.js` | katalog |

## Izvan opsega

- Uređivanje kataloga u UI-u
- Roditeljski PIN / potvrda
- Sinkronizacija među uređajima
- In-app kozmetika

## Uspjeh

1. Igra → wallet raste; kartice i dalje pokazuju najbolje ⭐⭐⭐.  
2. Header ⭐ → dućan; kupnja smanjuje wallet i upisuje povijest.  
3. Premalo zvjezdica → nema potrošnje.  
4. Stari localStorage dobije wallet bez gubitka salda.
