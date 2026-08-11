'use strict';

(function() {
  const CART_KEY = 'paws-cart';
  const FREE_SHIPPING_THRESHOLD = 75;
  
  let cart = [];
  
  function loadCart() {
    try { cart = JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch(e) { cart = []; }
  }
  
  function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateBadges();
    updateShippingBar();
  }
  
  function updateBadges() {
    const count = cart.reduce((s, i) => s + i.qty, 0);
    document.querySelectorAll('.cart-badge').forEach(b => {
      b.textContent = count;
      b.style.display = count > 0 ? 'flex' : 'none';
    });
  }
  
  function updateShippingBar() {
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const pct = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
    document.querySelectorAll('.cart-shipping-fill').forEach(fill => { fill.style.width = pct + '%'; });
    const remaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);
    document.querySelectorAll('.cart-shipping-text').forEach(el => {
      el.textContent = remaining > 0
        ? `Add $${remaining.toFixed(2)} more for FREE shipping`
        : 'You qualify for FREE shipping!';
    });
  }
  
  function renderCart() {
    const itemsEl = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    const titleEl = document.querySelector('.cart-drawer-title');
    if (!itemsEl) return;
    
    const count = cart.reduce((s, i) => s + i.qty, 0);
    if (titleEl) titleEl.textContent = `Your Cart (${count} ${count === 1 ? 'item' : 'items'})`;
    
    if (!cart.length) {
      itemsEl.innerHTML = `
        <div class="cart-empty">
          <svg class="cart-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/>
          </svg>
          <h4>Your cart is feeling lonely</h4>
          <p>Add some pet essentials to get started.</p>
          <a href="shop.html" class="btn btn-primary" onclick="window.closeCartDrawer && closeCartDrawer()">Start Shopping</a>
        </div>
      `;
      if (totalEl) totalEl.textContent = '$0.00';
      return;
    }
    
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    
    itemsEl.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img" loading="lazy">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${item.price.toFixed(2)}</div>
          <div class="qty-control">
            <button class="qty-btn" onclick="PAWS_CART.updateQty('${item.id}', -1)" aria-label="Decrease quantity">-</button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn" onclick="PAWS_CART.updateQty('${item.id}', 1)" aria-label="Increase quantity">+</button>
          </div>
          <button class="cart-item-remove" onclick="PAWS_CART.removeItem('${item.id}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            Remove
          </button>
        </div>
      </div>
    `).join('');
    
    if (totalEl) totalEl.textContent = '$' + subtotal.toFixed(2);
  }
  
  window.PAWS_CART = {
    addItem(id, name, price, image) {
      const existing = cart.find(i => i.id === id);
      if (existing) {
        existing.qty++;
      } else {
        cart.push({ id, name, price: parseFloat(price), qty: 1, image });
      }
      saveCart();
      window.showToast && window.showToast(`${name} added to cart`, 'cart');
      // Re-render if drawer is open
      const drawer = document.querySelector('.cart-drawer');
      if (drawer && drawer.classList.contains('open')) renderCart();
    },
    updateQty(id, delta) {
      const item = cart.find(i => i.id === id);
      if (item) {
        item.qty = Math.max(0, item.qty + delta);
        if (item.qty === 0) cart = cart.filter(i => i.id !== id);
        saveCart();
        renderCart();
      }
    },
    removeItem(id) {
      cart = cart.filter(i => i.id !== id);
      saveCart();
      renderCart();
    },
    getCount() {
      return cart.reduce((s, i) => s + i.qty, 0);
    }
  };
  
  // Expose renderCart globally for drawer open
  window.renderCart = renderCart;
  
  // Global add to cart click delegation
  document.addEventListener('click', e => {
    const btn = e.target.closest('.add-to-cart-btn');
    if (!btn) return;
    const id = btn.dataset.id || ('prod_' + Date.now());
    const name = btn.dataset.name || 'Pet Product';
    const price = btn.dataset.price || '0';
    const image = btn.dataset.image || 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=120&q=80';
    PAWS_CART.addItem(id, name, price, image);
  });
  
  // Checkout placeholder
  document.addEventListener('click', e => {
    if (e.target.closest('.checkout-btn')) {
      const modal = document.createElement('div');
      modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;';
      modal.innerHTML = `<div style="background:var(--color-surface);border-radius:16px;padding:40px;text-align:center;max-width:400px;width:90%;">
        <h3 style="font-family:var(--font-heading);margin-bottom:12px;">Checkout Coming Soon</h3>
        <p style="color:var(--color-text-muted);margin-bottom:24px;">Our secure checkout is being set up. Check back soon!</p>
        <button onclick="this.closest('[style]').remove()" class="btn btn-primary">Continue Shopping</button>
      </div>`;
      modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
      document.body.appendChild(modal);
    }
  });
  
  // Init
  loadCart();
  
  document.addEventListener('DOMContentLoaded', () => {
    updateBadges();
    updateShippingBar();
  });
  
})();
