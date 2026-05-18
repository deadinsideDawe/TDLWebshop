# Use case-ek reszletes kidolgozasa

Javasolt hely a dolgozatban: **3.1. Fo use case-ek**

Javasolt bevezeto szoveg:

A rendszer kovetelmenyeinek ellenorzesehez a fo felhasznaloi es adminisztratori folyamatokat use case-ek formaban foglaltam ossze. A use case-ek segitenek megmutatni, hogy a TDLWebshop nem kulonallo kepernyokbol all, hanem egymasra epulo vasarloi, adminisztratori es dolgozoi folyamatokat valosit meg. A legfontosabb szereplok a vasarlo, az adminisztrator, a dolgozo, valamint kulso szolgaltataskent a Firebase/Firestore es az OpenRouter AI modell.

## 4. tablazat - Use case-ek rovid osszefoglalasa

| Use case | Nev | Leiras |
|---|---|---|
| UC1 | Vasarlo termeket keres es kosarba teszi | A vasarlo kategoriat valaszt vagy keresoszot ad meg, megnyitja a termeket, majd kosarba helyezi. |
| UC2 | Vasarlo rendelest ad le | A vasarlo kitolti a checkout urlapot, a rendszer validal, majd letrehozza a rendelest. |
| UC3 | Admin teljesiti a rendelest | Az admin megnyitja a rendelest, ellenorzi az adatokat, statuszt modosit, a rendszer auditot es keszletvaltozast rogzit. |
| UC4 | Admin helyszini vasarlast rogzit | Az admin mentett vasarlot valaszt vagy uj adatot ad meg, tetelt ad a vasarlashoz, majd PDF bizonylatot general. |
| UC5 | Dolgozo termeket kezel | A dolgozo a szamara engedelyezett admin funkciokkal termeket tolthet fel es keszletet ellenorizhet. |
| UC6 | Felhasznalo AI asszisztenst hasznal | A felhasznalo katalogushoz vagy epuletegepeszethez kapcsolodo kerdest tesz fel, a rendszer korlatozott valaszt ad. |

## UC1 - Vasarlo termeket keres es kosarba teszi

**Cel:** A vasarlo megtalalja a szamara megfelelo termeket, es azt a kosarba helyezi.

**Elsodleges szereplo:** Vasarlo.

**Előfeltetel:** A termekek elerhetok az adatbazisban, a webshop kezdolapja vagy termeklista oldala betoltott.

**Fo folyamat:**

1. A vasarlo megnyitja a webshopot.
2. A vasarlo kategoriat valaszt vagy keresoszot ir be.
3. A rendszer megjeleniti a talalatokat.
4. A vasarlo megnyit egy termeket vagy kozvetlenul a kosarba helyezi.
5. A rendszer frissiti a kosar tartalmat.

**Alternativ folyamat:** Ha nincs talalat, a rendszer ures allapotot jelenit meg, es a vasarlo uj keresest indithat.

**Utófeltetel:** A termek bekerul a kosarba, a kosar osszege es darabszama frissul.

**Bizonyitek a rendszerben:** Termeklista oldal, termekadatlap, `CartService`.

## UC2 - Vasarlo rendelest ad le

**Cel:** A vasarlo a kosar tartalmat rendelesse alakitja.

**Elsodleges szereplo:** Vasarlo vagy vendeg vasarlo.

**Előfeltetel:** A kosarban legalabb egy termek szerepel.

**Fo folyamat:**

1. A vasarlo megnyitja a checkout oldalt.
2. A rendszer megjeleniti a rendelesi urlapot es az osszegzest.
3. A vasarlo megadja a szallitasi, szamlazasi es elerhetosegi adatokat.
4. A rendszer ellenorzi a kotelezo mezoket, az e-mailt es a telefonszamot.
5. Sikeres validacio utan a rendszer letrehozza a rendelest.
6. A vasarlo visszajelzest kap a sikeres rendelesrol.

**Alternativ folyamat:** Hibas vagy hianyos adat eseten a rendszer jelzi a hibat, es nem engedi tovabb a rendelest.

**Utófeltetel:** Letrejon a rendeles, amely az admin feluleten is megjelenik.

**Bizonyitek a rendszerben:** Checkout oldal, `checkout.ts`, `OrderService`, Firestore `orders` collection.

## UC3 - Admin teljesiti a rendelest

**Cel:** Az adminisztrator feldolgozza es teljesitett allapotba allitja a rendelest.

**Elsodleges szereplo:** Adminisztrator.

**Előfeltetel:** Az admin be van jelentkezve, es rendelkezik rendeléskezelési jogosultsaggal.

**Fo folyamat:**

1. Az admin megnyitja az admin rendeléslistat.
2. Kivalaszt egy aktiv rendelest.
3. Ellenorzi a vasarlo adatait, a tetelek listajat es a fizetesi adatokat.
4. A rendelest teljesitett allapotba allitja.
5. A rendszer audit bejegyzest keszit.
6. A rendszer frissiti a termekek keszletet.

