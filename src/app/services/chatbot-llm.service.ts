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
  getModel(): string {
    return 'server-controlled';
  }

  setModel(_value: string): void {
    // A modell kliensoldalrol nem allithato. A konkret OpenRouter modell
    // szerveroldali kornyezeti valtozoban van, hogy ne lehessen visszaelni vele.
  }

  isConfigured(): boolean {
    return !!environment.aiAssistantEndpoint;
  }

  async recommend(userMessage: string, products: Product[]): Promise<LlmRecommendationResult | null> {
    const endpoint = environment.aiAssistantEndpoint;
    if (!endpoint) {
      return null;
    }

    if (!this.isDomainQuestion(userMessage)) {
      return {
        text: 'Ebben csak a TDL Webshop termekeivel, rendeleseivel es epuletgepeszeti temakkal kapcsolatban tudok segiteni. Irj peldaul futesrol, vizszerelesrol, klimarol, szellozesrol vagy egy konkret termekrol.',
        products: []
      };
    }

    const relevantCatalog = this.buildRelevantCatalog(userMessage, products);
    const noExactCatalogMatchText = 'Ehhez a kerdeshez most nem talaltam eleg pontosan illeszkedo termeket a katalogusban. Altalanos epuletgepeszeti iranyt tudok adni, de pontos ajanlatert es beszerezhetosegert erdemes emailben vagy szemelyesen felkeresni az uzletet.';
    if (relevantCatalog.length === 0) {
      return {
        text: noExactCatalogMatchText,
        products: []
      };
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: userMessage,
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
    const selected = this.pickProducts(names, skus, products, relevantCatalog);
    const proxySuggestedProducts = names.length > 0 || skus.length > 0;
    const safeText = proxySuggestedProducts && selected.length === 0
      ? noExactCatalogMatchText
      : this.ensureContactNote(text || this.buildCatalogFallbackText(relevantCatalog), selected.length > 0);

    return {
      text: safeText,
      products: selected
    };
  }

  private buildRelevantCatalog(userMessage: string, products: Product[]): AssistantCatalogProduct[] {
    const normalizedMessage = this.normalize(userMessage);
    const tokens = normalizedMessage.split(/\s+/).filter(token => token.length > 2);
    const allowedCategories = this.detectAllowedCategories(normalizedMessage);
    const requiredProductTerms = this.detectRequiredProductTerms(normalizedMessage);

    const scored = products
      .filter(product => Number(product.stockQuantity || 0) > 0)
      .filter(product => this.isAllowedCategory(product, allowedCategories))
      .filter(product => this.matchesRequiredProductIntent(product, requiredProductTerms))
      .map(product => ({
        product,
        score: this.scoreProduct(product, normalizedMessage, tokens)
      }))
      .sort((left, right) => right.score - left.score);

    const relevant = scored.filter(item => item.score >= this.minimumCatalogScore(requiredProductTerms)).slice(0, 28);
    if (relevant.length > 0) {
      return relevant.map(({ product }) => this.toCatalogProduct(product));
    }

    return [];
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
        points += token.length > 4 ? 5 : 3;
      }
    }

    for (const [category, hints] of this.categoryHints()) {
      if (hints.some(hint => normalizedMessage.includes(this.normalize(hint))) && this.normalize(product.category).includes(category)) {
        points += 10;
      }
    }

    const hotWaterWords = ['bojler', 'hmv', 'melegviz', 'meleg viz', 'forroviz', 'forro viz', 'tarolo'];
    if (hotWaterWords.some(word => normalizedMessage.includes(this.normalize(word)))) {
      const productText = this.normalize([product.name, product.shortDescription || '', product.description || ''].join(' '));
      if (['bojler', 'hmv', 'melegviz', 'forroviz', 'tarolo', 'hajdu', 'stiebel', 'ariston'].some(word => productText.includes(this.normalize(word)))) {
        points += 20;
      }
    }

    if ((product.isTopProduct || product.isWeeklyDeal) && points > 0) {
      points += 2;
    }

    return points;
  }

  private pickProducts(
    names: unknown[],
    skus: unknown[],
    products: Product[],
    catalog: AssistantCatalogProduct[]
  ): Product[] {
    const wantedNames = names
      .map(item => (typeof item === 'string' ? this.normalize(item) : ''))
      .filter(Boolean);
    const wantedSkus = skus
      .map(item => (typeof item === 'string' ? this.normalize(item) : ''))
      .filter(Boolean);
    const catalogIds = new Set(catalog.map(product => product.id).filter(Boolean));
    const catalogSkus = new Set(catalog.map(product => this.normalize(product.sku)).filter(Boolean));

    const result: Product[] = [];
    const seen = new Set<string>();

    for (const product of products) {
      const inCatalogById = product.id && catalogIds.has(product.id);
      const inCatalogBySku = product.sku && catalogSkus.has(this.normalize(product.sku));
      if (!inCatalogById && !inCatalogBySku) {
        continue;
      }

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

  private buildCatalogFallbackText(catalog: AssistantCatalogProduct[]): string {
    if (catalog.length === 0) {
      return 'Most nincs eleg katalogusadat a pontos ajanlashoz. Pontos termekajanlatert es beszerezhetosegert erdemes emailben vagy szemelyesen felkeresni az uzletet.';
    }

    const names = catalog.slice(0, 3).map(product => product.name).join(', ');
    return `A katalogus alapjan ezek lehetnek jo kiindulopontok: ${names}. Pontos meretezeshez es beszerezhetoseghez erdemes megadni a helyiseg meretet, felhasznalasi celt es arkeretet, vagy felkeresni az uzletet.`;
  }

  private ensureContactNote(text: string, hasConcreteProducts: boolean): string {
    if (!hasConcreteProducts) {
      return text;
    }

    const normalizedText = this.normalize(text);
    if (normalizedText.includes('beszerezhetoseg') || normalizedText.includes('felkeresni az uzletet')) {
      return text;
    }

    return `${text} A pontos kompatibilitasert es beszerezhetosegert erdemes emailben vagy szemelyesen egyeztetni az uzlettel.`;
  }

  private minimumCatalogScore(requiredProductTerms: string[]): number {
    return requiredProductTerms.length > 0 ? 12 : 8;
  }

  private isDomainQuestion(message: string): boolean {
    const normalizedMessage = this.normalize(message);
    const domainWords = [
      'tdl', 'webshop', 'termek', 'rendeles', 'szallitas', 'fizetes', 'garancia', 'keszlet', 'ar', 'akcio',
      'futes', 'hutes', 'klima', 'viz', 'vizszereles', 'szellozes', 'legtechnika', 'legcsatorna',
      'kazan', 'bojler', 'radiator', 'termosztat', 'padlofutes', 'csap', 'csaptelep', 'mosdo', 'wc',
      'kad', 'zuhany', 'szelep', 'idom', 'alpex', 'press', 'ventilator', 'hovisszanyero', 'paratlanito',
      'furdo', 'lakossagi', 'szereles', 'szerelo', 'szigeteles', 'hoszigeteles'
    ];

    return domainWords.some(word => normalizedMessage.includes(this.normalize(word)));
  }

  private detectAllowedCategories(normalizedMessage: string): string[] {
    const exactIntentHints: Array<[string[], string[]]> = [
      [['bojler', 'hmv', 'melegviz', 'meleg viz', 'forroviz', 'forro viz', 'tarolo'], ['futes', 'viz']],
      [['klima', 'legkondi', 'mobilklima', 'split', 'hutes'], ['hutes']],
      [['szellozes', 'legtechnika', 'legcsatorna', 'ventilator', 'hovisszanyero', 'paratlanito'], ['szellozes']],
      [['radiator', 'kazan', 'termosztat', 'padlofutes', 'futes'], ['futes']],
      [['csap', 'csaptelep', 'mosdo', 'wc', 'kad', 'zuhany', 'szifon', 'vizszereles'], ['viz']],
      [['idom', 'szelep', 'alpex', 'press', 'mapress', 'uponor', 'szerelveny'], ['szerelveny']]
    ];

    const categories = new Set<string>();
    for (const [hints, targetCategories] of exactIntentHints) {
      if (hints.some(hint => normalizedMessage.includes(this.normalize(hint)))) {
        targetCategories.forEach(category => categories.add(category));
      }
    }

    return Array.from(categories);
  }

  private detectRequiredProductTerms(normalizedMessage: string): string[] {
    const requiredIntentGroups: string[][] = [
      ['bojler', 'hmv', 'melegviz', 'meleg viz', 'forroviz', 'forro viz', 'tarolo'],
      ['szigeteles', 'szigetelo', 'hoszigeteles']
    ];

    for (const group of requiredIntentGroups) {
      if (group.some(term => normalizedMessage.includes(this.normalize(term)))) {
        return group.map(term => this.normalize(term));
      }
    }

    return [];
  }

  private matchesRequiredProductIntent(product: Product, requiredTerms: string[]): boolean {
    if (requiredTerms.length === 0) {
      return true;
    }

    const productText = this.normalize([
      product.name,
      product.category,
      product.brand || '',
      product.sku || '',
      product.shortDescription || '',
      product.description || ''
    ].join(' '));

    return requiredTerms.some(term => productText.includes(term));
  }

  private isAllowedCategory(product: Product, allowedCategories: string[]): boolean {
    if (allowedCategories.length === 0) {
      return true;
    }

    const normalizedCategory = this.normalize(product.category);
    return allowedCategories.some(category => normalizedCategory.includes(category));
  }

  private categoryHints(): Array<[string, string[]]> {
    return [
      ['futes', ['futes', 'kazan', 'radiator', 'termosztat', 'padlofutes', 'bojler', 'melegviz', 'hocserelo', 'tagulasi', 'hmv', 'tarolo']],
      ['hutes', ['hutes', 'klima', 'legkondi', 'mobilklima', 'split', 'kondenz', 'kazettas']],
      ['viz', ['viz', 'csap', 'mosdo', 'wc', 'kad', 'zuhany', 'szifon', 'csaptelep', 'nyomas', 'szuro', 'bojler', 'melegviz']],
      ['szellozes', ['szellozes', 'legtechnika', 'legcsatorna', 'ventilator', 'hovisszanyero', 'paratlanito', 'legkezelo']],
      ['szerelveny', ['szerelveny', 'idom', 'szelep', 'tagulasi', 'press', 'alpex', 'mapress', 'uponor']],
      ['lakossagi', ['lakossagi', 'otthon', 'furdo', 'kiegeszito', 'torolkozo', 'tukor', 'kuka']]
    ];
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
