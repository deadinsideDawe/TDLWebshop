import { initializeApp } from 'firebase/app';
import { getFirestore, addDoc, collection, getDocs } from 'firebase/firestore';

function getRequiredEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const firebaseConfig = {
  apiKey: getRequiredEnv('FIREBASE_API_KEY'),
  authDomain: getRequiredEnv('FIREBASE_AUTH_DOMAIN'),
  projectId: getRequiredEnv('FIREBASE_PROJECT_ID'),
  storageBucket: getRequiredEnv('FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getRequiredEnv('FIREBASE_MESSAGING_SENDER_ID'),
  appId: getRequiredEnv('FIREBASE_APP_ID'),
  measurementId: process.env.FIREBASE_MEASUREMENT_ID?.trim() || undefined
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const productsCollection = collection(db, 'products');

const categoryAssets = {
  Futes: {
    image: 'products/radiator-szelep.jpg',
    brand: 'ThermoLine',
    names: [
      'Radiator termosztat fej',
      'Radiator visszatero szelep',
      'Fali termosztat digitalis',
      'Programozhato futesi termosztat',
      'Kazanhazi golyoscsap 3/4',
      'Radiator leereszto szelep',
      'Termosztatikus radiator szelep',
      'Radiator bekoto szett',
      'Futokori nyomasmero',
      'Futesi elzaro szelep 1/2',
      'Kazan biztonsagi szelep',
      'Oszto-gyujto futeshez'
    ]
  },
  Hutes: {
    image: 'products/hvac-legcsatorna.jpg',
    brand: 'CoolFlow',
    names: [
      'Kondenzviz elvezeto cso',
      'Klima rezcso 1/4',
      'Fan-coil csatlakozo szett',
      'Kondenzviz szivattyu mini',
      'Huto kor golyoscsap',
      'Split klima rezcso par',
      'Legcsatorna rezgescsillapito',
      'Fan-coil termosztatikus szelep',
      'Klima szerelo konzol par',
      'Hutesi szurobetet',
      'Nyomasallo flexibilis cso',
      'Hutesi gyorscsatlakozo szett'
    ]
  },
  Viz: {
    image: 'products/golyoscsap.jpg',
    brand: 'AquaPro',
    names: [
      'Bronz golyoscsap 1/2',
      'PPR csovezetek 20mm',
      'PPR konyok 20mm',
      'Nyomascsokkento szelep',
      'Ivoviz golyoscsap 3/4',
      'Sargarez csonakos szuro',
      'Viznyomasmero ora 0-10 bar',
      'Teflon tomitoszalag profi',
      'Vizlagyito bypass szett',
      'Visszacsapo szelep vizes korre',
      'PPR T-idom 20mm',
      'Vizes mini elzaro csap'
    ]
  },
  Szellozes: {
    image: 'products/hvac-legcsatorna.jpg',
    brand: 'Ventix',
    names: [
      'HVAC legcsatorna idom',
      'Legtechnikai T-idom',
      'Legtechnikai 90 fokos idom',
      'Legcsatorna egyenes elem 1m',
      'Legtechnikai atvezeto idom',
      'Anemosztat befuvo',
      'Visszacsapo lamellas zsalu',
      'Rugalmas legtechnikai cso 3m',
      'Mennyezeti elszivo racs',
      'Legeloszto doboz',
      'Hangcsillapito betet',
      'Szellozesi csatlakozo karima'
    ]
  },
  Szerelvenyek: {
    image: 'products/golyoscsap.jpg',
    brand: 'FixJoint',
    names: [
      'Menetes idom keszlet',
      'Y-szuro 3/4',
      'Visszacsapo szelep 1/2',
      'Csobefogo bilincs keszlet',
      'Menettomito zsinor',
      'Sargarez T-idom 1/2',
      'Sargarez szukito idom 3/4-1/2',
      'Automata legtelenito szelep',
      'Tolto-urito csap 1/2',
      'Szerviz golyoscsap mini',
      'Rogzito bilincs gumibetettel',
      'Menetes gyorscsatlakozo szett'
    ]
  },
  'Lakossagi megoldasok': {
    image: 'products/padlofutes-cso.jpg',
    brand: 'HomeHVAC',
    names: [
      'Padlofutes cso szett',
      'Padlofutes oszto-gyujto szett',
      'Padlofutes rogzitoful keszlet',
      'Lakossagi vizszuro patron',
      'Kompakt nyomasmero 1/4',
      'Radiator bekoto szett lakossagi',
      'Otthoni vizszuro haz 10',
      'Padlofutes termosztat szett',
      'Mosogep bekoto csomag',
      'Mini gepegesz indulokeszlet',
      'Lakossagi szerviz golyoscsap',
      'Otthoni futes karbantarto szett'
    ]
  }
};

function createProducts() {
  const products = [];
  const categoryIndex = {
    Futes: 'FUT',
    Hutes: 'HUT',
    Viz: 'VIZ',
    Szellozes: 'SZLZ',
    Szerelvenyek: 'SZER',
    'Lakossagi megoldasok': 'LAK'
  };

  Object.entries(categoryAssets).forEach(([category, cfg]) => {
    cfg.names.forEach((name, index) => {
      const seq = String(index + 1).padStart(3, '0');
      const basePrice = 1990 + (index * 700);
      const stockQuantity = 8 + ((index * 3) % 55);
      const isWeeklyDeal = index % 5 === 0;
      const isTopProduct = index % 4 === 0;

      products.push({
        name,
        price: basePrice,
        category,
        image: cfg.image,
        stock: stockQuantity <= 5 ? 'Szallithato' : 'Keszleten',
        stockQuantity,
        sku: `TDL-${categoryIndex[category]}-${seq}`,
        brand: cfg.brand,
        isWeeklyDeal,
        isTopProduct,
        shortDescription: `${name} - megbizhato epuletgepeszeti megoldas.`,
        description: `${name} termek szakdolgozati webshop katalogushoz, valos keszletkezelessel.`,
        images: [cfg.image]
      });
    });
  });

  return products;
}

function normalize(value) {
  return (value || '').toString().trim().toLowerCase();
}

const seedProducts = createProducts();

const existingSnapshot = await getDocs(productsCollection);
const existingSkuSet = new Set(
  existingSnapshot.docs
    .map(doc => normalize(doc.data()?.sku))
    .filter(Boolean)
);

const toInsert = seedProducts.filter(product => !existingSkuSet.has(normalize(product.sku)));

const insertedByCategory = {};
for (const product of toInsert) {
  await addDoc(productsCollection, {
    ...product,
    createdAt: Date.now()
  });

  insertedByCategory[product.category] = (insertedByCategory[product.category] || 0) + 1;
}

const finalSnapshot = await getDocs(productsCollection);
const finalByCategory = {};
for (const docItem of finalSnapshot.docs) {
  const category = docItem.data()?.category || 'Ismeretlen';
  finalByCategory[category] = (finalByCategory[category] || 0) + 1;
}

console.log(JSON.stringify({
  targetCatalogCount: seedProducts.length,
  insertedCount: toInsert.length,
  insertedByCategory,
  finalByCategory
}, null, 2));
