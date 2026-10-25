import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { CatalogProduct, SortOption } from '../types/CatalogProduct';
import { Brand } from '../types/catalog';
import geekBarImage from '../assets/images/brand_geekbar_1792848921401.jpg';
import elfBarImage from '../assets/images/brand_elfbar_1792848921698.jpg';
import lostMaryImage from '../assets/images/brand_lostmary_1792848922278.jpg';
import vaporessoImage from '../assets/images/brand_vaporesso_1792848923178.jpg';
import voopooImage from '../assets/images/brand_voopoo_1792848922908.jpg';

export const CATALOG_COLLECTION = 'catalogo_publico';

export const DEFAULT_WHATSAPP_MESSAGE_TEMPLATE = `Hola, quiero consultar por este producto:

• Marca: {marca}
• Producto: {producto}
• Sabor: {sabor}
• Precio: {precio}
• Disponibilidad: {disponibilidad}

¿Me confirman si hay stock y cómo coordinar la entrega?`;

const LEGACY_DEFAULT_WHATSAPP_MESSAGE_TEMPLATE = `Hola {tienda}, quiero consultar por este producto:

• Marca: {marca}
• Producto: {producto}
• Sabor: {sabor}
• Precio: {precio}
• Disponibilidad: {disponibilidad}

¿Me confirman si hay stock y cómo coordinar la entrega?`;

export function resolveWhatsAppMessageTemplate(template?: string): string {
  if (
    !template ||
    template.trim() === LEGACY_DEFAULT_WHATSAPP_MESSAGE_TEMPLATE
  ) {
    return DEFAULT_WHATSAPP_MESSAGE_TEMPLATE;
  }
  return template;
}

export interface WhatsAppMessageValues {
  tienda: string;
  marca: string;
  producto: string;
  sabor: string;
  precio: string;
  disponibilidad: string;
}

export function formatWhatsAppMessage(
  template: string,
  values: WhatsAppMessageValues
): string {
  return template.replace(
    /\{(tienda|marca|producto|sabor|precio|disponibilidad)\}/g,
    (_, key: keyof WhatsAppMessageValues) => values[key]
  );
}

const BRAND_IMAGES: Record<string, string> = {
  'elf bar': elfBarImage,
  elfbar: elfBarImage,
  'geek bar': geekBarImage,
  geekbar: geekBarImage,
  'lost mary': lostMaryImage,
  lostmary: lostMaryImage,
  vaporesso: vaporessoImage,
  voopoo: voopooImage,
};

function getBrandImage(brandName: string): string {
  const key = brandName.trim().toLowerCase().replace(/\s+/g, ' ');
  return BRAND_IMAGES[key] || '';
}

