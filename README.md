# 🛒 Catálogo & Cotizador Mayorista Online

Una web estática profesional, moderna y de alto impacto visual orientada a **distribuidoras y mayoristas de alimentos, bebidas y golosinas**. Permite concentrar las promociones y ofertas por bulto cerrado, facilitando que comerciantes, kioscos, almacenes y minimarkets armen su pedido y envíen su **solicitud de cotización formal directamente por WhatsApp con un solo clic**.

---

## 🌟 Características Principales

- **Diseño Llamativo y Comercial**: Paleta vibrante inspirada en rojo apetitoso y amarillo dorado (estilo comercial de alto impacto con contraste profesional y tipografía *Plus Jakarta Sans*).
- **Flujo Directo por WhatsApp**: El comerciante selecciona bultos cerrados, revisa subtotales y hace clic en **"Enviar Cotización por WhatsApp"**, generando un mensaje estructurado con SKUs, cantidades, bultos y total estimado.
- **Concentrador de Promociones**: Sección hero con ofertas estrella de la semana, etiquetas llamativas (*OFERTA 20% OFF*, *TOP VENTAS*, *PACK AHORRO*) y desglose por unidad vs. bulto.
- **Buscador & Filtros en Tiempo Real**: Filtrado instantáneo por texto (nombre, SKU o marca), categorías con contador de stock (*Golosinas*, *Bebidas*, *Snacks*, *Almacén*, *Promociones*) y switch de *Solo Stock Inmediato*.
- **Ficha Técnica & Detalle Mayorista**: Modal interactivo para cada producto con especificaciones de embalaje, unidades por caja, compra mínima requerida y stock disponible en depósito.
- **Cotizador Persistente**: Carrito con memoria en el navegador (`localStorage`) para que el cliente no pierda los productos si recarga la página.
- **100% Estático & Costo Cero**: No requiere backend, bases de datos ni servidores costosos. Puede alojarse gratis en **GitHub Pages**, **Vercel** o **Netlify**.

---

## 📁 Estructura del Proyecto

```text
TiendaMayorista/
├── index.html                 # Estructura principal, secciones, drawers y modales
├── css/
│   └── styles.css             # Paleta de colores, animaciones, sombras y utilidades
├── js/
│   ├── config.js              # Configuración general (Nombre, WhatsApp, Moneda, FAQ)
│   ├── products.js            # Base de datos editable de productos y promociones
│   └── app.js                 # Lógica interactiva, filtros, carrito y generador WhatsApp
├── assets/
│   └── img/
│       └── placeholder.svg    # Imagen vectorial de respaldo si falla una foto externa
└── README.md                  # Documentación completa y guía de personalización
```

---

## ⚙️ Cómo Personalizar la Web (Paso a Paso)

