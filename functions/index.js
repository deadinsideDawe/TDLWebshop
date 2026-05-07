const { onRequest } = require('firebase-functions/v2/https');
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const logger = require('firebase-functions/logger');
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp();
}

const ALLOWED_ORIGINS = [
  'https://tdlwebshop.web.app',
  'https://tdlwebshop.firebaseapp.com',
  'http://localhost:4200',
  'http://127.0.0.1:4200'
];

function setCorsHeaders(request, response) {
  const origin = request.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    response.set('Access-Control-Allow-Origin', origin);
  }

  response.set('Vary', 'Origin');
  response.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.set('Access-Control-Allow-Headers', 'Content-Type');
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
    'furdo', 'lakossagi', 'szereles', 'szerelo'
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

function buildAssistantSystemPrompt() {
  return [
    'Te a TDL Webshop magyar nyelvű épületgépészeti asszisztense vagy.',
    'A webshop fűtés, hűtés, vízszerelés, szellőzés, szerelvény és lakossági termékekkel foglalkozik.',
    'Terméket kizárólag a megadott katalógusrészletből ajánlhatsz.',
    'Árat, készletet, cikkszámot és konkrét terméket nem találhatsz ki.',
    'Ha nincs pontos terméktalálat, adj rövid szakmai irányt, majd kérj egy pontosító adatot.',
    'Szerelési, gáz vagy villamos biztonsági kérdésnél jelezd, hogy szakember ellenőrzése szükséges.',
    'Nem épületgépészeti vagy nem webshopos kérdésre udvariasan utasítsd el a választ.',
    'A válasz mindig érvényes JSON legyen, pontosan ilyen mezőkkel:',
    '{"text":"rövid magyar válasz","productNames":["terméknév"],"productSkus":["cikkszám"]}',
    'Maximum 4 terméket adj vissza.'
  ].join('\n');
}

function buildAssistantUserPrompt(message, catalog) {
  return [
    `Felhasználói kérdés: ${message}`,
    '',
    'Releváns TDL Webshop katalógusrészlet JSON formában:',
    JSON.stringify(catalog)
  ].join('\n');
}

function buildOrderConfirmationMessage(order, orderId) {
  const items = Array.isArray(order.items) ? order.items : [];
  const lines = items
    .map(item => `- ${item.name || 'Termék'} x${Number(item.quantity) || 0} - ${(Number(item.price) || 0) * (Number(item.quantity) || 0)} Ft`)
    .join('\n');
  const htmlItems = items
    .map(item => `<li>${item.name || 'Termék'} x${Number(item.quantity) || 0} - ${(Number(item.price) || 0) * (Number(item.quantity) || 0)} Ft</li>`)
    .join('');
  const shippingMethod = order.shippingMethod?.label || 'Nincs megadva';
  const paymentMethod = order.paymentMethod?.label || 'Nincs megadva';
  const total = Number(order.total) || 0;
  const customerName = order.customerName || 'Vásárló';

  return {
    subject: `TDL Webshop rendelési visszaigazolás - ${orderId}`,
    text: [
      `Kedves ${customerName}!`,
      '',
      'Köszönjük a rendelésedet a TDL Webshopban.',
      `Rendelés azonosító: ${orderId}`,
      `Szállítási mód: ${shippingMethod}`,
      `Fizetési mód: ${paymentMethod}`,
      '',
      'Rendelt termékek:',
      lines,
      '',
      `Végösszeg: ${total} Ft`,
      '',
      'Üdv,',
      'TDL Webshop'
    ].join('\n'),
    html: `
      <p>Kedves ${customerName}!</p>
      <p>Köszönjük a rendelésedet a TDL Webshopban.</p>
      <p><strong>Rendelés azonosító:</strong> ${orderId}</p>
      <p><strong>Szállítási mód:</strong> ${shippingMethod}<br/>
      <strong>Fizetési mód:</strong> ${paymentMethod}</p>
      <p><strong>Rendelt termékek:</strong></p>
      <ul>${htmlItems}</ul>
      <p><strong>Végösszeg:</strong> ${total} Ft</p>
      <p>Üdv,<br/>TDL Webshop</p>
    `
  };
}

exports.queueOrderConfirmationEmail = onDocumentCreated(
  {
    document: 'orders/{orderId}',
    region: 'europe-west1'
  },
  async event => {
    const order = event.data?.data();
    const orderId = event.params.orderId;
    const email = String(order?.customerEmail || '').trim().toLowerCase();

    if (!order || !email) {
      logger.warn('Order confirmation skipped: missing order or email', { orderId });
      return;
    }

    const message = buildOrderConfirmationMessage(order, orderId);
    await admin.firestore().collection('mail').add({
      to: [email],
      message,
      createdAt: Date.now(),
      source: 'order-create-trigger',
      orderId
    });
  }
);

const assistantHandler = onRequest(
  {
    region: 'europe-west1',
    cors: false,
    secrets: ['OPENROUTER_API_KEY']
  },
  async (request, response) => {
    setCorsHeaders(request, response);

    if (request.method === 'OPTIONS') {
      response.status(204).send('');
      return;
    }

    if (request.method !== 'POST') {
      response.status(405).json({ error: 'method-not-allowed' });
      return;
    }

    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterApiKey) {
      logger.error('OPENROUTER_API_KEY missing in Functions environment');
      response.status(500).json({ error: 'assistant-not-configured' });
      return;
    }

    const message = String(request.body?.message || '').trim();
    const requestedProducts = Array.isArray(request.body?.products) ? request.body.products : [];

    if (!message) {
      response.status(400).json({ error: 'missing-message' });
      return;
    }

    if (!isDomainQuestion(message)) {
      response.status(200).json({
        text: 'Ebben csak a TDL Webshop termékeivel, rendeléseivel és épületgépészeti témákkal kapcsolatban tudok segíteni.',
        productNames: [],
        productSkus: []
      });
      return;
    }

    const model = String(process.env.OPENROUTER_MODEL || 'openrouter/auto').trim();
    const catalog = sanitizeCatalog(requestedProducts);

    try {
      const aiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openRouterApiKey}`,
          'HTTP-Referer': process.env.SITE_URL || 'https://tdlwebshop.web.app',
          'X-Title': 'TDL Webshop AI Assistant'
        },
        body: JSON.stringify({
          model,
          temperature: 0.15,
          max_tokens: 650,
          messages: [
            { role: 'system', content: buildAssistantSystemPrompt() },
            { role: 'user', content: buildAssistantUserPrompt(message, catalog) }
          ]
        })
      });

      if (!aiResponse.ok) {
        const errorText = await aiResponse.text();
        logger.error('OpenRouter response error', {
          status: aiResponse.status,
          body: errorText.slice(0, 400)
        });
        response.status(502).json({ error: 'assistant-upstream-error' });
        return;
      }

      const aiData = await aiResponse.json();
      const outputText = aiData?.choices?.[0]?.message?.content || '';
      const parsed = parseJsonResult(outputText);

      response.status(200).json({
        text: String(parsed?.text || '').trim(),
        productNames: Array.isArray(parsed?.productNames)
          ? parsed.productNames.slice(0, 4).map(item => String(item || ''))
          : [],
        productSkus: Array.isArray(parsed?.productSkus)
          ? parsed.productSkus.slice(0, 4).map(item => String(item || ''))
          : []
      });
    } catch (error) {
      logger.error('Assistant proxy failed', error);
      response.status(500).json({ error: 'assistant-internal-error' });
    }
  }
);

exports.aiAssistant = assistantHandler;
exports.askAssistant = assistantHandler;
