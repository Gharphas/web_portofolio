/* ==========================================================================
   KOPI SENJA - MODERN COFFEE SHOP INTERACTIVE SCRIPT
   ========================================================================== */

// 1. DATABASE MENU COFFEE SHOP
const menuData = [
  {
    id: 1,
    name: "Espresso Double Shot",
    category: "coffee",
    price: 25000,
    rating: 4.9,
    badge: "Best Seller",
    desc: "Ekstraksi kopi murni 100% biji Arabika pilihan dengan crema kental dan rasa otentik.",
    image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Caramel Macchiato",
    category: "coffee",
    price: 38000,
    rating: 4.9,
    badge: "Favorit",
    desc: "Paduan espresso hangat dengan vanila lembut, susu segar, dan saus karamel gurih manis.",
    image: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Senja Cold Brew Citrus",
    category: "cold",
    price: 35000,
    rating: 4.8,
    badge: "Signature",
    desc: "Kopi peram dingin 16 jam dengan sentuhan sirup jeruk segar yang sangat menyegarkan.",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Caffè Latte",
    category: "coffee",
    price: 32000,
    rating: 4.7,
    badge: "Classic",
    desc: "Perpaduan seimbang espresso premium dengan steamed milk lembut berkrim.",
    image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 5,
    name: "Iced Spanish Latte",
    category: "cold",
    price: 36000,
    rating: 4.9,
    badge: "Hot Deal",
    desc: "Espresso dingin dipadu susu kental manis dan susu murni yang rich dan manis pas.",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 6,
    name: "Matcha Artisan Latte",
    category: "non-coffee",
    price: 35000,
    rating: 4.8,
    badge: "Non-Coffee",
    desc: "Bubuk matcha kualitas premium impor Kyoto Jepang dengan susu hangat nan lembut.",
    image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 7,
    name: "Artisan Chocolate Hot",
    category: "non-coffee",
    price: 34000,
    rating: 4.8,
    badge: "Sweet",
    desc: "Cokelat hitam Belgia kental dipadu susu hangat dan taburan bubuk cokelat manis.",
    image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 8,
    name: "Butter Croissant Fresh",
    category: "pastry",
    price: 28000,
    rating: 4.9,
    badge: "Fresh Baked",
    desc: "Pastry khas Prancis yang sangat renyah di luar dan lembut berlapis di dalam.",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 9,
    name: "Basque Burnt Cheesecake",
    category: "pastry",
    price: 42000,
    rating: 5.0,
    badge: "Recommended",
    desc: "Kue keju khas Basque yang terpanggang gosong eksotis dengan tekstur sangat lumer.",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=800&auto=format&fit=crop"
  }
];

// 2. STATE MANAGEMENT
let cart = JSON.parse(localStorage.getItem('kopi_senja_cart')) || [];
let activeCategory = 'all';
let searchQuery = '';

// DOM Elements
const menuGrid = document.getElementById('menuGrid');
const categoryTabs = document.getElementById('categoryTabs');
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');

const cartToggleBtn = document.getElementById('cartToggleBtn');
const cartCloseBtn = document.getElementById('cartCloseBtn');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');

const cartBadge = document.getElementById('cartBadge');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartTax = document.getElementById('cartTax');
const cartTotal = document.getElementById('cartTotal');

const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const closeCheckoutModal = document.getElementById('closeCheckoutModal');
const checkoutForm = document.getElementById('checkoutForm');

const orderType = document.getElementById('orderType');
const tableNumGroup = document.getElementById('tableNumGroup');

const receiptModal = document.getElementById('receiptModal');
const receiptContent = document.getElementById('receiptContent');
const finishOrderBtn = document.getElementById('finishOrderBtn');

const navbar = document.getElementById('navbar');
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navLinks = document.getElementById('navLinks');
const toast = document.getElementById('toast');

// 3. INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  renderMenu();
  updateCartUI();
  setupEventListeners();
});

