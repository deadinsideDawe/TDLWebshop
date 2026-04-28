# C4 Context és Container nézet

## Context nézet

A TDL Webshop rendszer fő szereplői:

- Vásárló: termékeket böngész, rendelést ad le, kívánságlistát kezel, saját profilját használja.
- Dolgozó: belső felhasználóként helyszíni vásárlást rögzíthet, készletet láthat, terméket kezelhet, ügyfelet kezelhet a kiosztott jogok alapján.
- Adminisztrátor: teljes hozzáféréssel rendelkezik a belső funkciókhoz, jóváhagyhat, dolgozói jogokat adhat, felhasználókat kezelhet.

A rendszer külső szolgáltatói:

- Firebase Authentication: bejelentkezés és azonosítás.
- Cloud Firestore: termékek, rendelések, felhasználói profilok, vásárlói profilok, jóváhagyások és egyéb üzleti adatok tárolása.
- Firebase Hosting: a frontend alkalmazás publikálása.

## Container nézet

### 1. Angular frontend

Ez a projekt elsődleges alkalmazásrétege. Feladata:

- vásárlói és admin oldalak megjelenítése,
- kliensoldali űrlapkezelés és validáció,
- Firestore adatok lekérdezése és mentése,
- szerepkörök szerinti UI-szűrés,
- PDF számla/bizonylat generálás indítása.

### 2. Firebase Authentication

Feladata:

- felhasználók hitelesítése,
- bejelentkezési állapot biztosítása,
- azonosító és e-mail alapú profilösszerendelés.

### 3. Cloud Firestore

Feladata:

- termékek és kategóriák tárolása,
- rendelési és készletadatok kezelése,
- user profilok és dolgozói jogosultságok tárolása,
- mentett vásárlók és jóváhagyandó kérelmek tárolása.

### 4. Firebase Hosting

Feladata:

- a buildelt Angular alkalmazás publikálása demó/éles URL-en.

## Fő adatáramlások

1. A vásárló böngészi a termékeket, a frontend a Firestore-ból olvassa a terméklistát.
2. Regisztráció vagy belépés után a frontend az Auth állapot alapján lekéri a felhasználói profilt.
3. Rendelés leadásakor a frontend a rendelési adatokat Firestore-ba menti.
4. Helyszíni vásárláskor a belső felhasználó a frontendből rendelést rögzít, készletet csökkent és PDF-et generál.
5. Az admin a Firestore-ban tárolt jogosultsági és státuszadatok alapján menedzseli a dolgozókat és vásárlókat.

## Modulhatárok

- `src/pages/*`: oldalszintű UI és felhasználói folyamatok
- `src/app/services/*`: üzleti logika, adatkezelés, auth, invoice, product, order, cart
- `firestore.rules`: szerveroldali hozzáférési korlátok
- `public/*`: statikus képek és assetek

## Miért ez a felépítés

Az architektúra célja az volt, hogy kis infrastruktúra-igénnyel is működőképes maradjon, ugyanakkor a szakdolgozat szempontjából is legyen benne több különálló mérnöki döntési pont: autentikáció, szerepkörkezelés, adatszabályozás, termékkezelés és belső admin folyamatok.
