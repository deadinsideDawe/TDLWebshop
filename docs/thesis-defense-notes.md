# TDL Webshop - vedesi jegyzetek

Ez a dokumentum rovid, szobeli valaszokhoz keszult. Celja, hogy a bemutaton gyorsan es magabiztosan lehessen valaszolni a projekt fontosabb donteseire.

## 1. Mi a projekt lenyege?

A projekt egy epuletegepeszeti webshop, amely a vasarloi folyamat mellett adminisztracios es keszletkezelesi funkciokat is tartalmaz. Nem csak termeklista es kosar, hanem rendeleskezeles, felhasznalokezeles, helyszini vasarlas, PDF bizonylat, okos keszletfigyeles es szereloi csomagajanlo is van benne.

Rovid valasz:
> A celom egy olyan webshop keszitese volt, ami egy kisebb epuletegepeszeti vallalkozas napi mukodeset is tamogatja, nem csak online termekeladast biztosit.

## 2. Mitol tobb ez, mint egy alap webshop?

- Okos keszletfigyeles 30 napos fogyasi adatok alapjan.
- Utanrendelesi CSV export.
- Szereloi/profi csomagajanlo futes, viz, szellozes es hutes/klima temakhoz.
- Vezetoi riport bevetellel, atlagos kosarertekkel es top termekekkel.
- Helyszini ertekesitesi mod admin feluleten.
- Szabad es foglalt keszlet kulon kezelese.
- Firestore szabalyokkal vedett admin es user folyamatok.

Rovid valasz:
> A projekt kulonlegessege, hogy a webshop mellett dontestamogato es uzemeltetesi funkciokat is ad, peldaul utanrendelesi javaslatot es szakmai csomagajanlot.

## 3. Miert Firebase Spark csomaggal keszult?

A projekt celja az volt, hogy elofizetes nelkul is bemutathato es futtathato legyen. Ezert az alap mukodes Firebase Auth, Firestore es Hosting szolgaltatasokra epul. Cloud Functions nincs bekotve az alap deployba, mert az mar fizetos Blaze csomagot igenyelne.

Rovid valasz:
> Tudatos dontes volt, hogy a projekt alap Firebase csomagon is mukodjon. A fizetos szerveroldali funkciokat tovabbfejleszteskent jeloltem.

## 4. Mi tortenik az email visszaigazolassal?

Automatikus szerveroldali emailkuldes nincs bekotve, mert az Cloud Functions vagy kulso backend hasznalatat igenyelne. Helyette a rendszer mailto alapu email sablont general, amelyet a sikeres rendeles oldalon es az admin rendeleskezelesben lehet megnyitni.

Rovid valasz:
> Spark csomagon nem hasznalok szerveroldali emailkuldo fuggvenyt, ezert email sablonos megoldast keszitettem. Ez mukodo kompromisszum es kesobb automatizalhato.

## 5. A szamla valodi NAV-kompatibilis szamla?

A projekt PDF bizonylatot/szamla jellegu dokumentumot general egyedi szamlaszammal. Eles uzleti felhasznalashoz NAV-kompatibilis szamlazorendszer vagy kulso integracio szukseges. Ez a dolgozatban tovabbfejleszteskent szerepelhet.

Rovid valasz:
> A PDF generalas a szakdolgozati rendszer resze, de eles NAV-kompatibilis szamlazashoz kulon szamlazorendszer integracio lenne szukseges.

## 6. Hogyan mukodik az okos keszletfigyeles?

A rendszer a teljesitett rendelesek utolso 30 napos fogyasat nezi, majd ehhez viszonyitja az aktualis szabad keszletet. Figyelembe veszi a foglalt keszletet is, es prioritas szerint utanrendelesi javaslatot ad.

Rovid valasz:
> A rendszer egyszeru fogyasi becslest hasznal: a 30 napos teljesitett rendelesekbol napi atlagot szamol, majd javaslatot ad az utanrendelesre.

## 7. Mi a szereloi/profi csomagajanlo celja?

Az epuletegeszeti vasarlasoknal gyakori, hogy nem egyetlen termeket vesznek, hanem egymashoz tartozo komponenseket. A csomagajanlo ezeket a helyzeteket modellezi, es segit komplett futes, viz, szellozes vagy hutes/klima csomagot osszeallitani.

Rovid valasz:
> Ez a funkcio szakmai vasarlasi helyzetet modellez: a rendszer nem csak termeket mutat, hanem komplett szereloi csomagot ajanl.

## 8. Hogyan vedett az admin felulet?

Az admin felulet kliens oldalon is ellenorzi az admin jogosultsagot, de a fontosabb vedelem Firestore rules szinten tortenik. Az admin lehet megadott email lista alapjan vagy Firestore user role alapjan. A tiltott felhasznalo szabaly szinten sem tud vedett adatot kezelni.

Rovid valasz:
> Nem csak a felulet rejti el az admin reszeket, hanem a Firestore szabalyok is ellenorzik az admin es aktiv user allapotot.

## 9. Hogyan kezeli a projekt a keszlet elcsuszasanak kockazatat?

A rendelesstatusz valtas, audit bejegyzes es keszletkorrekcio Firestore tranzakcioban tortenik. Ez azt jelenti, hogy a kapcsolodo adatok egyutt valtoznak, es kisebb az eselye inkonzisztens allapotnak.

Rovid valasz:
> A kritikus keszletmuveleteknel tranzakciot hasznalok, hogy a rendeles allapota es a keszlet ne csusszon szet.

## 10. Milyen tesztek vannak?

A projekt unit teszteket tartalmaz a fontosabb logikai reszekhez, peldaul kosar, checkout kuponlogika, termeklista csomagajanlo, admin keszletjavaslat es szamlaletoltes logika. A legutobbi ellenorzesnel 34 teszt futott le sikeresen.

Rovid valasz:
> A legfontosabb uzleti logikakhoz irtam teszteket, es a projekt buildje is ellenorizve van.

## 11. Milyen tovabbfejlesztesek lennenek?

- Automatikus emailkuldes Cloud Functions vagy kulso backend segitsegevel.
- NAV-kompatibilis szamlazo integracio.
- Online fizetes.
- Reszletesebb keszlet-elorejelzes.
- Beszallitoi rendeles modul.
- Jogosultsagkezeles custom claim alapon nagyobb rendszerhez.

Rovid valasz:
> A rendszer jelenleg bemutathato szakdolgozati szintu webshop, de eles vallalati hasznalathoz fizetes, automatikus email es hivatalos szamlazo integracio lenne a kovetkezo lepes.

## 12. Ha megkerdezik, hogy mi volt a legnehezebb resz

Jo valasz lehet:
> A legnehezebb resz az volt, hogy a webshop ne csak kulonallo oldalakbol alljon, hanem az admin, keszlet, rendeles, kosar es Firestore szabalyok egymasra epuljenek. Kulon figyelni kellett arra is, hogy Spark csomagon maradjon mukodokepes.

## 13. Ha megkerdezik, mit csinalnal maskepp

Jo valasz lehet:
> Eles projektben korabban szetvalasztanam a demoban mukodo funkciokat es a fizetos szerveroldali integraciokat. Peldaul az emailkuldes es a hivatalos szamlazas kulon backend szolgaltatas lenne.

## 14. Egy mondatos zaras

> A projekt celja egy szakmailag testreszabott, epuletegepeszeti webshop bemutatasa volt, amely alap Firebase kornyezetben is mukodik, mikozben keszletkezelesi es adminisztracios funkciokkal tulmutat egy egyszeru webshopon.
