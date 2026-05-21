import { Injectable } from '@angular/core';
import { onAuthStateChanged } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';
import { auth } from '../firebase';

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
  private readonly legacyStorageKey = 'wishlist';
  private readonly guestStorageKey = 'wishlist:guest';
  private activeStorageKey = this.guestStorageKey;
  private items: WishlistItem[] = [];
  private itemsSubject = new BehaviorSubject<WishlistItem[]>([]);

  wishlist$ = this.itemsSubject.asObservable();

  constructor() {
    this.loadFromStorage(this.activeStorageKey);
    this.itemsSubject.next([...this.items]);

    onAuthStateChanged(auth, user => {
      this.persist();
      this.items = [];
      this.itemsSubject.next([]);
      this.activeStorageKey = user?.uid ? `wishlist:user:${user.uid}` : this.guestStorageKey;
      this.loadFromStorage(this.activeStorageKey);
      this.itemsSubject.next([...this.items]);
    });
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
    localStorage.removeItem(this.activeStorageKey);
    this.itemsSubject.next([...this.items]);
  }

  private sync(): void {
    this.persist();
    this.itemsSubject.next([...this.items]);
  }

  private persist(): void {
    localStorage.setItem(this.activeStorageKey, JSON.stringify(this.items));
  }

  private loadFromStorage(key: string): void {
    const saved = localStorage.getItem(key)
      || (key === this.guestStorageKey ? localStorage.getItem(this.legacyStorageKey) : null);

    if (!saved) {
      this.items = [];
      return;
    }

    try {
      this.items = JSON.parse(saved) as WishlistItem[];
    } catch {
      this.items = [];
    }
  }

  private getItemKey(item: { id: number; key?: string; firestoreId?: string; sku?: string; name?: string }): string {
    return item.key || item.firestoreId || item.sku || item.name || String(item.id);
  }
}
