# Kepernyokepek ala irhato szovegek es vedesi jegyzetek

Ez a fajl abban segit, hogy a szakdolgozatba vagy mellekletbe tett screenshotok alatt kovetkezetes kepalairas szerepeljen, es szobeli kerdesnel is tudd roviden elmondani, mit bizonyit az adott kepernyo.

Hasznalat: a "Kepalairas" oszlopbol mehet a kep ala, a "Mit mondjak rola?" resz pedig szobeli magyarazathoz vagy 1-2 mondatos dolgozatszoveghez hasznalhato.

| ID | Javasolt fajlnev | Kepalairas | Mit mondjak rola? | Mit bizonyit? |
|---|---|---|---|---|
| S01 | `S01_kezdolap.png` | A TDL Webshop kezdolapja a fo navigacioval, kategoriakkal es kiemelt vasarloi belepesi pontokkal. | Ez az alkalmazas indulo kepernyoje. Innen indul a vasarloi flow: kereses, kategoriavalasztas, termeklista es AI segito is elerheto. | A projekt nem csak adatkezelo admin, hanem teljes vasarloi felulettel rendelkezo webshop. |
| S02 | `S02_kategoriak_lenyilo.png` | A kategoriak lenyilo menupontja, amely gyors navigaciot ad a termekcsoportokhoz. | A kategoriak az epületgepeszeti termekek kozotti gyors eligazodast tamogatjak. A megoldas csokkenti a keresesi idot, mert nem kell minden termeket vegigbongeszni. | Informacios architektura es navigacios logika. |
| S03 | `S03_termeklista.png` | A termeklista kepernyo kereses, szures, termekkartyak es kosarba helyezesi lehetoseggel. | Itt tortenik a legfontosabb vasarloi dontes-elokeszites. A termekkartyak egyszerre mutatjak az arat, kategoriat, keszletallapotot es a reszletekhez vezeto utat. | Termekkatalogus, kereshetoseg es vasarloi UX. |
| S04 | `S04_termekadatlap.png` | Egy termek reszletes adatlapja keppel, leirassal, keszletinformacioval es kosarba helyezessel. | A termekadatlap celja, hogy a vasarlo egy konkret termekrol eleg informaciot kapjon a donteshez. A kep, ar, keszlet es leiras egy helyen jelenik meg. | Termekreszletezes, galeria es kosarba helyezesi use case. |
| S05 | `S05_kosar.png` | A kosar kepernyo a kiválasztott termekekkel, mennyisegmodositassal es osszegzessel. | Ez a checkout elotti ellenorzesi pont. A vasarlo itt latja, mit valasztott, modosithatja a mennyiseget vagy torolhet tetelt. | Kosar-allapot, lokalis tarolas es rendelés elokeszitese. |
| S06 | `S06_checkout.png` | A checkout kepernyo szallitasi, szamlazasi, fizetesi es kuponadatok megadasaval. | Ez a fo vasarloi uzleti folyamat vege. Itt all ossze a rendelés objektum, amely a Firestore `orders` gyujtemenybe kerul. | Rendelésleadás, adatvalidacio, fizetesi/szallitasi adatok kezelese. |
| S07 | `S07_checkout_validacio.png` | Checkout validacios hibaallapot hibas vagy hianyos adatok eseten. | Ezt azert erdemes megmutatni, mert a rendszer nem csak sikeres esetet kezel. Hibas email, telefon vagy kotelezo mezo eseten visszajelzest ad a felhasznalonak. | Negativ teszteset, validacio es hibakezeles. |
| S08 | `S08_sikeres_rendeles.png` | Sikeres rendelés visszajelzo kepernyo rendelésazonositoval es tovabblepesi lehetoseggel. | Ez mutatja, hogy a checkout folyamat lezart allapotba jutott. A vasarlo egyertelmu visszajelzest kap, hogy a rendelese letrejott. | Sikeres user journey es rendelésmentes eredmenye. |
| S09 | `S09_profil_rendelesek.png` | A profil oldal, ahol a bejelentkezett vasarlo sajat adatait es korabbi rendelesait latja. | A profil oldal a regisztralt felhasznalohoz kotott rendeleskovetest mutatja. Itt latszik, hogy a rendszer nem csak vendeg rendelest kezel. | Auth-hoz kotott user adat, rendeléstörténet es sajat adatok. |
| S10 | `S10_kivansaglista.png` | A kivansaglista oldal a felhasznalo altal elmentett termekekkel. | A kivansaglista kenyelmi funkcio, amely a kesobbi vasarlasi dontest tamogatja. Bejelentkezett felhasznalonál a lista szemelyhez kototten kezelheto. | Felhasznaloi preferenciak es szemelyre szabott allapot. |
| S11 | `S11_admin_attekintes.png` | Az admin attekinto kepernyo statisztikai kartyakkal es belso modulokkal. | Ez az adminisztracios felulet kezdopontja. Innen latszik, hogy a projekt tartalmaz belso uzemeltetesi oldalt is, nem csak vasarloi webshopot. | Admin dashboard, szerepkorhoz kotott belso felulet. |
| S12 | `S12_admin_termekkezeles.png` | Admin termekkezelo kepernyo termekfelvitellel, szerkesztessel, kepfeltoltessel es CSV importtal. | Ezen a kepernyon latszik a katalogus karbantartasa. Fontos kiemelni, hogy kezi termekfelvitel, kepfeltoltes es tomeges CSV import is tamogatott. | Termek CRUD, importfolyamat, kepkezeles, admin jogosultsag. |
| S13 | `S13_admin_rendelesek.png` | Admin rendeleslista statuszvaltassal, rendelésreszletekkel es PDF bizonylat letoltessel. | Ez a kepernyo az admin rendeléskezelési use case bizonyiteka. A rendelesek allapota kezelheto, es a valtozas audit/keszlet logikahoz kapcsolodik. | Rendelésadminisztracio, statuszkezeles, PDF bizonylat. |
| S14 | `S14_helyszini_vasarlas.png` | Helyszini vasarlas rogzitese mentett vasarloval, termekkeresessel es tetelek osszegzesével. | Ez egy belso dolgozoi/admin folyamat. A cel, hogy a boltban vagy telefonon torteno vasarlast is ugyanabba az orders adatmodellbe lehessen rogziteni. | Offline/helyszini ertekesites, keszletcsokkentes, mentett vasarlo. |
| S15 | `S15_pdf_bizonylat.png` | A rendszer altal generalt PDF bizonylat a rendelés adataival es teteleivel. | A PDF azt mutatja, hogy a rendelésbol nyomtathato/letoltheto bizonylat keszul. Ez kulonosen a helyszini vasarlasnal fontos admin funkcio. | Rendelésadatokbol generalt dokumentum, bizonylatolasi folyamat. |
| S16 | `S16_ai_asszisztens.png` | Az AI asszisztens panel termekkatalogushoz kotott kerdes-valasz folyamattal. | Az AI funkcio nem altalanos chatbotkent mukodik, hanem a webshop termekkatalogusahoz es epületgepeszeti temajahoz kotott segitokent. | AI-asszisztens, kataloguskontextus, OpenRouter proxy architektura. |
| S17 | `S17_login_regisztracio.png` | Bejelentkezesi es regisztracios kepernyo Firebase Auth alapu fiokkezeléssel. | Ez a kepernyo mutatja, hogyan jut be a felhasznalo a szemelyhez kotott funkciokba, peldaul profil, rendeléstörténet vagy admin felulet. | Auth folyamat, bejelentkezes, regisztracio. |
| S18 | `S18_felhasznalok_jogosultsagok.png` | Admin felhasznalokezeles szerepkorokkal, dolgozoi jogosultsagokkal es tiltasi lehetoseggel. | Ezt a biztonsagi es uzemeltetesi fejezethez erdemes kotni. Itt latszik, hogy az admin, dolgozo es vasarlo szerepkorok elkulonulnek. | Role-based access, admin jogosultsagkezeles, felhasznaloi adminisztracio. |
| S19 | `S19_kapcsolat.png` | Kapcsolat oldal ceges elerhetosegekkel es uzenetkuldesi lehetoseggel. | Ez a vasarloi bizalmat es kapcsolatfelvetelt tamogatja. Nem a fo checkout flow resze, de egy teljes webshopnal elvart informacios oldal. | Kiegeszito vasarloi oldal, kapcsolatfelvetel, bizalom. |

