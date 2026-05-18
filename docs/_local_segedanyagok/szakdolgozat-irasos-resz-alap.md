# TDLWebshop szakdolgozat - írásos rész alap

Ez a fájl egy átírható, szakdolgozati stílusú szövegalap a TDLWebshop projekthez. A szöveg tudatosan úgy készült, hogy jó kiindulópont legyen, de mindenképpen érdemes a saját nyelvezetedre átírni.

## Bevezetés

A szakdolgozatom célja egy modern, reszponzív, Angular és Firebase alapokra épülő webshop fejlesztése volt, amely az épületgépészeti termékek értékesítését támogatja. A rendszer nemcsak egy hagyományos vásárlói felületet valósít meg, hanem egy olyan adminisztratív hátteret is biztosít, amellyel a termékek kezelése, a rendelések nyomon követése, a készletfigyelés, valamint a felhasználói jogosultságok kezelése is megoldható. A projekt fő célja az volt, hogy egy olyan valósághű webalkalmazás készüljön, amely egy szakdolgozat keretében is jól bemutatja a frontend, a kliensoldali üzleti logika, a felhőalapú adattárolás és a jogosultságkezelés összekapcsolását.

Az alkalmazás fejlesztése során fontos szempont volt, hogy a vásárlói oldal könnyen használható, vizuálisan korszerű és mobilon is jól kezelhető legyen. Emellett kiemelt szerepet kapott az admin felület, hiszen a rendszer egyik erőssége éppen az, hogy nemcsak terméklistázást és rendelésfelvételt valósít meg, hanem olyan kiegészítő funkciókat is, mint a helyszíni vásárlás rögzítése, a mentett vásárlók kezelése, az alacsony készletszint figyelése, az utánrendelési javaslatok készítése és a szerepköralapú jogosultságkezelés.

Az elkészült rendszer tehát egyszerre szolgál végfelhasználói webshopként és belső ügyviteli felületként. Ez a kettős szerep különösen alkalmassá teszi a projektet arra, hogy szakdolgozati keretben bemutatható legyen a modern webfejlesztés több fontos területe: az egylapos webalkalmazások felépítése, a valós idejű adatszinkronizáció, az űrlapkezelés, a hozzáférés-szabályozás, valamint a tesztelés és a dokumentált fejlesztési folyamat.

**[KÉPERNYŐKÉP JAVASLAT]** Ide a kezdőlap teljes nézete kerülhet.  
Kódhivatkozás: `src/pages/home/home.html` 1-155. sor, valamint `src/pages/home/home.ts` 79-152. sor.

## 1. Piackutatás és problémafelvetés

Az épületgépészeti termékeket értékesítő webáruházak jelentős része vagy kifejezetten csak katalógus jellegű, vagy kizárólag a vásárlói felületre koncentrál. Sok esetben hiányzik a letisztult termékszűrés, a jól kezelhető admin felület, a valós készlethez kapcsolódó döntéstámogatás, illetve az olyan funkciók összekapcsolása, amelyek az online és a helyszíni értékesítést egyszerre támogatják. A saját rendszerem fejlesztésekor ezért nemcsak a klasszikus vásárlási folyamatot vettem figyelembe, hanem azt is, hogy egy kisebb vállalkozás vagy szaküzlet belső működését miként lehet ugyanebben a rendszerben támogatni.

A TDLWebshop egyik fő célkitűzése az volt, hogy a látogatók egyszerűen tudjanak termékeket keresni és szűrni, miközben az adminisztrátorok és dolgozók egy összetettebb, üzleti szempontból is használható háttérrendszert kapnak. Ebből következik, hogy a rendszer tervezése során a vásárlói felhasználói élmény és a belső adminisztratív hatékonyság egyszerre jelent meg tervezési szempontként.

## 2. Funkcionális specifikáció

A webalkalmazás három fő felhasználói szerepkör köré épül: vendég vagy vásárlói felhasználó, dolgozó, illetve adminisztrátor. A vendég felhasználó képes böngészni a termékeket, szűrni a kínálatban, megtekinteni a főoldali kiemeléseket, a termékek részleteit, illetve kosárba helyezni a kiválasztott árucikkeket. A vásárlási folyamat során lehetősége van vendégként rendelni, vagy bejelentkezett felhasználóként a már mentett profiladatait felhasználni.

A regisztrált vásárló a fenti funkciókon túl saját profillal rendelkezik, amelyben szerkesztheti a kapcsolattartási, szállítási és számlázási adatait, valamint megtekintheti korábbi rendeléseit és azok állapotát. Ezzel a rendszer már nem pusztán egy egyszeri rendelést kiszolgáló felület, hanem hosszabb távon is használható ügyfélfiókot biztosít.