// 4. MENU RENDERER
function renderMenu() {
  menuGrid.innerHTML = '';

  const filtered = menuData.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    menuGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 0; color: var(--text-muted);">
        <i class="fa-solid fa-magnifying-glass" style="font-size: 2.5rem; margin-bottom: 16px; color: var(--text-dim);"></i>
        <h3>Menu tidak ditemukan</h3>
        <p>Coba gunakan kata kunci pencarian lain atau pilih kategori berbeda.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = 'menu-card';
    card.innerHTML = `
      <div class="menu-card-img-wrapper">
        <img src="${item.image}" alt="${item.name}" class="menu-card-img" loading="lazy">
        <span class="menu-badge">${item.badge}</span>
      </div>
      <div class="menu-card-body">
        <div class="menu-card-header">
          <h3 class="menu-title">${item.name}</h3>
          <span class="menu-rating"><i class="fa-solid fa-star"></i> ${item.rating}</span>
        </div>
        <p class="menu-desc">${item.desc}</p>
        <div class="menu-card-footer">
          <span class="menu-price">Rp ${item.price.toLocaleString('id-ID')}</span>
          <button class="add-cart-btn" onclick="addToCart(${item.id})">
            <i class="fa-solid fa-plus"></i> Tambah
          </button>
        </div>
      </div>
    `;
    menuGrid.appendChild(card);
  });
}

// 5. CART FUNCTIONS
function addToCart(id) {
  const item = menuData.find(m => m.id === id);
  if (!item) return;

  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }

  saveCart();
  updateCartUI();
  showToast(`"${item.name}" ditambahkan ke keranjang`);
}

function updateQuantity(id, change) {
  const item = cart.find(c => c.id === id);
  if (!item) return;

  item.qty += change;
  if (item.qty <= 0) {
    cart = cart.filter(c => c.id !== id);
  }

  saveCart();
  updateCartUI();
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem('kopi_senja_cart', JSON.stringify(cart));
}

function updateCartUI() {
  // Update badge count
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  cartBadge.textContent = totalItems;

  // Render items
  cartItemsContainer.innerHTML = '';
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="cart-empty">
        <i class="fa-solid fa-cart-flatbed font-size: 3rem;"></i>
        <p>Keranjang Anda masih kosong.</p>
        <small style="color: var(--text-dim)">Pilih menu favoritmu di atas!</small>
      </div>
    `;
    checkoutBtn.disabled = true;
  } else {
    checkoutBtn.disabled = false;
    cart.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-details">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">Rp ${(item.price * item.qty).toLocaleString('id-ID')}</div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
          </div>
        </div>
        <button class="remove-item-btn" onclick="removeFromCart(${item.id})" title="Hapus">
          <i class="fa-solid fa-trash"></i>
        </button>
      `;
      cartItemsContainer.appendChild(cartItem);
    });
  }

  // Calculate Subtotal & Taxes
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const tax = Math.round(subtotal * 0.1); // PB1 10%
  const total = subtotal + tax;

  cartSubtotal.textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
  cartTax.textContent = `Rp ${tax.toLocaleString('id-ID')}`;
  cartTotal.textContent = `Rp ${total.toLocaleString('id-ID')}`;
}

