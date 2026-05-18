# 40-50 oldalas szakdolgozati vaz es mintaszovegek

Ez a fajl segedanyag. A vegleges dolgozatba ne szo szerint masold, hanem sajat nyelvezetre atirva hasznald.

## Javasolt terjedelem

| Resz | Javasolt terjedelem |
|---|---:|
| Cimlap, feladatkiiras, osszefoglalo, tartalomjegyzek | 4-6 oldal |
| Bevezetes es problemafelvetes | 3-4 oldal |
| Piaci kitekintes, MVP, kovetelmenyek, use case-ek | 7-8 oldal |
| Technologiai hatter | 5-6 oldal |
| Architektura es adatmodell | 7-8 oldal |
| Megvalositas | 10-12 oldal |
| Biztonsag es adatvedelem | 4-5 oldal |
| Teszteles es reprodukalhatosag | 5-6 oldal |
| MI-hasznalat | kb. 2 oldal |
| Osszefoglalas es tovabbfejlesztes | 2-3 oldal |

Igy a dolgozat realisan 40-50 oldal kozott tarthato ugy, hogy nem feleslegesen nyujtott, hanem kepekkel, abrakkal es bizonyitekokkal alatamasztott.

## 1. Bevezetes

A TDLWebshop celja egy olyan epulettgepeszeti webshop es adminisztracios rendszer megvalositasa, amely nemcsak a vasarloi oldal alapveto funkcioit tartalmazza, hanem a hatterben zajlo uzleti folyamatokat is kezeli. A rendszer temaja azert valasztasra erdemes, mert az epulettgepeszeti termekek kereskedelme sok esetben nem merul ki egyszeru termeklistazasban. A vasarloknak fontos a keszletinformacio, a pontos termekleiras, a rendeleseik kovetese, a cegeknek es szereloknek pedig a gyors, adminisztralhato helyszini ertekesites.

A fejlesztes soran a cel nem egy teljes erteku, eles penzugyi webshop minden reszletenek megvalositasa volt, hanem egy olyan MVP keszitese, amely bizonyitja a legfontosabb vasarloi es adminisztratori folyamatokat. Ide tartozik a termekek bongeszese, a kosar kezelese, a checkout, a rendelesek kovetese, az adminisztratori rendeles- es termekkezeles, a jogosultsagkezeles, a CSV-alapu termekimport, a PDF bizonylat generalasa es egy katalogushoz kotott AI asszisztens.

[IDE KERUL: 1. abra - Kezdolap dark mode, kategoria lenyiloval]

## 2. Problema es celkituzes

Az epulettgepeszeti termekek online ertekesitesenel ket felhasznaloi oldal igenyeit kellett figyelembe venni. A vasarloi oldal gyors keresest, attekintheto kategoriakat, keszletinformaciot es egyszeru rendelesei folyamatot igenyel. Az adminisztratori oldal ezzel szemben rendelesei statuszokat, termekfeltoltest, keszletfigyelest, helyszini vasarlas rogzitest, felhasznaloi jogosultsagokat es dokumentumgeneralast igenyel.

A szakdolgozat celja annak bemutatasa, hogyan lehet Angular es Firebase alapokon egy ilyen termekszeru rendszert felepiteni. A megoldasban kulon figyelmet kapott, hogy a rendszer ne csak statikus oldalakbol alljon, hanem valodi adatmodellel, jogosultsagi szabalyokkal es ellenorizheto folyamatokkal rendelkezzen.

## 3. Piaci kitekintes es sajat megoldas helye

A piaci osszehasonlitas celja annak bemutatasa, hogy a TDLWebshop milyen szempontbol hasonlit mas webshopokra, es miben ad tobbet egy egyszeru katalogusnal. A vizsgalt rendszereknel erdemes osszevetni a termekkeresest, a kosarat, a checkout folyamatot, a felhasznaloi profilt, az admin funkciokat, a keszletkezeles lathatosagat es a dokumentumgeneralast.

[IDE KERUL: piaci osszehasonlito tablazat 2-4 hasonlo webshoppal]

A sajat rendszer erteke elsosorban abban jelenik meg, hogy a vasarloi es adminisztratori folyamatok egy projektben kapcsolodnak ossze. A helyszini ertekesitesi mod, a mentett vasarlok kezelese, a PDF bizonylat es a katalogushoz kotott AI asszisztens olyan kiegeszito funkciok, amelyek egy szakdolgozati MVP-ben jol bemutatjak a domainhez igazodo gondolkodast.

## 4. MVP-hatar

Az MVP tartalmazza a termekek listazasat, reszleteit, kategoriakat, kosarat, checkoutot, rendelesei statuszkovetest, admin termek- es rendeleskezelest, jogosultsagi szinteket, CSV importot, PDF bizonylatot es AI asszisztenst. Tudatosan nem celja a rendszernek a bankkartya-fizetes valos penzugyi integracioja, a teljes szamlazo szolgaltatoi megfeleles, a komplex keszletgazdalkodasi ERP-integracio vagy a production szintu AI kvotakezeles.

