'use strict';

// ============================================================
// PRODUCT DATA (used by search)
// ============================================================
const PAWS_PRODUCTS = [
  { id:'p1', name:'Royal Canin Adult Dog Food', price:'$54.99', cat:'Dogs', img:'https://images.unsplash.com/photo-1601758125946-6dd4adc5e15d?w=120&q=80' },
  { id:'p2', name:'Hill\'s Science Cat Food', price:'$38.99', cat:'Cats', img:'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=120&q=80' },
  { id:'p3', name:'Bird Seed Premium Mix', price:'$14.99', cat:'Birds', img:'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=120&q=80' },
  { id:'p4', name:'Aquarium LED Light', price:'$49.99', cat:'Fish', img:'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=120&q=80' },
  { id:'p5', name:'Hamster Exercise Wheel', price:'$16.99', cat:'Small Pets', img:'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=120&q=80' },
  { id:'p6', name:'Dog Chew Toy Set', price:'$22.99', cat:'Dogs', img:'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=120&q=80' },
  { id:'p7', name:'Cat Tree Tower', price:'$89.99', cat:'Cats', img:'https://images.unsplash.com/photo-1583337260546-28b610c0aa48?w=120&q=80' },
  { id:'p8', name:'Pet Grooming Kit', price:'$34.99', cat:'Grooming', img:'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=120&q=80' },
  { id:'p9', name:'Dog Training Treats', price:'$12.99', cat:'Dogs', img:'https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?w=120&q=80' },
  { id:'p10', name:'Cat Scratcher Post', price:'$28.99', cat:'Cats', img:'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=120&q=80' },
  { id:'p11', name:'Fish Flake Food', price:'$9.99', cat:'Fish', img:'https://images.unsplash.com/photo-1535930749574-1399327ce78f?w=120&q=80' },
  { id:'p12', name:'Orthopedic Dog Bed', price:'$79.99', cat:'Dogs', img:'https://images.unsplash.com/photo-1583336829743-f61b72b83bde?w=120&q=80' },
  { id:'p13', name:'Bird Cage Deluxe', price:'$129.99', cat:'Birds', img:'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=120&q=80' },
  { id:'p14', name:'Rabbit Hutch Indoor', price:'$94.99', cat:'Small Pets', img:'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=120&q=80' },
  { id:'p15', name:'Premium Dog Collar', price:'$19.99', cat:'Dogs', img:'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=120&q=80' },
  { id:'p16', name:'Cat Food Dispenser', price:'$44.99', cat:'Cats', img:'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=120&q=80' },
];

