# Project Plan – TDL Épületgépészeti Webshop

## Egy mondatos értékajánlat
Egy kisebb épületgépészeti vállalkozásokra szabott webshopot készítek, ahol a vásárlók gyorsan találnak és foglalnak termékeket, miközben az admin valós időben kezeli a készletet, rendeléseket, akciókat és helyszíni értékesítést is.

## Képességek

| Képesség | Kategória | Komplexitás | Miért nem triviális? |
|---|---|---|---|
| Bejelentkezés és szerepkör alapú hozzáférés (vásárló/admin) | Productization | M | Route védelem, jogosultság-ellenőrzés, tiltott hozzáférés kezelése, egységes auth állapotkezelés. |
| Rendelés leadása és készlet tranzakciós frissítése | Value | L | Több tétel egyidejű készletcsökkentése, versenyhelyzet kezelése és konzisztens mentés Firestore tranzakcióval. |
| Admin rendeléskezelés státuszváltással és audit naplóval | Productization | M | Státuszátmenetek helyes kezelése, készlet-visszaadás/foglalás szinkronja, állapotváltozás naplózása. |
| Akciós rendszer (százalék, időablak, heti ajánlat/TOP/újdonság címkék) | Value | L | Időzített üzleti szabályok, több nézetben konzisztens ármegjelenítés (eredeti + akciós ár), admin vezérelt kampányok. |
| Helyszíni vásárlás rögzítése adminból + PDF bizonylat | Value | L | Webes és helyszíni folyamat közös készletlogikával, bizonylatgenerálás, vásárlói/céges adatok kezelése. |
| Csoportos termékfeltöltés CSV importtal (validáció + előnézet + SKU upsert) | Value | M | Tömeges adatbeolvasás, soronkénti validáció, hibalistázás, részleges frissítés és új beszúrás ütközéskezeléssel. |
| Realtime admin dashboard és alacsony készlet figyelmeztetés | Productization | M | Több gyűjtemény valós idejű összefésülése, küszöbérték alapú figyelmeztetés, megbízható UI állapotkezelés. |
| Stabil üzemeltetés (Firestore szabályok, indexek, hosting deploy, tesztek) | Productization | M | Biztonsági szabályok, deploy pipeline, hibakezelés és regressziók elleni alap tesztkör egyensúlya. |

## A legnehezebb rész
A legnehezebb rész a készlet konzisztens kezelése, mert egyszerre kell jól működnie webes rendelésnél, admin státuszváltásnál és helyszíni vásárlásnál úgy, hogy ne alakuljon ki negatív készlet vagy téves elérhetőség.

## Tech stack – indoklással

| Réteg | Technológia | Miért ezt és nem mást? |
|---|---|---|
| UI | Angular (standalone komponensek), TypeScript, HTML/CSS | Jól strukturálható, gyorsan bővíthető, típusbiztos frontend; szakdolgozati projekthez jól dokumentálható. |
| Backend / logika | Angular szolgáltatások + Firebase SDK | Külön backend szerver nélkül is erős funkcionalitás, gyors fejlesztés és egyszerű üzemeltetés. |
| Adattárolás | Cloud Firestore | Realtime adatfrissítés, dokumentum-alapú modell, jól skálázható termék/rendelés/felhasználó adatokhoz. |
| Auth | Firebase Authentication | Stabil e-mail/jelszó alapú beléptetés, egyszerű integráció, szerepkörös védelemmel jól kombinálható. |

## Ami kimarad (non-goals)
- Online bankkártyás fizetési gateway (pl. Stripe/Barion) integráció az első verzióban.
- Többnyelvű felület és nemzetközi adózási/szállítási szabályrendszer.

## Ami még nem tiszta
- A végleges, cégesen használható Firestore security policy finomhangolása (minden admin művelet részletes jogosultsági mátrixa).
- A végleges éles bizonylat/számla sablon jogi mezőinek és arculati elemeinek teljes körű lezárása.