Ezek nem hianyossagkent, hanem tudatos hatarkent jelennek meg. A szakdolgozat keretei kozott a cel az volt, hogy az uzleti folyamatok mukodese, az adatmodell es a jogosultsagi logika bizonyithato legyen.

## 5. Kovetelmenyek es use case-ek

A kovetelmenyeket vasarloi, adminisztratori, dolgozoi es technikai oldalrol erdemes bemutatni. A vasarlo kereshessen termeket, kosarba helyezhesse, rendelest adhasson le, majd kovethesse annak statuszat. Az admin kezelhesse a termekeket, rendeleseket, keszletet, felhasznalokat es jogosultsagokat. A dolgozo szukebb hozzaferessel vehessen fel helyszini vasarlast es kezelhessen alapveto termekadatokat.

[IDE KERUL: Use case abra - `01_use_case_attekintes.svg`]

[IDE KERUL: Traceability tablazat - kovetelmeny, use case, megvalositott modul, teszt/bizonyitek]

## 6. Technologiai hatter

A frontend Angular alapokon keszult, TypeScript nyelven. Az Angular komponensalapu felepitese jol illeszkedik a webshop oldalakhoz, mert a termeklista, kosar, checkout, profil es admin felulet kulon komponensekben kezelheto. A TypeScript tipusrendszere segit abban, hogy a termekek, rendelesek es felhasznaloi profilok adatai kovetkezetesebben jelenjenek meg a kodban.

A backend oldalon a Firebase szolgaltatasai kaptak szerepet. A Firebase Authentication kezeli a bejelentkezest, a Cloud Firestore tarolja a termekeket, rendeleseket, felhasznaloi profilokat es kapcsolodo adatokat, a Firebase Hosting pedig az alkalmazas kiszolgalasat tamogatja. Az AI asszisztens OpenRouter API-val mukodik, de a kliens nem kozvetlenul kuldi az API kulcsot, hanem Cloudflare Worker proxy-n keresztul tortenik a kommunikacio.

## 7. Architektura

A rendszer felhasznaloi felulete, adatbazisa es kulso AI integracioja elkulonul. A frontend komponensek szolgaltatasokon keresztul kommunikalnak a Firestore adatbazissal. A jogosultsagi dontesek egy resze a kliensoldali feluleten jelenik meg, de a tenyleges adatvedelmi korlatokat a Firestore biztonsagi szabalyai biztositjak.

[IDE KERUL: Komponens architektura abra - `02_komponens_architektura.svg`]

Az architekturaban fontos szerepet kap az, hogy az admin es dolgozoi funkciok ne csak elrejtett UI-elemek legyenek, hanem adatbazis-szinten is vedve legyenek. Ez kulonosen fontos a rendelesek, felhasznaloi adatok, kuponok es audit bejegyzesek eseteben.

## 8. Adatmodell

A rendszer fo entitasai a Product, CartItem, Order, OrderItem, UserProfile, Coupon, SavedCustomer, Invoice es Audit jellegu adatok. A Product tarolja a termek katalogusadatait, arat, keszletet es kategoriat. Az Order a vasarlasi folyamat eredmenye, amelyhez tetelek, vasarloi adatok, fizetesi es szallitasi informaciok kapcsolodnak.

[IDE KERUL: Adatmodell abra - `03_adatmodell.svg`]

Az adatmodellnel kulon figyelmet kapott, hogy a rendelesek es termekek kapcsolata ne csak megjelenitesi celokat szolgaljon, hanem keszletkezelesi es audit folyamatokhoz is felhasznalhato legyen.

## 9. Megvalositas

### 9.1 Checkout

A checkout folyamat a vasarloi oldal egyik legfontosabb resze. Itt tortenik a szallitasi es szamlazasi adatok megadasa, a fizetesi mod valasztasa, a kupon ervenyesitese es a rendeles veglegesitese. A felulet mezoszintu validaciokkal segiti a hibas adatok kiszureset.

[IDE KERUL: Checkout validacios kepernyokep]

[IDE KERUL: `checkout.ts` 367-555 rovid kodreszlet]

### 9.2 Rendeles, statusz, audit es keszlet

Az adminisztratori folyamatban a rendeles statuszanak modositasa nemcsak megjelenitesi adat, hanem uzleti es keszletkezelesi kovetkezmenyekkel jar. Ezert fontos, hogy a statuszvaltas, audit es keszletvaltozas osszefuggo logikakent legyen kezelve.

[IDE KERUL: `order.service.ts` 41-128 kodreszlet]

### 9.3 Helyszini vasarlas

