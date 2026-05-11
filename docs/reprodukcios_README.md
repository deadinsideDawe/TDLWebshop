# Reprodukcios README - TDL Webshop

Ez a dokumentum a konzulensi mintacsomag reprodukcios sablonjahoz igazodik. A fo [README.md](../README.md) roviden leirja a futtatast, ez a fajl pedig beadashoz es biraloi ellenorzeshez ad reszletesebb, lepesenkenti utmutatot.

## 1. Cel

A reprodukcios leiras celja, hogy a projekt egy tiszta fejlesztoi kornyezetben is elindithato, buildelheto es ellenorizheto legyen. A rendszer fo resze Angular + Firebase alapu, az AI asszisztens eles mukodesehez pedig kulon Cloudflare Worker proxy tartozik.

## 2. Elofeltetelek

- Node.js LTS: javasolt `20.x` vagy `22.x`.
- npm.
- Firebase CLI, ha deploy vagy sajat Firebase projekt hasznalata is cel.
- Firebase projekt Auth, Firestore es Hosting szolgaltatassal.
- Opcion: Cloudflare fiok es Wrangler, ha az OpenRouter AI proxy is deployolando.

## 3. Telepites

```bash
npm install
```

Ha a `functions/` mappa kulon vizsgalando vagy fejlesztendo:

```bash
cd functions
npm install
```

Fontos: a `node_modules`, `functions/node_modules`, `dist`, `.angular` es hasonlo generalt mappak nem reszei a forraskodnak. Ezeket lokalisan kell ujratelepiteni vagy ujrageneralni.

## 4. Lokalis inditas

```bash
npm start
```

Alapertelmezett fejlesztoi URL:

```text
http://localhost:4200
```

## 5. Build

```bash
npm run build
```

Sikeres build eseten az Angular kimenet a `dist/` mappaba keszul. A `dist/` nem commitolando.

## 6. Automatikus tesztek

```bash
npm test -- --watch=false
```

Az aktualis ellenorzesi cel: a tesztfutas hiba nelkul lefusson, es a GitHub Actions CI is zold legyen.

## 7. Kornyezeti valtozok es titkok

Az `.env.example` csak mintat tartalmaz. Valodi jelszo, token vagy privat API kulcs nem kerulhet a repoba.

| Nev | Mire valo | Hol legyen beallitva? |
|---|---|---|
| `NG_APP_FIREBASE_API_KEY` | Firebase web app konfiguracio mintaja | sajat `.env`, ha lokalis env-alapu konfiguracio kell |
| `NG_APP_AI_ASSISTANT_ENDPOINT` | AI proxy publikus URL-je | Angular environment vagy `.env` |
| `OPENROUTER_API_KEY` | OpenRouter privat kulcs | Cloudflare Worker secret, nem frontend fajl |
| `OPENROUTER_MODEL` | szerveroldali modellvalasztas | Cloudflare Worker env valtozo |
| `RATE_LIMIT_MAX_REQUESTS` | AI proxy percenkenti alap keretszama | Cloudflare Worker env valtozo, opcion |
| `RATE_LIMIT_WINDOW_MS` | AI proxy rate limit idokerete | Cloudflare Worker env valtozo, opcion |

A Firebase web app config onmagaban nem klasszikus titok, de az adatvedelmet a Firestore biztonsagi szabalyok biztositjak. A dolgozatban ezt kulon erdemes roviden megmagyarazni.

## 8. Demo adatok

Demo belepesi adatok publikus repoba nem kerulhetnek. A bemutatohoz es konzulensi kiprobalashoz kulon, privat csatornan adhato meg:

- admin felhasznalo,
- dolgozoi felhasznalo,
- vasarloi felhasznalo.

A termekek CSV importtal vagy admin feluleten keresztul tolthetok fel.

## 9. Deploy

Firebase Hosting:

```bash
firebase deploy --only hosting
```

Firestore rules:

```bash
firebase deploy --only firestore:rules
```

Cloudflare Worker AI proxy:

```bash
cd workers/openrouter-proxy
npx wrangler secret put OPENROUTER_API_KEY
npx wrangler deploy
```

Firebase Functions csak akkor szukseges, ha a projekt Blaze csomagra valt es a szerveroldali funkciok ott futnak:

```bash
firebase deploy --only functions
```

## 10. Beadas elotti minimum ellenorzes

- `npm run build` sikeres.
- `npm test -- --watch=false` sikeres.
- GitHub Actions CI zold.
- A [leadando checklist](leadando_checklist.md) kritikus pontjai pipalva.
- A repo nem tartalmaz valodi titkot vagy generalt fuggosegmappat.
- Az eles oldal betolt: `https://tdlwebshop.web.app`.
- Az AI proxy endpoint valaszt ad domain kerdesre, es nem ad random termekajanlast irrelevans kerdesre.
