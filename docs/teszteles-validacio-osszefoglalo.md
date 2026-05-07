# Teszteles es validacio osszefoglalo

Ez a dokumentum a konzulensi mintacsomag `10_teszteles_validacio_sablon.md` tartalmahoz igazodik. A cel az, hogy a kritikus webshop- es adminfolyamatok mukodese bizonyithato legyen automatikus es manualis ellenorzesekkel.

## 1. Automatikus ellenorzesek

| Ellenorzes | Parancs | Mit bizonyit? | Aktualis elvart eredmeny |
|---|---|---|---|
| Angular build | `npm run build` | a projekt lefordul production buildre | sikeres build |
| Unit/komponens tesztek | `npm test -- --watch=false` | kritikus service es komponens logika | sikeres tesztfutas |
| GitHub CI | GitHub Actions / CI workflow | tiszta kornyezetben is ellenorizheto a projekt | zold CI run |

Legutobbi ellenorzesi cel: a build es a tesztek hibamentesen fussanak, az AI asszisztenshez kapcsolodo uj tesztek pedig ellenorizzek, hogy az asszisztens nem ajanl random termeket irrelevans vagy nem talalt kerdesre.

Legutobbi lokalis futtatas eredmenye:

| Datum | Parancs | Eredmeny | Megjegyzes |
|---|---|---|---|
| 2026-05-05 | `npm run build` | sikeres | Angular build keszult a `dist/webshop` mappaba |
| 2026-05-05 | `npm test -- --watch=false` | 14 test file / 40 test passed | Node `v25.8.0` LTS figyelmeztetes megjelent, ezert leadashoz `20.x` vagy `22.x` javasolt |

## 2. Kiemelt tesztteruletek

| ID | Terulet | Ellenorzes | Tipus | Kapcsolodo kovetelmeny |
|---|---|---|---|---|
| TC-01 | Termeklista | kategoria, kereses, akcios termek megjelenes | manualis | FK-01 |
| TC-02 | Kosar | termek hozzaadasa, mennyiseg modositas, torles | manualis + unit | FK-02 |
| TC-03 | Checkout | rendelés leadása valid adatokkal | manualis | FK-03 |
| TC-04 | Checkout validacio | hibas email/telefon es hianyzo mezok kezelese | manualis | NFK-03 |
| TC-05 | Profil | korabbi rendelesek es statuszok megjelenese | manualis | FK-04 |
| TC-06 | Admin termekkezeles | termek letrehozas, modositas, CSV import | manualis | FK-05 |
| TC-07 | Helyszini vasarlas | mentett vasarlo, termekkereso, PDF/szamla | manualis | FK-06 |
| TC-08 | Jogosultsag | admin, dolgozo, vasarlo eltero jogok | manualis | FK-07 |
| TC-09 | Keszlet | rendeles utan keszletvaltozas, alacsony keszlet | manualis | FK-08 |
| TC-10 | Kupon | ervenyes/ervenytelen kupon es kedvezmeny | manualis | FK-09 |
| TC-11 | AI asszisztens | domain kerdes, termekajanlas, irrelevans kerdes | automata + manualis | FK-10 |

## 3. Vasarloi folyamat manualis tesztje

1. Kezdolap betoltese dark es light modban.
2. Termeklista megnyitasa.
3. Kategoria es kereses hasznalata.
4. Termekadatlap megnyitasa.
5. Termek kosarba helyezese.
6. Kosarban mennyiseg modositas.
7. Checkout urlap kitoltese.
8. Hibas email es telefonszam kiprobalasa.
9. Ervenyes kupon kiprobalasa.
10. Rendelés leadasa.
11. Sikeres rendelés oldal ellenorzese.
12. Profil oldalon a rendelés megjelenesenek ellenorzese.

## 4. Admin/dolgozoi folyamat manualis tesztje

1. Admin belepes.
2. Termek letrehozasa vagy modositas.
3. CSV import elonezet es mentes.
4. Keszletlista kategoriara szurese.
5. Rendelés statuszanak modositasa.
6. PDF/szamla letoltese.
7. Mentett vasarlo letrehozasa, szerkesztese, tiltasa.
8. Helyszini vasarlas rogzitese mentett vasarloval.
9. Dolgozoi belepessel ellenorzes: csak engedelyezett funkciok latszanak.
10. Vasarloi belepessel ellenorzes: admin felulet nem erheto el.

## 5. AI asszisztens validacio

Az AI asszisztensnel kulon fontos, hogy ne keltsen hamis termekajanlasi biztonsagot.

Ellenorizendo esetek:

- "Milyen klimat ajanlasz egy 25 m2-es szobaba?" - domain kerdes, adhat szakmai iranyt es relevans katalogus talalatot.
- "Milyen bojler kell egy 6 fos csaladnak?" - szakmai iranyt adhat, de csak akkor ajanl katalogus termeket, ha van relevans bojler a katalogusreszletben.
- "Hany evig elnek a teknosok?" - nem domain kerdes, udvariasan elutasitja.
- "Milyen szigetelest ajanlasz?" - ha nincs szigeteles termek a katalogusban, nem ajanl random termeket, hanem egyeztetest javasol.

## 6. Beadas elotti bizonyitek

A szakdolgozatba vagy mellekletbe erdemes betenni:

- GitHub Actions zold CI kepernyokep.
- `npm run build` sikeres futas kepernyokep vagy szoveges eredmeny.
- `npm test -- --watch=false` sikeres futas kepernyokep vagy szoveges eredmeny.
- Checkout sikeres rendelés kepernyokep.
- Admin rendeleskezeles es PDF/szamla kepernyokep.
- AI asszisztens domain es nem-domain kerdesre adott valasz kepernyokep.
