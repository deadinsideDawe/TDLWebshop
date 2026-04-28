# Test Report

## Környezet

- Operációs rendszer: Windows fejlesztői környezet
- Frontend: Angular 21
- Nyelv: TypeScript
- Backend szolgáltatások: Firebase Authentication, Cloud Firestore, Firebase Hosting

## Futtatott tesztek

### Build

```bash
npm run build
```

Eredmény: sikeres build.

### Automatizált tesztek

```bash
npm test -- --watch=false
```

Legutóbb ellenőrzött eredmény:

- 14 tesztfájl
- 37 sikeres teszt
- 0 sikertelen teszt

## Tesztelt területek

- kosárlogika,
- chatbot szolgáltatás alap működése,
- számla/bizonylat logika egy része,
- toast és hibakezelés,
- form validátorok,
- admin oldal fő működése,
- cart, categories, checkout, contact, home, login, products oldalak alap működése.

## Manuális ellenőrzések

- kezdőoldal és design működése dark/light módban,
- navigáció és kategória dropdown,
- wishlist,
- profiloldal,
- helyszíni vásárlás felvétele,
- mentett vásárlók kezelése,
- dolgozói és admin jogosultságok.

## Ismert hiányosságok

- nincs teljes Playwright vagy Cypress alapú végponttól végpontig tesztcsomag,
- a Firestore és Auth valós integrációinak többsége manuális bizonyítással lett validálva,
- a teljesítménymérés csak alap szinten dokumentált.
