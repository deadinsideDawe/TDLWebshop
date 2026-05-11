# Test Report

## Kornyezet

- Operacios rendszer: Windows fejlesztoi kornyezet
- Frontend: Angular 21
- Nyelv: TypeScript
- Backend szolgaltatasok: Firebase Authentication, Cloud Firestore, Firebase Hosting
- AI proxy: Cloudflare Worker + OpenRouter
- CI kornyezet: GitHub Actions, Node 22

## Futtatott ellenorzesek

### Build

```bash
npm run build
```

Legutobb ellenorizve: 2026-05-11.

Eredmeny: sikeres build. A kimenet a `dist/webshop` mappaba keszult. Lokalisan Node.js 25 kornyezetben figyelmeztetes jelent meg, mert ez nem LTS verzio; a CI es a javasolt reprodukcios kornyezet Node 22-t hasznal.

### Automatizalt tesztek

```bash
npm test -- --watch=false
```

Legutobb ellenorizve: 2026-05-11.

- 14 tesztfajl
- 41 sikeres teszt
- 0 sikertelen teszt

### NPM audit

```bash
npm audit
npm audit --omit=dev
```

Legutobb ellenorizve: 2026-05-11.

Eredmeny:
- `npm audit`: 0 ismert serulekenyseg.
- `npm audit --omit=dev`: 0 ismert production serulekenyseg.

## Tesztelt teruletek

- kosarlogika es mennyisegkezeles;
- chatbot szolgaltatas domain- es termekkatalogus-logikaja;
- szamla/bizonylat generalas alaplogikaja;
- toast es hibakezeles;
- urlap-validatorok;
- admin oldal fo mukodese;
- cart, categories, checkout, contact, home, login es products oldalak alap mukodese;
- kuponlogika es checkout szamitas;
- admin statuszvaltas es keszletvaltozas logikai tesztje.

## Konzulensi kockazatokra adott valasz

| Kockazat | Kezeles |
|---|---|
| Webes rendelesnel keszlethiany teljesiteskor | Az `OrderService` teljesitesi tranzakcioja keszlethiany eseten hibat dob, nem nullara kerekiti a keszletet. |
| Dolgozoi jogosultsag tul tag alapertelmezesbol | A dolgozo alapbol nem kap automatikus muveleti jogot; az admin explicit adja meg a jogosultsagokat. |
| Guest profil email-alapu azonosito | A profil id mar nem olvashato email-slug, hanem hash alapu determinisztikus azonosito. |
| AI proxy visszaeles | A Worker CORS mellett alap rate limitet alkalmaz, es a kulcs tovabbra is szerveroldali secret. |
| Kliensoldali vegosszeg | MVP-korlatkent dokumentalando; eles tovabbfejleszteskent szerveroldali ar- es kuponellenorzes javasolt. |

## Manualis ellenorzessel validalando teruletek

- kezdooldal es design mukodese dark/light modban;
- navigacio es kategoria dropdown;
- termeklista, kereses, szures, akcios termekek;
- kivansaglista;
- profiloldal es rendeleskovetes;
- checkout validacio es sikeres rendeles;
- helyszini vasarlas felvetele;
- mentett vasarlok kezelese;
- dolgozoi es admin jogosultsagok;
- AI asszisztens domain kerdesre, termekkerdesre es nem relevans kerdesre adott valasza.

## Ismert hianyossagok

- Nincs teljes Playwright vagy Cypress alapu end-to-end tesztcsomag.
- A Firestore es Auth valos integracioinak tobbsege manualis bizonyitassal validalhato.
- A teljesitmenymeres csak alap szinten dokumentalt.
- A vegleges szakdolgozatba meg kepernyokepekkel kell alatamasztani a fo felhasznaloi es admin folyamatokat.
- A vegleges beadas elott a build/test/audit parancsokat meg egyszer erdemes frissen lefuttatni, hogy a dolgozatban szereplo bizonyitek a leadaskori allapotot mutassa.

## Kovetkeztetes

A projekt buildelheto, az automatizalt tesztek zoldek, es a fo kliensoldali logikakhoz van regresszios vedelem. A 2026-05-11-i ellenorzes alapjan a production audit sem jelzett ismert serulekenyseget. A beadas szempontjabol a legfontosabb maradek feladat a kezi tesztjegyzokonyv vegigpipalasa, a GitHub Actions zold futasanak kepernyokepes dokumentalasa, valamint a bizonyitekok beemelese a dolgozatba.
