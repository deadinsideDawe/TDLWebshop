import { CartService } from './cart.service';

describe('CartService', () => {
  beforeAll(() => {
    const storageMock = {
      store: {} as Record<string, string>,
      getItem(key: string) {
        return this.store[key] ?? null;
      },
      setItem(key: string, value: string) {
        this.store[key] = String(value);
      },
      removeItem(key: string) {
        delete this.store[key];
      },
      clear() {
        this.store = {};
      }
    };

    Object.defineProperty(globalThis, 'localStorage', {
      value: storageMock,
      configurable: true
    });
  });

  beforeEach(() => {
    localStorage.clear();
  });

  it('adds new item with quantity 1', () => {
    const service = new CartService();
    service.addToCart({ id: 1, name: 'Szelep', price: 1000, image: 'x' });

    expect(service.getItems().length).toBe(1);
    expect(service.getItems()[0].quantity).toBe(1);
  });

  it('increments quantity when same product is added again', () => {
    const service = new CartService();
    service.addToCart({ id: 1, name: 'Szelep', price: 1000, image: 'x' });
    service.addToCart({ id: 1, name: 'Szelep', price: 1000, image: 'x' });

    expect(service.getItems()[0].quantity).toBe(2);
  });

  it('can add multiple pieces in one cart update', () => {
    const service = new CartService();
    service.addToCart({ id: 1, name: 'Szelep', price: 1000, image: 'x' }, 4);

    expect(service.getItems().length).toBe(1);
    expect(service.getItems()[0].quantity).toBe(4);
  });

  it('uses Firestore id as the stable product key', () => {
    const service = new CartService();
    service.addToCart({ id: 1, firestoreId: 'product-a', name: 'Szelep', price: 1000, image: 'x' });
    service.addToCart({ id: 99, firestoreId: 'product-a', name: 'Szelep', price: 1000, image: 'x' });

    expect(service.getItems().length).toBe(1);
    expect(service.getItems()[0].quantity).toBe(2);
  });

  it('calculates total by quantity', () => {
    const service = new CartService();
    service.addToCart({ id: 1, name: 'A', price: 1000, image: 'x' });
    service.addToCart({ id: 1, name: 'A', price: 1000, image: 'x' });
    service.addToCart({ id: 2, name: 'B', price: 500, image: 'y' });

    expect(service.getTotal()).toBe(2500);
  });
});
