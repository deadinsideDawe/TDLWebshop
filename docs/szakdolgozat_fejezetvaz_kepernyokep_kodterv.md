# TDLWebshop szakdolgozati fejezetvaz, abrak es kodreszletek

Ez a dokumentum a szakdolgozat irasos reszenek elokesziteset segiti. Nem a vegleges, egy az egyben leadando szoveg, hanem egy rendezett szakmai alap: innen lehet a fejezeteket sajat nyelvezetre atirni, a kepernyokepeket beilleszteni, es a kodreszleteket megindokolni.

A szerkezet az Olah Sara mintadolgozatanak felepiteset koveti: bevezetes, teruleti attekintes, funkcionalis specifikacio, technologiak, architektura, biztonsag, adatmodell, folyamatok, kodreszletek, teszteles, tapasztalatok. A stilus celja a formalis, szakdolgozati hangnem, kerulve a tul altalanos es AI-szeru megfogalmazasokat.

## 1. Javasolt szakdolgozati szerkezet es fejezetvaz

### Címlap, feladatkiírás, tartalmi összefoglaló, tartalomjegyzék

A dolgozat elejen a formai sablon szerinti kotelezo reszek szerepeljenek. A tartalmi osszefoglaloban roviden le kell irni, hogy a TDLWebshop egy epületgepeszeti termekekre szabott webshop es adminisztracios rendszer, amely a vasarloi rendelest, kosarkezelest, termekbongeszeset, adminisztratori termek- es rendeleskezelest, keszletkovetest, helyszini vasarlast, PDF bizonylatot es AI asszisztenst is tartalmaz.

Javasolt osszefoglalo gondolat:

> A szakdolgozat celja egy olyan webalapu epületgepeszeti webshop megvalositasa volt, amely nemcsak a vasarloi oldali termekbongeszesre es rendelesleadasra alkalmas, hanem a kereskedoi/adminisztratori folyamatokat is tamogatja. A rendszer Angular alapu frontendbol, Firebase/Firestore hattertarbol, Firestore biztonsagi szabalyokbol, valamint Cloudflare Worker alapu AI proxybol all. A fejlesztes soran kiemelt szempont volt a jogosultsagkezeles, a rendelesi folyamat kovethetosege, a keszletvaltozasok kezelese, a reprodukalhato futtatas es a dokumentalt teszteles.

### Bevezetés

A bevezetesben a problemateret kell bemutatni: az epületgepeszeti termekeknel a vasarlo gyakran nemcsak arat es kepet keres, hanem kategoria, felhasznalasi terulet, keszlet, kiszallitas, szereloi vagy ceges vasarlas alapjan dont. Egy egyszeru termeklista onmagaban keves, mert a kereskedoi oldalon kezelni kell a rendeleseket, a keszletet, a visszatero vasarlokat, a kedvezmenyeket, a jogosultsagokat es a helyszini ertekesitest is.

Javasolt bekezdes:

> A webaruhazak mukodese ma mar nem korlatozodik a termekek egyszeru listazasara. Egy valos hasznalatra szant webshopnak egyszerre kell tamogatnia a vasarloi folyamatokat, az adminisztratori munkat, a jogosultsagok elvalasztasat es az uzemeltetesi szempontokat. Az epületgepeszeti termekek eseten ez kulonosen fontos, mert a termekek gyakran muszaki jelleguek, kategoriak szerint elteroek, es a keszletinformacio vagy a szakmai ajanlas a vasarloi dontes resze lehet.

> A TDLWebshop fejlesztese soran az volt a cel, hogy egy termekszeru, mukodokepes MVP keszuljon, amely bemutatja egy epületgepeszeti webshop legfontosabb vasarloi es adminisztratori folyamatait. A rendszer nem teljes vallalatiranyitasi szoftver, es nem is jogilag hiteles szamlazo rendszer, hanem egy szakdolgozati celra letrehozott, ellenorizheto webalkalmazas, amely a rendeleskezeles, termekkezeles, keszletkovetes, felhasznalokezeles es AI tamogatas mukodeset demonstralja.