A helyszini vasarlas funkcio az admin/dolgozoi felulet egyik domain-specifikus resze. Segitsegevel olyan rendeles is rogzithet, amely nem a nyilvanos webshop checkout folyamatabol indul, hanem szemelyes vagy telefonos ertekesites soran keletkezik.

[IDE KERUL: Helyszini vasarlas kepernyokep mentett vasarloval]

### 9.4 CSV termekimport

A termekkatalogus kezi feltoltese sok termek eseten idoigenyes lenne, ezert a rendszer tartalmaz CSV import lehetoseget. Az import soran a rendszer validalja a sorokat, jelzi a hibakat, majd a megfelelo adatokat menti.

[IDE KERUL: Admin CSV import kepernyokep]

### 9.5 PDF bizonylat

A PDF generalas celja, hogy a rendeleshez letoltheto bizonylat keszuljon. A dokumentum tartalmazza a vasarloi adatokat, a rendeles teteleit, az osszesitest es a fizetesi informaciokat.

[IDE KERUL: PDF bizonylat kepernyokep]

### 9.6 AI asszisztens

A vasarloi AI asszisztens nem altalanos csevego funkciokent keszult, hanem a webshop katalogusahoz es az epulettgepeszeti temakorhoz kapcsolodo segedkent. A rendszer celja, hogy relevans iranyt adjon, de ne tegyen bizonytalan vagy tulzottan konkret ajanlast akkor, ha nincs megfelelo katalogus-talalat.

[IDE KERUL: AI asszisztens kepernyokep]

[IDE KERUL: `chatbot-llm.service.ts` 31-88 vagy 214-250 kodreszlet]

## 10. Biztonsag

A biztonsagi modell alapja a Firebase Authentication es a Firestore szabalyok egyuttese. A kliensoldali felulet csak a felhasznaloi elmenyt es navigaciot kezeli, a kritikus adat-hozzaferesi dontesek adatbazis-szinten is ellenorzott szabalyokban jelennek meg.

[IDE KERUL: `firestore.rules` 25-76 kodreszlet]

A dolgozatban erdemes kulon kiterni arra, hogy a Firebase kliensoldali konfiguracio nem azonos egy titkos szerveroldali kulccsal, viszont a Firestore szabalyok megfelelo beallitasa nelkul visszaelesre adhatna lehetoseget. A projektben ezert kapott nagy szerepet a jogosultsagi es adatvalidacios szabalyok megirasa.

## 11. Teszteles es validacio

A teszteles ket szinten tortent: automata tesztekkel es kezi tesztjegyzokonyvvel. Az automata tesztek a kritikus logikai reszeket ellenorzik, mig a kezi teszteles a teljes felhasznaloi folyamatokat vizsgalja bongeszobol.

[IDE KERUL: GitHub Actions zold CI kepernyokep]

[IDE KERUL: manual test checklist eredmenyek tablazata]

## 12. Mesterseges intelligencia hasznalata

A fejlesztes soran mesterseges intelligencia eszkozok segitettek az otletelesben, hibaelemzesben, dokumentacios szerkezet kialakitasaban es egyes megoldasok ellenorzeseben. Az AI kimenete nem vegleges donteskent, hanem javaslatkent szerepelt a munkafolyamatban. A kod es a dolgozat vegleges tartalmaert a fejleszto felel, ezert a generalt javaslatokat futtatassal, tesztekkel, dokumentacio-ellenorzessel es sajat atnezessel kellett validalni.

Fontos elkuloniteni a fejlesztest tamogato AI-hasznalatot attol, hogy a rendszerben maga is mukodik egy AI asszisztens. A fejlesztoi AI-segitseg a keszites folyamataban jelent meg, mig a webshop AI asszisztense a felhasznaloknak nyujt katalogushoz kotott segitseget.

## 13. Osszefoglalas

A TDLWebshop fejlesztese soran egy olyan szakdolgozati MVP keszult, amely a vasarloi es adminisztratori folyamatokat egy rendszerben kezeli. A projekt legfontosabb eredmenye, hogy a webshop nem csak statikus termekkatalogus, hanem tartalmaz rendeleskezelest, jogosultsagi modellt, admin feluletet, CSV importot, PDF bizonylatot, keszletfigyelest es AI asszisztenst is.

[IDE KERUL: sajat zaro reflexio - mit tanultal, mi volt nehez, mit csinalnal maskent]

## Irodalomjegyzek javaslat

Minimum ezekre hivatkozz:
- Angular hivatalos dokumentacio
- Firebase Authentication dokumentacio
- Cloud Firestore dokumentacio
- Firebase Security Rules dokumentacio
- Cloudflare Workers dokumentacio
- OpenRouter dokumentacio
- jsPDF vagy a hasznalt PDF konyvtar dokumentacioja
- GitHub Actions dokumentacio
- 2-4 vizsgalt webshop vagy piaci pelda