### 1. Cambiar los datos de tu empresa y número de WhatsApp
Abre el archivo [`js/config.js`](file:///c:/Users/Usuario/Desktop/TiendaMayorista/js/config.js) y edita las siguientes líneas:

```javascript
const STORE_CONFIG = {
    // 1. Nombre de tu distribuidora
    businessName: "TU DISTRIBUIDORA MAYORISTA",
    tagline: "Alimentos, Bebidas y Golosinas al Mejor Precio por Bulto",

    // 2. Número de WhatsApp al que llegarán las cotizaciones
    // Importante: Código de país + código de área + número (SIN espacios, SIN guiones y SIN '+')
    // Ejemplos:
    // Argentina: "5491199998888"
    // México:    "5215512345678"
    // Colombia:  "573001234567"
    whatsappNumber: "5491199998888",

    // 3. Moneda y compra mínima sugerida
    currencySymbol: "$",
    minOrderAmount: 40000, // Monto mínimo en moneda local (pon 0 si no deseas límite)

    // 4. Ubicación y horarios del depósito
    address: "Ruta 8 Km 52, Parque Logístico - Nave 3",
    schedule: "Lunes a Viernes de 07:00 a 16:30 hs | Sábados de 08:00 a 12:30 hs"
};
```

---

### 2. Agregar, editar o eliminar productos
Abre [`js/products.js`](file:///c:/Users/Usuario/Desktop/TiendaMayorista/js/products.js). Cada producto es un objeto con la siguiente estructura:

```javascript
{
    id: 1,                                  // ID numérico único
    sku: "GOL-001",                         // Código para logística
    name: "Bombones de Chocolate Caja x24", // Nombre comercial del producto
    category: "golosinas",                  // 'golosinas' | 'bebidas' | 'snacks' | 'almacen'
    unitMeasure: "Caja ind.",               // Tipo de unidad ('Botella', 'Paquete', etc.)
    packSize: 24,                           // Cantidad de unidades por bulto/caja
    unitPrice: 1350,                        // Precio unitario equivalente
    packPrice: 29700,                       // Precio total del bulto cerrado
    oldPackPrice: 35000,                    // (Opcional) Precio tachado si está de oferta
    minPacks: 1,                            // Cantidad mínima de bultos
    stockStatus: "in_stock",                // 'in_stock' | 'low_stock'
    stockUnits: 140,                        // Bultos estimados disponibles
    badge: "🔥 OFERTA 15% OFF",             // Etiqueta destacada
    isPromo: true,                          // true = Aparece en el carrusel de promos del inicio
    image: "https://tudominio.com/foto.jpg", // Enlace de imagen o ruta local
    description: "Caja cerrada de 24 unidades. Ideal para kioscos y minimarkets."
}
```

> **Consejo para las Fotos:** Puedes usar fotos subidas a tu propio hosting en `assets/img/productos/`, o enlaces directos seguros de catálogos web.

---

### 3. Personalizar Colores o Estilo Visual
Si deseas ajustar la paleta de colores, edita las variables CSS en [`css/styles.css`](file:///c:/Users/Usuario/Desktop/TiendaMayorista/css/styles.css):

```css
:root {
    --brand-red: #D91A2A;        /* Rojo principal de marca */
    --brand-red-dark: #B31220;   /* Rojo oscuro para hover */
    --brand-yellow: #FFC72C;     /* Amarillo dorado de acento */
    --brand-yellow-hover: #EBB215;
    --brand-dark: #1E1E24;       /* Textos principales */
    --brand-bg: #F8FAFC;         /* Fondo de la web */
}
```

---

## 📲 Cómo se ve el Mensaje generado en WhatsApp

Cuando el cliente presiona **"Enviar Cotización por WhatsApp"**, la web abre automáticamente la conversación con el vendedor conteniendo un mensaje perfectamente legible:

```text
🛒 *SOLICITUD DE COTIZACIÓN MAYORISTA*
🏢 *Para:* DISTRIBUIDORA MAYORISTA CENTRAL
📅 *Fecha:* 08/10/2026 16:30
👤 *Comercio / Razón Social:* Maxikiosco San Martín
📍 *Localidad / Destino:* Morón, Buenos Aires
-------------------------------------------
*DETALLE DE PRODUCTOS SOLICITADOS:*

*1. Bombones de Chocolate Rellenos de Avellana*
   • Código: GOL-001
   • Cantidad: *2 bulto(s)* (48 Caja ind.s)
   • Precio Bulto: $ 29.700
   • Subtotal estimado: *$ 59.400*

*2. Gaseosa Cola Clásica 2.25 Litros*
   • Código: BEB-101
   • Cantidad: *3 bulto(s)* (18 Botella 2.25Ls)
   • Precio Bulto: $ 13.230
   • Subtotal estimado: *$ 39.690*

-------------------------------------------
📦 *Total de Bultos Cerrados:* 5
🔢 *Total de Unidades Físicas:* 66
💰 *TOTAL ESTIMADO COTIZACIÓN:* *$ 99.090*
-------------------------------------------

👋 Hola! Les comparto mi lista de cotización armada desde su catálogo web. Aguardo confirmación de stock, condiciones de entrega y datos para concretar el pedido. Gracias!
```

---

## 🚀 Opciones para Publicar la Web Gratis en Internet

Al ser un sitio web puramente estático (HTML, CSS y JS), se puede publicar gratis en menos de 2 minutos mediante cualquiera de estas opciones:

### Opción A: Vercel (Recomendado - 1 minuto)
1. Ve a [vercel.com](https://vercel.com) y crea una cuenta gratuita.
2. Arrastra la carpeta `TiendaMayorista` a la pantalla de Vercel (o conéctala mediante tu repositorio de GitHub).
3. Haz clic en **Deploy**. ¡Listo! Tendrás una dirección como `tutiendamayorista.vercel.app` con certificado SSL gratuito (https) y máxima velocidad.

### Opción B: Netlify (Muy fácil con Drag & Drop)
1. Entra a [netlify.com](https://netlify.com).
2. En la sección "Sites", arrastra la carpeta completa `TiendaMayorista`.
3. Tu catálogo quedará publicado inmediatamente en un subdominio `tunegocio.netlify.app`.

### Opción C: GitHub Pages
1. Sube los archivos a un repositorio en GitHub.
2. Ve a **Settings** > **Pages**.
3. Selecciona la rama `main` y la carpeta `/ (root)`.
4. Guarda y en 30 segundos estará activo en `tuusuario.github.io/TiendaMayorista`.

### Opción D: Hosting Tradicional / cPanel
Sube todos los archivos directamente a la carpeta `public_html` de tu proveedor de hosting mediante Administrador de Archivos o FTP.

---

## 🛠️ Vista Previa Local (Pruebas en tu computadora)

Para abrir la web localmente:
- Haz doble clic en el archivo `index.html` para abrirlo directamente en tu navegador habitual (Chrome, Edge, Firefox).
- O si prefieres ejecutar un servidor local con Python o Node:
  ```bash
  # Con Python:
  python -m http.server 8080
  # Luego abre: http://localhost:8080 en tu navegador
  ```

---

## 💡 Buenas Prácticas Comerciales
1. **Actualización de Precios**: Recomendamos revisar semanalmente `packPrice` y `unitPrice` en `js/products.js` para mantener las cotizaciones sincronizadas con el valor de reposición.
2. **Promociones Destacadas**: Mantén siempre entre 2 y 4 productos con `isPromo: true` para que la parte superior de la página muestre dinamismo y ofertas vigentes atractivas.
3. **Monto Mínimo de Pedido**: Configura `minOrderAmount` en `js/config.js` acorde a la escala de rentabilidad de tu logística de reparto.
