# Test Report

## Környezet

- Operációs rendszer: Windows fejlesztői környezet
- Frontend: Angular 21
- Nyelv: TypeScript
- Backend szolgáltatások: Firebase Authentication, Cloud Firestore, Firebase Hosting
- AI proxy: Cloudflare Worker + OpenRouter
- CI környezet: GitHub Actions, Node 22

## Futtatott ellenőrzések

### Build

```bash
npm run build
```

Eredmény: sikeres build. A build kimenete a `dist/webshop` mappába készült el. Lokálisan Node.js 25 figyelmeztetés jelent meg, mert ez nem LTS verzió; a CI és a javasolt reprodukciós környezet Node 22-t használ.

### Automatizált tesztek

```bash
npm test -- --watch=false
```

Legutóbb ellenőrzött eredmény: 2026-05-08.

- 14 tesztfájl
- 41 sikeres teszt
- 0 sikertelen teszt

## Tesztelt területek

- kosárlogika és mennyiségkezelés;
- chatbot szolgáltatás domain- és termékkatalógus-logikája;
- számla/bizonylat generálás alaplogikája;
- toast és hibakezelés;
- űrlap-validátorok;
- admin oldal fő működése;
- cart, categories, checkout, contact, home, login és products oldalak alap működése.

## Manuális ellenőrzéssel validálandó területek

- kezdőoldal és design működése dark/light módban;
- navigáció és kategória dropdown;
- terméklista, keresés, szűrés, akciós termékek;
- kívánságlista;
- profiloldal és rendeléskövetés;
- checkout validáció és sikeres rendelés;
- helyszíni vásárlás felvétele;
- mentett vásárlók kezelése;
- dolgozói és admin jogosultságok;
- AI asszisztens domain kérdésre, termékkérdésre és nem releváns kérdésre adott válasza.

## Ismert hiányosságok

- Nincs teljes Playwright vagy Cypress alapú end-to-end tesztcsomag.
- A Firestore és Auth valós integrációinak többsége manuális bizonyítással lett validálva.
- A teljesítménymérés csak alap szinten dokumentált.
- A végleges szakdolgozatba még képernyőképekkel kell alátámasztani a fő felhasználói és admin folyamatokat.

## Következtetés

A projekt buildelhető, az automatizált tesztek zöldek, és a fő kliensoldali logikákhoz van regressziós védelem. A beadás szempontjából a legfontosabb maradék feladat a kézi tesztjegyzőkönyv végigpipálása és a GitHub Actions zöld futásának képernyőképes dokumentálása.
