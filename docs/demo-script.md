# TDL Webshop - bemutato forgatokonyv

Ez a rovid forgatokonyv a szakdolgozati bemutatohoz keszult. Celja, hogy a projektet logikus sorrendben lehessen bemutatni, es kozben a fontosabb fejlesztesi dontesek is elhangozzanak.

## 0. Elokeszites

Bemutato elott:

- `npm run build`
- `npm test -- --watch=false`
- eles oldal megnyitasa: https://tdlwebshop.web.app
- admin felhasznalo bejelentkezes ellenorzese
- legyen legalabb nehany termek, egy-ket rendeles es keszletadat az adatbazisban

Rovid nyitas:
> A projekt egy epuletegepeszeti webshop, amely a vasarloi folyamat mellett adminisztracios, keszletkezelesi es helyszini ertekesitesi funkciokat is tartalmaz. Fontos szempont volt, hogy alap Firebase Spark csomagon is mukodokepes legyen.

## 1. Vasarloi oldal bemutatasa

Mutasd:

1. Fooldal
2. Kategoriak
3. Termeklista
4. Termekreszletek
5. Kosarba helyezes

Mit mondj:
> A vasarloi oldal a klasszikus webshop folyamatot koveti: kategoriak, termeklista, termekreszletek, kosar es checkout. A termekek Firestore-bol toltodnek, nem statikus listabol.

## 2. Szereloi/profi csomagajanlo

Mutasd:

1. Termeklista tetejen a szereloi/profi modot
2. Futes/viz/szellozes/hutes csomagvalasztast
3. Csomag kosarba helyezeset

Mit mondj:
> Ez a funkcio azert kerult bele, mert epuletegepeszeti kornyezetben sokszor nem egyetlen termeket keres a vasarlo, hanem komplett szerelesi csomagot. A rendszer a meglevo termekekbol probal osszeallitani egy szakmai csomagot.

## 3. Checkout es rendelés

Mutasd:

1. Kosar oldal
2. Checkout mezok
3. Kuponkod
4. Ceges/szereloi vasarlas
5. Sikeres rendeles oldal
6. Email sablon

Mit mondj:
> A checkout validalja a kotelezo adatokat, kezeli a kuponokat es a ceges adatokat. A visszaigazolo email Spark csomag miatt nem automatikus szerveroldali kuldes, hanem mailto alapu sablon, ami kesobb automatizalhato.

## 4. Admin attekintes

Mutasd:

1. Admin belepes
2. Attekintes kartyak
3. Vezetoi riport: bevetel, havi bevetel, atlagos kosarertek
4. Top termekek
5. Legutobbi rendelesek
6. Alacsony keszlet / utanrendelesi javaslat

Mit mondj:
> Az admin felulet celja, hogy a webshop uzemeltetoje egy helyen lassa a termekeket, rendeleseket, felhasznalokat, beveteli adatokat es keszletfigyelmezteteseket.

## 5. Termekkezeles es CSV import

Mutasd:

1. Uj termek felvetele
2. Kategoria legordulo
3. Termek szerkesztese
4. CSV import blokk
5. CSV minta letoltes

Mit mondj:
> A termekkezeles egyedi rogzitest es csoportos CSV importot is tamogat. Ez azert fontos, mert valos webshopnal nem praktikus minden termeket kezzel egyesevel felvinni.

## 6. Keszletkezeles es okos keszletfigyeles

Mutasd:

1. Keszlet ful
2. Kategoria szures
3. Szabad/foglalt keszlet
4. Okos keszletfigyeles
5. Utanrendelesi CSV export

Mit mondj:
> A rendszer nem csak raktarkeszletet mutat, hanem figyeli a foglalt keszletet es az utolso 30 nap teljesitett rendelesei alapjan utanrendelesi javaslatot ad. Ez egy egyszeru dontestamogato funkcio.

## 7. Rendeleskezeles

Mutasd:

1. Rendelestabok: aktiv, teljesitett, helyszini
2. Rendeles reszletei
3. Statuszvaltas
4. Szamla/PDF letoltes
5. Email sablon

Mit mondj:
> A statuszvaltasnal a rendeles allapota, az audit es a keszletkorrekcio tranzakcios logikaval mozog, hogy ne csusszanak szet az adatok.

## 8. Helyszini ertekesites

Mutasd:

1. Mentett vasarlo/ceg profil
2. Termek es mennyiseg valasztas
3. Helyszini vasarlas mentese
4. PDF letoltes

Mit mondj:
> Ez a funkcio szakuzleti helyzetet modellez, amikor a vasarlas nem online checkouton, hanem helyszinen tortenik. A rendszer ilyenkor is rendelest ment es keszletet csokkent.

## 9. Biztonsag es Firebase Spark

Mutasd vagy mondd:

- Firestore rules vedik az admin es user muveleteket.
- Tiltott user szabaly szinten sem kezelhet vedett adatot.
- A projekt Firebase Auth, Firestore es Hosting szolgaltatasokra epul.
- Cloud Functions nincs bekotve az alap deployba, mert Spark csomagon fut a projekt.

Rovid valasz:
> A projektben tudatos kompromisszum, hogy alap Firebase csomagon is mukodjon. A fizetos szerveroldali automatizmusok tovabbfejleszteskent szerepelnek.

## 10. Zaro osszegzes

Zarasnak:
> A projekt bemutatja egy szakmai webshop teljesebb mukodeset: vasarloi oldal, admin oldal, keszletfigyeles, helyszini ertekesites es dokumentalt tovabbfejlesztesi lehetosegek. A cel nem csak egy latvanyos felulet, hanem egy mukodo, valos folyamatokra epulo rendszer volt.

## Ha csak 5 perc van

1. Fooldal es termeklista
2. Szereloi csomagajanlo
3. Checkout sikeres rendelessel
4. Admin keszletfigyeles
5. Rendeleskezeles es PDF/email sablon

## Ha 10-12 perc van

1. Vasarloi oldal
2. Csomagajanlo
3. Checkout + email sablon
4. Admin attekintes
5. Termekkezeles + CSV import
6. Okos keszletfigyeles + CSV export
7. Rendeleskezeles + statusz + PDF
8. Helyszini ertekesites
9. Firebase Spark es biztonsagi szabalyok
