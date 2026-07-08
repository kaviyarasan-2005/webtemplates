/* ============================================================
   Liora — Shared Navbar Injection
   ============================================================ */
(function () {
  'use strict';

  // Detect base path (root vs /pages/)
  const isRoot = !window.location.pathname.includes('/pages/');
  const base   = isRoot ? '.' : '..';

  // Simple cart state
  let cartCount = 0;

  function getNavHTML() {
    const links = [
      {
        label: 'Home',
        dropdown: [
          { label: 'Home 1', href: `${base}/index.html` },
          { label: 'Home 2', href: `${base}/pages/home2.html` }
        ]
      },
      { label: 'About',   href: `${base}/pages/about.html` },
      { label: 'Services', href: `${base}/pages/services.html` },
      { label: 'Pricing', href: `${base}/pages/pricing.html` },
      { label: 'Blog', href: `${base}/pages/blog.html` },
      { label: 'Contact', href: `${base}/pages/contact.html` },
    ];

    function buildDropdown(items) {
      return `<div class="dropdown" role="menu">
        ${items.map(item => `
          <a href="${item.href}" class="dropdown-item" role="menuitem">
            ${item.label}
          </a>`).join('')}
      </div>`;
    }

    const navItems = links.map(link => {
      if (link.dropdown) {
        return `<li class="nav-item" role="none">
          <button class="nav-link" aria-haspopup="true" aria-expanded="false">
            ${link.label}
            <svg class="chevron" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          ${buildDropdown(link.dropdown)}
        </li>`;
      }
      return `<li class="nav-item" role="none">
        <a href="${link.href}" class="nav-link" role="menuitem">${link.label}</a>
      </li>`;
    }).join('');

    const mobileItems = links.map(link => {
      if (link.dropdown) {
        const dropHtml = link.dropdown.map(item =>
          `<a href="${item.href}" class="mobile-dropdown-link">${item.label}</a>`
        ).join('');
        return `<li>
          <button class="mobile-nav-link mobile-dropdown-trigger" aria-expanded="false">
            ${link.label}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <div class="mobile-dropdown">${dropHtml}</div>
        </li>`;
      }
      return `<li><a href="${link.href}" class="mobile-nav-link">${link.label}</a></li>`;
    }).join('');

    // Cart button SVG icon
    const cartIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`;

    // Brand logo SVG — elegant macaron with leaf accent
    const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 32 32" fill="none">
      <!-- Top dome shell -->
      <path d="M7 14 C7 8.5 10.5 5 16 5 C21.5 5 25 8.5 25 14" fill="rgba(255,255,255,0.3)" stroke="white" stroke-width="1.6" stroke-linecap="round"/>
      <!-- Ruffled feet / pieds -->
      <path d="M7 14 Q8.5 16 10 14 Q11.5 16 13 14 Q14.5 16 16 14 Q17.5 16 19 14 Q20.5 16 22 14 Q23.5 16 25 14" stroke="white" stroke-width="1.3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- Cream filling -->
      <rect x="7.5" y="15.5" width="17" height="3" rx="1.5" fill="rgba(255,255,255,0.45)" stroke="white" stroke-width="1.2"/>
      <!-- Bottom dome shell -->
      <path d="M7 19 C7 24 10.5 27 16 27 C21.5 27 25 24 25 19" fill="rgba(255,255,255,0.2)" stroke="white" stroke-width="1.6" stroke-linecap="round"/>
      <!-- Leaf accent -->
      <path d="M17 5 Q20 2 22 3.5 Q20 3 18 5" fill="rgba(255,255,255,0.7)" stroke="white" stroke-width="0.8" stroke-linejoin="round"/>
      <line x1="19.5" y1="3.2" x2="18" y2="5" stroke="white" stroke-width="0.6" opacity="0.6"/>
    </svg>`;

    return `
      <a href="#main-content" class="skip-link">Skip to main content</a>
      <nav class="navbar" id="main-navbar" role="navigation" aria-label="Main navigation">
        <div class="navbar-inner">

          <!-- Brand -->
          <a href="${base}/index.html" class="navbar-brand" aria-label="Liora Home">
            <div class="brand-logo" aria-hidden="true">
              ${logoSvg}
            </div>
            <div>
              <span class="brand-name">Liora</span>
            </div>
          </a>

          <!-- Desktop Nav -->
          <ul class="navbar-nav" role="menubar" aria-label="Site navigation">
            ${navItems}
          </ul>

          <!-- Controls -->
          <div class="navbar-controls">
            <!-- Cart Button (desktop) -->
            <button class="ctrl-btn cart-btn" id="cart-btn-desktop" aria-label="Shopping cart" title="View Cart">
              ${cartIcon}
              <span class="cart-badge" id="cart-badge-desktop" style="display:none">0</span>
            </button>

            <!-- RTL Toggle -->
            <button class="ctrl-btn rtl-btn" id="rtl-toggle" aria-label="Toggle text direction" title="Toggle RTL/LTR">
              <span id="rtl-label">RTL</span>
            </button>

            <!-- Theme Toggle -->
            <button class="ctrl-btn" id="theme-toggle" aria-label="Toggle dark/light mode" title="Toggle theme">
              <svg id="icon-sun" xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              <svg id="icon-moon" xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            </button>

            <!-- Hamburger (mobile) -->
            <button class="hamburger" id="hamburger-btn" aria-label="Toggle mobile menu" aria-expanded="false" aria-controls="mobile-menu">
              <span class="hamburger-line"></span>
              <span class="hamburger-line"></span>
              <span class="hamburger-line"></span>
            </button>
          </div>
        </div>
      </nav>

      <!-- Mobile Menu -->
      <div class="mobile-menu" id="mobile-menu" role="dialog" aria-label="Mobile navigation" aria-modal="false">
        <ul style="list-style:none;padding:0;margin:0">
          ${mobileItems}
        </ul>
      </div>
    `;
  }

  function updateCartBadges() {
    const desktopBadge = document.getElementById('cart-badge-desktop');
    const mobileBadge  = document.getElementById('cart-badge-mobile');
    if (desktopBadge) {
      desktopBadge.textContent = cartCount;
      desktopBadge.style.display = cartCount > 0 ? 'flex' : 'none';
    }
    if (mobileBadge) {
      mobileBadge.textContent = cartCount;
      mobileBadge.style.display = cartCount > 0 ? 'inline-flex' : 'none';
    }
  }

  function initNavbar() {
    const placeholder = document.getElementById('navbar-placeholder');
    if (!placeholder) return;

    placeholder.innerHTML = getNavHTML();

    const navbar    = document.getElementById('main-navbar');
    const hamburger = document.getElementById('hamburger-btn');
    const mobileMenu= document.getElementById('mobile-menu');

    // ── Hamburger Toggle ──
    function toggleMobileMenu(open) {
      const isOpen = open !== undefined ? open : !mobileMenu.classList.contains('open');
      mobileMenu.classList.toggle('open', isOpen);
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    }

    hamburger.addEventListener('click', () => toggleMobileMenu());

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
        toggleMobileMenu(false);
      }
    });

    // ── Mobile Dropdowns ──
    document.querySelectorAll('.mobile-dropdown-trigger').forEach(btn => {
      btn.addEventListener('click', () => {
        const drop = btn.nextElementSibling;
        const isOpen = drop.classList.contains('open');
        document.querySelectorAll('.mobile-dropdown.open').forEach(d => d.classList.remove('open'));
        document.querySelectorAll('.mobile-dropdown-trigger').forEach(b => b.setAttribute('aria-expanded','false'));
        if (!isOpen) {
          drop.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });

    // ── Navbar Scroll Effect ──
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ── Active Link ──
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-link, .dropdown-item, .mobile-nav-link, .mobile-dropdown-link').forEach(link => {
      if (link.href && link.href.includes(currentPath.split('/').pop())) {
        link.classList.add('active');
      }
    });

    // ── Cart Button Interaction ──
    const cartDesktop = document.getElementById('cart-btn-desktop');
    const cartMobile  = document.getElementById('cart-btn-mobile');

    function handleCartClick() {
      // Cart button bounce animation
      this.classList.add('cart-bounce');
      setTimeout(() => {
        this.classList.remove('cart-bounce');
        window.location.href = `${base}/pages/services.html`;
      }, 400);
    }

    if (cartDesktop) cartDesktop.addEventListener('click', handleCartClick);
    if (cartMobile) cartMobile.addEventListener('click', handleCartClick);

    // Initialize badges
    updateCartBadges();

    // ── Lucide icons re-init ──
    if (window.lucide) window.lucide.createIcons();
  }

  // Expose cart API globally for other scripts
  window.LioraCart = {
    add: function(n) { cartCount += (n || 1); updateCartBadges(); },
    set: function(n) { cartCount = n; updateCartBadges(); },
    get: function()  { return cartCount; }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavbar);
  } else {
    initNavbar();
  }
})();
