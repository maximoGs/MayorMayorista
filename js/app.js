/**
 * APLICACIÓN PRINCIPAL DE COTIZACIÓN MAYORISTA
 * Gestiona el catálogo, filtros, buscador, carrito en LocalStorage,
 * cálculo de totales y generación del mensaje de WhatsApp.
 */

// Estado global de la aplicación
const AppState = {
    products: [...PRODUCTS_DATA],
    cart: JSON.parse(localStorage.getItem('mayorista_quote_cart')) || [],
    currentCategory: 'todas',
    searchQuery: '',
    sortBy: 'promo_first',
    onlyStock: false,
    selectedProductModal: null
};

// Formateador de moneda
function formatMoney(amount) {
    const symbol = STORE_CONFIG.currencySymbol || "$";
    return `${symbol} ${Number(amount).toLocaleString('es-AR')}`;
}

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', () => {
    initStoreHeaderAndFooter();
    renderCategoriesNav();
    renderFeaturedPromos();
    renderProducts();
    updateCartUI();
    initEventListeners();
    lucide.createIcons();
});

// Cargar datos de configuración en la interfaz
function initStoreHeaderAndFooter() {
    // Nombre del negocio
    document.querySelectorAll('.store-business-name').forEach(el => {
        el.textContent = STORE_CONFIG.businessName;
    });

    // Tagline
    document.querySelectorAll('.store-tagline').forEach(el => {
        el.textContent = STORE_CONFIG.tagline;
    });

    // Barra de anuncios ticker
    const tickerEl = document.getElementById('promo-ticker-text');
    if (tickerEl) {
        tickerEl.textContent = STORE_CONFIG.badgePromoHeader;
    }

    // Horario y dirección
    const addressEl = document.getElementById('store-address');
    if (addressEl) addressEl.textContent = STORE_CONFIG.address;

    const scheduleEl = document.getElementById('store-schedule');
    if (scheduleEl) scheduleEl.textContent = STORE_CONFIG.schedule;

    // Compra mínima sugerida
    const minOrderNoticeEl = document.getElementById('min-order-notice');
    if (minOrderNoticeEl && STORE_CONFIG.minOrderAmount > 0) {
        minOrderNoticeEl.textContent = `Compra mínima sugerida: ${formatMoney(STORE_CONFIG.minOrderAmount)}`;
    }

    // Renderizar beneficios en sección de confianza
    const featuresContainer = document.getElementById('features-container');
    if (featuresContainer && STORE_CONFIG.features) {
        featuresContainer.innerHTML = STORE_CONFIG.features.map(f => `
            <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-start gap-4 hover:border-red-200 transition-colors">
                <div class="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                    <i data-lucide="${f.icon}" class="w-6 h-6 stroke-[2.2]"></i>
                </div>
                <div>
                    <h4 class="font-bold text-gray-900 text-base mb-1">${f.title}</h4>
                    <p class="text-sm text-gray-600 leading-relaxed">${f.desc}</p>
                </div>
            </div>
        `).join('');
    }

    // Renderizar Preguntas Frecuentes
    const faqContainer = document.getElementById('faq-accordion');
    if (faqContainer && STORE_CONFIG.faqs) {
        faqContainer.innerHTML = STORE_CONFIG.faqs.map((faq, idx) => `
            <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <button class="w-full px-6 py-4 text-left font-bold text-gray-900 flex justify-between items-center hover:bg-slate-50 transition-colors" onclick="toggleFaq(${idx})">
                    <span class="flex items-center gap-3">
                        <span class="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs font-black flex items-center justify-center">Q</span>
                        ${faq.q}
                    </span>
                    <i data-lucide="chevron-down" id="faq-chevron-${idx}" class="w-5 h-5 text-gray-400 transition-transform"></i>
                </button>
                <div id="faq-answer-${idx}" class="hidden px-6 pb-4 pt-1 text-sm text-gray-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    ${faq.a}
                </div>
            </div>
        `).join('');
    }
}

