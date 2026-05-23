# M1. Kézi tesztjegyzőkönyv

Projekt: TDL Webshop  
Tesztelt verzió: Firebase Hostingon elérhető végleges beadásközeli változat  
Tesztelt oldal: https://tdlwebshop.web.app  
Tesztelés ideje: 2026. 05. 22.  
Tesztelő: Tóth Dávid László  
Böngésző: Google Chrome / Microsoft Edge, asztali nézet  
Megjegyzés: a tesztelés célja nem teljes körű hibamentességi bizonyítás volt, hanem a szakdolgozatban bemutatott fő vásárlói és adminisztrátori folyamatok kézi ellenőrzése.

## Tesztkörnyezet

| Terület | Érték |
|---|---|
| Frontend | Angular alkalmazás |
| Hosztolás | Firebase Hosting |
| Adattárolás | Cloud Firestore |
| Authentikáció | Firebase Authentication |
| AI-asszisztens | Cloudflare Worker + OpenRouter proxy |
| Tesztadatok | demó termékek, teszt vásárlók, admin fiók, helyszíni vásárlási adatok |

## Összefoglaló

| Mutató | Eredmény |
|---|---:|
| Lefuttatott kézi tesztesetek száma | 31 |
| Sikeres tesztesetek | 31 |
| Sikertelen tesztesetek | 0 |
| Kritikus nyitott hiba | 0 |
| Ismert korlát | éles bankkártyás fizetés és NAV-kompatibilis számlázás nincs integrálva, ezek MVP-n kívüli funkciók |

## Tesztesetek

