/**
 * BASE DE DATOS DEL CATÁLOGO DE PRODUCTOS MAYORISTAS
 * Rubro: Alimentos, Bebidas y Golosinas (Consumo Masivo)
 * 
 * Puedes agregar, editar o eliminar productos fácilmente desde esta lista.
 * Cada producto tiene:
 * - id: Identificador único numérico (ej: 1, 2, 3...)
 * - sku: Código de producto para pedidos y logística (ej: "GOL-001")
 * - name: Nombre comercial del artículo
 * - category: 'golosinas' | 'bebidas' | 'snacks' | 'almacen'
 * - unitMeasure: 'Unid.' | 'Paquete' | 'Botella' | 'Lata' | 'Caja' | etc.
 * - packSize: Cantidad de unidades por bulto/caja cerrada
 * - unitPrice: Precio unitario estimado
 * - packPrice: Precio total por bulto cerrado (precio mayorista)
 * - oldPackPrice: (Opcional) Precio anterior para mostrar tachado si está en oferta
 * - minPacks: Compra mínima en bultos (ej: 1 o 2)
 * - stockStatus: 'in_stock' (Disponible) | 'low_stock' (Últimos bultos) | 'ask_stock' (Consultar)
 * - stockUnits: Cantidad estimada de bultos disponibles
 * - badge: Etiqueta llamativa ('OFERTA 25% OFF', 'MÁS VENDIDO', 'PACK AHORRO', etc.)
 * - isPromo: true para destacar en la sección superior de promociones estelares
 * - image: URL de la foto del producto o ruta local
 * - description: Detalles de embalaje, peso neto y especificaciones para el comerciante
 * 
 * Ejemplo de producto para agregar:
 * {
 *     id: 1,
 *     sku: "GOL-001",
 *     name: "Bombones de Chocolate Rellenos de Avellana",
 *     category: "golosinas",
 *     unitMeasure: "Caja ind.",
 *     packSize: 24,
 *     unitPrice: 1350,
 *     packPrice: 29700,
 *     oldPackPrice: 35000,
 *     minPacks: 1,
 *     stockStatus: "in_stock",
 *     stockUnits: 140,
 *     badge: "🔥 OFERTA 15% OFF",
 *     isPromo: true,
 *     image: "https://images.unsplash.com/photo-1548741487-18d16a145e80?auto=format&fit=crop&w=700&q=80",
 *     description: "Exhibidor cerrado de 24 cajas individuales de 150g. Ideal para mostrador de kioscos y minimarkets."
 * }
 */

const PRODUCTS_DATA = [];
