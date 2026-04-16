import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';

// Lusta (lazy) route-ok: csak akkor toltjuk be az oldalt, amikor tenyleg kell.
export const routes: Routes = [
  { path: '', loadComponent: () => import('../pages/home/home').then(m => m.Home) },
  { path: 'products', loadComponent: () => import('../pages/products/products').then(m => m.Products) },
  { path: 'products/:id', loadComponent: () => import('../pages/product-details/product-details').then(m => m.ProductDetails) },
  { path: 'categories', loadComponent: () => import('../pages/categories/categories').then(m => m.Categories) },
  { path: 'cart', loadComponent: () => import('../pages/cart/cart').then(m => m.Cart) },
  { path: 'checkout', loadComponent: () => import('../pages/checkout/checkout').then(m => m.Checkout) },
  { path: 'order-success', loadComponent: () => import('../pages/order-success/order-success').then(m => m.OrderSuccess) },
  { path: 'profile', loadComponent: () => import('../pages/profile/profile').then(m => m.Profile) },
  { path: 'my-orders', redirectTo: 'profile' },
  { path: 'login', loadComponent: () => import('../pages/login/login').then(m => m.Login) },
  { path: 'register', loadComponent: () => import('../pages/register/register').then(m => m.Register) },
  // Admin oldalra csak jogosult user mehet be.
  { path: 'admin', loadComponent: () => import('../pages/admin/admin').then(m => m.Admin), canActivate: [adminGuard] },
  { path: '**', redirectTo: '' }
];
