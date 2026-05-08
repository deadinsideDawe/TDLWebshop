# Tesztelés és validáció összefoglaló

Ez a dokumentum a konzulensi mintacsomag `10_teszteles_validacio_sablon.md` tartalmához igazodik. A cél az, hogy a kritikus webshop- és adminfolyamatok működése bizonyítható legyen automatikus és manuális ellenőrzésekkel.

## 1. Automatikus ellenőrzések

| Ellenőrzés | Parancs | Mit bizonyít? | Aktuális elvárt eredmény |
|---|---|---|---|
| Angular build | `npm run build` | A projekt lefordul production buildre. | Sikeres build |
| Unit/komponens tesztek | `npm test -- --watch=false` | Kritikus service és komponens logika. | Sikeres tesztfutás |
| GitHub CI | GitHub Actions / CI workflow | Tiszta környezetben is ellenőrizhető a projekt. | Zöld CI run |

Legutóbbi ellenőrzési cél: a build és a tesztek hibamentesen fussanak, az AI asszisztenshez kapcsolódó új tesztek pedig ellenőrizzék, hogy az asszisztens nem ajánl random terméket irreleváns vagy nem talált kérdésre.

Legutóbbi lokális futtatás eredménye:

| Dátum | Parancs | Eredmény | Megjegyzés |
|---|---|---|---|
| 2026-05-08 | `npm run build` | Sikeres | Angular build készült a `dist/webshop` mappába. |
| 2026-05-08 | `npm test -- --watch=false` | 14 tesztfájl / 41 sikeres teszt / 0 hiba | Lokálisan Node `v25.8.0` LTS figyelmeztetés megjelent, ezért leadáshoz és CI-hez Node 22 javasolt. |

## 2. Kiemelt tesztterületek

| ID | Terület | Ellenőrzés | Típus | Kapcsolódó követelmény |
|---|---|---|---|---|
| TC-01 | Terméklista | Kategória, keresés, akciós termék megjelenés. | Manuális | FK-01 |
| TC-02 | Kosár | Termék hozzáadása, mennyiség módosítás, törlés. | Manuális + unit | FK-02 |
| TC-03 | Checkout | Rendelés leadása valid adatokkal. | Manuális | FK-03 |
| TC-04 | Checkout validáció | Hibás email/telefon és hiányzó mezők kezelése. | Manuális | NFK-03 |
| TC-05 | Profil | Korábbi rendelések és státuszok megjelenése. | Manuális | FK-04 |
| TC-06 | Admin termékkezelés | Termék létrehozás, módosítás, CSV import. | Manuális | FK-05 |
| TC-07 | Helyszíni vásárlás | Mentett vásárló, termékkereső, PDF/számla. | Manuális | FK-06 |
| TC-08 | Jogosultság | Admin, dolgozó, vásárló eltérő jogok. | Manuális | FK-07 |
| TC-09 | Készlet | Rendelés után készletváltozás, alacsony készlet. | Manuális | FK-08 |
| TC-10 | Kupon | Érvényes/érvénytelen kupon és kedvezmény. | Manuális | FK-09 |
| TC-11 | AI asszisztens | Domain kérdés, termékajánlás, irreleváns kérdés. | Automata + manuális | FK-10 |

## 3. Vásárlói folyamat manuális tesztje

1. Kezdőlap betöltése dark és light módban.
2. Terméklista megnyitása.
3. Kategória és keresés használata.
4. Termékadatlap megnyitása.
5. Termék kosárba helyezése.
6. Kosárban mennyiség módosítás.
7. Checkout űrlap kitöltése.
8. Hibás email és telefonszám kipróbálása.
9. Érvényes kupon kipróbálása.
10. Rendelés leadása.
11. Sikeres rendelés oldal ellenőrzése.
12. Profil oldalon a rendelés megjelenésének ellenőrzése.

## 4. Admin/dolgozói folyamat manuális tesztje

1. Admin belépés.
2. Termék létrehozása vagy módosítása.
3. CSV import előnézet és mentés.
4. Készletlista kategóriára szűrése.
5. Rendelés státuszának módosítása.
6. PDF/számla letöltése.
7. Mentett vásárló létrehozása, szerkesztése, tiltása.
8. Helyszíni vásárlás rögzítése mentett vásárlóval.
9. Dolgozói belépéssel ellenőrzés: csak engedélyezett funkciók látszanak.
10. Vásárlói belépéssel ellenőrzés: admin felület nem érhető el.

## 5. AI asszisztens validáció

Az AI asszisztensnél külön fontos, hogy ne keltsen hamis termékajánlási biztonságot.

Ellenőrizendő esetek:

- "Milyen klímát ajánlasz egy 25 m2-es szobába?" - domain kérdés, adhat szakmai irányt és releváns katalógus-találatot.
- "Milyen bojler kell egy 6 fős családnak?" - szakmai irányt adhat, de csak akkor ajánl katalógus terméket, ha van releváns bojler a katalógusrészletben.
- "Hány évig élnek a teknősök?" - nem domain kérdés, udvariasan elutasítja.
- "Milyen szigetelést ajánlasz?" - ha nincs szigetelés termék a katalógusban, nem ajánl random terméket, hanem egyeztetést javasol.

## 6. Beadás előtti bizonyíték

A szakdolgozatba vagy mellékletbe érdemes betenni:

- GitHub Actions zöld CI képernyőkép.
- `npm run build` sikeres futás képernyőkép vagy szöveges eredmény.
- `npm test -- --watch=false` sikeres futás képernyőkép vagy szöveges eredmény.
- Checkout sikeres rendelés képernyőkép.
- Admin rendeléskezelés és PDF/számla képernyőkép.
- AI asszisztens domain és nem-domain kérdésre adott válasz képernyőkép.