A dolgozói és admin szerepkör ennél bővebb jogosultságokkal rendelkezik. A dolgozó jogosultságait az admin külön állíthatja be, így például engedélyezhető számára a helyszíni vásárlás rögzítése, a készlet megtekintése, a termékek kezelése vagy a vásárlói profilok szerkesztése. Az adminisztrátor ezen felül teljes körű hozzáférést kap a felhasználókhoz, a rendelési értesítésekhez, a jogosultságokhoz, valamint az üzleti statisztikákhoz is.

**[KÉPERNYŐKÉP JAVASLAT]** Ide az admin fülsora és a szerepkörökhöz kötött menüképernyő kerülhet.  
Kódhivatkozás: `src/pages/admin/admin.html` 1-18. sor, valamint `src/pages/admin/admin.ts` 117-131. sor és 331-342. sor.

## 3. Tervezett megjelenés és felhasználói felület

Az alkalmazás felhasználói felületének tervezésekor sötét alapú, modern, technikai jellegű megjelenést választottam, amely jól illeszkedik az épületgépészeti termékek világához és a TDLWebshop arculatához. A kezdőoldal kialakításánál fontos szempont volt, hogy már az első nézetben jól látható legyen az oldal fő üzenete, a termékkategóriák, valamint a kiemelt termékek és promóciók.

A főoldal hero blokkja egyszerre szolgál arculati és információs elemként: itt jelenik meg a fő üzenet, a fő cselekvésre ösztönző gomb, valamint az admin által kezelhető hírblokk is. A kategóriák és a kiemelt termékek külön vizuális blokkokban jelennek meg, így a látogató gyorsan áttekintheti a kínálat fő részeit. A hírlevél feliratkozás szintén közvetlenül elérhető a kezdőlapon, ami marketing szempontból is indokolt.

**[KÉPERNYŐKÉP JAVASLAT]** Ide a főoldali hírblokk és a kiemelt termékek blokkja kerüljön.  
Kódhivatkozás: `src/pages/home/home.html` 16-41. sor és 76-125. sor, valamint `src/pages/home/home.ts` 147-202. sor.

## 4. Alkalmazott technológiák

A fejlesztés során a frontend oldalon Angular keretrendszert használtam standalone komponensekkel. Ennek előnye, hogy az alkalmazás modulárisan felépíthető, az egyes oldalak és komponensek elkülönülten fejleszthetők és lazy loaded útvonalakon keresztül tölthetők be. Az útvonalkezelést az Angular router biztosítja, amelyben külön védett útvonalon érhető el az admin felület.

Az adattárolás és hitelesítés Firebase szolgáltatásokkal történt. A felhasználói bejelentkezést a Firebase Authentication támogatja, míg a termékek, rendelések, felhasználói profilok, hírlevelek és naplóbejegyzések a Firestore adatbázisban helyezkednek el. A rendszer egyik fontos előnye, hogy a Firestore valós idejű adatfolyamait több helyen is felhasználja, ezért a felület automatikusan frissül például terméklista vagy rendeléslista változás esetén.

Az alkalmazás továbbá tartalmaz kliensoldali PDF-generálást a számlaszerű bizonylatok előállításához, illetve külön szolgáltatásréteget a rendelések, felhasználók, kosár és készletműveletek kezelésére. A fejlesztés során a cél az volt, hogy az üzleti logika minél inkább külön szolgáltatásokba kerüljön, ne közvetlenül a template-ekben vagy a komponensek vizuális részében jelenjen meg.

**[KÓDRÉSZLET JAVASLAT]** Ide az útvonalkezelésről lehet rövid kódrészletet tenni.  
Kódhivatkozás: `src/app/app.routes.ts` 1-21. sor.

## 5. Architektúra

Az alkalmazás architektúrája kliensoldali Angular felületre és Firebase alapú háttérszolgáltatásokra épül. A frontend réteg felelős a nézetek megjelenítéséért, az űrlapok kezeléséért, a felhasználói interakciók feldolgozásáért és a navigációért. A komponensekhez kapcsolódó üzleti logika nagy része szolgáltatásokban található, így a felület és az üzleti folyamatok jól szétválasztottak.

A háttérréteg szempontjából a Firestore adatbázis tölti be a központi szerepet. Ide kerülnek a termékek, a rendelések, a felhasználói profilok, a mentett vásárlói profilok, az audit naplók és a hírlevél-feliratkozók adatai. Az autentikációt a Firebase Authentication biztosítja, míg a hozzáférés-szabályozást a Firestore biztonsági szabályai végzik. Ez azt jelenti, hogy a kliensoldali felület nem önmagában dönti el, ki mit láthat és módosíthat, hanem ezt adatbázis-szinten is külön szabályrendszer védi.

