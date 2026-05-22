# TDL Épületgépészeti Webshop

Szakdolgozati projektként készült épületgépészeti webshop és adminisztrációs rendszer. A cél egy olyan termékszerű MVP megvalósítása volt, amelyben a vásárlói rendelési folyamat és a belső admin/dolgozói folyamatok együtt működnek.

## Rövid leírás

A TDLWebshop épületgépészeti termékeket kezelő webáruház. A vásárlók termékeket böngészhetnek, kosárba helyezhetik azokat, rendelést adhatnak le, majd profiljukban követhetik a korábbi rendeléseiket. Az admin és dolgozói oldal termékkezelést, készletfigyelést, rendeléskezelést, vásárlókezelést, helyszíni értékesítést, kuponokat és PDF bizonylat/számla generálást támogat.

## Fő funkciók

- Vásárlói felület: kezdőlap, kategóriák, terméklista, termékadatlap, kosár, checkout.
- Regisztráció és bejelentkezés Firebase Auth segítségével.
- Profil oldal korábbi rendelésekhez és felhasználói adatokhoz.
- Admin felület termékekhez, készlethez, rendelésekhez, vásárlókhoz, kuponokhoz és hírekhez.
- Dolgozói jogosultság: helyszíni rendelés, készlet és termékkezelés korlátozott admin jogokkal.
- Helyszíni vásárlás rögzítése mentett vásárlókkal és PDF bizonylattal.
- Kuponlogika és akciós termékek kezelése.
- Készletfigyelés és alacsony készlet jelzése.
- Vásárlói AI asszisztens saját termékkatalógus-kontextussal, OpenRouter proxyval.
- Világos/sötét mód és reszponzív felület.

## Technológiai stack

- Frontend: Angular standalone komponensek, TypeScript, HTML, CSS.
- Adattárolás és auth: Firebase Auth, Firestore, Firebase Hosting.
- PDF generálás: kliensoldali bizonylat/számla generálás.
- AI proxy: Cloudflare Worker + OpenRouter.
- CI: GitHub Actions build ellenőrzés.

## Lokális futtatás

### Előfeltételek

- Node.js: javasolt `20.x` vagy `22.x` LTS.
- npm.
- Firebase projekt, ha saját adatbázissal szeretnéd futtatni.

### Telepítés

```bash
npm install
```

### Fejlesztői indítás

```bash
npm start
```

Alapértelmezett cím:

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

Firestore szabályok deploy:

```bash
firebase deploy --only firestore:rules
```

Az alap projekt Firebase Spark kompatibilis működésre készült. A `functions/` mappa opcionálisan továbbfejlesztési irány, de a fő deploy folyamat nem igényel Cloud Functions használatot.

## AI asszisztens és OpenRouter proxy

Az AI asszisztens nem tárol OpenRouter API kulcsot a frontend kódban. A böngésző egy Cloudflare Worker proxyt hív, a Worker pedig szerveroldali secretként éri el az OpenRouter kulcsot.

Fontos:

- OpenRouter API kulcsot tilos Angular környezeti fájlba vagy frontend kódba írni.
- A kulcsot Cloudflare Worker secretként kell beállítani.
- A frontendben csak a Worker publikus URL-je szerepelhet.
- A modellválasztás nem állítható a vásárlói felületen.

Részletes leírás:

- [docs/ai-asszisztens-openrouter.md](docs/ai-asszisztens-openrouter.md)
- [workers/openrouter-proxy/README.md](workers/openrouter-proxy/README.md)

## Környezeti változók és titkok

A repóban nem szerepelhet valódi jelszó, token vagy privát API kulcs. A szükséges minták az `.env.example` fájlban találhatók.

Megjegyzések:

- A Firebase web app config önmagában nem klasszikus titok, de a Firestore szabályoknak védeniük kell az adatokat.
- Demo belépési adatokat nem érdemes a repóba commitolni.
- Valódi `.env` fájl, API kulcs, token, `node_modules`, build mappa és lokális cache nem kerülhet a végleges repóba.

## Demo szerepkörök

A demo belépési adatok nem szerepelnek a kódban. A beadáshoz és bemutatóhoz külön, privát csatornán érdemes megadni:

- admin felhasználó,
- dolgozói felhasználó,
- vásárlói felhasználó.

## Projektstruktúra

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

## Dokumentáció

- Dokumentációs index: [docs/00_index.md](docs/00_index.md)
- Végleges szakdolgozati Word-dokumentum: [docs/thesis/TothDavidLaszlo_PTNRYG_szakdolgozat_vegleges.docx](docs/thesis/TothDavidLaszlo_PTNRYG_szakdolgozat_vegleges.docx)
- Leadandó checklist: [docs/leadando_checklist.md](docs/leadando_checklist.md)
- MVP brief: [docs/01_product/mvp_brief.md](docs/01_product/mvp_brief.md)
- Piaci elemzés: [docs/01_product/piaci_elemzes.md](docs/01_product/piaci_elemzes.md)
- Követelmények: [docs/01_product/kovetelmenyek_traceability.md](docs/01_product/kovetelmenyek_traceability.md)
- Use case-ek: [docs/01_product/use_cases.md](docs/01_product/use_cases.md)
- UX képernyőspecifikáció: [docs/ux/ux_screen_spec.md](docs/ux/ux_screen_spec.md)
- Mellékleti kódrészlet-képek: [docs/code-snippet-images/README.md](docs/code-snippet-images/README.md)
- Modulok és interfészek: [docs/02_architecture/modules_interfaces.md](docs/02_architecture/modules_interfaces.md)
- Konzulensi visszajelzés szerinti állapot: [docs/konzulensi-visszajelzes-megfeleles.md](docs/konzulensi-visszajelzes-megfeleles.md)
- Tesztelési fejezet: [docs/testing-thesis-section.md](docs/testing-thesis-section.md)
- Reprodukciós README: [docs/reprodukcios_README.md](docs/reprodukcios_README.md)
- AI használat: [docs/07_ai/ai-usage-thesis-section.md](docs/07_ai/ai-usage-thesis-section.md)

## Élő verzió

Firebase Hosting:

[https://tdlwebshop.web.app](https://tdlwebshop.web.app)
