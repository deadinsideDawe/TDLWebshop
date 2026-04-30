import { ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../app/services/cart.service';
import { ProductService } from '../../app/services/product.service';
import { Product } from '../../app/models/product.model';
import { OrderService } from '../../app/services/order.service';
import { Order } from '../../app/models/order.model';
import { ToastService } from '../../app/services/toast.service';
import { WishlistService } from '../../app/services/wishlist.service';
import { InstallerPackageService } from '../../app/services/installer-package.service';
import { normalizeErrorMessage } from '../../app/utils/error-message';
import { getProductPricing } from '../../app/utils/product-pricing';
import { InstallerPackage } from '../../app/models/installer-package.model';

interface ProductItem {
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
  saleStartsAt?: number;
  saleEndsAt?: number;
  createdAt?: number;
}

interface InstallerPackageItem {
  label: string;
  quantity: number;
  product: ProductItem | null;
}

interface InstallerPackageView {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  items: InstallerPackageItem[];
  availableCount: number;
  missingCount: number;
  total: number;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrls: ['./products.css']
})
export class Products implements OnInit, OnDestroy {
  // Nyers + szurt lista.
  products: ProductItem[] = [];
  filteredProducts: ProductItem[] = [];
  selectedProduct: ProductItem | null = null;
  selectedProductImage = '';
  cartPreviewProduct: ProductItem | null = null;
  minPrice = 0;
  maxPrice: number | null = null;
  searchTerm = '';
  loading = true;
  dataSourceLabel = 'Firestore';
  errorMessage = '';
  promoFilter = '';

  selectedCategories: string[] = [];
  selectedStocks: string[] = [];

  categories = ['Fűtés', 'Hűtés', 'Víz', 'Szellőzés', 'Szerelvények', 'Lakossági megoldások'];
  stockOptions = ['Készleten', 'Szállítható'];
  selectedInstallerPackageId = '';
  installerPackages: InstallerPackage[] = [];
  private reservedByProductKey = new Map<string, number>();
  private soldByProductKey = new Map<string, number>();

  private unsubscribeProducts?: () => void;
  private unsubscribeOrders?: () => void;
  private unsubscribeInstallerPackages?: () => void;

