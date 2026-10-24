import { Brand, Product } from '../types/catalog';

export const DEFAULT_BRANDS: Brand[] = [
  {
    id: 'geek-bar',
    name: 'Geek Bar',
    logo: '/src/assets/images/brand_geekbar_1792848921401.jpg',
    description: 'Líder en innovación con pantallas digitales inteligentes, modo Pulse y doble resistencia mesh.',
    origin: 'Shenzhen / Global',
    featured: true
  },
  {
    id: 'elf-bar',
    name: 'Elf Bar',
    logo: '/src/assets/images/brand_elfbar_1792848921698.jpg',
    description: 'La marca más icónica y reconocida mundialmente por su consistencia de sabor y suavidad.',
    origin: 'Global',
    featured: true
  },
  {
    id: 'lost-mary',
    name: 'Lost Mary',
    logo: '/src/assets/images/brand_lostmary_1792848922278.jpg',
    description: 'Diseño ergonómico texturizado, mezclas exóticas y tecnología avanzada de vaporización.',
    origin: 'Global',
    featured: true
  },
  {
    id: 'vaporesso',
    name: 'Vaporesso',
    logo: '/src/assets/images/brand_vaporesso_1792848923178.jpg',
    description: 'Ingeniería de alta precisión para pod systems recargables, tecnología Corex y chips Axon.',
    origin: 'Shenzhen / Premium',
    featured: true
  },
  {
    id: 'voopoo',
    name: 'Voopoo',
    logo: '/src/assets/images/brand_voopoo_1792848922908.jpg',
    description: 'Pioneros en la tecnología Chip Gene y sistemas mod/pod potentes de máximo rendimiento.',
    origin: 'Global',
    featured: true
  }
];