Az architektúra egyik fontos jellemzője, hogy a vásárlói és admin funkciók ugyanazon projektben valósulnak meg, de jól elkülönített nézetekkel és szerepköralapú jogosultságokkal. Ez a megközelítés különösen hasznos egy szakdolgozati projekt esetében, mert egyszerre mutatja meg a modern frontend fejlesztés és az üzleti logikával támogatott adminisztráció megvalósítását.

## 6. Belső felépítés

### 6.1. Komponensek

Az alkalmazásban külön oldalkomponensek felelnek a fő funkcionális egységekért. Ilyen a kezdőlap, a terméklista oldal, a kosár, a checkout, a profiloldal, valamint az admin felület. Ezek a komponensek önálló sablonfájlokkal és stílusfájlokkal rendelkeznek, így a megjelenítés jól elkülönül a mögöttes logikától.

A terméklista oldal például nemcsak egyszerű listázást végez, hanem kategória-, készlet- és ár szerinti szűrést, kulcsszavas keresést, promóciós szűrést, valamint egy szerelői csomagajánló logikát is tartalmaz. A csomagajánló célja, hogy bizonyos munkatípusokhoz ajánlott termékkombinációkat tudjon összeállítani a meglévő készlet alapján.

**[KÉPERNYŐKÉP JAVASLAT]** Ide a terméklista oldal szűrőpanelje és a szerelői csomag blokk kerüljön.  
Kódhivatkozás: `src/pages/products/products.html` 1-112. sor, valamint `src/pages/products/products.ts` 98-149. sor és 443-481. sor.

### 6.2. Szolgáltatások

Az alkalmazás legfontosabb szolgáltatásai közé tartozik az `AuthService`, a `UserService`, az `OrderService`, a `ProductService`, a `CartService`, az `InvoiceService`, valamint a `CustomerDirectoryService`. Ezek a szolgáltatások végzik az adatbázisműveleteket, az autentikációhoz kapcsolódó logikát, a rendelések kezelését, a készletmódosításokat és a számlagenerálást.

Az `AuthService` figyeli a Firebase hitelesítési állapotát, kezeli a bejelentkezést és a regisztrációt, majd minden sikeres belépés után frissíti a Firestore-ban található felhasználói profilt is. Ezzel biztosítható, hogy a jogosultsági és profiladatok a hitelesítés után rögtön szinkronban legyenek.

**[KÓDRÉSZLET JAVASLAT]** Ide a bejelentkezési és profilfrissítési logika kerülhet.  
Kódhivatkozás: `src/app/services/auth.service.ts` 18-60. sor és 126-142. sor.

### 6.3. Rendeléskezelési logika

A rendeléskezelés egyik fontos eleme, hogy a státuszváltás, az audit napló és a készletkorrekció tranzakcióban történik. Ez azért fontos, mert így elkerülhető, hogy a készlet és a rendelés állapota egymástól eltérő, inkonzisztens állapotba kerüljön. Hasonló tranzakciós megközelítést alkalmaztam a helyszíni vásárlás rögzítésére is, ahol a rendszer a készlet ellenőrzése után csökkenti a készletet, majd csak ezután menti el a rendelést.

**[KÓDRÉSZLET JAVASLAT]** Ide a tranzakciós rendelésstátusz-frissítés kerülhet.  
Kódhivatkozás: `src/app/services/order.service.ts` 41-127. sor.

**[KÓDRÉSZLET JAVASLAT]** Ide a helyszíni vásárlás mentésének tranzakciója kerülhet.  
Kódhivatkozás: `src/app/services/order.service.ts` 222-267. sor.

## 7. Biztonság és jogosultságkezelés

A rendszer biztonságának egyik legfontosabb eleme a Firestore szabályrendszer. A megoldás nem csupán azt ellenőrzi, hogy a felhasználó be van-e jelentkezve, hanem azt is, hogy aktív-e, milyen szerepkörrel rendelkezik, illetve hogy egy dolgozó pontosan milyen részjogosultságokat kapott. Külön kezelt szerepkör az admin, a dolgozó és a vásárló. Emellett a rendszer támogatja a tiltott felhasználók kezelését is, vagyis egy letiltott profil még érvényes token birtokában sem végezhet módosító műveletet.