// Toggle para acordeón FAQ
window.toggleFaq = function(idx) {
    const ans = document.getElementById(`faq-answer-${idx}`);
    const chev = document.getElementById(`faq-chevron-${idx}`);
    if (ans.classList.contains('hidden')) {
        ans.classList.remove('hidden');
        chev.style.transform = 'rotate(180deg)';
    } else {
        ans.classList.add('hidden');
        chev.style.transform = 'rotate(0deg)';
    }
};

// Renderizar botones de categorías
function renderCategoriesNav() {
    const container = document.getElementById('category-pills-container');
    if (!container) return;

    container.innerHTML = STORE_CONFIG.categories.map(cat => {
        const isActive = cat.id === AppState.currentCategory;
        const count = cat.id === 'todas' 
            ? AppState.products.length 
            : cat.id === 'promos' 
                ? AppState.products.filter(p => p.isPromo).length
                : AppState.products.filter(p => p.category === cat.id).length;

        return `
            <button onclick="setCategory('${cat.id}')" 
                class="category-pill whitespace-nowrap px-4 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    isActive 
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30 ring-2 ring-red-600 ring-offset-2' 
                    : 'bg-white text-gray-700 hover:bg-amber-50 hover:text-red-700 border border-slate-200 shadow-sm'
                }">
                <span>${cat.name}</span>
                <span class="text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-red-700/80 text-white' : 'bg-slate-100 text-gray-600'}">${count}</span>
            </button>
        `;
    }).join('');
}

// Cambiar categoría activa
window.setCategory = function(catId) {
    AppState.currentCategory = catId;
    renderCategoriesNav();
    renderProducts();
    
    // Smooth scroll hacia la lista de productos si estamos abajo
    const catalogSection = document.getElementById('catalog-section');
    if (catalogSection && window.scrollY > catalogSection.offsetTop) {
        catalogSection.scrollIntoView({ behavior: 'smooth' });
    }
};

