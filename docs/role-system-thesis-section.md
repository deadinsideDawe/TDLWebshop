# Jogosultsagi rendszer - szakdolgozati leiras

Ez a szoveg a webshop jogosultsagkezelesenek dokumentalasahoz keszult. Atirhatod a sajat nyelvezetedre, es beillesztheted a szakdolgozat megvalositasi vagy biztonsagi fejezeteibe.

## Jogosultsagi rendszer celja

A webshopban nem volt elegendo csupan ket allapotot kezelni, vagyis a nyilvanos vasarloi szerepkort es az admin jogosultsagot. A valos mukodeshez olyan belso szerepkor is szukseges volt, amely a napi operativ feladatokat el tudja vegezni, de nem rendelkezik teljes koru admin hozzaferessel. Emiatt a rendszerben harom alap szerepkor kerult kialakitasra:

- `customer` - hagyomanyos vasarloi profil
- `employee` - dolgozoi profil
- `admin` - teljes koru adminisztratori profil

Az alkalmazott megoldas celja az volt, hogy a rendszer a legkisebb szukseges jogosultsag elve szerint mukodjon. Ez azt jelenti, hogy minden felhasznalo csak azokat a funkciokat es adatokat eri el, amelyek a feladata ellatasahoz tenylegesen szuksegesek.

## Szerepkorok feladatai

### Vasarlo

A vasarlo kepes regisztralni, bejelentkezni, termekeket megtekinteni, kosarba helyezni, rendelest leadni, valamint a sajat profiloldalan a korabbi rendeleseket es adatokat megtekinteni. A vasarlo nem fer hozza semmilyen belso adminisztracios nezethez.

### Dolgozo

A dolgozo szerepkor a webshop uzemeltetesi feladatait tamogatja. A dolgozo nem kap automatikusan teljes koru hozzaferest, hanem a rendszer kulon jogosultsagokkal kezeli az egyes muveleteket. A dolgozoi profilhoz az admin feluleten az alabbi jogosultsagok rendelhetok:

- helyszini vasarlas rogzitese
- keszlet megtekintese
- termekek feltoltese es szerkesztese
- vasarlok felvetele es szerkesztese
- vasarlok tiltasa vagy visszaallitasa

Ennek koszonhetoen kulon letrehozhato peldaul egy ertekesitoi dolgozo, aki helyszini vasarlast tud rogzitni, vagy egy raktaros, aki a termekkatalogust tudja kezelni, de nem latja a teljes adminisztracios funkcionalitast.

### Admin

Az admin a rendszer teljes koru belso felhasznaloja. Hozzafer az attekintesi panelhez, az ertesitesekhez, a felhasznalokezeleshez, a fizetesi hatarido-jovahagyasi folyamathoz, a keszlethez, a rendelesi folyamatokhoz es a termekkezeleshez is.

## Technikai megvalositas

A jogosultsagkezeles ket szinten valosult meg:

1. feluleti szinten az Angular alkalmazasban
2. adatvedelmi szinten a Firestore szabalyokban

### Angular oldali vezerles

A frontend oldalon az autentikaciohoz kapcsolodo allapotot az `AuthService` kezeli. A szolgaltatas nemcsak azt tartja nyilvan, hogy van-e bejelentkezett felhasznalo, hanem azt is, hogy a felhasznalo szerepkore admin, dolgozo vagy vasarlo. Emellett a dolgozoi jogosultsagok kulon ellenorzo metodusokkal erhetok el, peldaul:

- `canRecordSales()`
- `canViewInventory()`
- `canManageProducts()`
- `canManageCustomers()`
- `canDisableCustomers()`

Az admin felulet tabjai es muveleti gombjai ezek alapjan jelennek meg vagy tunnek el. Igy a dolgozo csak azokat a feluleteket latja, amelyekhez valoban rendelkezik jogosultsaggal.

### Firestore szabalyok

A frontend oldali elrejtes onmagaban nem tekintheto biztonsagos vedelemnek, ezert a vegso jogosultsagellenorzes a Firestore szabalyokban is megtortenik. A szabalyokban kulon fuggvenyek ellenorzik, hogy az adott felhasznalo dolgozo-e, es hogy rendelkezik-e az adott muvelethez szukseges reszjogositvannyal. Ennek eredmenyekent peldaul:

- csak az arra jogosult dolgozo vagy admin rögzíthet helyszini vasarlast,
- csak az arra jogosult dolgozo vagy admin modositthat termekadatot,
- csak az arra jogosult dolgozo vagy admin ferhet hozza a mentett vasarloi torzshoz,
- fizetesi hataridot tovabbra is csak admin hagyhat jova.

Ez a ketretegu megkozelites egyszerre tamogatja a jo felhasznaloi elmenyt es a biztonsagos adatkezelesi modellt.

## Dolgozoi profilok letrehozasa

A rendszerben az admin kulon feluleten hozhat letre uj profilokat. A letrehozas soran eloszor meg kell adni a profil tipusat. Ha a profil vasarlo, akkor a vasarloi adatok, ceges esetben pedig a cegadatok is rogzithetok. Ha a profil dolgozo, akkor a rendszer checkboxos formaban jeleniti meg a kioszthato jogosultsagokat.

Ezzel a megoldassal az admin nem egyetlen altalanos dolgozoi szerepkort kap, hanem tenylegesen munkakorhoz igazithato belso profilt tud letrehozni.

## A megoldas elonye

A kialakitott jogosultsagi rendszer egyszerre ad:

- atlathato szerepkorkezelest,
- a napi uzemelteteshez megfelelo rugalmassagot,
- korlatozott dolgozoi hozzaferest,
- biztonsagosabb adatmuveleteket,
- valamint bemutathato, valos vallalati mukodeshez kozel allo webshop modellt.

Szakdolgozati szempontbol ez azert fontos, mert a rendszer nem csupan egy alap webshop funkciokkal rendelkezo felulet, hanem szerepkor-alapu, uzemeltetesi folyamatokat is kezelo alkalmazas lett.