### 1. Területi áttekintés

Ebben a fejezetben az epületgepeszeti webshopok es altalanos webaruhazak jellemzoit erdemes bemutatni. Itt lehet hivatkozni a piackutatasi tablazatokra is.

Tartalmi pontok:

- altalanos webshop funkciok: termeklista, kategoria, kosar, checkout, profil, rendeleskovetes;
- epületgepeszeti sajatossagok: muszaki kategoriak, keszlet, szereloi/ceges vasarlas, szakmai segitseg;
- admin oldali elvarasok: termekfeltoltes, CSV import, keszletfigyeles, rendelesek kezelese, jogosultsagok;
- TDLWebshop kiemelo elemei: helyszini vasarlas, mentett vasarlok, dolgozoi jogosultsag, PDF bizonylat, AI asszisztens sajat katalogushoz kotve.

Javasolt szoveg:

> A hasonlo webaruhazak vizsgalata alapjan megallapithato, hogy a legtobb rendszer a vasarloi oldalra helyezi a hangsulyt: termekeket listaz, kategoriakat kezel, kosarat biztosit es rendelest rogzit. A TDLWebshop celja ennel szelesebb volt, mert a vasarloi felulet mellett az adminisztratori es dolgozoi folyamatokat is be kellett mutatnia. Ez szakdolgozati szempontbol azert lenyeges, mert a rendszer nem pusztan feluleti prototipus, hanem tobb szerepkort es adatfolyamatot kezelo alkalmazas.

### 2. Funkcionális specifikáció

Ebben a fejezetben szerepkorok szerint kell leirni, mit tud a rendszer.

Fo szerepkorok:

- Vendeg vasarlo: termekek bongeszese, kosar, checkout, vendeg rendeles.
- Regisztralt vasarlo: profil, rendeleselozmeny, rendelesstatusz, szallitasi/szamlazasi adatok.
- Dolgozo: helyszini vasarlas rogzitese, keszlet megtekintese, termekek kezelese a kapott jogosultsagok szerint.
- Admin: teljes admin felulet, felhasznalokezeles, termekek, rendelesek, keszlet, kuponok, mentett vasarlok, fizetesi hatarido jovahagyas.

Javasolt szoveg:

> A rendszer funkcioit a felhasznaloi szerepkorok menten celszeru ertelmezni. A vasarloi oldal a klasszikus webshop folyamatokat valositja meg, mig az adminisztratori oldal a kereskedoi mukodeshez szukseges karbantartasi es ellenorzesi feladatokat tamogatja. A dolgozoi szerepkor bevezetese lehetove teszi, hogy ne minden belso felhasznalo kapjon teljes adminisztratori jogosultsagot, de a gyakorlati munkahoz szukseges funkciokat elerje.

### 3. Tervezett megjelenés és felhasználói felület

Itt kell bemutatni a dark/light dizajnt, a kezdolapot, termeklistat, kosarat, checkoutot, profilt es admint. Az Olah Sara mintahoz hasonloan a fejezetben minden fontosabb felulethez rovid magyarazat es abra tartozzon.

Javasolt szoveg:

> A felulet tervezesenel fontos szempont volt, hogy a webshop egyszerre keltsen modern, muszaki jellegu benyomast, de a vasarloi folyamatok ne valjanak tul bonyolultta. A sotet tema az alkalmazas alapertelmezett megjelenese, mert illeszkedik a TDLWebshop arculatahoz, mig a vilagos tema kenyelmi es uzleti alternativa. A ket tema kozott a layout nem valtozik, csak a szinek, hatterek es arnyekok modositjak a megjelenest.

### 4. Felhasznált technológiák

Javasolt alfejezetek:

- Angular: komponensalapu frontend, routing, service retegek.
- TypeScript: tipusos fejlesztes, modellek, hibak csokkentese.
- Firebase/Firestore: adatbazis, hosting, kliensoldali integracio.
- Firestore security rules: jogosultsagi es adatvalidacios szabalyok.
- Cloudflare Worker es OpenRouter: AI asszisztens szerveroldali proxyval.
- GitHub Actions: CI, build es teszt futtatas.

