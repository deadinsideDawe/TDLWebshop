# TDL Webshop - Vegso Manualis Ellenorzes

## 1. Auth es szerepkor
- Regisztracio mukodik uj userrel.
- Bejelentkezes utan fejlécben megjelenik az email.
- Admin emaillel megjelenik az admin belepes.
- Kilepes utan vedett admin oldal nem erheto el.

## 2. Termekek es kosar
- `/products` oldal betolt, szuresek mukodnek.
- Kategoria kattintas query parammal szurt listat ad.
- `Reszletek` gomb a `/products/:id` oldalra visz.
- Keszleten levo termek kosarba teheto.
- Nincs keszleten termeknel a kosar gomb tiltott.

## 3. Checkout (webes)
- Irányítószám alapjan auto varos kitoltes megy.
- Ceges/szereloi opcio adoszammal mentheto.
- Kuponkod ervenyes es ervenytelen eset kezelve.
- Rendeles mentodik Firestore `orders` kollekcioba.
- Bejelentkezett usernel a rendeles megjelenik `/my-orders` oldalon.

## 4. Helyszini vasarlas (admin)
- Mentett vasarlo/ceg profil kivalaszthato.
- Uj vasarlo/ceg profil mentheto es visszatolt.
- Tetel hozzaadas mennyiseg ellenorzessel megy.
- Mentes utan keszlet azonnal csokken.
- Webes oldalon friss keszlet latszik.

## 5. Szamla/PDF
- Admin rendeleskartyan `Szamla letoltese` gomb mukodik.
- Szamlaszam generalodik (`INV-YYYY-XXXX`) es rendeleshez mentodik.
- PDF-ben latszik: kiallito nev/cim/adoszam, vevo adatok, rendeles azonosito, tetelek, osszesito.
- Ujra letoltesnel ugyanaz a szamlaszam marad.

## 6. Firestore szabalyok
- `orders`: user csak sajat rendelest olvas, admin mindent.
- `customerProfiles`: admin mindent, user sajat profil, guest write szabaly mukodik.
- `invoiceCounters`: admin kezelheti.

## 7. Build es futas
- `npm run build` sikeres.
- `ng serve` alatt oldalak betoltenek.
- Konzolban nincs kritikus runtime hiba.
