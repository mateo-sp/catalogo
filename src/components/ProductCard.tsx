import React, { useState } from 'react';
import { CatalogProduct } from '../types/CatalogProduct';
import { Layers, Flame, ChevronRight } from 'lucide-react';

interface ProductCardProps {
  product: CatalogProduct;
  onClick: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formattedPrice =
    typeof product.precio === 'number'
      ? product.precio % 1 === 0
        ? `$${product.precio.toLocaleString('es-AR')}`
        : `$${product.precio.toFixed(2)}`
      : `$${product.precio}`;

  const variantCount = product.variantes?.length || 0;

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className="group relative flex flex-col rounded-2xl bg-zinc-900/90 border border-zinc-800/80 hover:border-violet-500/50 p-3 sm:p-3.5 transition-all duration-200 active:scale-[0.98] hover:shadow-xl hover:shadow-violet-950/20 cursor-pointer overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
    >
      {/* Product Image Container (Single image for the model) */}
      <div className="w-full aspect-square rounded-xl bg-zinc-950 overflow-hidden relative border border-zinc-800/60 group-hover:border-zinc-700/80 transition-colors">
        {/* Placeholder while image is loading */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-zinc-900 animate-pulse flex items-center justify-center">
            <Flame className="w-8 h-8 text-zinc-700 animate-pulse" />
          </div>
        )}

        {/* Fallback container if image fails or missing */}
        {(!product.imagenUrl || imageError) ? (
          <div className="w-full h-full bg-gradient-to-br from-zinc-850 via-zinc-900 to-zinc-950 flex flex-col items-center justify-center p-3 text-center">
            <Flame className="w-8 h-8 text-violet-400 mb-1" />
            <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider line-clamp-1">
              {product.marca}
            </span>
            <span className="text-[10px] text-zinc-500 line-clamp-1">
              {product.nombre}
            </span>
          </div>
        ) : (
          <img
            src={product.imagenUrl}
            alt={`${product.nombre} - ${product.marca}`}
            loading="lazy"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Availability Badge */}
        <div className="absolute top-2 left-2">
          {product.disponible ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/50 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Disponible
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-950/80 text-red-300 border border-red-800/50 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              Agotado
            </span>
          )}
        </div>

        {/* Number of Text Variants badge */}
        {variantCount > 0 && (
          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-zinc-950/85 backdrop-blur-md border border-zinc-800 text-[10px] font-mono text-zinc-300 flex items-center gap-1 shadow-sm">
            <Layers className="w-3 h-3 text-violet-400" />
            <span>{variantCount} {variantCount === 1 ? 'sabor' : 'sabores'}</span>
          </div>
        )}
      </div>

      {/* Product Details Section */}
      <div className="mt-3 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category quiet metadata */}
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mb-0.5">
            <span className="text-violet-400 font-bold uppercase tracking-wider truncate">
              {product.marca}
            </span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span className="truncate">{product.categoria}</span>
          </div>

          {/* Product Name */}
          <h3 className="font-bold text-sm sm:text-base text-zinc-100 group-hover:text-violet-300 transition-colors leading-snug line-clamp-2">
            {product.nombre}
          </h3>
        </div>

        {/* Card Footer: Price & Touch indicator */}
        <div className="mt-2.5 pt-2 border-t border-zinc-800/60 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-zinc-400 block font-medium">
              {product.inventoryVariants?.length ? 'Desde' : 'Precio'}
            </span>
            <span className="font-mono text-base sm:text-lg font-bold text-emerald-400">
              {formattedPrice}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-semibold text-violet-400 group-hover:text-violet-300 group-hover:translate-x-0.5 transition-all">
            <span>Ver sabores</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