Javasolt szoveg:

> A fejleszteshez Angular keretrendszert hasznaltam, mert alkalmas komponensalapu, tobb oldalt es szolgaltatast tartalmazo webalkalmazas felepitesere. A Firebase/Firestore valasztasat az indokolta, hogy gyorsan integralhato, jol hasznalhato szakdolgozati MVP-hez, es a biztonsagi szabalyok segitsegevel reszletes jogosultsagkezeles alakithato ki. Az AI asszisztenshez kulon Cloudflare Worker proxy keszult, hogy az OpenRouter API kulcs ne keruljon a kliensoldali kodba.

### 5. Architektúra

Ebben a fejezetben az alkalmazas retegeit kell bemutatni:

- Angular oldalak es komponensek;
- service retegek: auth, product, cart, order, invoice, chatbot;
- Firestore gyujtemenyek;
- Firestore rules;
- Cloudflare Worker proxy;
- GitHub Actions CI.

Javasolt szoveg:

> Az alkalmazas architekturaja kliensoldali Angular alkalmazasra, Firebase/Firestore adattarolasra es kulon AI proxy retegrol felepulo megoldasra epul. A frontend komponensek nem kozvetlenul tartalmazzak az osszes uzleti logikat, hanem szolgaltatasokon keresztul erik el a termekeket, rendeleseket, kosarat, felhasznaloi adatokat es szamlakeszitest. Ez a felepites attekinthetobbe teszi a kodot, es lehetove teszi, hogy a kritikus muveletek, peldaul a rendelesstatusz es keszletvaltozas kezelese, elkulonitett szolgaltatasban legyen.

### 6. Belső felépítés

Fobb modulok:

- publikus webshop: kezdolap, termeklista, termekadatlap, kosar, checkout;
- felhasznaloi resz: profil, rendelesek, kivansaglista;
- admin resz: attekintes, termekkezeles, rendeleskezeles, keszlet, vasarlok, felhasznalok, kuponok, ertesitesek;
- AI asszisztens: katalogushoz kotott termekajanlas es domainvalasz;
- PDF bizonylat/szamla: rendelesadatokbol letoltheto dokumentum.

Javasolt szoveg:

> A belso felépítés moduláris. A vasarloi modulok a rendelesi utat fedik le, az admin modulok pedig a kereskedoi folyamatokat kezelik. A ket oldal kozos adatmodellre epul, de mas jogosultsagokat hasznal. Ez az elvalasztas kulonosen fontos a dolgozoi szerepkor miatt, mert a dolgozo bizonyos adminisztracios feladatokat elvegezhet, de nem kap teljes adminisztratori hozzaferest.

### 7. Biztonság

A konzulensi visszajelzes alapjan ez kulcsfejezet.

Tartalmi pontok:

- nincs becommitolt API kulcs vagy jelszo;
- `.env.example` csak mintakonfiguraciot tartalmaz;
- OpenRouter kulcs Cloudflare Worker secretkent kezelve;
- Firestore rules: aktiv user, admin, employee, customer;
- tiltott felhasznalo ellenorzese;
- rendelesi adatok es audit log vedelme;
- kuponokkal kapcsolatos visszaelesek korlatozasa;
- inputvalidacio checkoutnal, adminnal es importnal.

Javasolt szoveg:

> A biztonsagi tervezes egyik legfontosabb eleme az volt, hogy a kliensoldali alkalmazas ne tartalmazzon titkos kulcsokat. Az AI asszisztens ezert nem kozvetlenul hivja az OpenRouter API-t, hanem Cloudflare Worker proxyn keresztul kommunikál vele. A Firestore adatbazis hozzafereset kulon biztonsagi szabalyok vedik, amelyek a bejelentkezett es aktiv felhasznalot, az adminisztratori jogosultsagot, valamint a dolgozoi jogosultsagokat is kulon kezelik.

### 8. Adatmodell

Fobb entitasok:

