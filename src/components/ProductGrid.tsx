import React from 'react';
import { CatalogProduct } from '../types/CatalogProduct';
import { ProductCard } from './ProductCard';
import { Search } from 'lucide-react';

interface ProductGridProps {
  products: CatalogProduct[];
  onSelectProduct: (product: CatalogProduct) => void;
  onClearFilters?: () => void;
  isFiltered?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onSelectProduct,
  onClearFilters,
  isFiltered,
}) => {
  if (products.length === 0) {
    return (
      <div className="py-16 px-4 text-center rounded-3xl bg-zinc-900/40 border border-zinc-800/80 space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
          <Search className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-white">
          {isFiltered
            ? 'No encontramos productos que coincidan con tu búsqueda.'
            : 'No hay productos disponibles.'}
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
          {isFiltered
            ? 'Prueba modificando las palabras clave o seleccionando otra categoría.'
            : 'Los productos se actualizarán en cuanto el administrador los agregue.'}
        </p>
        {isFiltered && onClearFilters && (
          <button
            onClick={onClearFilters}
            className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-all active:scale-95"
          >
            Ver todos los productos
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={() => onSelectProduct(product)}
        />
      ))}
    </div>
  );
};
