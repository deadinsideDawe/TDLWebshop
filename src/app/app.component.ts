import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ThemeService } from './services/theme.service';
import { CartService } from './services/cart.service';
import { AuthService } from './services/auth.service';
import { WishlistService } from './services/wishlist.service';
import { ToastContainer } from './components/toast-container/toast-container';
import { ShopAssistantComponent } from './components/shop-assistant/shop-assistant';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink, ToastContainer, ShopAssistantComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Fejlec UI allapotok.
  menuOpen = false;
  searchTerm = '';
  cartCount = 0;
  wishlistCount = 0;
  headerLogo = 'tdl-header-logo.svg';

  constructor(
    public themeService: ThemeService,
    public authService: AuthService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private router: Router
  ) {
    // Kosar darabszamot realtime frissitjuk a service streambol.
    this.cartService.cart$.subscribe(items => {
      this.cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
    });

    this.wishlistService.wishlist$.subscribe(items => {
      this.wishlistCount = items.length;
    });
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  search(): void {
    const trimmed = this.searchTerm.trim();

    // A fejlec kereses a products oldalt nyitja query parammal.
    this.closeMenu();
    void this.router.navigate(['/products'], {
      queryParams: trimmed ? { search: trimmed } : {}
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    await this.router.navigate(['/']);
  }

  isAdminUser(): boolean {
    return this.authService.isCurrentUserAdmin();
  }

  canShowMyOrdersByEmail(email?: string | null): boolean {
    // Role alapú adminnál nem elég az email-listát nézni, ezért a teljes admin állapotot kérdezzük.
    return !!email && !this.authService.isCurrentUserAdmin();
  }

  canShowMyOrders(): boolean {
    return this.canShowMyOrdersByEmail(this.authService.getUser()?.email);
  }
}
