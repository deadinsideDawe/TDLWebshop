// Auth user-hoz tartozo kiegeszito profil Firestore-ban.
export interface UserProfile {
  id?: string;
  email: string;
  role: 'admin' | 'customer';
  accountType?: 'private' | 'company';
  displayName?: string;
  phone?: string;
  companyName?: string;
  taxNumber?: string;
  note?: string;
  disabled?: boolean;
  createdAt: number;
  lastLoginAt?: number;
  orderCount?: number;
  lastOrderId?: string;
  lastOrderAt?: number;
  shippingAddress?: {
    zip: string;
    city: string;
    address: string;
  };
  billingAddress?: {
    sameAsShipping: boolean;
    name: string;
    zip: string;
    city: string;
    address: string;
  };
}