export const DEFAULT_PRODUCTS: Product[] = [
  // GEEK BAR PRODUCTS
  {
    id: 'gb-pulse-15000',
    brandId: 'geek-bar',
    name: 'Geek Bar Pulse 15000',
    category: 'disposable',
    categoryLabel: 'Desechable Inteligente',
    price: 22.00,
    wholesalePrice: 18.50,
    description: 'El primer vape con pantalla LED de cápsula completa que muestra porcentaje de batería y nivel de e-liquid. Cuenta con dos modos de potencia: Modo Regular (15.000 caladas) y Modo Pulse (7.500 caladas a 20W con doble resistencia).',
    puffs: 15000,
    nicotine: '5% (50mg)',
    liquidCapacity: '16.0 ml',
    battery: '650 mAh Recargable Tipo-C',
    resistance: 'Dual Mesh Coil',
    flavors: [
      'Watermelon Ice',
      'Blue Razz Ice',
      'Fcuking FAB (Frutas Tropicales & Gomitas)',
      'Blow Pop (Chupetín de Frutilla)',
      'Miami Mint (Menta Fresca Refinada)',
      'Sour Apple Ice',
      'Strawberry Banana',
      'Crazy Melon'
    ],
    inStock: true
  },
  {
    id: 'gb-pulse-x-25000',
    brandId: 'geek-bar',
    name: 'Geek Bar Pulse X 25K',
    category: 'disposable',
    categoryLabel: 'Desechable Alta Capacidad',
    price: 26.00,
    wholesalePrice: 22.00,
    description: 'Pantalla curva 3D envolvente con visualizador de constelaciones LED. Tecnología de doble núcleo VPU con dos modos: Modo Regular de 25.000 caladas y Modo Pulse de 15.000 caladas a 25W.',
    puffs: 25000,
    nicotine: '5% (50mg)',
    liquidCapacity: '18.0 ml',
    battery: '820 mAh Carga Ultra-Rápida USB-C',
    resistance: 'Dual Core Dual Mesh',
    flavors: [
      'Lime Berry Orange',
      'Sour Fcuking FAB',
      'Blackberry B-Pop',
      'Raspberry Peach Lime',
      'Blue Rancher',
      'Miami Mint Ice'
    ],
    inStock: true
  },
  {
    id: 'gb-meloso-max-9000',
    brandId: 'geek-bar',
    name: 'Geek Bar Meloso Max 9000',
    category: 'disposable',
    categoryLabel: 'Desechable Silencioso',
    price: 18.00,
    wholesalePrice: 15.00,
    description: 'Diseño compacto y ergonómico con acabado metálico suave. Flujo de aire ajustable en la base y luces indicadoras inteligentes de e-juice y batería.',
    puffs: 9000,
    nicotine: '5% (50mg)',
    liquidCapacity: '14.0 ml',
    battery: '600 mAh Recargable Tipo-C',
    resistance: 'Dual Mesh Coil',
    flavors: [
      'Watermelon Ice',
      'Peach Ice',
      'Fuji Melon Ice',
      'Green Monster (Energy Drink)',
      'Tropical Rainbow Blast'
    ],
    inStock: true
  },
  {
    id: 'gb-salts-30ml',
    brandId: 'geek-bar',
    name: 'Geek Bar Salts E-Liquid 30ml',
    category: 'eliquid',
    categoryLabel: 'E-Liquid NicSalt',
    price: 13.50,
    wholesalePrice: 11.00,
    description: 'Líquido oficial de sales de nicotina formulado con los mismos concentrados de aroma que sus dispositivos desechables para usar en cualquier sistema de pods recargables.',
    nicotine: '3.5% (35mg) / 5% (50mg)',
    liquidCapacity: '30.0 ml',
    flavors: [
      'Watermelon Ice Salt',
      'Blue Razz Lemonade',
      'Miami Mint Salt',
      'Strawberry Kiwi Fusion'
    ],
    inStock: true
  },

  // ELF BAR PRODUCTS
  {
    id: 'eb-bc5000-ultra',
    brandId: 'elf-bar',
    name: 'Elf Bar BC5000 Ultra',
    category: 'disposable',
    categoryLabel: 'Desechable Clásico',
    price: 16.50,
    wholesalePrice: 13.50,
    description: 'Edición Ultra con carcasa exterior de acero inoxidable cepillado con tecnología QUAQ-Mesh que mejora la producción de vapor en un 45% y la fidelidad del sabor en un 500%.',
    puffs: 5000,
    nicotine: '5% (50mg)',
    liquidCapacity: '13.0 ml',
    battery: '650 mAh Recargable Tipo-C',
    resistance: 'QUAQ Mesh Coil',
    flavors: [
      'Blue Razz Ice',
      'Watermelon Bubblegum',
      'Strawberry Mango',
      'Kiwi Passionfruit Guava',
      'Grape Honeydew',
      'Tropical Rainbow Blast',
      'Cotton Candy'
    ],
    inStock: true
  },
  {
    id: 'eb-raya-d1-13000',
    brandId: 'elf-bar',
    name: 'Elf Bar Raya D1 13000 Puffs',
    category: 'disposable',
    categoryLabel: 'Desechable Pantalla Inteligente',
    price: 21.00,
    wholesalePrice: 17.50,
    description: 'Cuerpo texturizado antideslizante con pantalla lateral que monitorea el volumen de e-liquid y estado de la batería. Sabor continuo hasta la última calada.',
    puffs: 13000,
    nicotine: '5% (50mg)',
    liquidCapacity: '18.0 ml',
    battery: '650 mAh Recargable Tipo-C',
    resistance: 'QUAQ Dual Mesh',
    flavors: [
      'Blackberry Cranberry',
      'Watermelon Ice',
      'Blueberry Mint',
      'Double Apple',
      'Peach Berry'
    ],
    inStock: true
  },
  {
    id: 'eb-elftor-pod-kit',
    brandId: 'elf-bar',
    name: 'Elf Bar Mate 500 Pod Kit',
    category: 'pod_system',
    categoryLabel: 'Pod System Recargable',
    price: 19.99,
    wholesalePrice: 16.00,
    description: 'Kit de inicio ligero con cuerpo de aleación de aluminio para cápsulas pre-cargadas o recargables. Ideal para una experiencia ecológica y económica.',
    nicotine: 'Compatible con cápsulas P1 de 20mg/50mg',
    battery: '500 mAh Recargable USB-C',
    flavors: [
      'Dispositivo Color Matte Black',
      'Dispositivo Color Aurora Blue',
      'Dispositivo Color Rose Gold'
    ],
    inStock: true
  },

  // LOST MARY PRODUCTS
  {
    id: 'lm-os5000-luster',
    brandId: 'lost-mary',
    name: 'Lost Mary OS5000 Luster Edition',
    category: 'disposable',
    categoryLabel: 'Desechable Ergonómico',
    price: 17.00,
    wholesalePrice: 14.00,
    description: 'Diseño ergonómico con textura de planeta lunar y acabado brillante Luster. Indicador LED de batería de 3 colores (Verde >70%, Azul 30-70%, Rojo <30%).',
    puffs: 5000,
    nicotine: '5% (50mg)',
    liquidCapacity: '13.0 ml',
    battery: '650 mAh Recargable Tipo-C',
    resistance: 'Mesh Coil',
    flavors: [
      'Blueberry Raspberry Peach',
      'Lemon Lime',
      'Strawberry Watermelon',
      'Acai Berry Storm Ice',
      'Black Strawnana',
      'Forest Mint'
    ],
    inStock: true
  },
  {
    id: 'lm-mo20000-pro',
    brandId: 'lost-mary',
    name: 'Lost Mary MO20000 Pro',
    category: 'disposable',
    categoryLabel: 'Desechable Pro Regulable',
    price: 24.50,
    wholesalePrice: 20.00,
    description: 'Mega pantalla animada HD con control de vataje regulable desde 13W hasta 25W en incrementos de 1W. Resistencia de malla dual de 0.9Ω y flujo de aire personalizable de 3 niveles.',
    puffs: 20000,
    nicotine: '5% (50mg)',
    liquidCapacity: '18.0 ml',
    battery: '800 mAh Recargable USB-C',
    resistance: 'Dual Mesh 0.9Ω',
    flavors: [
      'Watermelon Ice',
      'Blue Razz Ice',
      'Dragon Drink (Pitahaya & Frutos Rojos)',
      'Sour Apple Ice',
      'Mango Twist',
      'Lime Grapefruit'
    ],
    inStock: true
  },
  {
    id: 'lm-tappo-starter-kit',
    brandId: 'lost-mary',
    name: 'Lost Mary Tappo Pod Kit',
    category: 'pod_system',
    categoryLabel: 'Pod System Intercambiable',
    price: 18.50,
    wholesalePrice: 15.00,
    description: 'Sistema reutilizable con cartuchos magnéticos precargados de 2ml. Reducción de desperdicio de baterías y sabor intenso gracias a la bobina de malla QUAQ.',
    battery: '750 mAh Recargable Tipo-C',
    nicotine: '2% (20mg)',
    flavors: [
      'Kit Negro (Incluye cápsula Blue Razz Lemonade)',
      'Kit Verde (Incluye cápsula Lemon Lime)',
      'Kit Plateado (Incluye cápsula Spearmint)'
    ],
    inStock: true
  },

  // VAPORESSO PRODUCTS
  {
    id: 'vap-xros-4-kit',
    brandId: 'vaporesso',
    name: 'Vaporesso XROS 4 Pod Kit',
    category: 'pod_system',
    categoryLabel: 'Pod System Profesional',
    price: 32.00,
    wholesalePrice: 26.00,
    description: 'Cuerpo unibody de aleación de aluminio resistente. Tecnología de calentamiento COREX 2.0 que proporciona sabor más denso y vida útil de la resistencia un 30% más duradera. Selector de 3 modos de potencia y compatible con toda la serie de cápsulas XROS.',
    battery: '1000 mAh Carga 2A USB-C (Carga en 30 min)',
    nicotine: 'Compatible con Sales y Base Libre',
    liquidCapacity: '3.0 ml (Top Fill)',
    resistance: '0.4Ω / 0.6Ω / 0.8Ω COREX 2.0',
    flavors: [
      'Color Black Metal',
      'Color Silver Titanium',
      'Color Pastel Palette',
      'Color Cosmic Blue',
      'Color Champagne Gold'
    ],
    inStock: true
  },
  {
    id: 'vap-xros-pro',
    brandId: 'vaporesso',
    name: 'Vaporesso XROS Pro 30W',
    category: 'pod_system',
    categoryLabel: 'Pod Pod System Avanzado',
    price: 38.00,
    wholesalePrice: 31.00,
    description: 'El primer pod de la familia XROS con pantalla oculta, botón de bloqueo físico y potencia ajustable hasta 30 Watts con cartuchos de 0.4Ω. Batería gigante de 1200mAh.',
    battery: '1200 mAh Carga Ultra Rápida',
    nicotine: 'Universal (Sal de nicotina o líquido regular)',
    liquidCapacity: '3.0 ml / 2.0 ml',
    resistance: 'Mesh 0.4Ω / 0.6Ω / 0.8Ω / 1.0Ω / 1.2Ω',
    flavors: [
      'Black Obsidian',
      'Grey Anthracite',
      'Emerald Green',
      'Red Ruby'
    ],
    inStock: true
  },
  {
    id: 'vap-target-200-mod',
    brandId: 'vaporesso',
    name: 'Vaporesso Target 200 Mod Kit',
    category: 'mod',
    categoryLabel: 'Mod Box de Alta Potencia',
    price: 68.00,
    wholesalePrice: 55.00,
    description: 'Potente kit de vapeo con chasis tejido resistente al agua y caídas. Funciona con 2 baterías 18650 (no incluidas) entregando hasta 220W con el atomizador iTank 2 de 8ml.',
    battery: 'Doble Batería 18650 Externa',
    nicotine: 'Recomendado Base Libre 3mg / 6mg',
    liquidCapacity: '8.0 ml iTank 2',
    resistance: 'Resistencias GTI Mesh 0.2Ω / 0.4Ω',
    flavors: [
      'Carbon Black',
      'Shadow Grey',
      'Forest Green',
      'Sunset Red'
    ],
    inStock: true
  },
  {
    id: 'vap-xros-pods-pack',
    brandId: 'vaporesso',
    name: 'Cartuchos Vaporesso XROS Series (Pack x4)',
    category: 'coil',
    categoryLabel: 'Repuestos & Coils',
    price: 15.00,
    wholesalePrice: 12.00,
    description: 'Pack de 4 cartuchos de repuesto con tecnología SSS anti-fugas y llenado superior fácil sin necesidad de retirar el cartucho del equipo.',
    liquidCapacity: '3.0 ml / 2.0 ml',
    flavors: [
      'Pack 0.4Ω (Para calada RDL más vapor)',
      'Pack 0.6Ω (Ideal 20-30W vapor balanceado)',
      'Pack 0.8Ω (Recomendado para Sales de Nicotina)',
      'Pack 1.0Ω (Calada MTL cerrada y suave)'
    ],
    inStock: true
  },

  // VOOPOO PRODUCTS
  {
    id: 'vp-drag-s2-kit',
    brandId: 'voopoo',
    name: 'Voopoo Drag S2 Pod Mod 60W',
    category: 'pod_system',
    categoryLabel: 'Pod Mod Potente',
    price: 44.00,
    wholesalePrice: 36.00,
    description: 'Equipado con la nueva plataforma de bobinas PnP X que garantiza 100ml de líquido sin quemarse ni perder sabor. Flujo de aire superior anti-derrames y chip Gene.TT 2.0 con modos Smart, RBA y ECO.',
    battery: '2500 mAh Integrada',
    nicotine: 'Universal',
    liquidCapacity: '5.0 ml PnP X Cartridge DTL',
    resistance: 'PnP X Coils 0.2Ω y 0.3Ω',
    flavors: [
      'Sky Blue Leather',
      'Carbon Fiber Black',
      'Vintage Brown',
      'Modern Red',
      'Glow Pink'
    ],
    inStock: true
  },
  {
    id: 'vp-argus-g2-pod',
    brandId: 'voopoo',
    name: 'Voopoo Argus G2 Pod 30W',
    category: 'pod_system',
    categoryLabel: 'Pod System con Pantalla TFT',
    price: 29.50,
    wholesalePrice: 24.00,
    description: 'Pantalla a color de 0.96 pulgadas con animaciones interactivas de vapeo y 3 modos de entrega. Batería de 1000mAh y motor de vibración táctil para alertas de seguridad.',
    battery: '1000 mAh Carga Tipo-C',
    nicotine: 'Ideal para Sales de Nicotina 20mg a 50mg',
    liquidCapacity: '3.0 ml / 2.0 ml Top Fill',
    resistance: 'Argus Pods 0.4Ω / 0.7Ω',
    flavors: [
      'Space Grey',
      'Aurora Purple',
      'Pearl White',
      'Glow Pink',
      'Iris Blue'
    ],
    inStock: true
  },
  {
    id: 'vp-drag-4-kit',
    brandId: 'voopoo',
    name: 'Voopoo Drag 4 Kit 177W',
    category: 'mod',
    categoryLabel: 'Mod Box Profesional',
    price: 72.00,
    wholesalePrice: 59.00,
    description: 'La cuarta generación de la mítica serie DRAG con paneles de resina natural o madera noble tallada. Atomizador UFORCE-L con flujo de aire de 3 entradas superiores y chip Gene.TT 2.0.',
    battery: 'Doble Batería 18650 Externa',
    nicotine: 'Base Libre 0mg / 3mg / 6mg',
    liquidCapacity: '5.5 ml UFORCE-L Tank',
    resistance: 'PnP Dual In One Coils',
    flavors: [
      'Gunmetal & Tropical Orange',
      'Gunmetal & Ocean Blue',
      'Black & Walnut Wood',
      'Pale Gold & Rosewood'
    ],
    inStock: true
  }
];

export const DEFAULT_CONFIG = {
  storeName: 'Vape City Store',
  whatsappNumber: '5491123456789', // Editable in settings
  currencySymbol: '$',
  remoteApiUrl: '',
  lastSync: undefined
};
