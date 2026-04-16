import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../app/services/auth.service';
import { OrderService } from '../../app/services/order.service';
import { Order } from '../../app/models/order.model';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-orders.html',
  styleUrls: ['./my-orders.css']
})
export class MyOrders implements OnInit, OnDestroy {
  // Saját rendelések nézet állapot.
  orders: Order[] = [];
  loading = true;
  error = '';
  selectedOrder: Order | null = null;
  private unsubscribeOrders?: () => void;

  constructor(
    public authService: AuthService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (!user?.uid) {
      this.loading = false;
      return;
    }

    // Userhez tartozó rendelések realtime streamje.
    this.unsubscribeOrders = this.orderService.getOrdersByUserStream(
      user.uid,
      orders => {
        this.orders = orders;
        this.loading = false;
        this.error = '';
      },
      () => {
        this.loading = false;
        this.error = 'A rendelések betöltése nem sikerült.';
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribeOrders?.();
  }

  openDetails(order: Order): void {
    this.selectedOrder = order;
  }

  closeDetails(): void {
    this.selectedOrder = null;
  }

  getTimelineStep(status: string): number {
    if (status === 'uj') {
      return 1;
    }

    if (status === 'feldolgozas alatt') {
      return 2;
    }

    if (status === 'teljesitve') {
      return 3;
    }

    if (status === 'lemondva') {
      return -1;
    }

    return 0;
  }

  isTimelineReached(status: string, step: number): boolean {
    const currentStep = this.getTimelineStep(status);
    if (currentStep < 0) {
      return false;
    }

    return currentStep >= step;
  }

  formatDate(timestamp?: number): string {
    if (!timestamp) {
      return 'Nincs adat';
    }

    return new Date(timestamp).toLocaleString('hu-HU');
  }

  getOrderItemCount(order: Order): number {
    return order.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  getStatusLabel(status: string): string {
    if (status === 'uj') {
      return 'Uj';
    }

    if (status === 'feldolgozas alatt') {
      return 'Feldolgozas alatt';
    }

    if (status === 'teljesitve') {
      return 'Teljesitve';
    }

    if (status === 'lemondva') {
      return 'Lemondva';
    }

    return status || 'Ismeretlen';
  }
}

