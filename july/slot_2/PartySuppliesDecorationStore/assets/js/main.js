/*!
 * FESTA — main.js
 * Global JS: Theme, RTL, Navbar, Drawer, Scroll-Reveal, Active Nav
 */

(function () {
  'use strict';

  /* ══════════════════════════════════════════
     1. THEME TOGGLE (Dark / Light)
  ══════════════════════════════════════════ */
  const HTML = document.documentElement;

  function getTheme() {
    return localStorage.getItem('festa-theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }

  function applyTheme(theme) {
    HTML.setAttribute('data-theme', theme);
    localStorage.setItem('festa-theme', theme);
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      const sunIcon  = btn.querySelector('.icon-sun');
      const moonIcon = btn.querySelector('.icon-moon');
      if (sunIcon)  sunIcon.style.display  = theme === 'dark'  ? 'block' : 'none';
      if (moonIcon) moonIcon.style.display = theme === 'light' ? 'block' : 'none';
    });
  }

  function toggleTheme() {
    applyTheme(HTML.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  }

  applyTheme(getTheme());

  document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });

  /* ══════════════════════════════════════════
     2. RTL / LTR TOGGLE
  ══════════════════════════════════════════ */
  function getDir() {
    return localStorage.getItem('festa-dir') || 'ltr';
  }

  function applyDir(dir) {
    HTML.setAttribute('dir', dir);
    localStorage.setItem('festa-dir', dir);
    document.querySelectorAll('[data-dir-toggle]').forEach(btn => {
      btn.textContent = dir === 'ltr' ? 'RTL' : 'LTR';
      btn.setAttribute('aria-label', dir === 'ltr' ? 'Switch to RTL layout' : 'Switch to LTR layout');
    });
  }

  function toggleDir() {
    applyDir(HTML.getAttribute('dir') === 'ltr' ? 'rtl' : 'ltr');
  }

  applyDir(getDir());

  document.querySelectorAll('[data-dir-toggle]').forEach(btn => {
    btn.addEventListener('click', toggleDir);
  });

  /* ══════════════════════════════════════════
     3. NAVBAR SCROLL EFFECT
  ══════════════════════════════════════════ */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    function handleScroll() {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* ══════════════════════════════════════════
     4. MOBILE HAMBURGER DRAWER
  ══════════════════════════════════════════ */
  const hamburger = document.getElementById('hamburger');
  const drawer    = document.getElementById('navDrawer');
  const overlay   = document.getElementById('navOverlay');
  const drawerClose = document.getElementById('drawerClose');

  function openDrawer() {
    drawer?.classList.add('open');
    overlay?.classList.add('open');
    hamburger?.classList.add('open');
    hamburger?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    drawerClose?.focus();
  }

  function closeDrawer() {
    drawer?.classList.remove('open');
    overlay?.classList.remove('open');
    hamburger?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    hamburger?.focus();
  }

  hamburger?.addEventListener('click', openDrawer);
  drawerClose?.addEventListener('click', closeDrawer);
  overlay?.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer?.classList.contains('open')) closeDrawer();
  });

  // Mobile Drawer Dropdown Accordion
  const drawerDropdownBtn = document.querySelector('.nav-drawer-dropdown-btn');
  const drawerDropdownContent = document.querySelector('.nav-drawer-dropdown-content');

  drawerDropdownBtn?.addEventListener('click', () => {
    const isOpen = drawerDropdownContent.classList.toggle('open');
    drawerDropdownBtn.classList.toggle('active');
    drawerDropdownBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Automatically expand mobile drawer dropdown if active sub-link is loaded
  if (drawerDropdownContent?.querySelector('a.active')) {
    drawerDropdownContent.classList.add('open');
    drawerDropdownBtn?.classList.add('active');
    drawerDropdownBtn?.setAttribute('aria-expanded', 'true');
  }

  /* ══════════════════════════════════════════
     5. ACTIVE NAV LINK
  ══════════════════════════════════════════ */
  (function setActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('a.nav-link, .nav-drawer-links a, .nav-dropdown-menu a').forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      const page = href.split('/').pop();
      if (page === currentPage || (currentPage === '' && page === 'index.html')) {
        link.classList.add('active');
      }
    });
  })();

  /* ══════════════════════════════════════════
     6. SCROLL REVEAL (Intersection Observer)
  ══════════════════════════════════════════ */
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
  }

  /* ══════════════════════════════════════════
     7. ACCORDION
  ══════════════════════════════════════════ */
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item   = header.closest('.accordion-item');
      const body   = item.querySelector('.accordion-body');
      const isOpen = item.classList.contains('open');

      // Close siblings
      const siblings = item.parentElement.querySelectorAll('.accordion-item.open');
      siblings.forEach(sib => {
        if (sib !== item) {
          sib.classList.remove('open');
          sib.querySelector('.accordion-body').style.maxHeight = null;
          sib.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
        }
      });

      item.classList.toggle('open', !isOpen);
      header.setAttribute('aria-expanded', String(!isOpen));
      body.style.maxHeight = isOpen ? null : body.scrollHeight + 'px';
    });
  });

  // Gallery slider is handled by the unified script below the main module.

  /* ══════════════════════════════════════════
     9. SMOOTH SCROLL FOR ANCHOR LINKS
  ══════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(HTML).getPropertyValue('--navbar-h') || '72');
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
      }
    });
  });

  /* ══════════════════════════════════════════
     10. PAGE LOAD FADE-IN
  ══════════════════════════════════════════ */
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.45s ease';
  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
  });

})();

