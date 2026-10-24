import React, { useEffect, useState } from 'react';
import { CatalogProduct } from '../types/CatalogProduct';
import { VariantList } from './VariantList';
import { X, Flame, MessageCircle, Send, Check } from 'lucide-react';

interface ProductModalProps {
  product: CatalogProduct | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const [imageError, setImageError] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  // Sync selected variant when product changes
  useEffect(() => {
    if (product && product.variantes && product.variantes.length > 0) {
      setSelectedVariant(product.variantes[0]);
    } else {
      setSelectedVariant(null);
    }
  }, [product]);

  // Close on Escape key press in desktop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (product) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [product, onClose]);

  if (!product) return null;

  const formattedPrice =
    typeof product.precio === 'number'
      ? product.precio % 1 === 0
        ? `$${product.precio.toLocaleString('es-AR')}`
        : `$${product.precio.toFixed(2)}`
      : `$${product.precio}`;

  // Direct order via WhatsApp
  const handleMakeOrder = async () => {
    let orderText = `🛒 *HOLA supposhop! Quiero consultar / hacer un pedido:*\n\n`;
    orderText += `• *Modelo:* ${product.marca} - ${product.nombre}\n`;
    if (selectedVariant) {
      orderText += `• *Sabor / Variante:* ${selectedVariant}\n`;
    }
    orderText += `• *Precio:* ${formattedPrice}\n`;
    orderText += `• *Disponibilidad:* ${product.disponible ? 'Disponible' : 'Consultar stock'}\n\n`;
    orderText += `¿Tienen stock disponible para coordinar la entrega?`;

    // Try Web Share API on mobile devices first
    if (navigator.share && /mobile|android|iphone|ipad/i.test(navigator.userAgent)) {
      try {
        await navigator.share({
          title: `Pedido en supposhop - ${product.nombre}`,
          text: orderText,
        });
        return;
      } catch (err) {
        // Fallback to WhatsApp URL
      }
    }

    // Opens WhatsApp without hardcoded number so the customer can pick any contact/chat in their WhatsApp app!
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(orderText)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* Main Modal Backdrop & Window */}
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
        {/* Backdrop: click outside to close */}
        <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

        {/* Modal / Bottom Sheet Container */}
        <div className="relative w-full max-w-lg bg-zinc-950 sm:rounded-3xl rounded-t-3xl border border-zinc-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col z-10 animate-in slide-in-from-bottom duration-250">
          {/* Mobile Drag Handle */}
          <div className="pt-2.5 pb-1 sm:hidden">
            <div className="w-12 h-1.5 bg-zinc-700 rounded-full mx-auto" />
          </div>

          {/* Modal Top Bar */}
          <div className="px-5 py-3 border-b border-zinc-800/80 flex items-center justify-between gap-3 shrink-0">
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-violet-400 uppercase tracking-wider block truncate">
                {product.marca} · {product.categoria}
              </span>
              <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight truncate">
                {product.nombre}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-900 transition-colors -mr-2"
              aria-label="Cerrar ventana"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="px-5 py-4 overflow-y-auto space-y-4 flex-1 overscroll-contain pb-24 sm:pb-20">
            {/* Main Product Single Image Container (1 image per model, no duplicate images!) */}
            <div className="w-full aspect-video sm:aspect-square sm:max-h-72 rounded-2xl bg-zinc-950 border border-zinc-800/80 overflow-hidden relative shadow-inner">
              {(!product.imagenUrl || imageError) ? (
                <div className="w-full h-full bg-gradient-to-br from-zinc-850 to-zinc-950 flex flex-col items-center justify-center p-4 text-center">
                  <Flame className="w-10 h-10 text-violet-400 mb-2" />
                  <span className="text-sm font-bold text-white uppercase tracking-wider">
                    {product.marca}
                  </span>
                  <span className="text-xs text-zinc-400">{product.nombre}</span>
                </div>
              ) : (
                <img
                  src={product.imagenUrl}
                  alt={`${product.nombre} - ${product.marca}`}
                  loading="lazy"
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover"
                />
              )}

              {/* Availability Floating Badge */}
              <div className="absolute top-3 left-3">
                {product.disponible ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/85 text-emerald-300 border border-emerald-700/60 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Disponible en tienda
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-950/85 text-red-300 border border-red-700/60 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    Actualmente no disponible
                  </span>
                )}
              </div>
            </div>

            {/* Price Banner */}
            <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-zinc-400 block font-medium">Precio al público</span>
                <span className="font-mono text-2xl font-black text-emerald-400 tracking-tight">
                  {formattedPrice}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-zinc-300 font-semibold block">{product.categoria}</span>
                <span className="text-[11px] text-zinc-500 font-mono">1 imagen / modelo</span>
              </div>
            </div>

            {/* Description */}
            {product.descripcion && (
              <div>
                <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Descripción
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed bg-zinc-900/40 p-3.5 rounded-2xl border border-zinc-800/60">
                  {product.descripcion}
                </p>
              </div>
            )}

            {/* Variants List (Text Only) */}
            <VariantList
              variantes={product.variantes}
              selectedVariant={selectedVariant}
              onSelectVariant={(variant) => setSelectedVariant(variant)}
            />
          </div>

          {/* Modal Action Footer */}
          <div className="p-3.5 bg-zinc-950 border-t border-zinc-800/80 shrink-0 flex items-center justify-between gap-3">
            <span className="text-xs text-zinc-400 truncate">
              {product.nombre} {selectedVariant ? `(${selectedVariant})` : ''}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="min-h-[40px] px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 active:scale-95 text-white font-semibold text-xs border border-zinc-700/80 transition-all ml-auto shrink-0"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>

      {/* Floating Action Button "Hacer pedido" (in bottom-right corner when product is selected) */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[60] animate-in zoom-in-95 duration-200">
        <button
          onClick={handleMakeOrder}
          className="group min-h-[50px] px-5 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-95 text-white font-extrabold text-sm sm:text-base flex items-center gap-2.5 shadow-2xl shadow-emerald-950/90 border border-emerald-300/40 hover:border-emerald-200 transition-all"
          title="Hacer pedido de este producto por WhatsApp"
        >
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <MessageCircle className="w-4 h-4 fill-current text-white" />
          </div>
          <span className="tracking-tight">Hacer pedido</span>
        </button>
      </div>
    </>
  );
};
