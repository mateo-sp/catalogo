import React, { useState } from 'react';
import { Product, Brand } from '../types/catalog';
import { X, Check, Zap, Battery, Wind, Droplets, ShoppingBag, Plus, Minus, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface ProductDetailModalProps {
  product: Product;
  brand?: Brand;
  onClose: () => void;
  onAddedToCart: (productName: string, flavor: string) => void;
  onOpenCartNow: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  brand,
  onClose,
  onAddedToCart,
  onOpenCartNow,
}) => {
  const { addItem, config } = useCart();
  const [selectedFlavor, setSelectedFlavor] = useState<string>(product.flavors[0] || 'Original');
  const [quantity, setQuantity] = useState<number>(1);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  const handleAddToCart = () => {
    addItem(product, selectedFlavor, quantity, brand?.name || '');
    onAddedToCart(product.name, selectedFlavor);
    setShowSuccessNotification(true);
    setTimeout(() => {
      setShowSuccessNotification(false);
    }, 2500);
  };

  const currentTotal = (product.price * quantity).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Sheet Container */}
      <div className="relative w-full max-w-lg bg-zinc-950 sm:rounded-3xl rounded-t-3xl border border-zinc-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col z-10 animate-in slide-in-from-bottom duration-250">
        {/* Mobile Drag Handle */}
        <div className="pt-2 pb-1 sm:hidden">
          <div className="w-12 h-1 bg-zinc-700 rounded-full mx-auto" />
        </div>

        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-zinc-800/80 flex items-start justify-between gap-3 shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="text-violet-400 font-bold uppercase tracking-wider">
                {brand?.name || 'Vape'}
              </span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span className="text-zinc-400">{product.categoryLabel}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight mt-0.5">
              {product.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-900 transition-colors -mr-2"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="px-5 py-4 overflow-y-auto space-y-5 flex-1 overscroll-contain">
          {/* Price & Availability Banner */}
          <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 flex items-center justify-between">
            <div>
              <span className="text-xs text-zinc-400 block font-medium">Precio Detallado</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-mono-numbers font-black text-emerald-400">
                  {config.currencySymbol}{product.price.toFixed(2)}
                </span>
                {product.wholesalePrice && (
                  <span className="text-xs text-zinc-400 line-through font-mono-numbers">
                    {config.currencySymbol}{(product.price * 1.15).toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Disponible
              </span>
              {product.wholesalePrice && (
                <span className="text-[11px] text-zinc-400 block mt-1">
                  Mayorista: {config.currencySymbol}{product.wholesalePrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
              Descripción del Producto
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/50">
              {product.description}
            </p>
          </div>

          {/* Technical Specifications Matrix */}
          <div>
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
              Ficha Técnica & Rendimiento
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {product.puffs && (
                <div className="p-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800 flex items-center gap-2.5">
                  <Wind className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-zinc-400 block">Capacidad Caladas</span>
                    <span className="font-mono-numbers font-bold text-zinc-200">
                      {product.puffs.toLocaleString()} Puffs
                    </span>
                  </div>
                </div>
              )}

              {product.nicotine && (
                <div className="p-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800 flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-zinc-400 block">Concentración</span>
                    <span className="font-semibold text-zinc-200">{product.nicotine}</span>
                  </div>
                </div>
              )}

              {product.battery && (
                <div className="p-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800 flex items-center gap-2.5">
                  <Battery className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-zinc-400 block">Batería & Carga</span>
                    <span className="font-semibold text-zinc-200 truncate block max-w-[120px]">
                      {product.battery}
                    </span>
                  </div>
                </div>
              )}

              {product.liquidCapacity && (
                <div className="p-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800 flex items-center gap-2.5">
                  <Droplets className="w-4 h-4 text-blue-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-zinc-400 block">Capacidad Líquido</span>
                    <span className="font-semibold text-zinc-200">{product.liquidCapacity}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Flavors Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Selecciona tu Sabor
              </h3>
              <span className="text-xs text-violet-400 font-medium">
                {product.flavors.length} disponibles
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {product.flavors.map((flavor) => {
                const isSelected = selectedFlavor === flavor;
                return (
                  <button
                    key={flavor}
                    onClick={() => setSelectedFlavor(flavor)}
                    className={`min-h-[44px] px-3 py-2.5 rounded-xl text-left text-xs font-medium transition-all flex items-center justify-between gap-2 border ${
                      isSelected
                        ? 'bg-violet-600/20 border-violet-500 text-white shadow-sm'
                        : 'bg-zinc-900/70 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white'
                    }`}
                  >
                    <span className="truncate">{flavor}</span>
                    {isSelected ? (
                      <span className="w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </span>
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-zinc-700 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Stepper */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
            <div>
              <span className="text-xs font-bold text-zinc-200 block">Cantidad a comprar</span>
              <span className="text-[11px] text-zinc-400">
                Sabor: <strong className="text-violet-300">{selectedFlavor}</strong>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center justify-center transition-colors active:scale-95 disabled:opacity-40"
                disabled={quantity <= 1}
                aria-label="Disminuir cantidad"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-mono-numbers text-lg font-bold text-white w-6 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center justify-center transition-colors active:scale-95"
                aria-label="Aumentar cantidad"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Action Footer (Thumb Zone) */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-800/80 shrink-0 space-y-2">
          {showSuccessNotification && (
            <div className="p-2.5 rounded-xl bg-emerald-950/90 border border-emerald-700/80 text-emerald-200 text-xs flex items-center justify-between gap-2 animate-in fade-in duration-150">
              <div className="flex items-center gap-1.5 truncate">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">
                  ¡Agregado para comprar! ({quantity}x {selectedFlavor})
                </span>
              </div>
              <button
                onClick={onOpenCartNow}
                className="font-bold underline text-white hover:text-emerald-300 shrink-0"
              >
                Ver pedido
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={handleAddToCart}
              className="flex-1 h-12 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 active:scale-[0.98] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-violet-600/30 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Agregar para comprar ({config.currencySymbol}{currentTotal})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
