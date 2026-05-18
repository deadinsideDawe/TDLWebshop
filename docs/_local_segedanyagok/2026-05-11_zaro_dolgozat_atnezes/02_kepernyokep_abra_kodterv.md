# Kepernyokep-, abra- es kodreszlet-terv

## Webshop kepernyokepek

| Sorszam | Kepernyokep | Hol keszuljon | Javasolt abrafelirat |
|---|---|---|---|
| 1 | Kezdolap dark mode, kategoria lenyiloval | Fooldal, kategoriak menu nyitva | A TDLWebshop kezdolapja sotet modban, lenyithato kategoria menuponttal |
| 2 | AI asszisztens mukodes kozben | Fooldal, AI ablak nyitva, egy relevans szakmai kerdes utan | A vasarloi AI asszisztens termekkatalogushoz kotott valaszadasa |
| 3 | Termeklista szures/kereses | Termekek oldal, keresessel vagy kategoria szurovel | Termeklista keresesi es szuresi funkciokkal |
| 4 | Termekadatlap | Egy konkret termek oldala | Termekadatlap kepgaleriaval, arral, keszlettel es kosarba helyezessel |
| 5 | Kosar tobb termekkel | Kosar oldal | A kosar oldal mennyisegmodositassal es osszegzessel |
| 6 | Checkout validacio | Checkout oldal, hibas email vagy telefonszam | Mezoszintu validacio a rendelesei folyamatban |
| 7 | Sikeres rendelesei folyamat | Checkout sikeres leadasa utan | Sikeres webes rendelesei folyamat visszajelzese |
| 8 | Profil es rendelestortenet | Bejelentkezett vasarlo profil oldala | Vasarloi profil rendelestortenettel es statuszkovetessel |
| 9 | Kivansaglista | Kivansaglista oldal | Kivansaglista mentett termekekkel |
| 10 | Admin attekintes | Admin fooldal | Adminisztratori attekinto felulet statisztikakkal |
| 11 | Termekkezeles es CSV import | Admin termekek ful | CSV-alapu tomeges termekimport az admin feluleten |
| 12 | Keszletfigyeles | Admin keszlet ful | Keszletfigyeles alacsony keszletu termekekkel |
| 13 | Helyszini vasarlas | Admin rendelesek/helyszini rogzites | Helyszini vasarlas mentett vasarlo kivalasztasaval |
| 14 | PDF szamla/bizonylat | General PDF megnyitva | A rendszer altal generalt PDF bizonylat elrendezese |
| 15 | Felhasznalo- es jogosultsagkezeles | Admin felhasznalok ful | Adminisztratori felhasznalo- es jogosultsagkezeles |
| 16 | GitHub Actions zold CI | GitHub Actions oldal | Sikeres CI futas a GitHub Actions feluleten |

## Beillesztendo diagramok

| Fajl | Dolgozati hely | Javasolt abrafelirat |
|---|---|---|
| `C:\Users\Dell\webshop\docs\02_architecture\diagram_kepek\01_use_case_attekintes.svg` | Kovetelmenyek/use case fejezet | A TDLWebshop fo felhasznaloi szerepkorei es funkcioi |
| `C:\Users\Dell\webshop\docs\02_architecture\diagram_kepek\02_komponens_architektura.svg` | Architektura fejezet | A rendszer komponens-szintu felepitese |
| `C:\Users\Dell\webshop\docs\02_architecture\diagram_kepek\03_adatmodell.svg` | Adatmodell fejezet | A TDLWebshop fo adatentitasai es kapcsolatai |
| `C:\Users\Dell\webshop\docs\02_architecture\diagram_kepek\04_checkout_szekvencia.svg` | Megvalositas/checkout fejezet | A checkout folyamat egyszerusitett szekvenciaja |
| `C:\Users\Dell\webshop\docs\02_architecture\diagram_kepek\05_biztonsagi_attekintes.svg` | Biztonsag fejezet | A jogosultsag- es adatvedelmi reteg attekintese |

