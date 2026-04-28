# Kezi vegigtesztelesi checklist

Ezt a listat pipald vegig beadás vagy bemutato elott. Ha valami hibas, ird melle roviden, mit tapasztaltal.

## 1. Altalanos ellenorzes

- [ ] Az oldal betolt: https://tdlwebshop.web.app
- [ ] A logo megjelenik a fejlecben.
- [ ] A sotet/vilagos tema valto mukodik.
- [ ] Mobil nezetben nem csusznak egymasra a fo elemek.
- [ ] A fejlec menupontjai mukodnek: Kezdolap, Kategoriak, Termekek, Akciok, Ujdonsagok, Kapcsolat.
- [ ] A kategoriak legordulo menuje megnyilik es kattinthato.

## 2. Kezdolap

- [ ] A hero szekcio rendben jelenik meg.
- [ ] A hirek valtakozva megjelennek a nagy jobb oldali blokkban.
- [ ] A "Termekek megtekintese" gomb a termekoldalra visz.
- [ ] A kategoriak kartyai kattinthatok.
- [ ] A kiemelt termekek kartyai rendben latszanak.
- [ ] A "Reszletek" gomb lathato es mukodik.
- [ ] A sziv ikon a keszlet mellett van es mukodik.
- [ ] A hirlevel feliratkozas ervenyes emaillel sikeres uzenetet ad.
- [ ] Hibás emailnel a hirlevel feliratkozas hibat jelez.

## 3. Termeklista

- [ ] A termeklista oldal betolt.
- [ ] A bal oldali szuro panel latszik.
- [ ] Kategoria szures mukodik.
- [ ] Keszlet szerinti szures mukodik.
- [ ] Kereses mukodik.
- [ ] Akcios / top / uj termek szures mukodik, ha van ilyen termek.
- [ ] A termekkartyakon latszik: kep, nev, ar, keszlet, reszletek, kosar gomb.
- [ ] A "Reszletek" gomb megnyitja a termek modalt.
- [ ] A termek modal bezarhato.
- [ ] A "Kosarba" gomb mukodik keszleten levo termeknel.
- [ ] Keszlethianyos termeket nem lehet kosarba rakni.
- [ ] A sziv ikon hozzaadja/eltavolitja a termeket a kivansaglistabol.

## 4. Szereloi/profi csomagajanlo

- [ ] A csomagajanlo blokk megjelenik a termeklistan.
- [ ] A csomag fulek valthatok.
- [ ] A csomag mutatja az elerheto es hianyzo elemeket.
- [ ] A teljes csomag kosarba teheto, ha van elerheto termek.
- [ ] A kosarban a csomag termekei kulon tetelekent jelennek meg.

## 5. Kivansaglista

- [ ] A fejlecbol megnyithato a Kivansaglista oldal.
- [ ] A kivansaglistara tett termek megjelenik.
- [ ] A termek eltavolithato a kivansaglistarol.
- [ ] A kivansaglistabol termek kosarba teheto.
- [ ] Ures kivansaglista eseten ertheto ures allapot jelenik meg.

## 6. Kosar

- [ ] A kosar oldal betolt.
- [ ] A kosarban latszanak a termekek.
- [ ] Mennyiseg novelese mukodik.
- [ ] Mennyiseg csokkentese mukodik.
- [ ] Termek torlese mukodik.
- [ ] A vegosszeg frissul mennyisegvaltozas utan.
- [ ] A "Tovabb a penztarhoz" gomb a checkout oldalra visz.
- [ ] Ures kosar eseten ertheto ures allapot jelenik meg.

## 7. Checkout / rendeles leadas

- [ ] A checkout oldal betolt.
- [ ] Vendeg vasarlokent is kitoltheto.
- [ ] Kotelezo mezok hianya eseten hibat jelez.
- [ ] Email formatum hibajat jelzi.
- [ ] Iranyitoszam alapjan varos automatikusan kitoltodik, ha ismert.
- [ ] Szallitasi mod valaszthato.
- [ ] Fizetesi mod valaszthato.
- [ ] A bankkartyas opcio egyertelmuen bemutato jellegukent jelenik meg.
- [ ] Kuponkod ervenyes kodnal kedvezmenyt ad.
- [ ] Hibás kuponkodnal hibat jelez.
- [ ] Ceges vasarlas bekapcsolhato.
- [ ] Kulon szamlazasi cim bekapcsolhato.
- [ ] Sikeres rendeles utan a siker oldalra visz.

