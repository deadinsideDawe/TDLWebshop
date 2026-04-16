import { CartItem } from '../services/cart.service';

// Rendeles adatmodell Firestore-hoz es UI-hoz.
export interface Order {
  id?: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shipping: {
    zip: string;
    city: string;
    address: string;
  };
  shippingMethod?: {
    id: string;
    label: string;
    fee: number;
    eta: string;
  };
  billing: {
    sameAsShipping: boolean;
    name: string;
    zip: string;
    city: string;
    address: string;
  };
  paymentMethod?: {
    id: string;
    label: string;
    fee: number;
  };
  business?: {
    isBusinessBuyer: boolean;
    companyName?: string;
    taxNumber?: string;
  };
  salesChannel?: 'web' | 'local-admin';
  pickupAt?: number;
  invoiceNumber?: string;
  invoicedAt?: number;
  appliedCoupon?: {
    code: string;
    description: string;
    discount: number;
    type: 'percent' | 'fixed' | 'shipping';
  };
  pricing?: {
    subtotal: number;
    shippingFee: number;
    paymentFee: number;
    discount: number;
    total: number;
  };
  couponCode: string;
  comment: string;
  items: CartItem[];
  total: number;
  status: string;
  createdAt?: number;
}
