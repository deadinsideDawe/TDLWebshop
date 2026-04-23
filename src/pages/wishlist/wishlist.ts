import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../app/services/cart.service';
import { WishlistItem, WishlistService } from '../../app/services/wishlist.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './wishlist.html',
  styleUrls: ['./wishlist.css']
})
export class Wishlist {
  items: WishlistItem[] = [];

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    private router: Router
  ) {
    this.wishlistService.wishlist$.subscribe(items => {
      this.items = items;
    });
  }

  removeItem(item: WishlistItem): void {
    this.wishlistService.removeFromWishlist(item);
  }

  clearWishlist(): void {
    this.wishlistService.clearWishlist();
  }

  addToCart(item: WishlistItem): void {
    if (!this.canAddToCart(item)) {
      return;
    }

    this.cartService.addToCart({
      id: item.id,
      key: item.key,
      firestoreId: item.firestoreId,
      name: item.name,
      sku: item.sku,
      category: item.category,
      price: item.price,
      image: item.image
    });
  }

  openProduct(item: WishlistItem): void {
    if (item.firestoreId) {
      void this.router.navigate(['/products', item.firestoreId]);
      return;
    }

    void this.router.navigate(['/products'], {
      queryParams: { search: item.name }
    });
  }

  canAddToCart(item: WishlistItem): boolean {
    const stock = (item.stock || '').toLowerCase();
    const stockQuantity = Number(item.stockQuantity ?? 1);
    return stockQuantity > 0 && !stock.includes('nincs');
  }
}