- Product: termeknev, SKU, kategoria, ar, keszlet, kepek, akcios adat;
- CartItem: termek, mennyiseg, ar;
- Order: vasarlo, tetelek, osszeg, statusz, fizetes, szallitas;
- OrderItem: rendelesen beluli termeksor;
- UserProfile: szerepkor, tiltott allapot, adatok;
- CustomerProfile / savedCustomers: mentett magan- es ceges vasarlok;
- Coupon: kuponkod, kedvezmeny, ervenyesseg;
- Invoice: szamlaszam, rendeleshez kapcsolt PDF adat;
- orderStatusAudit: statuszvaltozasok naplozasa.

Javasolt szoveg:

> Az adatmodell kialakitasanal cel volt, hogy a webshop legfontosabb domainobjektumai kulon entitaskent jelenjenek meg. A termek, rendeles, felhasznalo, kupon es mentett vasarlo kulon gyujtemenyekben kezelheto, mig a rendelesstatusz valtozasait audit bejegyzesek rogzitik. Ez nemcsak a mukodest segiti, hanem a szakdolgozatban is jol bemutathatova teszi az adatfolyamatokat.

### 9. A rendszer magas szintű folyamatai

Bemutatando folyamatok:

- vasarloi rendeles leadasa;
- kupon ervenyesitese;
- rendelesstatusz modositasa admin oldalon;
- keszletvaltozas rendeles teljesitesekor;
- helyszini vasarlas mentett vasarloval;
- CSV termekimport;
- PDF bizonylat generalasa;
- AI asszisztens valaszadas katalogus es domainlogika alapjan.

Javasolt szoveg:

> A rendszer mukodeset nem eleg egyes kepernyok alapjan bemutatni, mert a webshop lenyege az egymashoz kapcsolodo folyamatokban jelenik meg. A vasarloi rendeles peldaul erinti a kosarat, a checkout validaciot, a kuponkezeleset, a rendeles letrehozasat es kesobb a profilban torteno megjelenest. Az admin statuszvaltas pedig a rendeles mellett a keszletet es az audit naplot is erinti.

### 10. Fontosabb kódrészletek

Itt keruljenek be a lenti kod-kepernyokep helyek. Minden kodreszlet elott legyen rovid magyarazat, hogy miert fontos.

Javasolt bevezeto:

> A kovetkezo kodreszletek nem a teljes alkalmazas kodjat mutatjak be, hanem azokat a pontokat, amelyek szakmailag a legfontosabbak: rendelesletrehozas, keszlet es statusz tranzakcio, PDF generalas, jogosultsagkezeles, CSV import es AI asszisztens. Ezek a reszek bizonyitjak, hogy a rendszer nem csak statikus feluletekbol all, hanem valodi uzleti logikat es jogosultsagi szabalyokat kezel.

### 11. Tesztelés és validáció

Tartalmi pontok:

- lokalis build;
- automata tesztek;
- GitHub Actions zold CI;
- kezi tesztjegyzokonyv;
- kritikus folyamatok: checkout, stock update, admin status, role tiltás, coupon, AI.

Javasolt szoveg:

> A teszteles celja az volt, hogy a legfontosabb vasarloi es adminisztratori folyamatok mukodese ellenorizheto legyen. A projektben automata build es teszt fut GitHub Actions alatt, emellett kezi tesztjegyzokonyv keszult a kritikus use case-ekrol. A kezi teszteles kulonosen fontos volt azoknal a funkcioknal, ahol tobb felulet es adatbazis-muvelet kapcsolodik ossze, peldaul checkout, rendelesstatusz valtas vagy helyszini vasarlas eseten.

### 12. Mesterséges intelligencia használata a fejlesztés során

Ezt a fejezetet a dolgozat vegen, onallo fejezetkent erdemes elhelyezni. A konzulensi utmutatas szerint kb. ket oldal legyen, osszefuggo szovegben.

Javasolt szovegalap:

> A szakdolgozat keszitese soran mesterséges intelligencia alapu eszkozoket is hasznaltam, de nem a munka helyettesitesere, hanem fejlesztoi tamogataskent. Az MI elsosorban otletelesben, hibakeresesben, kodreview jellegu ellenorzesben, dokumentacios vazlatok kesziteseben es a mar meglevo kod attekinteseben segitett. A fejlesztesi dontesek, a vegso kod ellenorzese, a futtatas, a teszteles es a szakdolgozat tartalmi felelossege nalam maradt.

