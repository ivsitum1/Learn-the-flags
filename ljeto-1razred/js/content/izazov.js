(function (global) {
  "use strict";

  // Zasebni "izazov" — teži zadaci koji pažljivo zagrebu u gradivo 2. razreda.
  // Sve je osmišljeno tako da bistro dijete iz 1. razreda može DOĆI DO ODGOVORA
  // logikom (npr. množenje = ponovljeno zbrajanje), a objašnjenja uče ispravan
  // način razmišljanja — ne rutine koje se tek uče u 2. razredu.

  function mcq(prompt, answer, choices, explain) {
    return { type: "mcq", prompt: prompt, answer: answer, choices: choices, explain: explain };
  }
  function tf(prompt, answer, explain) {
    return {
      type: "truefalse", prompt: prompt,
      answer: answer ? "Točno" : "Netočno",
      choices: ["Točno", "Netočno"], explain: explain
    };
  }
  function order(prompt, answer, explain) {
    return { type: "order", prompt: prompt, answer: answer, items: answer.slice(), explain: explain };
  }

  var bank = [];

  // --- Brojevi do 100: mjesna vrijednost i desetice ---
  bank.push(mcq("Koliko je 2 desetice i 3 jedinice?", 23, [13, 20, 23, 32],
    "2 desetice = 20, pa još 3 jedinice: 20 + 3 = 23."));
  bank.push(mcq("Koji je broj: 4 desetice?", 40, [4, 14, 40, 44],
    "Jedna desetica je 10, pa su 4 desetice 40."));
  bank.push(mcq("Koliko desetica ima broj 60?", 6, [6, 16, 60, 0],
    "60 = 6 desetica (10 + 10 + 10 + 10 + 10 + 10)."));
  bank.push(mcq("Koji je broj za 1 veći od 49?", 50, [40, 48, 50, 60],
    "Nakon 49 dolazi 50."));
  bank.push(mcq("Koji broj dolazi odmah poslije 99?", 100, [98, 100, 101, 90],
    "Poslije 99 dolazi 100."));
  bank.push(mcq("Koliko je 30 + 5?", 35, [8, 35, 53, 80],
    "3 desetice i 5 jedinica: 30 + 5 = 35."));

  // --- Zbrajanje i oduzimanje desetica do 100 (logika iz mjesne vrijednosti) ---
  bank.push(mcq("Koliko je 20 + 30?", 50, [23, 40, 50, 60],
    "2 desetice + 3 desetice = 5 desetica = 50."));
  bank.push(mcq("Koliko je 70 − 40?", 30, [30, 34, 40, 110],
    "7 desetica − 4 desetice = 3 desetice = 30."));
  bank.push(mcq("Koliko je 40 + 40?", 80, [16, 44, 80, 88],
    "4 desetice + 4 desetice = 8 desetica = 80."));
  bank.push(mcq("Koliko je 100 − 20?", 80, [20, 80, 98, 120],
    "100 je 10 desetica; makni 2 desetice i ostaje 8 desetica = 80."));
  bank.push(mcq("Koliko je 34 + 10?", 44, [35, 44, 43, 54],
    "Dodaš jednu deseticu: desetica bude 4, a jedinice ostaju: 44."));
  bank.push(mcq("Koliko je 58 − 10?", 48, [48, 57, 47, 68],
    "Makneš jednu deseticu: 58 − 10 = 48."));

  // --- Množenje kao ponovljeno zbrajanje (ispravan uvod) ---
  bank.push(mcq("Koliko je 3 + 3 + 3? (to je 3 puta po 3)", 9, [6, 9, 12, 33],
    "Tri skupine po 3: to je 3 · 3 = 9."));
  bank.push(mcq("2 mačke imaju po 4 noge. Koliko je nogu ukupno?", 8, [6, 8, 24, 42],
    "4 + 4 = 2 · 4 = 8 nogu."));
  bank.push(mcq("4 vrećice, u svakoj 2 bombona. Koliko je bombona?", 8, [6, 8, 10, 42],
    "2 + 2 + 2 + 2 = 4 · 2 = 8 bombona."));
  bank.push(mcq("3 auta imaju po 4 kotača. Koliko je kotača ukupno?", 12, [7, 12, 16, 34],
    "4 + 4 + 4 = 3 · 4 = 12 kotača."));
  bank.push(mcq("Koliko je 2 · 5? (dva puta po pet)", 10, [7, 10, 12, 25],
    "5 + 5 = 2 · 5 = 10."));
  bank.push(mcq("5 prstiju na jednoj ruci. Koliko je prstiju na 2 ruke?", 10, [5, 10, 15, 20],
    "5 + 5 = 2 · 5 = 10 prstiju."));
  bank.push(mcq("Koliko je 5 · 2? (pet puta po dva)", 10, [7, 10, 12, 52],
    "2 + 2 + 2 + 2 + 2 = 5 · 2 = 10. Isto kao 2 · 5!"));

  // --- Parni i neparni brojevi ---
  bank.push(tf("Broj 8 je paran.", true,
    "8 se može podijeliti na dvije jednake skupine (4 i 4), pa je paran."));
  bank.push(tf("Broj 7 je paran.", false,
    "7 se ne može podijeliti na dvije jednake skupine, pa je neparan."));
  bank.push(mcq("Koji je od ovih brojeva paran: 5, 9, 12, 15?", 12, [5, 9, 12, 15],
    "12 se dijeli na 6 i 6, pa je paran; ostali su neparni."));

  // --- Dvostruko i polovina ---
  bank.push(mcq("Koliko je dvostruko od 6?", 12, [3, 8, 12, 16],
    "Dvostruko znači dva puta: 6 + 6 = 12."));
  bank.push(mcq("Koliko je dvostruko od 9?", 18, [11, 18, 19, 90],
    "9 + 9 = 18."));
  bank.push(mcq("Koliko je polovina od 10?", 5, [2, 5, 10, 20],
    "Polovina znači podijeliti na dva jednaka dijela: 5 i 5."));
  bank.push(mcq("Koliko je polovina od 20?", 10, [5, 10, 15, 40],
    "20 podijelimo na dva jednaka dijela: 10 i 10."));

  // --- Vrijeme i mjere (opće znanje 2. razreda) ---
  bank.push(mcq("Koliko je sati kad je velika kazaljka na 12, a mala na 3?", "3 sata",
    ["3 sata", "12 sati", "15 sati", "pola 3"],
    "Kad je velika kazaljka na 12, sat pokazuje puni sat — ovdje 3 sata."));
  bank.push(mcq("Koliko minuta ima jedan sat?", 60, [10, 30, 60, 100],
    "Jedan sat ima 60 minuta."));
  bank.push(mcq("Koliko dana ima jedan tjedan?", 7, [5, 7, 12, 30],
    "Tjedan ima 7 dana."));

  // --- Logika i nizovi (bistrina) ---
  bank.push(mcq("Nastavi niz: 10, 20, 30, ☐", 40, [31, 35, 40, 50],
    "Niz raste za 10: poslije 30 dolazi 40."));
  bank.push(mcq("Nastavi niz udvostručavanja: 2, 4, 8, ☐", 16, [10, 12, 16, 24],
    "Svaki broj je dvostruk od prethodnog: 8 + 8 = 16."));
  bank.push(mcq("Ako je danas srijeda, koji je dan prekosutra?", "petak",
    ["četvrtak", "petak", "subota", "utorak"],
    "Sutra je četvrtak, a prekosutra petak."));
  bank.push(mcq("3 novčića od 10 eura. Koliko je to eura?", 30, [13, 23, 30, 40],
    "10 + 10 + 10 = 3 · 10 = 30 eura."));
  bank.push(mcq("Imaš 50 eura i potrošiš 20. Koliko ti ostaje?", 30, [20, 30, 40, 70],
    "5 desetica − 2 desetice = 3 desetice = 30 eura."));

  global.CONTENT_IZAZOV = {
    id: "izazov",
    title: "Potraga za blagom",
    icon: "🗺️",
    blurb: "Za prave istraživače — teži izazovi i mali korak u 2. razred.",
    story: "Riješi zagonetke na svakoj postaji, skupljaj drago kamenje i otključaj škrinju s blagom! 💎",
    stations: ["Plaža", "Palmin gaj", "Tajna špilja", "Brzi potok", "Stari most", "Šuma šapata", "Vrh brda", "Škrinja"],
    roundSize: 8,
    bank: bank
  };
})(window);
