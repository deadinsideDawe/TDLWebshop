// Termek adatmodell (admin + products lista + reszletek oldal).
export interface Product {
  id?: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  stock: string;
  stockQuantity?: number;
  images?: string[];
  shortDescription?: string;
  description?: string;
  sku?: string;
  brand?: string;
  isWeeklyDeal?: boolean;
  isTopProduct?: boolean;
  salePercent?: number;
  saleStartsAt?: number;
  saleEndsAt?: number;
  createdAt?: number;
}