// Renderizar Promociones Destacadas en el Hero Banner
function renderFeaturedPromos() {
    const container = document.getElementById('featured-promos-grid');
    if (!container) return;

    const promos = PRODUCTS_DATA.filter(p => p.isPromo).slice(0, 4);

    if (promos.length === 0) {
        container.innerHTML = `
            <div class="col-span-full py-8 px-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-center flex flex-col items-center justify-center">
                <i data-lucide="package-open" class="w-10 h-10 text-amber-300 mb-2"></i>
                <p class="text-sm font-bold text-white">Sin ofertas destacadas en este momento</p>
                <p class="text-xs text-red-200 mt-1">El inventario se encuentra actualmente vacío.</p>
            </div>
        `;
        if (window.lucide) lucide.createIcons();
        return;
    }

    container.innerHTML = promos.map(product => {
        const savings = product.oldPackPrice ? product.oldPackPrice - product.packPrice : 0;
        return `
            <div class="bg-white rounded-2xl border-2 border-amber-300 p-4 shadow-lg hover:shadow-xl transition-all relative flex flex-col justify-between group overflow-hidden">
                <div class="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl shadow z-10">
                    ${product.badge || 'PROMO'}
                </div>
                
                <div>
                    <div class="h-36 rounded-xl overflow-hidden bg-slate-50 relative mb-3 flex items-center justify-center">
                        <img src="${product.image}" alt="${product.name}" onerror="this.onerror=null; this.src='assets/img/placeholder.svg';" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy">
                        <span class="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-semibold px-2 py-0.5 rounded">
                            Bulto x ${product.packSize} ${product.unitMeasure}s
                        </span>
                    </div>

                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">${product.sku}</p>
                    <h3 class="font-bold text-gray-900 text-sm leading-tight mb-2 line-clamp-2">${product.name}</h3>
                </div>

                <div class="pt-2 border-t border-slate-100">
                    <div class="flex items-baseline gap-2 mb-2">
                        <span class="text-xl font-black text-red-600">${formatMoney(product.packPrice)}</span>
                        ${product.oldPackPrice ? `<span class="text-xs text-gray-400 line-through">${formatMoney(product.oldPackPrice)}</span>` : ''}
                    </div>
                    <p class="text-[11px] text-gray-500 mb-3">
                        ${formatMoney(product.unitPrice)} por ${product.unitMeasure}
                    </p>

                    <button onclick="addToCartQuick(${product.id})" class="w-full py-2.5 rounded-xl btn-yellow text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer">
                        <i data-lucide="plus-circle" class="w-4 h-4"></i>
                        <span>Sumar a Cotización</span>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Filtrar y ordenar productos
function getFilteredProducts() {
    let list = [...AppState.products];

    // Filtro por categoría
    if (AppState.currentCategory === 'promos') {
        list = list.filter(p => p.isPromo);
    } else if (AppState.currentCategory !== 'todas') {
        list = list.filter(p => p.category === AppState.currentCategory);
    }

    // Filtro por buscador (nombre, sku, descripción)
    if (AppState.searchQuery.trim() !== '') {
        const query = AppState.searchQuery.toLowerCase().trim();
        list = list.filter(p => 
            p.name.toLowerCase().includes(query) ||
            p.sku.toLowerCase().includes(query) ||
            (p.description && p.description.toLowerCase().includes(query))
        );
    }

    // Filtro por solo stock
    if (AppState.onlyStock) {
        list = list.filter(p => p.stockStatus === 'in_stock');
    }

    // Ordenamiento
    switch (AppState.sortBy) {
        case 'promo_first':
            list.sort((a, b) => (b.isPromo ? 1 : 0) - (a.isPromo ? 1 : 0));
            break;
        case 'price_asc':
            list.sort((a, b) => a.packPrice - b.packPrice);
            break;
        case 'price_desc':
            list.sort((a, b) => b.packPrice - a.packPrice);
            break;
        case 'name_asc':
            list.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }

    return list;
}

// Renderizar el catálogo principal de productos
function renderProducts() {
    const container = document.getElementById('products-grid');
    const emptyState = document.getElementById('empty-products-state');
    const counterEl = document.getElementById('products-counter');

    if (!container) return;

    const products = getFilteredProducts();

    if (counterEl) {
        counterEl.textContent = `${products.length} producto${products.length === 1 ? '' : 's'} disponible${products.length === 1 ? '' : 's'}`;
    }

    if (products.length === 0) {
        container.innerHTML = '';
        if (emptyState) {
            emptyState.classList.remove('hidden');
            const titleEl = emptyState.querySelector('h3');
            const descEl = emptyState.querySelector('p');
            const resetBtn = emptyState.querySelector('button');
            if (AppState.products.length === 0) {
                if (titleEl) titleEl.textContent = 'Inventario Vacío';
                if (descEl) descEl.textContent = 'Actualmente no hay productos cargados en el catálogo. Agrega nuevos productos en js/products.js para comenzar.';
                if (resetBtn) resetBtn.classList.add('hidden');
            } else {
                if (titleEl) titleEl.textContent = 'No se encontraron productos';
                if (descEl) descEl.textContent = 'No encontramos artículos que coincidan con tu búsqueda. Intenta con otra palabra o revisa las demás categorías.';
                if (resetBtn) resetBtn.classList.remove('hidden');
            }
        }
        return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    container.innerHTML = products.map(product => {
        const cartItem = AppState.cart.find(item => item.id === product.id);
        const quantityInCart = cartItem ? cartItem.packs : 0;
        const isLowStock = product.stockStatus === 'low_stock';

        return `
            <div class="product-card rounded-2xl overflow-hidden flex flex-col justify-between" id="product-card-${product.id}">
                <!-- Contenedor Imagen y Badges -->
                <div>
                    <div class="product-image-container h-48 sm:h-52 w-full flex items-center justify-center p-2 relative">
                        <img src="${product.image}" alt="${product.name}" onerror="this.onerror=null; this.src='assets/img/placeholder.svg';" class="product-image w-full h-full object-cover rounded-xl" loading="lazy">
                        
                        <!-- Badges Superiores -->
                        <div class="absolute top-3 left-3 flex flex-col gap-1 z-10">
                            ${product.badge ? `
                                <span class="badge-promo text-[11px] px-2.5 py-1 rounded-lg uppercase shadow">
                                    ${product.badge}
                                </span>
                            ` : ''}
                        </div>

                        <!-- Indicador de Stock -->
                        <div class="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm flex items-center gap-1.5 z-10">
                            <span class="stock-dot ${isLowStock ? 'stock-low' : 'stock-in'}"></span>
                            <span class="${isLowStock ? 'text-amber-700' : 'text-emerald-700'}">
                                ${isLowStock ? 'Últimos bultos' : 'Stock Inmediato'}
                            </span>
                        </div>
                    </div>

                    <!-- Información del Producto -->
                    <div class="p-4 sm:p-5">
                        <div class="flex items-center justify-between text-xs text-gray-500 font-semibold mb-1">
                            <span class="tracking-wider uppercase text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded">${product.sku}</span>
                            <span>Mínimo: ${product.minPacks} bulto${product.minPacks > 1 ? 's' : ''}</span>
                        </div>

                        <h3 class="font-bold text-gray-900 text-base mb-2 leading-snug line-clamp-2 hover:text-red-600 transition-colors cursor-pointer" onclick="openProductModal(${product.id})">
                            ${product.name}
                        </h3>

                        <p class="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                            ${product.description}
                        </p>

                        <!-- Desglose de Precios Mayoristas -->
                        <div class="bg-amber-50/60 rounded-xl p-3 border border-amber-200/60 mb-4">
                            <div class="flex items-baseline justify-between mb-1">
                                <span class="text-xs text-gray-700 font-bold">Precio Bulto Cerrado:</span>
                                <div class="text-right">
                                    <span class="text-lg font-black text-red-600">${formatMoney(product.packPrice)}</span>
                                    ${product.oldPackPrice ? `<span class="text-xs text-gray-400 line-through ml-1">${formatMoney(product.oldPackPrice)}</span>` : ''}
                                </div>
                            </div>
                            <div class="flex items-center justify-between text-[11px] text-gray-600 pt-1 border-t border-amber-200/40">
                                <span>Contenido: <strong>${product.packSize} ${product.unitMeasure}s</strong></span>
                                <span>Equiv.: <strong>${formatMoney(product.unitPrice)}/u</strong></span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Selector de Cantidad y Botón de Cotización -->
                <div class="p-4 sm:p-5 pt-0">
                    <div class="flex items-center gap-2">
                        <!-- Control de cantidad de bultos -->
                        <div class="flex items-center border border-slate-300 rounded-xl bg-slate-50 overflow-hidden shrink-0">
                            <button onclick="decrementCardQuantity(${product.id})" class="w-9 h-10 flex items-center justify-center text-gray-600 hover:bg-slate-200 font-bold transition-colors">
                                -
                            </button>
                            <input type="number" id="qty-input-${product.id}" value="${quantityInCart > 0 ? quantityInCart : product.minPacks}" min="${product.minPacks}" class="w-12 h-10 text-center font-bold text-sm bg-transparent border-none focus:outline-none focus:ring-0">
                            <button onclick="incrementCardQuantity(${product.id})" class="w-9 h-10 flex items-center justify-center text-gray-600 hover:bg-slate-200 font-bold transition-colors">
                                +
                            </button>
                        </div>

                        <!-- Botón Agregar -->
                        <button onclick="handleAddFromCard(${product.id})" class="flex-1 h-10 rounded-xl ${quantityInCart > 0 ? 'bg-red-600 text-white hover:bg-red-700' : 'btn-yellow'} font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm">
                            <i data-lucide="${quantityInCart > 0 ? 'check' : 'shopping-bag'}" class="w-4 h-4"></i>
                            <span>${quantityInCart > 0 ? `En Cotización (${quantityInCart})` : 'Agregar'}</span>
                        </button>
                    </div>

                    <!-- Botón ver ficha técnica -->
                    <button onclick="openProductModal(${product.id})" class="w-full text-center text-xs font-semibold text-gray-500 hover:text-red-600 pt-3 flex items-center justify-center gap-1 cursor-pointer">
                        <i data-lucide="info" class="w-3.5 h-3.5"></i>
                        <span>Ver detalles y ficha de bulto</span>
                    </button>
                </div>
            </div>
        `;
    }).join('');

    lucide.createIcons();
}

// Controladores de incremento/decremento en la tarjeta
window.incrementCardQuantity = function(productId) {
    const input = document.getElementById(`qty-input-${productId}`);
    if (input) {
        input.value = parseInt(input.value || 1) + 1;
    }
};

window.decrementCardQuantity = function(productId) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    const input = document.getElementById(`qty-input-${productId}`);
    if (input && product) {
        const current = parseInt(input.value || 1);
        if (current > product.minPacks) {
            input.value = current - 1;
        }
    }
};

// Agregar a cotización desde tarjeta de catálogo
window.handleAddFromCard = function(productId) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    const input = document.getElementById(`qty-input-${productId}`);
    if (!product) return;

    let packs = parseInt(input ? input.value : product.minPacks);
    if (isNaN(packs) || packs < product.minPacks) {
        packs = product.minPacks;
    }

    addToCart(product, packs);
    showToast(`Agregaste ${packs} bulto(s) de ${product.name}`);
};

// Agregar rápido 1 bulto (o el mínimo) desde el banner
window.addToCartQuick = function(productId) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;
    addToCart(product, product.minPacks);
    showToast(`Agregado a la cotización: ${product.name}`);
};

// Lógica de Carrito / Cotizador
function addToCart(product, packs) {
    const existingIndex = AppState.cart.findIndex(item => item.id === product.id);

    if (existingIndex > -1) {
        AppState.cart[existingIndex].packs = packs;
    } else {
        AppState.cart.push({
            id: product.id,
            sku: product.sku,
            name: product.name,
            packPrice: product.packPrice,
            packSize: product.packSize,
            unitMeasure: product.unitMeasure,
            image: product.image,
            minPacks: product.minPacks,
            packs: packs
        });
    }

    saveCart();
    updateCartUI();
    renderProducts();

    // Efecto visual en el botón de carrito
    const cartBtn = document.getElementById('open-cart-btn');
    if (cartBtn) {
        cartBtn.classList.add('cart-bounce');
        setTimeout(() => cartBtn.classList.remove('cart-bounce'), 400);
    }
}

// Modificar cantidad desde el cajón de cotización
window.updateCartItemQuantity = function(productId, delta) {
    const item = AppState.cart.find(i => i.id === productId);
    if (!item) return;

    const newPacks = item.packs + delta;
    if (newPacks < item.minPacks) {
        // Confirmar eliminación si baja del mínimo
        removeCartItem(productId);
        return;
    }

    item.packs = newPacks;
    saveCart();
    updateCartUI();
    renderProducts();
};

// Eliminar ítem de cotización
window.removeCartItem = function(productId) {
    AppState.cart = AppState.cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
    renderProducts();
    showToast('Producto quitado de la lista');
};

// Vaciar cotización completa
window.clearCart = function() {
    if (AppState.cart.length === 0) return;
    if (confirm('¿Deseas vaciar todos los productos de tu cotización?')) {
        AppState.cart = [];
        saveCart();
        updateCartUI();
        renderProducts();
        showToast('Cotización vaciada');
    }
};

// Guardar en LocalStorage
function saveCart() {
    localStorage.setItem('mayorista_quote_cart', JSON.stringify(AppState.cart));
}

// Actualizar Interfaz del Carrito / Cotizador
function updateCartUI() {
    const count = AppState.cart.reduce((sum, item) => sum + item.packs, 0);
    const subtotal = AppState.cart.reduce((sum, item) => sum + (item.packPrice * item.packs), 0);
    const totalUnits = AppState.cart.reduce((sum, item) => sum + (item.packSize * item.packs), 0);

    // Actualizar badges numéricos
    document.querySelectorAll('.cart-count-badge').forEach(el => {
        el.textContent = count;
        el.style.display = count > 0 ? 'inline-flex' : 'none';
    });

    // Actualizar totales en el Drawer
    const totalPacksEl = document.getElementById('cart-total-packs');
    if (totalPacksEl) totalPacksEl.textContent = `${count} bultos`;

    const totalUnitsEl = document.getElementById('cart-total-units');
    if (totalUnitsEl) totalUnitsEl.textContent = `${totalUnits.toLocaleString('es-AR')} unidades físicas`;

    document.querySelectorAll('.cart-subtotal-display').forEach(el => {
        el.textContent = formatMoney(subtotal);
    });

    // Comprobación de monto mínimo
    const minWarningEl = document.getElementById('cart-min-warning');
    const sendBtn = document.getElementById('btn-send-whatsapp');
    if (minWarningEl && sendBtn) {
        if (STORE_CONFIG.minOrderAmount > 0 && subtotal < STORE_CONFIG.minOrderAmount && count > 0) {
            const diff = STORE_CONFIG.minOrderAmount - subtotal;
            minWarningEl.innerHTML = `⚠️ Falta <strong>${formatMoney(diff)}</strong> para alcanzar la compra mínima mayorista (${formatMoney(STORE_CONFIG.minOrderAmount)}).`;
            minWarningEl.classList.remove('hidden');
        } else {
            minWarningEl.classList.add('hidden');
        }
    }

    // Renderizar lista en el Drawer
    renderCartDrawerItems();
    lucide.createIcons();
}

// Renderizar ítems dentro del cajón lateral
function renderCartDrawerItems() {
    const container = document.getElementById('cart-items-container');
    const emptyState = document.getElementById('cart-empty-state');
    const footer = document.getElementById('cart-drawer-footer');

    if (!container) return;

    if (AppState.cart.length === 0) {
        container.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        if (footer) footer.classList.add('hidden');
        return;
    }

    if (emptyState) emptyState.classList.add('hidden');
    if (footer) footer.classList.remove('hidden');

    container.innerHTML = AppState.cart.map(item => {
        const itemTotal = item.packPrice * item.packs;
        const totalUnitsItem = item.packSize * item.packs;

        return `
            <div class="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm flex gap-3 items-center">
                <img src="${item.image}" alt="${item.name}" onerror="this.onerror=null; this.src='assets/img/placeholder.svg';" class="w-16 h-16 object-cover rounded-lg shrink-0 border border-slate-100">
                
                <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between gap-2">
                        <h4 class="font-bold text-gray-900 text-xs sm:text-sm leading-tight truncate">${item.name}</h4>
                        <button onclick="removeCartItem(${item.id})" class="text-gray-400 hover:text-red-600 transition-colors shrink-0 p-1" title="Eliminar">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>

                    <div class="text-[11px] text-gray-500 mb-2">
                        SKU: <span class="font-semibold text-gray-700">${item.sku}</span> | ${item.packSize} ${item.unitMeasure}s por bulto (${totalUnitsItem} unids.)
                    </div>

                    <div class="flex items-center justify-between">
                        <!-- Control de cantidad -->
                        <div class="flex items-center border border-slate-300 rounded-lg bg-slate-50 overflow-hidden">
                            <button onclick="updateCartItemQuantity(${item.id}, -1)" class="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-slate-200 font-bold transition-colors">
                                -
                            </button>
                            <span class="w-9 text-center font-bold text-xs text-gray-900">${item.packs} b.</span>
                            <button onclick="updateCartItemQuantity(${item.id}, 1)" class="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-slate-200 font-bold transition-colors">
                                +
                            </button>
                        </div>

                        <!-- Subtotal del ítem -->
                        <div class="text-right">
                            <span class="font-extrabold text-sm text-red-600">${formatMoney(itemTotal)}</span>
                            <div class="text-[10px] text-gray-400">${formatMoney(item.packPrice)} / bulto</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Modal de Detalle / Ficha Técnica
window.openProductModal = function(productId) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;

    AppState.selectedProductModal = product;
    const modal = document.getElementById('product-detail-modal');
    const content = document.getElementById('product-modal-content');

    if (!modal || !content) return;

    content.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <!-- Imagen y Badges -->
            <div class="rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 relative">
                <img src="${product.image}" alt="${product.name}" onerror="this.onerror=null; this.src='assets/img/placeholder.svg';" class="w-full h-72 object-cover">
                ${product.badge ? `
                    <div class="absolute top-3 left-3 badge-promo text-xs px-3 py-1 rounded-lg uppercase">
                        ${product.badge}
                    </div>
                ` : ''}
            </div>

            <!-- Ficha Técnica y Cotización -->
            <div>
                <div class="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    <span>${product.sku}</span>
                    <span>•</span>
                    <span class="text-red-600">${product.category.toUpperCase()}</span>
                </div>

                <h2 class="text-2xl font-black text-gray-900 leading-tight mb-3">${product.name}</h2>
                <p class="text-sm text-gray-600 leading-relaxed mb-4">${product.description}</p>

                <!-- Tarjeta de Desglose Mayorista -->
                <div class="bg-amber-50/70 rounded-2xl p-4 border border-amber-200 mb-6">
                    <div class="flex justify-between items-baseline mb-2">
                        <span class="text-sm font-bold text-gray-800">Precio por Bulto Cerrado:</span>
                        <div class="text-right">
                            <span class="text-2xl font-black text-red-600">${formatMoney(product.packPrice)}</span>
                            ${product.oldPackPrice ? `<span class="text-xs text-gray-400 line-through ml-2">${formatMoney(product.oldPackPrice)}</span>` : ''}
                        </div>
                    </div>

                    <div class="space-y-1.5 text-xs text-gray-600 border-t border-amber-200/60 pt-2">
                        <div class="flex justify-between">
                            <span>Unidades por Bulto:</span>
                            <span class="font-bold text-gray-900">${product.packSize} ${product.unitMeasure}s</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Costo individual equivalente:</span>
                            <span class="font-bold text-gray-900">${formatMoney(product.unitPrice)}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Compra mínima obligatoria:</span>
                            <span class="font-bold text-gray-900">${product.minPacks} bulto (${product.minPacks * product.packSize} unidades)</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Disponibilidad en depósito:</span>
                            <span class="font-bold text-emerald-700">Aprox. ${product.stockUnits} bultos en nave</span>
                        </div>
                    </div>
                </div>

                <!-- Botón de Agregar -->
                <div class="flex gap-3">
                    <button onclick="handleAddFromModal(${product.id})" class="flex-1 py-3.5 rounded-xl btn-yellow font-black text-sm flex items-center justify-center gap-2 cursor-pointer">
                        <i data-lucide="plus" class="w-5 h-5"></i>
                        <span>Agregar ${product.minPacks} Bulto(s) al Cotizador</span>
                    </button>
                    <button onclick="closeProductModal()" class="px-5 py-3.5 rounded-xl border border-slate-300 text-gray-700 font-bold text-sm hover:bg-slate-100 transition-colors cursor-pointer">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    lucide.createIcons();
};

window.handleAddFromModal = function(productId) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;
    addToCart(product, product.minPacks);
    closeProductModal();
    showToast(`Sumaste ${product.name} a tu lista`);
};

window.closeProductModal = function() {
    const modal = document.getElementById('product-detail-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
};

// Control del Cajón / Drawer Lateral
window.openCartDrawer = function() {
    const drawer = document.getElementById('cart-drawer');
    const panel = document.getElementById('cart-drawer-panel');
    if (!drawer || !panel) return;

    drawer.classList.remove('hidden');
    setTimeout(() => {
        panel.classList.remove('translate-x-full');
    }, 10);
    document.body.style.overflow = 'hidden';
};

window.closeCartDrawer = function() {
    const drawer = document.getElementById('cart-drawer');
    const panel = document.getElementById('cart-drawer-panel');
    if (!drawer || !panel) return;

    panel.classList.add('translate-x-full');
    setTimeout(() => {
        drawer.classList.add('hidden');
        document.body.style.overflow = '';
    }, 300);
};

// GENERACIÓN DEL MENSAJE Y ENVÍO POR WHATSAPP
window.sendQuoteViaWhatsApp = function() {
    if (AppState.cart.length === 0) {
        alert('Tu lista de cotización está vacía. Selecciona productos antes de enviar.');
        return;
    }

    const clientNameInput = document.getElementById('client-business-name');
    const clientCityInput = document.getElementById('client-city');

    const businessName = clientNameInput ? clientNameInput.value.trim() : '';
    const city = clientCityInput ? clientCityInput.value.trim() : '';

    const totalPacks = AppState.cart.reduce((sum, item) => sum + item.packs, 0);
    const totalUnits = AppState.cart.reduce((sum, item) => sum + (item.packSize * item.packs), 0);
    const subtotal = AppState.cart.reduce((sum, item) => sum + (item.packPrice * item.packs), 0);

    // Construcción del mensaje preformateado
    let msg = `🛒 *SOLICITUD DE COTIZACIÓN MAYORISTA*\n`;
    msg += `🏢 *Para:* ${STORE_CONFIG.businessName}\n`;
    msg += `📅 *Fecha:* ${new Date().toLocaleDateString('es-AR')} ${new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}\n`;
    
    if (businessName) {
        msg += `👤 *Comercio / Razón Social:* ${businessName}\n`;
    }
    if (city) {
        msg += `📍 *Localidad / Destino:* ${city}\n`;
    }

    msg += `-------------------------------------------\n`;
    msg += `*DETALLE DE PRODUCTOS SOLICITADOS:*\n\n`;

    AppState.cart.forEach((item, index) => {
        const itemSubtotal = item.packPrice * item.packs;
        const totalItemUnits = item.packSize * item.packs;
        msg += `*${index + 1}. ${item.name}*\n`;
        msg += `   • Código: ${item.sku}\n`;
        msg += `   • Cantidad: *${item.packs} bulto(s)* (${totalItemUnits} ${item.unitMeasure}s)\n`;
        msg += `   • Precio Bulto: ${formatMoney(item.packPrice)}\n`;
        msg += `   • Subtotal estimado: *${formatMoney(itemSubtotal)}*\n\n`;
    });

    msg += `-------------------------------------------\n`;
    msg += `📦 *Total de Bultos Cerrados:* ${totalPacks}\n`;
    msg += `🔢 *Total de Unidades Físicas:* ${totalUnits.toLocaleString('es-AR')}\n`;
    msg += `💰 *TOTAL ESTIMADO COTIZACIÓN:* *${formatMoney(subtotal)}*\n`;
    msg += `-------------------------------------------\n\n`;
    msg += `👋 _Hola! Les comparto mi lista de cotización armada desde su catálogo web. Aguardo confirmación de stock, condiciones de entrega y datos para concretar el pedido. Gracias!_`;

    const encodedMsg = encodeURIComponent(msg);
    const waUrl = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodedMsg}`;

    // Abrir WhatsApp en nueva pestaña
    window.open(waUrl, '_blank');
};

// Notificación Toast flotante
function showToast(message) {
    const toast = document.getElementById('toast-notification');
    const toastMsg = document.getElementById('toast-message');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    toast.classList.remove('opacity-0', 'translate-y-6', 'pointer-events-none');
    toast.classList.add('opacity-100', 'translate-y-0');

    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-6', 'pointer-events-none');
        toast.classList.remove('opacity-100', 'translate-y-0');
    }, 2800);
}

// Inicializar escuchas de eventos (Buscador, Orden, Teclado)
function initEventListeners() {
    // Buscador en tiempo real con debounce sutil
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            AppState.searchQuery = e.target.value;
            renderProducts();
        });
    }

    // Selector de orden
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            AppState.sortBy = e.target.value;
            renderProducts();
        });
    }

    // Checkbox solo stock
    const stockCheckbox = document.getElementById('stock-only-checkbox');
    if (stockCheckbox) {
        stockCheckbox.addEventListener('change', (e) => {
            AppState.onlyStock = e.target.checked;
            renderProducts();
        });
    }

    // Tecla Escape para cerrar modales
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeProductModal();
            closeCartDrawer();
        }
    });
}
