# Threat model

Az alábbi táblázat a projekt szempontjából legfontosabb biztonsági kockázatokat és a hozzájuk rendelt mitigációkat foglalja össze.

| Fenyegetés | Leírás | Hatás | Valószínűség | Mitigáció | Verification |
|---|---|---|---|---|---|
| Jogosulatlan admin hozzáférés | Egy sima vásárló megpróbál admin felületet elérni. | Magas | Közepes | Route guard + szerepkör ellenőrzés + Firestore szabályok | belépési és jogosultsági ellenőrzés |
| Túl széles dolgozói hozzáférés | A dolgozó több funkciót ér el, mint amit kellene. | Magas | Közepes | Finomhangolt employee permission mezők | dolgozói tesztfiókokkal végzett ellenőrzés |
| Tiltott vásárló újra vásárol | Nem fizető vagy tiltott profil új rendelést kezdeményez. | Közepes | Közepes | Tiltási állapot tárolása és ellenőrzése belépésnél/belső értékesítésnél | manuális teszt és üzleti logika |
| Hibás vagy rosszindulatú input | Hibás e-mail, telefonszám vagy hiányos adat kerül mentésre. | Közepes | Magas | Frontend validáció + űrlapellenőrzések | form validator tesztek és kézi ellenőrzés |
| Kliensoldali adatmanipuláció | Felhasználó közvetlenül próbál Firestore írást végezni. | Magas | Közepes | Firestore rules szerepkör és mezőalapú korlátozással | rules review és működési teszt |
| Repo-ba kerülő titok | Véletlenül érzékeny kulcs vagy jelszó commitolása. | Magas | Alacsony | `.gitignore`, `.env.example`, környezeti változók elkülönítése | kézi ellenőrzés és repo áttekintés |
| Számla/bizonylat hibás adatból készül | A generált PDF félrevezető vagy hiányos adatot tartalmaz. | Közepes | Közepes | Mentés előtti validáció és vizuális ellenőrzés | számla preview és manuális teszt |

## Megjegyzés

Mivel a projekt elsősorban Firebase-alapú és kliensfókuszú, a legfontosabb védelmi vonalat a jogosultságkezelés, a Firestore szabályok, a validáció és a tudatos dokumentálás jelenti.
