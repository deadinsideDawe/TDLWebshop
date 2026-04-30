# TDL Webshop AI asszisztens OpenRouterrel

Ez a megoldás úgy épül fel, hogy az Angular alkalmazás nem tartalmaz API kulcsot. A felhasználó kérdése és a releváns termékkatalógus-részlet egy szerveroldali proxyhoz kerül, a proxy pedig OpenRouteren keresztül kéri le az AI választ.

## Mit tud az asszisztens?

- A Firestore-ból betöltött termékek alapján ajánl termékeket.
- Figyelembe veszi a kategóriát, nevet, cikkszámot, készletet és árat.
- Épületgépészeti kérdésekre is tud rövid szakmai választ adni.
- Ha nincs beállítva AI proxy, a webshop helyi katalógus-alapú ajánlóra vált vissza.

## Miért kell proxy?

Az OpenRouter API kulcsot nem szabad frontend kódban tárolni, mert a böngészőből bárki ki tudná olvasni. Ezért a kulcs egy Cloudflare Worker titkos változójaként szerepel, az Angular alkalmazás pedig csak a Worker publikus URL-jét ismeri.

## Beüzemelés röviden

1. Hozz létre egy Cloudflare Worker projektet.
2. Másold be a Worker kódját innen:
   `docs/deployment/openrouter-worker.js`
3. Állítsd be a Worker secretet:
   `OPENROUTER_API_KEY`
4. Opcionális környezeti változó:
   `OPENROUTER_MODEL=openrouter/free`
5. A Worker URL-jét írd be az Angular környezeti fájlba:
   `src/environments/environment.prod.ts`

Példa:

```ts
aiAssistantEndpoint: 'https://tdl-ai-assistant.sajat-nev.workers.dev',
```

Ezután:

```bash
npm run build
firebase deploy --only hosting
```

## Fontos leadási megjegyzés

A repóba ne kerüljön valódi OpenRouter kulcs. Ha dokumentálni kell a működést, csak azt írd le, hogy a kulcs a Worker secret tárolójában van, és a frontend kizárólag a proxy endpointot hívja.
