// Cloudflare Worker proxy a TDL Webshop AI segitohoz.
// Valodi OpenRouter API kulcs nem kerulhet ebbe a fajlba.
// A kulcsot Cloudflare secretkent kell beallitani: OPENROUTER_API_KEY.

const ALLOWED_ORIGINS = new Set([
  'https://tdlwebshop.web.app',
  'https://tdlwebshop.firebaseapp.com',
  'http://localhost:4200',
  'http://127.0.0.1:4200'
]);

function corsHeaders(request) {
  const origin = request.headers.get('Origin') || '';
  const headers = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin'
  };

  if (ALLOWED_ORIGINS.has(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }

  return headers;
}

function jsonResponse(request, body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...corsHeaders(request)
    }
  });
}

function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function isDomainQuestion(message) {
  const normalizedMessage = normalize(message);
  const domainWords = [
    'tdl', 'webshop', 'termek', 'rendeles', 'szallitas', 'fizetes', 'garancia', 'keszlet', 'ar', 'akcio',
    'futes', 'hutes', 'klima', 'viz', 'vizszereles', 'szellozes', 'legtechnika', 'legcsatorna',
    'kazan', 'bojler', 'radiator', 'termosztat', 'padlofutes', 'csap', 'csaptelep', 'mosdo', 'wc',
    'kad', 'zuhany', 'szelep', 'idom', 'alpex', 'press', 'ventilator', 'hovisszanyero', 'paratlanito',
    'furdo', 'lakossagi', 'szereles', 'szerelo', 'szigeteles', 'hoszigeteles'
  ];

  return domainWords.some(word => normalizedMessage.includes(normalize(word)));
}

function sanitizeCatalog(products) {
  return products
    .slice(0, 60)
    .map(product => ({
      id: String(product?.id || ''),
      name: String(product?.name || ''),
      sku: String(product?.sku || ''),
      brand: String(product?.brand || ''),
      category: String(product?.category || ''),
      price: Number(product?.price || 0),
      stockQuantity: Math.max(0, Number(product?.stockQuantity || 0)),
      shortDescription: String(product?.shortDescription || '').slice(0, 240),
      description: String(product?.description || '').slice(0, 500)
    }))
    .filter(product => product.name && product.price >= 0);
}

function parseJsonResult(text) {
  const cleaned = String(text || '')
    .replace(/^```json/i, '')
    .replace(/^```/i, '')
    .replace(/```$/i, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const jsonStart = cleaned.indexOf('{');
    const jsonEnd = cleaned.lastIndexOf('}');
    if (jsonStart >= 0 && jsonEnd > jsonStart) {
      try {
        return JSON.parse(cleaned.slice(jsonStart, jsonEnd + 1));
      } catch {
        return null;
      }
    }
  }

  return null;
}

function buildSystemPrompt() {
  return [
    'Te a TDL Webshop magyar nyelvu epuletgepeszeti asszisztense vagy.',
    'A webshop futes, hutes, vizszereles, szellozes, szerelveny es lakossagi termekekkel foglalkozik.',
    'Termeket kizarolag a megadott katalogusreszletbol ajanlhatsz.',
    'Arat, keszletet, cikkszamot es konkret termeket nem talalhatsz ki.',
    'Ha a katalogusreszlet ures, vagy nincs benne a kerdeshez pontosan illo termek, ne adj vissza productNames/productSkus erteket.',
    'Ilyenkor adj rovid szakmai iranyt, es ird oda, hogy pontos ajanlatert vagy beszerezhetosegert erdemes emailben vagy szemelyesen felkeresni az uzletet.',
    'Szerelesi, gaz vagy villamos biztonsagi kerdesnel jelezd, hogy szakember ellenorzese szukseges.',
    'Nem epuletgepeszeti vagy nem webshopos kerdesre udvariasan utasitsd el a valaszt.',
    'A valasz mindig ervenyes JSON legyen, pontosan ilyen mezokkel:',
    '{"text":"rovid magyar valasz","productNames":["termeknev"],"productSkus":["cikkszam"]}',
    'Maximum 4 termeket adj vissza, de csak akkor, ha azok kozvetlenul illenek a kerdeshez.'
  ].join('\n');
}

function buildUserPrompt(message, catalog) {
  return [
    `Felhasznaloi kerdes: ${message}`,
    '',
    'Relevans TDL Webshop katalogusreszlet JSON formaban:',
    JSON.stringify(catalog)
  ].join('\n');
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response('', { status: 204, headers: corsHeaders(request) });
    }

    if (request.method !== 'POST') {
      return jsonResponse(request, { error: 'method-not-allowed' }, 405);
    }

    if (!env.OPENROUTER_API_KEY) {
      return jsonResponse(request, { error: 'assistant-not-configured' }, 500);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse(request, { error: 'invalid-json' }, 400);
    }

    const message = String(body?.message || '').trim();
    const requestedProducts = Array.isArray(body?.products) ? body.products : [];

    if (!message) {
      return jsonResponse(request, { error: 'missing-message' }, 400);
    }

    if (!isDomainQuestion(message)) {
      return jsonResponse(request, {
        text: 'Ebben csak a TDL Webshop termekeivel, rendeleseivel es epuletgepeszeti temakkal kapcsolatban tudok segiteni.',
        productNames: [],
        productSkus: []
      });
    }

    const catalog = sanitizeCatalog(requestedProducts);
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': env.SITE_URL || 'https://tdlwebshop.web.app',
        'X-Title': 'TDL Webshop AI Assistant'
      },
      body: JSON.stringify({
        model: env.OPENROUTER_MODEL || 'openrouter/auto',
        temperature: 0.15,
        max_tokens: 650,
        messages: [
          { role: 'system', content: buildSystemPrompt() },
          { role: 'user', content: buildUserPrompt(message, catalog) }
        ]
      })
    });

    if (!openRouterResponse.ok) {
      return jsonResponse(request, { error: 'assistant-upstream-error' }, 502);
    }

    const aiData = await openRouterResponse.json();
    const outputText = aiData?.choices?.[0]?.message?.content || '';
    const parsed = parseJsonResult(outputText);

    return jsonResponse(request, {
      text: String(parsed?.text || '').trim(),
      productNames: Array.isArray(parsed?.productNames)
        ? parsed.productNames.slice(0, 4).map(item => String(item || ''))
        : [],
      productSkus: Array.isArray(parsed?.productSkus)
        ? parsed.productSkus.slice(0, 4).map(item => String(item || ''))
        : []
    });
  }
};
