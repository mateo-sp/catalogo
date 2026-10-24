import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { Brand, Product } from '../types/catalog';

// Firebase configuration from user's ventas-de-vapers project
export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCTXLlXJ0QyeiNtQf7e_cyJNcUxxGqWdcw",
  authDomain: "ventas-de-vapers.firebaseapp.com",
  projectId: "ventas-de-vapers",
  storageBucket: "ventas-de-vapers.firebasestorage.app",
  messagingSenderId: "118823441088",
  appId: "1:118823441088:web:ventas-de-vapers"
};

const app = !getApps().length ? initializeApp(FIREBASE_CONFIG) : getApp();
export const db = getFirestore(app);

export const firebaseService = {
  getProjectId(): string {
    return FIREBASE_CONFIG.projectId;
  },

  // Test Firestore connectivity
  async testConnection(): Promise<boolean> {
    try {
      await getDocs(collection(db, 'brands'));
      return true;
    } catch (e: any) {
      console.warn('Firebase test connection:', e.message);
      // Even if collection is empty, if it didn't throw network error, return true
      return !e.message?.includes('offline');
    }
  },

  // Fetch catalog from Firebase Firestore
  async fetchCatalogFromFirestore(): Promise<{ brands: Brand[]; products: Product[] } | null> {
    try {
      const brandsCol = collection(db, 'brands');
      const productsCol = collection(db, 'products');

      const [brandsSnap, productsSnap] = await Promise.all([
        getDocs(brandsCol),
        getDocs(productsCol)
      ]);

      const brands: Brand[] = [];
      brandsSnap.forEach((docSnap) => {
        const data = docSnap.data();
        brands.push({
          id: docSnap.id,
          name: data.name || docSnap.id,
          logo: data.logo || '',
          description: data.description || '',
          origin: data.origin,
          featured: data.featured,
        });
      });

      const products: Product[] = [];
      productsSnap.forEach((docSnap) => {
        const data = docSnap.data();
        products.push({
          id: docSnap.id,
          brandId: data.brandId || '',
          name: data.name || '',
          category: data.category || 'disposable',
          categoryLabel: data.categoryLabel || 'Desechable',
          price: Number(data.price) || 0,
          wholesalePrice: data.wholesalePrice ? Number(data.wholesalePrice) : undefined,
          description: data.description || '',
          puffs: data.puffs ? Number(data.puffs) : undefined,
          nicotine: data.nicotine,
          liquidCapacity: data.liquidCapacity,
          battery: data.battery,
          resistance: data.resistance,
          flavors: Array.isArray(data.flavors) ? data.flavors : [],
          inStock: data.inStock !== false,
        });
      });

      if (brands.length === 0 && products.length === 0) {
        return null; // Empty database, can be seeded
      }

      return { brands, products };
    } catch (error) {
      console.error('Error fetching from Firestore:', error);
      throw error;
    }
  },

  // Upload/seed local catalog into Firebase Firestore
  async seedCatalogToFirestore(brands: Brand[], products: Product[]): Promise<void> {
    try {
      for (const brand of brands) {
        await setDoc(doc(db, 'brands', brand.id), {
          name: brand.name,
          logo: brand.logo,
          description: brand.description,
          origin: brand.origin || '',
          featured: brand.featured || false,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }

      for (const prod of products) {
        await setDoc(doc(db, 'products', prod.id), {
          brandId: prod.brandId,
          name: prod.name,
          category: prod.category,
          categoryLabel: prod.categoryLabel,
          price: prod.price,
          wholesalePrice: prod.wholesalePrice || null,
          description: prod.description,
          puffs: prod.puffs || null,
          nicotine: prod.nicotine || '',
          liquidCapacity: prod.liquidCapacity || '',
          battery: prod.battery || '',
          resistance: prod.resistance || '',
          flavors: prod.flavors,
          inStock: prod.inStock,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }
    } catch (error) {
      console.error('Error writing catalog to Firestore:', error);
      throw error;
    }
  }
};
