# Catálogo Móvil para Tienda de Vapers (VapeStore Mobile)

Aplicación web móvil de alta fidelidad diseñada específicamente para celulares, permitiendo a los clientes explorar marcas de vapers con su identidad visual, navegar productos por marca en formato de lista optimizada (sin imágenes para máxima rapidez), consultar especificaciones detalladas, sabores y precios, y enviar pedidos estructurados por WhatsApp mediante un carrito interactivo, con soporte para conectar una base de datos o API remota.

> [!IMPORTANT]
> **Decisiones Críticas y Preferencias Confirmadas:**
> - **Flujo de Compra Directo**: El carrito funciona de forma simple y enfocada: únicamente guarda los productos que el cliente selecciona explícitamente para comprar (indicando el sabor y cantidad deseados). Desde el carrito, el cliente revisa su lista de compra y con un solo toque genera y envía el mensaje de pedido estructurado por WhatsApp.
> - **Estilo Visual**: Modo oscuro moderno con acentos vibrantes (Dark Slate/Onyx con acentos violeta/cian y esmeralda), optimizado para pantallas OLED de celulares y visualización rápida en una mano.
> - **Flujo de Catálogo**: Pantalla principal con cuadrícula de marcas con sus imágenes oficiales. Al tocar una marca, se despliega la lista ágil de modelos/productos sin fotos (enfocada en nombres, tipos y precios). Al tocar un producto, se abre la vista detallada con descripción, sabores seleccionables, especificaciones técnicas y precio.
> - **Conexión de Datos**: Conector configurable para base de datos/API remota (URL del endpoint REST o base de datos existente) con sincronización directa, respaldado por una base de datos inicial completa y rica para visualización inmediata.

---

## 1. Overview & Core Concept

- **Qué hace**: Proporciona una experiencia de navegación fluida tipo app nativa para clientes de una tienda de vapeo desde sus smartphones. Permite descubrir marcas destacadas, ver rápidamente la variedad de productos de cada fabricante sin distracciones visuales innecesarias, explorar sabores disponibles y armar un pedido directo a WhatsApp.
- **Audiencia objetivo**: Clientes que navegan desde su celular mediante un enlace en redes sociales (Instagram, TikTok, WhatsApp) y administradores de la tienda que desean compartir su inventario actualizado.
- **Valor clave**: Carga instantánea, ergonomía para el pulgar, catálogo estructurado por marca y conversión directa a ventas por WhatsApp sin pasarelas de pago complejas.

---

## 2. User Experience & Visual Design

### Flujos Principales de Usuario

1. **Pantalla de Inicio / Marcas**:
   - Barra superior fija con el nombre de la tienda, barra de búsqueda rápida y botón del carrito con contador de artículos seleccionados.
   - Pestaña de filtros rápidos (Todas, Desechables / Pods / Mods / E-Liquids).
   - Cuadrícula táctil de 2 columnas con tarjetas de marcas (Geek Bar, Elf Bar, Lost Mary, Vaporesso, Voopoo, OXVA, Smok, etc.) con sus logos/imágenes de alta calidad, conteo de productos disponibles y efecto de toque háptico visual.
2. **Listado de Productos por Marca**:
   - Cabecera con banner de la marca seleccionada, botón de regreso y buscador rápido de modelos dentro de la marca.
   - Listado vertical optimizado con tarjetas tipográficas limpias sin fotos (conforme a la indicación del usuario), mostrando: nombre del modelo, tipo de dispositivo (ej. Descartable 15.000 puffs, Pod Recargable, NicSalt), variedad de sabores disponibles y precio destacado en cifras tabulares.
3. **Ficha Detallada del Producto (Hoja Deslizable / Modal PDP)**:
   - Presentación enfocada: Nombre completo, badge de tipo, precio unitario y precio por mayor/promoción.
   - Selector de sabores disponibles (chips interactivos con indicador de stock).
   - Especificaciones técnicas: Puffs estimados, capacidad de líquido (ml), concentración de nicotina, batería (mAh / Tipo-C), resistencia y flujo de aire.
   - Selector de cantidad (+ / -) y botón de acción principal en la zona de fácil alcance del pulgar: *"Agregar para comprar"*.
4. **Carrito de Compra y Pedido por WhatsApp**:
   - El carrito almacena exclusivamente los productos que el cliente ha decidido comprar, detallando:
     - Nombre del producto y marca.
     - Sabor seleccionado por el cliente.
     - Cantidad elegida y subtotal.
     - Botón para ajustar cantidades o eliminar algún ítem.
   - Resumen total con cálculo automático de los productos seleccionados.
   - Campo opcional para que el cliente ingrese su nombre o notas.
   - Botón principal de compra: *"Pedir por WhatsApp"*, el cual genera automáticamente el mensaje con el detalle de los productos a comprar y abre la conversación de WhatsApp con la tienda:
     ```text
     ¡Hola! Quiero hacer el siguiente pedido:

     • 1x Geek Bar Pulse 15000 - Sabor: Watermelon Ice ($18.00)
     • 2x Lost Mary OS5000 - Sabor: Blue Cotton Candy ($28.00)

     Total: $46.00
     Cliente: [Nombre]
     ```
5. **Configuración de Base de Datos / API Remota**:
   - Panel accesible desde el pie o menú para que el dueño de la tienda pueda ingresar la URL de su API / base de datos remota, probar la conexión y sincronizar productos al instante.

### Identidad Visual & Ergonomía Móvil

- **Paleta de Colores (60-30-10)**:
  - Fondo dominante (60%): `#09090b` (Zinc extra oscuro / negro profundo) para máximo contraste y ahorro de batería en pantallas OLED móviles.
  - Superficies y contenedores (30%): `#18181b` con bordes ultrafinos en `#27272a`.
  - Acentos de acción (10%): Neón Violeta (`#8b5cf6` / `#a855f7`) y Neón Esmeralda (`#10b981`) para precios, botones de compra y confirmaciones.
