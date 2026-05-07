# Leadando checklist a konzulensi visszajelzes alapjan

Ez a lista a 2026. majus eleji konzulensi visszajelzeshez igazodik. A cel az, hogy a repo, a dokumentacio es a szakdolgozat ugyanazt a mernoki tortenetet bizonyitsa.

## 1. Repo-higienia es reprodukalhatosag

- [ ] `npm install` tiszta kornyezetben lefut.
- [ ] `npm run build` sikeresen lefut.
- [ ] `npm test -- --watch=false` sikeresen lefut.
- [ ] A GitHub Actions CI zold.
- [ ] A fo [README.md](../README.md) tartalmaz telepitest, inditast, buildet, tesztet es deployt.
- [ ] Van [.env.example](../.env.example), de nincs commitolva valodi `.env`.
- [ ] Nincs commitolva `node_modules`, `functions/node_modules`, `dist`, `.angular`, `.venv`.
- [ ] Nincs commitolva valodi jelszo, token vagy privát API kulcs.
- [ ] A demo belepesi adatok csak kulon, privát csatornan szerepelnek.

## 2. Biztonsagi bizonyitas

- [ ] A Firestore szabalyok bemutatjak az admin/dolgozo/vasarlo szerepkorok elvalasztasat.
- [ ] A tiltott felhasznalo vagy tiltott mentett vasarlo nem tud rendelest inditani.
- [ ] Az OpenRouter kulcs nem frontend fajlban van, hanem Cloudflare Worker secretkent.
- [ ] A Firebase web configrol le van irva, hogy nem klasszikus titok, de a rules vedik az adatokat.
- [ ] A kuponokkal kapcsolatos visszaelesi lehetosegek dokumentalva vannak.
- [ ] A PDF/szamla generalas kockazatai es korlatai dokumentalva vannak.

## 3. Teszteles es validacio

- [ ] Checkout sikeres rendelessel tesztelve.
- [ ] Checkout hibas emaillel/telefonnal tesztelve.
- [ ] Kupon ervenyes es ervenytelen kodra tesztelve.
- [ ] Keszletvaltozas rendelés utan ellenorizve.
- [ ] Admin statuszvaltas ellenorizve.
- [ ] Dolgozoi jogosultsag ellenorizve: tud rogzitani, de nincs jovahagyo/admin joga.
- [ ] Normal vasarlo nem eri el az admin funkciokat.
- [ ] AI asszisztens domain kerdesre valaszol, nem domain kerdesre elutasit.
- [ ] AI asszisztens nem ajanl random termeket, ha nincs relevans katalogustalalat.
- [ ] Mobil nezetben ellenorizve: kezdolap, termeklista, kosar, checkout, profil.

## 4. Szakdolgozati szoveg es mellekletek

- [ ] A dolgozat leirja a problemat es a celcsoportot.
- [ ] A dolgozat kimondja az MVP hatarat: mi keszult el es mi nem.
- [ ] Van piaci/teruleti osszehasonlitas.
- [ ] Van adatmodell fejezet Product, Cart, Order, OrderItem, UserProfile, Coupon, Invoice entitasokkal.
- [ ] Van architektura fejezet Angular, Firebase, Firestore rules, Cloudflare Worker reszekkel.
- [ ] Van tesztelesi fejezet konkret eredmenyekkel.
- [ ] Van kb. 2 oldalas MI-hasznalati fejezet.
- [ ] A dokumentumok es a dolgozat fo szovege sajat nyelvezetre at van huzva.

## 5. Kepernyokepek

- [ ] Kezdolap dark es light mod.
- [ ] Termeklista kategoriaval/szurovel.
- [ ] Termekadatlap tobb keppel.
- [ ] Kosar.
- [ ] Checkout validacioval es osszegzessel.
- [ ] Profil oldal rendeleskovetessel.
- [ ] Admin dashboard.
- [ ] Admin termekkezeles es CSV import.
- [ ] Admin rendeleskezeles PDF/szamla letoltessel.
- [ ] Admin jogosultsag/felhasznalo kezeles.
- [ ] AI asszisztens valasszal es termekkartya ajanlassal.

## 6. Vegso leadasi ellenorzes

- [ ] A GitHub repo legfrissebb commitja tartalmazza a vegleges kodot es dokumentaciot.
- [ ] A GitHub repo nem tartalmaz generalt fuggosegeket vagy titkokat.
- [ ] Az eles Firebase Hosting verzio mukodik.
- [ ] A Cloudflare Worker AI proxy mukodik.
- [ ] A szakdolgozat PDF-ben exportalva, olvashato formaban kesz.
- [ ] A konzulensnek kuldendo review-verzio a legjobb aktualis allapotot mutatja, nem vazlatot.