// Catálogo de respaldo inicial con 1 sola imagen por modelo y variantes en texto
export const SAMPLE_CATALOG_PRODUCTS: CatalogProduct[] = [
  {
    id: 'geek-bar-pulse-15k',
    nombre: 'Geek Bar Pulse 15000',
    marca: 'Geek Bar',
    categoria: 'Desechables',
    precio: 26000,
    descripcion: 'Dispositivo inteligente con pantalla digital LED que muestra batería y nivel de líquido. Modo Regular (15.000 caladas) y Modo Pulse (7.500 caladas). Doble resistencia de malla.',
    imagenUrl: geekBarImage,
    visible: true,
    disponible: true,
    variantes: [
      'Watermelon Ice',
      'Blue Razz Ice',
      'Fcuking FAB',
      'Blow Pop',
      'Miami Mint',
      'Sour Apple Ice',
      'Strawberry Banana',
      'Crazy Melon'
    ],
    updatedAt: Date.now()
  },
  {
    id: 'elfbar-ice-king-40k',
    nombre: 'Elf Bar Ice King 40K',
    marca: 'Elf Bar',
    categoria: 'Desechables',
    precio: 28000,
    descripcion: 'Edición Ice King de ultra duración con 40.000 caladas, flujo de aire regulable y golpe frío intenso con tecnología de resistencia QUAQ-Mesh.',
    imagenUrl: elfBarImage,
    visible: true,
    disponible: true,
    variantes: [
      'Sour Lush Gummy',
      'Mango Magic',
      'Strawberry Watermelon',
      'Peach+',
      'Sour Apple Ice'
    ],
    updatedAt: Date.now()
  },
  {
    id: 'lost-mary-mixer-30k',
    nombre: 'Lost Mary Mixer 30K',
    marca: 'Lost Mary',
    categoria: 'Desechables',
    precio: 26000,
    descripcion: 'Diseño texturizado ergonómico con regulador de potencia y doble depósito para un sabor puro y prolongado.',
    imagenUrl: lostMaryImage,
    visible: true,
    disponible: true,
    variantes: [
      'Watermelon Ice',
      'Grape Fruit Fusion',
      'Blueberry Mint',
      'Lemon Lime Twist'
    ],
    updatedAt: Date.now()
  },
  {
    id: 'ignite-v300',
    nombre: 'Ignite V300',
    marca: 'Ignite',
    categoria: 'Desechables',
    precio: 26000,
    descripcion: 'Línea premium de Ignite con terminaciones en negro mate y aleación suave, batería recargable Tipo-C y calada suave.',
    imagenUrl: voopooImage,
    visible: true,
    disponible: true,
    variantes: [
      'Blueberry Ice',
      'Banana Coconut Water',
      'Sweet and Sour',
      'Watermelon Chew'
    ],
    updatedAt: Date.now()
  },
  {
    id: 'the-black-sheep-30k',
    nombre: 'The Black Sheep 30K',
    marca: 'The Black Sheep',
    categoria: 'Desechables',
    precio: 26000,
    descripcion: 'Dispositivo de alta gama con calada densa y aromática, pantalla indicadora y flujo de aire personalizable.',
    imagenUrl: vaporessoImage,
    visible: true,
    disponible: true,
    variantes: [
      'Strawberry / Sour Pines',
      'Grape / Watermelon',
      'Cool Mint Frost'
    ],
    updatedAt: Date.now()
  },
  {
    id: 'vaporesso-xros-4',
    nombre: 'Vaporesso XROS 4 Pod Kit',
    marca: 'Vaporesso',
    categoria: 'Pod Systems',
    precio: 32000,
    descripcion: 'Sistema de cápsulas recargables con tecnología Corex 2.0 y batería de 1000 mAh de carga rápida.',
    imagenUrl: vaporessoImage,
    visible: true,
    disponible: true,
    variantes: [
      'Color Black Metal',
      'Color Silver Titanium',
      'Color Pastel Palette',
      'Color Cosmic Blue'
    ],
    updatedAt: Date.now()
  }
];

