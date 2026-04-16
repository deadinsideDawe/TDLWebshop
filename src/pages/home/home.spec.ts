import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Home } from './home';
import { ProductService } from '../../app/services/product.service';
import { CartService } from '../../app/services/cart.service';
import { NewsService } from '../../app/services/news.service';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        provideRouter([]),
        {
          provide: ProductService,
          useValue: {
            getProductsStream: () => () => undefined
          }
        },
        {
          provide: CartService,
          useValue: {
            addToCart: () => undefined
          }
        },
        {
          provide: NewsService,
          useValue: {
            getActiveNewsStream: () => () => undefined
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
