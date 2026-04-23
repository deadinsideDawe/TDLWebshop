# TDL Épületgépészeti Webshop

> Szakdolgozati projekt - kisebb épületgépészeti vállalkozásoknak tervezett webshop rendszer.

## Egy mondatos leírás
Ez a rendszer egy olyan épületgépészeti webshopot valósít meg, ahol a vásárlók gyorsan tudnak terméket keresni és rendelni, az admin pedig valós időben kezeli a készletet, rendeléseket és kiemelt tartalmakat.

## Fő funkciók
- vásárlói felület: főoldal, kategóriák, terméklista, termék részletek, kosár, checkout
- Firebase Auth alapú bejelentkezés és regisztráció
- profilkezelés és saját rendelések megtekintése
- admin panel: termékek, készlet, rendelések, felhasználók, főoldali hírek
- Firestore alapú valós adatok (termékek, rendelések, felhasználói profilok)
- helyszíni vásárlás rögzítése és PDF bizonylat készítés
- kuponlogika és akciós termék kezelés (időablak + kedvezmény százalék)
- világos/sötét mód és reszponzív megjelenés

## Technológiai stack
- frontend: Angular (standalone komponensek), TypeScript, HTML, CSS
- backend szolgáltatások: Firebase Spark kompatibilis használat (Auth, Firestore, Hosting)
- adatkezelés: Firestore + lokális kosár (localStorage)

## Gyors indítás lokálisan
### 1) Elvárt környezet
- Node.js: `>=20 <23` (a projekt erre van beállítva)
- npm: a Node verzióhoz tartozó alap npm

### 2) Telepítés
```bash
npm install
```

### 3) Fejlesztői futtatás
```bash
npm start
```

Alapértelmezett cím:
`http://localhost:4200`

## Build és ellenőrzés
```bash
npm run build
npm test -- --watch=false
```

## Firebase deploy (ha szükséges)
```bash
npm run deploy:spark
```

Firestore szabály módosításakor külön futtatható:
```bash
npm run deploy:rules
```

Megjegyzés: a projekt az alap Firebase Spark csomaggal futtatható. Cloud Functions deploy nincs bekötve az alap deployba, mert ahhoz fizetős Blaze csomag kellene.

## Hosted verzió
- élő URL: [https://tdlwebshop.web.app](https://tdlwebshop.web.app)

## Projektstruktúra (röviden)
```text
src/
  app/
    services/
    guards/
    components/
  pages/
    home/
    products/
    product-details/
    cart/
    checkout/
    profile/
    admin/
docs/
  ux/
functions/  # opcionális továbbfejlesztés Blaze csomag esetén
```

## Dokumentáció
- UX dokumentáció: [docs/ux/README.md](docs/ux/README.md)
- Szakdolgozati funkció összefoglaló: [docs/thesis-feature-summary.md](docs/thesis-feature-summary.md)
- Védési kérdés-válasz jegyzet: [docs/thesis-defense-notes.md](docs/thesis-defense-notes.md)
- Bemutató forgatókönyv: [docs/demo-script.md](docs/demo-script.md)
- Végső manuális ellenőrző lista: [docs/final-manual-checklist.md](docs/final-manual-checklist.md)
- Regressziós ellenőrző lista: [docs/testing/regression-checklist.md](docs/testing/regression-checklist.md)
- Projektterv: [project_plan.md](project_plan.md)