> Az MI-t a tervezesi fazisban arra hasznaltam, hogy atgondoljam, milyen funkcioktol valik a webshop termekszeruve. Ilyen volt peldaul az adminisztratori szerepkorok elvalasztasa, a helyszini vasarlas, a keszletfigyeles, a PDF bizonylat es az AI asszisztens bevezetese. Ezek kozul nem minden otlet kerult be azonos melysegben a rendszerbe, mert a fejlesztes soran meg kellett huzni az MVP hatarait.

> A kodolas soran az MI altal adott javaslatokat nem tekintettem automatikusan helyesnek. A javasolt megoldasokat a projektben kiprobaltam, builddel, tesztekkel es kezi ellenorzessel validaltam. Volt olyan eset, amikor a kliensoldali megoldas biztonsagi szempontbol nem volt megfelelo, peldaul az OpenRouter API kulcs kozvetlen hasznalata. Ezt vegul Cloudflare Worker proxyval valtottam ki, hogy a kulcs szerveroldali secretkent legyen kezelve.

> A fejlesztes soran tudatosan figyeltem arra, hogy titkos adatok, jelszavak es API kulcsok ne maradjanak a repoban. Az MI-t nem hasznaltam arra, hogy valodi hozzaferesi adatokat kezeljen vagy taroljon. A szakdolgozat szoveges reszenel az MI inkabb szerkezeti es stilisztikai segitseget adott, de a vegleges szoveget sajat nyelvezetre kell atirnom, hogy pontosan tukrozze a sajat fejlesztesi donteseimet es tapasztalataimat.

> A folyamat tanulsaga az volt, hogy az MI hasznos fejlesztoi parbeszedpartner lehet, de csak akkor, ha a kimenetet ellenorizni tudom. Gyorsitotta a dokumentacio rendszerezeset es segitett a hibak feltarasaban, ugyanakkor tobbszor szukseg volt sajat dontesre, mert egy altalanos javaslat nem mindig illeszkedett a Firebase ingyenes csomagjahoz, a Firestore szabalyokhoz vagy a szakdolgozati MVP hataraihoz. A jovoben is hasznalnek MI-t fejlesztoi segedeszkozkent, de tovabbra is ellenorzott, dokumentalt es felelossegteljes modon.

### 13. Tapasztalatok és továbbfejlesztési lehetőségek

Javasolt tartalom:

- mi sikerult jol: termekszeru webshop, admin rendszer, jogosultsagok, CI, dokumentacio;
- korlatok: nem teljes ERP, nem jogilag eles szamlazo, AI asszisztens nem helyettesit szakembert;
- tovabbfejlesztes: e2e tesztek, valodi fizetesi szolgaltato, szamlazo API, reszletes analitika, szereloi csomagok adminbol szerkeszthetoen, keszlettrendek.

Javasolt szoveg:

> A fejlesztes egyik legfontosabb tapasztalata az volt, hogy egy webshop mukodese sokkal tobb osszekapcsolt folyamatbol all, mint amennyi a vasarloi feluleten latszik. A termeklista, kosar es checkout mellett legalabb ilyen fontos az adminisztratori rendeleskezeles, a jogosultsagok, a keszletvaltozas, a hibakezeles es a reprodukalhato futtatas. A TDLWebshop jelenlegi allapota egy eros MVP, amely tovabbfejlesztheto lenne eles fizetesi integracioval, hivatalos szamlazo rendszerrel es reszletesebb automata tesztekkel.

## 2. Képernyőképek és ábrafeliratok

Az alabbi kepernyokepeket erdemes elkesziteni. A dolgozatban minden abra ala keruljon rovid, targyszeru felirat.

