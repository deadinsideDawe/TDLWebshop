import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environment';

interface AssistantCatalogProduct {
  id: string;
  name: string;
  sku: string;
  brand: string;
  category: string;
  price: number;
  stockQuantity: number;
  shortDescription: string;
  description: string;
}

export interface LlmRecommendationResult {
  text: string;
  products: Product[];
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotLlmService {
  private readonly modelStorageKey = 'tdl_openrouter_model';
  private readonly defaultModel = 'openrouter/free';

  getModel(): string {
    const stored = (localStorage.getItem(this.modelStorageKey) || '').trim();
    return stored || this.defaultModel;
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
      return null;
    }

    const relevantCatalog = this.buildRelevantCatalog(userMessage, products);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: userMessage,
        model: this.getModel(),
        products: relevantCatalog
      })
    });

    if (!response.ok) {
      throw new Error(`AI proxy hiba (${response.status})`);
    }

    const data = await response.json();
    const text = (data?.text || '').toString().trim();
    const names = Array.isArray(data?.productNames) ? data.productNames : [];
    const skus = Array.isArray(data?.productSkus) ? data.productSkus : [];
    const selected = this.pickProducts(names, skus, products);

    return {
      text: text || 'A kérés alapján összeraktam egy rövid javaslatot.',
      products: selected
    };
  }

  private buildRelevantCatalog(userMessage: string, products: Product[]): AssistantCatalogProduct[] {
    const normalizedMessage = this.normalize(userMessage);
    const tokens = normalizedMessage.split(/\s+/).filter(token => token.length > 2);

    return products
      .filter(product => Number(product.stockQuantity || 0) > 0)
      .map(product => ({
        product,
        score: this.scoreProduct(product, normalizedMessage, tokens)
      }))
      .filter(item => item.score > 0)
      .sort((left, right) => right.score - left.score)
      .slice(0, 28)
      .map(({ product }) => this.toCatalogProduct(product));
  }

  private toCatalogProduct(product: Product): AssistantCatalogProduct {
    return {
      id: product.id || '',
      name: product.name,
      sku: product.sku || '',
      brand: product.brand || '',
      category: product.category,
      price: Number(product.price || 0),
      stockQuantity: Number(product.stockQuantity || 0),
      shortDescription: product.shortDescription || '',
      description: product.description || ''
    };
  }

  private scoreProduct(product: Product, normalizedMessage: string, tokens: string[]): number {
    const haystack = this.normalize([
      product.name,
      product.category,
      product.brand || '',
      product.sku || '',
      product.shortDescription || '',
      product.description || ''
    ].join(' '));

    let points = 0;
    for (const token of tokens) {
      if (haystack.includes(token)) {
        points += 4;
      }
    }

    const categoryHints: Array<[string, string[]]> = [
      ['futes', ['futes', 'kazan', 'radiator', 'termosztat', 'padlofutes', 'bojler', 'melegviz']],
      ['hutes', ['hutes', 'klima', 'legkondi', 'mobilklima', 'split']],
      ['viz', ['viz', 'csap', 'mosdo', 'wc', 'kad', 'zuhany', 'szifon', 'csaptelep']],
      ['szellozes', ['szellozes', 'legtechnika', 'legcsatorna', 'ventilator', 'hovisszanyero', 'paratlanito']],
      ['szerelveny', ['szerelveny', 'idom', 'szelep', 'tagulasi', 'press', 'alpex']],
      ['lakossagi', ['lakossagi', 'otthon', 'furdo', 'kiegeszito', 'torolkozo', 'tukor']]
    ];

    for (const [category, hints] of categoryHints) {
      if (hints.some(hint => normalizedMessage.includes(this.normalize(hint))) && this.normalize(product.category).includes(category)) {
        points += 8;
      }
    }

    if ((product.isTopProduct || product.isWeeklyDeal) && points > 0) {
      points += 2;
    }

    return points;
  }

  private pickProducts(names: unknown[], skus: unknown[], products: Product[]): Product[] {
    const wantedNames = names
      .map(item => (typeof item === 'string' ? this.normalize(item) : ''))
      .filter(Boolean);
    const wantedSkus = skus
      .map(item => (typeof item === 'string' ? this.normalize(item) : ''))
      .filter(Boolean);

    const result: Product[] = [];
    const seen = new Set<string>();

    for (const product of products) {
      const normalizedName = this.normalize(product.name);
      const normalizedSku = this.normalize(product.sku || '');
      const nameMatch = wantedNames.some(name => normalizedName.includes(name) || name.includes(normalizedName));
      const skuMatch = normalizedSku && wantedSkus.includes(normalizedSku);

      if (nameMatch || skuMatch) {
        const key = product.id || product.sku || product.name;
        if (!seen.has(key)) {
          seen.add(key);
          result.push(product);
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
      .replace(/\s+/g, ' ')
      .trim();
  }
}
