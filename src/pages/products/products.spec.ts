import { of } from 'rxjs';
import { Products } from './products';

describe('Products component logic', () => {
  function createComponent() {
    return new Products(
      { addToCart: () => undefined } as never,
      { queryParamMap: of(new Map() as never) } as never,
      { navigate: async () => true } as never,
      { getProductsStream: () => () => undefined } as never,
      { getOrdersStream: () => () => undefined } as never,
      { success: () => undefined } as never,
      { run: (fn: () => void) => fn() } as never,
      { detectChanges: () => undefined } as never
    );
  }

  it('marks product as out of stock when quantity is 0', () => {
    const component = createComponent();
    const state = component.getStockState({
      id: 1,
      name: 'Teszt',
      price: 1000,
      originalPrice: 1000,
      discountPercent: 0,
      hasDiscount: false,
      image: 'x',
      images: [],
      stock: 'Keszleten',
      stockQuantity: 0,
      category: 'Futes',
      shortDescription: '',
      description: '',
      sku: 'SKU-1',
      brand: 'TDL',
      isWeeklyDeal: false,
      isTopProduct: false,
      salePercent: 0
    });

    expect(state).toBe('out-stock');
  });

  it('marks product as low stock when quantity is between 1 and 5', () => {
    const component = createComponent();
    const state = component.getStockState({
      id: 2,
      name: 'Teszt',
      price: 1000,
      originalPrice: 1000,
      discountPercent: 0,
      hasDiscount: false,
      image: 'x',
      images: [],
      stock: 'Keszleten',
      stockQuantity: 3,
      category: 'Futes',
      shortDescription: '',
      description: '',
      sku: 'SKU-2',
      brand: 'TDL',
      isWeeklyDeal: false,
      isTopProduct: false,
      salePercent: 0
    });

    expect(state).toBe('low-stock');
    expect(component.getStockStateLabel({
      id: 2,
      name: 'Teszt',
      price: 1000,
      originalPrice: 1000,
      discountPercent: 0,
      hasDiscount: false,
      image: 'x',
      images: [],
      stock: 'Keszleten',
      stockQuantity: 3,
      category: 'Futes',
      shortDescription: '',
      description: '',
      sku: 'SKU-2',
      brand: 'TDL',
      isWeeklyDeal: false,
      isTopProduct: false,
      salePercent: 0
    })).toBe('Kevés készlet');
  });

  it('allows add to cart only when not out of stock', () => {
    const component = createComponent();
    const canAdd = component.canAddToCart({
      id: 3,
      name: 'Teszt',
      price: 1000,
      originalPrice: 1000,
      discountPercent: 0,
      hasDiscount: false,
      image: 'x',
      images: [],
      stock: 'Keszleten',
      stockQuantity: 8,
      category: 'Futes',
      shortDescription: '',
      description: '',
      sku: 'SKU-3',
      brand: 'TDL',
      isWeeklyDeal: false,
      isTopProduct: false,
      salePercent: 0
    });

    expect(canAdd).toBe(true);
  });
});