/* ============================================================
   GALLERY SLIDER
   Handles .gallery-slider elements (service-details page)
   ============================================================ */
(function () {
  'use strict';

  document.querySelectorAll('.gallery-slider').forEach(function (slider) {
    const slides   = slider.querySelector('.gallery-slides');
    const prevBtn  = slider.querySelector('.prev-btn');
    const nextBtn  = slider.querySelector('.next-btn');
    if (!slides || !prevBtn || !nextBtn) return;

    let current = 0;
    const total = slides.querySelectorAll('.gallery-slide').length;

    function goTo(index) {
      current = (index + total) % total;
      const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
      const factor = isRtl ? '' : '-';
      slides.style.transform = 'translateX(' + factor + (current * 100) + '%)';
    }

    prevBtn.addEventListener('click', function () { goTo(current - 1); });
    nextBtn.addEventListener('click', function () { goTo(current + 1); });

    // Auto-advance every 4 s
    let autoTimer = setInterval(function () { goTo(current + 1); }, 4000);
    slider.addEventListener('mouseenter', function () { clearInterval(autoTimer); });
    slider.addEventListener('mouseleave', function () {
      autoTimer = setInterval(function () { goTo(current + 1); }, 4000);
    });

    // Touch swipe
    let startX = 0;
    slides.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
    }, { passive: true });
    slides.addEventListener('touchend', function (e) {
      const diff = startX - e.changedTouches[0].clientX;
      const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
      if (Math.abs(diff) > 40) {
        const factor = isRtl ? -1 : 1;
        goTo((diff * factor) > 0 ? current + 1 : current - 1);
      }
    }, { passive: true });
  });
})();


/* ============================================================
   PRICING ADD-ON CALCULATOR
   Handles toggle checkboxes on pricing.html
   ============================================================ */
(function () {
  'use strict';

  const totalEl = document.getElementById('addonTotal');
  if (!totalEl) return;

  // Read base price from the hidden marker div
  const baseMarker  = document.getElementById('basePackagePrice');
  let   basePrice   = baseMarker ? parseInt(baseMarker.dataset.price, 10) : 299;

  function recalc() {
    let extra = 0;
    document.querySelectorAll('[data-addon-price]').forEach(function (input) {
      if (input.checked) extra += parseInt(input.dataset.addonPrice, 10);
    });
    totalEl.textContent = '$' + (basePrice + extra).toLocaleString();
  }

  document.querySelectorAll('[data-addon-price]').forEach(function (input) {
    input.addEventListener('change', recalc);
  });

  recalc();
})();

/* ============================================================
   BUSINESS HOURS TODAY HIGHLIGHT
   Highlights today's row in the hours table (contact.html)
   ============================================================ */
(function () {
  'use strict';

  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const today = days[new Date().getDay()];

  const row = document.querySelector('[data-day="' + today + '"]');
  if (row) row.classList.add('today');
})();

/* ============================================================
   COMMENT FORM HANDLER (blog-details.html)
   ============================================================ */
(function () {
  'use strict';

  const form    = document.getElementById('commentForm');
  const success = document.getElementById('commentSuccess');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;

    form.querySelectorAll('[required]').forEach(function (field) {
      if (!field.value.trim()) {
        field.classList.add('error');
        valid = false;
        field.addEventListener('input', function () {
          field.classList.remove('error');
        }, { once: true });
      }
    });

    if (valid && success) {
      success.style.display = 'block';
      form.reset();
      form.querySelector('[type="submit"]').textContent = 'Comment Posted!';
      form.querySelector('[type="submit"]').disabled = true;
    }
  });
})();

/* ============================================================
   CONTACT FORM VALIDATION (contact.html)
   ============================================================ */
(function () {
  'use strict';

  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;

    // Clear previous errors
    form.querySelectorAll('.form-group').forEach(function (grp) {
      grp.classList.remove('has-error');
      const errEl = grp.querySelector('.form-error');
      if (errEl) errEl.textContent = '';
    });

    // Validate each required control
    form.querySelectorAll('[required]').forEach(function (field) {
      const grp   = field.closest('.form-group');
      const errEl = grp ? grp.querySelector('.form-error') : null;
      let   msg   = '';

      if (!field.value.trim()) {
        msg = 'This field is required.';
      } else if (field.type === 'email') {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(field.value)) msg = 'Please enter a valid email address.';
      }

      if (msg) {
        valid = false;
        if (grp)   grp.classList.add('has-error');
        if (errEl) errEl.textContent = msg;
      }
    });

    if (valid && success) {
      success.style.display = 'block';
      form.reset();
      const btn = form.querySelector('[type="submit"]');
      btn.textContent = 'Message Sent!';
      btn.disabled = true;
      setTimeout(function () {
        success.style.display = 'none';
        btn.textContent = 'Send My Inquiry';
        btn.disabled = false;
      }, 6000);
    }
  });
})();
