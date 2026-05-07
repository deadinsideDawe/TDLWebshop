# TDL Epuletgepeszeti Webshop

Szakdolgozati projektkent keszult epuletgepeszeti webshop es adminisztracios rendszer. A cel egy olyan termekszeru MVP megvalositasa volt, amelyben a vasarloi rendelesi folyamat es a belso admin/dolgozoi folyamatok egyutt mukodnek.

## Rovid leiras

A TDLWebshop epuletgepeszeti termekeket kezelo webaruhaz. A vasarlok termekeket bongeszhetnek, kosarba helyezhetik azokat, rendelest adhatnak le, majd profiljukban kovethetik a korabbi rendeleseiket. Az admin es dolgozoi oldal termekkezelest, keszletfigyelest, rendeleskezelest, vasarlokezelest, helyszini ertekesitest, kuponokat es PDF bizonylat/szamla generalast tamogat.

## Fo funkciok

- Vasarloi felulet: kezdolap, kategoriak, termeklista, termekadatlap, kosar, checkout.
- Regisztracio es bejelentkezes Firebase Auth segitsegevel.
- Profil oldal korabbi rendelesekhez es felhasznaloi adatokhoz.
- Admin felulet termekekhez, keszlethez, rendelesekhez, vasarlokhoz, kuponokhoz es hirekhez.
- Dolgozoi jogosultsag: helyszini rendeles, keszlet es termekkezeles korlatozott admin jogokkal.
- Helyszini vasarlas rogzitese mentett vasarlokkal es PDF bizonylattal.
- Kuponlogika es akcios termekek kezelese.
- Keszletfigyeles es alacsony keszlet jelzese.
- Vasarloi AI asszisztens sajat termekkatalogus-kontextussal, OpenRouter proxyval.
- Vilagos/sotet mod es reszponziv felulet.

## Technologiai stack

- Frontend: Angular standalone komponensek, TypeScript, HTML, CSS.
- Adattarolas es auth: Firebase Auth, Firestore, Firebase Hosting.
- PDF generalas: kliensoldali bizonylat/szamla generalas.
- AI proxy: Cloudflare Worker + OpenRouter.
- CI: GitHub Actions build ellenorzes.

## Lokalis futtatas

### Elofeltetelek

- Node.js: javasolt `20.x` vagy `22.x` LTS.
- npm.
- Firebase projekt, ha sajat adatbazissal szeretned futtatni.

### Telepites

```bash
npm install
```

### Fejlesztoi inditas

```bash
npm start
```

Alapertelmezett cim:

```text
http://localhost:4200
```

### Build

```bash
npm run build
```

### Tesztek

```bash
npm test -- --watch=false
```

## Firebase deploy

Hosting deploy:

```bash
firebase deploy --only hosting
```

Firestore szabalyok deploy:

```bash
firebase deploy --only firestore:rules
```

Az alap projekt Firebase Spark kompatibilis mukodesre keszult. A `functions/` mappa opcion is tovabbfejlesztesi irany, de a fo deploy folyamat nem igenyel Cloud Functions hasznalatot.

## AI asszisztens es OpenRouter proxy

Az AI asszisztens nem tarol OpenRouter API kulcsot a frontend kodban. A bongeszo egy Cloudflare Worker proxyt hiv, a Worker pedig szerveroldali secretkent eri el az OpenRouter kulcsot.

Fontos:

- OpenRouter API kulcsot tilos Angular kornyezeti fajlba vagy frontend kodba irni.
- A kulcsot Cloudflare Worker secretkent kell beallitani.
- A frontendben csak a Worker publikus URL-je szerepelhet.
- A modellvalasztas nem allithato a vasarloi feluleten.

Reszletes leiras:

- [docs/ai-asszisztens-openrouter.md](docs/ai-asszisztens-openrouter.md)
- [workers/openrouter-proxy/README.md](workers/openrouter-proxy/README.md)

## Kornyezeti valtozok es titkok

A repoban nem szerepelhet valodi jelszo, token vagy privat API kulcs. A szukseges mintak az `.env.example` fajlban talalhatok.

Megjegyzesek:

- A Firebase web app config onmagaban nem klasszikus titok, de a Firestore szabalyoknak vedeniuk kell az adatokat.
- Demo belepesi adatokat nem erdemes a repoba commitolni.
- Valodi `.env` fajl, API kulcs, token, `node_modules`, build mappa es lokalis cache nem kerulhet a vegleges repoba.

## Demo szerepkorok

A demo belepesi adatok nem szerepelnek a kodban. A beadashoz es bemutatohoz kulon, privat csatornan erdemes megadni:

- admin felhasznalo,
- dolgozoi felhasznalo,
- vasarloi felhasznalo.

## Projektstruktura

```text
src/
  app/
    components/
    guards/
    models/
    services/
  pages/
    admin/
    cart/
    checkout/
    contact/
    home/
    product-details/
    products/
    profile/
    wishlist/
workers/
  openrouter-proxy/
docs/
  01_product/
  02_architecture/
  04_quality/
  05_security_ops/
  06_release/
  07_ai/
public/
  products/
scripts/
functions/
```

## Dokumentacio

- Dokumentacios index: [docs/00_index.md](docs/00_index.md)
- Javitott szakdolgozati alap: [docs/TDLWebshop_szakdolgozat_javitott_alap.docx](docs/TDLWebshop_szakdolgozat_javitott_alap.docx)
- Leadando checklist: [docs/leadando_checklist.md](docs/leadando_checklist.md)
- MVP brief: [docs/01_product/mvp_brief.md](docs/01_product/mvp_brief.md)
- Piaci elemzes: [docs/01_product/piaci_elemzes.md](docs/01_product/piaci_elemzes.md)
- Kovetelmenyek: [docs/01_product/kovetelmenyek_traceability.md](docs/01_product/kovetelmenyek_traceability.md)
- Use case-ek: [docs/01_product/use_cases.md](docs/01_product/use_cases.md)
- UX kepernyospecifikacio: [docs/ux/ux_screen_spec.md](docs/ux/ux_screen_spec.md)
- Modulok es interfeszek: [docs/02_architecture/modules_interfaces.md](docs/02_architecture/modules_interfaces.md)
- Konzulensi visszajelzes szerinti allapot: [docs/konzulensi-visszajelzes-megfeleles.md](docs/konzulensi-visszajelzes-megfeleles.md)
- Abra-, kepernyokep- es kodreszlet-terv: [docs/abra_es_kod_kepernyokep_terv.md](docs/abra_es_kod_kepernyokep_terv.md)
- Tesztelesi fejezet: [docs/testing-thesis-section.md](docs/testing-thesis-section.md)
- Reprodukcios README: [docs/reprodukcios_README.md](docs/reprodukcios_README.md)
- AI hasznalat: [docs/07_ai/ai-usage-thesis-section.md](docs/07_ai/ai-usage-thesis-section.md)

## Elo verzio

Firebase Hosting:

[https://tdlwebshop.web.app](https://tdlwebshop.web.app)
