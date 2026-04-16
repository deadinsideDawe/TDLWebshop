import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../app/services/order.service';

interface OrderSuccessItem {
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface OrderSuccessSummary {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingMethodLabel: string;
  paymentMethodLabel: string;
  pickupAt?: number;
  subtotal: number;
  shippingFee: number;
  paymentFee: number;
  discount: number;
  couponCode?: string;
  couponDescription?: string;
  total: number;
  items: OrderSuccessItem[];
}

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-success.html',
  styleUrls: ['./order-success.css']
})
export class OrderSuccess implements OnInit {
  // Sikeres rendelést követő összegző oldal.
  orderId = '';
  summary: OrderSuccessSummary | null = null;
  emailSubject = '';
  emailBody = '';
  loading = false;
  loadError = '';

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  async ngOnInit(): Promise<void> {
    this.orderId = this.route.snapshot.queryParamMap.get('orderId') || '';

    // Eloszor sessionStorage-bol probalunk gyorsan osszegzot mutatni.
    const savedSummary = sessionStorage.getItem('lastOrderSummary');
    if (savedSummary) {
      try {
        const parsed = JSON.parse(savedSummary) as Partial<OrderSuccessSummary>;
        const normalized: OrderSuccessSummary = {
          orderId: parsed.orderId || this.orderId,
          customerName: parsed.customerName || '',
          customerEmail: parsed.customerEmail || '',
          customerPhone: parsed.customerPhone || '',
          shippingMethodLabel: parsed.shippingMethodLabel || 'Nincs megadva',
          paymentMethodLabel: parsed.paymentMethodLabel || 'Nincs megadva',
          pickupAt: parsed.pickupAt,
          subtotal: parsed.subtotal ?? parsed.total ?? 0,
          shippingFee: parsed.shippingFee ?? 0,
          paymentFee: parsed.paymentFee ?? 0,
          discount: parsed.discount ?? 0,
          couponCode: parsed.couponCode,
          couponDescription: parsed.couponDescription,
          total: parsed.total ?? 0,
          items: parsed.items || []
        };
        this.summary = normalized;
        if (!this.orderId) {
          this.orderId = normalized.orderId;
        }
        this.buildEmailPreview(normalized);
      } catch (error) {
        console.error(error);
      }
    }

    if (!this.summary && this.orderId) {
      // Ha nincs session adat, Firestore-bol toltjuk vissza.
      await this.loadSummaryFromFirestore(this.orderId);
    }
  }

  getEmailHref(): string {
    if (!this.summary) {
      return 'mailto:';
    }

    return `mailto:${encodeURIComponent(this.summary.customerEmail)}?subject=${encodeURIComponent(this.emailSubject)}&body=${encodeURIComponent(this.emailBody)}`;
  }

  formatDate(timestamp?: number): string {
    if (!timestamp) {
      return 'Nincs adat';
    }

    return new Date(timestamp).toLocaleString('hu-HU');
  }

  private buildEmailPreview(summary: OrderSuccessSummary): void {
    this.emailSubject = `TDL Webshop rendelési visszaigazolás - ${summary.orderId}`;

    const itemLines = summary.items
      .map(item => `- ${item.name} x${item.quantity} - ${item.price * item.quantity} Ft`)
      .join('\n');

    this.emailBody = [
      `Kedves ${summary.customerName}!`,
      '',
      'Köszönjük a rendelésedet a TDL Webshopban.',
      `Rendelés azonosító: ${summary.orderId}`,
      '',
      'Rendelt termékek:',
      itemLines,
      '',
      `Szállítási mód: ${summary.shippingMethodLabel}`,
      `Fizetési mód: ${summary.paymentMethodLabel}`,
      ...(summary.pickupAt ? [`Átvétel időpontja: ${this.formatDate(summary.pickupAt)}`] : []),
      `Részösszeg: ${summary.subtotal} Ft`,
      `Szállítás: ${summary.shippingFee} Ft`,
      `Fizetési díj: ${summary.paymentFee} Ft`,
      ...(summary.couponCode ? [`Kupon: ${summary.couponCode}${summary.couponDescription ? ` (${summary.couponDescription})` : ''}`] : []),
      `Végösszeg: ${summary.total} Ft`,
      '',
      'Hamarosan felvesszük veled a kapcsolatot a feldolgozással kapcsolatban.',
      '',
      'Üdv,',
      'TDL Webshop'
    ].join('\n');
  }

  private async loadSummaryFromFirestore(orderId: string): Promise<void> {
    this.loading = true;
    this.loadError = '';

    try {
      const order = await this.orderService.getOrderById(orderId);
      if (!order) {
        this.loadError = 'A rendelés nem található az adatbázisban.';
        return;
      }

      const summary: OrderSuccessSummary = {
        orderId: order.id || orderId,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        shippingMethodLabel: order.shippingMethod?.label || 'Nincs megadva',
        paymentMethodLabel: order.paymentMethod?.label || 'Nincs megadva',
        pickupAt: order.pickupAt,
        subtotal: order.pricing?.subtotal ?? order.total,
        shippingFee: order.pricing?.shippingFee ?? 0,
        paymentFee: order.pricing?.paymentFee ?? 0,
        discount: order.pricing?.discount ?? 0,
        couponCode: order.appliedCoupon?.code || order.couponCode || undefined,
        couponDescription: order.appliedCoupon?.description,
        total: order.total,
        items: order.items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image
        }))
      };

      this.summary = summary;
      this.buildEmailPreview(summary);
    } catch (error) {
      console.error(error);
      this.loadError = 'Nem sikerült visszatölteni a rendelés adatait.';
    } finally {
      this.loading = false;
    }
  }
}

