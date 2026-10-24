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
  updatedAt?: number;
}

export type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'brand-asc';
