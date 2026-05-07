# MVP brief - TDL Webshop

## 1. Problema es cel

**Megoldando problema:** Az epuletegepeszeti termekeket arusito kisebb vallalkozasoknal gyakori, hogy a webshop, a keszletkezeles, a helyszini ertekesites es az adminisztracio kulon rendszerekben vagy kezi folyamatokkal mukodik. Ez lassitja a rendelest, neheziti a keszlet koveteset, es hibalehetoseget okoz a szamlazasnal vagy bizonylatkeszitesnel.

**Celfelhasznalok:** Maganvasarlok, szerelok, cegek, valamint a TDL Webshop adminjai es dolgozoi. A vasarlok gyorsan szeretnenek termeket talalni es rendelni, a dolgozok pedig gyorsan szeretnenek helyszini vasarlast rogzitani, keszletet ellenorizni es rendelest kezelni.

**A termek igerete:** Egy olyan szakdolgozati MVP keszult, amely egyszerre mutatja be a vasarloi webshop-folyamatot es a belso admin/dolgozoi mukodest. A rendszer a termekkeresest, kosarat, checkoutot, rendelest, profilt, adminisztraciot, keszletfigyelest es PDF bizonylatot egy kozos Firebase-alapu adatmodellre epiti.

## 2. MVP hatar

| Elem | MVP-ben benne van? | Indoklas | Elfogadasi jel |
|---|---:|---|---|
| Termeklista es kategoriak | igen | a webshop alapja | termekek kategoriara szurhetok es megjelennek |
| Termekadatlap | igen | vasarloi dontes tamogatasa | ar, keszlet, kep es leiras lathato |
| Kosar | igen | rendelesehez szukseges | termek hozzaadhato, mennyiseg modosithato |
| Checkout | igen | vasarloi ut kritikus pontja | rendelest lehet leadni validalt adatokkal |
| Regisztracio es belepes | igen | profil es rendeleskovetes miatt kell | felhasznalo sajat adatait es rendeleseit latja |
| Profil oldal | igen | vasarloi onkiszolgalas | korabbi rendelesek es adatok lathatok |
| Admin panel | igen | belso mukodes bemutatasa | termek, rendeles, vasarlo es keszlet kezelheto |
| Dolgozoi szerepkor | igen | valos vallalati mukodes kozelitese | korlatozott admin funkciok erhetoek el |
| Helyszini vasarlas | igen | domain-specifikus plusz ertek | admin/dolgozo vasarlast rogzit es PDF-et general |
| Keszletfigyeles | igen | webshop es raktar osszekotese | alacsony keszlet jelzes lathato |
| Kupon es akcio | igen | webshop funkcio es uzleti logika | kupon ervenyesitheto, akcios termekek lathatok |
| AI asszisztens | opcion (MVP+) | konzulensi javaslat alapjan plusz ertek | sajat katalogusbol is tud valaszolni fallbackkel |
| Online bankkartyas fizetes | nem | kulso fizetesi szolgaltato es jogi/penzugyi integracio kellene | fizetesi mod csak rendelesi adatkent szerepel |
| Valos szamlazo integracio | nem | kulso NAV/szamlazo API integracio tulmutat az MVP-n | PDF bizonylat/szamla minta keszul |

## 3. Nem celok

- Eles bankkartyas fizetesi szolgaltato integralasa.
- NAV Online Szamla vagy kulso szamlazo rendszer teljes bekotese.
- Teljes vallalatiranyitasi rendszer kivaltasa.
- Nagykereskedelmi arlistak es beszerzesi rendszerek mely integracioja.
- Nagy forgalmu, tobb orszagos, tobb nyelvu webshop megvalositasa.

## 4. Sikeressegi meroszamok

| Meroszam | Cel ertek | Meres modja |
|---|---:|---|
| Kritikus vasarloi use case-ek | 100% | kezi teszt checklist |
| Kritikus admin use case-ek | 100% | kezi teszt checklist |
| Build | sikeres | `npm run build` |
| CI | zold GitHub Actions run | GitHub Actions felulet |
| Titokkezeles | nincs valodi jelszo/API kulcs a repoban | kodertekezes es secret scan |
| Reprodukcio | README alapjan futtathato | tiszta kornyezetes ellenorzes |

