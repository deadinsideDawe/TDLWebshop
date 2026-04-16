import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  id: number;
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

  addToCart(product: { id: number; firestoreId?: string; name: string; sku?: string; category?: string; price: number; image: string }): void {
    const existing = this.items.find(i => i.id === product.id);

    // Ha mar van ilyen termek, csak noveljuk a mennyiseget.
    if (existing) {
      existing.quantity += 1;
    } else {
      this.items.push({
        ...product,
        quantity: 1
      });
    }

    this.sync();
  }

  clearCart(): void {
    this.items = [];
    this.sync();
  }

  removeFromCart(productId: number): void {
    this.items = this.items.filter(item => item.id !== productId);
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
}
