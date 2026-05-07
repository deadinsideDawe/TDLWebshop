# TDL Webshop AI asszisztens OpenRouterrel

Az AI asszisztens ugy epul fel, hogy az Angular alkalmazas nem tartalmaz OpenRouter API kulcsot. A felhasznalo kerdese es a relevans termekkatalogus-reszlet egy szerveroldali proxyhoz kerul, a proxy pedig meghivja az OpenRouter API-t.

## Miert nem Firebase Function az elso eles irany?

A Firebase projekt jelenleg Spark csomagon van. A Firebase Functions secret kezeleshez a Firebase Blaze csomagot ker, ezert az ingyenesebb eles megoldas a Cloudflare Worker proxy.

## Eles mukodes

1. A frontend csak a publikus proxy URL-t ismeri.
2. A valodi OpenRouter kulcs Cloudflare secretkent szerepel.
3. A felhasznalo nem valaszthat modellt a feluleten.
4. A modell szerveroldalon van beallitva, alapertelmezetten: `openrouter/auto`.

## Mit tud az asszisztens?

- A Firestore-bol betoltott termekek alapjan ajanl termekeket.
- Figyelembe veszi a kategoriat, nevet, cikkszamot, keszletet es arat.
- Epuletgepeszeti kerdesekre rovid, ovatos szakmai valaszt ad.
- Nem epuletgepeszeti kerdesnel jelzi, hogy csak webshopos es szakmai temaban tud segiteni.
- Termeket csak a megadott katalogusreszletbol ajanlhat.

## Beuzemeles roviden

1. Hozz letre uj OpenRouter kulcsot.
2. A kulcsot ne ird be fajlba es ne kuldd el chatben.
3. A Worker mappaban allitsd be secretkent:

```powershell
cd workers/openrouter-proxy
npx wrangler login
npx wrangler secret put OPENROUTER_API_KEY
npx wrangler deploy
```

4. A deploy utan kapott Worker URL-t ird be a production endpoint helyere:

```ts
aiAssistantEndpoint: 'https://tdlwebshop-ai.<sajat-subdomain>.workers.dev'
```

## Fontos leadasi megjegyzes

A repoba ne keruljon valodi OpenRouter kulcs. Ha dokumentalni kell a mukodest, csak azt kell leirni, hogy a kulcs szerveroldali secretkent van tarolva, es a frontend kizarolag a proxy endpointot hivja.
