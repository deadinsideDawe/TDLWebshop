# Beadás előtti teljes teszt-checklist

Ez a checklist arra szolgál, hogy a webshop teljes működését végig tudd tesztelni beadás előtt. Minden pontnál pipáld ki, ha ellenőrizted és rendben volt. Ha valahol hibát találsz, érdemes mellé röviden odaírni, mi volt a gond és javítás után újra visszatérni rá.

## 1. Általános indulás

- [ ] Az alkalmazás elindul hiba nélkül.
- [ ] A főoldal betöltődik.
- [ ] A dark mode megfelelően jelenik meg.
- [ ] A light mode megfelelően jelenik meg.
- [ ] A váltás dark és light mód között működik.
- [ ] Mobil nézetben sem csúszik szét a fejléc.
- [ ] Tablet nézetben sem csúszik szét a kezdőlap.
- [ ] Asztali nézetben minden fő blokk megfelelően jelenik meg.

## 2. Főoldal

- [ ] A navbar minden eleme látható és kattintható.
- [ ] A kategóriák lenyíló menü működik.
- [ ] A keresőmező megjelenik és használható.
- [ ] A hero szekció helyesen jelenik meg.
- [ ] A hírek vagy kiemelt tartalom megfelelően jelenik meg a hero részben.
- [ ] A kiemelt termékek blokk rendben megjelenik.
- [ ] A kategóriák blokk rendben megjelenik.
- [ ] A lábléc csak a megfelelő részeket tartalmazza.
- [ ] A főoldali extra sávok csak a főoldalon jelennek meg.

## 3. Navigáció és oldalak

- [ ] A `Kezdőlap` oldal megnyílik.
- [ ] A `Termékek` oldal megnyílik.
- [ ] A `Kategóriák` menüből a kategóriaoldalak megnyílnak.
- [ ] A `Kapcsolat` oldal megnyílik és jól jelenik meg.
- [ ] A `Kívánságlista` oldal megnyílik.
- [ ] A `Profil` oldal megnyílik bejelentkezett felhasználónál.
- [ ] A kosár oldal megnyílik.
- [ ] A checkout oldal megnyílik.

## 4. Terméklista oldal

- [ ] A termékek listázódnak.
- [ ] A kategória szerinti szűrés működik.
- [ ] A keresés működik.
- [ ] A rendezés működik.
- [ ] A termékkártyákon az ár jól látható.
- [ ] A készletállapot jól látható.
- [ ] A `Részletek` gomb rendesen látszik.
- [ ] A kívánságlista ikon jó helyen jelenik meg.
- [ ] A `Kosárba` gomb működik.

## 5. Termékadatlap

- [ ] A termék fő képe betöltődik.
- [ ] A termék galériaképei működnek.
- [ ] A név, ár, készlet és leírás jól jelenik meg.
- [ ] A mennyiségállítás működik.
- [ ] A termék kosárba tehető.
- [ ] A kívánságlistához adás működik.
- [ ] A kapcsolódó termékek megjelennek.

## 6. Kívánságlista

- [ ] Termék hozzáadható a kívánságlistához.
- [ ] A kívánságlista oldalon megjelenik a hozzáadott termék.
- [ ] Termék eltávolítható a kívánságlistáról.
- [ ] Bejelentkezett állapotban megmaradnak a kívánságlista elemek.

## 7. Kosár

- [ ] A termék megjelenik a kosárban.
- [ ] A mennyiség növelhető.
- [ ] A mennyiség csökkenthető.
- [ ] A végösszeg helyesen frissül.
- [ ] A termék eltávolítható a kosárból.
- [ ] Több különböző termék is kezelhető a kosárban.

## 8. Checkout

- [ ] A checkout űrlap megjelenik.
- [ ] A kötelező mezők ellenőrzése működik.
- [ ] Az e-mail formátum ellenőrzése működik.
- [ ] A telefonszám formátum ellenőrzése működik.
- [ ] A szállítási adatok mentése működik.
- [ ] A számlázási adatok kezelése működik.
- [ ] A rendelés összesítő jól számol.
- [ ] A rendelés sikeresen leadható.
- [ ] Vendég rendelés is leadható, ha ez engedélyezett.

## 9. Regisztráció és bejelentkezés

- [ ] Új vásárló tud regisztrálni.
- [ ] A bejelentkezés működik.
- [ ] A kijelentkezés működik.
- [ ] Hibás adatokkal megfelelő hibaüzenet jelenik meg.
- [ ] Tiltott felhasználó nem tud belépni.
- [ ] Tiltott felhasználónál megfelelő üzenet jelenik meg.

## 10. Vásárlói profil

- [ ] A profiloldal megnyílik.
- [ ] A felhasználó látja a saját adatait.
- [ ] A szállítási adatok módosíthatók.
- [ ] A számlázási adatok módosíthatók.
- [ ] A korábbi rendelések megjelennek.
- [ ] A rendelésállapotok megjelennek.

## 11. Admin bejelentkezés és jogosultságok

- [ ] Az admin be tud jelentkezni.
- [ ] A dolgozó be tud jelentkezni.
- [ ] A vásárló nem jut be adminként a belső felületre.
- [ ] A dolgozó csak a neki engedélyezett menüpontokat látja.
- [ ] Az admin minden szükséges menüpontot lát.

## 12. Admin irányítópult

