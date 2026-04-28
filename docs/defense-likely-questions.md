# Várható védési kérdések

Az alábbi kérdések azok, amelyeket a jelenlegi projektállapot alapján a legvalószínűbbnek tartok.

## 1. Miért pont Firebase-et választottál?

Mit érdemes mondani:
- gyors fejlesztés,
- kész auth és hosting,
- szakdolgozati időkerethez jól illeszkedett,
- a Spark csomag korlátai miatt tudatos kompromisszumokat kellett kötni.

## 2. Miért Angular lett a frontend?

Mit érdemes mondani:
- jól szervezhető nagyobb kliensalkalmazásként,
- standalone komponensek,
- TypeScript alapú fejlesztés,
- admin és vásárlói oldalak jól szétválaszthatók.

## 3. Miben több ez a projekt egy sima webshopnál?

Mit érdemes mondani:
- helyszíni vásárlás rögzítése,
- dolgozói jogosultsági modell,
- mentett vásárlók kezelése,
- belső admin folyamatok,
- PDF számla/bizonylat.

## 4. Hogyan oldottad meg a jogosultságkezelést?

Mit érdemes mondani:
- három fő szerepkör,
- dolgozóknál finomhangolt jogok,
- UI guard + Firestore rules együtt,
- tiltott felhasználók kezelése.

## 5. Milyen biztonsági problémákat kezeltél?

Mit érdemes mondani:
- jogosulatlan admin hozzáférés,
- disabled user kezelés,
- kliensoldali validáció,
- Firestore szabályok,
- érzékeny adatok és AI használat elkülönítése.

## 6. Milyen tesztelést végeztél?

Mit érdemes mondani:
- automata spec tesztek,
- build ellenőrzés,
- manuális végigtesztelés,
- szerepkörös tesztfiókokkal ellenőrzés,
- hibás inputok és edge case-ek kipróbálása.

## 7. Mit csinált pontosan az AI a projektben?

Mit érdemes mondani:
- ötletadás,
- dokumentációs vázlatok,
- néhány részmegoldás gyorsítása,
- hibakeresési szempontok,
- de a döntések, integráció és ellenőrzés nálad maradtak.

## 8. Milyen nehézségek voltak a fejlesztés során?

Mit érdemes mondani:
- Firestore jogosultságok,
- helyszíni vásárlás mentése,
- számla layout,
- role logika összehangolása,
- Spark csomag korlátai.

## 9. Ha lenne még időd, mit fejlesztenél tovább?

Mit érdemes mondani:
- teljes online fizetési integráció,
- jobb analitika és monitoring,
- további automatizált tesztek,
- fejlettebb kedvezménykezelés,
- többképes termékimport teljes beépítése.

## 10. Melyik részre vagy a legbüszkébb?

Mit érdemes mondani:
- hogy a rendszer nem csak látványos, hanem üzletileg is használhatóbb lett,
- különösen az admin/dolgozó/vásárló szerepkörök,
- a helyszíni értékesítés,
- és az, hogy a projektet dokumentációval és tesztekkel is megtámasztottad.
