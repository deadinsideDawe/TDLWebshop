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
import { isValidOptionalPhone } from '../../app/utils/form-validators';

type ProfileTab = 'profile' | 'orders';
type OrderStepState = 'done' | 'active' | 'pending' | 'cancelled';

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
  readonly orderSteps = [
    { id: 'uj', label: 'Rögzítve' },
    { id: 'feldolgozas alatt', label: 'Feldolgozás alatt' },
    { id: 'teljesitve', label: 'Teljesítve' }
  ];

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

    if (!isValidOptionalPhone(this.phone)) {
      this.saving = false;
      this.profileError = 'Adj meg érvényes telefonszámot (8-15 számjegy, pl. +36 30 123 4567).';
      this.toastService.error('Hibás telefonszám', this.profileError);
      return;
    }

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
      return 'Új';
    }

    if (status === 'feldolgozas alatt') {
      return 'Feldolgozás alatt';
    }

    if (status === 'teljesitve') {
      return 'Teljesítve';
    }

    if (status === 'lemondva') {
      return 'Lemondva';
    }

    return status || 'Ismeretlen';
  }

  getOrderStepState(order: Order, stepId: string): OrderStepState {
    if (order.status === 'lemondva') {
      return 'cancelled';
    }

    const stepIndexByStatus: Record<string, number> = {
      uj: 0,
      'feldolgozas alatt': 1,
      teljesitve: 2
    };
    const currentIndex = stepIndexByStatus[order.status] ?? 0;
    const stepIndex = stepIndexByStatus[stepId] ?? 0;

    if (stepIndex < currentIndex) {
      return 'done';
    }

    if (stepIndex === currentIndex) {
      return 'active';
    }

    return 'pending';
  }

  getTrackingText(order: Order): string {
    if (order.status === 'feldolgozas alatt') {
      return 'A rendelés feldolgozás alatt van, hamarosan frissül a következő állapot.';
    }

    if (order.status === 'teljesitve') {
      return 'A rendelés teljesítve lett.';
    }

    if (order.status === 'lemondva') {
      return 'A rendelés lemondva, további feldolgozás nem történik.';
    }

    return 'A rendelés rögzítve lett, feldolgozásra vár.';
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

