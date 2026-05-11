import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  updateDoc,
  where
} from 'firebase/firestore';
import { db } from '../firebase';
import { Order } from '../models/order.model';
import { CartItem } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  // Rendelesek + statusz audit kollekciok.
  private ordersCollection = collection(db, 'orders');
  private orderStatusAuditCollection = collection(db, 'orderStatusAudit');

  addOrder(order: Order) {
    // Firestore nem szereti az undefined mezoket, ezert tisztitunk mentes elott.
    const payload = this.removeUndefinedDeep({
      ...order,
      createdAt: Date.now()
    });

    return addDoc(this.ordersCollection, payload as Order & { createdAt: number });
  }

  updateOrder(orderId: string, data: Partial<Order>) {
    const orderRef = doc(db, 'orders', orderId);
    return updateDoc(orderRef, data);
  }

  async updateOrderStatusWithAudit(params: {
    orderId: string;
    fromStatus: string;
    toStatus: string;
    actorUid?: string;
    actorEmail?: string;
    note?: string;
  }): Promise<void> {
    // Státuszfrissítés + audit napló + készletkorrekció egy tranzakcióban.
    const orderRef = doc(db, 'orders', params.orderId);
    const auditRef = doc(this.orderStatusAuditCollection);
    const changedAt = Date.now();

    await runTransaction(db, async transaction => {
      const orderSnap = await transaction.get(orderRef);
      if (!orderSnap.exists()) {
        throw new Error('order-not-found');
      }

      const orderData = orderSnap.data() as Order;
      const currentStatus = orderData.status || params.fromStatus;
      if (currentStatus === params.toStatus) {
        return;
      }

      const wasCompleted = currentStatus === 'teljesitve';
      const willBeCompleted = params.toStatus === 'teljesitve';
      const shouldAdjustStock = wasCompleted !== willBeCompleted;
      const direction = willBeCompleted ? -1 : 1;
      // Csak akkor nyúlunk készlethez, ha a rendelés belép vagy kilép a teljesített állapotból.
      // Így egy "új" -> "feldolgozás alatt" váltás nem foglal/vesz el duplán készletet.
      const stockUpdates: Array<{
        ref: ReturnType<typeof doc>;
        quantity: number;
        previousStock: string;
        delta: number;
        itemName: string;
      }> = [];

      if (shouldAdjustStock) {
        const items = Array.isArray(orderData.items) ? orderData.items : [];

        for (const item of items) {
          if (!item.firestoreId) {
            continue;
          }

          const productRef = doc(db, 'products', item.firestoreId);
          const productSnap = await transaction.get(productRef);
          if (!productSnap.exists()) {
            continue;
          }

          const productData = productSnap.data() as { stockQuantity?: number; stock?: string };
          stockUpdates.push({
            ref: productRef,
            quantity: Math.max(0, Number(productData.stockQuantity) || 0),
            previousStock: productData.stock || 'Keszleten',
            delta: Math.max(0, Number(item.quantity) || 0) * direction,
            itemName: item.name || item.firestoreId
          });
        }
      }

      for (const update of stockUpdates) {
        const nextQuantityRaw = update.quantity + update.delta;
        if (update.delta < 0 && nextQuantityRaw < 0) {
          throw new Error(`insufficient-stock:${update.itemName}`);
        }

        const nextQuantity = Math.max(0, nextQuantityRaw);
        transaction.update(update.ref, {
          stockQuantity: nextQuantity,
          stock: this.resolveStockLabel(nextQuantity, update.previousStock)
        });
      }

      transaction.update(orderRef, {
        status: params.toStatus,
        statusUpdatedAt: changedAt,
        updatedAt: changedAt
      });

      transaction.set(auditRef, {
        orderId: params.orderId,
        fromStatus: currentStatus,
        toStatus: params.toStatus,
        changedAt,
        changedByUid: params.actorUid || '',
        changedByEmail: params.actorEmail || '',
        note: params.note || '',
        source: 'admin-panel'
      });
    });
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    const orderRef = doc(db, 'orders', orderId);
    const snapshot = await getDoc(orderRef);

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...(snapshot.data() as Omit<Order, 'id'>)
    };
  }

  private removeUndefinedDeep<T>(value: T): T {
    // Rekurziv undefined szures object/array szerkezetben.
    if (Array.isArray(value)) {
      return value
        .map(item => this.removeUndefinedDeep(item))
        .filter(item => item !== undefined) as T;
    }

    if (value !== null && typeof value === 'object') {
      const result: Record<string, unknown> = {};

      for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
        if (nested === undefined) {
          continue;
        }

        result[key] = this.removeUndefinedDeep(nested);
      }

      return result as T;
    }

    return value;
  }

  getOrdersStream(
    next: (orders: Order[]) => void,
    error?: (err: unknown) => void
  ) {
    // Realtime admin rendeleslista.
    const ordersQuery = query(this.ordersCollection, orderBy('createdAt', 'desc'));

    return onSnapshot(
      ordersQuery,
      snapshot => {
        const orders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Order, 'id'>)
        }));

        next(orders);
      },
      err => {
        if (error) {
          error(err);
        }
      }
    );
  }

  getOrdersByUserStream(
    userId: string,
    next: (orders: Order[]) => void,
    error?: (err: unknown) => void
  ) {
    // Realtime "Saját rendelések" lista userre szurve.
    const userOrdersQuery = query(this.ordersCollection, where('userId', '==', userId));

    return onSnapshot(
      userOrdersQuery,
      snapshot => {
        const orders = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...(doc.data() as Omit<Order, 'id'>)
          }))
          .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

        next(orders);
      },
      err => {
        if (error) {
          error(err);
        }
      }
    );
  }

  async createLocalSaleOrder(order: Order & { items: CartItem[] }) {
    // Helyszini vasarlas tranzakcioban:
    // 1) keszlet ellenorzes, 2) keszlet csokkentes, 3) rendeles mentes.
    const cleanOrder = this.removeUndefinedDeep(order);

    const orderId = await runTransaction(db, async transaction => {
      for (const item of cleanOrder.items) {
        if (!item.firestoreId) {
          throw new Error(`missing-product-id:${item.name}`);
        }

        const productRef = doc(db, 'products', item.firestoreId);
        const productSnap = await transaction.get(productRef);

        if (!productSnap.exists()) {
          throw new Error(`product-not-found:${item.name}`);
        }

        const data = productSnap.data() as { stockQuantity?: number; stock?: string };
        const currentQty = Math.max(0, Number(data.stockQuantity) || 0);

        if (currentQty < item.quantity) {
          throw new Error(`insufficient-stock:${item.name}`);
        }

        const nextQty = Math.max(0, currentQty - item.quantity);
        const previousStock = data.stock || 'Keszleten';
        const nextStock = this.resolveStockLabel(nextQty, previousStock);

        transaction.update(productRef, {
          stockQuantity: nextQty,
          stock: nextStock
        });
      }

      const orderRef = doc(this.ordersCollection);
      transaction.set(orderRef, {
        ...cleanOrder,
        createdAt: Date.now()
      });

      return orderRef.id;
    });

    return { id: orderId };
  }

  async ensureInvoiceForOrder(orderId: string): Promise<{ invoiceNumber: string; invoicedAt: number }> {
    // Szamlaszam generalas evi futoszammal (INV-YYYY-XXXX), tranzakciosan.
    const orderRef = doc(db, 'orders', orderId);
    const year = new Date().getFullYear().toString();
    const counterRef = doc(db, 'invoiceCounters', year);

    return runTransaction(db, async transaction => {
      const orderSnap = await transaction.get(orderRef);
      if (!orderSnap.exists()) {
        throw new Error('order-not-found');
      }

      const orderData = orderSnap.data() as Order;
      if (orderData.invoiceNumber && orderData.invoicedAt) {
        return {
          invoiceNumber: orderData.invoiceNumber,
          invoicedAt: orderData.invoicedAt
        };
      }

      const counterSnap = await transaction.get(counterRef);
      const currentSeq = counterSnap.exists()
        ? Math.max(0, Number((counterSnap.data() as { seq?: number }).seq) || 0)
        : 0;
      const nextSeq = currentSeq + 1;
      const padded = String(nextSeq).padStart(4, '0');
      const invoiceNumber = `INV-${year}-${padded}`;
      const invoicedAt = Date.now();

      transaction.set(counterRef, { seq: nextSeq, updatedAt: invoicedAt }, { merge: true });
      transaction.update(orderRef, { invoiceNumber, invoicedAt });

      return { invoiceNumber, invoicedAt };
    });
  }

  private resolveStockLabel(quantity: number, previous: string): string {
    if (quantity <= 0) {
      return 'Nincs keszleten';
    }

    if (quantity <= 5) {
      return 'Szallithato';
    }

    if (previous === 'Rendelesre') {
      return 'Rendelesre';
    }

    return 'Keszleten';
  }
}

