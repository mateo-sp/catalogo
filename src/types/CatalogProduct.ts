export interface CatalogProduct {
  id: string;
  nombre: string;
  marca: string;
  categoria: string;
  precio: number;
  descripcion?: string;
  imagenUrl?: string;
  visible: boolean;
  disponible: boolean;
  variantes?: string[];
  inventoryVariants?: {
    id: string;
    nombre: string;
    precio: number;
    disponible: boolean;
  }[];
  updatedAt?: number;
  inventorySource?: boolean;
}

export type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'brand-asc';
