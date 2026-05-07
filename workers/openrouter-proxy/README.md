# TDL Webshop AI proxy

Ez a Cloudflare Worker az OpenRouter API kulcsot szerveroldalon tartja.
Az Angular alkalmazas csak a publikus Worker URL-t hivja, igy az API kulcs nem kerul a bongeszobe.

## Beallitas

1. Lepj be Cloudflare-be.
2. A projekt gyokerebol futtasd:

```powershell
cd workers/openrouter-proxy
npx wrangler login
npx wrangler secret put OPENROUTER_API_KEY
npx wrangler deploy
```

3. A deploy utan kapott `workers.dev` URL-t kell beirni az Angular production endpointjahoz:

```ts
aiAssistantEndpoint: 'https://tdlwebshop-ai.<sajat-subdomain>.workers.dev'
```

## Fontos

- A valodi OpenRouter kulcsot soha ne commitold.
- Ha a kulcs bekerult parancssorba, chatbe vagy fajlba, torold OpenRouteren es generalj ujat.
- A felhasznalo nem valaszthat modellt; a modell szerveroldali beallitas.