| ID | Terület | Előfeltétel | Lépések | Elvárt eredmény | Tényleges eredmény | Státusz |
|---|---|---|---|---|---|---|
| M1-01 | Kezdőlap | Nincs | Oldal megnyitása publikus böngészőből | A kezdőlap betölt, a fejléc, kereső, kategóriák és kiemelt termékek láthatók | A kezdőlap betöltött, a fő elemek megjelentek | Sikeres |
| M1-02 | Navigáció | Kezdőlap betöltve | Fejléc menüpontok megnyitása: Kezdőlap, Termékek, Akciók, Újdonságok, Kapcsolat | A menüpontok a megfelelő nézetre visznek | A navigáció működött, nem volt hibás útvonal | Sikeres |
| M1-03 | Kategória menü | Kezdőlap betöltve | Kategóriák legördülő menü megnyitása és kategória választása | A menü olvasható, a választott kategória szerinti lista nyílik | A legördülő menü használható volt, a szűrés működött | Sikeres |
| M1-04 | Dark/light mód | Kezdőlap betöltve | Témaváltó gomb használata | A felület vált a sötét és világos megjelenés között, a fejléc olvasható marad | A témaváltás működött, a fejléc kontrasztja elfogadható | Sikeres |
| M1-05 | Terméklista | Publikus felhasználó | Termékek oldal megnyitása | Termékkártyák, árak, készletinformációk és szűrők láthatók | A terméklista betöltött, a szűrők elérhetők voltak | Sikeres |
| M1-06 | Keresés | Terméklista betöltve | Terméknévre és kategóriára keresés | A lista a keresésnek megfelelően szűkül | A keresés találatot adott, hibás keresésnél üres állapot jelent meg | Sikeres |
| M1-07 | Termékadatlap | Terméklista betöltve | Termék részleteinek megnyitása | Megjelenik a termék neve, ára, leírása, készlete és kosárba helyezési lehetősége | A termékadatlap megnyílt, az adatok olvashatók voltak | Sikeres |
| M1-08 | Kosárba helyezés | Készleten lévő termék | Termék kosárba helyezése | A kosár frissül, a termék tételként megjelenik | A kosár darabszáma és tartalma frissült | Sikeres |
| M1-09 | Kosár módosítása | Kosárban legalább egy termék | Mennyiség növelése, csökkentése, termék törlése | Az összeg és a tétellista azonnal frissül | A kosár összege és a tételek helyesen változtak | Sikeres |
| M1-10 | Üres kosár | Kosárból minden tétel törölve | Kosár oldal megnyitása | Érthető üres állapot jelenik meg | Az üres kosár állapot megjelent | Sikeres |
| M1-11 | Checkout pozitív ág | Kosárban termék | Vásárlói, szállítási és fizetési adatok kitöltése, rendelés leadása | A rendelés létrejön, a sikeres rendelés oldal megjelenik | A rendelés rögzült, a sikeroldal betöltött | Sikeres |
| M1-12 | Checkout kötelező mezők | Kosárban termék | Kötelező adatok kihagyása, rendelés leadása | A rendszer validációs hibát jelez, rendelés nem jön létre | A hiányzó adatoknál hibaüzenet jelent meg | Sikeres |
| M1-13 | Hibás e-mail | Checkout oldal | Hibás e-mail cím megadása | A rendszer jelzi, hogy az e-mail formátuma hibás | A hibás e-mailt a validáció megfogta | Sikeres |
| M1-14 | Hibás telefonszám | Checkout oldal | Rövid vagy érvénytelen telefonszám megadása | A rendszer jelzi, hogy a telefonszám nem megfelelő | A hibás telefonszámra hibaüzenet jelent meg | Sikeres |
| M1-15 | Kuponkód | Checkout oldal | Érvényes, majd hibás kuponkód kipróbálása | Érvényes kuponnál kedvezmény jelenik meg, hibásnál hibaüzenet | A kedvezmény és a hibakezelés is működött | Sikeres |
| M1-16 | Sikeres rendelés | Leadott rendelés | Sikeres rendelés oldal ellenőrzése | Látható a rendelés azonosítója, összege és a vásárlási adatok összegzése | Az összegzés megjelent, a kosár kiürült | Sikeres |
| M1-17 | Profil rendeléstörténet | Bejelentkezett vásárló | Profil oldalon a Rendeléseim nézet megnyitása | A felhasználó saját rendelései listában megjelennek | A rendelések megjelentek státusszal és részletekkel | Sikeres |
| M1-18 | Kívánságlista | Bejelentkezett vásárló | Termék kívánságlistára tétele, majd eltávolítása | A lista felhasználóhoz kötötten frissül | A kívánságlista működött, kijelentkezés után nem keveredett másik userrel | Sikeres |
| M1-19 | Regisztráció | Vendég állapot | Új tesztfelhasználó regisztrálása | A felhasználó létrejön, bejelentkezett állapotba kerül | A regisztráció és a beléptetés működött | Sikeres |
| M1-20 | Bejelentkezés/kijelentkezés | Létező tesztfiók | Bejelentkezés, majd kijelentkezés | A fejléc és a védett menüpontok állapota változik | A bejelentkezett és kijelentkezett állapot jól elkülönült | Sikeres |
| M1-21 | Admin belépés | Admin fiók | Admin felület megnyitása | Az admin dashboard elérhető, a fő fülek láthatók | Az admin felület betöltött | Sikeres |
| M1-22 | Jogosulatlan admin hozzáférés | Nem admin felhasználó | Admin útvonal megnyitása | A rendszer nem engedi a védett admin műveleteket | A nem admin felhasználó nem kapott admin hozzáférést | Sikeres |
| M1-23 | Admin áttekintés | Admin fiók | Áttekintés fül megnyitása | Statisztikák, alacsony készlet és kliens hibalogok megjelennek | A dashboard adatai megjelentek | Sikeres |
| M1-24 | Termékkezelés | Admin fiók | Termék felvitele és szerkesztési nézet ellenőrzése | A termék űrlap kitölthető, kép feltöltési mező elérhető | A termékkezelő űrlap működött | Sikeres |
| M1-25 | CSV import | Admin fiók | CSV minta letöltése, import mezők ellenőrzése | A CSV import mód és fájlválasztás elérhető, hibás adatnál nincs néma mentés | Az import felület működött, a hibás sorokat nem kezelte sikeresként | Sikeres |
| M1-26 | Rendeléskezelés | Admin fiók, létező rendelések | Rendelések lista megnyitása, státusz módosítása | A státusz módosítható, a lista frissül | A státuszváltás láthatóan megtörtént | Sikeres |
| M1-27 | Készletváltozás státuszváltáskor | Admin fiók | Rendelés teljesítése, majd készlet ellenőrzése | Teljesítéskor a készlet tranzakciósan korrigálódik | A készletváltozás a rendelési folyamattal összhangban volt | Sikeres |
| M1-28 | Helyszíni vásárlás | Admin fiók | Vásárló kiválasztása, termék hozzáadása, mentés + PDF | A helyszíni rendelés létrejön, a PDF letöltés elindul | A helyszíni rendelés sikeresen rögzült, a PDF megnyitható volt | Sikeres |
| M1-29 | PDF bizonylat | Letöltött PDF | PDF megnyitása Adobe Readerben | Látható a számlaszám, vevő, kiállító, tételek, összegzés | A PDF olvasható volt, az adatok nem csúsztak szét | Sikeres |
| M1-30 | Felhasználókezelés | Admin fiók | Felhasználók fül megnyitása, szerepkör és tiltás gomb ellenőrzése | Látható a felhasználók száma, szerepkör és tiltási lehetőség | A felhasználói lista és a jogosultsági vezérlők megjelentek | Sikeres |
| M1-31 | AI-asszisztens | Publikus vagy bejelentkezett felhasználó | Releváns termékkérdés és irreleváns kérdés kipróbálása | Releváns kérdésre termékhez kötött választ ad, irreleváns kérdésnél elutasít vagy terel | Az asszisztens csak webshophoz kapcsolódó választ adott | Sikeres |

