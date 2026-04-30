import { of } from 'rxjs';
import { Products } from './products';

describe('Products component logic', () => {
  function product(overrides: Partial<{
    id: number;
    key?: string;
    firestoreId?: string;
    name: string;
    price: number;
    originalPrice: number;
    discountPercent: number;
    hasDiscount: boolean;
    image: string;
    images: string[];
    stock: string;
    stockQuantity: number;
    category: string;
    shortDescription: string;
    description: string;
    sku: string;
    brand: string;
    isWeeklyDeal: boolean;
    isTopProduct: boolean;
    salePercent: number;
  }> = {}) {
    return {
      id: 1,
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
      sku: 'SKU-1',
      brand: 'TDL',
      isWeeklyDeal: false,
      isTopProduct: false,
      salePercent: 0,
      ...overrides
    };
  }

  function createComponent() {
    const added: Array<{ name: string; quantity: number }> = [];
    const component = new Products(
      { addToCart: (item: { name: string }, quantity = 1) => added.push({ name: item.name, quantity }) } as never,
      { queryParamMap: of(new Map() as never) } as never,
      { navigate: async () => true } as never,
      { getProductsStream: () => () => undefined } as never,
      { getOrdersStream: () => () => undefined } as never,
      { success: () => undefined, error: () => undefined, info: () => undefined } as never,
      { toggleWishlist: () => true, isInWishlist: () => false } as never,
      { getActivePackagesStream: () => () => undefined } as never,
      { run: (fn: () => void) => fn() } as never,
      { detectChanges: () => undefined } as never
    );

    return { component, added };
  }

  const testInstallerPackage = {
    id: 'pkg-1',
    name: 'Teszt csomag',
    subtitle: '',
    description: '',
    isActive: true,
    items: [
      { productSku: 'FUT-1', quantity: 4, label: 'Radiator szelep' },
      { productSku: 'FUT-2', quantity: 1, label: 'Futesi termosztat' },
      { productSku: 'FUT-3', quantity: 2, label: 'Kazanhazi golyoscsap' },
      { productSku: 'SZER-1', quantity: 2, label: 'Menettomito szalag' }
    ]
  };

  it('marks product as out of stock when quantity is 0', () => {
    const { component } = createComponent();
    const state = component.getStockState(product({ stockQuantity: 0 }));

    expect(state).toBe('out-stock');
  });

  it('marks product as low stock when quantity is between 1 and 5', () => {
    const { component } = createComponent();
    const lowStockProduct = product({ id: 2, sku: 'SKU-2', stockQuantity: 3 });
    const state = component.getStockState(lowStockProduct);

    expect(state).toBe('low-stock');
    expect(component.getStockStateLabel(lowStockProduct)).toBe('Kevés készlet');
  });

  it('allows add to cart only when not out of stock', () => {
    const { component } = createComponent();
    const canAdd = component.canAddToCart(product({ id: 3, sku: 'SKU-3' }));

    expect(canAdd).toBe(true);
  });

  it('builds an installer package from available matching products', () => {
    const { component } = createComponent();
    component.installerPackages = [testInstallerPackage] as never;
    component.selectedInstallerPackageId = 'pkg-1';
    component.products = [
      product({ id: 1, name: 'Radiator szelep', sku: 'FUT-1', category: 'Futes', stockQuantity: 10, price: 3000 }),
      product({ id: 2, name: 'Futesi termosztat', sku: 'FUT-2', category: 'Futes', stockQuantity: 3, price: 12000 }),
      product({ id: 3, name: 'Kazanhazi golyoscsap', sku: 'FUT-3', category: 'Futes', stockQuantity: 6, price: 5000 }),
      product({ id: 4, name: 'Menettomito szalag', sku: 'SZER-1', category: 'Szerelvenyek', stockQuantity: 20, price: 900 })
    ];

    const packageView = component.activeInstallerPackage;

    expect(packageView.availableCount).toBe(4);
    expect(packageView.total).toBe(4 * 3000 + 12000 + 2 * 5000 + 2 * 900);
  });

  it('adds installer package items to cart with package quantities', () => {
    const { component, added } = createComponent();
    component.installerPackages = [testInstallerPackage] as never;
    component.selectedInstallerPackageId = 'pkg-1';
    component.products = [
      product({ id: 1, name: 'Radiator szelep', sku: 'FUT-1', category: 'Futes', stockQuantity: 10, price: 3000 }),
      product({ id: 2, name: 'Futesi termosztat', sku: 'FUT-2', category: 'Futes', stockQuantity: 3, price: 12000 }),
      product({ id: 3, name: 'Kazanhazi golyoscsap', sku: 'FUT-3', category: 'Futes', stockQuantity: 6, price: 5000 }),
      product({ id: 4, name: 'Menettomito szalag', sku: 'SZER-1', category: 'Szerelvenyek', stockQuantity: 20, price: 900 })
    ];

    component.addInstallerPackageToCart(component.activeInstallerPackage);

    expect(added).toEqual([
      { name: 'Radiator szelep', quantity: 4 },
      { name: 'Futesi termosztat', quantity: 1 },
      { name: 'Kazanhazi golyoscsap', quantity: 2 },
      { name: 'Menettomito szalag', quantity: 2 }
    ]);
  });
});