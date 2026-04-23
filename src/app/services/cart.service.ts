import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  id: number;
  key?: string;
  firestoreId?: string;
  name: string;
  sku?: string;
  category?: string;
  price: number;
  image: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Kosar allapot localStorage + reactive stream formaban.
  private items: CartItem[] = [];
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);

  cart$ = this.itemsSubject.asObservable();

  constructor() {
    // Oldalfrissites utan is maradjanak meg a kosar tetelek.
    const saved = localStorage.getItem('cart');
    if (saved) {
      this.items = JSON.parse(saved);
      this.itemsSubject.next(this.items);
    }
  }

  getItems(): CartItem[] {
    return this.items;
  }

  addToCart(
    product: { id: number; key?: string; firestoreId?: string; name: string; sku?: string; category?: string; price: number; image: string },
    quantity = 1
  ): void {
    const productKey = this.getItemKey(product);
    const existing = this.items.find(item => this.getItemKey(item) === productKey);
    const safeQuantity = Math.max(1, Math.floor(Number(quantity) || 1));

    // Ha mar van ilyen termek, csak noveljuk a mennyiseget.
    if (existing) {
      existing.quantity += safeQuantity;
    } else {
      this.items.push({
        ...product,
        key: productKey,
        quantity: safeQuantity
      });
    }

    this.sync();
  }

  clearCart(): void {
    this.items = [];
    this.sync();
  }

  removeFromCart(product: CartItem | number | string): void {
    const key = typeof product === 'object' ? this.getItemKey(product) : String(product);
    this.items = this.items.filter(item => this.getItemKey(item) !== key);
    this.sync();
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  private sync(): void {
    // Egy helyen kezeljuk a tarolast + stream frissitest.
    localStorage.setItem('cart', JSON.stringify(this.items));
    this.itemsSubject.next([...this.items]);
  }

  private getItemKey(item: { id: number; key?: string; firestoreId?: string; sku?: string; name?: string }): string {
    return item.key || item.firestoreId || item.sku || String(item.id);
  }
}
