# TDL Webshop - vegso manualis ellenorzes

## 1. Auth es szerepkor
- Regisztracio mukodik uj felhasznaloval.
- Bejelentkezes utan a fejlecben megjelenik az email.
- Admin felhasznaloval megjelenik az admin belepes.
- Role alapu admin jogosultsaggal is elerheto az admin felulet.
- Tiltott felhasznalo nem tud vedett adatot irni vagy olvasni.
- Kilepes utan vedett admin oldal nem erheto el.

## 2. Termekek es kosar
- `/products` oldal betolt, szuresek mukodnek.
- Kategoria kattintas query parammal szurt listat ad.
- `Reszletek` gomb a `/products/:id` oldalra visz.
- Keszleten levo termek kosarba teheto.
- Nincs keszleten termeknel a kosar gomb tiltott.
- Ugyanaz a Firestore termek nem duplikalodik instabil kosarazonosito miatt.

## 3. Szereloi/profi csomagajanlo
- A termeklistan megjelenik a szereloi/profi mod.
- Futes, viz, szellozes es hutes/klima csomag valaszthato.
- A csomag a meglovo termekekbol all ossze.
- Hianyzo csomagelem eseten a felulet jelzi a hianyt.
- `Teljes csomag kosarba` gomb a megfelelo mennyisegekkel teszi kosarba a tetelekeket.

## 4. Checkout (webes)
- Iranyitoszam alapjan automatikus varoskitoltes megy.
- Ceges/szereloi opcio adoszammal mentheto.
- Kuponkod ervenyes es ervenytelen esetet is kezel.
- Rendeles mentodik Firestore `orders` kollekcioba.
- Bejelentkezett usernel a rendeles a profil oldalon megjelenik.
- Sikeres rendeles utan email sablon elerheto Functions nelkul.

## 5. Admin termekkezeles
- Egyedi termek rogzitese mukodik.
- Kategoria legordulo listabol valaszthato.
- CSV csoportos import elonezetet es hibakat mutat.
- CSV minta letoltheto.
- SKU alapu frissites/import mod mukodik.

## 6. Keszlet es okos keszletfigyeles
- Keszlet nezetben kategoria szerint szurheto a lista.
- Szabad es foglalt keszlet kulon latszik.
- Alacsony keszlet jelzes megjelenik.
- Okos keszletfigyeles 30 napos teljesitett rendeleseibol szamol.
- Utanrendelesi javaslat prioritas szerint rendezett.
- Utanrendelesi CSV export letoltheto.

## 7. Rendeleskezeles es helyszini vasarlas
- Admin rendeleskartyan `Szamla letoltese` gomb mukodik.
- Admin rendeleskartyan `Email sablon` gomb mukodik.
- Statuszvaltas auditot ir.
- Teljesites/lemondas eseten a keszlet tranzakcioban korrigalodik.
- Mentett vasarlo/ceg profil kivalaszthato.
- Uj vasarlo/ceg profil mentheto es visszatolt.
- Tetel hozzaadas mennyiseg ellenorzessel megy.
- Helyszini vasarlas mentese utan keszlet azonnal csokken.

## 8. Szamla/PDF
- Szamlaszam generalodik (`INV-YYYY-XXXX`) es rendeleshez mentodik.
- PDF-ben latszik: kiallito nev/cim/adoszam, vevo adatok, rendeles azonosito, tetelek, osszesito.
- Ujra letoltesnel ugyanaz a szamlaszam marad.
- Demo szamlazasnal egyertelmu, hogy eles NAV-kompatibilis szamlazo kulon integracio lenne.

## 9. Firestore szabalyok
- `orders`: user csak sajat rendelest olvas, admin mindent.
- `customerProfiles`: admin mindent, user sajat profil, guest write szabaly mukodik.
- `invoiceCounters`: csak admin kezelheti.
- `clientLogs`: csak aktiv bejelentkezett user irhat, admin olvashat.
- `/mail` queue nincs hasznalatban Spark csomagon.

## 10. Spark deploy es futas
- `npm run build` sikeres.
- `npm test -- --watch=false` sikeres.
- `npm run deploy:spark` csak build + hosting deployt futtat.
- Firestore szabaly modositasakor `npm run deploy:rules` kulon futtathato.
- Cloud Functions deploy nincs bekotve az alap projektbe.
- Konzolban nincs kritikus runtime hiba.