| Sorszám | Oldal / állapot | Mit kell fotózni | Javasolt ábrafelirat |
| --- | --- | --- | --- |
| 1 | Kezdolap, dark mode | Teljes kezdolap felso resze, kategoria lenyilo nyitva | A TDLWebshop kezdolapja sotet temaban, kategoria legordulo menuvel |
| 2 | Kezdolap, AI asszisztens | AI ablak nyitva, egy domain kerdesre adott valasszal | A vasarloi AI asszisztens mukodese a kezdolapon |
| 3 | Kezdolap, light mode | Vilagos tema ugyanazzal az elrendezessel | A kezdolap vilagos temaju megjelenese |
| 4 | Termeklista oldal | Kategoria vagy kereses aktiv szurovel | Termeklista oldal keresesi es szuresi lehetosegekkel |
| 5 | Termekadatlap | Egy konkret termek keppel, arral, keszlettel, kosar gombbal | Termekadatlap reszletes termekinformaciokkal |
| 6 | Kosar oldal | Legalabb ket termek, mennyiseg modositas lehetosege | A kosar oldal tobb termekkel es osszegzessel |
| 7 | Checkout validacio | Hibas email vagy telefonszam es megjeleno hibauzenet | Mezoszintu validacio a rendelési folyamatban |
| 8 | Checkout sikeres rendeles | Sikeres rendeles utani visszajelzes vagy success oldal | Sikeres rendelésleadás visszaigazolása |
| 9 | Profil / rendeleskovetes | Regisztralt vasarlo rendelesei es statuszai | Vasarloi profil rendelestortenettel es statuszkovetessel |
| 10 | Kivansaglista | Egy vagy tobb kedvenc termek | Kivansaglista a mentett termekekkel |
| 11 | Admin attekintes | Admin dashboard statisztikai kartyakkal | Adminisztratori attekinto felulet |
| 12 | Admin termekkezeles / CSV import | CSV import resz feltoltott fajllal vagy elonezettel | Csoportos termekfeltoltes CSV importtal |
| 13 | Admin keszletfigyeles | Keszletlista alacsony keszlet jelzessel vagy kategoriaval | Admin keszletfigyeles es keszletallapot |
| 14 | Helyszini vasarlas | Mentett vasarlo kivalasztva, termekek hozzaadva | Helyszini vasarlas rogzitese mentett vasarloval |
| 15 | PDF bizonylat / szamla | Letoltott PDF elso oldala | A rendszer altal general PDF bizonylat |
| 16 | Admin felhasznalo/jogosultsag | Felhasznalo szerkesztese, admin/dolgozo jogosultsagok | Adminisztratori felhasznalo- es jogosultsagkezeles |
| 17 | Admin mentett vasarlok | Szerkesztes, tiltás, torles gombokkal | Mentett vasarlok kezelese admin feluleten |
| 18 | AI nem relevans kerdes | AI valasz, amely jelzi, hogy csak epületgepeszeti temaban segit | Az AI asszisztens temakori korlatozasa |
| 19 | GitHub Actions | Legfrissebb zold CI futas | Sikeres GitHub Actions CI futas |
| 20 | Mobil nezet | Kezdolap vagy termeklista mobil meretben | Reszponziv megjelenes mobil nezetben |

## 3. Kód-képernyőkép helyek

Az alabbi kodreszletek keruljenek a "Fontosabb kodreszletek" fejezetbe. A sorok a jelenlegi repoallapotra vonatkoznak.

