/* ============================================
   DESK — Main JavaScript
   Theme, RTL, Navigation, Mobile Menu, Modal, Filters
   ============================================ */

(function () {
  'use strict';

  /* ---------- DOM Ready ---------- */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initTheme();
    initRTL();
    initHeader();
    initMobileMenu();
    initDropdowns();
    initModal();
    initActiveLink();
    initBlogFilter();
    init404Search();
    initContactForm();
    initNewsletterForm();
    initTopbarDismiss();
    initCartCount();
    initAddToCart();
    initWishlist();
    initProductTabs();
    initQtySelector();
    initGallery();
  }

  /* ==========================================
     THEME TOGGLE (Dark / Light)
     ========================================== */
  function initTheme() {
    const toggle = document.getElementById('theme-toggle');

    const stored = localStorage.getItem('desk-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = stored || (prefersDark ? 'dark' : 'light');

    setTheme(theme);

    function handleClick() {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      setTheme(next);
      localStorage.setItem('desk-theme', next);
    }

    if (toggle) toggle.addEventListener('click', handleClick);

    function setTheme(t) {
      document.documentElement.setAttribute('data-theme', t);
      updateAllIcons(t);
    }

    function updateAllIcons(t) {
      var allToggles = document.querySelectorAll('.theme-icon');
      allToggles.forEach(function (icon) {
        if (t === 'dark') {
          icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>';
        } else {
          icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>';
        }
      });
    }
  }

  /* ==========================================
     RTL / LTR TOGGLE
     ========================================== */
  function initRTL() {
    const toggle = document.getElementById('rtl-toggle');

    const stored = localStorage.getItem('desk-rtl');
    if (stored === 'rtl') {
      document.documentElement.setAttribute('dir', 'rtl');
    }

    updateAllLabels();

    function handleClick() {
      const current = document.documentElement.getAttribute('dir');
      const next = current === 'rtl' ? 'ltr' : 'rtl';
      document.documentElement.setAttribute('dir', next);
      localStorage.setItem('desk-rtl', next);
      updateAllLabels();
    }

    if (toggle) toggle.addEventListener('click', handleClick);

    function updateAllLabels() {
      const dir = document.documentElement.getAttribute('dir');
      const label = dir === 'rtl' ? 'LTR' : 'RTL';
      if (toggle) toggle.textContent = label;
    }
  }

  /* ==========================================
     HEADER SCROLL EFFECT
     ========================================== */
  function initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    let ticking = false;

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          if (window.scrollY > 10) {
            header.classList.add('scrolled');
          } else {
            header.classList.remove('scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /* ==========================================
     MOBILE MENU
     ========================================== */
  function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('mobile-overlay');

    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', toggleMenu);

    if (overlay) {
      overlay.addEventListener('click', closeMenu);
    }

    const links = mobileMenu.querySelectorAll('.mobile-menu__link');
    links.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        closeMenu();
      }
    });

    function toggleMenu() {
      const isOpen = mobileMenu.classList.contains('open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    }

    function openMenu() {
      mobileMenu.classList.add('open');
      hamburger.classList.add('active');
      if (overlay) overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      hamburger.setAttribute('aria-expanded', 'true');
      mobileMenu.setAttribute('aria-hidden', 'false');

      const firstLink = mobileMenu.querySelector('.mobile-menu__link');
      if (firstLink) firstLink.focus();
    }

    function closeMenu() {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('active');
      if (overlay) overlay.classList.remove('open');
      document.body.style.overflow = '';
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      hamburger.focus();
    }
  }

  /* ==========================================
     DROPDOWNS
     ========================================== */
  function initDropdowns() {
    const dropdowns = document.querySelectorAll('.nav-dropdown');

    dropdowns.forEach(function (dropdown) {
      const trigger = dropdown.querySelector('.header__nav-link');
      const menu = dropdown.querySelector('.nav-dropdown__menu');

      if (!trigger || !menu) return;

      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        const isOpen = dropdown.classList.contains('open');

        closeAllDropdowns();

        if (!isOpen) {
          dropdown.classList.add('open');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });

      trigger.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          dropdown.classList.remove('open');
          trigger.setAttribute('aria-expanded', 'false');
          trigger.focus();
        }
      });
    });

    document.addEventListener('click', function () {
      closeAllDropdowns();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeAllDropdowns();
      }
    });

    function closeAllDropdowns() {
      dropdowns.forEach(function (d) {
        d.classList.remove('open');
        const t = d.querySelector('.header__nav-link');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    }
  }

  /* ==========================================
     GET QUOTE MODAL
     ========================================== */
  function initModal() {
    const modalOverlay = document.getElementById('quote-modal');
    if (!modalOverlay) return;

    const triggers = document.querySelectorAll('[data-modal-open]');
    const closeBtn = modalOverlay.querySelector('.modal__close');

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        openModal();
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
        closeModal();
      }
    });

    function openModal() {
      modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      const firstInput = modalOverlay.querySelector('input, textarea');
      if (firstInput) {
        setTimeout(function () { firstInput.focus(); }, 300);
      }
    }

    function closeModal() {
      modalOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    /* Quote form submission */
    const form = modalOverlay.querySelector('form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        closeModal();
        showToast('Your quote request has been sent! We\'ll get back to you soon.', 'success');
        form.reset();
      });
    }
  }

  /* ==========================================
     TOAST NOTIFICATIONS
     ========================================== */
  function showToast(message, type) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast' + (type ? ' toast--' + type : '');
    toast.textContent = message;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);

    requestAnimationFrame(function () {
      toast.classList.add('show');
    });

    setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () { toast.remove(); }, 300);
    }, 4000);
  }

  /* ==========================================
     ACTIVE LINK HIGHLIGHTING
     ========================================== */
  function initActiveLink() {
    // Get current page filename — fall back to index.html for root path
    var rawPath = window.location.pathname.split('/').pop();
    var currentPath = (rawPath === '' || rawPath === undefined) ? 'index.html' : rawPath;

    var allLinks = document.querySelectorAll('.header__nav-link, .mobile-menu__link, .nav-dropdown__link');

    // First pass: clear any leftover active classes
    allLinks.forEach(function (link) {
      link.classList.remove('active');
    });

    // Second pass: apply active only to exact match
    allLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('tel')) return;
      var linkPath = href.split('/').pop().split('?')[0].split('#')[0];
      if (linkPath === currentPath) {
        link.classList.add('active');
      }
    });
  }

  /* ==========================================
     BLOG FILTER
     ========================================== */
  function initBlogFilter() {
    const pills = document.querySelectorAll('.filter-pill');
    const cards = document.querySelectorAll('[data-category]');
    if (!pills.length || !cards.length) return;

    pills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        pills.forEach(function (p) { p.classList.remove('active'); });
        pill.classList.add('active');

        const filter = pill.getAttribute('data-filter');

        cards.forEach(function (card) {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.style.display = '';
            requestAnimationFrame(function () {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';
            setTimeout(function () {
              card.style.display = 'none';
            }, 200);
          }
        });
      });
    });
  }

  /* ==========================================
     404 SEARCH (placeholder — redirects to index)
     ========================================== */
  function init404Search() {
    const searchForm = document.getElementById('search-404');
    if (!searchForm) return;

    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      window.location.href = 'index.html';
    });
  }

  /* ==========================================
     CONTACT FORM VALIDATION
     ========================================== */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;

      const requiredFields = form.querySelectorAll('[required]');
      requiredFields.forEach(function (field) {
        const group = field.closest('.form-group');
        if (!group) return;

        group.classList.remove('error');

        if (!field.value.trim()) {
          group.classList.add('error');
          valid = false;
        }

        if (field.type === 'email' && field.value.trim()) {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(field.value)) {
            group.classList.add('error');
            valid = false;
          }
        }
      });

      if (valid) {
        showToast('Your message has been sent successfully!', 'success');
        form.reset();
      } else {
        const firstError = form.querySelector('.form-group.error input, .form-group.error textarea');
        if (firstError) firstError.focus();
      }
    });

    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(function (input) {
      input.addEventListener('blur', function () {
        const group = input.closest('.form-group');
        if (!group) return;
        group.classList.remove('error');
      });
    });
  }

  /* ==========================================
     NEWSLETTER FORM
     ========================================== */
  function initNewsletterForm() {
    const form = document.getElementById('newsletter-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      if (emailInput && emailInput.value.trim()) {
        showToast('You\'ve been subscribed! Check your inbox.', 'success');
        form.reset();
      }
    });
  }

  /* ==========================================
     TOPBAR DISMISS
     ========================================== */
  function initTopbarDismiss() {
    var topbar = document.querySelector('.topbar');
    var dismiss = document.querySelector('.topbar__dismiss');
    if (!topbar) return;

    if (localStorage.getItem('desk-topbar-dismissed') === '1') {
      topbar.classList.add('topbar--hidden');
      return;
    }

    document.body.classList.add('has-topbar');

    if (dismiss) {
      dismiss.addEventListener('click', function () {
        topbar.classList.add('topbar--hidden');
        document.body.classList.remove('has-topbar');
        localStorage.setItem('desk-topbar-dismissed', '1');
      });
    }
  }

  /* ==========================================
     CART COUNTER
     ========================================== */
  function initCartCount() {
    var count = parseInt(localStorage.getItem('desk-cart-count') || '0', 10);
    updateCartBadge(count);
  }

  function updateCartBadge(count) {
    var badge = document.querySelector('.cart-badge');
    if (!badge) return;
    badge.textContent = count;
    if (count > 0) {
      badge.classList.add('visible');
    } else {
      badge.classList.remove('visible');
    }
    badge.classList.add('pop');
    setTimeout(function () { badge.classList.remove('pop'); }, 350);
  }

  /* ==========================================
     ADD TO CART
     ========================================== */
  function initAddToCart() {
    var buttons = document.querySelectorAll('.product-card__cart, [data-add-to-cart]');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var productName = btn.getAttribute('data-product') || 'Product';
        var count = parseInt(localStorage.getItem('desk-cart-count') || '0', 10) + 1;
        localStorage.setItem('desk-cart-count', count);
        updateCartBadge(count);

        btn.classList.add('added');
        var orig = btn.innerHTML;
        btn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Added!';
        setTimeout(function () {
          btn.classList.remove('added');
          btn.innerHTML = orig;
        }, 1800);

        showToast('\u2713 ' + productName + ' added to cart!', 'success');
      });
    });
  }

  /* ==========================================
     WISHLIST TOGGLE
     ========================================== */
  function initWishlist() {
    var buttons = document.querySelectorAll('.product-card__wishlist, [data-wishlist]');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        btn.classList.toggle('active');
        var isActive = btn.classList.contains('active');
        showToast(isActive ? '\u2665 Added to wishlist!' : 'Removed from wishlist.', isActive ? 'success' : '');
      });
    });
  }

  /* ==========================================
     PRODUCT TABS
     ========================================== */
  function initProductTabs() {
    var tabBtns = document.querySelectorAll('.product-tab-btn');
    if (!tabBtns.length) return;

    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = btn.getAttribute('data-tab');
        tabBtns.forEach(function (b) { b.classList.remove('active'); });
        document.querySelectorAll('.product-tab-content').forEach(function (c) { c.classList.remove('active'); });
        btn.classList.add('active');
        var content = document.getElementById('tab-' + target);
        if (content) content.classList.add('active');
      });
    });
  }

  /* ==========================================
     QUANTITY SELECTOR
     ========================================== */
  function initQtySelector() {
    var selectors = document.querySelectorAll('.qty-selector');
    selectors.forEach(function (sel) {
      var input = sel.querySelector('input[type="number"], input.qty-input');
      var dec = sel.querySelector('[data-qty-dec]');
      var inc = sel.querySelector('[data-qty-inc]');
      if (!input) return;
      if (dec) dec.addEventListener('click', function () {
        var val = parseInt(input.value, 10);
        if (val > 1) input.value = val - 1;
      });
      if (inc) inc.addEventListener('click', function () {
        input.value = parseInt(input.value, 10) + 1;
      });
    });
  }

  /* ==========================================
     PRODUCT IMAGE GALLERY
     ========================================== */
  function initGallery() {
    var thumbs = document.querySelectorAll('.product-gallery__thumb');
    var mainImg = document.querySelector('.product-gallery__main img');
    if (!thumbs.length || !mainImg) return;

    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        var img = thumb.querySelector('img');
        if (!img) return;
        mainImg.setAttribute('src', img.getAttribute('src'));
        mainImg.setAttribute('alt', img.getAttribute('alt') || '');
        thumbs.forEach(function (t) { t.classList.remove('active'); });
        thumb.classList.add('active');
      });
    });
  }

})();