## 8. Sikeres rendeles oldal

- [ ] Megjelenik a rendeles osszegzese.
- [ ] Latszik a rendeles azonositoja.
- [ ] Latszik a fizetesi es szallitasi mod.
- [ ] Az email sablon gomb mukodik.
- [ ] A kosar sikeres rendeles utan kiurul.

## 9. Kapcsolat oldal

- [ ] A Kapcsolat menupont kulon oldalra visz.
- [ ] A telefon es email gombok megjelennek.
- [ ] A kapcsolat urlap mezoi kitolthetok.
- [ ] Ures vagy hibas adatoknal validacios hiba jelenik meg.
- [ ] Helyes adatoknal az email kuldeshez mail kliens nyilik meg.
- [ ] Mobil nezetben is hasznalhato az oldal.

## 10. Admin bejelentkezes

- [ ] Nem admin felhasznalo nem jut be az admin oldalra.
- [ ] Admin felhasznalo be tud lepni.
- [ ] Admin oldalon latszik az attekintes.
- [ ] A jobb oldali segedpanelek nem csusznak ossze.

## 11. Admin attekintes

- [ ] Latszanak a statisztikai kartyak.
- [ ] Latszik a beveteli/uzleti riport blokk.
- [ ] Latszanak a legutobbi rendelesek.
- [ ] Latszik az alacsony keszlet figyelo.
- [ ] Latszik az utanrendelesi javaslat, ha van adat.
- [ ] Latszik a hirek kezelesi blokk.
- [ ] Latszik a hirlevel feliratkozok blokk.

## 12. Admin termekkezeles

- [ ] Uj termek felveheto.
- [ ] Kategoria legordulo menuvel valaszthato.
- [ ] Termek szerkesztheto.
- [ ] Termek torolheto.
- [ ] CSV minta fajl letoltheto.
- [ ] CSV import mukodik helyes fajllal.
- [ ] Hibás CSV importnal ertheto hiba jelenik meg.

## 13. Admin keszlet

- [ ] Keszlet oldal betolt.
- [ ] Kategoria szuro mukodik.
- [ ] A keszlet osszegzo kartyak helyesnek tunnek.
- [ ] Az alacsony keszlet listaja megjelenik.
- [ ] Okos keszletfigyeles blokk megjelenik, ha van adat.
- [ ] CSV export letoltheto az utanrendelesi javaslatbol.

## 14. Admin rendelesek

- [ ] Rendelések listaja betolt.
- [ ] Rendelés reszletei megnyithatok.
- [ ] Státusz valtasa mukodik.
- [ ] Státuszvaltas utan az audit/naplo resz frissul.
- [ ] Szamla letoltese mukodik.
- [ ] Email sablon megnyithato.
- [ ] Helyszini vasarlas rogzitese mukodik.
- [ ] Helyszini vasarlas utan PDF letoltes elindul.

## 15. Admin felhasznalok

- [ ] Felhasznalok listaja betolt.
- [ ] User szerepkor valtas mukodik.
- [ ] User tiltasa/visszaengedese mukodik.
- [ ] Tiltott user nem fer hozza vedett funkciokhoz.

## 16. Firebase / adatbazis gyors ellenorzes

- [ ] Uj rendeles megjelenik a Firestore `orders` kollekcioban.
- [ ] Hirlevel feliratkozas megjelenik a `newsletterSubscribers` kollekcioban.
- [ ] Termekfeltoltes utan a `products` kollekcio frissul.
- [ ] Admin statuszvaltas utan a rendeles statusza frissul.
- [ ] Szamlaszam generalas utan az adott rendelesben megjelenik az invoice adat.

## 17. Vegso technikai ellenorzes

- [ ] `npm run build` sikeresen lefut.
- [ ] `npm test -- --watch=false` sikeresen lefut.
- [ ] GitHubon fent van a legfrissebb commit.
- [ ] Firebase Hostingon a legfrissebb verzio latszik.
- [ ] A dolgozatban szereplo kepernyokepek az aktualis oldalt mutatjak.

