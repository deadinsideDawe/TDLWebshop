# Jogosultsági rendszer táblázatos összefoglalása

Az alábbi táblázat közvetlenül beilleszthető a szakdolgozatba, vagy kisebb formázással Word táblázatként is felhasználható.

| Funkció / művelet | Vásárló | Dolgozó | Admin |
|---|---|---|---|
| Regisztráció és bejelentkezés | Igen | Igen | Igen |
| Termékek böngészése | Igen | Igen | Igen |
| Kosár használata | Igen | Igen | Igen |
| Rendelés leadása | Igen | Nem elsődleges feladat | Nem elsődleges feladat |
| Profiladatok megtekintése | Igen | Igen | Igen |
| Saját adatok módosítása | Igen | Igen | Igen |
| Korábbi rendelések megtekintése | Igen | Saját belső nézet szerint | Saját belső nézet szerint |
| Kívánságlista használata | Igen | Igen | Igen |
| Admin felület elérése | Nem | Jogosultságtól függően | Igen |
| Helyszíni vásárlás rögzítése | Nem | Jogosultságtól függően | Igen |
| Készlet megtekintése | Nem | Jogosultságtól függően | Igen |
| Termékek létrehozása és szerkesztése | Nem | Jogosultságtól függően | Igen |
| Mentett vásárlók felvétele | Nem | Jogosultságtól függően | Igen |
| Mentett vásárlók szerkesztése | Nem | Jogosultságtól függően | Igen |
| Mentett vásárlók tiltása vagy visszaállítása | Nem | Jogosultságtól függően | Igen |
| Dolgozói profil létrehozása | Nem | Nem | Igen |
| Szerepkörök beállítása | Nem | Nem | Igen |
| Fizetési határidő jóváhagyása | Nem | Nem | Igen |
| Értesítések kezelése | Nem | Korlátozott vagy nincs | Igen |
| Firestore szabályok teljes körű kezelése | Nem | Nem | Igen |

## Dolgozói jogosultságok részletezése

A dolgozó szerepkörön belül a rendszer nem egységes, hanem finomhangolt jogosultságkezelést alkalmaz. Ez azt jelenti, hogy két dolgozó nem feltétlenül látja ugyanazokat a menüpontokat és nem feltétlenül hajthatja végre ugyanazokat a műveleteket. Az admin a dolgozói profil létrehozásakor vagy szerkesztésekor külön-külön adhatja meg az alábbi jogosultságokat:

| Dolgozói jogosultság | Jelentés |
|---|---|
| `canRecordSales` | Helyszíni vásárlás rögzítése és kapcsolódó rendelési műveletek végrehajtása |
| `canViewInventory` | Készletinformációk és készletösszesítések megtekintése |
| `canManageProducts` | Termékek létrehozása, szerkesztése és adatainak karbantartása |
| `canManageCustomers` | Mentett vásárlók és ügyfélprofilok létrehozása, szerkesztése |
| `canDisableCustomers` | Vásárlók tiltása vagy tiltás feloldása |

## Értelmezés

A szerepköralapú modell előnye, hogy a rendszer egyszerre marad biztonságos és rugalmas. A vásárló kizárólag a számára szükséges felületeket éri el, a dolgozó csak a munkájához kapcsolódó funkciókat kapja meg, az adminisztrátor pedig teljes körű felügyeleti jogokkal rendelkezik. Ez a megoldás különösen előnyös olyan webshop esetén, ahol nemcsak online vásárlás történik, hanem belső készletkezelés és helyszíni értékesítés is kapcsolódik a rendszerhez.
