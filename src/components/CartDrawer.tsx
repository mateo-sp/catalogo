import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, Plus, Minus, MessageCircle, ShoppingBag, ArrowRight, Check, Share2, ShieldCheck, Send } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onExploreCatalog: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onExploreCatalog,
}) => {
  const {
    items,
    updateQuantity,
    clearCart,
    totalItems,
    totalAmount,
    config,
    generateOrderText,
    generateWhatsAppUrl,
  } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  // Open WhatsApp contact selector or use Web Share API
  const handleOpenWhatsAppSelectContact = async () => {
    const message = generateOrderText(customerName, customerNotes);

    // If Web Share API is available on mobile, it allows picking WhatsApp directly
    if (navigator.share && /mobile|android|iphone|ipad/i.test(navigator.userAgent)) {
      try {
        await navigator.share({
          title: `Pedido en ${config.storeName}`,
          text: message,
        });
        return;
      } catch (err) {
        // User canceled or failed, fallback to direct whatsapp link
      }
    }

    // Opens WhatsApp without a preset number, triggering the "Enviar a..." contact picker
    const url = generateWhatsAppUrl(customerName, customerNotes, false);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSendToSpecificStore = () => {
    const url = generateWhatsAppUrl(customerName, customerNotes, true);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyMessage = () => {
    const message = generateOrderText(customerName, customerNotes);
    navigator.clipboard.writeText(message);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Drawer Container */}
      <div className="relative w-full max-w-lg bg-zinc-950 sm:rounded-3xl rounded-t-3xl border border-zinc-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col z-10 animate-in slide-in-from-bottom duration-250">
        {/* Mobile Drag Handle */}
        <div className="pt-2 pb-1 sm:hidden">
          <div className="w-12 h-1 bg-zinc-700 rounded-full mx-auto" />
        </div>

        {/* Header */}
        <div className="px-5 py-3.5 border-b border-zinc-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-white tracking-tight">
                Productos a Comprar
              </h2>
              <p className="text-[11px] text-zinc-400 font-mono-numbers">
                {totalItems} {totalItems === 1 ? 'producto seleccionado' : 'productos seleccionados'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-[11px] text-zinc-400 hover:text-red-400 px-2 py-1 transition-colors"
                title="Vaciar lista"
              >
                Vaciar
              </button>
            )}
            <button
              onClick={onClose}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-900 transition-colors"
              aria-label="Cerrar pedido"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="px-5 py-4 overflow-y-auto space-y-4 flex-1 overscroll-contain">
          {items.length === 0 ? (
            <div className="py-12 px-4 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-white text-base">
                No tienes productos seleccionados
              </h3>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">
                Selecciona la marca y el sabor que deseas para armar tu lista y enviarla directamente por WhatsApp.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onExploreCatalog();
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-all active:scale-95"
              >
                <span>Explorar marcas de vapers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <>
              {/* Privacy / Security Notice */}
              <div className="p-3 rounded-2xl bg-zinc-900/60 border border-emerald-900/40 flex items-start gap-2.5 text-xs text-zinc-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <strong className="text-emerald-400">Envío Seguro por WhatsApp:</strong> Al tocar el botón verde, se abrirá WhatsApp en tu celular para que selecciones a qué contacto enviarle tu pedido.
                </div>
              </div>

              {/* List of Selected Items */}
              <div className="space-y-2.5">
                {items.map((item) => {
                  const subtotal = (item.unitPrice * item.quantity).toFixed(2);

                  return (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 flex items-center justify-between gap-3"
                    >
                      {/* Product & Flavor Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                          {item.brandName && (
                            <span className="text-violet-400 font-bold uppercase tracking-wider">
                              {item.brandName}
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-sm text-zinc-100 truncate">
                          {item.productName}
                        </h4>
                        <div className="mt-1 flex items-center gap-1.5 text-xs">
                          <span className="text-zinc-400">Sabor:</span>
                          <span className="text-emerald-300 font-semibold bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-md truncate max-w-[170px]">
                            {item.selectedFlavor}
                          </span>
                        </div>
                        <div className="mt-1.5 text-xs text-zinc-400 font-mono-numbers">
                          {config.currencySymbol}{item.unitPrice.toFixed(2)} c/u
                        </div>
                      </div>

                      {/* Quantity Stepper & Subtotal */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="font-mono-numbers font-bold text-sm text-emerald-400">
                          {config.currencySymbol}{subtotal}
                        </span>

                        <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 rounded-xl p-0.5">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-lg hover:bg-zinc-800 text-zinc-300 flex items-center justify-center transition-colors active:scale-95"
                            aria-label="Restar 1"
                          >
                            {item.quantity === 1 ? (
                              <Trash2 className="w-3.5 h-3.5 text-red-400" />
                            ) : (
                              <Minus className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <span className="w-6 text-center font-mono-numbers text-xs font-bold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-lg hover:bg-zinc-800 text-zinc-300 flex items-center justify-center transition-colors active:scale-95"
                            aria-label="Sumar 1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Customer Info Form */}
              <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
                <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Datos opcionales para el mensaje
                </h4>
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">
                    Tu nombre
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ej: Martín Gómez"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">
                    Dirección o aclaración
                  </label>
                  <input
                    type="text"
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    placeholder="Ej: Enviar a mi domicilio o retiro en persona"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Drawer Action Footer (Thumb Zone) */}
        {items.length > 0 && (
          <div className="p-4 bg-zinc-950 border-t border-zinc-800 shrink-0 space-y-2.5">
            {/* Total Row */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-zinc-400 block">Total a pagar:</span>
                <span className="text-[11px] text-zinc-400">
                  {totalItems} {totalItems === 1 ? 'producto' : 'productos'} para comprar
                </span>
              </div>
              <span className="font-mono-numbers text-2xl font-black text-emerald-400">
                {config.currencySymbol}{totalAmount.toFixed(2)}
              </span>
            </div>

            {/* Main Action: Send Order to WhatsApp Contact Selector */}
            <button
              onClick={handleOpenWhatsAppSelectContact}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.98] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Mandar a WhatsApp (Elegir contacto)</span>
            </button>

            {/* Direct Send to Store Number if available */}
            {config.whatsappNumber && (
              <button
                onClick={handleSendToSpecificStore}
                className="w-full h-10 rounded-xl bg-zinc-900 hover:bg-zinc-800 active:scale-[0.98] text-xs font-semibold text-zinc-300 hover:text-white border border-zinc-800 flex items-center justify-center gap-1.5 transition-all"
              >
                <Send className="w-3.5 h-3.5 text-emerald-400" />
                <span>O enviar directo a la tienda ({config.whatsappNumber})</span>
              </button>
            )}

            {/* Copy text option */}
            <div className="flex justify-center pt-0.5">
              <button
                onClick={handleCopyMessage}
                className="text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors flex items-center gap-1 py-1"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">¡Texto del pedido copiado!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Copiar texto del pedido</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
