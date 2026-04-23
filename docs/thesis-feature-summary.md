# TDL Webshop - szakdolgozati funkcio osszefoglalo

Ez a dokumentum roviden osszefoglalja, hogy a projekt mely reszei emelhetok ki a szakdolgozatban. A cel nem marketing szoveg, hanem vedheto, technikai es felhasznaloi szempontbol is ertheto bemutatas.

## Projekt celja

A rendszer egy epuletegepeszeti temaju webshop, amely nem csak termeklistat es kosarat ad, hanem adminisztracios, keszletkezelesi es helyszini ertekesitesi folyamatokat is kezel. A projekt kulon erteke, hogy alap Firebase Spark csomagon is futtathato, tehat nem igenyel fizetos szerveroldali szolgaltatast az alap mukodeshez.

## Kiemelheto funkciok

### 1. Admin kozpontu webshop mukodes

Az admin felulet nem csak termekrogzitesre alkalmas, hanem rendeleseket, felhasznalokat, keszletet, hireket, helyszini vasarlast es szamlaletoltest is kezel. Ez a webshopot kozelebb viszi egy valos kisvallalkozasi adminisztracios rendszerhez.

### 2. Vezetoi uzleti riport

Az admin attekintesben a rendszer osszes bevetelt, havi bevetelt, atlagos kosarerteket, webes/helyszini rendelest aranyt es top termekeket is mutat. Ez szakdolgozati szempontbol jol vedheto, mert a webshop adataibol uzleti riport keszul kulon backend nelkul.

### 3. Okos keszletfigyeles

A keszletmodul nem csak azt mutatja, hogy mennyi termek van raktaron, hanem kulon kezeli a szabad es foglalt keszletet. A rendszer az elmult 30 nap teljesitett rendelesei alapjan fogyasi becslest keszit, majd utanrendelesi javaslatot ad. Ez szakdolgozati szempontbol azert eros, mert egyszeru adatokbol uzletileg ertelmezheto dontestamogatast keszit.

### 4. Utanrendelesi CSV export

Az okos keszletfigyeles eredmenye exportalhato CSV fajlba. Ez gyakorlati admin funkcio: a javaslatbol gyorsan beszerzesi lista keszulhet. A funkcio nem csak latvanyelem, hanem a napi munkafolyamatot tamogatja.

### 5. Szereloi/profi csomagajanlo

A termeklistan szereloi/profi mod segiti a vasarlot komplett futes, viz, szellozes vagy hutes/klima csomag osszeallitasaban. A rendszer a meglevo termekekbol probal csomagot epiteni, es jelzi, ha valamelyik csomagelem hianyzik. Ez kulonbozik egy atlagos webshop egyszeru termekkartyaitol, mert szakmai felhasznalasi helyzetet modellez.

### 6. Spark-kompatibilis email folyamat

Mivel a projekt alap Firebase Spark csomagon fut, a visszaigazolo email nem Cloud Functions alapu automatikus kuldeskent mukodik. Helyette a rendszer mailto alapu email sablont keszit, amely a sikeres rendeles es az admin rendeleskezeles felol is megnyithato. Ez realis kompromisszum: fizetos szerveroldali szolgaltatas nelkul is tamogatja a kommunikacios folyamatot.

### 7. Helyszini ertekesitesi mod

Az admin helyszini vasarlast is rogzithet, mentett vasarloi vagy ceges profilokkal. A folyamat tetel-hozzaadast, keszletellenorzest, rendelesmentest es PDF bizonylat letoltest is tartalmaz. Ez B2B vagy szakuzleti kornyezetben hasznos, ahol nem minden vasarlas webes checkouton keresztul tortenik.

### 8. Tranzakcios keszletkezeles

A rendelesstatusz modositasnal a statusz, audit es keszletkorrekcio egy Firestore tranzakcioban tortenik. Ez csokkenti annak eselyet, hogy a keszlet es a rendeles allapota elcsusszon egymastol.

### 9. Biztonsagi szabalyok

A Firestore rules kulon kezeli az adminokat, aktiv felhasznalokat, vendeg rendelest, sajat rendeles olvasast, customer profile irast es kliensoldali hibalogokat. A tiltott felhasznalok ellenorzese szabaly szinten is megjelenik, nem csak a feluleten.

## Technologiai dontesek

- Angular standalone komponensek a frontendhez.
- Firebase Auth a bejelentkezeshez.
- Firestore a termekekhez, rendelesekhez, profilokhoz es admin adatokhoz.
- Firebase Hosting az eles oldalhoz.
- Spark-kompatibilis mukodes Functions deploy nelkul.
- Firestore tranzakciok a kritikus keszletmuveleteknel.
- Unit tesztek a fontosabb logikai reszekhez.

## Korlatozasok es tovabbfejlesztes

A projekt jelenlegi allapota bemutathato es mukodo Spark csomagon. Eles uzleti hasznalathoz tovabbi fejlesztes lehet:

- NAV-kompatibilis szamlazorendszer integracio.
- Automatikus emailkuldes Cloud Functions vagy kulso backend segitsegevel.
- Online fizetesi szolgaltato bekotese.
- Reszletesebb keszlet-elorejelzes hosszabb idosorokkal.
- Beszallitoi rendelesei modul.
- Role/custom claim alapu Firebase Auth admin kezeles nagyobb rendszerhez.

## Vedesi erveles roviden

A projekt nem csak egy alap webshop, mert a vasarlasi folyamat mellett adminisztracios es dontestamogato funkciokat is tartalmaz. Az okos keszletfigyeles, a szereloi csomagajanlo, a helyszini ertekesitesi mod es a Spark-kompatibilis kompromisszumok azt mutatjak, hogy a rendszer valos uzleti helyzetekre lett tervezve, nem csak demo celra.
