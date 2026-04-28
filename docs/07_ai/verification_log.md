# Verification log

Ez a lista olyan konkrét eseteket mutat, ahol az AI-javaslatokat külön ellenőriztem, és nem automatikusan vettem át.

| # | AI javaslat / állítás | Kockázat | Ellenőrzés módja | Eredmény | Következtetés |
|---|---|---|---|---|---|
| 1 | Admin szerepkör logika működőképes | Jogosulatlan hozzáférés | manuális belépési teszt + auth logika ellenőrzés | Pass | további employee ág kellett |
| 2 | Firestore rules elegendők | Tiltott user vagy jogosulatlan írás | rules átnézés és funkcionális ellenőrzés | Partial | rules szigorítás szükséges volt |
| 3 | Számla layout megfelelő | Vizualis elcsúszás | generált PDF kézi ellenőrzése | Fail majd Pass | layout többször finomítva |
| 4 | Helyszíni vásárlás mentése stabil | Adatvesztés vagy hibás mentés | admin oldali valós teszt | Partial | hibakeresés és javítás kellett |
| 5 | Dolgozó jogosultságok jól szűrnek | Túl széles hozzáférés | külön tesztfiókokkal ellenőrzés | Pass | jogosultsági modell maradhat |
| 6 | UI módosítás light módban jól olvasható | Gyenge kontraszt | kézi vizuális ellenőrzés | Fail majd Pass | fejléc színezése javítva |
| 7 | Checkout és profil validáció megfelelő | Rossz adatok mentése | mezőteszt és validator ellenőrzés | Pass | validáció megfelelő alap |
| 8 | Build stabil marad a módosítások után | Regresszió | `npm run build` | Pass | release-közeli állapot |
| 9 | Spec fájlok lefedik a fő részeket | Rejtett regresszió | `npm test -- --watch=false` | Pass | 37 zöld teszt |
| 10 | Dokumentáció megfelel a PDF-ek szellemének | Formális hiányosság | követelmény-PDF és repo összevetése | Partial | több hiányzó artefaktum pótlása történt |

## Összegzés

A verifikációs napló jól mutatja, hogy az AI-javaslatok nem végleges igazságként kerültek kezelésre. Több esetben csak részben voltak megfelelőek, és kifejezetten kézi validáció, újratervezés vagy további javítás után maradtak bent a projektben.
