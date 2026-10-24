import React, { useState } from 'react';
import { Brand, Product, ProductCategory } from '../types/catalog';
import { ArrowLeft, Sparkles, Filter, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface BrandProductListProps {
  brand: Brand;
  products: Product[];
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  searchQuery?: string;
}

export const BrandProductList: React.FC<BrandProductListProps> = ({
  brand,
  products,
  onBack,
  onSelectProduct,
  searchQuery = '',
}) => {
  const { config } = useCart();
  const [filterType, setFilterType] = useState<ProductCategory>('all');

  // Filter products by selected brand and category
  const brandProducts = products.filter((p) => p.brandId === brand.id);

  const filteredProducts = brandProducts.filter((product) => {
    // Type filter
    if (filterType !== 'all') {
      if (filterType === 'eliquid' && (product.category === 'eliquid' || product.category === 'coil')) {
        // match
      } else if (product.category !== filterType) {
        return false;
      }
    }

    // Text search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchDesc = product.description.toLowerCase().includes(q);
      const matchFlavors = product.flavors.some((f) => f.toLowerCase().includes(q));
      return matchName || matchDesc || matchFlavors;
    }

    return true;
  });

  // Unique categories within this brand
  const availableCategories = Array.from(new Set(brandProducts.map((p) => p.category)));

  return (
    <div className="space-y-4">
      {/* Back Button & Brand Navigation */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="min-h-[44px] px-3 -ml-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-900 active:scale-95 flex items-center gap-1.5 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-violet-400" />
          <span>Todas las marcas</span>
        </button>

        <span className="text-xs font-mono-numbers text-zinc-400">
          {brandProducts.length} productos registrados
        </span>
      </div>

      {/* Brand Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800/80 p-4 relative overflow-hidden">
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-14 h-14 rounded-xl overflow-hidden border border-zinc-700/60 bg-zinc-950 shrink-0 shadow-md">
            <img
              src={brand.logo}
              alt={brand.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white tracking-tight truncate">
                {brand.name}
              </h1>
              {brand.featured && (
                <span className="text-[10px] uppercase font-bold tracking-wider text-violet-400 bg-violet-950/60 border border-violet-800/60 px-2 py-0.5 rounded-full">
                  Oficial
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 mt-0.5 line-clamp-2 leading-relaxed">
              {brand.description}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs by Product Type within Brand (if brand has multiple types) */}
      {availableCategories.length > 1 && (
        <div className="overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none flex items-center gap-1.5">
          <button
            onClick={() => setFilterType('all')}
            className={`min-h-[38px] px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              filterType === 'all'
                ? 'bg-zinc-100 text-zinc-950 font-bold shadow-sm'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Todos ({brandProducts.length})
          </button>
          {availableCategories.map((cat) => {
            const count = brandProducts.filter((p) => p.category === cat).length;
            const labels: Record<string, string> = {
              disposable: 'Desechables',
              pod_system: 'Pod Systems',
              mod: 'Mods Box',
              eliquid: 'Líquidos',
              coil: 'Repuestos',
            };
            return (
              <button
                key={cat}
                onClick={() => setFilterType(cat as ProductCategory)}
                className={`min-h-[38px] px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  filterType === cat
                    ? 'bg-violet-600 text-white font-bold shadow-md shadow-violet-600/25'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {labels[cat] || cat} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Notice of text-only high-density list per user requirements */}
      <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
        <span>Modelos disponibles de {brand.name}:</span>
        <span className="text-[11px] text-zinc-400">Toca para ver sabores y precio</span>
      </div>

      {/* High-Density Product List (WITHOUT images, purely focused on typography, specs and price) */}
      {filteredProducts.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
          <Filter className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
          <p className="text-sm text-zinc-300 font-medium">No hay productos que coincidan con la búsqueda.</p>
          <button
            onClick={() => setFilterType('all')}
            className="mt-3 text-xs text-violet-400 hover:underline"
          >
            Restablecer filtros
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredProducts.map((product) => {
            return (
              <button
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="w-full text-left rounded-2xl bg-zinc-900/90 hover:bg-zinc-900 border border-zinc-800/80 hover:border-violet-500/50 p-3.5 transition-all duration-150 active:scale-[0.99] group shadow-sm flex items-center justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
              >
                {/* Left: Product Information (Clean Typography, No Image) */}
                <div className="min-w-0 flex-1">
                  {/* Category & Status Line */}
                  <div className="flex items-center gap-2 text-[11px] text-zinc-400 mb-1">
                    <span className="text-violet-400 font-semibold tracking-wide">
                      {product.categoryLabel}
                    </span>
                    <span aria-hidden="true" className="text-zinc-600">·</span>
                    {product.puffs ? (
                      <span className="text-cyan-400 font-mono-numbers">
                        {product.puffs.toLocaleString()} puffs
                      </span>
                    ) : (
                      <span>{product.nicotine}</span>
                    )}
                  </div>

                  {/* Product Title */}
                  <h3 className="text-base font-bold text-zinc-100 group-hover:text-violet-300 transition-colors leading-snug">
                    {product.name}
                  </h3>

                  {/* Flavors Count & Key Specs Summary */}
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-400">
                    <span className="text-zinc-300">
                      {product.flavors.length} sabores disponibles
                    </span>
                    {product.battery && (
                      <>
                        <span aria-hidden="true" className="text-zinc-600">·</span>
                        <span className="truncate max-w-[150px]">{product.battery}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Right: Price & Selection Affordance */}
                <div className="flex flex-col items-end shrink-0 pl-2">
                  <span className="text-xs text-zinc-400 font-medium">Precio</span>
                  <span className="font-mono-numbers text-lg sm:text-xl font-bold text-emerald-400 tracking-tight">
                    {config.currencySymbol}{product.price.toFixed(2)}
                  </span>
                  
                  <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-violet-400 group-hover:text-violet-300 transition-colors">
                    <span>Ver detalle</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
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