A termékek és a publikus hírek olvasása szándékosan nyilvános, mivel ezek alkotják a vásárlói felület tartalmát. Ezzel szemben a rendelések, a felhasználói profilok, az audit naplók, a mentett vásárlók és a hírlevél-feliratkozók csak meghatározott szerepkörök számára érhetők el. Ezen felül a szabályrendszer több esetben payload validációt is alkalmaz, vagyis azt is ellenőrzi, hogy a beérkező adat szerkezete megfelel-e az elvárt formának.

**[KÓDRÉSZLET JAVASLAT]** Ide a Firestore szabályokból egy részlet kerülhet.  
Kódhivatkozás: `firestore.rules` 16-76. sor, valamint 294-358. sor.

## 8. Adatmodell

Az adatmodell több egymáshoz kapcsolódó entitásból áll. A termékekhez név, kategória, ár, kép, raktárkészlet, cikkszám, márka és promóciós adatok tartoznak. A rendelések tartalmazzák a vásárló adatait, a szállítási és számlázási információkat, a rendelt tételeket, az alkalmazott kuponokat, valamint a teljes összeget és a státuszt. A felhasználói profilok a bejelentkezett vásárlók saját adatait tárolják, míg a mentett vásárlói profilok a helyszíni értékesítéshez kapcsolódó adatokat segítik.

Az admin felület további adatokat is kezel, például ügyfélköltéshez kapcsolódó összesítéseket, hírlevél-feliratkozókat, ügyfélmegjegyzéseket és fizetési határidőhöz kapcsolódó jóváhagyási állapotokat. Az adatmodell felépítésénél arra törekedtem, hogy a webshop működéséhez valóban szükséges üzleti információk külön kezelhetők legyenek, de a rendszer továbbra is egyszerűen áttekinthető maradjon.

## 9. A rendszer fontosabb folyamatai

### 9.1. Vásárlási folyamat

A vásárlási folyamat a termékek böngészésével indul, majd a kiválasztott termékek a kosárba kerülnek. A felhasználó a checkout oldalon megadhatja a szükséges adatait, kiválaszthatja a szállítási és fizetési módot, alkalmazhat kuponkódot, valamint eldöntheti, hogy céges vásárlóként szeretne-e rendelni. A rendszer a rendelés elküldése előtt ellenőrzi az adatok helyességét, majd sikeres mentés után elmenti a rendelést és továbbítja a felhasználót a sikeres rendelést jelző oldalra.

**[KÉPERNYŐKÉP JAVASLAT]** Ide a checkout oldal teljes képernyőképe kerüljön.  
Kódhivatkozás: `src/pages/checkout/checkout.html` 38-231. sor, valamint `src/pages/checkout/checkout.ts` 367-557. sor és 580-657. sor.

### 9.2. Profilkezelés és rendeléskövetés

A regisztrált felhasználó a profiloldalon módosíthatja személyes és számlázási adatait, valamint külön fülön megtekintheti korábbi rendeléseit. A rendelésekhez állapotlépések is kapcsolódnak, amelyek vizuálisan jelzik, hogy a rendelés milyen feldolgozottsági szinten áll. Ez a megoldás a felhasználói élményt is javítja, hiszen a vásárló a rendelés állapotát közvetlenül a saját fiókjában követheti.

**[KÉPERNYŐKÉP JAVASLAT]** Ide a profil oldal „Adataim” és „Rendeléseim” nézete kerülhet.  
Kódhivatkozás: `src/pages/profile/profile.html` 16-143. sor és 146-172. sor, valamint `src/pages/profile/profile.ts` 91-171. sor és 173-277. sor.

### 9.3. Admin és belső ügyviteli folyamatok

Az admin felület a projekt egyik legösszetettebb része. Ezen keresztül kezelhetők a termékek, a készletinformációk, a rendelések, a felhasználók és a mentett vásárlói profilok. Az admin láthatja az összesített üzleti riportokat, az alacsony készletszinteket, az utánrendelési javaslatokat és a hírlevél-feliratkozókat is. A dolgozói jogosultságoknak köszönhetően nem minden belső felhasználó lát minden adatot, ezáltal a rendszer jogosultságkezelése finomabban szabályozható.

Különösen fontos funkció a helyszíni vásárlás rögzítése, ahol mentett vásárló is kiválasztható, illetve új vásárlóprofil is létrehozható. Ez a rész jól mutatja, hogy a rendszer nem kizárólag online rendeléseket kezel, hanem fizikai értékesítési helyzetekre is alkalmas.

**[KÉPERNYŐKÉP JAVASLAT]** Ide az admin áttekintés és a helyszíni vásárlás blokk kerülhet.  
Kódhivatkozás: `src/pages/admin/admin.html` 246-467. sor, valamint `src/pages/admin/admin.ts` 352-493. sor és 2988-3035. sor.

