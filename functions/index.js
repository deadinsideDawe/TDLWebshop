const { onRequest } = require('firebase-functions/v2/https');
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const logger = require('firebase-functions/logger');
const admin = require('firebase-admin');

if (!admin.apps.length) {
  // Firebase Admin init csak egyszer.
  admin.initializeApp();
}

const ALLOWED_ORIGINS = [
  'https://tdlwebshop.web.app',
  'https://tdlwebshop.firebaseapp.com',
  'http://localhost:4200',
  'http://127.0.0.1:4200'
];

function setCorsHeaders(request, response) {
  // Csak ismert originről engedjük a böngészős hívást.
  const origin = request.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    response.set('Access-Control-Allow-Origin', origin);
  }

  response.set('Vary', 'Origin');
  response.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.set('Access-Control-Allow-Headers', 'Content-Type');
}

function extractOutputText(data) {
  if (typeof data?.output_text === 'string' && data.output_text.trim()) {
    return data.output_text;
  }

  const outputs = Array.isArray(data?.output) ? data.output : [];
  for (const item of outputs) {
    const content = Array.isArray(item?.content) ? item.content : [];
    for (const part of content) {
      if (typeof part?.text === 'string' && part.text.trim()) {
        return part.text;
      }
    }
  }

  return '';
}

function parseJsonResult(text) {
  const cleaned = (text || '')
    .replace(/^```json/i, '')
    .replace(/^```/i, '')
    .replace(/```$/i, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

function buildOrderConfirmationMessage(order, orderId) {
  const items = Array.isArray(order.items) ? order.items : [];
  const lines = items
    .map(item => `- ${item.name || 'Termek'} x${Number(item.quantity) || 0} - ${(Number(item.price) || 0) * (Number(item.quantity) || 0)} Ft`)
    .join('\n');
  const htmlItems = items
    .map(item => `<li>${item.name || 'Termek'} x${Number(item.quantity) || 0} - ${(Number(item.price) || 0) * (Number(item.quantity) || 0)} Ft</li>`)
    .join('');
  const shippingMethod = order.shippingMethod?.label || 'Nincs megadva';
  const paymentMethod = order.paymentMethod?.label || 'Nincs megadva';
  const total = Number(order.total) || 0;
  const customerName = order.customerName || 'Vasarlo';

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
    // A rendelés-visszaigazoló emailt szerver oldalon queue-oljuk,
    // mert vendég vásárló nem írhat közvetlenül a mail kollekcióba.
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

exports.askAssistant = onRequest(
  {
    region: 'europe-west1',
    cors: false
  },
  async (request, response) => {
    // CORS preflight lekezelése.
    setCorsHeaders(request, response);

    if (request.method === 'OPTIONS') {
      response.status(204).send('');
      return;
    }

    if (request.method !== 'POST') {
      response.status(405).json({ error: 'method-not-allowed' });
      return;
    }

    const openAiApiKey = process.env.OPENAI_API_KEY;
    if (!openAiApiKey) {
      // Titok nélküli környezetben direkt hibát adunk vissza.
      logger.error('OPENAI_API_KEY missing in Functions environment');
      response.status(500).json({ error: 'assistant-not-configured' });
      return;
    }

    const message = String(request.body?.message || '').trim();
    const preferredModel = String(request.body?.model || '').trim();
    const requestedProducts = Array.isArray(request.body?.products) ? request.body.products : [];

    if (!message) {
      response.status(400).json({ error: 'missing-message' });
      return;
    }

    const model = preferredModel || 'gpt-4.1-mini';
    const catalog = requestedProducts
      // A prompt méret és költség kontroll miatt limitáljuk a bemenetet.
      .slice(0, 150)
      .map(product => ({
        id: String(product?.id || ''),
        name: String(product?.name || ''),
        category: String(product?.category || ''),
        price: Number(product?.price || 0),
        stockQuantity: Math.max(0, Number(product?.stockQuantity || 0)),
        shortDescription: String(product?.shortDescription || ''),
        description: String(product?.description || '')
      }))
      .filter(product => product.name && product.price >= 0);

    try {
      // OpenAI Responses API hívás szerver oldalon (kulcs nem jut kliensbe).
      const aiResponse = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAiApiKey}`
        },
        body: JSON.stringify({
          model,
          temperature: 0.2,
          max_output_tokens: 500,
          input: [
            {
              role: 'system',
              content: [
                {
                  type: 'input_text',
                  text: [
                    'Te egy magyar épületgépészeti webshop asszisztens vagy.',
                    'Csak a kapott terméklistából ajánlhatsz.',
                    'Mindig magyarul válaszolj.',
                    'A válasz kötelezően JSON legyen ebben a formában:',
                    '{"text":"...","productNames":["termék1","termék2","termék3"]}',
                    'A productNames mezőbe maximum 4 elemet adj.'
                  ].join(' ')
                }
              ]
            },
            {
              role: 'user',
              content: [
                {
                  type: 'input_text',
                  text: `Vásárlói kérdés: ${message}\n\nTerméklista: ${JSON.stringify(catalog)}`
                }
              ]
            }
          ]
        })
      });

      if (!aiResponse.ok) {
        const errorText = await aiResponse.text();
        logger.error('OpenAI response error', {
          status: aiResponse.status,
          body: errorText.slice(0, 400)
        });
        response.status(502).json({ error: 'assistant-upstream-error' });
        return;
      }

      const aiData = await aiResponse.json();
      const outputText = extractOutputText(aiData);
      const parsed = parseJsonResult(outputText);

      response.status(200).json({
        // Frontend csak ezt a minimális választ kapja vissza.
        text: String(parsed?.text || '').trim(),
        productNames: Array.isArray(parsed?.productNames)
          ? parsed.productNames.slice(0, 4).map(item => String(item || ''))
          : []
      });
    } catch (error) {
      logger.error('Assistant proxy failed', error);
      response.status(500).json({ error: 'assistant-internal-error' });
    }
  }
);
