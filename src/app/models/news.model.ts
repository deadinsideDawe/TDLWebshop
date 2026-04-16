// Fooldali hirkartyak adatmodellje (admin kezeli, home jeleniti meg).
export interface NewsItem {
  id?: string;
  title: string;
  content: string;
  label?: string;
  targetType?: 'none' | 'products' | 'category' | 'promo';
  targetValue?: string;
  isActive: boolean;
  createdAt?: number;
  updatedAt?: number;
}
