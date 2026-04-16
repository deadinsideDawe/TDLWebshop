import { ChatbotLlmService } from './chatbot-llm.service';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environment';

describe('ChatbotLlmService', () => {
  let service: ChatbotLlmService;
  let storage: Record<string, string>;
  let originalEndpoint: string;

  beforeEach(() => {
    storage = {};

    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: {
        getItem: (key: string) => (key in storage ? storage[key] : null),
        setItem: (key: string, value: string) => {
          storage[key] = value;
        },
        removeItem: (key: string) => {
          delete storage[key];
        }
      }
    });

    originalEndpoint = environment.aiAssistantEndpoint;
    environment.aiAssistantEndpoint = 'https://example.test/assistant';
    service = new ChatbotLlmService();
  });

  afterEach(() => {
    environment.aiAssistantEndpoint = originalEndpoint;
  });

  it('stores and reads model from localStorage', () => {
    service.setModel('gpt-4.1-mini');
    expect(service.getModel()).toBe('gpt-4.1-mini');
  });

  it('maps proxy productNames to concrete products', async () => {
    const products: Product[] = [
      {
        id: 'p1',
        name: 'Termosztatikus radiátorszelep',
        category: 'Fűtés',
        price: 12990,
        image: 'x.jpg',
        stock: 'Készleten',
        stockQuantity: 10
      },
      {
        id: 'p2',
        name: 'Golyóscsap 1/2',
        category: 'Víz',
        price: 2990,
        image: 'y.jpg',
        stock: 'Készleten',
        stockQuantity: 15
      }
    ];

    const originalFetch = globalThis.fetch;
    globalThis.fetch = (() =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            text: 'Ajánlott termékek',
            productNames: ['radiátorszelep']
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      )) as typeof fetch;

    const result = await service.recommend('Fűtéshez keresek terméket', products);

    expect(result).not.toBeNull();
    expect(result?.products.length).toBe(1);
    expect(result?.products[0].id).toBe('p1');

    globalThis.fetch = originalFetch;
  });
});