| Fájl | Sorok | Mit mutat be? | Miért érdemes betenni? |
| --- | --- | --- | --- |
| `src/pages/checkout/checkout.ts` | 367-555 | Rendeles veglegesitese, validacio, kupon, rendeles letrehozasa, profilfrissites | Ez mutatja a vasarloi folyamat legfontosabb uzleti logikajat |
| `src/pages/checkout/checkout.ts` | 580-636 | Checkout validacio email, telefon, szallitas, szamlazas, kupon | Bizonyitja, hogy a rendszer kezeli a hibas bemeneteket |
| `src/pages/checkout/checkout.ts` | 695-737 | Kuponkedvezmeny szamitasa es ervenyessege | A kuponlogika es visszaeles-csokkentes miatt szakmailag fontos |
| `src/app/services/order.service.ts` | 41-127 | Rendelesstatusz, audit naplo es keszlet tranzakcioban | Korabbi kritikus hibat javit: statusz es keszlet egyutt mozog |
| `src/app/services/order.service.ts` | 222-267 | Helyszini vasarlas tranzakcios mentese es keszletcsokkentese | Az admin/dolgozoi folyamat egyik legerosebb domainfunkcioja |
| `src/app/services/order.service.ts` | 269-302 | Szamlaszam generalas eves szamlaloval | A PDF bizonylat azonosithatosagat es kovethetoseget mutatja |
| `src/app/services/invoice.service.ts` | 9-154 | PDF bizonylat felepitese rendelési adatokbol | Latvanyos, domainhez kotott kimeneti dokumentum |
| `src/app/services/invoice.service.ts` | 165-206 | PDF osszeallitas es szovegkezeles | Megmutatja, hogy a PDF nem csak statikus fajl, hanem programbol generalodik |
| `firestore.rules` | 25-76 | Aktiv felhasznalo, admin, dolgozo es jogosultsagi segedfuggvenyek | A biztonsagi minimum egyik legerosebb bizonyiteka |
| `firestore.rules` | 125-184 | Rendelesstatusz es audit payload validacio | Bizonyitja, hogy a szabalyok nem csak szerepkort, hanem adatformatumot is ellenoriznek |
| `firestore.rules` | 294-361 | Termekek, rendelesek, userek, mentett vasarlok, audit szabalyok | Atfogo kepet ad az adatbazis vedelmerol |
| `src/pages/admin/admin.ts` | 599-657 | Admin/dolgozoi jogosultsagok feluleti kapui | Bemutatja a role-based UI mukodest |
| `src/pages/admin/admin.ts` | 1181-1259 | CSV import validacio es mentese | A tomeges termekfeltoltes miatt fontos admin funkcio |
| `src/pages/admin/admin.ts` | 2460-2544 | Helyszini vasarlas payload, mentese es hibakezelese | Bemutatja a helyszini rendeles teljes folyamatat |
| `src/pages/admin/admin.ts` | 2886-3076 | Admin altali profil- es jogosultsagkezeles | A felhasznalokezeles es dolgozoi jogok bizonyitasa |
| `src/app/services/chatbot-llm.service.ts` | 26-89 | AI asszisztens modellzara, domainellenorzes, katalogus alapu valasz | Bizonyitja, hogy az AI nem szabadon, hanem kontrollaltan mukodik |
| `src/app/services/chatbot-llm.service.ts` | 92-164 | Relevans katalogus felepitese es termekpontozas | Megmutatja, hogyan kapcsolodik az AI a sajat termekadatbazishoz |
| `src/app/services/chatbot-llm.service.ts` | 214-236 | Fallback es kapcsolatfelveteli megjegyzes | Fontos, mert az AI nem ajanlhat veletlenszeru termekeket |
| `workers/openrouter-proxy/src/index.js` | 126-191 | OpenRouter proxy, secret kezeles, hibakezeles | Bizonyitja, hogy az API kulcs nem kliensoldalon van |
| `.github/workflows/ci.yml` | 12-40 | GitHub Actions build es teszt workflow | Reprodukcio es minosegbiztositas miatt fontos |

## 4. Ábrajavaslatok

Ezek nem kepernyokepek, hanem szerkezeti/mukodesi abrak. A minta csomagban levo Mermaid vagy PlantUML sablonokbol elkeszithetoek.

| Ábra | Tartalom | Hova keruljon? |
| --- | --- | --- |
| Use case diagram | Vendeg, vasarlo, dolgozo, admin es fo funkciok | Funkcionalis specifikacio |
| Komponens architektura | Angular frontend, Firebase/Firestore, Firestore rules, Cloudflare Worker, OpenRouter | Architektura |
| Adatmodell diagram | Product, Order, OrderItem, UserProfile, Coupon, Invoice, savedCustomers | Adatmodell |
| Checkout szekvencia | Kosar, validacio, kupon, orderService, Firestore, profil | Magas szintu folyamatok |
| Admin statuszvaltas szekvencia | Admin UI, orderService, Firestore transaction, audit, stock | Magas szintu folyamatok |
| AI asszisztens folyamat | Felhasznalo kerdes, katalogus szures, Worker proxy, OpenRouter, valasz | MI es architektura fejezet |
| Biztonsagi attekinto abra | Kliens, Firestore rules, Worker secret, GitHub CI, no secrets in repo | Biztonsag |

