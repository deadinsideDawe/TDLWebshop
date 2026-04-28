import { ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../app/services/auth.service';
import { ProductService } from '../../app/services/product.service';
import { OrderService } from '../../app/services/order.service';
import { UserService } from '../../app/services/user.service';
import { CustomerDirectoryService } from '../../app/services/customer-directory.service';
import { InvoiceService } from '../../app/services/invoice.service';
import { NewsService } from '../../app/services/news.service';
import { NewsletterService } from '../../app/services/newsletter.service';
import { Order } from '../../app/models/order.model';
import { Product } from '../../app/models/product.model';
import { UserProfile } from '../../app/models/user-profile.model';
import { CustomerProfile } from '../../app/models/customer-profile.model';
import { NewsItem } from '../../app/models/news.model';
import { NewsletterSubscriber } from '../../app/models/newsletter-subscriber.model';
import { environment } from '../../environments/environment';
import { CartItem } from '../../app/services/cart.service';
import { ToastService } from '../../app/services/toast.service';
import { ClientLogItem, MonitoringService } from '../../app/services/monitoring.service';
import { normalizeErrorMessage, getErrorCode } from '../../app/utils/error-message';
import { isValidEmail, isValidOptionalPhone, isValidPhone } from '../../app/utils/form-validators';
import { Subscription } from 'rxjs';

interface StockChartItem {
  productId: string;
  name: string;
  sku: string;
  category: string;
  totalStock: number;
  reservedStock: number;
  availableStock: number;
  reservedPercent: number;
  availablePercent: number;
}

interface SmartStockSuggestion {
  productId: string;
  name: string;
  sku: string;
  category: string;
  availableStock: number;
  reservedStock: number;
  sold30Days: number;
  dailyDemand: number;
  daysLeft: number | null;
  reorderQuantity: number;
  priority: 'critical' | 'warning' | 'stable';
  label: string;
}

interface TopProductReportItem {
  name: string;
  quantity: number;
  revenue: number;
}

interface BusinessReport {
  totalRevenue: number;
  monthlyRevenue: number;
  averageOrderValue: number;
  completedOrderCount: number;
  webOrderCount: number;
  localOrderCount: number;
  topProducts: TopProductReportItem[];
}

type AdminSection = 'overview' | 'inventory' | 'products' | 'orders' | 'users' | 'notifications' | 'account';
type AdminRole = 'admin' | 'employee' | 'customer';

interface AdminUserView {
  id: string;
  email: string;
  role: AdminRole;
  accountType: 'private' | 'company';
  displayName: string;
  phone: string;
  companyName: string;
  taxNumber: string;
  note: string;
  disabled: boolean;
  employeePermissions: NonNullable<UserProfile['employeePermissions']>;
  createdAt: number;
  lastLoginAt?: number;
  latestOrderAt?: number;
  orderCount: number;
  totalSpent: number;
  orders: Order[];
}

interface LocalSaleLine {
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  image: string;
}

interface AdminClientLogView {
  id: string;
  event: string;
  message: string;
  createdAt: number;
  userEmail: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class Admin implements OnInit, OnDestroy {
  // Aktiv admin resz (overview/inventory/products/orders/users/notifications/account).
  activeSection: AdminSection = 'overview';
  editingProductId: string | null = null;
  productName = '';
  productPrice: number | null = null;
  productCategory = '';
  productCategoryOptions = [
    'Fűtés',
    'Hűtés',
    'Víz',
    'Szellőzés',
    'Szerelvények',
    'Lakossági megoldások'
  ];
  productImage = '';
  productStock = 'Keszleten';
  productBrand = '';
  productSku = '';
  productShortDescription = '';
  productDescription = '';
  productStockQuantity: number | null = 10;
  productIsWeeklyDeal = false;
  productIsTopProduct = false;
  productSalePercent: number | null = null;
  productSaleStartsAt = '';
  productSaleEndsAt = '';
  productSearchTerm = '';
  newsTitle = '';
  newsContent = '';
  newsLabel = '';
  newsIsActive = true;
  newsTargetType: 'none' | 'products' | 'category' | 'promo' = 'none';
  newsTargetValue = '';
  // Ha van id, akkor az adott hir szerkesztesi modban van.
  editingNewsId: string | null = null;
  newsSaving = false;
  deletingNewsId: string | null = null;
  newsLoading = true;
  newsError = '';
  newsItems: NewsItem[] = [];
  newsletterSubscribers: NewsletterSubscriber[] = [];
  newsletterLoading = true;
  newsletterError = '';

  loading = false;
  seedingProducts = false;
  seedingCatalogProducts = false;
  normalizingProductTexts = false;
  importingCsvProducts = false;
  csvImportMode: 'insert' | 'upsertBySku' = 'upsertBySku';
  csvImportFileName = '';
  csvImportSummary = '';
  csvImportErrors: string[] = [];
  csvImportPreview: Product[] = [];
  deletingProductId: string | null = null;
  deleteProductConfirmOpen = false;
  deleteAllProductsConfirmOpen = false;
  pendingProductDelete: Product | null = null;
  purgingProducts = false;
  errorMessage = '';
  successMessage = '';

  products: Product[] = [];
  orders: Order[] = [];
  users: UserProfile[] = [];
  userSummaries: AdminUserView[] = [];
  ordersLoading = true;
  productsLoading = true;
  usersLoading = true;
  ordersError = '';
  productsError = '';
  usersError = '';
  orderStatusLoadingId: string | null = null;
  invoiceLoadingId: string | null = null;
  orderStatusConfirmOpen = false;
  pendingOrderStatusChange: { order: Order } | null = null;
  pendingOrderStatusChoice = 'uj';
  orderDetailsOpen = false;
  selectedOrderDetails: Order | null = null;
  userActionLoadingId: string | null = null;
  userDetailsOpen = false;
  selectedUserDetails: AdminUserView | null = null;
  userDetailsSaving = false;
  userEditorEmail = '';
  userEditorDisplayName = '';
  userEditorRole: AdminRole = 'customer';
  userEditorAccountType: 'private' | 'company' = 'private';
  userEditorPhone = '';
  userEditorCompanyName = '';
  userEditorTaxNumber = '';
  userEditorNote = '';
  userEditorDisabled = false;
  userEditorCanRecordSales = true;
  userEditorCanViewInventory = true;
  userEditorCanManageProducts = true;
  userEditorCanManageCustomers = true;
  userEditorCanDisableCustomers = true;
  creatingUser = false;
  createUserEmail = '';
  createUserDisplayName = '';
  createUserRole: AdminRole = 'customer';
  createUserAccountType: 'private' | 'company' = 'private';
  createUserPhone = '';
  createUserCompanyName = '';
  createUserTaxNumber = '';
  createUserNote = '';
  createUserCanRecordSales = true;
  createUserCanViewInventory = true;
  createUserCanManageProducts = true;
  createUserCanManageCustomers = true;
  createUserCanDisableCustomers = true;
  stockChart: StockChartItem[] = [];
  lowStockAlerts: StockChartItem[] = [];
  smartStockSuggestions: SmartStockSuggestion[] = [];
  businessReport: BusinessReport = this.getEmptyBusinessReport();
  selectedInventoryCategory = '';
  lowStockModalOpen = false;
  private hasShownLowStockWarning = false;
  localSaleCustomerName = '';
  localSaleCustomerEmail = '';
  localSaleCustomerPhone = '';
  localSaleIsBusinessBuyer = false;
  localSaleCompanyName = '';
  localSaleTaxNumber = '';
  localSaleComment = '';
  localSalePaymentMethod = 'cash';
  localSalePaymentDeadlineDays = 10;
  localSaleSelectedProductId = '';
  localSaleProductSearch = '';
  localSaleProductSearchOpen = false;
  localSaleQuantity = 1;
  localSaleLines: LocalSaleLine[] = [];
  localSaleLoading = false;
  localSaleError = '';
  localSaleSuccess = '';
  localSaleProfiles: CustomerProfile[] = [];
  selectedLocalSaleProfileId = '';
  localSaleProfilesLoading = true;
  localSaleProfilesError = '';
  localSaleProfileActionLoading = false;
  localSaleProfilePickerOpen = false;
  localSaleProfileSearch = '';
  localSaleSaveCustomerForLater = false;
  customerProfileEditorOpen = false;
  customerProfileEditorSaving = false;
  customerProfileDeletingId: string | null = null;
  customerProfileEditorId = '';
  customerProfileEditorType: 'private' | 'company' = 'private';
  customerProfileEditorName = '';
  customerProfileEditorEmail = '';
  customerProfileEditorPhone = '';
  customerProfileEditorCompanyName = '';
  customerProfileEditorTaxNumber = '';
  customerProfileEditorDisabled = false;
  customerProfileEditorPaymentTermDays = 10;
  customerProfileEditorNote = '';
  customerHistoryOpen = false;
  selectedCustomerHistoryProfile: CustomerProfile | null = null;
  orderListView: 'active' | 'completed' | 'local' = 'active';
  recentClientLogs: AdminClientLogView[] = [];
  logsLoading = true;
  logsError = '';

  private unsubscribeOrders?: () => void;
  private unsubscribeProducts?: () => void;
  private unsubscribeUsers?: () => void;
  private unsubscribeLocalSaleProfiles?: () => void;
  private unsubscribeNews?: () => void;
  private unsubscribeNewsletter?: () => void;
  private unsubscribeLogs?: () => void;
  private authSubscription?: Subscription;
  private loadingFallbackTimer?: ReturnType<typeof setTimeout>;
  private lastAdminUserId = '';

  constructor(
    private route: ActivatedRoute,
    public auth: AuthService,
    private productService: ProductService,
    private orderService: OrderService,
    private userService: UserService,
    private customerDirectoryService: CustomerDirectoryService,
    private invoiceService: InvoiceService,
    private newsService: NewsService,
    private newsletterService: NewsletterService,
    private toastService: ToastService,
    private monitoringService: MonitoringService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Admin bejelentkezésnél ujraengedem az alacsony készlet popupot.
    this.authSubscription = this.auth.user$.subscribe(user => {
      const isStaff = !!user?.email && this.auth.isCurrentUserStaff();

      if (!isStaff) {
        this.lastAdminUserId = '';
        this.hasShownLowStockWarning = false;
        return;
      }

      if (user?.uid && user.uid !== this.lastAdminUserId) {
        this.lastAdminUserId = user.uid;
        this.hasShownLowStockWarning = false;

        if (this.lowStockAlerts.length > 0) {
          this.lowStockModalOpen = true;
          this.hasShownLowStockWarning = true;
          this.cdr.detectChanges();
        }
      }
    });

    // URL query param alapjan allitjuk be, melyik admin tab nyiljon meg.
    this.route.queryParamMap.subscribe(params => {
      const section = params.get('section');

      if (this.isValidAdminSection(section)) {
        this.activeSection = section;
      } else {
        this.activeSection = 'overview';
      }

      this.ensureSectionAllowedForRole();
    });

    // Vedo timeout, hogy ne maradjon vegtelen loader ha a stream lassu.
    this.loadingFallbackTimer = setTimeout(() => {
      if (this.productsLoading) {
        this.productsLoading = false;
        this.productsError = 'A készletadatok betöltése tul sokáig tart vagy nem érkezett adat.';
      }
    }, 5000);

    // Realtime termék lista.
    this.unsubscribeProducts = this.productService.getProductsStream(
      products => {
        this.ngZone.run(() => {
          this.products = products;
          this.productsLoading = false;
          this.productsError = '';
          this.rebuildDashboard();
          this.cdr.detectChanges();
        });
      },
      error => {
        this.ngZone.run(() => {
          console.error(error);
          this.productsLoading = false;
          this.productsError = 'A termékek betöltése nem sikerült az admin nezethez.';
          this.cdr.detectChanges();
        });
      }
    );

    // Rendeléslista csak annak nyílik meg, aki rögzíthet rendelést vagy admin.
    if (this.canRecordSales()) {
      this.unsubscribeOrders = this.orderService.getOrdersStream(
        orders => {
          this.ngZone.run(() => {
            this.orders = orders;
            this.ordersLoading = false;
            this.ordersError = '';
            this.rebuildDashboard();
            this.cdr.detectChanges();
          });
        },
        error => {
          this.ngZone.run(() => {
            console.error(error);
            this.ordersLoading = false;
            this.ordersError = 'A rendelések betöltése nem sikerült.';
            this.cdr.detectChanges();
          });
        }
      );
    } else {
      this.orders = [];
      this.ordersLoading = false;
    }

    // A teljes felhasználólista admin-only adat, dolgozónál nem nyitunk rá streamet.
    if (this.auth.isCurrentUserAdmin()) {
      this.unsubscribeUsers = this.userService.getUsersStream(
        users => {
          this.ngZone.run(() => {
            this.users = users;
            this.usersLoading = false;
            this.usersError = '';
            this.rebuildDashboard();
            this.cdr.detectChanges();
          });
        },
        error => {
          this.ngZone.run(() => {
            console.error(error);
            this.usersLoading = false;
            this.usersError = 'A felhasználók betöltése nem sikerült.';
            this.cdr.detectChanges();
          });
        }
      );
    } else {
      this.users = [];
      this.usersLoading = false;
    }

    // Mentett vásárló/cég lista csak rendelésrögzítéshez vagy vásárlókezeléshez kell.
    if (this.canRecordSales() || this.canManageCustomers()) {
      this.unsubscribeLocalSaleProfiles = this.customerDirectoryService.getProfilesStream(
        profiles => {
          this.ngZone.run(() => {
            this.localSaleProfiles = profiles;
            this.localSaleProfilesLoading = false;
            this.localSaleProfilesError = '';
            this.cdr.detectChanges();
          });
        },
        error => {
          this.ngZone.run(() => {
            console.error(error);
            this.localSaleProfilesLoading = false;
            this.localSaleProfilesError = 'A mentett vásárló/cég lista betöltése nem sikerült.';
            this.cdr.detectChanges();
          });
        }
      );
    } else {
      this.localSaleProfiles = [];
      this.localSaleProfilesLoading = false;
    }

    this.unsubscribeNews = this.newsService.getAllNewsStream(
      items => {
    // Admin oldalon a teljes hirlista latszik (aktiv + inaktiv).
        this.ngZone.run(() => {
          this.newsItems = items;
          this.newsLoading = false;
          this.newsError = '';
          this.cdr.detectChanges();
        });
      },
      error => {
        this.ngZone.run(() => {
          console.error(error);
          this.newsLoading = false;
          this.newsError = 'A hírek betöltése nem sikerült.';
          this.cdr.detectChanges();
        });
      }
    );

    if (this.auth.isCurrentUserAdmin()) {
      this.unsubscribeNewsletter = this.newsletterService.getSubscribersStream(
        items => {
          this.ngZone.run(() => {
            this.newsletterSubscribers = items;
            this.newsletterLoading = false;
            this.newsletterError = '';
            this.cdr.detectChanges();
          });
        },
        error => {
          this.ngZone.run(() => {
            console.error(error);
            this.newsletterLoading = false;
            this.newsletterError = 'A hírlevél feliratkozók betöltése nem sikerült.';
            this.cdr.detectChanges();
          });
        }
      );
    } else {
      this.newsletterLoading = false;
    }

    // Kliens oldali hibalog stream (admin diagnosztika).
    if (this.auth.isCurrentUserAdmin()) {
      this.unsubscribeLogs = this.monitoringService.getRecentLogsStream(
        items => {
          this.ngZone.run(() => {
            this.recentClientLogs = items.map(item => this.mapClientLog(item));
            this.logsLoading = false;
            this.logsError = '';
            this.cdr.detectChanges();
          });
        },
        error => {
          this.ngZone.run(() => {
            console.error(error);
            this.logsLoading = false;
            this.logsError = 'A kliens hibalogok betöltése nem sikerült.';
            this.cdr.detectChanges();
          });
        }
      );
    } else {
      this.logsLoading = false;
    }
  }

  ngOnDestroy(): void {
    if (this.loadingFallbackTimer) {
      clearTimeout(this.loadingFallbackTimer);
    }

    if (this.unsubscribeProducts) {
      this.unsubscribeProducts();
    }

    if (this.unsubscribeOrders) {
      this.unsubscribeOrders();
    }

    if (this.unsubscribeUsers) {
      this.unsubscribeUsers();
    }

    if (this.unsubscribeLocalSaleProfiles) {
      this.unsubscribeLocalSaleProfiles();
    }

    if (this.unsubscribeNews) {
      this.unsubscribeNews();
    }

    if (this.unsubscribeNewsletter) {
      this.unsubscribeNewsletter();
    }

    if (this.unsubscribeLogs) {
      this.unsubscribeLogs();
    }

    this.authSubscription?.unsubscribe();
  }

  canUseStaffArea(): boolean {
    return this.auth.isCurrentUserStaff();
  }

  canUseAdminOnlyArea(): boolean {
    return this.auth.isCurrentUserAdmin();
  }

  canRecordSales(): boolean {
    return this.auth.isCurrentUserAdmin() || this.getCurrentEmployeePermissions().canRecordSales;
  }

  canViewInventory(): boolean {
    return this.auth.isCurrentUserAdmin() || this.getCurrentEmployeePermissions().canViewInventory;
  }

  canManageProducts(): boolean {
    return this.auth.isCurrentUserAdmin() || this.getCurrentEmployeePermissions().canManageProducts;
  }

  canManageCustomers(): boolean {
    return this.auth.isCurrentUserAdmin() || this.getCurrentEmployeePermissions().canManageCustomers;
  }

  canDisableCustomers(): boolean {
    return this.auth.isCurrentUserAdmin() || this.getCurrentEmployeePermissions().canDisableCustomers;
  }

  canApprovePaymentTerms(): boolean {
    return this.auth.canApprovePaymentTerms();
  }

  isCustomerRole(role: AdminRole): boolean {
    return role === 'customer';
  }

  isEmployeeRole(role: AdminRole): boolean {
    return role === 'employee';
  }

  get currentStaffProfile(): UserProfile | null {
    return this.auth.getProfile();
  }

  get currentStaffRoleLabel(): string {
    if (this.auth.isCurrentUserAdmin()) {
      return 'Admin';
    }

    if (this.auth.isCurrentUserEmployee()) {
      return 'Dolgozó';
    }

    return 'Vásárló';
  }

  private getCurrentEmployeePermissions(): NonNullable<UserProfile['employeePermissions']> {
    if (!this.auth.isCurrentUserEmployee()) {
      return this.getEmptyEmployeePermissions();
    }

    return {
      ...this.getDefaultEmployeePermissions(),
      ...(this.auth.getProfile()?.employeePermissions || {})
    };
  }

  private getCreateEmployeePermissions(): NonNullable<UserProfile['employeePermissions']> {
    return {
      canRecordSales: this.createUserCanRecordSales,
      canViewInventory: this.createUserCanViewInventory,
      canManageProducts: this.createUserCanManageProducts,
      canManageCustomers: this.createUserCanManageCustomers,
      canDisableCustomers: this.createUserCanDisableCustomers
    };
  }

  private getEditorEmployeePermissions(): NonNullable<UserProfile['employeePermissions']> {
    return {
      canRecordSales: this.userEditorCanRecordSales,
      canViewInventory: this.userEditorCanViewInventory,
      canManageProducts: this.userEditorCanManageProducts,
      canManageCustomers: this.userEditorCanManageCustomers,
      canDisableCustomers: this.userEditorCanDisableCustomers
    };
  }

  private getDefaultEmployeePermissions(): NonNullable<UserProfile['employeePermissions']> {
    return {
      canRecordSales: true,
      canViewInventory: true,
      canManageProducts: true,
      canManageCustomers: true,
      canDisableCustomers: true
    };
  }

  private getEmptyEmployeePermissions(): NonNullable<UserProfile['employeePermissions']> {
    return {
      canRecordSales: false,
      canViewInventory: false,
      canManageProducts: false,
      canManageCustomers: false,
      canDisableCustomers: false
    };
  }

  onCreateUserRoleChange(): void {
    if (this.createUserRole === 'employee') {
      this.createUserAccountType = 'private';
      this.createUserCompanyName = '';
      this.createUserTaxNumber = '';
      return;
    }

    if (this.createUserRole === 'admin') {
      this.createUserAccountType = 'private';
      this.createUserCompanyName = '';
      this.createUserTaxNumber = '';
      this.createUserCanRecordSales = true;
      this.createUserCanViewInventory = true;
      this.createUserCanManageProducts = true;
      this.createUserCanManageCustomers = true;
      this.createUserCanDisableCustomers = true;
    }
  }

  onUserEditorRoleChange(): void {
    if (this.userEditorRole === 'employee') {
      this.userEditorAccountType = 'private';
      this.userEditorCompanyName = '';
      this.userEditorTaxNumber = '';
      return;
    }

    if (this.userEditorRole === 'admin') {
      this.userEditorAccountType = 'private';
      this.userEditorCompanyName = '';
      this.userEditorTaxNumber = '';
      this.userEditorCanRecordSales = true;
      this.userEditorCanViewInventory = true;
      this.userEditorCanManageProducts = true;
      this.userEditorCanManageCustomers = true;
      this.userEditorCanDisableCustomers = true;
    }
  }

  get pendingPaymentTermProfiles(): CustomerProfile[] {
    return this.localSaleProfiles
      .filter(profile => this.normalizePaymentTermDays(profile.paymentTermDays) > 10 && profile.paymentTermApproved !== true)
      .sort((left, right) => this.normalizePaymentTermDays(right.paymentTermDays) - this.normalizePaymentTermDays(left.paymentTermDays));
  }

  private isValidAdminSection(section: string | null): section is AdminSection {
    return section === 'inventory'
      || section === 'products'
      || section === 'orders'
      || section === 'overview'
      || section === 'users'
      || section === 'notifications'
      || section === 'account';
  }

  private ensureSectionAllowedForRole(): void {
    if (this.auth.isCurrentUserAdmin()) {
      return;
    }

    if (this.activeSection === 'overview' || this.activeSection === 'users' || this.activeSection === 'notifications') {
      this.activeSection = 'orders';
    }

    if (this.activeSection === 'orders' && !this.canRecordSales()) {
      this.activeSection = this.canViewInventory() ? 'inventory' : 'account';
    }

    if (this.activeSection === 'inventory' && !this.canViewInventory()) {
      this.activeSection = this.canRecordSales() ? 'orders' : 'account';
    }

    if (this.activeSection === 'products' && !this.canManageProducts()) {
      this.activeSection = this.canRecordSales() ? 'orders' : 'account';
    }
  }

  async saveProduct(): Promise<void> {
    // Termék mentes (uj vagy szerkesztes mod, editingProductId alapjan).
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.canManageProducts()) {
      this.errorMessage = 'Ehhez a felülethez belső jogosultság kell.';
      return;
    }

    if (!this.productName || !this.productPrice || !this.productCategory || !this.productImage || this.productStockQuantity === null) {
      this.errorMessage = 'Minden mező kitöltése kötelező.';
      return;
    }

    const normalizedSalePercent = this.normalizeSalePercent(this.productSalePercent);
    const saleStartsAt = this.parseDatetimeLocal(this.productSaleStartsAt);
    const saleEndsAt = this.parseDatetimeLocal(this.productSaleEndsAt);

    if (saleStartsAt !== null && saleEndsAt !== null && saleStartsAt > saleEndsAt) {
      this.errorMessage = 'Az akció kezdete nem lehet később, mint a vége.';
      return;
    }

    if (normalizedSalePercent !== null && saleEndsAt !== null && saleStartsAt === null) {
      this.errorMessage = 'Ha megadod az akció végét, add meg a kezdetét is.';
      return;
    }

    this.loading = true;

    try {
      const payload = {
        name: this.productName,
        price: this.productPrice,
        category: this.productCategory,
        image: this.productImage,
        stock: this.productStock,
        stockQuantity: this.productStockQuantity,
        brand: this.productBrand,
        sku: this.productSku,
        shortDescription: this.productShortDescription,
        description: this.productDescription,
        isWeeklyDeal: this.productIsWeeklyDeal,
        isTopProduct: this.productIsTopProduct,
        salePercent: normalizedSalePercent ?? 0,
        saleStartsAt: saleStartsAt ?? 0,
        saleEndsAt: saleEndsAt ?? 0,
        images: [this.productImage]
      };

      if (this.editingProductId) {
        await this.productService.updateProduct(this.editingProductId, payload);
        this.successMessage = 'A termék adatai sikeresen frissítve lettek.';
        this.toastService.success('Termék frissítve', this.productName);
      } else {
        await this.productService.addProduct(payload);
        this.successMessage = 'A termék sikeresen elmentve a Firestore adatbázisba.';
        this.toastService.success('Termék mentve', this.productName);
      }

      this.resetForm();
    } catch (error) {
      console.error(error);
      this.errorMessage = normalizeErrorMessage(
        error,
        'A mentés nem sikerült. Ellenőrizd a Firebase beállításokat és a jogosultságokat.'
      );
      this.toastService.error('Termék mentése sikertelen', this.errorMessage);
    } finally {
      this.loading = false;
    }
  }

  async saveNews(): Promise<void> {
    // Uj hir mentese vagy meglevo frissitese egyetlen metodusban.
    this.newsError = '';

    if (!this.auth.isCurrentUserAdmin()) {
      this.newsError = 'Hír mentéséhez admin jogosultság kell.';
      return;
    }

    const title = this.newsTitle.trim();
    const content = this.newsContent.trim();
    const label = this.newsLabel.trim();

    if (!title || !content) {
      this.newsError = 'A hír címe és szövege kötelező.';
      return;
    }

    this.newsSaving = true;

    try {
      if (this.editingNewsId) {
        await this.newsService.updateNews(this.editingNewsId, {
          title,
          content,
          label,
          targetType: this.newsTargetType,
          targetValue: this.newsTargetValue.trim(),
          isActive: this.newsIsActive
        });
        this.toastService.success('Hír frissítve', title);
      } else {
        await this.newsService.addNews({
          title,
          content,
          label,
          targetType: this.newsTargetType,
          targetValue: this.newsTargetValue.trim(),
          isActive: this.newsIsActive
        });
        this.toastService.success('Új hír felvéve', title);
      }

      this.resetNewsForm();
    } catch (error) {
      console.error(error);
      this.monitoringService.capture('admin-news-save', error, {
        newsTitle: title,
        editingNewsId: this.editingNewsId || ''
      });
      this.newsError = normalizeErrorMessage(error, 'A hír mentése nem sikerült.');
      this.toastService.error('Hír mentése sikertelen', this.newsError);
    } finally {
      this.newsSaving = false;
    }
  }

  startEditNews(item: NewsItem): void {
    // A kiválasztott hir adatait visszatoltom az urlapba.
    this.editingNewsId = item.id || null;
    this.newsTitle = item.title || '';
    this.newsContent = item.content || '';
    this.newsLabel = item.label || '';
    this.newsTargetType = item.targetType || 'none';
    this.newsTargetValue = item.targetValue || '';
    this.newsIsActive = item.isActive !== false;
  }

  cancelNewsEdit(): void {
    this.resetNewsForm();
  }

  async deleteNews(item: NewsItem): Promise<void> {
    // Torlesnel id alapjan megy a Firestore dokumentum torles.
    if (!item.id) {
      return;
    }

    if (!this.auth.isCurrentUserAdmin()) {
      this.newsError = 'Hír törléséhez admin jogosultság kell.';
      return;
    }

    this.deletingNewsId = item.id;
    this.newsError = '';

    try {
      await this.newsService.deleteNews(item.id);
      this.toastService.success('Hír törölve', item.title);

      if (this.editingNewsId === item.id) {
        this.resetNewsForm();
      }
    } catch (error) {
      console.error(error);
      this.newsError = normalizeErrorMessage(error, 'A hír törlése nem sikerült.');
      this.toastService.error('Hír törlése sikertelen', this.newsError);
    } finally {
      this.deletingNewsId = null;
    }
  }

  async seedStarterProducts(): Promise<void> {
    // Alap demo termékek feltoltese (csak ures adatbazisra).
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.canManageProducts()) {
      this.errorMessage = 'Ehhez a művelethez belső jogosultság kell.';
      return;
    }

    this.seedingProducts = true;

    try {
      const seeded = await this.withTimeout(
        this.productService.seedProductsIfEmpty(this.getStarterProducts()),
        15000
      );

      if (!seeded) {
        this.successMessage = 'A Firestore már tartalmaz termékeket, ezért nem töltöttünk fel minta elemeket.';
        this.toastService.info('Seed kihagyva', 'A termékek már léteznek.');
      } else {
        this.successMessage = 'Kezdő termékek sikeresen feltöltve a Firestore-ba.';
        this.toastService.success('Kezdő termékek feltöltve');
      }
    } catch (error) {
      console.error(error);
      const code = getErrorCode(error);

      if (code === 'deadline-exceeded') {
        this.errorMessage = 'A feltöltés túl sok idő után sem válaszolt. Ellenőrizd az internetet, majd próbáld újra.';
      } else if (code) {
        this.errorMessage = `A kezdő termékek feltöltése nem sikerült (${code}).`;
      } else {
        this.errorMessage = normalizeErrorMessage(error, 'A kezdő termékek feltöltése nem sikerült.');
      }
      this.toastService.error('Seed sikertelen', this.errorMessage);
    } finally {
      this.seedingProducts = false;
    }
  }

  async seedProjectCatalogProducts(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.canManageProducts()) {
      this.errorMessage = 'Ehhez a művelethez belső jogosultság kell.';
      return;
    }

    this.seedingCatalogProducts = true;

    try {
      const inserted = await this.withTimeout(
        this.productService.seedMissingProductsBySku(this.getProjectCatalogProducts()),
        20000
      );

      if (inserted === 0) {
        this.successMessage = 'A katalógus már teljes, nem volt hiányzó termék.';
        this.toastService.info('Katalógus már kész');
      } else {
        this.successMessage = `${inserted} hiányzó termék került feltöltésre.`;
        this.toastService.success('Katalógus bővítve', `${inserted} új termék`);
      }
    } catch (error) {
      console.error(error);
      this.errorMessage = normalizeErrorMessage(error, 'A katalógus feltöltése nem sikerült.');
      this.toastService.error('Katalógus feltöltés sikertelen', this.errorMessage);
    } finally {
      this.seedingCatalogProducts = false;
    }
  }

  async normalizeProductTexts(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.auth.isCurrentUserAdmin()) {
      this.errorMessage = 'Ehhez a művelethez admin jogosultság kell.';
      return;
    }

    this.normalizingProductTexts = true;

    try {
      const updated = await this.withTimeout(
        this.productService.normalizeExistingProductsText(),
        20000
      );

      if (updated === 0) {
        this.successMessage = 'A termékek szövege már rendben volt, nem kellett javítani.';
        this.toastService.info('Ékezetjavítás kész', 'Nem volt módosítandó termék.');
      } else {
        this.successMessage = `${updated} termék szövegét javítottuk ékezetesre.`;
        this.toastService.success('Ékezetjavítás kész', `${updated} termék frissítve`);
      }
    } catch (error) {
      console.error(error);
      this.errorMessage = normalizeErrorMessage(error, 'A termékszövegek javítása nem sikerült.');
      this.toastService.error('Ékezetjavítás sikertelen', this.errorMessage);
    } finally {
      this.normalizingProductTexts = false;
    }
  }

  async onCsvFileSelected(event: Event): Promise<void> {
    // CSV betoltes es elozetes validalas (mentes nelkul).
    this.csvImportErrors = [];
    this.csvImportSummary = '';
    this.csvImportPreview = [];
    this.errorMessage = '';

    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) {
      return;
    }

    this.csvImportFileName = file.name;

    try {
      const csvText = await file.text();
      const rows = this.parseCsv(csvText);
      if (rows.length < 2) {
        this.csvImportErrors = ['A CSV fájl üres vagy csak fejlécet tartalmaz.'];
        return;
      }

      const headers = rows[0].map(item => this.normalizeCsvHeader(item));
      const mapped: Product[] = [];
      const errors: string[] = [];

      for (let index = 1; index < rows.length; index += 1) {
        const row = rows[index];
        if (row.every(cell => !cell.trim())) {
          continue;
        }

        const product = this.mapCsvRowToProduct(headers, row, index + 1, errors);
        if (product) {
          mapped.push(product);
        }
      }

      this.csvImportPreview = mapped;
      this.csvImportErrors = errors;
      this.csvImportSummary = `CSV előnézet: ${mapped.length} érvényes sor, ${errors.length} hibás sor.`;
    } catch (error) {
      console.error(error);
      this.csvImportErrors = ['A CSV fájl beolvasása sikertelen. Ellenőrizd a formátumot.'];
    }
  }

  async importCsvProducts(): Promise<void> {
    // Elozetesen validalt CSV sorok mentes Firestore-ba.
    if (!this.auth.isCurrentUserAdmin()) {
      this.errorMessage = 'Ehhez a művelethez admin jogosultság kell.';
      return;
    }

    if (this.csvImportPreview.length === 0) {
      this.errorMessage = 'Nincs importálható CSV sor.';
      return;
    }

    this.importingCsvProducts = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const result = await this.productService.importProductsBulk(this.csvImportPreview, this.csvImportMode);
      this.successMessage = `CSV import kész. Új: ${result.created}, Frissített: ${result.updated}, Kihagyott: ${result.skipped}.`;
      this.toastService.success(
        'CSV import kész',
        `Új: ${result.created}, Frissített: ${result.updated}, Kihagyott: ${result.skipped}`
      );
    } catch (error) {
      console.error(error);
      this.errorMessage = normalizeErrorMessage(error, 'A CSV import mentése nem sikerült.');
      this.toastService.error('CSV import sikertelen', this.errorMessage);
    } finally {
      this.importingCsvProducts = false;
    }
  }

  resetCsvImport(): void {
    this.csvImportFileName = '';
    this.csvImportSummary = '';
    this.csvImportErrors = [];
    this.csvImportPreview = [];
  }

  downloadCsvTemplate(): void {
    // Mintafajl letoltes: ebbe csak be kell masolni a termekeket.
    const template = [
      'name;price;category;image;stock;stockQuantity;brand;sku;shortDescription;description;isWeeklyDeal;isTopProduct;salePercent',
      'Termék minta 1;12990;Fűtés;products/radiator-szelep.jpg;Készleten;12;TDL;TDL-FUT-100;Rövid leírás;Hosszabb termékleírás;false;true;10',
      'Termék minta 2;5990;Víz;products/golyoscsap.jpg;Készleten;25;TDL;TDL-VIZ-100;Rövid leírás;Hosszabb termékleírás;true;false;0'
    ].join('\n');

    this.downloadTextFile(template, 'termek-import-minta.csv');
  }

  downloadSmartStockCsv(): void {
    const csv = this.getSmartStockCsvContent();
    this.downloadTextFile(csv, 'utanrendelesi-javaslat.csv');
  }

  getSmartStockCsvContent(): string {
    const header = [
      'Termek',
      'Cikkszam',
      'Kategoria',
      'Szabad keszlet',
      'Foglalt keszlet',
      '30 napos fogyas',
      'Napi atlag',
      'Becsult napok',
      'Javasolt utanrendeles',
      'Prioritas',
      'Megjegyzes'
    ];

    const rows = this.filteredSmartStockSuggestions
      .filter(item => item.reorderQuantity > 0 || item.priority !== 'stable')
      .map(item => [
        item.name,
        item.sku,
        item.category,
        item.availableStock,
        item.reservedStock,
        item.sold30Days,
        item.dailyDemand.toFixed(2),
        item.daysLeft === null ? '' : item.daysLeft,
        item.reorderQuantity,
        item.priority,
        item.label
      ]);

    return [header, ...rows]
      .map(row => row.map(value => this.escapeCsvValue(value)).join(';'))
      .join('\n');
  }

  private parseCsv(content: string): string[][] {
    // Egyszeru CSV parser pontosvesszo/vesszo delimiter tamogatassal.
    // Idézőjeles mezőket is kezel, így termékleírásban szereplő vessző nem töri szét a sort.
    const rows: string[][] = [];
    const normalized = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const lines = normalized.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) {
      return rows;
    }

    const delimiter = lines[0].includes(';') ? ';' : ',';
    for (const line of lines) {
      rows.push(this.parseCsvLine(line, delimiter));
    }

    return rows;
  }

  private parseCsvLine(line: string, delimiter: string): string[] {
    const cells: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let index = 0; index < line.length; index += 1) {
      const char = line[index];
      const next = line[index + 1];

      if (char === '"') {
        if (inQuotes && next === '"') {
          current += '"';
          index += 1;
        } else {
          inQuotes = !inQuotes;
        }
        continue;
      }

      if (!inQuotes && char === delimiter) {
        cells.push(current.trim());
        current = '';
        continue;
      }

      current += char;
    }

    cells.push(current.trim());
    return cells;
  }

  private normalizeCsvHeader(header: string): string {
    return header
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  private mapCsvRowToProduct(
    headers: string[],
    row: string[],
    lineNumber: number,
    errors: string[]
  ): Product | null {
    const getValue = (...keys: string[]) => {
      for (const key of keys) {
        const index = headers.indexOf(key);
        if (index >= 0) {
          return (row[index] || '').trim();
        }
      }
      return '';
    };

    const name = getValue('name', 'nev', 'termeknev');
    const priceRaw = getValue('price', 'ar');
    const category = getValue('category', 'kategoria');
    const image = getValue('image', 'kep', 'kepurl');
    const stockRaw = getValue('stock', 'keszletstatusz', 'statusz') || 'Keszleten';
    const stockQtyRaw = getValue('stockquantity', 'keszletdb', 'db');
    const brand = getValue('brand', 'marka');
    const sku = getValue('sku', 'cikkszam');
    const shortDescription = getValue('shortdescription', 'rovidleiras');
    const description = getValue('description', 'leiras');
    const isWeeklyDealRaw = getValue('isweeklydeal', 'hetiajanlat');
    const isTopProductRaw = getValue('istopproduct', 'toptermek');
    const salePercentRaw = getValue('salepercent', 'akciosszazalek');

    const price = Number(priceRaw);
    if (!name) {
      errors.push(`Sor ${lineNumber}: hiányzik a terméknév.`);
      return null;
    }

    if (!Number.isFinite(price) || price <= 0) {
      errors.push(`Sor ${lineNumber}: hibás ár (${priceRaw}).`);
      return null;
    }

    if (!category) {
      errors.push(`Sor ${lineNumber}: hiányzik a kategória.`);
      return null;
    }

    if (!image) {
      errors.push(`Sor ${lineNumber}: hiányzik a kép mező.`);
      return null;
    }

    if (!sku) {
      errors.push(`Sor ${lineNumber}: hiányzik a SKU/cikkszám (upserthez kötelező).`);
      return null;
    }

    const stockQuantity = Math.max(0, Number(stockQtyRaw || 0) || 0);
    const salePercent = Math.max(0, Math.min(95, Number(salePercentRaw || 0) || 0));

    return {
      name,
      price,
      category,
      image,
      stock: stockRaw || this.resolveStockByQuantity(stockQuantity),
      stockQuantity,
      brand,
      sku,
      shortDescription,
      description,
      isWeeklyDeal: this.parseBoolean(isWeeklyDealRaw),
      isTopProduct: this.parseBoolean(isTopProductRaw),
      salePercent,
      images: [image]
    };
  }

  private parseBoolean(value: string): boolean {
    const normalized = (value || '').trim().toLowerCase();
    return ['1', 'true', 'igen', 'yes'].includes(normalized);
  }

  private resolveStockByQuantity(quantity: number): string {
    if (quantity <= 0) {
      return 'Nincs keszleten';
    }

    if (quantity <= environment.lowStockThreshold) {
      return 'Szallithato';
    }

    return 'Keszleten';
  }

  formatDate(timestamp?: number): string {
    if (!timestamp) {
      return 'Nincs datum';
    }

    return new Date(timestamp).toLocaleString('hu-HU');
  }

  getOrderItemCount(order: Order): number {
    return order.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  getChannelPercent(count: number): number {
    const total = this.businessReport.webOrderCount + this.businessReport.localOrderCount;
    if (total === 0) {
      return 0;
    }

    return Math.round((count / total) * 100);
  }

  setOrderListView(view: 'active' | 'completed' | 'local'): void {
    this.orderListView = view;
  }

  get activeOrderCount(): number {
    return this.orders.filter(order =>
      order.salesChannel !== 'local-admin' && order.status !== 'teljesitve'
    ).length;
  }

  get completedOrderCount(): number {
    return this.orders.filter(order =>
      order.salesChannel !== 'local-admin' && order.status === 'teljesitve'
    ).length;
  }

  get localOrderCount(): number {
    return this.orders.filter(order => order.salesChannel === 'local-admin').length;
  }

  get filteredOrdersForView(): Order[] {
    if (this.orderListView === 'completed') {
      return this.orders.filter(order =>
        order.salesChannel !== 'local-admin' && order.status === 'teljesitve'
      );
    }

    if (this.orderListView === 'local') {
      return this.orders.filter(order => order.salesChannel === 'local-admin');
    }

    return this.orders.filter(order =>
      order.salesChannel !== 'local-admin' && order.status !== 'teljesitve'
    );
  }

  requestOrderStatusChange(order: Order): void {
    if (!order.id) {
      return;
    }

    // Oldalon beluli megerosito popuphoz eltesszuk a kijelolt rendelest.
    this.pendingOrderStatusChoice = order.status || 'uj';
    this.pendingOrderStatusChange = { order };
    this.orderStatusConfirmOpen = true;
  }

  openOrderDetails(order: Order): void {
    this.selectedOrderDetails = order;
    this.orderDetailsOpen = true;
  }

  closeOrderDetails(): void {
    this.orderDetailsOpen = false;
    this.selectedOrderDetails = null;
  }

  cancelOrderStatusChange(): void {
    this.orderStatusConfirmOpen = false;
    this.pendingOrderStatusChange = null;
  }

  async confirmOrderStatusChange(): Promise<void> {
    // Státusz váltás + szükség eseten készlet korrekcio.
    if (!this.pendingOrderStatusChange) {
      this.cancelOrderStatusChange();
      return;
    }

    const { order } = this.pendingOrderStatusChange;
    const nextStatus = this.pendingOrderStatusChoice;
    if (order.status === nextStatus) {
      this.cancelOrderStatusChange();
      return;
    }
    const orderId = order.id;
    if (!orderId) {
      this.cancelOrderStatusChange();
      return;
    }

    this.orderStatusLoadingId = orderId;
    this.ordersError = '';
    this.orderStatusConfirmOpen = false;

    try {
      const actor = this.auth.getUser();
      await this.orderService.updateOrderStatusWithAudit({
        orderId,
        fromStatus: order.status,
        toStatus: nextStatus,
        actorUid: actor?.uid,
        actorEmail: actor?.email || '',
        note: 'Admin panel státuszváltás'
      });
      this.toastService.success('Rendelés státusz frissítve', `${order.customerName} -> ${this.getOrderStatusLabel(nextStatus)}`);
    } catch (error) {
      console.error(error);
      this.monitoringService.capture('admin-order-status-change', error, {
        orderId,
        fromStatus: order.status,
        toStatus: nextStatus
      });
      this.ordersError = normalizeErrorMessage(
        error,
        'A rendelés státusz vagy a készlet frissítése nem sikerült.'
      );
      this.toastService.error('Státusz mentése sikertelen', this.ordersError);
    } finally {
      this.orderStatusLoadingId = null;
      this.pendingOrderStatusChange = null;
    }
  }

  getBarWidth(value: number): string {
    return `${Math.max(6, Math.min(100, value))}%`;
  }

  closeLowStockModal(): void {
    this.lowStockModalOpen = false;
    this.hasShownLowStockWarning = true;
  }

  getLowStockThreshold(): number {
    return environment.lowStockThreshold;
  }

  hasStockData(): boolean {
    return this.filteredStockChart.length > 0;
  }

  get stockItemCount(): number {
    return this.filteredStockChart.length;
  }

  get stockTotalUnits(): number {
    return this.filteredStockChart.reduce((sum, item) => sum + item.totalStock, 0);
  }

  get stockAvailableUnits(): number {
    return this.filteredStockChart.reduce((sum, item) => sum + item.availableStock, 0);
  }

  get inventoryCategories(): string[] {
    return [...new Set(this.stockChart.map(item => item.category).filter(Boolean))]
      .sort((left, right) => left.localeCompare(right, 'hu-HU'));
  }

  get filteredStockChart(): StockChartItem[] {
    // A készlet nézet kategóriaszűrője csak a megjelenített listát szűri,
    // a teljes dashboard aggregáció ettől még változatlanul rendelkezésre áll.
    if (!this.selectedInventoryCategory) {
      return this.stockChart;
    }

    return this.stockChart.filter(item => item.category === this.selectedInventoryCategory);
  }

  get filteredLowStockCount(): number {
    return this.filteredStockChart.filter(item => item.availableStock <= environment.lowStockThreshold).length;
  }

  get filteredSmartStockSuggestions(): SmartStockSuggestion[] {
    if (!this.selectedInventoryCategory) {
      return this.smartStockSuggestions;
    }

    return this.smartStockSuggestions.filter(item => item.category === this.selectedInventoryCategory);
  }

  get urgentReorderCount(): number {
    return this.filteredSmartStockSuggestions.filter(item => item.reorderQuantity > 0).length;
  }

  addLocalSaleLine(): void {
    // Tetel felvetele a helyszini "mini kosarba".
    this.localSaleError = '';
    this.localSaleSuccess = '';

    if (!this.localSaleSelectedProductId) {
      this.selectLocalSaleProductFromSearch();
    }

    if (!this.localSaleSelectedProductId) {
      this.localSaleError = 'Válassz terméket a helyszíni vásárláshoz.';
      return;
    }

    const product = this.products.find(item => item.id === this.localSaleSelectedProductId);
    if (!product?.id) {
      this.localSaleError = 'A kiválasztott termék nem található.';
      return;
    }

    const quantity = Math.max(1, Math.floor(Number(this.localSaleQuantity) || 1));
    const available = this.getAvailableStockForProduct(product.id);
    const existing = this.localSaleLines.find(line => line.productId === product.id);
    const existingQty = existing?.quantity || 0;

    if (existingQty + quantity > available) {
      this.localSaleError = `Nincs elég szabad készlet. Elerto mennyiseg: ${Math.max(0, available - existingQty)} db.`;
      return;
    }

    if (existing) {
      existing.quantity += quantity;
    } else {
      this.localSaleLines.push({
        productId: product.id,
        name: product.name,
        sku: product.sku || '-',
        price: Number(product.price) || 0,
        quantity,
        image: product.image
      });
    }

    this.localSaleQuantity = 1;
    this.localSaleSelectedProductId = '';
    this.localSaleProductSearch = '';
    this.localSaleProductSearchOpen = false;
  }

  openLocalSaleProductSearch(): void {
    this.localSaleProductSearchOpen = true;
  }

  closeLocalSaleProductSearch(): void {
    setTimeout(() => {
      this.localSaleProductSearchOpen = false;
      this.cdr.detectChanges();
    }, 120);
  }

  onLocalSaleProductSearchChange(): void {
    this.localSaleSelectedProductId = '';
    this.localSaleProductSearchOpen = true;
  }

  chooseLocalSaleProduct(product: Product): void {
    if (!product.id) {
      return;
    }

    this.localSaleSelectedProductId = product.id;
    this.localSaleProductSearch = this.getLocalSaleProductLabel(product);
    this.localSaleProductSearchOpen = false;
    this.localSaleError = '';
  }

  get filteredLocalSaleProducts(): Product[] {
    const term = this.localSaleProductSearch.trim().toLowerCase();
    const source = term
      ? this.products.filter(product => {
          const haystack = [
            product.name,
            product.sku,
            product.category,
            product.brand
          ].join(' ').toLowerCase();

          return haystack.includes(term);
        })
      : this.products;

    return source.slice(0, 12);
  }

  get selectedLocalSaleProductLabel(): string {
    const product = this.products.find(item => item.id === this.localSaleSelectedProductId);
    return product ? this.getLocalSaleProductLabel(product) : '';
  }

  private selectLocalSaleProductFromSearch(): void {
    const term = this.localSaleProductSearch.trim().toLowerCase();
    if (!term) {
      return;
    }

    const exactMatch = this.products.find(product =>
      (product.name || '').toLowerCase() === term ||
      (product.sku || '').toLowerCase() === term ||
      this.getLocalSaleProductLabel(product).toLowerCase() === term
    );

    if (exactMatch?.id) {
      this.chooseLocalSaleProduct(exactMatch);
      return;
    }

    if (this.filteredLocalSaleProducts.length === 1) {
      this.chooseLocalSaleProduct(this.filteredLocalSaleProducts[0]);
    }
  }

  private getLocalSaleProductLabel(product: Product): string {
    const sku = product.sku ? ` (${product.sku})` : '';
    return `${product.name}${sku} - ${product.price} Ft`;
  }

  removeLocalSaleLine(productId: string): void {
    this.localSaleLines = this.localSaleLines.filter(line => line.productId !== productId);
  }

  openLocalSaleProfilePicker(): void {
    this.localSaleProfilePickerOpen = true;
    this.localSaleProfileSearch = '';
  }

  closeLocalSaleProfilePicker(): void {
    this.localSaleProfilePickerOpen = false;
  }

  chooseLocalSaleProfile(profile: CustomerProfile): void {
    if (!profile.id) {
      return;
    }

    this.selectedLocalSaleProfileId = profile.id;
    this.applyLocalSaleProfile(profile);
    if (profile.disabled) {
      this.localSaleError = 'A kiválasztott vásárló le van tiltva, helyszíni vásárlás nem rögzíthető.';
    }
    this.closeLocalSaleProfilePicker();
  }

  clearSelectedLocalSaleProfile(): void {
    this.selectedLocalSaleProfileId = '';
    this.localSaleSaveCustomerForLater = false;
  }

  applySelectedLocalSaleProfile(): void {
    // Mentett profilbol auto kitoltes.
    if (!this.selectedLocalSaleProfileId) {
      return;
    }

    const profile = this.localSaleProfiles.find(item => item.id === this.selectedLocalSaleProfileId);
    if (!profile) {
      return;
    }

    this.applyLocalSaleProfile(profile);
  }

  get selectedLocalSaleProfile(): CustomerProfile | undefined {
    if (!this.selectedLocalSaleProfileId) {
      return undefined;
    }

    return this.localSaleProfiles.find(profile => profile.id === this.selectedLocalSaleProfileId);
  }

  get filteredLocalSaleProfiles(): CustomerProfile[] {
    const term = this.localSaleProfileSearch.trim().toLowerCase();
    if (!term) {
      return this.localSaleProfiles.slice(0, 40);
    }

    return this.localSaleProfiles.filter(profile => {
      const haystack = [
        profile.name,
        profile.email,
        profile.phone,
        profile.companyName,
        profile.taxNumber,
        profile.type === 'company' ? 'cég' : 'vásárló',
        profile.isGuest ? 'webes vendég' : ''
      ].join(' ').toLowerCase();

      return haystack.includes(term);
    }).slice(0, 40);
  }

  private applyLocalSaleProfile(profile: CustomerProfile): void {
    this.localSaleCustomerName = profile.name || 'Helyszíni vásárló';
    this.localSaleCustomerEmail = profile.email || 'helyszini@tdlwebshop.hu';
    this.localSaleCustomerPhone = profile.phone || '-';
    this.localSaleIsBusinessBuyer = profile.type === 'company';
    this.localSaleCompanyName = profile.companyName || '';
    this.localSaleTaxNumber = profile.taxNumber || '';
    this.localSalePaymentDeadlineDays = this.normalizePaymentTermDays(profile.paymentTermDays);
    this.localSaleSaveCustomerForLater = false;
    this.localSaleSuccess = profile.disabled
      ? ''
      : `Betöltött profil: ${this.localSaleCustomerName}`;
  }

  openCustomerProfileEditor(profile: CustomerProfile): void {
    if (!profile.id) {
      return;
    }

    this.customerProfileEditorId = profile.id;
    this.customerProfileEditorType = profile.type || 'private';
    this.customerProfileEditorName = profile.name || '';
    this.customerProfileEditorEmail = profile.email || '';
    this.customerProfileEditorPhone = profile.phone || '';
    this.customerProfileEditorCompanyName = profile.companyName || '';
    this.customerProfileEditorTaxNumber = profile.taxNumber || '';
    this.customerProfileEditorDisabled = !!profile.disabled;
    this.customerProfileEditorPaymentTermDays = this.normalizePaymentTermDays(profile.paymentTermDays);
    this.customerProfileEditorNote = profile.note || '';
    this.customerProfileEditorOpen = true;
  }

  closeCustomerProfileEditor(): void {
    this.customerProfileEditorOpen = false;
    this.customerProfileEditorId = '';
    this.customerProfileEditorSaving = false;
  }

  async saveCustomerProfileEditor(): Promise<void> {
    this.localSaleError = '';
    this.localSaleSuccess = '';

    if (!this.customerProfileEditorId) {
      return;
    }

    const email = this.customerProfileEditorEmail.trim().toLowerCase();
    const phone = this.customerProfileEditorPhone.trim();

    if (!this.customerProfileEditorName.trim()) {
      this.localSaleError = 'A vásárló neve kötelező.';
      return;
    }

    if (!isValidEmail(email)) {
      this.localSaleError = 'Adj meg érvényes email címet.';
      return;
    }

    if (!isValidPhone(phone)) {
      this.localSaleError = 'Adj meg érvényes telefonszámot (8-15 számjegy).';
      return;
    }

    if (this.customerProfileEditorType === 'company' && !this.customerProfileEditorTaxNumber.trim()) {
      this.localSaleError = 'Céges vásárlónál az adószám kötelező.';
      return;
    }

    this.customerProfileEditorSaving = true;

    try {
      await this.customerDirectoryService.updateProfile(this.customerProfileEditorId, {
        type: this.customerProfileEditorType,
        name: this.customerProfileEditorName.trim(),
        email,
        phone,
        companyName: this.customerProfileEditorType === 'company' ? this.customerProfileEditorCompanyName.trim() : '',
        taxNumber: this.customerProfileEditorType === 'company' ? this.customerProfileEditorTaxNumber.trim() : '',
        disabled: this.customerProfileEditorDisabled,
        paymentTermDays: this.normalizePaymentTermDays(this.customerProfileEditorPaymentTermDays),
        paymentTermApproved: this.normalizePaymentTermDays(this.customerProfileEditorPaymentTermDays) <= 10,
        note: this.customerProfileEditorNote.trim()
      });
      await this.syncRegisteredUserDisabledByEmail(email, this.customerProfileEditorDisabled);

      if (this.selectedLocalSaleProfileId === this.customerProfileEditorId) {
        const profile = this.localSaleProfiles.find(item => item.id === this.customerProfileEditorId);
        if (profile) {
          this.applyLocalSaleProfile({
            ...profile,
            type: this.customerProfileEditorType,
            name: this.customerProfileEditorName.trim(),
            email,
            phone,
            companyName: this.customerProfileEditorCompanyName.trim(),
            taxNumber: this.customerProfileEditorTaxNumber.trim(),
            disabled: this.customerProfileEditorDisabled,
            paymentTermDays: this.normalizePaymentTermDays(this.customerProfileEditorPaymentTermDays),
            paymentTermApproved: this.normalizePaymentTermDays(this.customerProfileEditorPaymentTermDays) <= 10,
            note: this.customerProfileEditorNote.trim()
          });
        }
      }

      this.localSaleSuccess = 'Mentett vásárló/cég adatai frissítve.';
      this.toastService.success('Mentett vásárló frissítve');
      this.closeCustomerProfileEditor();
    } catch (error) {
      console.error(error);
      this.localSaleError = normalizeErrorMessage(error, 'A mentett vásárló/cég frissítése nem sikerült.');
      this.toastService.error('Profil frissítése sikertelen', this.localSaleError);
    } finally {
      this.customerProfileEditorSaving = false;
    }
  }

  async approvePaymentTerm(profile: CustomerProfile): Promise<void> {
    if (!profile.id || !this.canApprovePaymentTerms()) {
      return;
    }

    try {
      await this.customerDirectoryService.updateProfile(profile.id, { paymentTermApproved: true });
      this.toastService.success('Fizetési határidő jóváhagyva', profile.name);
    } catch (error) {
      console.error(error);
      this.localSaleError = normalizeErrorMessage(error, 'A fizetési határidő jóváhagyása nem sikerült.');
      this.toastService.error('Jóváhagyás sikertelen', this.localSaleError);
    }
  }

  async resetPaymentTerm(profile: CustomerProfile): Promise<void> {
    if (!profile.id || !this.canApprovePaymentTerms()) {
      return;
    }

    try {
      await this.customerDirectoryService.updateProfile(profile.id, {
        paymentTermDays: 10,
        paymentTermApproved: true
      });
      this.toastService.success('Fizetési határidő visszaállítva', profile.name);
    } catch (error) {
      console.error(error);
      this.localSaleError = normalizeErrorMessage(error, 'A fizetési határidő visszaállítása nem sikerült.');
      this.toastService.error('Módosítás sikertelen', this.localSaleError);
    }
  }

  async toggleCustomerProfileDisabled(profile: CustomerProfile): Promise<void> {
    if (!profile.id) {
      return;
    }

    if (!this.canDisableCustomers()) {
      this.localSaleError = 'Vásárló tiltásához külön dolgozói jogosultság kell.';
      return;
    }

    const disabled = !profile.disabled;
    this.customerProfileEditorSaving = true;

    try {
      await this.customerDirectoryService.updateProfile(profile.id, { disabled });
      await this.syncRegisteredUserDisabledByEmail(profile.email, disabled);
      if (this.selectedLocalSaleProfileId === profile.id && disabled) {
        this.localSaleError = 'A kiválasztott vásárló le van tiltva, helyszíni vásárlás nem rögzíthető.';
      }
      this.toastService.success(disabled ? 'Vásárló letiltva' : 'Vásárló visszaállítva', profile.name);
    } catch (error) {
      console.error(error);
      this.localSaleError = normalizeErrorMessage(error, 'A vásárló státuszának módosítása nem sikerült.');
      this.toastService.error('Státusz mentése sikertelen', this.localSaleError);
    } finally {
      this.customerProfileEditorSaving = false;
    }
  }

  async deleteCustomerProfile(profile: CustomerProfile): Promise<void> {
    if (!profile.id) {
      return;
    }

    const accepted = confirm(`Biztosan törlöd a mentett vásárlót/céget: ${profile.name}?`);
    if (!accepted) {
      return;
    }

    this.customerProfileDeletingId = profile.id;

    try {
      await this.customerDirectoryService.deleteProfile(profile.id);
      if (this.selectedLocalSaleProfileId === profile.id) {
        this.clearSelectedLocalSaleProfile();
      }
      this.toastService.success('Mentett vásárló törölve', profile.name);
    } catch (error) {
      console.error(error);
      this.localSaleError = normalizeErrorMessage(error, 'A mentett vásárló/cég törlése nem sikerült.');
      this.toastService.error('Profil törlése sikertelen', this.localSaleError);
    } finally {
      this.customerProfileDeletingId = null;
    }
  }

  async saveLocalSaleProfile(): Promise<void> {
    // Helyszini vásárló/cég adat mentes vagy frissites torzsbe.
    this.localSaleError = '';
    this.localSaleSuccess = '';

    if (!this.canManageCustomers()) {
      this.localSaleError = 'Ehhez a művelethez belső jogosultság kell.';
      return;
    }

    if (!this.localSaleCustomerName.trim()) {
      this.localSaleError = 'A mentéshez add meg a vásárló nevét.';
      return;
    }

    if (!isValidEmail(this.getLocalSaleEmail())) {
      this.localSaleError = 'Adj meg érvényes email címet a vásárló mentéséhez.';
      return;
    }

    if (!isValidPhone(this.getLocalSalePhone())) {
      this.localSaleError = 'Adj meg érvényes telefonszámot (8-15 számjegy, pl. +36 30 123 4567).';
      return;
    }

    if (this.localSaleIsBusinessBuyer && !this.localSaleTaxNumber.trim()) {
      this.localSaleError = 'Céges mentéshez az adószám kötelező.';
      return;
    }

    try {
      this.localSaleProfileActionLoading = true;
      const hadSelectedProfile = !!this.selectedLocalSaleProfileId;
      await this.saveLocalSaleCustomerProfileFromCurrentForm();
      this.localSaleSuccess = hadSelectedProfile
        ? 'Vásárló/cég adatai sikeresen frissítve.'
        : 'Vásárló/cég sikeresen elmentve a törzslistába.';
      this.toastService.success('Vásárló profil mentve');
    } catch (error) {
      console.error(error);
      this.localSaleError = normalizeErrorMessage(error, 'A vásárló/cég mentése nem sikerült.');
      this.toastService.error('Profil mentése sikertelen', this.localSaleError);
    } finally {
      this.localSaleProfileActionLoading = false;
    }
  }

  private async saveLocalSaleCustomerProfileFromCurrentForm(): Promise<void> {
    const profilePayload = {
      type: this.localSaleIsBusinessBuyer ? 'company' as const : 'private' as const,
      name: this.localSaleCustomerName.trim(),
      email: this.getLocalSaleEmail(),
      phone: this.getLocalSalePhone(),
      companyName: this.localSaleIsBusinessBuyer ? this.localSaleCompanyName.trim() : '',
      taxNumber: this.localSaleIsBusinessBuyer ? this.localSaleTaxNumber.trim() : '',
      disabled: this.selectedLocalSaleProfile?.disabled || false,
      paymentTermDays: this.getLocalSalePaymentDeadlineDays(),
      paymentTermApproved: this.getLocalSalePaymentDeadlineDays() <= 10,
      note: this.selectedLocalSaleProfile?.note || ''
    };

    if (this.selectedLocalSaleProfileId) {
      await this.customerDirectoryService.updateProfile(this.selectedLocalSaleProfileId, profilePayload);
      return;
    }

    const newId = await this.customerDirectoryService.createProfile(profilePayload);
    this.selectedLocalSaleProfileId = newId;
  }

  private getLocalSaleEmail(): string {
    return this.localSaleCustomerEmail.trim().toLowerCase() || 'helyszini@tdlwebshop.hu';
  }

  private getLocalSalePhone(): string {
    return this.localSaleCustomerPhone.trim() || '+36 1 234 5678';
  }

  private getBlockedLocalSaleProfile(): CustomerProfile | undefined {
    const selectedProfile = this.selectedLocalSaleProfile;
    if (selectedProfile?.disabled) {
      return selectedProfile;
    }

    const email = this.getLocalSaleEmail();
    return this.localSaleProfiles.find(profile => profile.disabled && profile.email?.toLowerCase() === email);
  }

  private normalizePaymentTermDays(value: number | undefined | null): number {
    const parsed = Math.floor(Number(value) || 10);
    return Math.max(1, Math.min(60, parsed));
  }

  getLocalSalePaymentDeadlineDays(): number {
    return this.normalizePaymentTermDays(this.localSalePaymentDeadlineDays);
  }

  get localSalePaymentDeadlineWarning(): string {
    if (this.localSalePaymentMethod !== 'transfer' || this.getLocalSalePaymentDeadlineDays() <= 10) {
      return '';
    }

    return '10 napnál hosszabb fizetési határidőhöz kérjük keresd fel az admint jóváhagyásért.';
  }

  getLocalSalePaymentLabel(): string {
    if (this.localSalePaymentMethod === 'card') {
      return 'Bankkártyás fizetés';
    }

    if (this.localSalePaymentMethod === 'transfer') {
      return `Átutalás (${this.getLocalSalePaymentDeadlineDays()} napos fizetési határidő)`;
    }

    return 'Készpénzes fizetés';
  }

  private getLocalSalePaymentDueAt(): number | undefined {
    if (this.localSalePaymentMethod !== 'transfer') {
      return undefined;
    }

    return Date.now() + this.getLocalSalePaymentDeadlineDays() * 24 * 60 * 60 * 1000;
  }

  private async syncRegisteredUserDisabledByEmail(email: string | undefined, disabled: boolean): Promise<void> {
    const normalizedEmail = (email || '').trim().toLowerCase();
    if (!normalizedEmail) {
      return;
    }

    const user = this.users.find(item => item.email?.toLowerCase() === normalizedEmail);
    if (!user?.id) {
      return;
    }

    await this.userService.updateUserProfile(user.id, { disabled });
  }

  get localSaleSubtotal(): number {
    return this.localSaleLines.reduce((sum, line) => sum + line.price * line.quantity, 0);
  }

  get localSaleDiscountPercent(): number {
    if (this.localSaleIsBusinessBuyer) {
      return 10;
    }

    const email = this.getLocalSaleEmail();
    return this.getLoyaltyDiscountPercentByEmail(email);
  }

  get localSaleDiscountAmount(): number {
    return Math.round((this.localSaleSubtotal * this.localSaleDiscountPercent) / 100);
  }

  get localSaleTotal(): number {
    return Math.max(0, this.localSaleSubtotal - this.localSaleDiscountAmount);
  }

  getLocalSaleDiscountLabel(): string {
    if (this.localSaleDiscountPercent <= 0) {
      return '';
    }

    return this.localSaleIsBusinessBuyer
      ? `Nagyker kedvezmény (${this.localSaleDiscountPercent}%)`
      : `Törzsvásárlói kedvezmény (${this.localSaleDiscountPercent}%)`;
  }

  getCustomerProfileOrders(profile: CustomerProfile | null | undefined): Order[] {
    const email = (profile?.email || '').trim().toLowerCase();
    if (!email) {
      return [];
    }

    return this.orders
      .filter(order => (order.customerEmail || '').trim().toLowerCase() === email)
      .sort((left, right) => (right.createdAt || 0) - (left.createdAt || 0));
  }

  getCustomerProfileTotalSpent(profile: CustomerProfile | null | undefined): number {
    return this.getCustomerProfileOrders(profile)
      .filter(order => order.status === 'teljesitve' || order.salesChannel === 'local-admin')
      .reduce((sum, order) => sum + Math.max(0, Number(order.total) || 0), 0);
  }

  getCustomerProfileDiscountPercent(profile: CustomerProfile | null | undefined): number {
    if (profile?.type === 'company') {
      return 10;
    }

    return this.getLoyaltyDiscountPercentByEmail(profile?.email || '');
  }

  getCustomerProfileDiscountLabel(profile: CustomerProfile | null | undefined): string {
    const percent = this.getCustomerProfileDiscountPercent(profile);
    if (percent <= 0) {
      return 'Nincs kedvezmény';
    }

    return profile?.type === 'company'
      ? `Nagyker ${percent}%`
      : `Törzsvásárló ${percent}%`;
  }

  openCustomerHistory(profile: CustomerProfile): void {
    this.selectedCustomerHistoryProfile = profile;
    this.customerHistoryOpen = true;
  }

  closeCustomerHistory(): void {
    this.customerHistoryOpen = false;
    this.selectedCustomerHistoryProfile = null;
  }

  private getLoyaltyDiscountPercentByEmail(email: string): number {
    const normalizedEmail = (email || '').trim().toLowerCase();
    if (!normalizedEmail) {
      return 0;
    }

    const totalSpent = this.orders
      .filter(order =>
        (order.customerEmail || '').trim().toLowerCase() === normalizedEmail
        && (order.status === 'teljesitve' || order.salesChannel === 'local-admin')
      )
      .reduce((sum, order) => sum + Math.max(0, Number(order.total) || 0), 0);

    if (totalSpent >= 250000) {
      return 5;
    }

    if (totalSpent >= 100000) {
      return 3;
    }

    return 0;
  }

  async submitLocalSale(): Promise<void> {
    // Helyszini eladas teljes folyamata:
    // rendeles mentes + készlet frissites + számla letoltes.
    this.localSaleError = '';
    this.localSaleSuccess = '';

    if (!this.canRecordSales()) {
      this.localSaleError = 'Ehhez a művelethez belső jogosultság kell.';
      return;
    }

    if (this.localSaleLines.length === 0) {
      this.localSaleError = 'Adj hozzá legalább egy tételt a helyszíni vásárláshoz.';
      return;
    }

    const blockedProfile = this.getBlockedLocalSaleProfile();
    if (blockedProfile) {
      this.localSaleError = `A vásárló le van tiltva: ${blockedProfile.name}. Helyszíni vásárlás nem rögzíthető.`;
      return;
    }

    if (!isValidEmail(this.getLocalSaleEmail())) {
      this.localSaleError = 'A helyszíni vásárláshoz adj meg érvényes email címet.';
      return;
    }

    if (!isValidPhone(this.getLocalSalePhone())) {
      this.localSaleError = 'A helyszíni vásárláshoz adj meg érvényes telefonszámot (8-15 számjegy).';
      return;
    }

    if (this.localSaleIsBusinessBuyer && !this.localSaleTaxNumber.trim()) {
      this.localSaleError = 'Céges vagy szerelői vásárlásnál adószám megadása kötelező.';
      return;
    }

    for (const line of this.localSaleLines) {
      const available = this.getAvailableStockForProduct(line.productId);
      if (line.quantity > available) {
        this.localSaleError = `Nincs elég szabad készlet: ${line.name} (elérhető: ${available} db).`;
        return;
      }
    }

    this.localSaleLoading = true;

    try {
      const items: CartItem[] = this.localSaleLines.map((line, index) => ({
        id: Date.now() + index,
        firestoreId: line.productId,
        sku: line.sku,
        name: line.name,
        price: line.price,
        image: line.image,
        quantity: line.quantity
      }));

      const subtotal = this.localSaleSubtotal;
      const discount = this.localSaleDiscountAmount;
      const total = this.localSaleTotal;
      const paymentLabel = this.getLocalSalePaymentLabel();
      const paymentDueAt = this.getLocalSalePaymentDueAt();

      if (this.localSaleSaveCustomerForLater) {
        await this.saveLocalSaleCustomerProfileFromCurrentForm();
      }

      const orderRef = await this.orderService.createLocalSaleOrder({
        customerName: this.localSaleCustomerName.trim() || 'Helyszíni vásárló',
        customerEmail: this.getLocalSaleEmail(),
        customerPhone: this.getLocalSalePhone(),
        shipping: {
          zip: '-',
          city: 'Helyszíni vásárlás',
          address: 'Ügyfélszolgálati pult'
        },
        shippingMethod: {
          id: 'local-purchase',
          label: 'Helyszíni vásárlás',
          fee: 0,
          eta: 'Azonnali átvétel'
        },
        billing: {
          sameAsShipping: true,
          name: this.localSaleCustomerName.trim() || 'Helyszíni vásárló',
          zip: '-',
          city: 'Helyszíni vásárlás',
          address: 'Ügyfélszolgálati pult'
        },
        paymentMethod: {
          id: this.localSalePaymentMethod,
          label: paymentLabel,
          fee: 0,
          dueDays: this.localSalePaymentMethod === 'transfer' ? this.getLocalSalePaymentDeadlineDays() : undefined,
          dueAt: paymentDueAt
        },
        business: {
          isBusinessBuyer: this.localSaleIsBusinessBuyer,
          companyName: this.localSaleIsBusinessBuyer
            ? (this.localSaleCompanyName.trim() || this.localSaleCustomerName.trim())
            : undefined,
          taxNumber: this.localSaleIsBusinessBuyer ? this.localSaleTaxNumber.trim() : undefined
        },
        salesChannel: 'local-admin',
        pricing: {
          subtotal,
          shippingFee: 0,
          paymentFee: 0,
          discount,
          total
        },
        couponCode: '',
        comment: this.localSaleComment.trim() || this.getLocalSaleDiscountLabel() || 'Helyszíni admin rögzített vásárlás',
        items,
        total,
        status: 'teljesitve'
      });

      const invoiceData = await this.orderService.ensureInvoiceForOrder(orderRef.id);
      this.invoiceService.downloadInvoicePdf({
        id: orderRef.id,
        customerName: this.localSaleCustomerName.trim() || 'Helyszíni vásárló',
        customerEmail: this.getLocalSaleEmail(),
        customerPhone: this.getLocalSalePhone(),
        shipping: {
          zip: '-',
          city: 'Helyszíni vásárlás',
          address: 'Ügyfélszolgálati pult'
        },
        shippingMethod: {
          id: 'local-purchase',
          label: 'Helyszíni vásárlás',
          fee: 0,
          eta: 'Azonnali átvétel'
        },
        billing: {
          sameAsShipping: true,
          name: this.localSaleCustomerName.trim() || 'Helyszíni vásárló',
          zip: '-',
          city: 'Helyszíni vásárlás',
          address: 'Ügyfélszolgálati pult'
        },
        paymentMethod: {
          id: this.localSalePaymentMethod,
          label: paymentLabel,
          fee: 0,
          dueDays: this.localSalePaymentMethod === 'transfer' ? this.getLocalSalePaymentDeadlineDays() : undefined,
          dueAt: paymentDueAt
        },
        business: {
          isBusinessBuyer: this.localSaleIsBusinessBuyer,
          companyName: this.localSaleIsBusinessBuyer
            ? (this.localSaleCompanyName.trim() || this.localSaleCustomerName.trim())
            : undefined,
          taxNumber: this.localSaleIsBusinessBuyer ? this.localSaleTaxNumber.trim() : undefined
        },
        salesChannel: 'local-admin',
        couponCode: '',
        pricing: {
          subtotal,
          shippingFee: 0,
          paymentFee: 0,
          discount,
          total
        },
        comment: this.localSaleComment.trim() || this.getLocalSaleDiscountLabel() || 'Helyszíni admin rögzített vásárlás',
        items,
        total,
        status: 'teljesitve',
        invoiceNumber: invoiceData.invoiceNumber,
        invoicedAt: invoiceData.invoicedAt
      });
      if (this.selectedLocalSaleProfileId) {
        await this.customerDirectoryService.touchProfile(this.selectedLocalSaleProfileId);
      }

      this.localSaleSuccess = this.localSaleSaveCustomerForLater
        ? `Helyszíni vásárlás sikeresen rögzítve, a vásárló mentve későbbre is (azonosító: ${orderRef.id}).`
        : `Helyszíni vásárlás sikeresen rögzítve (azonosító: ${orderRef.id}).`;
      this.toastService.success('Helyszíni vásárlás mentve', orderRef.id);
      this.localSaleLines = [];
      this.localSaleComment = '';
      this.localSaleSelectedProductId = '';
      this.localSaleProductSearch = '';
      this.localSaleProductSearchOpen = false;
      this.localSaleQuantity = 1;
      this.localSaleSaveCustomerForLater = false;
    } catch (error) {
      console.error(error);
      const message = (error as { message?: string })?.message || '';
      if (message.startsWith('insufficient-stock:')) {
        this.localSaleError = `Nincs elég készlet: ${message.replace('insufficient-stock:', '')}`;
      } else if (message.startsWith('product-not-found:')) {
        this.localSaleError = `A termék már nem található: ${message.replace('product-not-found:', '')}`;
      } else {
        const code = getErrorCode(error);
        const fallback = 'A helyszíni vásárlás mentése nem sikerült.';
        const normalized = normalizeErrorMessage(error, fallback);
        this.localSaleError = code ? `${normalized} (${code})` : normalized;
      }
      this.monitoringService.capture('admin-local-sale-save', error, {
        customerEmail: this.getLocalSaleEmail(),
        itemCount: this.localSaleLines.length,
        total: this.localSaleTotal,
        paymentMethod: this.localSalePaymentMethod
      });
      this.toastService.error('Helyszíni vásárlás sikertelen', this.localSaleError);
    } finally {
      this.localSaleLoading = false;
    }
  }

  async downloadOrderInvoice(order: Order): Promise<void> {
    // Rendelestol fuggoen letrehozzuk/hasznaljuk a számlaszamot, majd letoltjuk a PDF-et.
    if (!order.id) {
      return;
    }

    this.invoiceLoadingId = order.id;
    this.ordersError = '';

    try {
      const invoiceData = await this.orderService.ensureInvoiceForOrder(order.id);
      this.invoiceService.downloadInvoicePdf({
        ...order,
        id: order.id,
        invoiceNumber: invoiceData.invoiceNumber,
        invoicedAt: invoiceData.invoicedAt
      });
      this.toastService.success('Számla letöltve', order.id);
    } catch (error) {
      console.error(error);
      this.ordersError = normalizeErrorMessage(error, 'A számla generálása nem sikerült.');
      this.toastService.error('Számla hiba', this.ordersError);
    } finally {
      this.invoiceLoadingId = null;
    }
  }

  getOrderEmailHref(order: Order): string {
    return `mailto:${encodeURIComponent(order.customerEmail || '')}?subject=${encodeURIComponent(this.getOrderEmailSubject(order))}&body=${encodeURIComponent(this.getOrderEmailBody(order))}`;
  }

  getOrderEmailSubject(order: Order): string {
    return `TDL Webshop rendelési visszaigazolás - ${order.id || 'rendelés'}`;
  }

  getOrderEmailBody(order: Order): string {
    const itemLines = (order.items || [])
      .map(item => `- ${item.name} x${item.quantity} - ${Number(item.price || 0) * Number(item.quantity || 0)} Ft`)
      .join('\n');
    const pricing = order.pricing;

    return [
      `Kedves ${order.customerName || 'Vásárló'}!`,
      '',
      'Köszönjük a rendelésedet a TDL Webshopban.',
      `Rendelés azonosító: ${order.id || '-'}`,
      `Rendelés státusza: ${this.getOrderStatusLabel(order.status)}`,
      '',
      'Rendelt termékek:',
      itemLines || '- Nincs tételadat',
      '',
      `Szállítási mód: ${order.shippingMethod?.label || '-'}`,
      `Fizetési mód: ${order.paymentMethod?.label || '-'}`,
      ...(order.pickupAt ? [`Átvétel időpontja: ${this.formatDate(order.pickupAt)}`] : []),
      `Részösszeg: ${pricing?.subtotal ?? order.total} Ft`,
      `Szállítás: ${pricing?.shippingFee ?? 0} Ft`,
      `Fizetési díj: ${pricing?.paymentFee ?? 0} Ft`,
      ...(pricing?.discount ? [`Kedvezmény: -${pricing.discount} Ft`] : []),
      ...(order.appliedCoupon?.code || order.couponCode ? [`Kupon: ${order.appliedCoupon?.code || order.couponCode}`] : []),
      `Végösszeg: ${order.total} Ft`,
      '',
      'Hamarosan felvesszük veled a kapcsolatot a feldolgozással kapcsolatban.',
      '',
      'Üdv,',
      'TDL Webshop'
    ].join('\n');
  }

  isSection(section: AdminSection): boolean {
    return this.activeSection === section;
  }

  get adminFilteredProducts(): Product[] {
    const term = this.productSearchTerm.trim().toLowerCase();
    if (!term) {
      return this.products;
    }

    return this.products.filter(product => {
      const name = (product.name || '').toLowerCase();
      const sku = (product.sku || '').toLowerCase();
      const category = (product.category || '').toLowerCase();
      const brand = (product.brand || '').toLowerCase();
      return name.includes(term) || sku.includes(term) || category.includes(term) || brand.includes(term);
    });
  }

  getSalesChannelLabel(channel?: string): string {
    if (channel === 'local-admin') {
      return 'Helyszíni';
    }

    if (channel === 'web') {
      return 'Webes';
    }

    return '-';
  }

  getOrderStatusLabel(status?: string): string {
    if (status === 'uj') {
      return 'Uj';
    }

    if (status === 'feldolgozas alatt') {
      return 'Feldolgozas alatt';
    }

    if (status === 'teljesitve') {
      return 'Teljesitve';
    }

    if (status === 'lemondva') {
      return 'Lemondva';
    }

    return status || '-';
  }

  getUserRoleLabel(role?: AdminRole): string {
    if (role === 'admin') {
      return 'Admin';
    }

    if (role === 'employee') {
      return 'Dolgozó';
    }

    return 'Vásárló';
  }

  getNewsTargetLabel(item: NewsItem): string {
  // Az admin listaban jelzi a hir kattintasi celjat.
    const type = item.targetType || 'none';
    const value = item.targetValue || '';

    if (type === 'products') {
      return 'Célpont: Összes termék';
    }

    if (type === 'category') {
      return `Célpont: Kategória - ${value || '-'}`;
    }

    if (type === 'promo') {
      return `Célpont: Promo - ${value || '-'}`;
    }

      return 'Célpont: Nincs kattintható átlépés';
  }

  startEditProduct(product: Product): void {
    // Kivalasztott termék adatainak betöltése a szerkesztő formba.
    this.editingProductId = product.id || null;
    this.productName = product.name;
    this.productPrice = Number(product.price) || null;
    this.productCategory = this.normalizeProductCategoryForForm(product.category);
    this.productImage = product.image;
    this.productStock = product.stock || 'Keszleten';
    this.productStockQuantity = Number(product.stockQuantity) || 0;
    this.productBrand = product.brand || '';
    this.productSku = product.sku || '';
    this.productShortDescription = product.shortDescription || '';
    this.productDescription = product.description || '';
    this.productIsWeeklyDeal = !!product.isWeeklyDeal;
    this.productIsTopProduct = !!product.isTopProduct;
    this.productSalePercent = Number(product.salePercent) > 0 ? Number(product.salePercent) : null;
    this.productSaleStartsAt = this.toDatetimeLocalValue(Number(product.saleStartsAt) || 0);
    this.productSaleEndsAt = this.toDatetimeLocalValue(Number(product.saleEndsAt) || 0);
    this.successMessage = '';
    this.errorMessage = '';
    this.activeSection = 'products';
  }

  cancelEdit(): void {
    this.resetForm();
    this.successMessage = '';
    this.errorMessage = '';
  }

  requestDeleteProduct(product: Product): void {
    this.pendingProductDelete = product;
    this.deleteProductConfirmOpen = true;
  }

  cancelDeleteProduct(): void {
    this.pendingProductDelete = null;
    this.deleteProductConfirmOpen = false;
  }

  requestDeleteAllProducts(): void {
    if (!this.auth.isCurrentUserAdmin()) {
      this.errorMessage = 'Ehhez a művelethez admin jogosultság kell.';
      return;
    }

    this.deleteAllProductsConfirmOpen = true;
  }

  cancelDeleteAllProducts(): void {
    this.deleteAllProductsConfirmOpen = false;
  }

  async confirmDeleteProduct(): Promise<void> {
    // Termék törlése csak megerosites utan.
    const product = this.pendingProductDelete;
    if (!product) {
      this.cancelDeleteProduct();
      return;
    }

    if (!product.id) {
      this.errorMessage = 'A termék törléséhez hiányzik a dokumentum azonosító.';
      this.cancelDeleteProduct();
      return;
    }

    if (!this.auth.isCurrentUserAdmin()) {
      this.errorMessage = 'Ehhez a művelethez admin jogosultság kell.';
      this.cancelDeleteProduct();
      return;
    }

    this.deletingProductId = product.id;
    this.deleteProductConfirmOpen = false;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      await this.productService.deleteProduct(product.id);

      if (this.editingProductId === product.id) {
        this.resetForm();
      }

      this.successMessage = 'A termék sikeresen törölve lett.';
      this.toastService.success('Termék törölve', product.name);
    } catch (error) {
      console.error(error);
      this.errorMessage = normalizeErrorMessage(error, 'A termék törlése nem sikerült.');
      this.toastService.error('Termék törlése sikertelen', this.errorMessage);
    } finally {
      this.deletingProductId = null;
      this.pendingProductDelete = null;
    }
  }

  async confirmDeleteAllProducts(): Promise<void> {
    if (!this.auth.isCurrentUserAdmin()) {
      this.errorMessage = 'Ehhez a művelethez admin jogosultság kell.';
      this.cancelDeleteAllProducts();
      return;
    }

    this.deleteAllProductsConfirmOpen = false;
    this.purgingProducts = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const deletedCount = await this.productService.deleteAllProducts();
      this.resetForm();
      this.successMessage = `A termékek törlése kész (${deletedCount} db).`;
      this.toastService.success('Teljes termékkatalógus törölve', `${deletedCount} db törölve`);
    } catch (error) {
      console.error(error);
      this.errorMessage = normalizeErrorMessage(error, 'A teljes terméklista törlése nem sikerült.');
      this.toastService.error('Tömeges törlés sikertelen', this.errorMessage);
    } finally {
      this.purgingProducts = false;
    }
  }

  async updateUserRole(user: AdminUserView, role: AdminRole): Promise<void> {
    // User role váltás az admin panelrol.
    if (!user.id) {
      return;
    }

    if (this.auth.getUser()?.uid === user.id && role !== 'admin') {
      this.usersError = 'A saját admin jogosultságodat innen nem veheted el.';
      return;
    }

    this.userActionLoadingId = user.id;
    this.usersError = '';

    try {
      await this.userService.updateUserProfile(user.id, {
        role,
        accountType: role === 'customer' ? user.accountType : 'private',
        companyName: role === 'customer' && user.accountType === 'company' ? user.companyName : '',
        taxNumber: role === 'customer' && user.accountType === 'company' ? user.taxNumber : '',
        employeePermissions: role === 'employee'
          ? (user.employeePermissions || this.getDefaultEmployeePermissions())
          : this.getEmptyEmployeePermissions()
      });
      this.toastService.success('Szerepkör frissítve', `${user.email} -> ${role}`);
    } catch (error) {
      console.error(error);
      this.usersError = normalizeErrorMessage(error, 'A felhasználó szerepkörének mentése nem sikerült.');
      this.toastService.error('Szerepkör mentése sikertelen', this.usersError);
    } finally {
      this.userActionLoadingId = null;
    }
  }

  async toggleUserDisabled(user: AdminUserView): Promise<void> {
    // User tiltasa / visszaengedese.
    if (!user.id) {
      return;
    }

    if (this.auth.getUser()?.uid === user.id) {
      this.usersError = 'A saját fiókodat innen nem tilthatod le.';
      return;
    }

    this.userActionLoadingId = user.id;
    this.usersError = '';

    try {
      await this.userService.updateUserProfile(user.id, { disabled: !user.disabled });
      this.toastService.success('Fiok allapot frissítve', user.email);
    } catch (error) {
      console.error(error);
      this.usersError = normalizeErrorMessage(error, 'A felhasználó tiltási állapotának mentése nem sikerült.');
      this.toastService.error('Felhasználó frissítés sikertelen', this.usersError);
    } finally {
      this.userActionLoadingId = null;
    }
  }

  openUserDetails(user: AdminUserView): void {
    this.selectedUserDetails = user;
    this.userEditorEmail = user.email;
    this.userEditorDisplayName = user.displayName;
    this.userEditorRole = user.role;
    this.userEditorAccountType = user.accountType;
    this.userEditorPhone = user.phone;
    this.userEditorCompanyName = user.companyName;
    this.userEditorTaxNumber = user.taxNumber;
    this.userEditorNote = user.note;
    this.userEditorDisabled = user.disabled;
    const permissions = {
      ...this.getDefaultEmployeePermissions(),
      ...(user.employeePermissions || {})
    };
    this.userEditorCanRecordSales = permissions.canRecordSales;
    this.userEditorCanViewInventory = permissions.canViewInventory;
    this.userEditorCanManageProducts = permissions.canManageProducts;
    this.userEditorCanManageCustomers = permissions.canManageCustomers;
    this.userEditorCanDisableCustomers = permissions.canDisableCustomers;
    this.userDetailsOpen = true;
  }

  closeUserDetails(): void {
    this.userDetailsOpen = false;
    this.selectedUserDetails = null;
  }

  async saveUserDetails(): Promise<void> {
    if (!this.selectedUserDetails?.id) {
      return;
    }

    const email = this.userEditorEmail.trim().toLowerCase();
    if (!email) {
      this.usersError = 'A felhasználó email címe kötelező.';
      return;
    }

    if (!isValidEmail(email)) {
      this.usersError = 'Adj meg érvényes email címet.';
      return;
    }

    if (!this.userEditorDisplayName.trim()) {
      this.usersError = 'A felhasználó neve kötelező.';
      return;
    }

    if (!isValidOptionalPhone(this.userEditorPhone)) {
      this.usersError = 'Adj meg érvényes telefonszámot (8-15 számjegy, pl. +36 30 123 4567).';
      return;
    }

    if (this.userEditorRole === 'customer' && this.userEditorAccountType === 'company' && !this.userEditorTaxNumber.trim()) {
      this.usersError = 'Cég típus esetén az adószám kötelező.';
      return;
    }

    this.userDetailsSaving = true;
    this.usersError = '';

    try {
      await this.userService.updateUserProfile(this.selectedUserDetails.id, {
        email,
        role: this.userEditorRole,
        accountType: this.userEditorRole === 'customer' ? this.userEditorAccountType : 'private',
        displayName: this.userEditorDisplayName.trim(),
        phone: this.userEditorPhone.trim(),
        companyName: this.userEditorRole === 'customer' && this.userEditorAccountType === 'company' ? this.userEditorCompanyName.trim() : '',
        taxNumber: this.userEditorRole === 'customer' && this.userEditorAccountType === 'company' ? this.userEditorTaxNumber.trim() : '',
        note: this.userEditorNote.trim(),
        disabled: this.userEditorDisabled,
        employeePermissions: this.userEditorRole === 'employee'
          ? this.getEditorEmployeePermissions()
          : this.getEmptyEmployeePermissions()
      });

      if (this.userEditorRole === 'customer') {
        await this.customerDirectoryService.upsertAdminProfileByEmail({
          type: this.userEditorAccountType,
          name: this.userEditorDisplayName.trim() || email,
          email,
          phone: this.userEditorPhone.trim() || '-',
          companyName: this.userEditorAccountType === 'company' ? this.userEditorCompanyName.trim() : '',
          taxNumber: this.userEditorAccountType === 'company' ? this.userEditorTaxNumber.trim() : ''
        });
      }

      this.toastService.success('Felhasználó mentve', email);
      this.closeUserDetails();
    } catch (error) {
      console.error(error);
      this.usersError = normalizeErrorMessage(error, 'A felhasználó adatai nem menthetők.');
      this.toastService.error('Felhasználó mentése sikertelen', this.usersError);
    } finally {
      this.userDetailsSaving = false;
    }
  }

  async createAdminManagedUser(): Promise<void> {
    const email = this.createUserEmail.trim().toLowerCase();
    if (!email) {
      this.usersError = 'Az új felhasználó/cég email címe kötelező.';
      return;
    }

    if (!isValidEmail(email)) {
      this.usersError = 'Adj meg érvényes email címet az új felhasználóhoz/céghez.';
      return;
    }

    if (!this.createUserDisplayName.trim()) {
      this.usersError = 'A profil létrehozásához add meg a nevet vagy cégnevet.';
      return;
    }

    if (!isValidPhone(this.createUserPhone)) {
      this.usersError = 'Adj meg érvényes telefonszámot (8-15 számjegy, pl. +36 30 123 4567).';
      return;
    }

    if (this.createUserRole === 'customer' && this.createUserAccountType === 'company' && !this.createUserTaxNumber.trim()) {
      this.usersError = 'Cég létrehozásához az adószám kötelező.';
      return;
    }

    const employeePermissions = this.getCreateEmployeePermissions();
    if (
      this.createUserRole === 'employee'
      && !employeePermissions.canRecordSales
      && !employeePermissions.canViewInventory
      && !employeePermissions.canManageProducts
      && !employeePermissions.canManageCustomers
      && !employeePermissions.canDisableCustomers
    ) {
      this.usersError = 'Dolgozó profilhoz legalább egy jogosultságot adj meg.';
      return;
    }

    this.creatingUser = true;
    this.usersError = '';

    try {
      await this.userService.createOrUpdateAdminManagedUser({
        email,
        role: this.createUserRole,
        disabled: false,
        accountType: this.createUserRole === 'customer' ? this.createUserAccountType : 'private',
        displayName: this.createUserDisplayName.trim(),
        phone: this.createUserPhone.trim(),
        companyName: this.createUserRole === 'customer' && this.createUserAccountType === 'company' ? this.createUserCompanyName.trim() : '',
        taxNumber: this.createUserRole === 'customer' && this.createUserAccountType === 'company' ? this.createUserTaxNumber.trim() : '',
        note: this.createUserNote.trim(),
        employeePermissions: this.createUserRole === 'employee'
          ? employeePermissions
          : this.getEmptyEmployeePermissions()
      });

      if (this.createUserRole === 'customer') {
        await this.customerDirectoryService.upsertAdminProfileByEmail({
          type: this.createUserAccountType,
          name: this.createUserDisplayName.trim() || email,
          email,
          phone: this.createUserPhone.trim() || '-',
          companyName: this.createUserAccountType === 'company' ? this.createUserCompanyName.trim() : '',
          taxNumber: this.createUserAccountType === 'company' ? this.createUserTaxNumber.trim() : ''
        });
      }

      this.toastService.success('Új felhasználó/cég létrehozva', email);
      this.createUserEmail = '';
      this.createUserDisplayName = '';
      this.createUserRole = 'customer';
      this.createUserAccountType = 'private';
      this.createUserPhone = '';
      this.createUserCompanyName = '';
      this.createUserTaxNumber = '';
      this.createUserNote = '';
      this.createUserCanRecordSales = true;
      this.createUserCanViewInventory = true;
      this.createUserCanManageProducts = true;
      this.createUserCanManageCustomers = true;
      this.createUserCanDisableCustomers = true;
    } catch (error) {
      console.error(error);
      this.usersError = normalizeErrorMessage(error, 'Az új felhasználó/cég létrehozása nem sikerült.');
      this.toastService.error('Létrehozás sikertelen', this.usersError);
    } finally {
      this.creatingUser = false;
    }
  }

  private rebuildDashboard(): void {
    // Dashboard aggregációk újraszámítása (készlet chart + low stock + user stat).
    const reservations = new Map<string, number>();
    const sold30Days = new Map<string, number>();
    const reservingStatuses = new Set(['uj', 'feldolgozas alatt']);
    const completedStatuses = new Set(['teljesitve']);
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

    for (const order of this.orders) {
      for (const item of order.items) {
        const keys = this.getOrderItemKeys(item);

        if (reservingStatuses.has(order.status)) {
          this.addQuantityToKeys(reservations, keys, item.quantity);
        }

        if (completedStatuses.has(order.status) && (order.createdAt || 0) >= thirtyDaysAgo) {
          this.addQuantityToKeys(sold30Days, keys, item.quantity);
        }
      }
    }

    this.stockChart = this.products.map(product => {
      const keys = this.getProductKeys(product);
      const totalStock = Math.max(0, Number(product.stockQuantity) || 0);
      const reservedStock = Math.min(totalStock, this.getFirstQuantityForKeys(reservations, keys));
      const availableStock = Math.max(0, totalStock - reservedStock);
      const denominator = Math.max(totalStock, 1);

      return {
        productId: product.id || '',
        name: product.name,
        sku: product.sku || '-',
        category: product.category,
        totalStock,
        reservedStock,
        availableStock,
        reservedPercent: (reservedStock / denominator) * 100,
        availablePercent: (availableStock / denominator) * 100
      };
    });

    this.lowStockAlerts = this.stockChart.filter(item => item.availableStock <= environment.lowStockThreshold);
    this.smartStockSuggestions = this.buildSmartStockSuggestions(sold30Days);
    this.businessReport = this.buildBusinessReport();

    if (this.lowStockAlerts.length > 0 && !this.hasShownLowStockWarning) {
      this.lowStockModalOpen = true;
      this.hasShownLowStockWarning = true;
    }

    this.userSummaries = this.users.map(user => {
      const matchingOrders = this.orders.filter(order => order.userId === user.id || order.customerEmail?.toLowerCase() === user.email.toLowerCase());
      const latestOrderAt = matchingOrders.length > 0
        ? Math.max(...matchingOrders.map(order => order.createdAt || 0))
        : user.lastOrderAt;

      return {
        id: user.id || '',
        email: user.email,
        role: user.role,
        accountType: user.accountType || 'private',
        displayName: user.displayName || '',
        phone: user.phone || '',
        companyName: user.companyName || '',
        taxNumber: user.taxNumber || '',
        note: user.note || '',
        disabled: !!user.disabled,
        employeePermissions: {
          ...this.getEmptyEmployeePermissions(),
          ...(user.employeePermissions || {})
        },
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
        latestOrderAt,
        orderCount: matchingOrders.length,
        totalSpent: matchingOrders.reduce((sum, order) => sum + order.total, 0),
        orders: matchingOrders
      };
    });
  }

  private getEmptyBusinessReport(): BusinessReport {
    return {
      totalRevenue: 0,
      monthlyRevenue: 0,
      averageOrderValue: 0,
      completedOrderCount: 0,
      webOrderCount: 0,
      localOrderCount: 0,
      topProducts: []
    };
  }

  private buildBusinessReport(): BusinessReport {
    const completedOrders = this.orders.filter(order => order.status === 'teljesitve');
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const topProductMap = new Map<string, TopProductReportItem>();

    let totalRevenue = 0;
    let monthlyRevenue = 0;
    let webOrderCount = 0;
    let localOrderCount = 0;

    for (const order of completedOrders) {
      const total = Math.max(0, Number(order.total) || 0);
      totalRevenue += total;

      if ((order.createdAt || 0) >= monthStart) {
        monthlyRevenue += total;
      }

      if (order.salesChannel === 'local-admin') {
        localOrderCount += 1;
      } else {
        webOrderCount += 1;
      }

      for (const item of order.items || []) {
        const name = item.name || 'Ismeretlen termék';
        const quantity = Math.max(0, Number(item.quantity) || 0);
        const revenue = Math.max(0, Number(item.price) || 0) * quantity;
        const current = topProductMap.get(name) || { name, quantity: 0, revenue: 0 };
        current.quantity += quantity;
        current.revenue += revenue;
        topProductMap.set(name, current);
      }
    }

    return {
      totalRevenue,
      monthlyRevenue,
      averageOrderValue: completedOrders.length > 0 ? Math.round(totalRevenue / completedOrders.length) : 0,
      completedOrderCount: completedOrders.length,
      webOrderCount,
      localOrderCount,
      topProducts: [...topProductMap.values()]
        .sort((left, right) => right.revenue - left.revenue || right.quantity - left.quantity)
        .slice(0, 5)
    };
  }

  private resetForm(): void {
    // Termék form alap allapot.
    this.editingProductId = null;
    this.productName = '';
    this.productPrice = null;
    this.productCategory = '';
    this.productImage = '';
    this.productStock = 'Keszleten';
    this.productBrand = '';
    this.productSku = '';
    this.productShortDescription = '';
    this.productDescription = '';
    this.productStockQuantity = 10;
    this.productIsWeeklyDeal = false;
    this.productIsTopProduct = false;
    this.productSalePercent = null;
    this.productSaleStartsAt = '';
    this.productSaleEndsAt = '';
  }

  private normalizeProductCategoryForForm(category: string): string {
    const normalizedCategory = this.normalizeCategoryKey(category);
    const matchingOption = this.productCategoryOptions.find(option =>
      this.normalizeCategoryKey(option) === normalizedCategory
    );

    return matchingOption || category;
  }

  private getOrderItemKeys(item: CartItem): string[] {
    return [
      item.firestoreId || '',
      item.sku || '',
      item.name?.toLowerCase() || ''
    ].filter(Boolean);
  }

  private getProductKeys(product: Product): string[] {
    return [
      product.id || '',
      product.sku || '',
      product.name?.toLowerCase() || ''
    ].filter(Boolean);
  }

  private addQuantityToKeys(target: Map<string, number>, keys: string[], quantity: number): void {
    for (const key of keys) {
      target.set(key, (target.get(key) || 0) + Math.max(0, Number(quantity) || 0));
    }
  }

  private getFirstQuantityForKeys(source: Map<string, number>, keys: string[]): number {
    for (const key of keys) {
      const value = source.get(key);
      if (value) {
        return value;
      }
    }

    return 0;
  }

  private buildSmartStockSuggestions(sold30DaysMap: Map<string, number>): SmartStockSuggestion[] {
    return this.stockChart
      .map(row => {
        const product = this.products.find(item => item.id === row.productId);
        const keys = product ? this.getProductKeys(product) : [row.productId, row.sku, row.name.toLowerCase()];
        const sold30Days = this.getFirstQuantityForKeys(sold30DaysMap, keys);
        const dailyDemand = sold30Days > 0 ? sold30Days / 30 : 0;
        const daysLeft = dailyDemand > 0 ? Math.floor(row.availableStock / dailyDemand) : null;
        const targetDays = 21;
        const safetyStock = environment.lowStockThreshold;
        const targetStock = Math.ceil(dailyDemand * targetDays) + safetyStock;
        const reorderQuantity = this.calculateReorderQuantity(row.availableStock, targetStock, sold30Days, row.reservedStock);
        const priority = this.resolveSmartStockPriority(row.availableStock, reorderQuantity, daysLeft);

        return {
          productId: row.productId,
          name: row.name,
          sku: row.sku,
          category: row.category,
          availableStock: row.availableStock,
          reservedStock: row.reservedStock,
          sold30Days,
          dailyDemand,
          daysLeft,
          reorderQuantity,
          priority,
          label: this.getSmartStockLabel(priority, daysLeft, reorderQuantity)
        };
      })
      .sort((left, right) => {
        const priorityScore = { critical: 0, warning: 1, stable: 2 };
        const priorityDiff = priorityScore[left.priority] - priorityScore[right.priority];
        if (priorityDiff !== 0) {
          return priorityDiff;
        }

        return right.reorderQuantity - left.reorderQuantity;
      });
  }

  private calculateReorderQuantity(
    availableStock: number,
    targetStock: number,
    sold30Days: number,
    reservedStock: number
  ): number {
    if (availableStock <= environment.lowStockThreshold) {
      return Math.max(5, targetStock - availableStock, reservedStock);
    }

    if (sold30Days > 0 && availableStock < targetStock) {
      return Math.max(0, targetStock - availableStock);
    }

    return 0;
  }

  private resolveSmartStockPriority(
    availableStock: number,
    reorderQuantity: number,
    daysLeft: number | null
  ): SmartStockSuggestion['priority'] {
    if (availableStock <= 0 || (daysLeft !== null && daysLeft <= 7)) {
      return 'critical';
    }

    if (reorderQuantity > 0 || (daysLeft !== null && daysLeft <= 14)) {
      return 'warning';
    }

    return 'stable';
  }

  private getSmartStockLabel(
    priority: SmartStockSuggestion['priority'],
    daysLeft: number | null,
    reorderQuantity: number
  ): string {
    if (priority === 'critical') {
      return reorderQuantity > 0 ? 'Azonnali utánrendelés javasolt' : 'Kritikus készletszint';
    }

    if (priority === 'warning') {
      return daysLeft !== null ? `${daysLeft} napra elegendő készlet` : 'Alacsony készletszint';
    }

    return 'Stabil készlet';
  }

  private escapeCsvValue(value: string | number | null | undefined): string {
    const text = String(value ?? '');
    if (!/[;"\n\r]/.test(text)) {
      return text;
    }

    return `"${text.replace(/"/g, '""')}"`;
  }

  private downloadTextFile(content: string, fileName: string): void {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  private normalizeCategoryKey(category: string): string {
    return (category || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '')
      .trim();
  }

  private resetNewsForm(): void {
    // Hír urlap alapallapotba visszaallitasa mentes/szerkesztes utan.
    this.editingNewsId = null;
    this.newsTitle = '';
    this.newsContent = '';
    this.newsLabel = '';
    this.newsIsActive = true;
    this.newsTargetType = 'none';
    this.newsTargetValue = '';
  }

  private getStarterProducts(): Product[] {
    // Kezdő minta katalógus.
    return [
      {
        name: 'Okos radiátor szelep',
        price: 16990,
        category: 'Futes',
        image: 'products/radiator-szelep.jpg',
        stock: 'Keszleten',
        stockQuantity: 14,
        sku: 'TDL-SZL-001',
        brand: 'TDL',
        isTopProduct: true,
        isWeeklyDeal: true,
        shortDescription: 'Programozható radiátor szelep energiatakarékos üzemhez.',
        description: 'Okos vezérlésű radiátor szelep lakossági fűtési rendszerekhez.',
        images: ['products/radiator-szelep.jpg']
      },
      {
        name: 'Keringető szivattyú',
        price: 32900,
        category: 'Hutes',
        image: 'products/hvac-legcsatorna.jpg',
        stock: 'Keszleten',
        stockQuantity: 6,
        sku: 'TDL-HUT-002',
        brand: 'TDL',
        isTopProduct: true,
        shortDescription: 'Energiatakarékos keringető szivattyú hűtési körökhöz.',
        description: 'Modern keringető szivattyú lakossági és kisebb ipari rendszerekhez.',
        images: ['products/hvac-legcsatorna.jpg']
      },
      {
        name: 'Padlófűtés cső szett',
        price: 24900,
        category: 'Lakossagi megoldasok',
        image: 'products/padlofutes-cso.jpg',
        stock: 'Keszleten',
        stockQuantity: 8,
        sku: 'TDL-LAK-003',
        brand: 'TDL',
        isWeeklyDeal: true,
        shortDescription: 'Rugalmas cső szett padlófűtéses körökhöz.',
        description: 'Tartós padlófűtés cső szett gyors szereléshez.',
        images: ['products/padlofutes-cso.jpg']
      },
      {
        name: 'HVAC légcsatorna idom',
        price: 8990,
        category: 'Szellozes',
        image: 'products/hvac-legcsatorna.jpg',
        stock: 'Szallithato',
        stockQuantity: 5,
        sku: 'TDL-SZLZ-004',
        brand: 'TDL',
        shortDescription: 'Horganyzott idom legtechnikai rendszerekhez.',
        description: 'HVAC kompatibilis idom ipari és lakossági telepítéshez.',
        images: ['products/hvac-legcsatorna.jpg']
      },
      {
        name: 'Bronz golyoscsap 1/2',
        price: 4590,
        category: 'Viz',
        image: 'products/golyoscsap.jpg',
        stock: 'Keszleten',
        stockQuantity: 22,
        sku: 'TDL-VIZ-005',
        brand: 'TDL',
        isTopProduct: true,
        shortDescription: 'Massziv golyoscsap hideg-melégvizes rendszerekhez.',
        description: 'Tartósan záró golyóscsap egyszerű beépítéssel.',
        images: ['products/golyoscsap.jpg']
      },
      {
        name: 'Menetes idom készlet',
        price: 6990,
        category: 'Szerelvenyek',
        image: 'products/golyoscsap.jpg',
        stock: 'Keszleten',
        stockQuantity: 18,
        sku: 'TDL-SZER-006',
        brand: 'TDL',
        isWeeklyDeal: true,
        shortDescription: 'Szerelői idom készlet gyors csatlakoztatási munkákhoz.',
        description: 'Komplett menetes idom készlet karbantartási és szerelési feladatokhoz.',
        images: ['products/golyoscsap.jpg']
      }
    ];
  }

  private getProjectCatalogProducts(): Product[] {
    return [
      ...this.getStarterProducts(),
      {
        name: 'Radiátor termosztát fej',
        price: 6990,
        category: 'Futes',
        image: 'products/radiator-szelep.jpg',
        stock: 'Keszleten',
        stockQuantity: 20,
        sku: 'TDL-FUT-007',
        brand: 'TDL',
        isTopProduct: true,
        shortDescription: 'Finom szabályozás radiátorokra.',
        description: 'Programozható termosztát fej lakossági rendszerekhez.',
        images: ['products/radiator-szelep.jpg']
      },
      {
        name: 'Radiátor visszatérő szelep',
        price: 4890,
        category: 'Futes',
        image: 'products/radiator-szelep.jpg',
        stock: 'Keszleten',
        stockQuantity: 16,
        sku: 'TDL-FUT-008',
        brand: 'TDL',
        shortDescription: 'Radiátor körök visszatérő oldalára.',
        description: 'Stabil átfolyás állítás fűtési rendszerekhez.',
        images: ['products/radiator-szelep.jpg']
      },
      {
        name: 'Padlófűtés osztó-gyűjtő szett',
        price: 58990,
        category: 'Lakossagi megoldasok',
        image: 'products/padlofutes-cso.jpg',
        stock: 'Szallithato',
        stockQuantity: 5,
        sku: 'TDL-LAK-009',
        brand: 'TDL',
        isWeeklyDeal: true,
        shortDescription: 'Komplett osztó-gyűjtő egység.',
        description: 'Padlófűtés körök gyors csatlakoztatásához.',
        images: ['products/padlofutes-cso.jpg']
      },
      {
        name: 'Padlófűtés rögzítőfül készlet',
        price: 2990,
        category: 'Lakossagi megoldasok',
        image: 'products/padlofutes-cso.jpg',
        stock: 'Keszleten',
        stockQuantity: 35,
        sku: 'TDL-LAK-010',
        brand: 'TDL',
        shortDescription: 'Rögzítő elemek padlófűtés csövekhez.',
        description: 'Gyors és pontos csőrögzítés telepítésnél.',
        images: ['products/padlofutes-cso.jpg']
      },
      {
        name: 'Legtechnikai T-idom',
        price: 3490,
        category: 'Szellozes',
        image: 'products/hvac-legcsatorna.jpg',
        stock: 'Keszleten',
        stockQuantity: 22,
        sku: 'TDL-SZLZ-011',
        brand: 'TDL',
        shortDescription: 'T-idom légcsatornához.',
        description: 'Szellőzési ágak kialakításához.',
        images: ['products/hvac-legcsatorna.jpg']
      },
      {
        name: 'Legtechnikai 90 fokos idom',
        price: 3190,
        category: 'Szellozes',
        image: 'products/hvac-legcsatorna.jpg',
        stock: 'Keszleten',
        stockQuantity: 19,
        sku: 'TDL-SZLZ-012',
        brand: 'TDL',
        isTopProduct: true,
        shortDescription: '90 fokos forduló idom.',
        description: 'Szellőzési nyomvonal irányváltásához.',
        images: ['products/hvac-legcsatorna.jpg']
      },
      {
        name: 'Legcsatorna rezgescsillapito',
        price: 7990,
        category: 'Hutes',
        image: 'products/hvac-legcsatorna.jpg',
        stock: 'Szallithato',
        stockQuantity: 7,
        sku: 'TDL-HUT-013',
        brand: 'TDL',
        shortDescription: 'Rezgés és zajcsökkentő elem.',
        description: 'HVAC gépegységekhez ajánlott.',
        images: ['products/hvac-legcsatorna.jpg']
      },
      {
        name: 'Fan-coil csatlakozo szett',
        price: 12990,
        category: 'Hutes',
        image: 'products/hvac-legcsatorna.jpg',
        stock: 'Keszleten',
        stockQuantity: 11,
        sku: 'TDL-HUT-014',
        brand: 'TDL',
        isWeeklyDeal: true,
        shortDescription: 'Fan-coil telepítési csatlakozók.',
        description: 'Gyors bekötés hűtési körökhöz.',
        images: ['products/hvac-legcsatorna.jpg']
      },
      {
        name: 'PPR csővezeték 20mm',
        price: 1290,
        category: 'Viz',
        image: 'products/golyoscsap.jpg',
        stock: 'Keszleten',
        stockQuantity: 60,
        sku: 'TDL-VIZ-015',
        brand: 'TDL',
        shortDescription: 'PPR cső hideg-meleg vízhez.',
        description: 'Strapabíró csővezeték épületgépészeti munkákhoz.',
        images: ['products/golyoscsap.jpg']
      },
      {
        name: 'PPR konyok 20mm',
        price: 490,
        category: 'Viz',
        image: 'products/golyoscsap.jpg',
        stock: 'Keszleten',
        stockQuantity: 120,
        sku: 'TDL-VIZ-016',
        brand: 'TDL',
        shortDescription: '90 fokos PPR idom.',
        description: 'Vízvezeték kanyarok kialakításához.',
        images: ['products/golyoscsap.jpg']
      },
      {
        name: 'Y-szűrő 3/4',
        price: 3690,
        category: 'Szerelvenyek',
        image: 'products/golyoscsap.jpg',
        stock: 'Keszleten',
        stockQuantity: 24,
        sku: 'TDL-SZER-017',
        brand: 'TDL',
        isWeeklyDeal: true,
        shortDescription: 'Szennyező anyagok kiszűréséhez.',
        description: 'Rendszervédelem fűtési és vizes körökben.',
        images: ['products/golyoscsap.jpg']
      },
      {
        name: 'Visszacsapo szelep 1/2',
        price: 2790,
        category: 'Szerelvenyek',
        image: 'products/golyoscsap.jpg',
        stock: 'Keszleten',
        stockQuantity: 27,
        sku: 'TDL-SZER-018',
        brand: 'TDL',
        shortDescription: 'Visszaáramlás ellen.',
        description: 'Megbízható zárás és hosszabb élettartam.',
        images: ['products/golyoscsap.jpg']
      },
      {
        name: 'Nyomáscsökkentő szelep',
        price: 11990,
        category: 'Viz',
        image: 'products/golyoscsap.jpg',
        stock: 'Szallithato',
        stockQuantity: 6,
        sku: 'TDL-VIZ-019',
        brand: 'TDL',
        isTopProduct: true,
        shortDescription: 'Stabil hálózati nyomás biztosítására.',
        description: 'Lakossági és kisebb ipari rendszerekhez.',
        images: ['products/golyoscsap.jpg']
      },
      {
        name: 'Fali termosztát digitális',
        price: 14990,
        category: 'Futes',
        image: 'products/radiator-szelep.jpg',
        stock: 'Keszleten',
        stockQuantity: 13,
        sku: 'TDL-FUT-020',
        brand: 'TDL',
        isTopProduct: true,
        shortDescription: 'Digitális hőfokszabályzó.',
        description: 'Heti programozhatóság fűtési rendszerekhez.',
        images: ['products/radiator-szelep.jpg']
      },
      {
        name: 'Kondenzvíz elvezető cső',
        price: 2190,
        category: 'Hutes',
        image: 'products/hvac-legcsatorna.jpg',
        stock: 'Keszleten',
        stockQuantity: 41,
        sku: 'TDL-HUT-021',
        brand: 'TDL',
        isTopProduct: true,
        shortDescription: 'Klíma kondenzvíz elvezetéshez.',
        description: 'Rugalmas cső gyors telepítéshez.',
        images: ['products/hvac-legcsatorna.jpg']
      },
      {
        name: 'Klíma rézcső 1/4',
        price: 5990,
        category: 'Hutes',
        image: 'products/hvac-legcsatorna.jpg',
        stock: 'Keszleten',
        stockQuantity: 14,
        sku: 'TDL-HUT-022',
        brand: 'TDL',
        shortDescription: 'Szigetelt rézcső klíma telepítéshez.',
        description: 'Jó hőmérséklet-tartás és hosszú élettartam.',
        images: ['products/hvac-legcsatorna.jpg']
      },
      {
        name: 'Csőbefogó bilincs készlet',
        price: 1890,
        category: 'Szerelvenyek',
        image: 'products/golyoscsap.jpg',
        stock: 'Keszleten',
        stockQuantity: 55,
        sku: 'TDL-SZER-023',
        brand: 'TDL',
        shortDescription: 'Különböző méretű bilincsek.',
        description: 'Csővezetékek rögzítésére falon és mennyezeten.',
        images: ['products/golyoscsap.jpg']
      },
      {
        name: 'Menettömítő zsinór',
        price: 990,
        category: 'Szerelvenyek',
        image: 'products/golyoscsap.jpg',
        stock: 'Keszleten',
        stockQuantity: 80,
        sku: 'TDL-SZER-024',
        brand: 'TDL',
        shortDescription: 'Biztonságos menettömítéshez.',
        description: 'Gyors és tiszta tömítés menetes kötésekhez.',
        images: ['products/golyoscsap.jpg']
      },
      {
        name: 'Lakossági vízszűrő patron',
        price: 4590,
        category: 'Lakossagi megoldasok',
        image: 'products/golyoscsap.jpg',
        stock: 'Keszleten',
        stockQuantity: 26,
        sku: 'TDL-LAK-025',
        brand: 'TDL',
        isWeeklyDeal: true,
        shortDescription: 'Ivóvíz előszűréséhez.',
        description: 'Könnyen cserélhető patronos megoldás.',
        images: ['products/golyoscsap.jpg']
      },
      {
        name: 'Kompakt nyomásmérő 1/4',
        price: 3990,
        category: 'Lakossagi megoldasok',
        image: 'products/radiator-szelep.jpg',
        stock: 'Keszleten',
        stockQuantity: 18,
        sku: 'TDL-LAK-026',
        brand: 'TDL',
        isWeeklyDeal: true,
        shortDescription: 'Rendszernyomás gyors ellenőrzésére.',
        description: 'Fűtési és vizes rendszerekhez egyaránt.',
        images: ['products/radiator-szelep.jpg']
      },
      ...this.getExtendedCatalogProducts()
    ];
  }

  private getExtendedCatalogProducts(): Product[] {
    // Kategoriaankent bovitett katalogus a nagyobb termekvalasztekhoz.
    return [
      // FUTES
      { name: 'Radiator leereszto szelep', price: 3290, category: 'Futes', image: 'products/radiator-szelep.jpg', stock: 'Keszleten', stockQuantity: 32, sku: 'TDL-FUT-027', brand: 'TDL', shortDescription: 'Leereszteshez es karbantartashoz.', description: 'Egyszeru radiator karbantartasi muveletekhez.', images: ['products/radiator-szelep.jpg'] },
      { name: 'Termosztatikus radiator szelep', price: 11990, category: 'Futes', image: 'products/radiator-szelep.jpg', stock: 'Keszleten', stockQuantity: 21, sku: 'TDL-FUT-028', brand: 'TDL', isTopProduct: true, shortDescription: 'Automatikus homerseklet-szabalyozas.', description: 'Komfortos es energiatakarekos futesi uzem.', images: ['products/radiator-szelep.jpg'] },
      { name: 'Kazanhazi golyoscsap 3/4', price: 5290, category: 'Futes', image: 'products/golyoscsap.jpg', stock: 'Keszleten', stockQuantity: 18, sku: 'TDL-FUT-029', brand: 'TDL', shortDescription: 'Kazanhazi elzarashoz.', description: 'Nagy uzembiztonsagu szerelveny futesi korokhoz.', images: ['products/golyoscsap.jpg'] },
      { name: 'Radiator visszatero csatlakozo', price: 2490, category: 'Futes', image: 'products/radiator-szelep.jpg', stock: 'Keszleten', stockQuantity: 27, sku: 'TDL-FUT-030', brand: 'TDL', shortDescription: 'Gyors radiator csatlakoztatas.', description: 'Szervizelheto visszatero oldali csatlakozo.', images: ['products/radiator-szelep.jpg'] },
      { name: 'Programozhato futesi termosztat', price: 19990, category: 'Futes', image: 'products/radiator-szelep.jpg', stock: 'Szallithato', stockQuantity: 9, sku: 'TDL-FUT-031', brand: 'TDL', isWeeklyDeal: true, shortDescription: 'Heti idoprogram futeshez.', description: 'Intelligens termosztat modern futesi rendszerekhez.', images: ['products/radiator-szelep.jpg'] },

      // HUTES
      { name: 'Split klima rezcso par', price: 12990, category: 'Hutes', image: 'products/hvac-legcsatorna.jpg', stock: 'Keszleten', stockQuantity: 24, sku: 'TDL-HUT-032', brand: 'TDL', shortDescription: 'Eloszigetelt rezcso szett.', description: 'Split klimak szerelesehez ajanlott.', images: ['products/hvac-legcsatorna.jpg'] },
      { name: 'Kondenzviz szivattyu mini', price: 17990, category: 'Hutes', image: 'products/hvac-legcsatorna.jpg', stock: 'Keszleten', stockQuantity: 12, sku: 'TDL-HUT-033', brand: 'TDL', isTopProduct: true, shortDescription: 'Kompakt kondenzviz kezeles.', description: 'Kisebb klima rendszerekhez optimalizalt.', images: ['products/hvac-legcsatorna.jpg'] },
      { name: 'Klima csatorna fedlap elem', price: 1890, category: 'Hutes', image: 'products/hvac-legcsatorna.jpg', stock: 'Keszleten', stockQuantity: 70, sku: 'TDL-HUT-034', brand: 'TDL', shortDescription: 'Esztetikus fedes klima vezetekhez.', description: 'Beltteri kialakitasokhoz tiszta megjelenes.', images: ['products/hvac-legcsatorna.jpg'] },
      { name: 'Huto kor golyoscsap', price: 4590, category: 'Hutes', image: 'products/golyoscsap.jpg', stock: 'Keszleten', stockQuantity: 25, sku: 'TDL-HUT-035', brand: 'TDL', shortDescription: 'Hutesi korok gyors zarasa.', description: 'Megbizhato elzaras klima gepegeszeti rendszereknel.', images: ['products/golyoscsap.jpg'] },
      { name: 'Fan-coil termosztatikus szelep', price: 15490, category: 'Hutes', image: 'products/radiator-szelep.jpg', stock: 'Szallithato', stockQuantity: 8, sku: 'TDL-HUT-036', brand: 'TDL', isWeeklyDeal: true, shortDescription: 'Fan-coil holeadashoz optimalizalva.', description: 'Preciz homerseklet szabalyozas.', images: ['products/radiator-szelep.jpg'] },

      // VIZ
      { name: 'Ivoviz golyoscsap 3/4', price: 3390, category: 'Viz', image: 'products/golyoscsap.jpg', stock: 'Keszleten', stockQuantity: 44, sku: 'TDL-VIZ-037', brand: 'TDL', shortDescription: 'Ivovizes rendszerekhez minositve.', description: 'Hosszueletu vizszerelesi elzaro.', images: ['products/golyoscsap.jpg'] },
      { name: 'Sargarez csonakos szuro', price: 4590, category: 'Viz', image: 'products/golyoscsap.jpg', stock: 'Keszleten', stockQuantity: 23, sku: 'TDL-VIZ-038', brand: 'TDL', shortDescription: 'Homok es szennyezo kiszuresehez.', description: 'Vizhalozati elemek vedelmehez.', images: ['products/golyoscsap.jpg'] },
      { name: 'Viznyomasmero ora 0-10 bar', price: 2990, category: 'Viz', image: 'products/radiator-szelep.jpg', stock: 'Keszleten', stockQuantity: 31, sku: 'TDL-VIZ-039', brand: 'TDL', shortDescription: 'Nyomasellenorzeshez.', description: 'Gyors diagnosztikai mereshez.', images: ['products/radiator-szelep.jpg'] },
      { name: 'Teflon tomitoszalag profi', price: 690, category: 'Viz', image: 'products/golyoscsap.jpg', stock: 'Keszleten', stockQuantity: 110, sku: 'TDL-VIZ-040', brand: 'TDL', shortDescription: 'Menetes kotesek tomitesehez.', description: 'Vizes rendszereknel megbizhato tomites.', images: ['products/golyoscsap.jpg'] },
      { name: 'Lakossagi vizlagyito bypass szett', price: 22990, category: 'Viz', image: 'products/golyoscsap.jpg', stock: 'Szallithato', stockQuantity: 7, sku: 'TDL-VIZ-041', brand: 'TDL', isWeeklyDeal: true, shortDescription: 'Vizlagyito rendszerek bekotesehez.', description: 'Bypass ag megbizhato kialakitasahoz.', images: ['products/golyoscsap.jpg'] },

      // SZELLOZES
      { name: 'Legcsatorna egyenes elem 1m', price: 4590, category: 'Szellozes', image: 'products/hvac-legcsatorna.jpg', stock: 'Keszleten', stockQuantity: 37, sku: 'TDL-SZLZ-042', brand: 'TDL', shortDescription: 'Horganyzott egyenes elem.', description: 'Szellozesi nyomvonal kiepitesehez.', images: ['products/hvac-legcsatorna.jpg'] },
      { name: 'Legtechnikai atvezeto idom', price: 3890, category: 'Szellozes', image: 'products/hvac-legcsatorna.jpg', stock: 'Keszleten', stockQuantity: 28, sku: 'TDL-SZLZ-043', brand: 'TDL', shortDescription: 'Fal/foodem atvezeteshez.', description: 'Stabil idom szellozesi rendszerekhez.', images: ['products/hvac-legcsatorna.jpg'] },
      { name: 'Anemosztat befuvo', price: 6990, category: 'Szellozes', image: 'products/hvac-legcsatorna.jpg', stock: 'Keszleten', stockQuantity: 15, sku: 'TDL-SZLZ-044', brand: 'TDL', isTopProduct: true, shortDescription: 'Mennyezeti befuvo elem.', description: 'Esztetikus legbevezetes modern terekben.', images: ['products/hvac-legcsatorna.jpg'] },
      { name: 'Visszacsapo lamellas zsalu', price: 7490, category: 'Szellozes', image: 'products/hvac-legcsatorna.jpg', stock: 'Keszleten', stockQuantity: 13, sku: 'TDL-SZLZ-045', brand: 'TDL', shortDescription: 'Visszaaramlas ellen ved.', description: 'Kivezetesek uzembiztonsagahoz.', images: ['products/hvac-legcsatorna.jpg'] },
      { name: 'Rugalmas legtechnikai cso 3m', price: 5590, category: 'Szellozes', image: 'products/hvac-legcsatorna.jpg', stock: 'Keszleten', stockQuantity: 22, sku: 'TDL-SZLZ-046', brand: 'TDL', isWeeklyDeal: true, shortDescription: 'Rugalmas bekoteshez.', description: 'Gyors szereles kiegeszito elem.', images: ['products/hvac-legcsatorna.jpg'] },

      // SZERELVENYEK
      { name: 'Sargarez T-idom 1/2', price: 990, category: 'Szerelvenyek', image: 'products/golyoscsap.jpg', stock: 'Keszleten', stockQuantity: 140, sku: 'TDL-SZER-047', brand: 'TDL', shortDescription: 'Alap T-idom szereleshez.', description: 'Viz- es futesrendszer agazasokhoz.', images: ['products/golyoscsap.jpg'] },
      { name: 'Sargarez szukito idom 3/4-1/2', price: 1190, category: 'Szerelvenyek', image: 'products/golyoscsap.jpg', stock: 'Keszleten', stockQuantity: 96, sku: 'TDL-SZER-048', brand: 'TDL', shortDescription: 'Meretváltás menetes kotesekhez.', description: 'Megbizhato menetes csatlakozas.', images: ['products/golyoscsap.jpg'] },
      { name: 'Automata legtelenito szelep', price: 4290, category: 'Szerelvenyek', image: 'products/radiator-szelep.jpg', stock: 'Keszleten', stockQuantity: 29, sku: 'TDL-SZER-049', brand: 'TDL', isTopProduct: true, shortDescription: 'Levego eltavolitas futesi korokbol.', description: 'Halkabb es stabilabb futesi uzemhez.', images: ['products/radiator-szelep.jpg'] },
      { name: 'Tolto-urito csap 1/2', price: 2390, category: 'Szerelvenyek', image: 'products/golyoscsap.jpg', stock: 'Keszleten', stockQuantity: 42, sku: 'TDL-SZER-050', brand: 'TDL', shortDescription: 'Rendszerfeltolteshez es uriteshez.', description: 'Karbantartasi munkakhoz nelkulozhetetlen.', images: ['products/golyoscsap.jpg'] },
      { name: 'Szerviz golyoscsap mini', price: 1690, category: 'Szerelvenyek', image: 'products/golyoscsap.jpg', stock: 'Keszleten', stockQuantity: 58, sku: 'TDL-SZER-051', brand: 'TDL', isWeeklyDeal: true, shortDescription: 'Kompakt elzaro kis helyre.', description: 'Gyors szervizelhetoseghez.', images: ['products/golyoscsap.jpg'] },

      // LAKOSSAGI MEGOLDASOK
      { name: 'Lakossagi radiator bekoto szett', price: 8990, category: 'Lakossagi megoldasok', image: 'products/radiator-szelep.jpg', stock: 'Keszleten', stockQuantity: 20, sku: 'TDL-LAK-052', brand: 'TDL', shortDescription: 'Komplett bekotes egy csomagban.', description: 'Otthoni radiator telepiteshez idealis.', images: ['products/radiator-szelep.jpg'] },
      { name: 'Otthoni vizszuro haz 10\"', price: 12990, category: 'Lakossagi megoldasok', image: 'products/golyoscsap.jpg', stock: 'Keszleten', stockQuantity: 16, sku: 'TDL-LAK-053', brand: 'TDL', shortDescription: 'Haztartasi vizszureshez.', description: 'Standard patron kompatibilitas.', images: ['products/golyoscsap.jpg'] },
      { name: 'Padlofutes termosztat szett', price: 21990, category: 'Lakossagi megoldasok', image: 'products/padlofutes-cso.jpg', stock: 'Szallithato', stockQuantity: 9, sku: 'TDL-LAK-054', brand: 'TDL', isTopProduct: true, shortDescription: 'Padlofutes komfort szabalyozashoz.', description: 'Intelligens hofokkezeles lakasokhoz.', images: ['products/padlofutes-cso.jpg'] },
      { name: 'Mosogep bekoto csomag', price: 4990, category: 'Lakossagi megoldasok', image: 'products/golyoscsap.jpg', stock: 'Keszleten', stockQuantity: 34, sku: 'TDL-LAK-055', brand: 'TDL', shortDescription: 'Gyors mosogep bekoteshez.', description: 'Alap szerelvenyek egy csomagban.', images: ['products/golyoscsap.jpg'] },
      { name: 'Otthoni mini gepegesz indulokészlet', price: 7990, category: 'Lakossagi megoldasok', image: 'products/golyoscsap.jpg', stock: 'Keszleten', stockQuantity: 26, sku: 'TDL-LAK-056', brand: 'TDL', isWeeklyDeal: true, shortDescription: 'Alap gepegesz szerelveny csomag.', description: 'Karbantartasi feladatokhoz idealis kezdokészlet.', images: ['products/golyoscsap.jpg'] }
    ];
  }

  private withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    // Promise timeout helper (lassu halozati helyzetekhez).
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject({ code: 'deadline-exceeded' }), timeoutMs);
    });

    return Promise.race([promise, timeoutPromise]);
  }

  private normalizeSalePercent(value: number | null): number | null {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
      return null;
    }

    const parsed = Math.round(Number(value));
    if (parsed <= 0) {
      return null;
    }

    return Math.min(95, parsed);
  }

  private parseDatetimeLocal(value: string): number | null {
    const normalized = (value || '').trim();

    if (!normalized) {
      return null;
    }

    const timestamp = new Date(normalized).getTime();
    if (!Number.isFinite(timestamp) || timestamp <= 0) {
      return null;
    }

    return timestamp;
  }

  private toDatetimeLocalValue(timestamp: number): string {
    if (!Number.isFinite(timestamp) || timestamp <= 0) {
      return '';
    }

    const date = new Date(timestamp);
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
  }

  private mapClientLog(item: ClientLogItem): AdminClientLogView {
    return {
      id: item.id,
      event: item.event || 'unknown-event',
      message: item.message || 'Nincs részletes hibaüzenet.',
      createdAt: Number(item.createdAt) || 0,
      userEmail: item.userEmail || 'ismeretlen'
    };
  }

  private getStatusChangeConfirmation(order: Order, nextStatus: string): string {
    // Státuszmodositas popup szovege.
    const nextLabel = nextStatus === 'feldolgozas alatt' ? 'feldolgozas alatt' : nextStatus;
    const stockChangeNotice =
      (order.status !== 'teljesitve' && nextStatus === 'teljesitve') ||
      (order.status === 'teljesitve' && nextStatus !== 'teljesitve')
        ? '\nEz a statuszváltás automatikusan módosítja a készletet.'
        : '';

    return `Biztosan átállítod a(z) ${order.customerName} rendelését erre: ${nextLabel}?${stockChangeNotice}`;
  }

  getPendingOrderStatusText(): string {
    if (!this.pendingOrderStatusChange) {
      return '';
    }

    const { order } = this.pendingOrderStatusChange;
    const nextStatus = this.pendingOrderStatusChoice;
    return this.getStatusChangeConfirmation(order, nextStatus);
  }

  getSaleStatus(product: Product): 'active' | 'scheduled' | 'expired' | 'none' {
    const percent = Number(product.salePercent) || 0;

    if (percent <= 0) {
      return 'none';
    }

    const now = Date.now();
    const startsAt = Number(product.saleStartsAt) || 0;
    const endsAt = Number(product.saleEndsAt) || 0;

    if (startsAt > 0 && now < startsAt) {
      return 'scheduled';
    }

    if (endsAt > 0 && now > endsAt) {
      return 'expired';
    }

    return 'active';
  }

  getSaleStatusLabel(product: Product): string {
    const status = this.getSaleStatus(product);

    if (status === 'active') {
      return 'Akció aktív';
    }

    if (status === 'scheduled') {
      return 'Meg nem indult';
    }

    if (status === 'expired') {
      return 'Lejart';
    }

    return 'Nincs időzített akció';
  }

  getSaleStatusClass(product: Product): string {
    return `sale-status-${this.getSaleStatus(product)}`;
  }

  getSaleWindowText(product: Product): string {
    const startsAt = Number(product.saleStartsAt) || 0;
    const endsAt = Number(product.saleEndsAt) || 0;

    if (startsAt <= 0 && endsAt <= 0) {
      return 'Idozites: nincs megadva';
    }

    const startLabel = startsAt > 0 ? this.formatDate(startsAt) : 'azonnal';
    const endLabel = endsAt > 0 ? this.formatDate(endsAt) : 'visszavonasig';
    return `Idozites: ${startLabel} - ${endLabel}`;
  }

  getAvailableStockForProduct(productId: string): number {
    const stockRow = this.stockChart.find(item => item.productId === productId);

    if (stockRow) {
      return Math.max(0, stockRow.availableStock);
    }

    const product = this.products.find(item => item.id === productId);
    return Math.max(0, Number(product?.stockQuantity) || 0);
  }

}


