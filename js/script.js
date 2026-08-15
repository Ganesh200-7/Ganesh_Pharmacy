/* ==========================================================================
   GANESH PHARMACY MEDICAL STORE - INTERACTIVE JAVASCRIPT
   Developer: B.Ganesh (3rd Year CSE Project)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initActiveNavLink();
  initMedicineFilter();
  initMedicineStore();
  initMedicineModal();
  initFaqAccordion();
  initContactForm();
});

/* --------------------------------------------------------------------------
   1. MOBILE DRAWER NAVIGATION
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileToggle');
  const closeBtn = document.getElementById('drawerClose');
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('drawerOverlay');

  if (!toggleBtn || !drawer || !overlay) return;

  function openMenu() {
    drawer.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    drawer.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);
}

/* --------------------------------------------------------------------------
   2. ACTIVE NAV LINK HIGHLIGHTING
   -------------------------------------------------------------------------- */
function initActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .drawer-link');

  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* --------------------------------------------------------------------------
   3. MEDICINES LIVE SEARCH & CATEGORY FILTERING
   -------------------------------------------------------------------------- */
function initMedicineFilter() {
  const searchInput = document.getElementById('medicineSearchInput');
  const categoryBtns = document.querySelectorAll('.category-btn');
  const productCards = document.querySelectorAll('.product-card');
  const noResultsMsg = document.getElementById('noResultsMessage');

  if (!productCards.length) return;

  let activeCategory = 'all';

  function filterProducts() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    let visibleCount = 0;

    productCards.forEach(card => {
      const category = card.getAttribute('data-category');
      const title = card.querySelector('.product-title').textContent.toLowerCase();
      const dosage = card.querySelector('.product-dosage') ? card.querySelector('.product-dosage').textContent.toLowerCase() : '';

      const matchesCategory = (activeCategory === 'all' || category === activeCategory);
      const matchesSearch = title.includes(query) || dosage.includes(query) || category.includes(query);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (noResultsMsg) {
      noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterProducts);
  }

  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-category');
      filterProducts();
    });
  });
}

/* --------------------------------------------------------------------------
   4. MEDICINE QUICK VIEW MODAL
   -------------------------------------------------------------------------- */
function initMedicineModal() {
  const modal = document.getElementById('medicineModal');
  const closeBtn = document.getElementById('modalClose');
  const viewBtns = document.querySelectorAll('.view-detail-btn');

  if (!modal) return;

  function closeModal() {
    modal.classList.remove('open');
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  viewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.product-card');
      if (!card) return;

      const title = card.querySelector('.product-title').textContent;
      const dosage = card.querySelector('.product-dosage').textContent;
      const price = card.querySelector('.product-price').textContent;
      const badge = card.querySelector('.badge').outerHTML;
      const imgBox = card.querySelector('.product-img-box');

      document.getElementById('modalTitle').textContent = title;
      document.getElementById('modalDosage').textContent = dosage;
      document.getElementById('modalPrice').textContent = price;
      document.getElementById('modalBadgeContainer').innerHTML = badge;

      const modalImgEl = document.getElementById('modalImg');
      if (modalImgEl && imgBox) {
        modalImgEl.parentElement.innerHTML = imgBox.innerHTML;
      }

      modal.classList.add('open');
    });
  });
}

