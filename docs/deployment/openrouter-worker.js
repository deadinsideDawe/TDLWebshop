const ALLOWED_ORIGINS = new Set([
  'https://tdlwebshop.web.app',
  'https://tdlwebshop.firebaseapp.com',
  'http://localhost:4200',
  'http://127.0.0.1:4200'
]);

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const corsHeaders = buildCorsHeaders(origin);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405, corsHeaders);
    }

    if (!env.OPENROUTER_API_KEY) {
      return jsonResponse({ error: 'Missing OPENROUTER_API_KEY secret' }, 500, corsHeaders);
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return jsonResponse({ error: 'Invalid JSON body' }, 400, corsHeaders);
    }

    const message = String(payload.message || '').trim();
    const model = String(payload.model || env.OPENROUTER_MODEL || 'openrouter/free').trim();
    const products = Array.isArray(payload.products) ? payload.products.slice(0, 30) : [];

    if (!message) {
      return jsonResponse({ error: 'Missing message' }, 400, corsHeaders);
    }

    const aiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': env.SITE_URL || 'https://tdlwebshop.web.app',
        'X-Title': 'TDL Webshop AI Assistant'
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        max_tokens: 700,
        messages: [
          { role: 'system', content: buildSystemPrompt() },
          { role: 'user', content: buildUserPrompt(message, products) }
        ]
      })
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      return jsonResponse({ error: 'OpenRouter request failed', detail: errorText }, 502, corsHeaders);
    }

    const data = await aiResponse.json();
    const rawContent = data?.choices?.[0]?.message?.content || '';
    const parsed = parseAssistantJson(rawContent);

    return jsonResponse(parsed, 200, corsHeaders);
  }
};

function buildCorsHeaders(origin) {
  const allowedOrigin = ALLOWED_ORIGINS.has(origin) ? origin : 'https://tdlwebshop.web.app';
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin'
  };
}

function buildSystemPrompt() {
  return [
    'Te a TDL Webshop magyar nyelvű épületgépészeti AI asszisztense vagy.',
    'A webshop fűtés, hűtés, vízszerelés, szellőzés, szerelvény és lakossági termékekkel foglalkozik.',
    'Ha terméket ajánlasz, kizárólag a megadott termékkatalógus adataira támaszkodj: név, cikkszám, kategória, ár, készlet.',
    'Ne találj ki árat, készletet vagy konkrét terméket, ha az nincs a katalógusban.',
    'Ha a kérdés épületgépészeti jellegű, adj rövid, szakmailag óvatos tanácsot akkor is, ha nincs pontos terméktalálat.',
    'Ha a kérdés nem webshophoz vagy épületgépészethez kapcsolódik, udvariasan jelezd, hogy ebben a témában tudsz segíteni.',
    'Szerelési, gáz- vagy villamos biztonsági kérdésnél jelezd, hogy szakember ellenőrzése szükséges.',
    'Mindig érvényes JSON-t adj vissza ebben a formában: {"text":"válasz","productNames":["termék név"],"productSkus":["cikkszám"]}.'
  ].join('\n');
}

function buildUserPrompt(message, products) {
  const catalog = products.map(product => ({
    id: product.id || '',
    name: product.name || '',
    sku: product.sku || '',
    brand: product.brand || '',
    category: product.category || '',
    price: Number(product.price || 0),
    stockQuantity: Number(product.stockQuantity || 0),
    shortDescription: product.shortDescription || '',
    description: product.description || ''
  }));

  return [
    `Felhasználói kérdés: ${message}`,
    '',
    'Releváns termékkatalógus-részlet JSON formában:',
    JSON.stringify(catalog)
  ].join('\n');
}

function parseAssistantJson(rawContent) {
  const cleaned = String(rawContent || '')
    .replace(/^```json/i, '')
    .replace(/^```/i, '')
    .replace(/```$/i, '')
    .trim();

  try {
    const parsed = JSON.parse(cleaned);
    return {
      text: String(parsed.text || '').trim(),
      productNames: Array.isArray(parsed.productNames) ? parsed.productNames : [],
      productSkus: Array.isArray(parsed.productSkus) ? parsed.productSkus : []
    };
  } catch {
    return {
      text: cleaned || 'Most nem kaptam értelmezhető AI választ, kérlek próbáld újra pontosabb kérdéssel.',
      productNames: [],
      productSkus: []
    };
  }
}

function jsonResponse(body, status, headers) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...headers,
      'Content-Type': 'application/json; charset=utf-8'
    }
  });
}
