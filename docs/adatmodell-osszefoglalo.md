# Adatmodell osszefoglalo

Ez az osszefoglalo a TDL Webshop fo Firestore es kliensoldali entitasait mutatja be. A szakdolgozatban ez a fejezet bizonyitja, hogy a rendszer nem veletlenszeru objektumokbol, hanem tudatosan kialakitott webshop domainmodellbol epul fel.

## Product

A `Product` a webshop kozponti katalogus entitasa.

Fontos mezok:

- `id`: Firestore dokumentumazonosito.
- `sku`: stabil cikkszam, CSV importnal es keresesnel kulcs.
- `name`: termeknev.
- `category`: fo kategoria, peldaul futes, hutes, viz, szellozes, szerelveny, lakossagi megoldasok.
- `brand`: marka.
- `price`: aktualis brutto ar.
- `originalPrice`: akcio elotti ar, ha van.
- `stockQuantity`: aktualis keszlet.
- `image`, `images`: fo kep es tovabbi termekkepek.
- `description`, `shortDescription`: termekleirasok.
- `isTopProduct`, `isWeeklyDeal`, `salePercent`: kiemeles es akcios logika.

## Cart es CartItem

A kosar kliensoldali allapot, amely a vasarloi rendelés elokeszitesere szolgal. A stabil kulcs a termek Firestore azonositoja vagy SKU-ja, nem listaindex.

CartItem fo mezok:

- `productId`: termek dokumentumazonosito.
- `sku`: cikkszam.
- `name`: termeknev.
- `price`: aktualis ar.
- `quantity`: valasztott mennyiseg.
- `image`: kosarban megjeleno kep.

## Order

Az `Order` a webes vagy helyszini rendelési folyamat eredmenye.

Fontos mezok:

- `items`: rendelési tetelek.
- `customer`: vasarloi alapadatok.
- `billingAddress`, `shippingAddress`: szamlazasi es szallitasi adatok.
- `paymentMethod`: fizetesi mod.
- `paymentDeadlineDays`: utalasos fizetesnel hatarido.
- `status`: rendelés aktualis allapota.
- `subtotal`, `shippingFee`, `discount`, `total`: penzugyi osszesitok.
- `couponCode`: felhasznalt kupon, ha van.
- `channel`: `web` vagy `onsite`.
- `createdAt`, `updatedAt`: idobelyegek.

## OrderItem

Az `OrderItem` egy rendelésen beluli konkret termektetel.

Fontos mezok:

- `productId`: termek azonosito.
- `sku`: cikkszam.
- `name`: termeknev a rendelés pillanataban.
- `quantity`: mennyiseg.
- `unitPrice`: egységar.
- `lineTotal`: sorosszeg.

## UserProfile

A `UserProfile` a Firebase Auth felhasznalohoz kapcsolodo Firestore profil.

Fontos mezok:

- `uid`: Firebase Auth felhasznaloazonosito.
- `email`: e-mail cim.
- `role`: `customer`, `employee` vagy `admin`.
- `disabled`: tiltasi allapot.
- `permissions`: dolgozoi reszjogosultsagok.
- `billingData`, `shippingData`: mentett szamlazasi es szallitasi adatok.

## SavedCustomer

A `SavedCustomer` az admin/dolgozoi helyszini ertekesiteshez tarolt magan- vagy ceges vasarlo.

Fontos mezok:

- `name`: vasarlo vagy ceg neve.
- `email`, `phone`: kapcsolattartasi adatok.
- `isCompany`: ceges vasarlo jelolese.
- `companyName`, `taxNumber`: ceges adatok.
- `disabled`: tiltott vasarlo.
- `totalSpent`: osszes korabbi vasarlasi ertek.
- `discountPercent`: torzsvasarloi vagy ceges kedvezmeny.

## Coupon

A `Coupon` a kedvezmenylogikat irja le.

Fontos mezok:

- `code`: kuponkod.
- `type`: szazalekos vagy fix osszegu kedvezmeny.
- `value`: kedvezmeny merteke.
- `active`: hasznalhato-e.
- `validFrom`, `validUntil`: ervenyessegi ido.
- `minOrderTotal`: minimalis kosarertek.
- `usageLimit`: felhasznalasi korlat.

## Invoice / PDF bizonylat

Az `Invoice` nem feltetlenul kulon Firestore collection, hanem a rendelés adataibol generalhato PDF dokumentum. A szakdolgozatban entitaskent erdemes kezelni, mert onallo uzleti kimenet.

Fontos adatok:

- szamlaszam vagy bizonylatazonosito;
- rendelés azonosito;
- kiallitasi datum;
- elado adatai;
- vevo adatai;
- tetelek;
- netto, afa, brutto osszegek;
- fizetesi es szallitasi mod.

## NewsletterSubscriber

A hirlevel feliratkozo egyszeru marketing/adatkezelesi entitas.

Fontos mezok:

- `email`;
- `createdAt`;
- opcion statusz vagy forras.

## AI Assistant context

Az AI asszisztens nem teljes adatbazist kuld ki a modellnek, hanem a felhasznaloi kerdeshez relevans katalogusreszletet. Ez biztonsagi es minosegi okbol fontos:

- kevesebb adat hagyja el a rendszert;
- a modell csak letezo termekekbol ajanlhat;
- ha nincs relevans termek, nem ad random katalogusajanlast.

## Kapcsolatok roviden

- Egy `UserProfile` tobb `Order` dokumentumhoz kapcsolodhat.
- Egy `Order` tobb `OrderItem` tetelt tartalmaz.
- Egy `OrderItem` egy `Product` pillanatnyi masolata.
- Egy `SavedCustomer` helyszini `Order`-ekhez kapcsolodhato.
- Egy `Coupon` opcionálisan egy `Order` kedvezmenyet befolyasolja.
- Az `Invoice` a `Order` es `OrderItem` adataibol keszul.
