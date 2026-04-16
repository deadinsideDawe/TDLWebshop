import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../app/services/auth.service';
import { OrderService } from '../../app/services/order.service';
import { UserService } from '../../app/services/user.service';
import { ToastService } from '../../app/services/toast.service';
import { Order } from '../../app/models/order.model';
import { UserProfile } from '../../app/models/user-profile.model';

type ProfileTab = 'profile' | 'orders';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile implements OnInit, OnDestroy {
  activeTab: ProfileTab = 'profile';
  loading = true;
  saving = false;
  profileError = '';
  saveMessage = '';

  orders: Order[] = [];
  ordersLoading = false;
  ordersError = '';
  selectedOrder: Order | null = null;

  email = '';
  displayName = '';
  phone = '';
  accountType: 'private' | 'company' = 'private';
  companyName = '';
  taxNumber = '';

  shippingZip = '';
  shippingCity = '';
  shippingAddress = '';

  billingSameAsShipping = true;
  billingName = '';
  billingZip = '';
  billingCity = '';
  billingAddress = '';

  private authSubscription?: Subscription;
  private unsubscribeOrders?: () => void;

  constructor(
    public authService: AuthService,
    private userService: UserService,
    private orderService: OrderService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.user$.subscribe(user => {
      if (!user?.uid) {
        this.loading = false;
        this.stopOrdersStream();
        return;
      }

      this.email = user.email || '';
      void this.loadProfile(user.uid);
      this.startOrdersStream(user.uid);
    });
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
    this.stopOrdersStream();
  }

  setTab(tab: ProfileTab): void {
    this.activeTab = tab;
  }

  private async loadProfile(uid: string): Promise<void> {
    this.loading = true;
    this.profileError = '';
    this.saveMessage = '';

    try {
      const profile = await this.userService.getUserProfile(uid);
      this.applyProfile(profile);
    } catch {
      this.profileError = 'A profil betöltése nem sikerült.';
    } finally {
      this.loading = false;
    }
  }

  private applyProfile(profile: UserProfile | null): void {
    this.displayName = profile?.displayName || '';
    this.phone = profile?.phone || '';
    this.accountType = profile?.accountType || 'private';
    this.companyName = profile?.companyName || '';
    this.taxNumber = profile?.taxNumber || '';

    this.shippingZip = profile?.shippingAddress?.zip || '';
    this.shippingCity = profile?.shippingAddress?.city || '';
    this.shippingAddress = profile?.shippingAddress?.address || '';

    this.billingSameAsShipping = profile?.billingAddress?.sameAsShipping ?? true;
    this.billingName = profile?.billingAddress?.name || '';
    this.billingZip = profile?.billingAddress?.zip || '';
    this.billingCity = profile?.billingAddress?.city || '';
    this.billingAddress = profile?.billingAddress?.address || '';
  }

  async saveProfile(): Promise<void> {
    const currentUser = this.authService.getUser();
    if (!currentUser?.uid) {
      this.profileError = 'A mentéshez jelentkezz be.';
      return;
    }

    this.saving = true;
    this.profileError = '';
    this.saveMessage = '';

    try {
      await this.userService.updateUserProfile(currentUser.uid, {
        accountType: this.accountType,
        displayName: this.displayName.trim(),
        phone: this.phone.trim(),
        companyName: this.accountType === 'company' ? this.companyName.trim() : '',
        taxNumber: this.accountType === 'company' ? this.taxNumber.trim() : '',
        shippingAddress: {
          zip: this.shippingZip.trim(),
          city: this.shippingCity.trim(),
          address: this.shippingAddress.trim()
        },
        billingAddress: {
          sameAsShipping: this.billingSameAsShipping,
          name: this.billingSameAsShipping ? this.displayName.trim() : this.billingName.trim(),
          zip: this.billingSameAsShipping ? this.shippingZip.trim() : this.billingZip.trim(),
          city: this.billingSameAsShipping ? this.shippingCity.trim() : this.billingCity.trim(),
          address: this.billingSameAsShipping ? this.shippingAddress.trim() : this.billingAddress.trim()
        }
      });

      this.saveMessage = 'A profil adatai sikeresen mentve.';
      this.toastService.success('Profil mentve');
    } catch {
      this.profileError = 'A profil mentése nem sikerült.';
      this.toastService.error('Profil mentése sikertelen', this.profileError);
    } finally {
      this.saving = false;
    }
  }

  private startOrdersStream(userId: string): void {
    this.ordersLoading = true;
    this.ordersError = '';
    this.stopOrdersStream();

    this.unsubscribeOrders = this.orderService.getOrdersByUserStream(
      userId,
      orders => {
        this.orders = orders;
        this.ordersLoading = false;
        this.ordersError = '';
      },
      () => {
        this.orders = [];
        this.ordersLoading = false;
        this.ordersError = 'A rendelések betöltése nem sikerült.';
      }
    );
  }

  private stopOrdersStream(): void {
    this.unsubscribeOrders?.();
    this.unsubscribeOrders = undefined;
  }

  openOrderDetails(order: Order): void {
    this.selectedOrder = order;
  }

  closeOrderDetails(): void {
    this.selectedOrder = null;
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

  formatDate(timestamp?: number): string {
    if (!timestamp) {
      return 'Nincs adat';
    }

    return new Date(timestamp).toLocaleString('hu-HU');
  }

  getOrderItemCount(order: Order): number {
    return order.items.reduce((sum, item) => sum + item.quantity, 0);
  }
}

