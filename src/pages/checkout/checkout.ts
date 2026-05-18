import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../app/services/auth.service';
import { CartService } from '../../app/services/cart.service';
import { OrderService } from '../../app/services/order.service';
import { UserService } from '../../app/services/user.service';
import { CustomerDirectoryService } from '../../app/services/customer-directory.service';
import { ToastService } from '../../app/services/toast.service';
import { MonitoringService } from '../../app/services/monitoring.service';
import { Subscription } from 'rxjs';
import { normalizeErrorMessage, getErrorCode } from '../../app/utils/error-message';
import { isValidEmail, isValidPhone } from '../../app/utils/form-validators';

interface OrderSuccessSummary {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingMethodLabel: string;
  paymentMethodLabel: string;
  pickupAt?: number;
  subtotal: number;
  shippingFee: number;
  paymentFee: number;
  discount: number;
  couponCode?: string;
  couponDescription?: string;
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    image: string;
  }>;
}

interface CouponDefinition {
  code: string;
  description: string;
  type: 'percent' | 'fixed' | 'shipping';
  value: number;
  minSubtotal: number;
}

interface CouponEvaluation {
  valid: boolean;
  code: string;
  description: string;
  type: 'percent' | 'fixed' | 'shipping';
  discount: number;
  reason?: string;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class Checkout {
  // Bejelentkezés/regisztráció rész állapot.
  authEmail = '';
  authPassword = '';
  authLoading = false;
  authMessage = '';
  authError = '';
  registerModalOpen = false;
  registerEmail = '';
  registerPassword = '';
  registerConfirmPassword = '';
  registerLoading = false;
  registerMessage = '';
  registerError = '';

  customerName = '';
  customerEmail = '';
  customerPhone = '';
  isBusinessBuyer = false;
  businessCompanyName = '';
  businessTaxNumber = '';
  shippingZip = '';
  shippingCity = '';
  shippingAddress = '';
  billingSameAsShipping = true;
  billingName = '';
  billingZip = '';
  billingCity = '';
  billingAddress = '';
  couponCode = '';
  orderComment = '';
  orderMessage = '';
  orderError = '';
  orderLoading = false;
  orderValidationErrors: string[] = [];
  selectedShippingMethod = 'standard';
  selectedPaymentMethod = 'card';
  pickupDateTime = '';

  private authSubscription?: Subscription;
  private hasLoadedCheckoutProfile = false;
  // Szállítási/fizetési opciók + kupon szabályok.
  shippingMethods = [
    { id: 'standard', label: 'Házhozszállítás (2-4 munkanap)', fee: 1990, eta: '2-4 munkanap' },
    { id: 'express', label: 'Expressz szállítás (1-2 munkanap)', fee: 3490, eta: '1-2 munkanap' },
    { id: 'pickup', label: 'Személyes átvétel', fee: 0, eta: 'Átvétel 24 órán belül' }
  ];
  paymentMethods = [
    { id: 'card', label: 'Bankkártyás fizetés (bemutató - online terhelés nélkül)', fee: 0 },
    { id: 'transfer', label: 'Átutalás', fee: 0 },
    { id: 'cod', label: 'Utánvét', fee: 590 }
  ];
  couponDefinitions: CouponDefinition[] = [
    { code: 'DEMO500', description: '500 Ft azonnali kedvezmény', type: 'fixed', value: 500, minSubtotal: 0 },
    { code: 'TDL10', description: '10% kedvezmény 10 000 Ft felett', type: 'percent', value: 10, minSubtotal: 10000 },
    { code: 'WELCOME2000', description: '2000 Ft kedvezmény 15 000 Ft felett', type: 'fixed', value: 2000, minSubtotal: 15000 },
    { code: 'SHIPFREE', description: 'Ingyenes szállítás 20 000 Ft felett', type: 'shipping', value: 0, minSubtotal: 20000 }
  ];
  zipCityMap: Record<string, string> = {
    '1011': 'Budapest',
    '1024': 'Budapest',
    '1036': 'Budapest',
    '1042': 'Budapest',
    '1051': 'Budapest',
    '1061': 'Budapest',
    '1077': 'Budapest',
    '1085': 'Budapest',
    '1095': 'Budapest',
    '1106': 'Budapest',
    '1117': 'Budapest',
    '1123': 'Budapest',
    '1138': 'Budapest',
    '1148': 'Budapest',
    '1152': 'Budapest',
    '1165': 'Budapest',
    '1173': 'Budapest',
    '1185': 'Budapest',
    '1196': 'Budapest',
    '1203': 'Budapest',
    '1212': 'Budapest',
    '1222': 'Budapest',
    '1239': 'Budapest',
    '2000': 'Szentendre',
    '2030': 'Érd',
    '2400': 'Dunaújváros',
    '2500': 'Esztergom',
    '2600': 'Vác',
    '2800': 'Tatabánya',
    '3300': 'Eger',
    '3525': 'Miskolc',
    '3530': 'Miskolc',
    '3700': 'Kazincbarcika',
    '4024': 'Debrecen',
    '4032': 'Debrecen',
    '4220': 'Hajdúszoboszló',
    '4400': 'Nyíregyháza',
    '5000': 'Szolnok',
    '5600': 'Békéscsaba',
    '6000': 'Kecskemét',
    '6500': 'Baja',
    '6720': 'Szeged',
    '6724': 'Szeged',
    '7100': 'Szekszárd',
    '7400': 'Kaposvár',
    '7621': 'Pécs',
    '7624': 'Pécs',
    '8000': 'Székesfehérvár',
    '8200': 'Veszprém',
    '8230': 'Balatonfüred',
    '8500': 'Pápa',
    '8600': 'Siófok',
    '8800': 'Nagykanizsa',
    '8900': 'Zalaegerszeg',
    '9021': 'Győr',
    '9400': 'Sopron',
    '9700': 'Szombathely'
  };

  constructor(
    public authService: AuthService,
    public cartService: CartService,
    private router: Router,
    private orderService: OrderService,
    private userService: UserService,
    private customerDirectoryService: CustomerDirectoryService,
    private toastService: ToastService,
    private monitoringService: MonitoringService
  ) {
    // Bejelentkezett vasarlonal az emailt es a mentett profiladatokat is atemeljuk.
    this.authSubscription = this.authService.user$.subscribe(user => {
      if (!user?.email || !user.uid) {
        this.hasLoadedCheckoutProfile = false;
        return;
      }

      this.authEmail = user.email;
      if (!this.customerEmail) {
        this.customerEmail = user.email;
      }

      if (!this.hasLoadedCheckoutProfile) {
        this.hasLoadedCheckoutProfile = true;
        void this.loadCheckoutProfile(user.uid);
      }
    });
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

  private async loadCheckoutProfile(userId: string): Promise<void> {
    try {
      const profile = await this.userService.getUserProfile(userId);
      if (!profile) {
        return;
      }

      if (!this.customerName && profile.displayName) {
        this.customerName = profile.displayName;
      }

      if (!this.customerPhone && profile.phone) {
        this.customerPhone = profile.phone;
      }

      if (profile.accountType === 'company') {
        this.isBusinessBuyer = true;
        if (!this.businessCompanyName && profile.companyName) {
          this.businessCompanyName = profile.companyName;
        }
        if (!this.businessTaxNumber && profile.taxNumber) {
          this.businessTaxNumber = profile.taxNumber;
        }
      }

      const shipping = profile.shippingAddress;
      if (shipping) {
        if (!this.shippingZip && shipping.zip) {
          this.shippingZip = shipping.zip;
        }
        if (!this.shippingCity && shipping.city) {
          this.shippingCity = shipping.city;
        }
        if (!this.shippingAddress && shipping.address) {
          this.shippingAddress = shipping.address;
        }
      }

      const billing = profile.billingAddress;
      if (billing) {
        const hasTypedBillingData = !!(this.billingName || this.billingZip || this.billingCity || this.billingAddress);
        if (!hasTypedBillingData) {
          this.billingSameAsShipping = billing.sameAsShipping;
        }
        if (!this.billingName && billing.name) {
          this.billingName = billing.name;
        }
        if (!this.billingZip && billing.zip) {
          this.billingZip = billing.zip;
        }
        if (!this.billingCity && billing.city) {
          this.billingCity = billing.city;
        }
        if (!this.billingAddress && billing.address) {
          this.billingAddress = billing.address;
        }
      }
    } catch (error) {
      this.monitoringService.capture('checkout-profile-prefill-failed', error, { userId });
    }
  }

  async submitAuth(): Promise<void> {
    this.authLoading = true;
    this.authError = '';
    this.authMessage = '';

    try {
      await this.authService.login(this.authEmail, this.authPassword);
      this.authMessage = 'Sikeres bejelentkezés.';
      this.customerEmail = this.authEmail;
      this.toastService.success('Sikeres bejelentkezés');
    } catch {
      this.authError = 'A bejelentkezés vagy regisztráció nem sikerült.';
      this.toastService.error('Bejelentkezés sikertelen', this.authError);
    } finally {
      this.authLoading = false;
    }
  }

  onShippingZipChange(): void {
    // Irányítószám alapján automatikus város kitöltés.
    const zip = this.shippingZip.trim();
    if (zip.length !== 4) {
      return;
    }

    const city = this.zipCityMap[zip];
    if (city && !this.shippingCity.trim()) {
      this.shippingCity = city;
    }
  }

  onBillingZipChange(): void {
    // Külön számlázási címnél ugyanaz az automatika.
    const zip = this.billingZip.trim();
    if (zip.length !== 4) {
      return;
    }

    const city = this.zipCityMap[zip];
    if (city && !this.billingCity.trim()) {
      this.billingCity = city;
    }
  }

  openRegisterModal(): void {
    this.registerModalOpen = true;
    this.registerEmail = this.authEmail;
    this.registerError = '';
    this.registerMessage = '';
  }

  closeRegisterModal(): void {
    this.registerModalOpen = false;
    this.registerLoading = false;
    this.registerError = '';
    this.registerMessage = '';
  }

  async submitRegister(): Promise<void> {
    this.registerError = '';
    this.registerMessage = '';

    const normalizedEmail = this.registerEmail.trim().toLowerCase();

    if (!normalizedEmail || !this.registerPassword || !this.registerConfirmPassword) {
      this.registerError = 'Minden mezőt ki kell tölteni.';
      this.toastService.error('Hiányos adatok', this.registerError);
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      this.registerError = 'Adj meg valós e-mail formátumot.';
      this.toastService.error('Hibás e-mail cím', this.registerError);
      return;
    }

    if (this.registerPassword !== this.registerConfirmPassword) {
      this.registerError = 'A két jelszó nem egyezik meg.';
      this.toastService.error('Jelszó hiba', this.registerError);
      return;
    }

    this.registerLoading = true;

    try {
      await this.authService.register(normalizedEmail, this.registerPassword);
      this.registerMessage = 'Sikeres regisztráció.';
      this.registerEmail = normalizedEmail;
      this.customerEmail = normalizedEmail;
      this.authEmail = normalizedEmail;
      this.toastService.success('Sikeres regisztráció');
      this.closeRegisterModal();
    } catch {
      this.registerError = 'A regisztráció nem sikerült.';
      this.toastService.error('Regisztráció sikertelen', this.registerError);
    } finally {
      this.registerLoading = false;
    }
  }

  async finalizeOrder(): Promise<void> {
    // Checkout fő folyamat:
    // 1) validáció, 2) rendelés mentés, 3) user/customer profile update, 4) success oldal.
    // Spark Firebase csomagon nincs Cloud Functions deploy, ezért az email visszaigazolás
    // manuális mailto sablonként érhető el a sikeres rendelés és az admin rendelés nézetben.
    const items = this.cartService.getItems();

    this.orderMessage = '';
    this.orderError = '';
    this.orderValidationErrors = [];

    if (items.length === 0) {
      this.orderError = 'A rendeléshez legalább egy termék kell a kosárban.';
      this.toastService.error('Üres kosár', this.orderError);
      return;
    }

    const sanitized = this.getSanitizedForm();
    const validationErrors = this.validateOrderForm(sanitized);

    if (validationErrors.length > 0) {
      this.orderError = 'A rendelés nem küldhető el, javítsd a hibákat.';
      this.orderValidationErrors = validationErrors;
      this.toastService.error('Hibás adatok', this.orderError);
      return;
    }

    this.orderLoading = true;

    try {
      if (this.authService.isCurrentUserDisabled()) {
        this.orderError = 'A profilod le van tiltva, ezért rendelést nem lehet leadni.';
        this.toastService.error('Rendelés nem küldhető el', this.orderError);
        return;
      }

      const currentUser = this.authService.getUser();
      const shippingMethod = this.activeShippingMethod;
      const paymentMethod = this.activePaymentMethod;
      const pickupAt =
        shippingMethod.id === 'pickup'
          ? this.parsePickupDateTime(sanitized.pickupDateTime)
          : null;
      const subtotal = this.subtotal;
      const shippingFee = shippingMethod.fee;
      const paymentFee = paymentMethod.fee;
      const coupon = this.coupon;
      const discount = this.discount;
      const total = Math.max(0, subtotal + shippingFee + paymentFee - discount);

      const orderRef = await this.orderService.addOrder({
        userId: currentUser?.uid,
        customerName: sanitized.customerName,
        customerEmail: sanitized.customerEmail,
        customerPhone: sanitized.customerPhone,
        shipping: {
          zip: sanitized.shippingZip,
          city: sanitized.shippingCity,
          address: sanitized.shippingAddress
        },
        shippingMethod: {
          id: shippingMethod.id,
          label: shippingMethod.label,
          fee: shippingFee,
          eta: shippingMethod.eta
        },
        billing: {
          sameAsShipping: this.billingSameAsShipping,
          name: this.billingSameAsShipping ? sanitized.customerName : sanitized.billingName,
          zip: this.billingSameAsShipping ? sanitized.shippingZip : sanitized.billingZip,
          city: this.billingSameAsShipping ? sanitized.shippingCity : sanitized.billingCity,
          address: this.billingSameAsShipping ? sanitized.shippingAddress : sanitized.billingAddress
        },
        paymentMethod: {
          id: paymentMethod.id,
          label: paymentMethod.label,
          fee: paymentFee
        },
        pickupAt: pickupAt || undefined,
        business: {
          isBusinessBuyer: this.isBusinessBuyer,
          companyName: this.isBusinessBuyer ? (sanitized.businessCompanyName || sanitized.customerName) : undefined,
          taxNumber: this.isBusinessBuyer ? sanitized.businessTaxNumber : undefined
        },
        salesChannel: 'web',
        appliedCoupon: coupon
          ? {
              code: coupon.code,
              description: coupon.description,
              discount: coupon.discount,
              type: coupon.type
            }
          : undefined,
        pricing: {
          subtotal,
          shippingFee,
          paymentFee,
          discount,
          total
        },
        couponCode: sanitized.couponCode,
        comment: sanitized.orderComment,
        items: items,
        total,
        status: 'uj'
      });

      const orderSummary: OrderSuccessSummary = {
        orderId: orderRef.id,
        customerName: sanitized.customerName,
        customerEmail: sanitized.customerEmail,
        customerPhone: sanitized.customerPhone,
        shippingMethodLabel: shippingMethod.label,
        paymentMethodLabel: paymentMethod.label,
        pickupAt: pickupAt || undefined,
        subtotal,
        shippingFee,
        paymentFee,
        discount,
        couponCode: coupon?.code,
        couponDescription: coupon?.description,
        total,
        items: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image
        }))
      };

      sessionStorage.setItem('lastOrderSummary', JSON.stringify(orderSummary));

      if (currentUser?.uid) {
        try {
          await this.userService.attachOrderToUser(currentUser.uid, orderRef.id);
        } catch (userOrderLinkError) {
          this.monitoringService.capture('checkout-user-order-link', userOrderLinkError, {
            orderId: orderRef.id,
            uid: currentUser.uid
          });
        }

        try {
          await this.customerDirectoryService.upsertProfileForUser(
            currentUser.uid,
            sanitized.customerEmail,
            {
              type: this.isBusinessBuyer ? 'company' : 'private',
              name: sanitized.customerName,
              phone: sanitized.customerPhone,
              companyName: this.isBusinessBuyer ? (sanitized.businessCompanyName || sanitized.customerName) : '',
              taxNumber: this.isBusinessBuyer ? sanitized.businessTaxNumber : ''
            }
          );
        } catch (profileError) {
          this.monitoringService.capture('checkout-customer-profile-upsert', profileError, {
            orderId: orderRef.id,
            email: sanitized.customerEmail,
            mode: 'user'
          });
        }
      } else {
        try {
          await this.customerDirectoryService.upsertGuestProfileByEmail({
            type: this.isBusinessBuyer ? 'company' : 'private',
            name: sanitized.customerName,
            email: sanitized.customerEmail,
            phone: sanitized.customerPhone,
            companyName: this.isBusinessBuyer ? (sanitized.businessCompanyName || sanitized.customerName) : '',
            taxNumber: this.isBusinessBuyer ? sanitized.businessTaxNumber : ''
          });
        } catch (guestProfileError) {
          this.monitoringService.capture('checkout-customer-profile-upsert', guestProfileError, {
            orderId: orderRef.id,
            email: sanitized.customerEmail,
            mode: 'guest'
          });
        }
      }

      this.orderMessage = 'Rendelés sikeresen elmentve a Firestore adatbázisba.';
      this.toastService.success('Rendelés sikeresen elküldve');
      this.cartService.clearCart();
      await this.router.navigate(['/order-success'], {
        queryParams: { orderId: orderRef.id }
      });
    } catch (error) {
      console.error(error);
      const code = getErrorCode(error);
      const fallback = code
        ? `A rendelés mentése nem sikerült (${code}).`
        : 'A rendelés mentése nem sikerült. Ellenőrizd a Firestore szabályokat.';
      this.orderError = normalizeErrorMessage(error, fallback);
      this.toastService.error('Rendelés mentése sikertelen', this.orderError);
    } finally {
      this.orderLoading = false;
    }
  }

  private getSanitizedForm() {
    // Minden input trimelve/normalizalva egy helyen.
    return {
      customerName: this.customerName.trim(),
      customerEmail: this.customerEmail.trim().toLowerCase(),
      customerPhone: this.customerPhone.trim(),
      businessCompanyName: this.businessCompanyName.trim(),
      businessTaxNumber: this.businessTaxNumber.trim(),
      shippingZip: this.shippingZip.trim(),
      shippingCity: this.shippingCity.trim(),
      shippingAddress: this.shippingAddress.trim(),
      billingName: this.billingName.trim(),
      billingZip: this.billingZip.trim(),
      billingCity: this.billingCity.trim(),
      billingAddress: this.billingAddress.trim(),
      couponCode: this.couponCode.trim().toUpperCase(),
      orderComment: this.orderComment.trim(),
      pickupDateTime: this.pickupDateTime.trim()
    };
  }

  private validateOrderForm(form: ReturnType<Checkout['getSanitizedForm']>): string[] {
    // Kliens oldali ellenőrzés az alap hibák kiszűréséhez.
    const errors: string[] = [];
    const zipPattern = /^\d{4}$/;
    const taxPattern = /^[\d-]{8,15}$/;

    if (!form.customerName) {
      errors.push('A teljes név megadása kötelező.');
    }

    if (!isValidEmail(form.customerEmail)) {
      errors.push('Adj meg érvényes email címet.');
    }

    if (!isValidPhone(form.customerPhone)) {
      errors.push('Adj meg érvényes telefonszámot (8-15 számjegy, pl. +36 30 123 4567).');
    }

    if (this.isBusinessBuyer) {
      if (!form.businessTaxNumber || !taxPattern.test(form.businessTaxNumber)) {
        errors.push('Céges vagy szerelői vásárlásnál érvényes adószám kötelező.');
      }
    }

    if (!zipPattern.test(form.shippingZip)) {
      errors.push('A szállítási irányítószám 4 számjegy legyen.');
    }

    if (!form.shippingCity) {
      errors.push('A szállítási város megadása kötelező.');
    }

    if (form.shippingAddress.length < 5) {
      errors.push('A szállítási cím túl rövid.');
    }

    if (!this.shippingMethods.some(method => method.id === this.selectedShippingMethod)) {
      errors.push('Válassz szállítási módot.');
    }

    if (this.selectedShippingMethod === 'pickup') {
      const pickupAt = this.parsePickupDateTime(form.pickupDateTime);

      if (!pickupAt) {
        errors.push('Személyes átvételnél add meg az átvétel időpontját.');
      } else if (pickupAt < Date.now()) {
        errors.push('Az átvételi időpont nem lehet a múltban.');
      }
    }

    if (!this.paymentMethods.some(method => method.id === this.selectedPaymentMethod)) {
      errors.push('Válassz fizetési módot.');
    }

    if (this.coupon && !this.coupon.valid) {
      errors.push(this.coupon.reason || 'A kuponkód nem érvényes.');
    }

    if (!this.billingSameAsShipping) {
      if (!form.billingName) {
        errors.push('Külön számlázási címnél a számlázási név kötelező.');
      }

      if (!zipPattern.test(form.billingZip)) {
        errors.push('A számlázási irányítószám 4 számjegy legyen.');
      }

      if (!form.billingCity) {
        errors.push('A számlázási város megadása kötelező.');
      }

      if (form.billingAddress.length < 5) {
        errors.push('A számlázási cím túl rövid.');
      }
    }

    return errors;
  }

  get subtotal(): number {
    return this.cartService.getTotal();
  }

  get activeShippingMethod() {
    return this.shippingMethods.find(method => method.id === this.selectedShippingMethod) || this.shippingMethods[0];
  }

  get activePaymentMethod() {
    return this.paymentMethods.find(method => method.id === this.selectedPaymentMethod) || this.paymentMethods[0];
  }

  get shippingFee(): number {
    return this.activeShippingMethod.fee;
  }

  get paymentFee(): number {
    return this.activePaymentMethod.fee;
  }

  get discount(): number {
    return (this.coupon?.discount || 0) + this.businessBuyerDiscount;
  }

  get businessBuyerDiscount(): number {
    if (!this.isBusinessBuyer) {
      return 0;
    }

    return Math.round(this.subtotal * 0.1);
  }

  get grandTotal(): number {
    return Math.max(0, this.subtotal + this.shippingFee + this.paymentFee - this.discount);
  }

  get coupon(): CouponEvaluation | null {
    // Kupon ertekeles a jelenlegi kosar osszegen.
    const code = this.couponCode.trim().toUpperCase();
    if (!code) {
      return null;
    }

    const definition = this.couponDefinitions.find(item => item.code === code);
    if (!definition) {
      return {
        valid: false,
        code,
        description: '',
        type: 'fixed',
        discount: 0,
        reason: 'Érvénytelen kuponkód.'
      };
    }

    if (this.subtotal < definition.minSubtotal) {
      return {
        valid: false,
        code,
        description: definition.description,
        type: definition.type,
        discount: 0,
        reason: `A kupon legalább ${definition.minSubtotal} Ft részösszegnél érvényes.`
      };
    }

    const discount = this.calculateCouponDiscount(definition, this.subtotal, this.shippingFee);

    return {
      valid: true,
      code,
      description: definition.description,
      type: definition.type,
      discount
    };
  }

  private calculateCouponDiscount(
    definition: CouponDefinition,
    subtotal: number,
    shippingFee: number
  ): number {
    if (definition.type === 'percent') {
      return Math.max(0, Math.round((subtotal * definition.value) / 100));
    }

    if (definition.type === 'shipping') {
      return Math.max(0, shippingFee);
    }

    return Math.max(0, Math.min(definition.value, subtotal));
  }

  private parsePickupDateTime(value: string): number | null {
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
}