## 5. Kézi tesztjegyzőkönyvbe kerülő esetek

Ezeket a teszteket erdemes vegigkattintani es pipalhato tablazatban dokumentalni.

- Regisztracio es bejelentkezes normal vasarloval.
- Tiltott felhasznalo belepesi vagy rendelesi korlatozasa.
- Termekkereses nev, kategoria vagy SKU alapjan.
- Akcios termek megjelenese az akcios oldalon.
- Kosarhoz adas, mennyiseg modositas, termek torles.
- Checkout hibas emaillel es hibas telefonszammal.
- Checkout ervenyes adatokkal, sikeres rendeles.
- Kupon alkalmazasa ervenyes es ervenytelen kuponnal.
- Profilban rendeles megjelenese es statuszanak kovetese.
- Admin termek letrehozasa vagy modositasa.
- CSV termekimport valid fajllal.
- CSV termekimport hibas fajllal.
- Rendelesstatusz modositasa adminnal.
- Keszletvaltozas ellenorzese teljesitett rendeles utan.
- Helyszini vasarlas mentett vasarloval.
- Ceges vasarlo kedvezmenyenek ellenorzese.
- Dolgozoi fiokkal belepes: lathato es nem lathato admin funkciok.
- Admin felhasznalo letrehozasa es jogosultsag beallitasa.
- AI asszisztens domain kerdesre.
- AI asszisztens termekkerdesre.
- AI asszisztens nem relevans kerdesre.

## 6. Mi van még hátra a héten?

Prioritasi sorrend:

1. A fenti kepernyokepek elkeszitese es beszurasa a dolgozatba.
2. A fontosabb kodreszletekrol kepernyokep keszitese a megadott sorok alapjan.
3. A kezi tesztjegyzokonyv vegigkattintasa es kitoltese.
4. A szakdolgozat szoveges reszenek sajat nyelvezetre atirasa.
5. A GitHub Actions zold CI kepernyokepenek beillesztese.
6. README, `.env.example`, secret hygiene es repo struktura utolso ellenorzese.
7. Vegso build es teszt futtatas: `npm run build`, `npm test -- --watch=false`.
8. Vegso PDF export es formai ellenorzes.

## 7. Őszinte értékelés jelen állapot alapján

A jelenlegi kod es funkcionalitas szakdolgozati szempontbol eros alap. A rendszer nem csak egyszeru CRUD, hanem vasarloi es adminisztratori folyamatokat is kezel, van jogosultsagi rendszer, Firestore szabalyzat, CSV import, helyszini vasarlas, PDF bizonylat, AI asszisztens, CI es dokumentacios alap.

Szigoru ertekeles:

- Kod es mukodo funkciok: eros 4-es, 5-os kozeli.
- Repo es CI: jo allapot, kulonosen ha a zold CI kepernyokep bekerul.
- Biztonsagi bizonyitas: jo alap, de a dolgozatban reszletesen el kell magyarazni.
- Dokumentacio: tartalmilag jo irany, de a vegleges szoveget sajat hangra kell atirni.
- Beadasi esely: ha a kepernyokepek, kodreszletek, tesztjegyzokonyv es sajat nyelvu atiras elkeszul, realisan vedheto 5-os szint.

A legnagyobb kockazat mar nem a kod, hanem az, hogy a dolgozat szovege elegge sajat, konkret es bizonyito ereju legyen. Ezert a vegso atirasnal fontos, hogy minden fejezetben szerepeljen: mit csinal a rendszer, miert igy keszult, hogyan ellenorizted, es mi maradt tudatos tovabbfejlesztes.