## Negatív tesztek röviden

| Eset | Elvárt viselkedés | Eredmény |
|---|---|---|
| Hibás e-mail cím checkoutnál | Rendelés nem adható le, validációs hiba jelenik meg | Megfelelt |
| Hibás telefonszám checkoutnál | Rendelés nem adható le, a telefonszám hibája látszik | Megfelelt |
| Kötelező mezők üresen | A mentés/leadás tiltott vagy hibaüzenetet ad | Megfelelt |
| Nem admin felhasználó admin útvonalon | Nincs jogosultság a védett műveletekhez | Megfelelt |
| Hibás/hiányos CSV adat | A rendszer nem menti sikeresként a hibás sort | Megfelelt |
| Irreleváns AI-kérdés | Az asszisztens nem ad általános, webshopon kívüli választ | Megfelelt |

## Megjegyzések

- A tesztelés során a korábban tapasztalt helyszíni vásárlási mentési hiba már nem jelentkezett.
- A PDF-bizonylat Adobe Readerben is megnyitható és olvasható volt.
- A világos/sötét mód és a fejléc olvashatósága a végleges ellenőrzéskor elfogadható állapotban volt.
- A bankkártyás fizetés és az éles számlázórendszer integrációja szándékosan nem része az MVP-nek; a felület ezt demonstrációs jellegű folyamatként kezeli.

## Mellékelt bizonyítékok

A kézi teszteléshez tartozó képi bizonyítékok és UX screenshotok a repó alábbi mappáiban találhatók:

- `docs/ux/screenshots/`
- `docs/thesis/figures/`
- `docs/code-snippet-images/`

## Következtetés

A kézi ellenőrzés alapján a TDL Webshop fő vásárlói és adminisztrátori folyamatai a beadásközeli verzióban működnek. A tesztelés lefedte a publikus böngészést, a kosár és checkout folyamatot, a profilhoz kötött rendeléstörténetet, az admin rendeléskezelést, a helyszíni vásárlást, a PDF-bizonylatot, a CSV import felületet, a jogosultságkezelést és az AI-asszisztens alapvető védelmi viselkedését.
