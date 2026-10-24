import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Product, StoreConfig } from '../types/catalog';
import { apiSyncService } from '../services/apiSync';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, flavor: string, quantity?: number, brandName?: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
  config: StoreConfig;
  updateConfig: (newConfig: StoreConfig) => void;
  generateOrderText: (customerName?: string, notes?: string) => string;
  generateWhatsAppUrl: (customerName?: string, notes?: string, specificNumber?: boolean) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'vapestore_cart_items_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [config, setConfig] = useState<StoreConfig>(() => apiSyncService.getConfig());

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Error saving cart items', e);
    }
  }, [items]);

  const updateConfig = (newConfig: StoreConfig) => {
    setConfig(newConfig);
    apiSyncService.saveConfig(newConfig);
  };

  const addItem = (product: Product, flavor: string, quantity = 1, brandName = '') => {
    setItems((prevItems) => {
      const itemId = `${product.id}__${flavor.trim().toLowerCase()}`;
      const existingIndex = prevItems.findIndex((i) => i.id === itemId);

      if (existingIndex > -1) {
        const next = [...prevItems];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      }

      const newItem: CartItem = {
        id: itemId,
        productId: product.id,
        productName: product.name,
        brandName: brandName || '',
        selectedFlavor: flavor,
        unitPrice: product.price,
        quantity,
      };

      return [...prevItems, newItem];
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  const generateOrderText = (customerName = '', notes = ''): string => {
    let message = `🛒 *HOLA! Quiero realizar el siguiente pedido:*\n\n`;
    message += `📋 *PRODUCTOS SELECCIONADOS:*\n`;

    items.forEach((item) => {
      const subtotal = (item.unitPrice * item.quantity).toFixed(2);
      const brandStr = item.brandName ? `[${item.brandName}] ` : '';
      message += `• ${item.quantity}x ${brandStr}${item.productName}\n`;
      message += `   ↳ Sabor: *${item.selectedFlavor}*\n`;
      message += `   ↳ Subtotal: ${config.currencySymbol}${subtotal}\n\n`;
    });

    message += `💰 *TOTAL A PAGAR: ${config.currencySymbol}${totalAmount.toFixed(2)}*\n`;

    if (customerName.trim()) {
      message += `\n👤 *Cliente:* ${customerName.trim()}`;
    }
    if (notes.trim()) {
      message += `\n📝 *Notas / Envío:* ${notes.trim()}`;
    }

    message += `\n\n_¿Tienen disponibilidad de estos sabores para coordinar la entrega?_`;
    return message;
  };

  // If specificNumber is false, opens WhatsApp's contact picker so customer can select who to send to
  const generateWhatsAppUrl = (customerName = '', notes = '', specificNumber = false): string => {
    const message = generateOrderText(customerName, notes);
    const encoded = encodeURIComponent(message);

    if (specificNumber) {
      const rawNumber = config.whatsappNumber.replace(/\D/g, '');
      if (rawNumber) {
        return `https://wa.me/${rawNumber}?text=${encoded}`;
      }
    }

    // Opens WhatsApp and prompts customer to select ANY contact from their phone!
    return `https://api.whatsapp.com/send?text=${encoded}`;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        totalItems,
        totalAmount,
        config,
        updateConfig,
        generateOrderText,
        generateWhatsAppUrl,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
