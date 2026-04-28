// Mentett vasarlo/ceg profil helyszini es webes ujrarendeleshez.
export interface CustomerProfile {
  id?: string;
  type: 'private' | 'company';
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  taxNumber?: string;
  disabled?: boolean;
  paymentTermDays?: number;
  paymentTermApproved?: boolean;
  note?: string;
  source?: 'web-user' | 'web-guest' | 'admin-local';
  isGuest?: boolean;
  createdAt: number;
  lastUsedAt: number;
}