Ha valamelyik SVG nem illesztheto be szepen Wordbe, erdemes PNG-ve exportalni, majd ugy beilleszteni.

## Javasolt kodreszletek

Nem kell minden kodot beilleszteni. A dolgozatban 4-6 rovid, jol magyarazott reszlet eleg. A hosszu kodlistak helyett a lenyeges dontesi pontokat mutasd meg.

| Fajl es sor | Mit bizonyit | Hol hasznald |
|---|---|---|
| `C:\Users\Dell\webshop\src\pages\checkout\checkout.ts` 367-555 | Rendelesei folyamat veglegesitese, kosar, kupon, rendelesadatok | Checkout megvalositas |
| `C:\Users\Dell\webshop\src\pages\checkout\checkout.ts` 580-637 | Email/telefon/mezovalidacio | GUI/UX es validacio |
| `C:\Users\Dell\webshop\src\app\services\order.service.ts` 41-128 | Statusz, audit es keszlet tranzakcios kezelese | Rendeleskezeles, adatkonzisztencia |
| `C:\Users\Dell\webshop\src\app\services\order.service.ts` 229-272 | Helyszini vasarlas tranzakcios mentese | Admin/helyszini ertekesites |
| `C:\Users\Dell\webshop\src\app\services\order.service.ts` 276-310 | Szamlaszam generalasi logika | PDF/szamla folyamat |
| `C:\Users\Dell\webshop\src\app\services\invoice.service.ts` 8-183 | PDF bizonylat felepitese es elrendezese | PDF generalas |
| `C:\Users\Dell\webshop\firestore.rules` 25-76 | Aktiv felhasznalo, admin, dolgozo jogosultsag, validacio | Biztonsag |
| `C:\Users\Dell\webshop\firestore.rules` 288-356 | Termekek, rendelesek, felhasznalok es audit szabalyok | Firestore jogosultsagi modell |
| `C:\Users\Dell\webshop\src\pages\admin\admin.ts` 606-735 | Admin/dolgozoi jogosultsagok es UI-hozzaferes | Admin jogosultsagkezeles |
| `C:\Users\Dell\webshop\src\pages\admin\admin.ts` 1183-1258 | CSV import validacio es mentese | Tomeges termekfeltoltes |
| `C:\Users\Dell\webshop\src\pages\admin\admin.ts` 2341-2501 | Helyszini vasarlas adatai es mentese | Admin rendelesrogzites |
| `C:\Users\Dell\webshop\src\pages\admin\admin.ts` 2827-3042 | Profilok es jogosultsagok kezelese | Felhasznalokezeles |
| `C:\Users\Dell\webshop\src\app\services\chatbot-llm.service.ts` 31-88 | AI asszisztens modellje, kataloguslogika, valaszfolyam | AI asszisztens |
| `C:\Users\Dell\webshop\src\app\services\chatbot-llm.service.ts` 92-120 | Termekkatalogus pontozas es talalatkereses | AI termekajanlas korlatai |
| `C:\Users\Dell\webshop\src\app\services\chatbot-llm.service.ts` 214-250 | Nem relevans kerdesek es szakmai fallback kezelese | AI biztonsag es UX |
| `C:\Users\Dell\webshop\workers\openrouter-proxy\src\index.js` 1-59 | Szerveroldali kulcskezeles, CORS, kornyezeti valtozok | OpenRouter proxy |
| `C:\Users\Dell\webshop\workers\openrouter-proxy\src\index.js` 153-211 | OpenRouter keres osszeallitasa es hibaagak | AI backend integracio |

## Kepernyokep-keszitesi szabalyok

- Minden kep legyen eles, olvashato es teljes ablakos.
- A dolgozatban minden kep alatt legyen abrafelirat.
- Ne legyen rajta valodi API kulcs, jelszo vagy szemelyes adat.
- Admin kepernyoknel hasznalj demo adatokat.
- Ha egy kep tul nagy, vagd ugy, hogy a lenyegi resz maradjon lathato.