**[KÉPERNYŐKÉP JAVASLAT]** Ide a készletkezelés és az okos készletfigyelés blokk kerülhet.  
Kódhivatkozás: `src/pages/admin/admin.html` 470-520. sor, valamint `src/pages/admin/admin.ts` 2916-3137. sor.

**[KÉPERNYŐKÉP JAVASLAT]** Ide a felhasználókezelés és az új profil létrehozása rész kerüljön.  
Kódhivatkozás: `src/pages/admin/admin.html` 979-1099. sor, valamint `src/app/services/user.service.ts` 98-143. sor.

## 10. Fontosabb kódrészletek

Az egyik fontos kódrészlet a checkout oldalon található, ahol a rendszer egyszerre végez űrlapellenőrzést, kosárellenőrzést, kuponkezelést és rendelésmentést. A kliensoldali validáció különösen fontos, mert ezzel a felhasználó már a beküldés előtt visszajelzést kap a hibás mezőkről.

Egy másik fontos kódrészlet a számlagenerálás, amely kliensoldali PDF-generálást alkalmaz. Ez ugyan nem helyettesít egy teljes NAV-kompatibilis számlázó rendszert, de szakdolgozati és demonstrációs célra jól szemlélteti, miként lehet egy rendelési adatstruktúrából automatikusan bizonylatot előállítani.

**[KÓDRÉSZLET JAVASLAT]** Ide a számlagenerálás részlete kerülhet.  
Kódhivatkozás: `src/app/services/invoice.service.ts` 9-58. sor és 60-183. sor.

## 11. Tesztelés

Az elkészült rendszerhez automatikus tesztek is készültek. Ezek többek között a kosár működését, a checkout logika egyes elemeit, az admin segédfüggvényeket, a validátorokat, valamint a profil- és rendeléskezeléshez kapcsolódó logika egy részét ellenőrzik. A projektben kialakított CI folyamat biztosítja, hogy a build és a tesztek GitHub környezetben is ellenőrizhetők legyenek, így a kód helyes működése nemcsak lokális fejlesztői gépen, hanem a távoli tárolóhoz kapcsolódó automatizált futtatásban is bizonyított.

## 12. Tapasztalatok és továbbfejlesztési lehetőségek

A fejlesztés során az egyik legfontosabb tapasztalat az volt, hogy egy webshop jellegű alkalmazás valójában jóval több, mint egyszerű terméklistázás és rendelésfelvétel. Már egy kisebb méretű rendszerben is megjelenik a jogosultságkezelés, a készletszinkronizáció, a hibakezelés, az auditálhatóság és a felhasználói adatok védelmének igénye. Emiatt a projekt fejlesztése során többször kellett a korábbi megoldásokat újragondolni, különösen a rendeléskezelési és adminisztrációs részek esetében.

A továbbfejlesztési lehetőségek közé tartozhat egy valódi online fizetési szolgáltató integrációja, egy NAV-kompatibilis számlázási megoldás beépítése, fejlettebb E2E tesztelés, valamint további analitikai és riportfunkciók kidolgozása. Emellett a termékimport és a készlet-előrejelzés később akár külső beszállítói rendszerekkel is összekapcsolható lenne.

## Javasolt ábrajegyzék / screenshot lista

1. Főoldal teljes nézet  
   Kód: `src/pages/home/home.html` 1-155. sor

2. Főoldali hírblokk és kiemelt termékek  
   Kód: `src/pages/home/home.html` 16-41. sor és 76-125. sor

3. Terméklista szűrőpanel és termékkártyák  
   Kód: `src/pages/products/products.html` 1-157. sor

4. Szerelői csomagajánló blokk  
   Kód: `src/pages/products/products.html` 64-112. sor, `src/pages/products/products.ts` 101-149. sor

5. Kosár oldal  
   Kód: `src/pages/cart/cart.html` 1-34. sor

6. Checkout oldal  
   Kód: `src/pages/checkout/checkout.html` 1-263. sor

7. Profil oldal  
   Kód: `src/pages/profile/profile.html` 1-172. sor

8. Admin áttekintés  
   Kód: `src/pages/admin/admin.html` 246-467. sor

9. Készletkezelés és okos készletfigyelés  
   Kód: `src/pages/admin/admin.html` 470-520. sor

10. Felhasználókezelés / új profil létrehozása  
    Kód: `src/pages/admin/admin.html` 979-1099. sor

11. Mentett vásárlók kiválasztása és szerkesztése  
    Kód: `src/pages/admin/admin.html` 1227-1368. sor

12. Számla / PDF minta  
    Kód: `src/app/services/invoice.service.ts` 60-183. sor