// ============================================================
// STORE LOCATION DATA
// ============================================================
const STORE_DATA = {
  'Online Only': { addr: 'Worldwide Delivery Available', phone: '1-800-PAWS-CARE', hours: 'Support: Mon-Sun 24/7' },
  'Downtown Store': { addr: '12 Paw Street, Downtown, PA 10001', phone: '(555) 100-PAWS', hours: 'Mon-Sat 8am-8pm, Sun 10am-6pm' },
  'Uptown Store': { addr: '88 Bark Avenue, Uptown, PA 10025', phone: '(555) 200-PAWS', hours: 'Mon-Sat 9am-7pm, Sun 11am-5pm' },
};

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 1. THEME TOGGLE
  // ============================================================
  const html = document.documentElement;
  const THEME_KEY = 'paws-theme';
  
  const sunIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
  const moonIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  
  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }
  
  const savedTheme = localStorage.getItem(THEME_KEY) || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(savedTheme);
  
  document.addEventListener('click', e => {
    if (e.target.closest('.theme-toggle')) {
      applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    }
  });

  // ============================================================
  // 2. RTL TOGGLE
  // ============================================================
  const DIR_KEY = 'paws-dir';
  
  function applyDir(dir) {
    html.setAttribute('dir', dir);
    localStorage.setItem(DIR_KEY, dir);
    document.querySelectorAll('.rtl-toggle').forEach(btn => {
      btn.textContent = dir === 'ltr' ? 'RTL' : 'LTR';
      btn.setAttribute('aria-label', dir === 'ltr' ? 'Switch to RTL layout' : 'Switch to LTR layout');
    });
  }
  
  const savedDir = localStorage.getItem(DIR_KEY) || 'ltr';
  applyDir(savedDir);
  
  document.addEventListener('click', e => {
    if (e.target.closest('.rtl-toggle')) {
      applyDir(html.getAttribute('dir') === 'ltr' ? 'rtl' : 'ltr');
    }
  });

  // ============================================================
  // 3. MOBILE NAVIGATION
  // ============================================================
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const mobilePanel = document.querySelector('.mobile-nav-panel');
  const mobileOverlay = document.querySelector('.mobile-nav-overlay');
  const mobileClose = document.querySelector('.mobile-close-btn');
  
  function openMobileNav() {
    mobilePanel && mobilePanel.classList.add('open');
    mobileOverlay && mobileOverlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }
  
  function closeMobileNav() {
    mobilePanel && mobilePanel.classList.remove('open');
    mobileOverlay && mobileOverlay.classList.remove('visible');
    document.body.style.overflow = '';
  }
  
  mobileBtn && mobileBtn.addEventListener('click', openMobileNav);
  mobileClose && mobileClose.addEventListener('click', closeMobileNav);
  mobileOverlay && mobileOverlay.addEventListener('click', closeMobileNav);
  
  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeMobileNav(); closeCartDrawer(); }
  });

  // ============================================================
  // 4. LOCATION SELECTOR
  // ============================================================
  const LOC_KEY = 'paws-loc';
  
  function applyLocation(loc) {
    localStorage.setItem(LOC_KEY, loc);
    const data = STORE_DATA[loc] || STORE_DATA['Online Only'];
    // Update all footer location elements
    document.querySelectorAll('.footer-loc-addr').forEach(el => el.textContent = data.addr);
    document.querySelectorAll('.footer-loc-phone').forEach(el => el.textContent = data.phone);
    document.querySelectorAll('.footer-loc-hours').forEach(el => el.textContent = data.hours);
    // Sync all location selects
    document.querySelectorAll('.location-select').forEach(sel => { sel.value = loc; });
  }
  
  const savedLoc = localStorage.getItem(LOC_KEY) || 'Online Only';
  // Defer location apply to after DOM is ready
  setTimeout(() => applyLocation(savedLoc), 0);
  
  document.addEventListener('change', e => {
    if (e.target.classList.contains('location-select')) {
      applyLocation(e.target.value);
    }
  });

  // ============================================================
  // 5. HEADER SCROLL SHADOW
  // ============================================================
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ============================================================
  // 6. ACTIVE NAV LINK
  // ============================================================
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href !== '#' && currentFile === href) {
      link.classList.add('active');
    }
  });

  // ============================================================
  // 7. SEARCH FUNCTIONALITY
  // ============================================================
  const searchInputs = document.querySelectorAll('.search-input-nav, .hero-search-input, .mobile-search-input');
  
  function buildSearchDropdown(input) {
    let dropdown = input.parentElement.querySelector('.search-dropdown');
    if (!dropdown) {
      dropdown = document.createElement('div');
      dropdown.className = 'search-dropdown';
      input.parentElement.style.position = 'relative';
      input.parentElement.appendChild(dropdown);
    }
    return dropdown;
  }
  
  searchInputs.forEach(input => {
    const dropdown = buildSearchDropdown(input);
    
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      if (q.length < 2) { dropdown.classList.remove('show'); return; }
      
      const matches = PAWS_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q)
      ).slice(0, 6);
      
      if (!matches.length) { dropdown.classList.remove('show'); return; }
      
      dropdown.innerHTML = matches.map(p => `
        <a href="product-details.html" class="search-result-item">
          <img src="${p.img}" alt="${p.name}" class="search-result-img" loading="lazy">
          <div class="search-result-info">
            <div class="search-result-name">${p.name}</div>
            <div class="search-result-price">${p.price} &bull; ${p.cat}</div>
          </div>
        </a>
      `).join('');
      dropdown.classList.add('show');
    });
    
    document.addEventListener('click', e => {
      if (!input.parentElement.contains(e.target)) {
        dropdown.classList.remove('show');
      }
    });
    
    input.addEventListener('keydown', e => {
      if (e.key === 'Escape') dropdown.classList.remove('show');
    });
  });

  // ============================================================
  // 8. ACCORDION (FAQ, etc.)
  // ============================================================
  document.addEventListener('click', e => {
    const trigger = e.target.closest('.accordion-trigger');
    if (!trigger) return;
    const item = trigger.closest('.accordion-item');
    const body = item.querySelector('.accordion-body');
    const inner = item.querySelector('.accordion-body-inner');
    const isOpen = item.classList.contains('open');
    
    // Close all siblings
    const siblings = item.parentElement.querySelectorAll('.accordion-item.open');
    siblings.forEach(sib => {
      if (sib !== item) {
        sib.classList.remove('open');
        sib.querySelector('.accordion-body').style.maxHeight = '0';
      }
    });
    
    if (isOpen) {
      item.classList.remove('open');
      body.style.maxHeight = '0';
    } else {
      item.classList.add('open');
      body.style.maxHeight = inner.scrollHeight + 'px';
    }
  });

  // ============================================================
  // 9. TABS (product details, brands)
  // ============================================================
  document.addEventListener('click', e => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    const tabsContainer = btn.closest('.details-tabs, .tabs-wrapper, .brands-tabs');
    if (!tabsContainer) return;
    const targetId = btn.getAttribute('data-tab');
    tabsContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    tabsContainer.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const panel = tabsContainer.querySelector(`#${targetId}`);
    if (panel) panel.classList.add('active');
  });

  // ============================================================
  // 10. FORM VALIDATION
  // ============================================================
  document.addEventListener('submit', e => {
    const form = e.target;
    if (!form.classList.contains('validate-form')) return;
    e.preventDefault();
    let valid = true;
    
    form.querySelectorAll('[required]').forEach(field => {
      const errEl = field.parentElement.querySelector('.error-msg');
      const isEmpty = !field.value.trim();
      const isInvalidEmail = field.type === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
      
      if (isEmpty || isInvalidEmail) {
        field.classList.add('error');
        errEl && errEl.classList.add('show');
        valid = false;
      } else {
        field.classList.remove('error');
        errEl && errEl.classList.remove('show');
      }
    });
    
    if (valid) {
      window.showToast('Message sent! We\'ll be in touch soon.', 'success');
      form.reset();
    }
  });
  
  document.addEventListener('input', e => {
    if (e.target.classList.contains('error')) {
      e.target.classList.remove('error');
      const errEl = e.target.parentElement.querySelector('.error-msg');
      errEl && errEl.classList.remove('show');
    }
  });

  // ============================================================
  // 11. CART DRAWER OPEN (global delegation)
  // ============================================================
  function openCartDrawer() {
    const drawer = document.querySelector('.cart-drawer');
    const overlay = document.querySelector('.cart-drawer-overlay');
    drawer && drawer.classList.add('open');
    overlay && overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
    if (window.renderCart) window.renderCart();
  }
  
  function closeCartDrawer() {
    const drawer = document.querySelector('.cart-drawer');
    const overlay = document.querySelector('.cart-drawer-overlay');
    drawer && drawer.classList.remove('open');
    overlay && overlay.classList.remove('visible');
    document.body.style.overflow = '';
  }
  
  window.openCartDrawer = openCartDrawer;
  window.closeCartDrawer = closeCartDrawer;
  
  document.addEventListener('click', e => {
    if (e.target.closest('.cart-icon-btn')) openCartDrawer();
    if (e.target.closest('.cart-close-btn')) closeCartDrawer();
    if (e.target.closest('.cart-drawer-overlay')) closeCartDrawer();
  });

  // ============================================================
  // 12. BLOG CATEGORY FILTER
  // ============================================================
  const filterPills = document.querySelectorAll('.pill[data-filter]');
  const filterCards = document.querySelectorAll('[data-category]');
  
  if (filterPills.length && filterCards.length) {
    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const filter = pill.getAttribute('data-filter');
        filterCards.forEach(card => {
          const show = filter === 'all' || card.getAttribute('data-category') === filter;
          card.style.display = show ? '' : 'none';
          if (show) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(12px)';
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 300ms ease, transform 300ms ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          }
        });
      });
    });
  }

  // ============================================================
  // 13. PRODUCT GALLERY THUMBNAILS (product-details)
  // ============================================================
  const mainImg = document.querySelector('.product-main-img');
  const thumbnails = document.querySelectorAll('.thumbnail-img');
  
  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbnails.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      if (mainImg) {
        mainImg.style.opacity = '0';
        setTimeout(() => {
          mainImg.src = thumb.src;
          mainImg.style.opacity = '1';
        }, 150);
        mainImg.style.transition = 'opacity 150ms ease';
      }
    });
  });
  
  if (thumbnails.length > 0) thumbnails[0].classList.add('active');

  // ============================================================
  // 14. BRANDS A-Z FILTER
  // ============================================================
  const alphaPills = document.querySelectorAll('.alpha-pill');
  const brandItems = document.querySelectorAll('.brand-item-filterable');
  
  if (alphaPills.length && brandItems.length) {
    alphaPills.forEach(pill => {
      pill.addEventListener('click', () => {
        alphaPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const letter = pill.getAttribute('data-alpha');
        brandItems.forEach(item => {
          const name = item.getAttribute('data-brand') || '';
          item.style.display = (letter === 'All' || name.toUpperCase().startsWith(letter)) ? '' : 'none';
        });
      });
    });
  }

});

// ============================================================
// GLOBAL TOAST FUNCTION
// ============================================================
window.showToast = function(message, type = 'cart') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  
  const iconSVG = type === 'success'
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>`
    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/></svg>`;
  
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.style.borderLeftColor = type === 'success' ? 'var(--color-success)' : 'var(--color-primary)';
  toast.innerHTML = `
    <div class="toast-icon-wrap" style="background: ${type === 'success' ? 'rgba(42,157,143,0.12)' : 'rgba(224,122,95,0.12)'}; color: ${type === 'success' ? 'var(--color-success)' : 'var(--color-primary)'}">
      ${iconSVG}
    </div>
    <div class="toast-body">
      <h5>${type === 'success' ? 'Success' : 'Added to Cart'}</h5>
      <p>${message}</p>
    </div>
  `;
  container.appendChild(toast);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3000);
};