export const catalogService = {
  getBrandImage,

  /**
   * Suscribirse en tiempo real a la colección pública 'catalogo_publico'
   * No requiere login ni autenticación.
   */
  subscribeToCatalog(
    callback: (products: CatalogProduct[]) => void,
    onError?: (error: Error) => void
  ): () => void {
    const colRef = collection(db, CATALOG_COLLECTION);

    return onSnapshot(
      colRef,
      (snapshot) => {
        if (snapshot.empty) {
          // Si la colección pública aún está vacía en Firestore, devolver muestra para no dejar pantalla vacía
          callback(SAMPLE_CATALOG_PRODUCTS);
          return;
        }

        const items: CatalogProduct[] = [];
        const inventoryByBrand = new Map<string, CatalogProduct>();
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          // Solo mostrar si visible es true o no está definido como false
          if (data.visible !== false && data.inventoryDeleted !== true) {
            const nombre = String(data.nombre || data.name || 'Sin nombre');
            const marca = String(data.marca || data.brand || 'General');
            const precio = Number(data.precio ?? data.sellingPrice ?? 0);
            const disponible = data.disponible !== false;
            if (data.inventorySource === true) {
              if (!disponible) return;

              const brandKey = marca.trim().toLowerCase();
              const group = inventoryByBrand.get(brandKey);
              const inventoryVariant = {
                id: docSnap.id,
                nombre,
                precio,
                disponible,
              };
              if (group) {
                group.inventoryVariants?.push(inventoryVariant);
                group.variantes?.push(nombre);
                group.precio = Math.min(group.precio, precio);
                group.disponible ||= disponible;
                if (!group.imagenUrl) {
                  group.imagenUrl = data.imagenUrl || data.imageUrl || '';
                }
                group.updatedAt = Math.max(group.updatedAt || 0, data.updatedAt || 0);
              } else {
                inventoryByBrand.set(brandKey, {
                  id: `inventory-brand-${brandKey}`,
                  nombre: marca,
                  marca,
                  categoria: data.categoria || data.category || 'Vapes',
                  precio,
                  descripcion: '',
                  imagenUrl:
                    data.imagenUrl ||
                    '',
                  visible: true,
                  disponible,
                  variantes: [nombre],
                  inventoryVariants: [inventoryVariant],
                  updatedAt: data.updatedAt || Date.now(),
                  inventorySource: true,
                });
              }
              return;
            }

            items.push({
              id: docSnap.id,
              nombre,
              marca,
              categoria: data.categoria || data.category || 'Vapes',
              precio,
              descripcion: data.descripcion || data.description || '',
              imagenUrl:
                data.imagenUrl ||
                data.imageUrl ||
                getBrandImage(marca),
              visible: data.visible !== false,
              disponible,
              variantes: Array.isArray(data.variantes) ? data.variantes : [],
              updatedAt: data.updatedAt || Date.now(),
              inventorySource: false,
            });
          }
        });

        inventoryByBrand.forEach((product) => {
          product.variantes = [...new Set(product.variantes)];
          product.inventoryVariants?.sort((a, b) => a.nombre.localeCompare(b.nombre));
          product.imagenUrl = product.imagenUrl || getBrandImage(product.marca) || '';
          items.push(product);
        });
        callback(items);
      },
      (error) => {
        console.error('Error al suscribirse a catalogo_publico en Firestore:', error);
        // Si hay error de permisos o red, fallback seguro a la muestra
        callback(SAMPLE_CATALOG_PRODUCTS);
        if (onError) onError(error);
      }
    );
  },

  /**
   * Filtrar y ordenar productos en memoria para rendimiento instantáneo
   */
  filterAndSort(
    products: CatalogProduct[],
    search: string,
    category: string,
    sort: SortOption
  ): CatalogProduct[] {
    let result = [...products];

    // Filtro por categoría
    if (category && category !== 'Todas') {
      result = result.filter(
        (p) => p.categoria.toLowerCase() === category.toLowerCase()
      );
    }

    // Filtro por búsqueda (nombre, marca, categoría o variante)
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.nombre.toLowerCase().includes(q) ||
          p.marca.toLowerCase().includes(q) ||
          p.categoria.toLowerCase().includes(q) ||
          (p.variantes && p.variantes.some((v) => v.toLowerCase().includes(q)))
      );
    }

    // Ordenamiento
    switch (sort) {
      case 'name-asc':
        result.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'name-desc':
        result.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
      case 'price-asc':
        result.sort((a, b) => a.precio - b.precio);
        break;
      case 'price-desc':
        result.sort((a, b) => b.precio - a.precio);
        break;
      case 'brand-asc':
        result.sort((a, b) => a.marca.localeCompare(b.marca));
        break;
      default:
        break;
    }

    return result;
  },

  /**
   * Sincronizar catálogo inicial a Firestore catalogo_publico
   * (Útil para poblar la colección la primera vez)
   */
  async seedInitialPublicCatalog(): Promise<number> {
    let count = 0;
    for (const prod of SAMPLE_CATALOG_PRODUCTS) {
      const docRef = doc(db, CATALOG_COLLECTION, prod.id);
      await setDoc(docRef, {
        nombre: prod.nombre,
        marca: prod.marca,
        categoria: prod.categoria,
        precio: prod.precio,
        descripcion: prod.descripcion,
        imagenUrl: prod.imagenUrl,
        visible: prod.visible,
        disponible: prod.disponible,
        variantes: prod.variantes,
        updatedAt: Date.now()
      }, { merge: true });
      count++;
    }
    return count;
  }
};
