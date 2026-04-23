export interface NewsletterSubscriber {
  id?: string;
  email: string;
  source: string;
  status: 'active' | 'unsubscribed';
  createdAt: number;
}
