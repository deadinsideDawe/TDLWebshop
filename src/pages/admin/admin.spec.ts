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
      { success: () => undefined, error: () => undefined, info: () => undefined } as never,
      { capture: () => undefined, getRecentLogsStream: () => () => undefined } as never,
      { run: (fn: () => void) => fn() } as never,
      { detectChanges: () => undefined } as never
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
});