  constructor(
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private orderService: OrderService,
    private toastService: ToastService,
    private wishlistService: WishlistService,
    private installerPackageService: InstallerPackageService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // URL query param valtozasra ujraszurunk (kategoria/kereses).
    this.route.queryParamMap.subscribe(params => {
      const categoryFromUrl = params.get('category');
      const categoriesFromUrl = params.get('categories');
      const searchFromUrl = params.get('search');
      const minPriceFromUrl = params.get('minPrice');
      const maxPriceFromUrl = params.get('maxPrice');
      const stocksFromUrl = params.get('stocks');
      const stockFromUrl = params.get('stock');
      const promoFromUrl = params.get('promo');

      this.selectedCategories = categoriesFromUrl
        ? categoriesFromUrl.split(',').map(item => item.trim()).filter(Boolean)
        : (categoryFromUrl ? [categoryFromUrl] : []);
      this.selectedStocks = stocksFromUrl
        ? stocksFromUrl.split(',').map(item => item.trim()).filter(Boolean)
        : (stockFromUrl ? [stockFromUrl] : []);
      this.searchTerm = searchFromUrl ? searchFromUrl.trim().toLowerCase() : '';
      this.promoFilter = promoFromUrl ? promoFromUrl.trim().toLowerCase() : '';

      if (minPriceFromUrl !== null && !Number.isNaN(Number(minPriceFromUrl))) {
        this.minPrice = Math.max(0, Number(minPriceFromUrl));
      }

      if (maxPriceFromUrl !== null && !Number.isNaN(Number(maxPriceFromUrl))) {
        this.maxPrice = Math.max(0, Number(maxPriceFromUrl));
      } else {
        this.maxPrice = null;
      }

      this.applyFilters(false);
    });

    // Firestore realtime termek stream.
    this.unsubscribeProducts = this.productService.getProductsStream(
      products => {
        this.ngZone.run(() => {
          this.loading = false;
          this.errorMessage = '';
          this.dataSourceLabel = 'Firestore';
          this.products = products.map((product, index) => this.mapFirestoreProduct(product, index));

          this.refreshFilterOptions();
          this.applyFilters(false);
          this.cdr.detectChanges();
        });
      },
      error => {
        this.ngZone.run(() => {
          console.error(error);
          this.loading = false;
          this.dataSourceLabel = 'Firestore (hiba)';
          this.errorMessage = normalizeErrorMessage(error, 'A Firestore termékbetöltés nem sikerült.');
          this.products = [];
          this.refreshFilterOptions();
          this.applyFilters(false);
          this.toastService.error('Termékek betöltése sikertelen', this.errorMessage);
          this.cdr.detectChanges();
        });
      }
    );

    this.unsubscribeOrders = this.orderService.getOrdersStream(
      orders => {
        this.ngZone.run(() => {
          this.rebuildOrderMaps(orders);
          this.applyFilters(false);
          this.cdr.detectChanges();
        });
      },
      error => {
        this.ngZone.run(() => {
          console.error(error);
          this.rebuildOrderMaps([]);
          this.applyFilters(false);
          this.cdr.detectChanges();
        });
      }
    );

    this.unsubscribeInstallerPackages = this.installerPackageService.getActivePackagesStream(
      packages => {
        this.ngZone.run(() => {
          this.installerPackages = packages;
          if (!this.selectedInstallerPackageId && packages[0]?.id) {
            this.selectedInstallerPackageId = packages[0].id;
          }
          this.cdr.detectChanges();
        });
      },
      error => {
        this.ngZone.run(() => {
          console.error(error);
          this.installerPackages = [];
          this.cdr.detectChanges();
        });
      }
    );
  }

  ngOnDestroy(): void {
    if (this.unsubscribeProducts) {
      this.unsubscribeProducts();
    }

    if (this.unsubscribeOrders) {
      this.unsubscribeOrders();
    }

    if (this.unsubscribeInstallerPackages) {
      this.unsubscribeInstallerPackages();
    }
  }

  addToCart(product: ProductItem): void {
    // Keszlethiannyal nem engedunk kosarba tenni.
    if (!this.canAddToCart(product)) {
      return;
    }

    this.cartService.addToCart(product);
    this.cartPreviewProduct = product;
    this.toastService.success('Termék a kosárban', product.name);
  }

  toggleWishlist(product: ProductItem): void {
    const added = this.wishlistService.toggleWishlist({
      id: product.id,
      key: product.key,
      firestoreId: product.firestoreId,
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.price,
      image: product.image,
      stock: product.stock,
      stockQuantity: product.stockQuantity,
      shortDescription: product.shortDescription
    });

    this.toastService.success(
      added ? 'Termék elmentve' : 'Termék eltávolítva',
      product.name
    );
  }

  isInWishlist(product: ProductItem): boolean {
    return this.wishlistService.isInWishlist(product);
  }

  openProductDetails(product: ProductItem): void {
    this.selectedProduct = product;
    this.selectedProductImage = product.images[0] || product.image;
  }

  closeProductDetails(): void {
    this.selectedProduct = null;
    this.selectedProductImage = '';
  }

  selectProductImage(image: string): void {
    this.selectedProductImage = image;
  }

  addSelectedProductToCart(): void {
    if (!this.selectedProduct || !this.canAddToCart(this.selectedProduct)) {
      return;
    }

    this.addToCart(this.selectedProduct);
  }

  closeCartPreview(): void {
    this.cartPreviewProduct = null;
  }

  goToCart(): void {
    this.closeCartPreview();
    void this.router.navigate(['/cart']);
  }

