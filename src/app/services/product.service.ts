import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Firestore products collection referencia egy helyen.
  private productsCollection = collection(db, 'products');

  addProduct(product: Product) {
    // Minden termekhez rogzitjuk a letrehozas idopontjat is.
    const normalizedProduct = this.normalizeProductPayload(product);

    return addDoc(this.productsCollection, {
      ...normalizedProduct,
      createdAt: Date.now()
    });
  }

  updateProduct(productId: string, product: Partial<Product>) {
    const productRef = doc(db, 'products', productId);
    const normalizedProduct = this.normalizeProductPayload(product);
    return updateDoc(productRef, normalizedProduct);
  }

  deleteProduct(productId: string) {
    const productRef = doc(db, 'products', productId);
    return deleteDoc(productRef);
  }

  async deleteAllProducts(): Promise<number> {
    // Teljes products kollekció törlése admin "nulláról újratöltés" művelethez.
    const snapshot = await getDocs(this.productsCollection);

    if (snapshot.empty) {
      return 0;
    }

    await Promise.all(snapshot.docs.map(item => deleteDoc(doc(db, 'products', item.id))));
    return snapshot.size;
  }

  async importProductsBulk(
    products: Product[],
    mode: 'insert' | 'upsertBySku' = 'upsertBySku'
  ): Promise<{ created: number; updated: number; skipped: number }> {
    // CSV importhoz csoportos mentes: uj termekek vagy SKU szerinti frissites.
    const normalizedProducts = products
      .map(product => this.normalizeProductPayload(product))
      .filter(product =>
        !!product.name &&
        typeof product.price === 'number' &&
        !!product.category &&
        !!product.image
      );

    if (normalizedProducts.length === 0) {
      return { created: 0, updated: 0, skipped: products.length };
    }

    if (mode === 'insert') {
      await Promise.all(
        normalizedProducts.map(product =>
          addDoc(this.productsCollection, {
            ...product,
            createdAt: Date.now()
          })
        )
      );

      return {
        created: normalizedProducts.length,
        updated: 0,
        skipped: Math.max(0, products.length - normalizedProducts.length)
      };
    }

    const existingSnapshot = await getDocs(this.productsCollection);
    const skuToDocId = new Map<string, string>();

    for (const item of existingSnapshot.docs) {
      const sku = ((item.data() as Partial<Product>).sku || '').toString().trim().toLowerCase();
      if (sku) {
        skuToDocId.set(sku, item.id);
      }
    }

    let created = 0;
    let updated = 0;
    let skipped = Math.max(0, products.length - normalizedProducts.length);
    let batch = writeBatch(db);
    let opCount = 0;

    const commitBatch = async (force = false) => {
      // Firestore batch limit 500 művelet, ezért 450-nél biztonsági ráhagyással commitolunk.
      if (opCount >= 450 || (force && opCount > 0)) {
        await batch.commit();
        batch = writeBatch(db);
        opCount = 0;
      }
    };

    for (const product of normalizedProducts) {
      const skuKey = (product.sku || '').toString().trim().toLowerCase();

      if (!skuKey) {
        skipped += 1;
        continue;
      }

      const existingId = skuToDocId.get(skuKey);
      if (existingId) {
        const productRef = doc(db, 'products', existingId);
        batch.update(productRef, {
          ...product,
          updatedAt: Date.now()
        });
        updated += 1;
      } else {
        const productRef = doc(this.productsCollection);
        batch.set(productRef, {
          ...product,
          createdAt: Date.now()
        });
        created += 1;
        skuToDocId.set(skuKey, productRef.id);
      }

      opCount += 1;
      await commitBatch();
    }

    await commitBatch(true);

    return { created, updated, skipped };
  }

  getProductsStream(
    next: (products: Product[]) => void,
    error?: (err: unknown) => void
  ) {
    // Realtime stream az admin es a termekoldal szamara.
    const productsQuery = query(this.productsCollection, orderBy('createdAt', 'desc'));

    return onSnapshot(
      productsQuery,
      snapshot => {
        const products = snapshot.docs
          .map(item => {
            const data = item.data() as Omit<Product, 'id'> & { id?: unknown };
            return {
              ...data,
              id: item.id
            };
          })
          .map(product => this.normalizeProductPayload(product));

        next(products);
      },
      err => {
        if (error) {
          error(err);
        }
      }
    );
  }

  async getProductById(productId: string): Promise<Product | null> {
    const productRef = doc(db, 'products', productId);
    const snapshot = await getDoc(productRef);

    if (!snapshot.exists()) {
      return null;
    }

    return this.normalizeProductPayload({
      ...(snapshot.data() as Omit<Product, 'id'>),
      id: snapshot.id
    });
  }

  async seedProductsIfEmpty(products: Product[]): Promise<boolean> {
    // Kezdo katalogus feltoltese csak ures adatbazis eseten tortenik.
    const snapshot = await getDocs(query(this.productsCollection, limit(1)));
    if (!snapshot.empty) {
      return false;
    }

    await Promise.all(
      products.map(product =>
        addDoc(this.productsCollection, {
          ...this.normalizeProductPayload(product),
          createdAt: Date.now()
        })
      )
    );

    return true;
  }

  async seedMissingProductsBySku(products: Product[]): Promise<number> {
    const snapshot = await getDocs(this.productsCollection);
    const existingKeys = new Set(
      snapshot.docs
        .map(item => {
          const data = item.data() as Partial<Product>;
          return (data.sku || data.name || '').toString().trim().toLowerCase();
        })
        .filter(Boolean)
    );

    const missingProducts = products.filter(product => {
      const key = (product.sku || product.name || '').toString().trim().toLowerCase();
      return key !== '' && !existingKeys.has(key);
    });

    if (missingProducts.length === 0) {
      return 0;
    }

    await Promise.all(
      missingProducts.map(product =>
        addDoc(this.productsCollection, {
          ...this.normalizeProductPayload(product),
          createdAt: Date.now()
        })
      )
    );

    return missingProducts.length;
  }

  async normalizeExistingProductsText(): Promise<number> {
    const snapshot = await getDocs(this.productsCollection);
    const updates: Promise<void>[] = [];
    let changedCount = 0;

    for (const item of snapshot.docs) {
      const current = item.data() as Product;
      const normalized = this.normalizeProductPayload(current);
      const patch: Partial<Product> = {};
      const patchMap = patch as Record<string, unknown>;

      const fields: Array<keyof Product> = ['name', 'category', 'shortDescription', 'description', 'brand'];
      for (const field of fields) {
        const beforeValue = current[field];
        const afterValue = normalized[field];

        if (typeof beforeValue === 'string' && typeof afterValue === 'string' && beforeValue !== afterValue) {
          patchMap[field] = afterValue;
        }
      }

      if (Object.keys(patch).length > 0) {
        const productRef = doc(db, 'products', item.id);
        updates.push(updateDoc(productRef, patch));
        changedCount += 1;
      }
    }

    if (updates.length > 0) {
      await Promise.all(updates);
    }

    return changedCount;
  }

  private normalizeProductPayload<T extends Partial<Product>>(payload: T): T {
    const normalized = { ...payload } as T;

    if (typeof normalized.name === 'string') {
      normalized.name = this.normalizeHungarianText(normalized.name) as T['name'];
    }

    if (typeof normalized.category === 'string') {
      normalized.category = this.normalizeHungarianText(normalized.category) as T['category'];
    }

    if (typeof normalized.shortDescription === 'string') {
      normalized.shortDescription = this.normalizeHungarianText(normalized.shortDescription) as T['shortDescription'];
    }

    if (typeof normalized.description === 'string') {
      normalized.description = this.normalizeHungarianText(normalized.description) as T['description'];
    }

    if (typeof normalized.brand === 'string') {
      normalized.brand = this.normalizeHungarianText(normalized.brand) as T['brand'];
    }

    return normalized;
  }

  private normalizeHungarianText(text: string): string {
    let output = text;

    const replacements: Array<[string, string]> = [
      ['lakossagi', 'lakossági'],
      ['megoldasok', 'megoldások'],
      ['csovezetek', 'csővezeték'],
      ['tomitogyuru', 'tömítőgyűrű'],
      ['tomito', 'tömítő'],
      ['vizszuro', 'vízszűrő'],
      ['nyomasmero', 'nyomásmérő'],
      ['rendszernyomas', 'rendszernyomás'],
      ['csobefogo', 'csőbefogó'],
      ['csofogo', 'csőfogó'],
      ['menettomito', 'menettömítő'],
      ['eloszuresehez', 'előszűréséhez'],
      ['ellenorzesere', 'ellenőrzésére'],
      ['kulonbozo', 'különböző'],
      ['meretu', 'méretű'],
      ['szerelvenyek', 'szerelvények'],
      ['szerelveny', 'szerelvény'],
      ['futes', 'fűtés'],
      ['hutes', 'hűtés'],
      ['viz', 'víz'],
      ['szellozes', 'szellőzés'],
      ['keszlet', 'készlet'],
      ['rendeles', 'rendelés'],
      ['nyomas', 'nyomás'],
      ['sargarez', 'sárgaréz'],
      ['rezcso', 'rézcső'],
      ['cso', 'cső'],
      ['kategoria', 'kategória']
    ];

    for (const [source, target] of replacements) {
      const pattern = new RegExp(`\\b${source}\\b`, 'gi');
      output = output.replace(pattern, match => this.matchCase(match, target));
    }

    return output;
  }

  private matchCase(input: string, replacement: string): string {
    if (input.toUpperCase() === input) {
      return replacement.toUpperCase();
    }

    const firstChar = input.charAt(0);
    if (firstChar && firstChar.toUpperCase() === firstChar) {
      return replacement.charAt(0).toUpperCase() + replacement.slice(1);
    }

    return replacement;
  }
}