- **Tipografía**:
  - Títulos y marca: `Plus Jakarta Sans` en pesos Bold / SemiBold.
  - Datos, precios y especificaciones: `font-mono tabular-nums` para perfecta alineación de cifras monetarias.
- **Ergonomía Táctil**:
  - Áreas de toque mínimas de 48x48px para todos los botones e ítems de lista.
  - Barra de acciones y carrito anclados en la zona natural del pulgar (zona inferior de la pantalla).
  - Respeto estricto del límite del 15% de superficie fija en pantalla para no saturar la vista móvil.

---

## 3. Decisiones de Producto y Arquitectura

- **Carrito enfocado estrictamente a compra final por WhatsApp**:
  - *Decisión*: El carrito solo recopila los ítems que el usuario eligió activamente para comprar (producto + sabor + cantidad) y su único propósito es formatear el pedido para enviarlo al WhatsApp de la tienda. Sin formularios largos ni pasarelas engorrosas.
  - *Motivo*: Máxima tasa de conversión en celulares y agilidad para el cliente y para el vendedor.
- **Visualización sin imágenes en productos**:
  - *Decisión*: Las marcas cuentan con sus imágenes y logos representativos, mientras que la lista de productos por marca es estrictamente tipográfica y de alta densidad de información.
  - *Motivo*: Cumple al 100% el requerimiento explícito del usuario y optimiza drásticamente el consumo de datos móviles y la velocidad de carga en smartphones.
- **Estrategia Híbrida de Datos (API Remota + Almacenamiento Local)**:
  - *Decisión*: Proporcionar un adaptador de datos que permite conectar una URL de API remota (ej. endpoint REST, Supabase, Google Sheets JSON, o Firebase) y a la vez mantener una base de datos local preconfigurada con marcas y modelos líderes para que la tienda funcione de inmediato sin requerir configuración previa obligatoria.

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                       VapeStore App                         │
├──────────────────────────────┬──────────────────────────────┤
│       UI Layer (Mobile)      │       State & Data Layer     │
│                              │                              │
│ ┌──────────────────────────┐ │ ┌──────────────────────────┐ │
│ │ TopBar & Search          │ │ │ Cart Context (LocalSt.)  │ │
│ ├──────────────────────────┤ │ │ - Solo productos compra  │ │
│ │ Brand Grid (With Images) │ │ │ - Formateador WhatsApp   │ │
│ ├──────────────────────────┤ │ ├──────────────────────────┤ │
│ │ Brand Products List      │ │ │ Product Data Adapter:    │ │
│ │ (Text-only, High Density)│ │ │  - Remote API Fetcher    │ │
│ ├──────────────────────────┤ │ │  - Fallback Built-in DB  │ │
│ │ Product Detail Modal     │ │ │  - Custom Endpoint Sync  │ │
│ │ (Flavor picker, Specs)   │ │ └───────────▲──────────────┘ │
│ ├──────────────────────────┤ │             │                │
│ │ Cart Drawer (Selected    │ │ ┌───────────┴──────────────┐ │
│ │ items only -> WhatsApp)  │ │ │ Remote API / Database    │ │
│ └──────────────────────────┘ │ │ (User's custom endpoint) │ │
│                              │ └──────────────────────────┘ │
└──────────────────────────────┴──────────────────────────────┘
```

### Modelo de Datos Principal

```typescript
interface Brand {
  id: string;
  name: string;
  logo: string;
  description: string;
  origin?: string;
  featured?: boolean;
}

interface Product {
  id: string;
  brandId: string;
  name: string;
  type: 'disposable' | 'pod_system' | 'mod' | 'eliquid' | 'coil';
  price: number;
  wholesalePrice?: number;
  description: string;
  puffs?: number;
  nicotine: string; // ej: "50mg (5%)", "20mg (2%)", "0mg"
  liquidCapacity?: string; // ej: "16ml"
  batteryCapacity?: string; // ej: "650mAh recargable Tipo-C"
  flavors: string[]; // ej: ["Watermelon Ice", "Blue Razz Lemonade", ...]
  inStock: boolean;
}

interface CartItem {
  id: string; // único por producto + sabor
  productId: string;
  productName: string;
  brandName: string;
  selectedFlavor: string;
  unitPrice: number;
  quantity: number;
}
```

---

## 5. Fases de Implementación

1. **Generación de Recursos Visuales de Marcas**:
   - Generación de imágenes y logos de marca de alta fidelidad para las marcas de vapers reconocidas (Geek Bar, Elf Bar, Lost Mary, Vaporesso, Voopoo, OXVA) mediante `generate_image`.
2. **Estructura de Datos y Adaptador de API**:
   - Creación del repositorio de datos inicial con marcas y productos con especificaciones completas y variedad de sabores.
   - Creación del adaptador para consultar la API/base de datos remota del usuario con sincronización y guardado en memoria/caché.
3. **Componentes Móviles y Vistas**:
   - Pantalla de inicio con marcas y búsqueda en tiempo real.
   - Vista de productos de la marca seleccionada (diseño limpio sin fotos).
   - Modal de detalle con selector de sabores y botón "Agregar para comprar".
   - Carrito de compras deslizante (solo productos seleccionados para compra) con botón de pedido directo por WhatsApp con mensaje pre-armado.
   - Panel de configuración para conectar la API o URL remota del cliente y número de WhatsApp de la tienda.
4. **Pruebas y Verificación**:
   - Comprobación de compilación (`compile_applet`), responsividad en celular y ergonomía táctil.
