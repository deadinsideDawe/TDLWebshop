# TDL Webshop - regresszios ellenorzolista

Ez a lista a szakdolgozati bemutato elotti gyors, kezi ellenorzeshez keszult. A cel az, hogy a fontosabb vasarloi, admin es Spark-kompatibilis folyamatok vegig legyenek kattintva.

## 1. Nyito oldal es navigacio
- [ ] A fooldal betolt, a hero blokk es a kategoriak latszanak.
- [ ] A felso kereso mukodik.
- [ ] A kategoria gombok a megfelelo termeklistara visznek.
- [ ] A light/dark mod valtas mukodik.
- [ ] Mobil nezetben nincs kilogo vagy egymasra csuszo szoveg.

## 2. Termeklista es termekreszletek
- [ ] A `/products` oldal betolt termekeket.
- [ ] Kategoria szures legalabb ket kategoriaval mukodik.
- [ ] Ar es keszlet szures mukodik.
- [ ] Termekreszletek oldal megnyilik.
- [ ] Keszleten levo termek kosarba teheto.
- [ ] Nincs keszleten termeknel a kosar gomb tiltott.

## 3. Szereloi/profi csomagajanlo
- [ ] A szereloi/profi mod megjelenik a termeklistan.
- [ ] Futes, viz, szellozes es hutes/klima csomag valaszthato.
- [ ] A csomag tetelei termekekhez kapcsolodnak.
- [ ] Hianyzo csomagelem eseten a felulet jelzi a hianyt.
- [ ] `Teljes csomag kosarba` gomb a megfelelo mennyisegekkel adja hozza a tetelekeket.

## 4. Kosar es checkout
- [ ] Kosarba rakt termek megjelenik a kosar oldalon.
- [ ] Mennyiseg modositas es tetel torles mukodik.
- [ ] Checkout oldalon kotelezo mezok validacioja mukodik.
- [ ] Iranyitoszam alapjan a varos automatikusan kitoltheto.
- [ ] Szemelyes atvetel valaszthato, idopont megadhato.
- [ ] Ceges/szereloi vasarlas adoszammal mentheto.
- [ ] Ervenyes es ervenytelen kuponkod kezelese mukodik.

## 5. Rendeles leadasa
- [ ] Rendeles mentodik Firestore `orders` kollekcioba.
- [ ] Sikeres rendeles utan a kosar kiurul.
- [ ] Sikeres rendeles oldalon megjelenik az osszegzes.
- [ ] Email sablon megnyithato Spark csomagon, Functions nelkul.
- [ ] Bejelentkezett usernel a rendeles a profil oldalon megjelenik.

## 6. Admin hozzaferes
- [ ] Nem admin user nem eri el az admin oldalt.
- [ ] Admin userrel az admin attekintes betolt.
- [ ] Vezetoi riport mutat osszes bevetelt, havi bevetelt es atlagos kosarerteket.
- [ ] Top termek lista teljesitett rendelesekbol szamol.
- [ ] Role alapu admin user is bejut, nem csak hardcoded email.
- [ ] Tiltott felhasznalo nem tud vedett adatot kezelni.

## 7. Admin termekkezeles
- [ ] Uj termek rogzitese mukodik.
- [ ] Kategoria legordulo listabol valaszthato.
- [ ] Termek szerkesztese mukodik.
- [ ] CSV minta letoltheto.
- [ ] CSV import elonezetet es hibakat mutat.
- [ ] SKU alapu frissites/import mod mukodik.

## 8. Keszletkezeles
- [ ] Keszlet nezetben szabad es foglalt keszlet latszik.
- [ ] Kategoria szerinti keszletszures mukodik.
- [ ] Alacsony keszlet jelzes megjelenik.
- [ ] Okos keszletfigyeles utanrendelesi javaslatot ad.
- [ ] Utanrendelesi CSV export letoltheto.
- [ ] Webes oldalon a friss keszlet latszik.

## 9. Rendeleskezeles es helyszini vasarlas
- [ ] Rendelestipus szerinti tabok mukodnek: aktiv, teljesitett, helyszini.
- [ ] Rendeles statusz modositas mukodik.
- [ ] Statuszvaltas utan audit es keszlet konzisztens.
- [ ] Rendeles reszletei modal megnyilik.
- [ ] Admin rendeleskartyan `Szamla letoltese` mukodik.
- [ ] Admin rendeleskartyan `Email sablon` mukodik.
- [ ] Helyszini vasarlasnal mentett vasarlo/ceg profil kivalaszthato.
- [ ] Helyszini tetel hozzaadas mennyiseg ellenorzessel mukodik.
- [ ] Helyszini vasarlas mentese utan keszlet csokken.

## 10. Szamla/PDF
- [ ] Szamlaszam generalodik `INV-YYYY-XXXX` formatumban.
- [ ] Ujra letoltesnel ugyanaz a szamlaszam marad.
- [ ] PDF-ben latszik a vevo, rendeles, tetelek es osszesito.
- [ ] Bemutaton elhangzik: ez demo/PDF bizonylat, eles NAV-kompatibilis integracio tovabbfejlesztes.

## 11. Firestore es Spark deploy
- [ ] `npm run build` sikeres.
- [ ] `npm test -- --watch=false` sikeres.
- [ ] `npm run deploy:spark` csak build + hosting deployt futtat.
- [ ] Firestore szabaly modositasakor `npm run deploy:rules` kulon futtathato.
- [ ] Functions deploy nincs bekotve az alap projektbe.
- [ ] Hosting URL mukodik: https://tdlwebshop.web.app

## Eredmeny osszegzes
- Teszt datum:
- Tesztelo:
- Talalt hibak:
- Javitas utan ujratesztelve: Igen / Nem
