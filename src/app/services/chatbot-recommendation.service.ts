import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

export interface ChatbotRecommendation {
  text: string;
  suggestedProducts: Product[];
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotRecommendationService {
  buildReply(userMessage: string, products: Product[]): ChatbotRecommendation {
    const normalizedMessage = this.normalize(userMessage);
    const maxBudget = this.extractBudget(normalizedMessage);
    const selectedCategory = this.detectCategory(normalizedMessage);

    const filtered = products
      .filter(product => this.isInStock(product))
      .filter(product => !selectedCategory || this.normalize(product.category).includes(selectedCategory))
      .filter(product => maxBudget === null || Number(product.price) <= maxBudget)
      .sort((left, right) => this.score(right, normalizedMessage) - this.score(left, normalizedMessage))
      .slice(0, 4);

    if (filtered.length === 0) {
      return {
        text: 'Ehhez a kéréshez most nem találtam pontos katalógus-találatot. Próbáld meg kategóriával vagy árkerettel, például: "fűtés 15000 Ft alatt".',
        suggestedProducts: []
      };
    }

    const first = filtered[0];
    const text = maxBudget !== null
      ? `A katalógus alapján ezeket javaslom ${maxBudget} Ft alatt. A legerősebb találat: ${first.name}.`
      : `A katalógus alapján ezeket javaslom. A legerősebb találat: ${first.name}.`;

    return {
      text,
      suggestedProducts: filtered
    };
  }

  private score(product: Product, normalizedMessage: string): number {
    const haystack = this.normalize([
      product.name,
      product.category,
      product.shortDescription || '',
      product.description || '',
      product.brand || '',
      product.sku || ''
    ].join(' '));

    const tokens = normalizedMessage.split(/\s+/).filter(token => token.length > 2);
    if (tokens.length === 0) {
      return 1;
    }

    let points = 0;
    for (const token of tokens) {
      if (haystack.includes(token)) {
        points += 3;
      }
    }

    if ((product.isTopProduct || product.isWeeklyDeal) && points > 0) {
      points += 1;
    }

    return points;
  }

  private detectCategory(normalizedMessage: string): string | null {
    const categoryMap: Array<[string, string[]]> = [
      ['futes', ['futes', 'radiator', 'kazan', 'termosztat', 'padlofutes', 'bojler', 'melegviz']],
      ['hutes', ['hutes', 'klima', 'legkondi', 'mobilklima', 'split', 'kondenz']],
      ['viz', ['viz', 'csap', 'csaptelep', 'szuro', 'nyomasmero', 'mosdo', 'wc', 'kad', 'zuhany']],
      ['szellozes', ['szellozes', 'legtechnika', 'legcsatorna', 'ventilator', 'hovisszanyero', 'paratlanito']],
      ['szerelveny', ['szerelveny', 'idom', 'szelep', 'tagulasi', 'press', 'alpex']],
      ['lakossagi', ['lakossagi', 'otthoni', 'haztartasi', 'furdo', 'kiegeszito', 'tukor']]
    ];

    for (const [category, keywords] of categoryMap) {
      if (keywords.some(keyword => normalizedMessage.includes(this.normalize(keyword)))) {
        return category;
      }
    }

    return null;
  }

  private extractBudget(normalizedMessage: string): number | null {
    const regex = /(\d{3,7})\s*(ft|forint|alatt)?/i;
    const match = normalizedMessage.match(regex);
    if (!match) {
      return null;
    }

    const parsed = Number(match[1]);
    return Number.isFinite(parsed) ? parsed : null;
  }

  private isInStock(product: Product): boolean {
    const quantity = Number(product.stockQuantity || 0);
    const stock = this.normalize(product.stock || '');
    return quantity > 0 && !stock.includes('nincs');
  }

  private normalize(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
