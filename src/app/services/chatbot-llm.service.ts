import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environment';

export interface LlmRecommendationResult {
  text: string;
  products: Product[];
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotLlmService {
  // Csak a modell nevét tároljuk helyben, kulcsot nem.
  private readonly modelStorageKey = 'tdl_openai_model';

  getModel(): string {
    const stored = (localStorage.getItem(this.modelStorageKey) || '').trim();
    return stored || 'gpt-4.1-mini';
  }

  setModel(value: string): void {
    const next = value.trim();
    if (!next) {
      localStorage.removeItem(this.modelStorageKey);
      return;
    }

    localStorage.setItem(this.modelStorageKey, next);
  }

  isConfigured(): boolean {
    return !!environment.aiAssistantEndpoint;
  }

  async recommend(userMessage: string, products: Product[]): Promise<LlmRecommendationResult | null> {
    const endpoint = environment.aiAssistantEndpoint;
    if (!endpoint) {
      // Ha nincs backend endpoint, a komponens fallback ágra vált.
      return null;
    }

    const catalog = products
      .filter(product => (product.stockQuantity || 0) > 0)
      .slice(0, 120)
      .map(product => ({
        id: product.id || '',
        name: product.name,
        category: product.category,
        price: product.price,
        stockQuantity: product.stockQuantity || 0,
        shortDescription: product.shortDescription || '',
        description: product.description || ''
      }));

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // A backend ettől a listától tud konkrét termékeket ajánlani.
        message: userMessage,
        model: this.getModel(),
        products: catalog
      })
    });

    if (!response.ok) {
      throw new Error(`AI proxy hiba (${response.status})`);
    }

    const data = await response.json();
    const text = (data?.text || '').toString().trim();
    const names = Array.isArray(data?.productNames) ? data.productNames : [];
    const selected = this.pickProductsByNames(names, products);

    return {
      text: text || 'Ajánlottam néhány terméket a megadott igény alapján.',
      products: selected
    };
  }

  private pickProductsByNames(names: unknown[], products: Product[]): Product[] {
    // Az AI szöveges találatát valós product objektumokra mappoljuk.
    const normalizedNames = names
      .map(item => (typeof item === 'string' ? item : ''))
      .map(name => this.normalize(name))
      .filter(Boolean);

    if (normalizedNames.length === 0) {
      return [];
    }

    const result: Product[] = [];
    const seen = new Set<string>();

    for (const wanted of normalizedNames) {
      const match = products.find(product => this.normalize(product.name).includes(wanted) || wanted.includes(this.normalize(product.name)));
      if (match) {
        const key = match.id || match.name;
        if (!seen.has(key)) {
          seen.add(key);
          result.push(match);
        }
      }

      if (result.length >= 4) {
        break;
      }
    }

    return result;
  }

  private normalize(value: string): string {
    return (value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }
}
