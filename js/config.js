/**
 * CONFIGURACIÓN GENERAL DE LA TIENDA MAYORISTA
 * Modifica estos valores para personalizar los datos de tu negocio, 
 * número de WhatsApp, moneda, compra mínima y promociones.
 */
const STORE_CONFIG = {
    // Datos de la Empresa
    businessName: "DISTRIBUIDORA MAYORISTA CENTRAL",
    tagline: "Alimentos, Bebidas y Golosinas al Mejor Precio por Bulto",
    badgePromoHeader: "🔥 PROMOS MAYORISTAS DE LA SEMANA | Envíos a comercios y distribuidoras | Precios por bulto cerrado",
    
    // Contacto y Canales
    // Ingresa el número de WhatsApp con código de país y área sin espacios ni guiones ni '+'
    // Ejemplo Argentina: "5491123456789" | Ejemplo México: "5215512345678" | Ejemplo Colombia: "573001234567"
    whatsappNumber: "5491199998888",
    
    // Email de contacto opcional
    email: "ventas@mayoristacentral.com",
    
    // Dirección / Depósito
    address: "Parque Industrial Logístico, Nave 4 - Depósito Central",
    schedule: "Lunes a Viernes de 07:00 a 16:30 hs | Sábados de 08:00 a 12:30 hs",
    
    // Parámetros de Cotización
    currencySymbol: "$",
    currencyCode: "ARS", // O USD, MXN, COP, etc.
    minOrderAmount: 40000, // Monto mínimo sugerido para cotización mayorista (0 para deshabilitar)
    
    // Categorías del Catálogo
    categories: [
        { id: "todas", name: "Todos los Productos", icon: "grid" },
        { id: "promos", name: "🔥 Súper Ofertas Mayoristas", icon: "flame" },
        { id: "golosinas", name: "🍬 Golosinas & Chocolates", icon: "candy" },
        { id: "bebidas", name: "🥤 Bebidas & Jugos", icon: "cup-soda" },
        { id: "snacks", name: "🥨 Snacks & Galletitas", icon: "cookie" },
        { id: "almacen", name: "🥫 Almacén & Despensa", icon: "package" }
    ],

    // Beneficios / Ventajas para el cliente
    features: [
        {
            title: "Precios por Bulto Cerrado",
            desc: "Escalas de descuento reales para kioscos, almacenes y supermercados.",
            icon: "box"
        },
        {
            title: "Stock Inmediato",
            desc: "Artículos listos para despacho rápido desde nuestro centro logístico.",
            icon: "check-circle"
        },
        {
            title: "Cotización al Instante",
            desc: "Selecciona los productos y recibe la confirmación directa por WhatsApp.",
            icon: "zap"
        },
        {
            title: "Facturación A y B",
            desc: "Emitimos comprobantes oficiales y recibimos transferencias bancarias.",
            icon: "receipt"
        }
    ],

    // Preguntas Frecuentes
    faqs: [
        {
            q: "¿Cómo funciona el proceso de cotización y compra?",
            a: "1. Agrega al cotizador los bultos o packs que necesitas.<br>2. Presiona 'Enviar Cotización por WhatsApp'.<br>3. Nuestro equipo de ventas revisa tu listado en minutos, te confirma disponibilidad y te brinda los datos de pago y fecha de entrega."
        },
        {
            q: "¿Existe un monto o cantidad mínima de compra?",
            a: "Sí, al ser venta mayorista operamos con venta por bulto/caja cerrada y una compra mínima estimada indicada en el cotizador para acceder a las tarifas promocionales."
        },
        {
            q: "¿Qué medios de pago aceptan?",
            a: "Transferencia bancaria (inmediata), depósito, cheques a plazo (previa evaluación crediticia) y efectivo contra entrega en depósitos autorizados."
        },
        {
            q: "¿Hacen envíos al interior del país?",
            a: "Sí, despachamos sin cargo hasta el expreso o transporte de tu preferencia que opere en tu zona geográfica."
        }
    ]
};