// 6. EVENT LISTENERS & DRAWER / MODAL HANDLERS
function setupEventListeners() {
  // Category tabs
  categoryTabs.addEventListener('click', (e) => {
    if (e.target.classList.contains('category-btn')) {
      document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');
      activeCategory = e.target.dataset.category;
      renderMenu();
    }
  });

  // Live Search
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    clearSearchBtn.style.display = searchQuery ? 'block' : 'none';
    renderMenu();
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    clearSearchBtn.style.display = 'none';
    renderMenu();
  });

  // Cart Drawer Toggles
  cartToggleBtn.addEventListener('click', openCartDrawer);
  cartCloseBtn.addEventListener('click', closeCartDrawer);
  cartOverlay.addEventListener('click', closeCartDrawer);

  // Navbar Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile Hamburger Menu
  hamburgerBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  // Checkout Modal
  checkoutBtn.addEventListener('click', () => {
    closeCartDrawer();
    openCheckoutModal();
  });

  closeCheckoutModal.addEventListener('click', () => {
    checkoutModal.classList.remove('active');
  });

  orderType.addEventListener('change', (e) => {
    if (e.target.value === 'Dine-in') {
      tableNumGroup.style.display = 'block';
      document.getElementById('tableNumber').required = true;
    } else {
      tableNumGroup.style.display = 'none';
      document.getElementById('tableNumber').required = false;
    }
  });

  // Checkout Form Submit
  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    processOrder();
  });

  // Finish Order Button
  finishOrderBtn.addEventListener('click', () => {
    receiptModal.classList.remove('active');
    cart = [];
    saveCart();
    updateCartUI();
  });

  // Contact Form Mock Submit
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Pesan Anda berhasil dikirim! Kami akan segera menghubungi Anda.');
      contactForm.reset();
    });
  }
}

function openCartDrawer() {
  cartDrawer.classList.add('active');
  cartOverlay.classList.add('active');
}

function closeCartDrawer() {
  cartDrawer.classList.remove('active');
  cartOverlay.classList.remove('active');
}

function openCheckoutModal() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + tax;
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

  document.getElementById('modalItemCount').textContent = `${totalQty} item`;
  document.getElementById('modalFinalTotal').textContent = `Rp ${total.toLocaleString('id-ID')}`;
  checkoutModal.classList.add('active');
}

function processOrder() {
  const name = document.getElementById('custName').value;
  const type = document.getElementById('orderType').value;
  const table = document.getElementById('tableNumber').value;
  const payment = document.getElementById('payMethod').value;
  const notes = document.getElementById('orderNotes').value;

  const orderId = 'SENJA-' + Math.floor(100000 + Math.random() * 900000);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + tax;
  const now = new Date().toLocaleString('id-ID');

  let itemsHtml = cart.map(item => `
    <div class="receipt-row">
      <span>${item.qty}x ${item.name}</span>
      <span>Rp ${(item.price * item.qty).toLocaleString('id-ID')}</span>
    </div>
  `).join('');

  receiptContent.innerHTML = `
    <div class="receipt-row">
      <span>No. Pesanan:</span>
      <strong>${orderId}</strong>
    </div>
    <div class="receipt-row">
      <span>Waktu:</span>
      <span>${now}</span>
    </div>
    <div class="receipt-row">
      <span>Pemesan:</span>
      <span>${name}</span>
    </div>
    <div class="receipt-row">
      <span>Tipe / Meja:</span>
      <span>${type} ${type === 'Dine-in' ? `(${table})` : ''}</span>
    </div>
    <div class="receipt-row">
      <span>Metode Bayar:</span>
      <span>${payment}</span>
    </div>
    ${notes ? `<div class="receipt-row"><span>Catatan:</span><span>${notes}</span></div>` : ''}
    
    <hr style="border: none; border-top: 1px dashed var(--border-color); margin: 12px 0;">
    
    ${itemsHtml}
    
    <hr style="border: none; border-top: 1px dashed var(--border-color); margin: 12px 0;">

    <div class="receipt-row">
      <span>Subtotal:</span>
      <span>Rp ${subtotal.toLocaleString('id-ID')}</span>
    </div>
    <div class="receipt-row">
      <span>Pajak (10%):</span>
      <span>Rp ${tax.toLocaleString('id-ID')}</span>
    </div>
    <div class="receipt-row" style="font-size: 1.05rem; font-weight: 700;">
      <span>Total Bayar:</span>
      <strong style="color: var(--primary);">Rp ${total.toLocaleString('id-ID')}</strong>
    </div>
  `;

  checkoutModal.classList.remove('active');
  receiptModal.classList.add('active');
}

function showToast(message) {
  document.getElementById('toastMessage').textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}
