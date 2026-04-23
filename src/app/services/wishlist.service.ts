import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface WishlistItem {
  id: number;
  key?: string;
  firestoreId?: string;
  name: string;
  sku?: string;
  category?: string;
  price: number;
  image: string;
  stock?: string;
  stockQuantity?: number;
  shortDescription?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly storageKey = 'wishlist';
  private items: WishlistItem[] = [];
  private itemsSubject = new BehaviorSubject<WishlistItem[]>([]);

  wishlist$ = this.itemsSubject.asObservable();

  constructor() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        this.items = JSON.parse(saved) as WishlistItem[];
      } catch {
        this.items = [];
      }

      this.itemsSubject.next([...this.items]);
    }
  }

  getItems(): WishlistItem[] {
    return [...this.items];
  }

  addToWishlist(product: WishlistItem): void {
    const key = this.getItemKey(product);
    const exists = this.items.some(item => this.getItemKey(item) === key);

    if (exists) {
      return;
    }

    this.items = [
      {
        ...product,
        key
      },
      ...this.items
    ];
    this.sync();
  }

  removeFromWishlist(product: WishlistItem | number | string): void {
    const key = typeof product === 'object' ? this.getItemKey(product) : String(product);
    this.items = this.items.filter(item => this.getItemKey(item) !== key);
    this.sync();
  }

  toggleWishlist(product: WishlistItem): boolean {
    if (this.isInWishlist(product)) {
      this.removeFromWishlist(product);
      return false;
    }

    this.addToWishlist(product);
    return true;
  }

  isInWishlist(product: { id: number; key?: string; firestoreId?: string; sku?: string; name?: string }): boolean {
    const key = this.getItemKey(product);
    return this.items.some(item => this.getItemKey(item) === key);
  }

  clearWishlist(): void {
    this.items = [];
    this.sync();
  }

  private sync(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    this.itemsSubject.next([...this.items]);
  }

  private getItemKey(item: { id: number; key?: string; firestoreId?: string; sku?: string; name?: string }): string {
    return item.key || item.firestoreId || item.sku || item.name || String(item.id);
  }
}
