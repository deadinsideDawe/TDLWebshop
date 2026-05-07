import { ChatbotLlmService } from './chatbot-llm.service';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environment';

describe('ChatbotLlmService', () => {
  let service: ChatbotLlmService;
  let originalEndpoint: string;

  beforeEach(() => {
    originalEndpoint = environment.aiAssistantEndpoint;
    environment.aiAssistantEndpoint = 'https://example.test/assistant';
    service = new ChatbotLlmService();
  });

  afterEach(() => {
    environment.aiAssistantEndpoint = originalEndpoint;
  });

  it('keeps model selection server controlled', () => {
    service.setModel('user-selected-model');
    expect(service.getModel()).toBe('server-controlled');
  });

  it('does not call the AI proxy for non-domain questions', async () => {
    const originalFetch = globalThis.fetch;
    let fetchCalled = false;
    globalThis.fetch = (() => {
      fetchCalled = true;
      return Promise.resolve(new Response('{}', { status: 200 }));
    }) as typeof fetch;

    const result = await service.recommend('Ki nyerte tegnap a meccset?', []);

    expect(fetchCalled).toBe(false);
    expect(result?.products.length).toBe(0);
    expect(result?.text).toContain('epuletgepeszeti');

    globalThis.fetch = originalFetch;
  });

  it('maps proxy productNames to concrete products', async () => {
    const products: Product[] = [
      {
        id: 'p1',
        name: 'Termosztatikus radiatorszelep',
        category: 'Futes',
        price: 12990,
        image: 'x.jpg',
        stock: 'Keszleten',
        stockQuantity: 10
      },
      {
        id: 'p2',
        name: 'Golyoscsap 1/2',
        category: 'Viz',
        price: 2990,
        image: 'y.jpg',
        stock: 'Keszleten',
        stockQuantity: 15
      }
    ];

    const originalFetch = globalThis.fetch;
    globalThis.fetch = (() =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            text: 'Ajanlott termekek',
            productNames: ['radiatorszelep']
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      )) as typeof fetch;

    const result = await service.recommend('Futeshez keresek termeket', products);

    expect(result).not.toBeNull();
    expect(result?.products.length).toBe(1);
    expect(result?.products[0].id).toBe('p1');

    globalThis.fetch = originalFetch;
  });

  it('does not show products when the proxy returns only irrelevant catalog names', async () => {
    const products: Product[] = [
      {
        id: 'p1',
        name: 'Hajdu PT HC 200 indirekt tarolo',
        category: 'Futes',
        price: 289990,
        image: 'bojler.jpg',
        stock: 'Keszleten',
        stockQuantity: 4,
        description: 'HMV tarolo es melegviz keszites nagyobb haztartasokhoz.'
      },
      {
        id: 'p2',
        name: 'Tork keztorlo papir tekercses',
        category: 'Lakossagi megoldasok',
        price: 2440,
        image: 'papir.jpg',
        stock: 'Keszleten',
        stockQuantity: 12
      }
    ];

    const originalFetch = globalThis.fetch;
    globalThis.fetch = (() =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            text: 'Hat fos csaladhoz nagyobb HMV tarolo javasolt.',
            productNames: ['Tork keztorlo papir tekercses']
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      )) as typeof fetch;

    const result = await service.recommend('Milyen bojler kell egy 6 fos csaladnak?', products);

    expect(result).not.toBeNull();
    expect(result?.products).toEqual([]);

    globalThis.fetch = originalFetch;
  });

  it('does not fall back to unrelated catalog products for a specific missing product intent', async () => {
    const products: Product[] = [
      {
        id: 'p1',
        name: 'Tork keztorlo papir tekercses',
        category: 'Lakossagi megoldasok',
        price: 2440,
        image: 'papir.jpg',
        stock: 'Keszleten',
        stockQuantity: 12
      },
      {
        id: 'p2',
        name: 'Soudal szaniter szilikon transzparens',
        category: 'Lakossagi megoldasok',
        price: 2690,
        image: 'szilikon.jpg',
        stock: 'Keszleten',
        stockQuantity: 8
      }
    ];

    const originalFetch = globalThis.fetch;
    globalThis.fetch = (() =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            text: 'Altalanos bojler meretezesi iranyt tudok adni, konkret termekert erdemes erdeklodni.',
            productNames: ['Tork keztorlo papir tekercses', 'Soudal szaniter szilikon transzparens']
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      )) as typeof fetch;

    const result = await service.recommend('Milyen bojler kell egy 6 fos csaladnak?', products);

    expect(result).not.toBeNull();
    expect(result?.products).toEqual([]);

    globalThis.fetch = originalFetch;
  });

  it('does not call the proxy with generic featured products when there is no meaningful catalog match', async () => {
    const products: Product[] = [
      {
        id: 'p1',
        name: 'Tork keztorlo papir tekercses',
        category: 'Lakossagi megoldasok',
        price: 2440,
        image: 'papir.jpg',
        stock: 'Keszleten',
        stockQuantity: 12,
        isTopProduct: true
      }
    ];

    const originalFetch = globalThis.fetch;
    let fetchCalled = false;
    globalThis.fetch = (() => {
      fetchCalled = true;
      return Promise.resolve(new Response('{}', { status: 200 }));
    }) as typeof fetch;

    const result = await service.recommend('Milyen szigetelest ajanlasz?', products);

    expect(fetchCalled).toBe(false);
    expect(result?.products).toEqual([]);
    expect(result?.text).toContain('beszerezhetosegert');

    globalThis.fetch = originalFetch;
  });
});
