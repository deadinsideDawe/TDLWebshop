# Use case specifikacio - TDL Webshop

## Use case lista

| ID | Nev | Aktor | Cel | Prioritas | Kovetelmenyek |
|---|---|---|---|---|---|
| UC-01 | Termek bongeszese | Vendeg / vasarlo | termek megtalalasa kategoriabol vagy keresessel | Must | FK-01 |
| UC-02 | Kosar osszeallitasa | Vendeg / vasarlo | rendelendo termekek osszegyujtese | Must | FK-02 |
| UC-03 | Rendelés leadása | Vendeg / vasarlo | rendelés rogzitese valid adatokkal | Must | FK-03 |
| UC-04 | Profil es rendeleskovetes | Regisztralt vasarlo | sajat adatok es rendelesek kovetese | Should | FK-04 |
| UC-05 | Termek adminisztralasa | Admin / dolgozo | katalogus es keszlet frissitese | Must | FK-05, FK-08 |
| UC-06 | Helyszini vasarlas rogzitese | Admin / dolgozo | gyors bolti rendelés es PDF bizonylat | Must | FK-06 |
| UC-07 | Jogosultsagkezeles | Admin | profilok, szerepkorok es tiltott allapot kezelese | Must | FK-07 |
| UC-08 | Kupon es akcio kezelese | Admin | promociok beallitasa | Should | FK-09 |
| UC-09 | AI asszisztens hasznalata | Vasarlo | termekvalasztasi segitseg | Could | FK-10 |

## UC-03 - Rendelés leadása

| Mezo | Tartalom |
|---|---|
| Elsodleges aktor | Vendeg vagy regisztralt vasarlo |
| Elofeltetel | A kosar nem ures |
| Trigger | A felhasznalo a checkout oldalon elkuldi a rendelest |
| Fo sikeres lefutas | 1. kosar ellenorzese; 2. szallitasi/szamlazasi adatok megadasa; 3. email es telefonszam validalasa; 4. kupon ellenorzese, ha van; 5. osszegzes megjelenitese; 6. rendelés mentese Firestore-ba; 7. sikeroldal megjelenitese |
| Alternativ lefutas | hianyos adat, hibas email, ervenytelen kupon, keszlethiany, jogosultsagi hiba |
| Utofeltetel | rendelés letrejott, kosar urul vagy a felhasznalo hibauzenetet kap |
| Tesztek | TC-03, TC-09, TC-UX-01 |

## UC-06 - Helyszini vasarlas rogzitese

| Mezo | Tartalom |
|---|---|
| Elsodleges aktor | Admin vagy dolgozo |
| Elofeltetel | Admin/dolgozo be van jelentkezve, van termek a keszleten |
| Trigger | Admin a helyszini vasarlas mentese gombra kattint |
| Fo sikeres lefutas | 1. mentett vasarlo kivalasztasa vagy kezi adatok; 2. termek keresese; 3. mennyiseg rogzitese; 4. fizetesi mod valasztasa; 5. rendelés mentese; 6. PDF bizonylat letoltese |
| Alternativ lefutas | tiltott vasarlo, hibas telefonszam/email, nincs eleg keszlet, tul hosszu fizetesi hatarido jovahagyas nelkul |
| Utofeltetel | helyszini rendelés es bizonylat letrejon, keszlet frissul |
| Tesztek | TC-06, TC-SEC-ROLE |

## UC-07 - Jogosultsagkezeles

| Mezo | Tartalom |
|---|---|
| Elsodleges aktor | Admin |
| Elofeltetel | Admin be van jelentkezve |
| Trigger | Admin felhasznalot hoz letre vagy modosit |
| Fo sikeres lefutas | 1. profiladatok megadasa; 2. szerepkor beallitasa; 3. dolgozoi engedelyek valasztasa; 4. mentés; 5. Firestore szabalyok es UI guardok szerint mukodik |
| Alternativ lefutas | hianyos adat, nem megfelelo role, dolgozo jovahagyasi jog nelkul probal engedelyezni |
| Utofeltetel | szerepkor es jogosultsag frissul |
| Tesztek | TC-SEC-ROLE, TC-SEC-FORBIDDEN |

