# TDLWebshop abra- es kodkepernyokep-terv

Ez a fajl a szakdolgozat szoveges reszehez keszult munkaterv. A cel az, hogy a dolgozatban ne csak leiras legyen, hanem minden fontos allitast kepernyokep, abra vagy kodreszlet tamasszon ala.

## Webshop-kepernyokepek

Az alabbi kepernyokepeket erdemes a szakdolgozat megfelelo fejezeteibe beilleszteni.

| Fejezet | Kepernyokep | Hol keszuljon? | Mit bizonyit? |
| --- | --- | --- | --- |
| Bevezetes / MVP | Kezdolap dark modban, nyitott kategoria lenyiloval | Kezdolap | Modern, termekszeru webshop nyitoelmeny, liquid glass jellegu navigacio |
| Bevezetes / AI funkcio | Kezdolap AI asszisztenssel | Kezdolap, AI ablak nyitva | A sajat termekkatalogushoz kotott AI segito mukodese |
| Felhasznaloi folyamatok | Termeklista keresessel es kategoriaval | Termekek oldal | Termekbongeszes, kereses, szures |
| Felhasznaloi folyamatok | Termekadatlap | Egy konkret termek oldala | Termekreszletek, ar, keszlet, kosarba helyezes |
| Felhasznaloi folyamatok | Kosar tobb termekkel | Kosar oldal | Mennyisegmodositas, vegosszeg, tovabblepes |
| Checkout | Checkout validacio hibas emaillel vagy telefonszammal | Checkout oldal | Mezoszintu hibakezeles |
| Checkout | Sikeres rendeles visszajelzese | Checkout sikeres leadasa utan | Rendeles letrejotte es felhasznaloi visszajelzes |
| Profil | Profil es rendeleskovetes | Profil oldal | Korabbi rendelesek es statusz kovetese |
| Profil | Kivansaglista | Kivansaglista oldal | Kedvenc termekek kezelese |
| Admin | Admin attekintes | Admin oldal attekintes ful | Vezetoi/admin dashboard |
| Admin | Termekkezeles es CSV import | Admin termekek ful | Tomeges termekfeltoltes es validacio |
| Admin | Keszletfigyeles | Admin keszlet ful | Alacsony keszlet, keszletallapot |
| Admin | Helyszini vasarlas mentett vasarloval | Admin rendelesek / helyszini vasarlas | B2B/helyszini eladasi folyamat |
| Admin | PDF szamla vagy bizonylat | Generalas utan PDF megnyitva | Szamla/bizonylat workflow |
| Admin | Felhasznalo- es jogosultsagkezeles | Admin felhasznalok ful | Admin/dolgozo/vasarlo szerepkorok |
| Reprodukcio | GitHub Actions zold CI | GitHub Actions oldal | Build es teszt reprodukalhatosaga |

## Kodkepernyokep-helyek

A dolgozatban a kodkepernyokepeket rovid magyarazo bekezdes utan erdemes elhelyezni. A sorok a jelenlegi projektallapothoz igazodnak, beadaskor egy utolso gyors ellenorzest meg kell csinalni.

| Fejezet | Fajl | Sorok | Mit mutasson? |
| --- | --- | --- | --- |
| Checkout megvalositas | `src/pages/checkout/checkout.ts` | 367-555 | Rendeles veglegesitese, validacio utani mentes, kupon es osszegzes kezelese |
| Checkout validacio | `src/pages/checkout/checkout.ts` | 580-635 | Email, telefon es kotelezo mezok ellenorzese |
| Rendelestortenet es keszlet | `src/app/services/order.service.ts` | 41-127 | Statuszvaltas, audit bejegyzes es keszletmodositas tranzakcioban |
| Helyszini vasarlas | `src/app/services/order.service.ts` | 222-267 | Helyszini rendeles mentesi tranzakcio |
| Szamlazas | `src/app/services/order.service.ts` | 269-302 | Szamlaszam generalas logikaja |
| PDF szamla | `src/app/services/invoice.service.ts` | 9-154 | PDF szamla/bizonylat felepitese es elrendezese |
| Biztonsagi szabalyok | `firestore.rules` | 25-76 | Aktiv felhasznalo, admin es dolgozo jogosultsagok |
| Biztonsagi szabalyok | `firestore.rules` | 294-361 | Products, orders, users, savedCustomers, audit es clientLogs szabalyok |
| Admin jogosultsag | `src/pages/admin/admin.ts` | 607-748 | Admin/dolgozoi jogosultsagok es fizetesi hatarido jovahagyas |
| CSV import | `src/pages/admin/admin.ts` | 1181-1257 | CSV import validacio es mentheto sorok kezelese |
| Helyszini rendeles | `src/pages/admin/admin.ts` | 2334-2545 | Mentett vasarlo, termekkereses es helyszini vasarlas rogzitese |
| Profilkezeles | `src/pages/admin/admin.ts` | 2986-3077 | Profil letrehozas, szerepkor es jogosultsag beallitas |
| Bejelentkezes es szerepkor | `src/app/services/auth.service.ts` | 43-75, 98-142 | Tiltott felhasznalo es admin/dolgozoi belepes kezelese |
| AI asszisztens | `src/app/services/chatbot-llm.service.ts` | 26-90, 211-236 | Domain-szures, katalogushoz kotott ajanlas, kapcsolatfelveteli figyelmeztetes |
| AI proxy | `workers/openrouter-proxy/src/index.js` | 82-197 | OpenRouter proxy, szerveroldali kulcskezeles es rendszerprompt |

## Beillesztesi javaslat a szakdolgozatba

A kodreszleteket ne onmagukban tedd be, hanem mindig valaszoljanak egy kerdesre. Peldaul:

> A rendeles statuszvaltasanal fontos volt, hogy a rendeles adatai, az audit bejegyzes es a keszletmodositas ne valjanak szet. Ide a `src/app/services/order.service.ts` 41-127. sorarol keruljon kodkepernyokep.

> Az AI asszisztensnel tudatos korlat, hogy nem talalhat ki nem letezo termeket. Ide a `src/app/services/chatbot-llm.service.ts` 26-90. es 211-236. sorarol keruljon kodkepernyokep.

## Utolso ellenorzes beadaskor

- A sorok szamat a vegleges commit utan meg egyszer ellenorizd.
- A kepernyokepeken ne latszodjon API kulcs, jelszo, token vagy szemelyes adat.
- A GitHub Actions kepernyokepen a legfrissebb `main` branch zold CI run latszodjon.
- A PDF szamla kepernyokepen tesztadat szerepeljen, ne valos vasarloi adat.
