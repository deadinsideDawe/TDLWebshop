import { BehaviorSubject } from 'rxjs';
import { Checkout } from './checkout';

describe('Checkout coupon logic', () => {
  function createComponent(subtotal: number) {
    const authSubject = new BehaviorSubject<{ email?: string } | null>(null);

    return new Checkout(
      { user$: authSubject.asObservable(), getUser: () => null, login: async () => undefined, register: async () => undefined } as never,
      { getTotal: () => subtotal, getItems: () => [] } as never,
      { navigate: async () => true } as never,
      { addOrder: async () => ({ id: 'o1' }), queueOrderConfirmationEmail: async () => undefined } as never,
      { attachOrderToUser: async () => undefined } as never,
      { upsertProfileForUser: async () => undefined, upsertGuestProfileByEmail: async () => undefined } as never,
      { success: () => undefined, error: () => undefined, info: () => undefined } as never
    );
  }

  it('applies percent coupon when threshold is met', () => {
    const component = createComponent(12000);
    component.couponCode = 'TDL10';

    const coupon = component.coupon;
    expect(coupon?.valid).toBe(true);
    expect(coupon?.discount).toBe(1200);
  });

  it('rejects coupon when subtotal threshold is not met', () => {
    const component = createComponent(9000);
    component.couponCode = 'TDL10';

    const coupon = component.coupon;
    expect(coupon?.valid).toBe(false);
    expect(coupon?.reason).toContain('10000 Ft');
  });

  it('applies shipping coupon equal to shipping fee', () => {
    const component = createComponent(25000);
    component.couponCode = 'SHIPFREE';
    component.selectedShippingMethod = 'express';

    const coupon = component.coupon;
    expect(coupon?.valid).toBe(true);
    expect(coupon?.discount).toBe(component.shippingFee);
  });
});