**Alternativ folyamat:** Ha a keszlet nem elegendo, a folyamatnak hibaval kell megallnia, vagy MVP-korlátkent dokumentalni kell a gyengebb keszletellenorzest.

**Utófeltetel:** A rendeles allapota frissul, az audit naplo es a keszletvaltozas rogzul.

**Bizonyitek a rendszerben:** Admin rendeléslista, `order.service.ts`, `orderStatusAudit`, Firestore rules.

## UC4 - Admin helyszini vasarlast rogzit

**Cel:** Az admin a szemelyesen vagy helyszinen torteno vasarlast is rogzithet, majd bizonylatot generalhat.

**Elsodleges szereplo:** Adminisztrator.

**Előfeltetel:** Az admin be van jelentkezve, a termekek es mentett vasarlok elerhetok.

**Fo folyamat:**

1. Az admin megnyitja a helyszini vasarlas rogzitese reszt.
2. Mentett vasarlot valaszt, vagy uj vasarloi adatokat ad meg.
3. Termeket keres es tetelt ad a vasarlashoz.
4. A rendszer szamolja a vegosszeget.
5. Az admin menti a helyszini vasarlast.
6. A rendszer rendelest es PDF bizonylatot hoz letre.

**Alternativ folyamat:** Ha a vasarlo tiltott, a rendszer jelzi, hogy a vasarlas nem rogzithető.

**Utófeltetel:** A helyszini rendeles megjelenik az admin rendelesei kozott, es letoltheto a PDF bizonylat.

**Bizonyitek a rendszerben:** Admin helyszini vasarlas panel, mentett vasarlok, PDF szamla/bizonylat.

## UC5 - Dolgozo termeket kezel

**Cel:** A dolgozo korlatozott adminisztracios feluleten kezelheti a ra bizott feladatokat.

**Elsodleges szereplo:** Dolgozo.

**Előfeltetel:** A dolgozo be van jelentkezve, es employee szerepkorrel rendelkezik.

**Fo folyamat:**

1. A dolgozo belep az admin feluletre.
2. A rendszer csak az engedelyezett funkciokat jeleniti meg.
3. A dolgozo termeket tolthet fel vagy modosit.
4. A dolgozo megtekintheti a keszletinformaciokat.
5. A rendszer megtagadja a nem engedelyezett admin muveleteket.

**Alternativ folyamat:** Ha a dolgozo olyan muveletet probal elerni, amelyhez nincs jogosultsaga, a rendszer nem engedi a muveletet.

**Utófeltetel:** A dolgozo csak a szerepkorehez tartozo adatokhoz es funkciokhoz fer hozza.

**Bizonyitek a rendszerben:** Admin jogosultsagi logika, Firestore rules, dolgozoi szerepkor.

## UC6 - Felhasznalo AI asszisztenst hasznal

**Cel:** A felhasznalo rovid szakmai vagy termekkatalogushoz kapcsolodo segitseget kap.

**Elsodleges szereplo:** Felhasznalo.

**Kulső szereplo:** Cloudflare Worker, OpenRouter.

**Előfeltetel:** Az AI asszisztens elerheto, az OpenRouter API kulcs szerveroldalon van kezelve.

**Fo folyamat:**

1. A felhasznalo megnyitja az AI asszisztenst.
2. Kerdest ir be epuletegepeszeti vagy termekkatalogushoz kapcsolodo temaban.
3. A frontend osszeallitja a kontextust.
4. A keres a Cloudflare Worker proxyhoz kerul.
5. A Worker szerveroldalon hivja az OpenRouter modellt.
6. A valasz visszakerul a feluletre.

**Alternativ folyamat:** Nem relevans kerdes eseten az asszisztens jelzi, hogy csak TDLWebshop termekekkel, rendelesevel vagy epuletegepeszeti temakkal kapcsolatban tud segiteni.

**Utófeltetel:** A felhasznalo valaszt kap, de a rendszer nem helyettesiti a szakemberrel torteno egyeztetest.

**Bizonyitek a rendszerben:** AI asszisztens felulet, `chatbot-llm.service.ts`, `workers/openrouter-proxy/src/index.js`.

## Javasolt szoveg a use case abra ele

A use case abra a rendszer fo szereploit es a hozzajuk tartozo legfontosabb funkciokat mutatja be. A vasarloi oldal a termekkeresesre, kosarkezelesre, rendelesleadasra, profilra es AI asszisztensre epul. Az adminisztratori oldal a rendelesek, termekek, keszlet, felhasznalok es helyszini vasarlas kezeleset fogja ossze. A dolgozoi szerepkor az adminhoz kepest szukebb jogosultsaggal rendelkezik.

Javasolt abrafelirat:

**3.1. abra: A TDLWebshop fo use case-ei es szereploi**
