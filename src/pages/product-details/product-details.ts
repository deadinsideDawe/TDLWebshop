import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CartService } from '../../app/services/cart.service';
import { ProductService } from '../../app/services/product.service';
import { WishlistService } from '../../app/services/wishlist.service';
import { Product } from '../../app/models/product.model';

interface ProductDetailsView {
  id: number;
  key?: string;
  firestoreId?: string;
  name: string;
  price: number;
  image: string;
  images: string[];
  stock: string;
  stockQuantity: number;
  category: string;
  shortDescription: string;
  description: string;
  sku: string;
  brand: string;
}

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-details.html',
  styleUrls: ['./product-details.css']
})
export class ProductDetails implements OnInit {
  // Termék adatlap állapot.
  loading = true;
  error = '';
  product: ProductDetailsView | null = null;
  selectedImage = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (!productId) {
      this.loading = false;
      this.error = 'Hiányzó termék azonosító.';
      return;
    }

    void this.loadProduct(productId);
  }

  async loadProduct(productId: string): Promise<void> {
    this.loading = true;
    this.error = '';

    try {
      const product = await this.productService.getProductById(productId);
      if (!product) {
        this.error = 'A termék nem található.';
        this.loading = false;
        return;
      }

      // Firestore model -> UI nezet modell.
      this.product = this.mapProduct(product);
      this.selectedImage = this.product.images[0];
    } catch {
      this.error = 'A termék betöltése nem sikerült.';
    } finally {
      this.loading = false;
    }
  }

  addToCart(): void {
    if (!this.product || !this.canAddToCart) {
      return;
    }

    this.cartService.addToCart(this.product);
  }

  toggleWishlist(): void {
    if (!this.product) {
      return;
    }

    this.wishlistService.toggleWishlist({
      id: this.product.id,
      key: this.product.key,
      firestoreId: this.product.firestoreId,
      name: this.product.name,
      sku: this.product.sku,
      category: this.product.category,
      price: this.product.price,
      image: this.product.image,
      stock: this.product.stock,
      stockQuantity: this.product.stockQuantity,
      shortDescription: this.product.shortDescription
    });
  }

  get isWishlisted(): boolean {
    return !!this.product && this.wishlistService.isInWishlist(this.product);
  }

  selectImage(image: string): void {
    this.selectedImage = image;
  }

  get canAddToCart(): boolean {
    if (!this.product) {
      return false;
    }

    if (this.product.stockQuantity <= 0) {
      return false;
    }

    return !this.product.stock.toLowerCase().includes('nincs');
  }

  private mapProduct(product: Product): ProductDetailsView {
    const fallbackImages = this.getCategoryImages(product.category);
    const hasGallery = !!product.images?.length;
    const gallery = hasGallery ? product.images! : fallbackImages;
    const mainImage = product.image || gallery[0];

    return {
      id: Date.now(),
      key: product.id || product.sku || product.name,
      firestoreId: product.id,
      name: product.name,
      price: Number(product.price) || 0,
      image: mainImage,
      images: gallery,
      stock: product.stock || 'Készleten',
      stockQuantity: Number(product.stockQuantity) || 0,
      category: product.category || 'Egyeb',
      shortDescription: product.shortDescription || '',
      description: product.description || product.shortDescription || 'Ehhez a termékhez nincs részletes leírás.',
      sku: product.sku || '-',
      brand: product.brand || 'TDL Webshop'
    };
  }

  private getCategoryImages(category?: string): string[] {
    // Kategoria alapu fallback kepek, ha nincs teljes galeria.
    const normalized = (category || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '');

    if (normalized.includes('futes') || normalized.includes('padlofutes')) {
      return ['products/padlofutes-cso.jpg', 'products/radiator-szelep.jpg'];
    }

    if (normalized.includes('hutes') || normalized.includes('szello')) {
      return ['products/hvac-legcsatorna.jpg', 'products/radiator-szelep.jpg'];
    }

    if (normalized.includes('viz') || normalized.includes('szerelveny')) {
      return ['products/golyoscsap.jpg', 'products/radiator-szelep.jpg'];
    }

    return ['products/radiator-szelep.jpg', 'products/padlofutes-cso.jpg'];
  }
}