/* --------------------------------------------------------------------------
   5. SERVICES FAQ ACCORDION
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   6. CONTACT FORM VALIDATION & TOAST UI
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const phoneInput = document.getElementById('contactPhone');
  const subjectSelect = document.getElementById('contactSubject');
  const messageInput = document.getElementById('contactMessage');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Reset error states
    document.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(el => el.classList.remove('error'));

    // Validate Name
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      setError(nameInput);
      isValid = false;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      setError(emailInput);
      isValid = false;
    }

    // Validate Phone (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    const cleanPhone = phoneInput.value.replace(/[\s\-\(\)]/g, '');
    if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
      setError(phoneInput);
      isValid = false;
    }

    // Validate Subject
    if (!subjectSelect.value) {
      setError(subjectSelect);
      isValid = false;
    }

    // Validate Message
    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      setError(messageInput);
      isValid = false;
    }

    if (isValid) {
      showToast('Thank you! Your message has been sent to Ganesh Pharmacy. We will contact you shortly.');
      form.reset();
    }
  });

  function setError(inputElement) {
    inputElement.classList.add('error');
  }
}
 
function initMedicineStore() {
  const medicines = [
    { id: 'med-1', name: 'Paracetamol 500mg', brand: 'GanesCare', dosage: '500mg', price: 40, rx: false, tags: ['paracetamol','paractemal','acetaminophen','dolo'] },
    { id: 'med-2', name: 'Dolo 650 (Paracetamol)', brand: 'Dolo', dosage: '650mg', price: 60, rx: false, tags: ['dolo','dolo650','paracetamol'] },
    { id: 'med-3', name: 'Cetirizine 10mg', brand: 'AllerFree', dosage: '10mg', price: 30, rx: false, tags: ['cetirizine','allergy'] },
    { id: 'med-4', name: 'Amoxicillin 500mg', brand: 'Amoxil', dosage: '500mg', price: 120, rx: true, tags: ['amoxicillin','antibiotic'] },
    { id: 'med-5', name: 'Multivitamin Syrup', brand: 'NutriPlus', dosage: '100ml', price: 150, rx: false, tags: ['multivitamin','syrup'] },
    { id: 'med-6', name: 'Ibuprofen 200mg', brand: 'PainAway', dosage: '200mg', price: 45, rx: false, tags: ['ibuprofen','pain'] }
  ];

  const medicinesListEl = document.getElementById('medicinesList');
  const searchInput = document.getElementById('medicineSearchInput');
  const cartItemsEl = document.getElementById('cartItems');
  const cartTotalEl = document.getElementById('cartTotal');
  const placeOrderBtn = document.getElementById('placeOrderBtn');
  const orderStatusArea = document.getElementById('orderStatusArea');
  const flowchart = document.getElementById('flowchart');
  const orderInfo = document.getElementById('orderInfo');

  if (!medicinesListEl || !searchInput) return;

  let cart = loadCart();

  renderMedicines(medicines);
  renderCart();

  // Filter medicines on search input (also supports simple tag matching and common typos)
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) return renderMedicines(medicines);
    const filtered = medicines.filter(m => {
      return m.name.toLowerCase().includes(q) || m.brand.toLowerCase().includes(q) || m.dosage.toLowerCase().includes(q) || m.tags.some(t => t.includes(q));
    });
    renderMedicines(filtered);
  });

  // Place Order -> open professional checkout modal
  const checkoutModal = document.getElementById('checkoutModal');
  const checkoutClose = document.getElementById('checkoutClose');
  const checkoutCancel = document.getElementById('checkoutCancel');
  const checkoutForm = document.getElementById('checkoutForm');
  const checkoutSummary = document.getElementById('checkoutSummary');
  const orderConfirmModal = document.getElementById('orderConfirmModal');
  const orderConfirmClose = document.getElementById('orderConfirmClose');
  const confirmDetails = document.getElementById('confirmDetails');
  const printOrderBtn = document.getElementById('printOrderBtn');

  if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', () => {
      if (!cart.length) return showToast('Your cart is empty. Add items before checkout.');
      openCheckout();
    });
  }

  function formatCurrency(v) { return `₹${v.toFixed(2)}`; }

  function calculateTotals() {
    const subtotal = cart.reduce((s, it) => s + it.price * it.qty, 0);
    const taxRate = 0.05; // 5% GST example
    const tax = +(subtotal * taxRate);
    const delivery = subtotal >= 500 ? 0 : 20;
    const total = +(subtotal + tax + delivery);
    return { subtotal, tax, delivery, total };
  }

  function buildCheckoutSummary() {
    const t = calculateTotals();
    const itemsHtml = cart.map(i => `
      <div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px dashed var(--border-color);">
        <div style="max-width:60%"><strong>${i.name}</strong><div style="font-size:0.85rem;color:var(--text-muted);">Qty: ${i.qty} × ${formatCurrency(i.price)}</div></div>
        <div style="font-weight:700">${formatCurrency(i.price * i.qty)}</div>
      </div>
    `).join('');

    checkoutSummary.innerHTML = `
      <div style="margin-bottom:8px;">${itemsHtml}</div>
      <div style="padding-top:8px; border-top:1px solid var(--border-color);">
        <div style="display:flex; justify-content:space-between; margin-top:8px;"><div>Subtotal</div><div>${formatCurrency(t.subtotal)}</div></div>
        <div style="display:flex; justify-content:space-between; margin-top:6px;"><div>GST (5%)</div><div>${formatCurrency(t.tax)}</div></div>
        <div style="display:flex; justify-content:space-between; margin-top:6px;"><div>Delivery</div><div>${t.delivery === 0 ? 'Free' : formatCurrency(t.delivery)}</div></div>
        <div style="display:flex; justify-content:space-between; margin-top:10px; font-size:1.06rem; font-weight:800;"><div>Total</div><div>${formatCurrency(t.total)}</div></div>
      </div>
      <div style="margin-top:10px; font-size:0.85rem; color:var(--text-muted);">By placing this order you agree to our store policies. A pharmacist may contact you for Rx verification.</div>
    `;
  }

  function openCheckout() {
    if (!checkoutModal) return;
    buildCheckoutSummary();
    checkoutModal.classList.add('open');
  }

  function closeCheckout() {
    if (!checkoutModal) return;
    checkoutModal.classList.remove('open');
  }

  if (checkoutClose) checkoutClose.addEventListener('click', closeCheckout);
  if (checkoutCancel) checkoutCancel.addEventListener('click', closeCheckout);

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('custName').value.trim();
      const phone = document.getElementById('custPhone').value.trim();
      const address = document.getElementById('custAddress').value.trim();
      if (!name || !phone || !address) return showToast('Please fill name, phone and address.');

      // create professional order
      const totals = calculateTotals();
      const orderId = `GP-${Math.floor(100000 + Math.random() * 900000)}`;
      const order = {
        id: orderId,
        createdAt: Date.now(),
        customer: { name, phone, address },
        items: cart.map(i => ({ name: i.name, quantity: i.qty || i.quantity || 1, price: i.price })),
        totals,
        total: totals.total,
        currentStage: 0,
        statusIndex: 0
      };

      // persist order history
      try {
        const orders = JSON.parse(localStorage.getItem('ganeshPharmacyOrders') || '[]');
        orders.unshift(order);
        localStorage.setItem('ganeshPharmacyOrders', JSON.stringify(orders));
        localStorage.setItem('gp_orders', JSON.stringify(orders));
      } catch (e) {}

      closeCheckout();
      showOrderConfirmation(order);
      startOrderProcessing(order);
    });
  }

  function showOrderConfirmation(order) {
    if (!orderConfirmModal) return;
    const dt = new Date(order.createdAt);
    const itemsHtml = order.items.map(i => `<div style="display:flex; justify-content:space-between; padding:4px 0;"><div>${i.name} × ${i.qty}</div><div>${formatCurrency(i.price * i.qty)}</div></div>`).join('');
    confirmDetails.innerHTML = `
      <div style="font-weight:800; margin-bottom:6px;">${order.id}</div>
      <div style="font-size:0.95rem; color:var(--text-muted);">Placed: ${dt.toLocaleString()}</div>
      <div style="margin-top:8px;">${itemsHtml}</div>
      <div style="border-top:1px solid var(--border-color); padding-top:8px; margin-top:8px; font-weight:800; display:flex; justify-content:space-between;"><div>Total</div><div>${formatCurrency(order.totals.total)}</div></div>
    `;
    orderConfirmModal.classList.add('open');
  }

  if (orderConfirmClose) orderConfirmClose.addEventListener('click', () => orderConfirmModal.classList.remove('open'));
  if (printOrderBtn) printOrderBtn.addEventListener('click', () => window.print());

  function startOrderProcessing(order) {
    if (!orderStatusArea) return;
    orderStatusArea.style.display = 'block';
    renderFlowchart(order.statusIndex);
    orderInfo.textContent = `Order ${order.id} created. Tracking status...`;
    placeOrderBtn.disabled = true;

    const statuses = ['Received','Processing','Dispatched','Delivered'];
    const interval = setInterval(() => {
      order.statusIndex++;
      if (order.statusIndex > statuses.length - 1) {
        clearInterval(interval);
        orderInfo.textContent = `Order ${order.id} is ${statuses[statuses.length - 1]}. Delivered.`;
        clearCart();
        placeOrderBtn.disabled = false;
        return;
      }
      renderFlowchart(order.statusIndex);
      orderInfo.textContent = `Order ${order.id} is ${statuses[order.statusIndex]}`;
    }, 2200);
  }

  function renderMedicines(list) {
    if (!medicinesListEl) return;
    if (!list.length) {
      medicinesListEl.innerHTML = '<p style="color:var(--text-muted);">No medicines found.</p>';
      return;
    }
    medicinesListEl.innerHTML = list.map(m => {
      return `
        <div class="medicine-item" data-id="${m.id}">
          <div class="medicine-main">
            <div class="medicine-name"><strong>${m.name}</strong> <span class="med-brand">${m.brand}</span></div>
            <div class="medicine-meta">${m.dosage} ${m.rx ? '<span class="badge badge-rx">Rx</span>' : ''}</div>
          </div>
          <div class="medicine-actions">
            <div class="medicine-price">₹${m.price.toFixed(2)}</div>
            <button class="btn btn-outline add-to-cart-btn" data-id="${m.id}">Add to Cart</button>
          </div>
        </div>
      `;
    }).join('');

    // attach add-to-cart listeners
    medicinesListEl.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', () => addToCart(btn.getAttribute('data-id')));
    });
  }

  function addToCart(id) {
    const med = medicines.find(x => x.id === id);
    if (!med) return;
    const existing = cart.find(c => c.id === id);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ id: med.id, name: med.name, price: med.price, qty: 1 });
    }
    saveCart();
    renderCart();
    showToast(`${med.name} added to cart`);
  }

  function removeFromCart(id) {
    cart = cart.filter(c => c.id !== id);
    saveCart();
    renderCart();
  }

  function changeQty(id, delta) {
    const item = cart.find(c => c.id === id);
    if (!item) return;
    item.qty = Math.max(1, item.qty + delta);
    saveCart();
    renderCart();
  }

  function renderCart() {
    if (!cartItemsEl) return;
    if (!cart.length) {
      cartItemsEl.innerHTML = '<p style="color:var(--text-muted);">Cart is empty. Add medicines to place an order.</p>';
      if (placeOrderBtn) placeOrderBtn.disabled = true;
      cartTotalEl.textContent = '₹0.00';
      return;
    }
    placeOrderBtn.disabled = false;
    cartItemsEl.innerHTML = cart.map(i => `
      <div class="cart-row">
        <div class="cart-name">${i.name} <div class="cart-qty">Qty: <button class="qty-btn" data-action="dec" data-id="${i.id}">-</button> ${i.qty} <button class="qty-btn" data-action="inc" data-id="${i.id}">+</button></div></div>
        <div class="cart-right">₹${(i.price * i.qty).toFixed(2)} <button class="btn btn-secondary remove-btn" data-id="${i.id}" style="margin-left:8px;">Remove</button></div>
      </div>
    `).join('');

    // attach cart buttons
    cartItemsEl.querySelectorAll('.remove-btn').forEach(b => b.addEventListener('click', () => removeFromCart(b.getAttribute('data-id'))));
    cartItemsEl.querySelectorAll('.qty-btn').forEach(b => {
      b.addEventListener('click', () => {
        const id = b.getAttribute('data-id');
        const act = b.getAttribute('data-action');
        changeQty(id, act === 'inc' ? 1 : -1);
      });
    });

    const total = cart.reduce((s, it) => s + it.price * it.qty, 0);
    cartTotalEl.textContent = `₹${total.toFixed(2)}`;
  }

  function renderFlowchart(activeIndex) {
    if (!flowchart) return;
    flowchart.querySelectorAll('.step').forEach(stepEl => {
      const idx = Number(stepEl.getAttribute('data-step'));
      stepEl.classList.toggle('active', idx <= activeIndex);
    });
  }

  function saveCart() { localStorage.setItem('gp_cart', JSON.stringify(cart)); }
  function loadCart() { try { return JSON.parse(localStorage.getItem('gp_cart')) || []; } catch(e) { return []; } }
  function clearCart() { cart = []; saveCart(); renderCart(); }
}

/* Helper function for Toast Notification */
function showToast(message) {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 100);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 4500);
}
