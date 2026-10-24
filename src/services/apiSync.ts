import { Brand, CatalogData, Product, StoreConfig } from '../types/catalog';
import { DEFAULT_BRANDS, DEFAULT_CONFIG, DEFAULT_PRODUCTS } from '../data/defaultCatalog';
import geekBarImage from '../assets/images/brand_geekbar_1792848921401.jpg';

const STORAGE_KEYS = {
  BRANDS: 'vapestore_brands_v1',
  PRODUCTS: 'vapestore_products_v1',
  CONFIG: 'vapestore_config_v1',
};

export const apiSyncService = {
  // Load configuration
  getConfig(): StoreConfig {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CONFIG);
      if (stored) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error('Error reading config from localStorage', e);
    }
    return DEFAULT_CONFIG;
  },

  // Save configuration
  saveConfig(config: StoreConfig): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
    } catch (e) {
      console.error('Error saving config', e);
    }
  },

  // Load brands
  getBrands(): Brand[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BRANDS);
      if (stored) {
        const parsed: Brand[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error reading brands from localStorage', e);
    }
    return DEFAULT_BRANDS;
  },

  // Load products
  getProducts(): Product[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (stored) {
        const parsed: Product[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error reading products from localStorage', e);
    }
    return DEFAULT_PRODUCTS;
  },

  // Save local catalog data
  saveCatalog(brands: Brand[], products: Product[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(brands));
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Error saving catalog to storage', e);
    }
  },

  // Reset to default initial database
  resetToDefault(): { brands: Brand[]; products: Product[] } {
    try {
      localStorage.removeItem(STORAGE_KEYS.BRANDS);
      localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    } catch (e) {
      console.error('Error clearing catalog storage', e);
    }
    return { brands: DEFAULT_BRANDS, products: DEFAULT_PRODUCTS };
  },

  // Sync from remote API / database URL
  async fetchRemoteCatalog(url: string, headers?: Record<string, string>): Promise<CatalogData> {
    if (!url || !url.startsWith('http')) {
      throw new Error('Por favor ingresa una URL válida (http:// o https://)');
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Error al conectar con la API: Código de respuesta ${response.status} (${response.statusText})`);
    }

    const data = await response.json();

    // Support both direct { brands, products } or array of products
    let fetchedBrands: Brand[] = [];
    let fetchedProducts: Product[] = [];

    if (data && typeof data === 'object') {
      if (Array.isArray(data.brands)) {
        fetchedBrands = data.brands;
      }
      if (Array.isArray(data.products)) {
        fetchedProducts = data.products;
      } else if (Array.isArray(data)) {
        // If data is just a list of products
        fetchedProducts = data;
      }
    }

    if (fetchedProducts.length === 0 && fetchedBrands.length === 0) {
      throw new Error('La respuesta de la API no contiene listas reconocibles de "brands" o "products".');
    }

    // Auto-generate missing brands from products if needed
    if (fetchedBrands.length === 0 && fetchedProducts.length > 0) {
      const brandIds = Array.from(new Set(fetchedProducts.map(p => p.brandId || 'general')));
      fetchedBrands = brandIds.map(id => ({
        id,
        name: id.toUpperCase().replace('-', ' '),
        logo: geekBarImage,
        description: `Productos oficiales de la marca ${id}`,
      }));
    }

    return {
      brands: fetchedBrands.length > 0 ? fetchedBrands : DEFAULT_BRANDS,
      products: fetchedProducts,
      version: new Date().toISOString(),
    };
  },

  // Parse JSON string directly from user paste/upload
  parseImportedJson(jsonText: string): CatalogData {
    const parsed = JSON.parse(jsonText);
    let brands: Brand[] = [];
    let products: Product[] = [];

    if (Array.isArray(parsed)) {
      products = parsed;
    } else if (parsed && typeof parsed === 'object') {
      brands = Array.isArray(parsed.brands) ? parsed.brands : [];
      products = Array.isArray(parsed.products) ? parsed.products : [];
    }

    if (products.length === 0 && brands.length === 0) {
      throw new Error('El JSON proporcionado no contiene marcas ni productos válidos.');
    }

    if (brands.length === 0 && products.length > 0) {
      const brandIds = Array.from(new Set(products.map(p => p.brandId || 'general')));
      brands = brandIds.map(id => ({
        id,
        name: id.toUpperCase().replace('-', ' '),
        logo: geekBarImage,
        description: `Catálogo de productos ${id}`,
      }));
    }

    return {
      brands: brands.length > 0 ? brands : DEFAULT_BRANDS,
      products,
    };
  }
};
