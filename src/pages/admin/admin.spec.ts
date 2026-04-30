import { Admin } from './admin';

describe('Admin helper logic', () => {
  function createComponent() {
    const orderServiceStub = {
      getOrdersStream: () => () => undefined,
      updateOrder: async () => undefined,
      updateOrderStatusWithAudit: async () => undefined,
      createLocalSaleOrder: async () => ({ id: 'o1' }),
      ensureInvoiceForOrder: async () => ({ invoiceNumber: 'INV-1', invoicedAt: Date.now() })
    };

   const component = new Admin(
  { queryParamMap: { subscribe: () => ({ unsubscribe: () => undefined }) } } as never,
  { isCurrentUserAdmin: () => true, getUser: () => ({ uid: 'u1', email: 'admin@tdlwebshop.hu' }) } as never,
  { getProductsStream: () => () => undefined, updateProduct: async () => undefined, deleteProduct: async () => undefined, addProduct: async () => undefined, seedProductsIfEmpty: async () => true } as never,
  orderServiceStub as never,
  { getUsersStream: () => () => undefined, updateUserProfile: async () => undefined } as never,
  { getProfilesStream: () => () => undefined, createProfile: async () => 'p1', updateProfile: async () => undefined, touchProfile: async () => undefined } as never,
  { downloadInvoicePdf: () => undefined } as never,
  { getAllNewsStream: () => () => undefined } as never,
  { getSubscribersStream: () => () => undefined } as never,   // newsletterService (9.)
  { getAllPackagesStream: () => () => undefined } as never,    // installerPackageService (10.) ← EZT ADD BE
  { success: () => undefined, error: () => undefined, info: () => undefined } as never,  // toastService (11.)
  { capture: () => undefined, getRecentLogsStream: () => () => undefined } as never,     // monitoringService (12.)
  { run: (fn: () => void) => fn() } as never,                 // ngZone (13.)
  { detectChanges: () => undefined } as never                 // cdr (14.)
);

    return { component, orderServiceStub };
  }

  it('maps status labels', () => {
    const { component } = createComponent();
    expect(component.getOrderStatusLabel('uj')).toBe('Uj');
    expect(component.getOrderStatusLabel('feldolgozas alatt')).toBe('Feldolgozas alatt');
    expect(component.getOrderStatusLabel('teljesitve')).toBe('Teljesitve');
  });

  it('maps sales channel labels', () => {
    const { component } = createComponent();
    expect(component.getSalesChannelLabel('web')).toBe('Webes');
    expect(component.getSalesChannelLabel('local-admin')).toBe('Helyszíni');
  });

  it('writes audit log when confirming order status change', async () => {
    const { component, orderServiceStub } = createComponent();
    let capturedPayload: any = null;
    (orderServiceStub as any).updateOrderStatusWithAudit = async (payload: any) => {
      capturedPayload = payload;
    };

    const order = {
      id: 'order-1',
      customerName: 'Teszt Vásárló',
      status: 'uj',
      items: []
    } as any;

    component.requestOrderStatusChange(order);
    component.pendingOrderStatusChoice = 'teljesitve';

    await component.confirmOrderStatusChange();

    expect(capturedPayload).not.toBeNull();
    expect(capturedPayload.orderId).toBe('order-1');
    expect(capturedPayload.fromStatus).toBe('uj');
    expect(capturedPayload.toStatus).toBe('teljesitve');
  });

  it('builds Spark-compatible order confirmation email links', () => {
    const { component } = createComponent();
    const order = {
      id: 'order-1',
      customerName: 'Teszt Vásárló',
      customerEmail: 'teszt@example.com',
      customerPhone: '+361234567',
      shipping: { zip: '1111', city: 'Budapest', address: 'Utca 1' },
      billing: { sameAsShipping: true, name: 'Teszt', zip: '1111', city: 'Budapest', address: 'Utca 1' },
      couponCode: '',
      comment: '',
      total: 6000,
      status: 'uj',
      createdAt: Date.now(),
      items: [
        { id: 1, firestoreId: 'p1', sku: 'SKU-1', name: 'Radiator szelep', price: 3000, image: 'x', quantity: 2 }
      ]
    } as any;

    const href = component.getOrderEmailHref(order);

    expect(href).toContain('mailto:teszt%40example.com');
    expect(decodeURIComponent(href)).toContain('TDL Webshop rendelési visszaigazolás - order-1');
    expect(decodeURIComponent(href)).toContain('Radiator szelep x2 - 6000 Ft');
  });

  it('builds business report from completed orders', () => {
    const { component } = createComponent();
    const now = Date.now();

    component.orders = [
      {
        id: 'web-1',
        customerName: 'Webes vevő',
        customerEmail: 'web@example.com',
        customerPhone: '+361234567',
        shipping: { zip: '1111', city: 'Budapest', address: 'Utca 1' },
        billing: { sameAsShipping: true, name: 'Webes vevő', zip: '1111', city: 'Budapest', address: 'Utca 1' },
        couponCode: '',
        comment: '',
        total: 12000,
        status: 'teljesitve',
        salesChannel: 'web',
        createdAt: now,
        items: [
          { id: 1, firestoreId: 'p1', sku: 'SKU-1', name: 'Radiator szelep', price: 3000, image: 'x', quantity: 4 }
        ]
      },
      {
        id: 'local-1',
        customerName: 'Helyszíni vevő',
        customerEmail: 'local@example.com',
        customerPhone: '+361234567',
        shipping: { zip: '1111', city: 'Budapest', address: 'Utca 1' },
        billing: { sameAsShipping: true, name: 'Helyszíni vevő', zip: '1111', city: 'Budapest', address: 'Utca 1' },
        couponCode: '',
        comment: '',
        total: 6000,
        status: 'teljesitve',
        salesChannel: 'local-admin',
        createdAt: now,
        items: [
          { id: 2, firestoreId: 'p2', sku: 'SKU-2', name: 'Golyoscsap', price: 2000, image: 'x', quantity: 3 }
        ]
      },
      {
        id: 'open-1',
        customerName: 'Aktív vevő',
        customerEmail: 'open@example.com',
        customerPhone: '+361234567',
        shipping: { zip: '1111', city: 'Budapest', address: 'Utca 1' },
        billing: { sameAsShipping: true, name: 'Aktív vevő', zip: '1111', city: 'Budapest', address: 'Utca 1' },
        couponCode: '',
        comment: '',
        total: 9999,
        status: 'uj',
        salesChannel: 'web',
        createdAt: now,
        items: []
      }
    ] as any;

    (component as any).rebuildDashboard();

    expect(component.businessReport.totalRevenue).toBe(18000);
    expect(component.businessReport.averageOrderValue).toBe(9000);
    expect(component.businessReport.webOrderCount).toBe(1);
    expect(component.businessReport.localOrderCount).toBe(1);
    expect(component.businessReport.topProducts[0].name).toBe('Radiator szelep');
  });

  it('builds smart stock reorder suggestions from recent completed orders', () => {
    const { component } = createComponent();
    const now = Date.now();

    component.products = [
      {
        id: 'p1',
        name: 'Radiator szelep',
        sku: 'SKU-1',
        category: 'Futes',
        price: 3000,
        image: 'x',
        stock: 'Keszleten',
        stockQuantity: 3
      }
    ];
    component.orders = [
      {
        id: 'done-1',
        customerName: 'Teszt',
        customerEmail: 'teszt@example.com',
        customerPhone: '+361234567',
        shipping: { zip: '1111', city: 'Budapest', address: 'Utca 1' },
        billing: { sameAsShipping: true, name: 'Teszt', zip: '1111', city: 'Budapest', address: 'Utca 1' },
        couponCode: '',
        comment: '',
        total: 18000,
        status: 'teljesitve',
        createdAt: now,
        items: [
          { id: 1, firestoreId: 'p1', sku: 'SKU-1', name: 'Radiator szelep', price: 3000, image: 'x', quantity: 6 }
        ]
      },
      {
        id: 'active-1',
        customerName: 'Teszt',
        customerEmail: 'teszt@example.com',
        customerPhone: '+361234567',
        shipping: { zip: '1111', city: 'Budapest', address: 'Utca 1' },
        billing: { sameAsShipping: true, name: 'Teszt', zip: '1111', city: 'Budapest', address: 'Utca 1' },
        couponCode: '',
        comment: '',
        total: 3000,
        status: 'uj',
        createdAt: now,
        items: [
          { id: 1, firestoreId: 'p1', sku: 'SKU-1', name: 'Radiator szelep', price: 3000, image: 'x', quantity: 3 }
        ]
      }
    ];

    (component as any).rebuildDashboard();

    expect(component.stockChart[0].reservedStock).toBe(3);
    expect(component.smartStockSuggestions[0].sold30Days).toBe(6);
    expect(component.smartStockSuggestions[0].reorderQuantity).toBeGreaterThan(0);
    expect(component.smartStockSuggestions[0].priority).toBe('critical');

    const csv = component.getSmartStockCsvContent();
    expect(csv).toContain('Termek;Cikkszam;Kategoria');
    expect(csv).toContain('Radiator szelep;SKU-1;Futes');
    expect(csv).toContain('critical');
  });
});