- [ ] Az admin dashboard betöltődik.
- [ ] A statisztikák megjelennek.
- [ ] A rendelések listája megjelenik.
- [ ] A szűrők működnek.
- [ ] Az értesítések fül megnyílik.
- [ ] Az admin saját adatlapja megjelenik.

## 13. Termékkezelés admin oldalon

- [ ] Új termék felvehető.
- [ ] A kategória legördülő menüből választható.
- [ ] A termék szerkeszthető.
- [ ] A termék törölhető vagy inaktiválható, ha ezt a rendszer támogatja.
- [ ] A termék képei helyesen mentődnek.
- [ ] Több képes termék esetén a galéria rendben működik.
- [ ] A készletmennyiség mentése működik.
- [ ] A kategória szerinti admin készletszűrés működik.

## 14. Mentett vásárlók

- [ ] Mentett vásárlók listája megjelenik.
- [ ] Magánszemély vásárló felvehető.
- [ ] Céges vásárló felvehető.
- [ ] Mentett vásárló kiválasztható.
- [ ] Kiválasztáskor az adatok automatikusan kitöltődnek.
- [ ] A mentett vásárló szerkeszthető.
- [ ] A mentett vásárló törölhető.
- [ ] A mentett vásárló letiltható.
- [ ] Letiltott vásárlónál megfelelő figyelmeztetés jelenik meg.
- [ ] A vásárlói előzmények megjelennek, ha ez a funkció készen van.

## 15. Helyszíni vásárlás rögzítése

- [ ] Új helyszíni vásárlás indítható.
- [ ] Mentett vásárló kiválasztható.
- [ ] Új vásárló adatainak kitöltése működik.
- [ ] A termék kereshető név, cikkszám vagy kategória alapján.
- [ ] A tétel hozzáadása működik.
- [ ] Több tétel kezelése működik.
- [ ] A végösszeg helyesen számolódik.
- [ ] Készpénzes fizetés működik.
- [ ] Bankkártyás fizetés kiválasztható.
- [ ] Utalásos fizetés kiválasztható.
- [ ] 10 napos fizetési határidő helyesen beállítható.
- [ ] 10 napnál hosszabb határidőnél figyelmeztetés jelenik meg.
- [ ] A vásárlás sikeresen menthető.
- [ ] A PDF generálás elindul.

## 16. Számla / PDF

- [ ] A számla fejléc helyesen jelenik meg.
- [ ] A TDLWebshop arculat jól látható a számlán.
- [ ] A kiállító adatai rendben megjelennek.
- [ ] A vevő adatai rendben megjelennek.
- [ ] A fizetési mód jól jelenik meg.
- [ ] A tételek nem csúsznak össze.
- [ ] A nettó, áfa és bruttó értékek helyesen jelennek meg.
- [ ] A végösszeg nem lóg bele más blokkba.
- [ ] A PDF menthető vagy letölthető.

## 17. Rendelések kezelése

- [ ] Az aktív rendelések megjelennek.
- [ ] A teljesített rendelések megjelennek.
- [ ] A helyszíni rendelések megjelennek.
- [ ] A rendelés státusza módosítható.
- [ ] A készletfrissítés megfelelően történik.
- [ ] Az audit napló létrejön.

## 18. Hírlevél

- [ ] A hírlevél-feliratkozó mező működik.
- [ ] A feliratkozó sikeresen mentődik.
- [ ] Az admin felületen látható a hírlevél-feliratkozás.

## 19. Jogosultságok és dolgozói szerepkör

- [ ] Az admin új dolgozó profilt tud létrehozni.
- [ ] Vásárló profil is létrehozható.
- [ ] Dolgozónál jogosultságok adhatók.
- [ ] Dolgozónál legalább egy jogosultság kötelező.
- [ ] A dolgozó csak a kiosztott műveleteket tudja elérni.
- [ ] A jóváhagyási jogosultság csak adminnál működik.

## 20. Biztonság és adatvédelem

- [ ] Tiltott felhasználó nem tud rendelni.
- [ ] Tiltott felhasználó nem tud helyszíni vásárlásban szerepelni figyelmeztetés nélkül.
- [ ] A publikus oldalak bejelentkezés nélkül is megfelelően működnek.
- [ ] A belső adatok nem láthatók jogosultság nélkül.
- [ ] A Firestore szabályok a várt működést támogatják.

## 21. Dokumentáció és beadás előtti ellenőrzés

- [ ] A README friss és vállalható.
- [ ] A fontos dokumentumok a saját nyelvezetre át vannak írva.
- [ ] A Word szakdolgozat alap át van nézve.
- [ ] A képernyőképek bekerültek a dolgozatba.
- [ ] Az ábrafeliratok elkészültek.
- [ ] A GitHub CI zöld.
- [ ] A projekt buildje sikeres.
- [ ] A tesztek sikeresen lefutnak.

## 22. Végső beadás előtti állapot

- [ ] A felesleges fájlok ki vannak takarítva.
- [ ] A docs mappa átlátható.
- [ ] A mappastruktúra rendezett.
- [ ] A végleges termékek bent vannak.
- [ ] A fontos funkciók újratesztelve vannak.
- [ ] A szakdolgozat végleges verziója elkészült.

## Megjegyzések / hibák

- [ ] Nincs külön megjegyzés.

Ha van hiba vagy észrevétel, ide írd le külön:

- 
- 
- 
