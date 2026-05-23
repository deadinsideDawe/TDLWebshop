# TDL Webshop – regressziós ellenőrzőlista

Ez a lista a szakdolgozati bemutató előtti gyors, kézi ellenőrzéshez készült. A cél az, hogy a fontosabb vásárlói, admin és Spark-kompatibilis folyamatok végig legyenek kattintva.

## 1. Nyitó oldal és navigáció
- [ ] A főoldal betölt, a hero blokk és a kategóriák látszanak.
- [ ] A felső kereső működik.
- [ ] A kategória gombok a megfelelő terméklistára visznek.
- [ ] A light/dark mód váltás működik.
- [ ] Mobil nézetben nincs kilógó vagy egymásra csúszó szöveg.

## 2. Terméklista és termékrészletek
- [ ] A `/products` oldal betölt termékeket.
- [ ] Kategória szűrés legalább két kategóriával működik.
- [ ] Ár és készlet szűrés működik.
- [ ] Termékrészletek oldal megnyílik.
- [ ] Készleten lévő termék kosárba tehető.
- [ ] Nincs készleten terméknél a kosár gomb tiltott.

## 3. Szerelői/profi csomagajánló
- [ ] A szerelői/profi mód megjelenik a terméklistán.
- [ ] Fűtés, víz, szellőzés és hűtés/klíma csomag választható.
- [ ] A csomag tételei termékekhez kapcsolódnak.
- [ ] Hiányzó csomagelem esetén a felület jelzi a hiányt.
- [ ] `Teljes csomag kosárba` gomb a megfelelő mennyiségekkel adja hozzá a tételeket.

## 4. Kosár és checkout
- [ ] Kosárba rakott termék megjelenik a kosár oldalon.
- [ ] Mennyiség módosítás és tétel törlés működik.
- [ ] Checkout oldalon kötelező mezők validációja működik.
- [ ] Irányítószám alapján a város automatikusan kitölthető.
- [ ] Személyes átvétel választható, időpont megadható.
- [ ] Céges/szerelői vásárlás adószámmal menthető.
- [ ] Érvényes és érvénytelen kuponkód kezelése működik.

## 5. Rendelés leadása
- [ ] Rendelés mentődik Firestore `orders` kollekcióba.
- [ ] Sikeres rendelés után a kosár kiürül.
- [ ] Sikeres rendelés oldalon megjelenik az összegzés.
- [ ] Email sablon megnyitható Spark csomagon, Functions nélkül.
- [ ] Bejelentkezett usernél a rendelés a profil oldalon megjelenik.

## 6. Admin hozzáférés
- [ ] Nem admin user nem éri el az admin oldalt.
- [ ] Admin userrel az admin áttekintés betölt.
- [ ] Vezetői riport mutat összes bevételt, havi bevételt és átlagos kosárértéket.
- [ ] Top termék lista teljesített rendelésekből számol.
- [ ] Role alapú admin user is bejut, nem csak hardcoded email.
- [ ] Tiltott felhasználó nem tud védett adatot kezelni.

## 7. Admin termékkezelés
- [ ] Új termék rögzítése működik.
- [ ] Kategória legördülő listából választható.
- [ ] Termék szerkesztése működik.
- [ ] CSV minta letölthető.
- [ ] CSV import előnézetet és hibákat mutat.
- [ ] SKU alapú frissítés/import mód működik.

## 8. Készletkezelés
- [ ] Készlet nézetben szabad és foglalt készlet látszik.
- [ ] Kategória szerinti készletszűrés működik.
- [ ] Alacsony készlet jelzés megjelenik.
- [ ] Okos készletfigyelés utánrendelési javaslatot ad.
- [ ] Utánrendelési CSV export letölthető.
- [ ] Webes oldalon a friss készlet látszik.

## 9. Rendeléskezelés és helyszíni vásárlás
- [ ] Rendeléstípus szerinti tabok működnek: aktív, teljesített, helyszíni.
- [ ] Rendelés státusz módosítás működik.
- [ ] Státuszváltás után audit és készlet konzisztens.
- [ ] Rendelés részletei modal megnyílik.
- [ ] Admin rendeléskártyán `Számla letöltése` működik.
- [ ] Admin rendeléskártyán `Email sablon` működik.
- [ ] Helyszíni vásárlásnál mentett vásárló/cég profil kiválasztható.
- [ ] Helyszíni tétel hozzáadás mennyiség ellenőrzéssel működik.
- [ ] Helyszíni vásárlás mentése után készlet csökken.

## 10. Számla/PDF
- [ ] Számlaszám generálódik `INV-YYYY-XXXX` formátumban.
- [ ] Újra letöltésnél ugyanaz a számlaszám marad.
- [ ] PDF-ben látszik a vevő, rendelés, tételek és összesítő.
- [ ] Bemutatón elhangzik: ez demó/PDF bizonylat, éles NAV-kompatibilis integráció továbbfejlesztés.

## 11. Firestore és Spark deploy
- [ ] `npm run build` sikeres.
- [ ] `npm test -- --watch=false` sikeres.
- [ ] `npm run deploy:spark` csak build + hosting deployt futtat.
- [ ] Firestore szabály módosításakor `npm run deploy:rules` külön futtatható.
- [ ] Functions deploy nincs bekötve az alap projektbe.
- [ ] Hosting URL működik: https://tdlwebshop.web.app

## Eredmény összegzés
- Teszt dátum:
- Tesztelő:
- Talált hibák:
- Javítás után újratesztelve: Igen / Nem
