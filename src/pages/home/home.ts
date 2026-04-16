import { ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../app/services/product.service';
import { Product } from '../../app/models/product.model';
import { CartService } from '../../app/services/cart.service';
import { NewsService } from '../../app/services/news.service';
import { NewsItem } from '../../app/models/news.model';
import { getProductPricing } from '../../app/utils/product-pricing';

interface HomeCategory {
  label: string;
  query: string;
  description: string;
  image: string;
}

interface HomeMetric {
  value: string;
  label: string;
}

interface HeroTag {
  label: string;
  query: string;
}

interface FeaturedProduct {
  firestoreId?: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  hasDiscount: boolean;
  stockLabel: string;
  stockClass: 'in-stock' | 'low-stock' | 'out-stock';
  isWeeklyDeal: boolean;
  isTopProduct: boolean;
  salePercent: number;
  saleStartsAt?: number;
  saleEndsAt?: number;
  image: string;
  images: string[];
  shortDescription: string;
  description: string;
  sku: string;
  brand: string;
  stock: string;
  stockQuantity: number;
  badge: string;
}

interface PromoBanner {
  title: string;
  subtitle: string;
  badge: string;
  accent: string;
  queryParams: Record<string, string>;
}

interface TrustItem {
  icon: string;
  title: string;
  text: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit, OnDestroy {
  heroTitle = 'Épületgépészeti termékek egy helyen';
  heroText = 'Fűtés • Hűtés • Víz • Szellőzés • Szerelvények. Válogasson raktárról elérhető termékek közül, valós készletinformációval és gyors rendelési folyamattal.';
  heroButton = 'Termékek böngészése';
  heroSecondaryButton = 'Akciós ajánlatok';
  heroImage = 'tdl-header-logo.svg';

  heroTags: HeroTag[] = [
    { label: 'Fűtés', query: 'Futes' },
    { label: 'Hűtés', query: 'Hutes' },
    { label: 'Víz', query: 'Viz' },
    { label: 'Szellőzés', query: 'Szellozes' },
    { label: 'Szerelvények', query: 'Szerelvenyek' },
    { label: 'Lakossági', query: 'Lakossagi megoldasok' }
  ];

  categories: HomeCategory[] = [
    { label: 'Fűtés', query: 'Futes', description: 'Kazánok, radiátorok, fűtési szerelvények.', image: this.createCategoryImage('#9BE000', 'flame') },
    { label: 'Hűtés', query: 'Hutes', description: 'HVAC elemek és hűtéstechnikai komponensek.', image: this.createCategoryImage('#38BDF8', 'snow') },
    { label: 'Vízszerelés', query: 'Viz', description: 'Csövek, idomok és vízszerelési megoldások.', image: this.createCategoryImage('#0EA5E9', 'drop') },
    { label: 'Szellőzés', query: 'Szellozes', description: 'Légtechnikai és szellőzési rendszerelemek.', image: this.createCategoryImage('#84CC16', 'fan') },
    { label: 'Szerelvények', query: 'Szerelvenyek', description: 'Szelepek, csatlakozók, gépészeti alkatrészek.', image: this.createCategoryImage('#F97316', 'wrench') },
    { label: 'Lakossági megoldások', query: 'Lakossagi megoldasok', description: 'Otthoni fűtés-hűtés-víz megoldások egy helyen.', image: this.createCategoryImage('#119DFF', 'house') }
  ];

  metrics: HomeMetric[] = [
    { value: 'Gyors', label: 'online rendelés leadása' },
    { value: 'Valós', label: 'készlet és rendeléskezelés' },
    { value: 'TDL', label: 'szakmai kínálat épületgépészethez' }
  ];

  featuredProducts: FeaturedProduct[] = [];
  featuredLoading = true;

  selectedFeaturedProduct: FeaturedProduct | null = null;
  selectedFeaturedImage = '';

  promoBanners: PromoBanner[] = [
    {
      title: 'Heti ajánlatok',
      subtitle: 'Kiemelt fűtési és hűtési termékek kedvezménnyel.',
      badge: '-15%',
      accent: '#119DFF',
      queryParams: { promo: 'discount15' }
    },
    {
      title: 'TOP termékek',
      subtitle: 'A leggyakrabban vásárolt termékek a kínálatból.',
      badge: 'TOP TERMÉK',
      accent: '#9BE000',
      queryParams: { promo: 'top' }
    },
    {
      title: 'Újdonságok',
      subtitle: 'Újonnan felkerült termékek és friss kínálat.',
      badge: 'ÚJDONSÁG',
      accent: '#F97316',
      queryParams: { promo: 'new' }
    }
  ];

  trustItems: TrustItem[] = [
    { icon: 'TRUCK', title: 'Gyors kiszállítás', text: 'Országos szállítás áttekinthető rendelési folyamattal.' },
    { icon: 'BOX', title: 'Megbízható készletinformáció', text: 'Az admin felület valós készletet és foglalásokat kezel.' },
    { icon: 'HVAC', title: 'Épületgépészeti fókusz', text: 'A kínálat fűtés, hűtés, víz és szellőzés területére koncentrál.' },
    { icon: 'CHAT', title: 'Segítőkész ügyfélszolgálat', text: 'Kérdés esetén gyorsan elérhető segítséget biztosítunk.' }
  ];

  newsItems: NewsItem[] = [];
  activeNewsIndex = 0;
  // Ez kezeli az automata hírváltást 5 másodpercenként.
  private newsRotationTimer?: ReturnType<typeof setInterval>;

  private unsubscribeProducts?: () => void;
  private unsubscribeNews?: () => void;

  constructor(
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private newsService: NewsService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.unsubscribeProducts = this.productService.getProductsStream(products => {
      this.ngZone.run(() => {
        const mapped = products.map(product => this.mapFeaturedProduct(product));
        this.featuredProducts = this.pickFeaturedProducts(mapped);
        this.featuredLoading = false;
        this.cdr.detectChanges();
      });
    }, () => {
      this.ngZone.run(() => {
        this.featuredProducts = [];
        this.featuredLoading = false;
        this.cdr.detectChanges();
      });
    });

    this.unsubscribeNews = this.newsService.getActiveNewsStream(items => {
      this.ngZone.run(() => {
        // Ha változnak a hírek, újraindítom a forgást az első elemtől.
        this.newsItems = items;
        this.activeNewsIndex = 0;
        this.setupNewsRotation();
        this.cdr.detectChanges();
      });
    }, () => {
      this.ngZone.run(() => {
        this.newsItems = [];
        this.activeNewsIndex = 0;
        this.setupNewsRotation();
        this.cdr.detectChanges();
      });
    });
  }

  ngOnDestroy(): void {
    if (this.unsubscribeProducts) {
      this.unsubscribeProducts();
    }

    if (this.unsubscribeNews) {
      this.unsubscribeNews();
    }

    if (this.newsRotationTimer) {
      clearInterval(this.newsRotationTimer);
    }
  }

  openFeaturedDetails(product: FeaturedProduct): void {
    this.selectedFeaturedProduct = product;
    this.selectedFeaturedImage = product.images[0] || product.image;
  }

  closeFeaturedDetails(): void {
    this.selectedFeaturedProduct = null;
    this.selectedFeaturedImage = '';
  }

  selectFeaturedImage(image: string): void {
    this.selectedFeaturedImage = image;
  }

  canAddToCart(product: FeaturedProduct): boolean {
    return product.stockClass !== 'out-stock';
  }

  addFeaturedToCart(product: FeaturedProduct): void {
    if (!this.canAddToCart(product)) {
      return;
    }

    this.cartService.addToCart({
      id: this.toCartId(product.firestoreId || product.name),
      firestoreId: product.firestoreId,
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.price,
      image: product.image
    });
  }

  async goToProducts(queryParams: Record<string, string> = {}): Promise<void> {
    await this.router.navigate(['/products'], { queryParams });
  }

  get activeNews(): NewsItem | null {
    if (this.newsItems.length === 0) {
      return null;
    }

    return this.newsItems[this.activeNewsIndex] || this.newsItems[0];
  }

  goToNews(index: number): void {
    if (index < 0 || index >= this.newsItems.length) {
      return;
    }

    this.activeNewsIndex = index;
  }

  hasNewsTarget(news: NewsItem): boolean {
    // Csak akkor mutatok "Megnézem" gombot, ha tényleg van hova navigálni.
    const type = news.targetType || 'none';
    const value = (news.targetValue || '').trim();

    if (type === 'products') {
      return true;
    }

    if (type === 'category' || type === 'promo') {
      return value.length > 0;
    }

    return false;
  }

  async openNewsTarget(news: NewsItem): Promise<void> {
    // Admin beállítása alapján ide irányítom a usert (termékek / kategória / promó).
    const type = news.targetType || 'none';
    const value = (news.targetValue || '').trim();

    if (type === 'products') {
      await this.goToProducts();
      return;
    }

    if (type === 'category' && value) {
      await this.goToProducts({ category: value });
      return;
    }

    if (type === 'promo' && value) {
      await this.goToProducts({ promo: value });
    }
  }

  private setupNewsRotation(): void {
    // Először leállítom a régi timert, hogy ne fusson több egyszerre.
    if (this.newsRotationTimer) {
      clearInterval(this.newsRotationTimer);
      this.newsRotationTimer = undefined;
    }

    if (this.newsItems.length <= 1) {
      return;
    }

    this.newsRotationTimer = setInterval(() => {
      this.ngZone.run(() => {
        this.activeNewsIndex = (this.activeNewsIndex + 1) % this.newsItems.length;
      });
    }, 5000);
  }

  private mapFeaturedProduct(product: Product): FeaturedProduct {
    const categoryFallbacks = this.getCategoryImages(product.category);
    const hasRealPrimaryImage =
      !!product.image &&
      product.image !== 'tdl-header-logo.svg' &&
      !product.image.toLowerCase().endsWith('.svg');
    const hasRealGallery =
      !!product.images &&
      product.images.length > 0 &&
      product.images.some(img => img !== 'tdl-header-logo.svg' && !img.toLowerCase().endsWith('.svg'));

    const pricing = getProductPricing({
      price: Number(product.price) || 0,
      salePercent: Number(product.salePercent) || 0,
      saleStartsAt: Number(product.saleStartsAt) || undefined,
      saleEndsAt: Number(product.saleEndsAt) || undefined,
      isWeeklyDeal: !!product.isWeeklyDeal
    });

    const image = hasRealPrimaryImage ? product.image : categoryFallbacks[0];
    const images = hasRealGallery ? product.images! : categoryFallbacks;

    const stockQuantity = Math.max(0, Number(product.stockQuantity) || 0);
    const stockState = this.getStockState(product.stock || 'Készleten', stockQuantity);
    const createdAt = Number(product.createdAt) || 0;

    return {
      firestoreId: product.id,
      name: product.name,
      category: product.category || 'Egyéb',
      price: pricing.finalPrice,
      originalPrice: pricing.originalPrice,
      discountPercent: pricing.discountPercent,
      hasDiscount: pricing.hasDiscount,
      stockLabel: this.getStockLabel(stockState),
      stockClass: stockState,
      isWeeklyDeal: !!product.isWeeklyDeal,
      isTopProduct: !!product.isTopProduct,
      salePercent: Number(product.salePercent) || 0,
      saleStartsAt: Number(product.saleStartsAt) || undefined,
      saleEndsAt: Number(product.saleEndsAt) || undefined,
      image,
      images,
      shortDescription: product.shortDescription || 'Nincs rövid leírás megadva.',
      description: product.description || product.shortDescription || 'Ehhez a termékhez nincs részletes leírás.',
      sku: product.sku || '-',
      brand: product.brand || 'TDL Webshop',
      stock: product.stock || 'Készleten',
      stockQuantity,
      badge: this.resolveFeaturedBadge(stockState, stockQuantity, createdAt, !!product.isTopProduct)
    };
  }

  private pickFeaturedProducts(products: FeaturedProduct[]): FeaturedProduct[] {
    if (products.length === 0) {
      return [];
    }

    const preferredCategories = ['futes', 'hutes', 'viz', 'szellozes', 'szerelvenyek', 'lakossagimegoldasok'];
    const selected: FeaturedProduct[] = [];
    const usedIds = new Set<string>();

    for (const preferred of preferredCategories) {
      const match = products.find(product => {
        const id = product.firestoreId || product.name;
        return !usedIds.has(id) && this.normalizeCategory(product.category).includes(preferred);
      });

      if (match) {
        const id = match.firestoreId || match.name;
        usedIds.add(id);
        selected.push(match);
      }

      if (selected.length >= 4) {
        break;
      }
    }

    if (selected.length < 4) {
      for (const product of products) {
        const id = product.firestoreId || product.name;
        if (!usedIds.has(id)) {
          usedIds.add(id);
          selected.push(product);
        }

        if (selected.length >= 4) {
          break;
        }
      }
    }

    return selected;
  }

  private resolveFeaturedBadge(
    stockState: 'in-stock' | 'low-stock' | 'out-stock',
    stockQuantity: number,
    createdAt: number,
    isTopProduct: boolean
  ): string {
    if (stockState === 'out-stock') {
      return 'ELFOGYOTT';
    }

    if (isTopProduct) {
      return 'TOP TERMÉK';
    }

    if (createdAt > 0) {
      const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
      if (Date.now() - createdAt <= thirtyDaysMs) {
      return 'ÚJDONSÁG';
      }
    }

    if (stockQuantity >= 20) {
      return 'TOP TERMÉK';
    }

    if (stockState === 'low-stock') {
      return 'KEVÉS KÉSZLET';
    }

    return 'AJÁNLOTT';
  }

  private getStockState(stockLabel: string, stockQuantity: number): 'in-stock' | 'low-stock' | 'out-stock' {
    if (stockQuantity <= 0 || stockLabel.toLowerCase().includes('nincs')) {
      return 'out-stock';
    }

    if (stockQuantity <= 5) {
      return 'low-stock';
    }

    return 'in-stock';
  }

  private getStockLabel(state: 'in-stock' | 'low-stock' | 'out-stock'): string {
    if (state === 'out-stock') {
      return 'Nincs készleten';
    }

    if (state === 'low-stock') {
      return 'Kevés készlet';
    }

    return 'Raktáron';
  }

  private getCategoryImages(category?: string): string[] {
    const normalized = this.normalizeCategory(category || '');

    if (normalized.includes('szelep')) {
      return ['products/radiator-szelep.jpg', 'products/golyoscsap.jpg'];
    }

    if (normalized.includes('padlofutes') || normalized.includes('lakossagimegoldasok') || normalized.includes('futes')) {
      return ['products/padlofutes-cso.jpg', 'products/radiator-szelep.jpg'];
    }

    if (normalized.includes('szello') || normalized.includes('hutes') || normalized.includes('hvac')) {
      return ['products/hvac-legcsatorna.jpg', 'products/radiator-szelep.jpg'];
    }

    if (normalized.includes('szerelveny') || normalized.includes('viz')) {
      return ['products/golyoscsap.jpg', 'products/radiator-szelep.jpg'];
    }

    return ['products/radiator-szelep.jpg', 'products/padlofutes-cso.jpg'];
  }

  private normalizeCategory(category: string): string {
    return category
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '')
      .trim();
  }

  private toCartId(key: string): number {
    let hash = 0;
    for (let index = 0; index < key.length; index += 1) {
      hash = ((hash << 5) - hash) + key.charCodeAt(index);
      hash |= 0;
    }

    return Math.abs(hash) || Date.now();
  }

  private createCategoryImage(accent: string, icon: string): string {
    const iconPaths: Record<string, string> = {
      flame: '<path d="M64 20 c14 21 24 34 24 50 0 18-11 30-24 30s-24-12-24-30c0-13 8-27 24-50z"/><path d="M63 47 c6 10 10 18 10 27 0 8-4 15-10 15s-10-7-10-15c0-6 3-14 10-27z" fill="#fff"/>',
      snow: '<path d="M64 28 v72"/><path d="M32 46 l64 36"/><path d="M32 82 l64-36"/><path d="M48 24 l32 80"/><path d="M80 24 l-32 80"/>',
      drop: '<path d="M64 20 c18 23 28 38 28 55 0 17-13 31-28 31s-28-14-28-31c0-17 10-32 28-55z"/>',
      fan: '<circle cx="64" cy="64" r="14"/><path d="M64 22 c18 0 30 13 30 28-16 4-31-2-38-16-4-4-3-8 8-12z"/><path d="M104 64 c0 18-13 30-28 30-4-16 2-31 16-38 4-4 8-3 12 8z"/><path d="M64 106 c-18 0-30-13-30-28 16-4 31 2 38 16 4 4 3 8-8 12z"/><path d="M24 64 c0-18 13-30 28-30 4 16-2 31-16 38-4 4-8 3-12-8z"/>',
      wrench: '<circle cx="42" cy="50" r="14"/><path d="M53 60 l36 36 h12 v-12 l-8-8 8-8 -10-10 -8 8 -7-7z"/>',
      house: '<path d="M28 62 l36-30 36 30"/><path d="M38 58 v34 h18 v-20 h16 v20 h18 v-34"/>'
    };

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
        <rect width="128" height="128" rx="26" fill="rgba(255,255,255,0.04)"/>
        <circle cx="64" cy="64" r="42" fill="${accent}" opacity="0.14"/>
        <g fill="none" stroke="${accent}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">
          ${iconPaths[icon]}
        </g>
      </svg>
    `;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }
}