## Ha a biro vagy konzulens rakerdez

### Mi alapjan valasztottad ezeket a kepernyokepeket?

Azert ezeket valasztottam, mert lefedik a projekt fo felhasznaloi retegeit: vasarloi bongeszes, checkout, profil, admin rendeléskezeles, termekkezeles, helyszini vasarlas, PDF bizonylat es AI asszisztens. Igy nem csak kulonallo kepernyok latszanak, hanem a teljes user journey es az admin oldali uzleti folyamat is kovetheto.

### Miert nincs minden apro allapotrol kulon kep?

A fo dolgozatszovegbe csak azokat a kepernyokepeket tettem, amelyekhez magyarazat es kovetelmeny/use case kapcsolodik. A tobbi allapot mellekletben vagy tesztjegyzokonyvben szerepelhet, mert a tul sok kep rontana a fo szoveg olvashatosagat.

### Mit bizonyit a pageflow es a screenshot egyutt?

A pageflow azt mutatja meg, hogyan lehet eljutni egyik kepernyorol a masikra, a screenshot pedig azt, hogy az adott kepernyo tenylegesen hogyan valosult meg. A ketto egyutt igazolja, hogy a tervezett navigacio es a megvalositott UI osszhangban van.

### Mire figyeljek a kepek beszurasakor?

- A kep alatt mindig legyen ID: peldaul `S14 - Helyszini vasarlas`.
- Ne csak azt ird, hogy "Admin felulet", hanem azt is, milyen use case-t bizonyit.
- Ha a kepen hibaallapot van, nevezd meg, milyen validacio vagy hibakezeles latszik.
- A fo szovegben kevesebb kep legyen, a tobbi menjen mellekletbe.
- A kepek sorrendje kovesse a pageflow-t: vasarloi flow, majd admin flow.

## Rovid mintamondatok a dolgozatba

- "Az S06 kepernyon lathato checkout folyamat a rendelés leadásához szükséges adatokat egy strukturált űrlapban gyűjti össze."
- "Az S13 admin rendeleslista a rendelési státuszok kezelését és a PDF bizonylat letöltését támogatja."
- "Az S14 helyszíni vásárlás képernyő a belső értékesítési folyamatot mutatja, amely ugyanabba az orders adatmodellbe ment, mint a webes checkout."
- "Az S18 felhasználókezelési képernyő a szerepköralapú hozzáférés gyakorlati adminisztrációját szemlélteti."