  selectInstallerPackage(packageId: string): void {
    this.selectedInstallerPackageId = packageId;
  }

  get installerPackageTabs(): Array<{ id: string; name: string }> {
    return this.installerPackages
      .filter(item => !!item.id)
      .map(item => ({ id: item.id!, name: item.name }));
  }

  get activeInstallerPackage(): InstallerPackageView {
    const definition =
      this.installerPackages.find(item => item.id === this.selectedInstallerPackageId) ||
      this.installerPackages[0];

    if (!definition) {
      return {
        id: '',
        name: '',
        subtitle: '',
        description: '',
        items: [],
        availableCount: 0,
        missingCount: 0,
        total: 0
      };
    }

    const items = (definition.items || []).map(line => {
      const product = this.products.find(item => this.normalizeSearchText(item.sku) === this.normalizeSearchText(line.productSku)) || null;

      return {
        label: line.label || line.productSku,
        quantity: Math.max(1, Number(line.quantity) || 1),
        product
      };
    });

    return {
      id: definition.id || '',
      name: definition.name,
      subtitle: definition.subtitle,
      description: definition.description,
      items,
      availableCount: items.filter(item => !!item.product).length,
      missingCount: items.filter(item => !item.product).length,
      total: items.reduce((sum, item) => sum + (item.product ? item.product.price * item.quantity : 0), 0)
    };
  }

  canAddInstallerPackage(packageView = this.activeInstallerPackage): boolean {
    return packageView.items.some(item => !!item.product);
  }

  addInstallerPackageToCart(packageView = this.activeInstallerPackage): void {
    const availableItems = packageView.items.filter(item => !!item.product) as Array<InstallerPackageItem & { product: ProductItem }>;

    if (availableItems.length === 0) {
      this.toastService.error('A csomag nem tehető kosárba', 'Nincs elérhető termék a kiválasztott csomaghoz.');
      return;
    }

    for (const item of availableItems) {
      this.cartService.addToCart(item.product, item.quantity);
    }

    this.toastService.success('Szerelői csomag a kosárban', packageView.name);
  }

  getStockState(product: ProductItem): 'in-stock' | 'low-stock' | 'out-stock' {
    if (product.stockQuantity <= 0 || product.stock.toLowerCase().includes('nincs')) {
      return 'out-stock';
    }

    if (product.stockQuantity <= 5) {
      return 'low-stock';
    }

    return 'in-stock';
  }

  getStockStateLabel(product: ProductItem): string {
    const state = this.getStockState(product);

    if (state === 'out-stock') {
      return 'Nincs készleten';
    }

    if (state === 'low-stock') {
      return 'Kevés készlet';
    }

    return 'Raktáron';
  }

  canAddToCart(product: ProductItem): boolean {
    return this.getStockState(product) !== 'out-stock';
  }

  hasTopBadge(product: ProductItem): boolean {
    return !!product.isTopProduct || this.getSoldQuantity(product) >= 5;
  }

