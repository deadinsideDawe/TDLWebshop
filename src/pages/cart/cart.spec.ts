import { BehaviorSubject } from 'rxjs';
import { Cart } from './cart';
import { CartItem } from '../../app/services/cart.service';

describe('Cart component logic', () => {
  it('removes item via cart service', () => {
    const subject = new BehaviorSubject<CartItem[]>([]);
    const removeFromCart = vi.fn();
    const component = new Cart(
      { cart$: subject.asObservable(), removeFromCart, getTotal: () => 0 } as never,
      { navigate: async () => true } as never
    );

    component.removeItem(42);

    expect(removeFromCart).toHaveBeenCalledWith(42);
  });

  it('navigates to checkout', async () => {
    const subject = new BehaviorSubject<CartItem[]>([]);
    const navigate = vi.fn(async () => true);
    const component = new Cart(
      { cart$: subject.asObservable(), removeFromCart: () => undefined, getTotal: () => 0 } as never,
      { navigate } as never
    );

    component.goToCheckout();
    await Promise.resolve();

    expect(navigate).toHaveBeenCalledWith(['/checkout']);
  });
});
