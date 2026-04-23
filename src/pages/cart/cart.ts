import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService, CartItem } from '../../app/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class Cart {
  // A template ezt a helyi listat rendereli.
  items: CartItem[] = [];

  constructor(
    public cartService: CartService,
    private router: Router
  ) {
    // Realtime kosar streamre feliratkozas.
    this.cartService.cart$.subscribe(items => {
      this.items = items;
    });
  }

  removeItem(item: CartItem | number): void {
    this.cartService.removeFromCart(item);
  }

  goToCheckout(): void {
    void this.router.navigate(['/checkout']);
  }
}