  onCategoryChange(category: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      if (!this.selectedCategories.includes(category)) {
        this.selectedCategories.push(category);
      }
    } else {
      this.selectedCategories = this.selectedCategories.filter(c => c !== category);
    }
  }

  onStockChange(stock: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      if (!this.selectedStocks.includes(stock)) {
        this.selectedStocks.push(stock);
      }
    } else {
      this.selectedStocks = this.selectedStocks.filter(s => s !== stock);
    }
  }

  applyFilters(syncQueryParams = true): void {
    // Osszes aktiv szuro egyszerre ervenyesul.
    const normalizedMinPrice = this.normalizeMinPrice();
    const normalizedMaxPrice = this.normalizeMaxPrice();

    const baseFilteredProducts = this.products.filter(product => {
      const normalizedName = this.normalizeSearchText(product.name);
      const normalizedCategory = this.normalizeSearchText(product.category);

      const matchesPrice =
        product.price >= normalizedMinPrice &&
        (normalizedMaxPrice === null || product.price <= normalizedMaxPrice);
      const matchesCategory =
        this.selectedCategories.length === 0 ||
        this.selectedCategories.some(selected => this.categoryMatches(selected, product.category));
      const matchesStock = this.selectedStocks.length === 0 || this.selectedStocks.includes(product.stock);
      const matchesSearch =
        !this.searchTerm ||
        this.matchesSearchTokens(product, this.searchTerm, normalizedName, normalizedCategory);
      return matchesPrice && matchesCategory && matchesStock && matchesSearch;
    });

    let nextFilteredProducts = baseFilteredProducts.filter(product => this.matchesPromoFilter(product));

    // Ha promo szures tul szigoru es uresre fut, adunk ertelmes fallback listat.
    if (this.promoFilter && nextFilteredProducts.length === 0) {
      nextFilteredProducts = this.getPromoFallbackProducts(baseFilteredProducts);
    }

    this.filteredProducts = nextFilteredProducts;

    if (this.promoFilter === 'top') {
      this.filteredProducts.sort((left, right) => this.getSoldQuantity(right) - this.getSoldQuantity(left));
    }

    if (syncQueryParams) {
      this.syncQueryParams();
    }
  }

  resetFilters(): void {
    this.minPrice = 0;
    this.maxPrice = null;
    this.searchTerm = '';
    this.selectedCategories = [];
    this.selectedStocks = [];
    this.filteredProducts = [...this.products];

    void this.router.navigate(['/products'], {
      queryParams: {}
    });
  }

  private refreshFilterOptions(): void {
    // A kategoria checkbox lista fix marad (ne ugraljon betoltes utan).
    // A categoryMatches alias kezeles gondoskodik rola, hogy pl. "Padlofutes" is
    // megtalalhato legyen a "Futes" kategoria alatt.
    this.stockOptions = [...new Set(this.products.map(product => product.stock))];

    // Nincs alap max ar; csak akkor szurunk felfele, ha a user beirja.
  }

  private mapFirestoreProduct(product: Product, index: number): ProductItem {
    // Firestore model normalizalasa UI-kompatibilis alakra.
    const categoryFallbacks = this.getCategoryImages(product.category);
    const hasRealPrimaryImage =
      !!product.image &&
      product.image !== 'tdl-header-logo.svg' &&
      !product.image.toLowerCase().endsWith('.svg');

    const baseImage = hasRealPrimaryImage
      ? product.image
      : categoryFallbacks[0];

    const hasRealGallery =
      !!product.images &&
      product.images.length > 0 &&
      product.images.some(img => img !== 'tdl-header-logo.svg' && !img.toLowerCase().endsWith('.svg'));

    const images =
      hasRealGallery
        ? product.images!
        : categoryFallbacks;

    const pricing = getProductPricing({
      price: Number(product.price) || 0,
      salePercent: Number(product.salePercent) || 0,
      saleStartsAt: Number(product.saleStartsAt) || undefined,
      saleEndsAt: Number(product.saleEndsAt) || undefined,
      isWeeklyDeal: !!product.isWeeklyDeal
    });

    return {
      id: index + 1,
      key: product.id || product.sku || product.name,
      firestoreId: product.id,
      name: product.name,
      price: pricing.finalPrice,
      originalPrice: pricing.originalPrice,
      discountPercent: pricing.discountPercent,
      hasDiscount: pricing.hasDiscount,
      category: product.category || 'Egyeb',
      stock: product.stock || 'Készleten',
      stockQuantity: Number(product.stockQuantity) || 0,
      sku: product.sku || `TDL-${index + 1}`,
      brand: product.brand || 'TDL Webshop',
      isWeeklyDeal: !!product.isWeeklyDeal,
      isTopProduct: !!product.isTopProduct,
      salePercent: Number(product.salePercent) || 0,
      saleStartsAt: Number(product.saleStartsAt) || undefined,
      saleEndsAt: Number(product.saleEndsAt) || undefined,
      createdAt: Number(product.createdAt) || 0,
      shortDescription: product.shortDescription || 'Admin felületen rögzített termék.',
      description:
        product.description ||
        product.shortDescription ||
        'Ehhez a termékhez még nem lett részletes leírás megadva.',
      image: baseImage,
      images
    };
  }

  private getCategoryImages(category?: string): string[] {
    // Kategoria alapu fallback galeriasorrend.
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

  private categoryMatches(selectedCategory: string, productCategory: string): boolean {
    // Alias kezeles: pl. "viz" talalja a "vizszereles" termekeket is.
    const selected = this.normalizeCategory(selectedCategory);
    const product = this.normalizeCategory(productCategory);

    if (selected === product) {
      return true;
    }

    const aliases: Record<string, string[]> = {
      kazanok: ['padlofutes', 'radiatorok', 'futes'],
      radiatorok: ['padlofutes', 'futes'],
      csovezetekek: ['padlofutes', 'szerelvenyek', 'vizszereles'],
      vizszereles: ['szerelvenyek', 'padlofutes', 'csovezetekek'],
      viz: ['vizszereles', 'csovezetekek', 'szerelvenyek'],
      szivattyuk: ['szellozes', 'hutes', 'hvac'],
      hutes: ['szellozes', 'szivattyuk', 'hvac'],
      furdoszoba: ['szerelvenyek', 'vizszereles'],
      futes: ['padlofutes', 'radiatorok', 'kazanok'],
      lakossagimegoldasok: ['padlofutes', 'radiatorok', 'szerelvenyek', 'vizszereles']
    };

    const mapped = aliases[selected] || [];
    return mapped.includes(product);
  }

  private normalizeCategory(category: string): string {
    return category
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '')
      .trim();
  }

  private matchesSearchTokens(
    product: ProductItem,
    searchTerm: string,
    normalizedName: string,
    normalizedCategory: string
  ): boolean {
    // Tobb kulcsszavas kereses: minden tokennek szerepelnie kell valamelyik mezo-ben.
    const normalizedSearch = this.normalizeSearchText(searchTerm);
    const tokens = normalizedSearch
      .split(/\s+/)
      .map(token => token.trim())
      .filter(Boolean);

    if (tokens.length === 0) {
      return true;
    }

    const haystack = [
      normalizedName,
      normalizedCategory,
      this.normalizeSearchText(product.shortDescription),
      this.normalizeSearchText(product.description),
      this.normalizeSearchText(product.sku),
      this.normalizeSearchText(product.brand)
    ].join(' ');

    return tokens.every(token => haystack.includes(token));
  }

  private normalizeSearchText(text: string): string {
    return (text || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  getReservedQuantity(product: ProductItem): number {
    const keys = [
      product.firestoreId || '',
      product.sku || '',
      product.name.toLowerCase()
    ].filter(Boolean);

    for (const key of keys) {
      const reserved = this.reservedByProductKey.get(key);
      if (reserved) {
        return reserved;
      }
    }

    return 0;
  }

  getSoldQuantity(product: ProductItem): number {
    const keys = [
      product.firestoreId || '',
      product.sku || '',
      product.name.toLowerCase()
    ].filter(Boolean);

    for (const key of keys) {
      const sold = this.soldByProductKey.get(key);
      if (sold) {
        return sold;
      }
    }

    return 0;
  }

  private rebuildOrderMaps(orders: Order[]): void {
    const reservingStatuses = new Set(['uj', 'feldolgozas alatt']);
    const soldStatuses = new Set(['teljesitve']);
    const reservedMap = new Map<string, number>();
    const soldMap = new Map<string, number>();

    for (const order of orders) {
      for (const item of order.items) {
        const keys = [
          item.firestoreId || '',
          item.sku || '',
          item.name?.toLowerCase() || ''
        ].filter(Boolean);

        for (const key of keys) {
          if (reservingStatuses.has(order.status)) {
            reservedMap.set(key, (reservedMap.get(key) || 0) + item.quantity);
          }

          if (soldStatuses.has(order.status)) {
            soldMap.set(key, (soldMap.get(key) || 0) + item.quantity);
          }
        }
      }
    }

    this.reservedByProductKey = reservedMap;
    this.soldByProductKey = soldMap;
  }

  private syncQueryParams(): void {
    const normalizedMinPrice = this.normalizeMinPrice();
    const normalizedMaxPrice = this.normalizeMaxPrice();
    const queryParams: Record<string, string | number> = {};

    if (this.searchTerm) {
      queryParams['search'] = this.searchTerm;
    }

    if (this.promoFilter) {
      queryParams['promo'] = this.promoFilter;
    }

    if (this.selectedCategories.length > 0) {
      queryParams['categories'] = this.selectedCategories.join(',');
    }

    if (this.selectedCategories.length === 1) {
      queryParams['category'] = this.selectedCategories[0];
    }

    if (this.selectedStocks.length > 0) {
      queryParams['stocks'] = this.selectedStocks.join(',');
    }

    if (normalizedMinPrice > 0) {
      queryParams['minPrice'] = normalizedMinPrice;
    }

    if (normalizedMaxPrice !== null && normalizedMaxPrice > 0) {
      queryParams['maxPrice'] = normalizedMaxPrice;
    }

    void this.router.navigate(['/products'], {
      queryParams,
      replaceUrl: true
    });
  }

  private normalizeMinPrice(): number {
    const value = Number(this.minPrice);
    if (!Number.isFinite(value) || value < 0) {
      return 0;
    }

    return value;
  }

  private normalizeMaxPrice(): number | null {
    const rawValue = this.maxPrice as unknown;

    if (rawValue === null || rawValue === undefined) {
      return null;
    }

    if (typeof rawValue === 'string' && rawValue.trim() === '') {
      return null;
    }

    const value = Number(rawValue);
    if (!Number.isFinite(value) || value < 0) {
      return null;
    }

    return value;
  }

  private matchesPromoFilter(product: ProductItem): boolean {
    if (!this.promoFilter) {
      return true;
    }

    if (this.promoFilter === 'discount15') {
      return product.hasDiscount || product.isWeeklyDeal;
    }

    if (this.promoFilter === 'top') {
      return !!product.isTopProduct || this.getSoldQuantity(product) > 0;
    }

    if (this.promoFilter === 'new') {
      if (!product.createdAt) {
        return false;
      }

      const fortyFiveDaysMs = 45 * 24 * 60 * 60 * 1000;
      return Date.now() - product.createdAt <= fortyFiveDaysMs;
    }

    return true;
  }

  private getPromoFallbackProducts(baseProducts: ProductItem[]): ProductItem[] {
    if (this.promoFilter === 'discount15') {
      return baseProducts
        .filter(product => this.getStockState(product) !== 'out-stock')
        .sort((left, right) => left.price - right.price)
        .slice(0, 12);
    }

    if (this.promoFilter === 'top') {
      return baseProducts
        .filter(product => product.stockQuantity >= 8)
        .sort((left, right) => right.stockQuantity - left.stockQuantity)
        .slice(0, 12);
    }

    if (this.promoFilter === 'new') {
      const withTimestamp = baseProducts.filter(product => (product.createdAt || 0) > 0);

      if (withTimestamp.length > 0) {
        return withTimestamp
          .sort((left, right) => (right.createdAt || 0) - (left.createdAt || 0))
          .slice(0, 12);
      }

      // Ha hianyzik createdAt a regi adatoknal, mutatjuk az aktualis lista elejet.
      return baseProducts.slice(0, 12);
    }

    return baseProducts;
  }
}

