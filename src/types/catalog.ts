export type ProductCategory = 'disposable' | 'pod_system' | 'mod' | 'eliquid' | 'coil' | 'all';

export interface Brand {
  id: string;
  name: string;
  logo: string;
  description: string;
  origin?: string;
  featured?: boolean;
  productCount?: number;
}

export interface Product {
  id: string;
  brandId: string;
  name: string;
  category: 'disposable' | 'pod_system' | 'mod' | 'eliquid' | 'coil';
  categoryLabel: string;
  price: number;
  wholesalePrice?: number;
  description: string;
  puffs?: number;
  nicotine?: string;
  liquidCapacity?: string;
  battery?: string;
  resistance?: string;
  flavors: string[];
  inStock: boolean;
}

export interface CartItem {
  id: string; // Composite unique key: productId + flavor
  productId: string;
  productName: string;
  brandName: string;
  selectedFlavor: string;
  unitPrice: number;
  quantity: number;
}

export interface StoreConfig {
  storeName: string;
  whatsappNumber: string;
  currencySymbol: string;
  remoteApiUrl: string;
  lastSync?: string;
}

export interface CatalogData {
  brands: Brand[];
  products: Product[];
  version?: string;
}
