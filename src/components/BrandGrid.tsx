import React from 'react';
import { Brand, Product, ProductCategory } from '../types/catalog';
import { ChevronRight, Layers, Flame } from 'lucide-react';

interface BrandGridProps {
  brands: Brand[];
  products: Product[];
  selectedCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
  onSelectBrand: (brandId: string) => void;
}

const CATEGORIES: { id: ProductCategory; label: string }[] = [
  { id: 'all', label: 'Todas las Marcas' },
  { id: 'disposable', label: 'Desechables' },
  { id: 'pod_system', label: 'Pod Systems' },
  { id: 'mod', label: 'Mods' },
  { id: 'eliquid', label: 'E-Liquids & Coils' },
];

export const BrandGrid: React.FC<BrandGridProps> = ({
  brands,
  products,
  selectedCategory,
  onSelectCategory,
  onSelectBrand,
}) => {
  // Filter brands based on category if products exist
  const filteredBrands = brands.filter((brand) => {
    if (selectedCategory === 'all') return true;
    const brandProducts = products.filter((p) => p.brandId === brand.id);
    if (selectedCategory === 'eliquid') {
      return brandProducts.some((p) => p.category === 'eliquid' || p.category === 'coil');
    }
    return brandProducts.some((p) => p.category === selectedCategory);
  });

  return (
    <div className="space-y-4">
      {/* Category Filter Pills (Functional Buttons) */}
      <div className="overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none flex items-center gap-1.5">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
                isActive
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Section Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            Marcas Oficiales
            <span className="text-xs font-normal text-zinc-400 font-mono-numbers">
              ({filteredBrands.length})
            </span>
          </h2>
          <p className="text-xs text-zinc-400">
            Toca una marca para ver todos sus modelos y sabores disponibles
          </p>
        </div>
      </div>

      {/* 2-Column Mobile Touch Grid with Brand Images */}
      {filteredBrands.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
          <p className="text-sm text-zinc-400">No se encontraron marcas en esta categoría.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {filteredBrands.map((brand) => {
            const brandProductCount = products.filter((p) => p.brandId === brand.id).length;

            return (
              <button
                key={brand.id}
                onClick={() => onSelectBrand(brand.id)}
                className="group flex flex-col text-left rounded-2xl bg-zinc-900/90 border border-zinc-800/80 hover:border-violet-500/50 p-2.5 sm:p-3 transition-all duration-200 active:scale-[0.98] shadow-sm hover:shadow-lg hover:shadow-violet-950/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 overflow-hidden relative"
              >
                {/* Brand Visual Image Container */}
                <div className="w-full aspect-square rounded-xl bg-zinc-950 overflow-hidden relative border border-zinc-800/60 group-hover:border-zinc-700 transition-colors">
                  <img
                    src={brand.logo}
                    alt={`Logo oficial de la marca ${brand.name}`}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      // Fallback if image path fails
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  {/* Styled CSS fallback container */}
                  <div
                    style={{ display: 'none' }}
                    className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-950 flex flex-col items-center justify-center p-2 text-center"
                  >
                    <Flame className="w-8 h-8 text-violet-400 mb-1" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      {brand.name}
                    </span>
                  </div>

                  {/* Top-Right Badge: Number of Products */}
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-zinc-950/80 backdrop-blur-md border border-zinc-800 text-[11px] font-mono-numbers font-medium text-zinc-300 flex items-center gap-1 shadow-sm">
                    <Layers className="w-3 h-3 text-violet-400" />
                    {brandProductCount}
                  </div>
                </div>

                {/* Brand Details */}
                <div className="mt-2.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-bold text-sm sm:text-base text-zinc-100 group-hover:text-violet-300 transition-colors truncate">
                        {brand.name}
                      </h3>
                      <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                    {brand.description && (
                      <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                        {brand.description}
                      </p>
                    )}
                  </div>

                  {/* Unboxed Metadata Footer */}
                  <div className="mt-2 pt-2 border-t border-zinc-800/60 flex items-center gap-1.5 text-[11px] text-zinc-400 font-medium">
                    <span>{brandProductCount} modelos</span>
                    <span aria-hidden="true" className="text-zinc-600">·</span>
                    <span className="text-violet-400">Ver lista</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
