/**
 * NOIR — Specialty Cigar Lounge
 * script.js — Complete Interactive Logic
 */

'use strict';

/* ========================================
   CONSTANTS & STATE
======================================== */
const THEME_KEY = 'noir-theme';
const RTL_KEY   = 'noir-dir';

/* ========================================
   1. THEME TOGGLE (dark ↔ light)
======================================== */
function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'dark';
  applyTheme(saved);

  // All theme buttons on the page
  document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.body.classList.contains('theme-light') ? 'light' : 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      applyTheme(next);
      localStorage.setItem(THEME_KEY, next);
    });
  });
}

function applyTheme(theme) {
  if (theme === 'light') {
    document.body.classList.add('theme-light');
  } else {
    document.body.classList.remove('theme-light');
  }
  // Update icon visibility
  document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
    const moonIcon = btn.querySelector('.icon-moon');
    const sunIcon  = btn.querySelector('.icon-sun');
    if (moonIcon) moonIcon.style.display = theme === 'light' ? 'block' : 'none';
    if (sunIcon)  sunIcon.style.display  = theme === 'dark'  ? 'block' : 'none';
  });
}

/* ========================================
   2. RTL TOGGLE
======================================== */
function initRTL() {
  const saved = localStorage.getItem(RTL_KEY) || 'ltr';
  applyDir(saved);

  document.querySelectorAll('[data-rtl-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('dir') || 'ltr';
      const next = current === 'ltr' ? 'rtl' : 'ltr';
      applyDir(next);
      localStorage.setItem(RTL_KEY, next);
    });
  });
}

function applyDir(dir) {
  document.documentElement.setAttribute('dir', dir);
  // Update button labels
  document.querySelectorAll('[data-rtl-toggle]').forEach(btn => {
    btn.textContent = dir === 'ltr' ? 'RTL' : 'LTR';
  });
}

/* ========================================
   3. NAVBAR — scroll behavior + glass
======================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastY = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const currentY = window.scrollY;

        // Glass blur after 40px
        if (currentY > 40) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }

        // Hide on scroll down, show on scroll up
        if (currentY > lastY && currentY > 200) {
          navbar.classList.add('nav-hidden');
        } else {
          navbar.classList.remove('nav-hidden');
        }

        lastY = currentY;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ========================================
   4. MOBILE HAMBURGER MENU
======================================== */
function initHamburger() {
  const ham = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!ham || !menu) return;

  ham.addEventListener('click', () => {
    const isOpen = ham.classList.toggle('open');
    menu.classList.toggle('open', isOpen);
    ham.setAttribute('aria-expanded', String(isOpen));
    menu.setAttribute('aria-hidden', String(!isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on backdrop click
  menu.addEventListener('click', e => {
    if (e.target === menu) closeMenu();
  });

  function closeMenu() {
    ham.classList.remove('open');
    menu.classList.remove('open');
    ham.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
  });
}

/* ========================================
   5. SCROLL REVEAL (IntersectionObserver)
======================================== */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal, .reveal-scale');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay based on sibling index
        const siblings = Array.from(entry.target.parentElement?.children || []);
        const idx = siblings.indexOf(entry.target);
        const delay = Math.min(idx * 80, 480);
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(item => observer.observe(item));
}

/* ========================================
   6. COUNT-UP STATS
======================================== */
function initCountUp() {
  const stats = document.querySelectorAll('[data-countup]');
  if (!stats.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-countup'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1800;
        const start = performance.now();

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease-out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(eased * target);
          el.textContent = current.toLocaleString() + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(stat => observer.observe(stat));
}

/* ========================================
   7. CAROUSEL (auto-play + dots + pause)
======================================== */
function initCarousels() {
  document.querySelectorAll('[data-carousel]').forEach(carousel => {
    const track = carousel.querySelector('.carousel__track');
    const slides = carousel.querySelectorAll('.carousel__slide');
    const dots = carousel.querySelectorAll('.carousel__dot');
    const prevBtn = carousel.querySelector('.carousel__prev');
    const nextBtn = carousel.querySelector('.carousel__next');
    if (!track || !slides.length) return;

    let current = 0;
    let timer = null;
    const autoDelay = parseInt(carousel.getAttribute('data-carousel'), 10) || 4000;

    function goTo(idx) {
      current = (idx + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startAuto() {
      clearInterval(timer);
      timer = setInterval(next, autoDelay);
    }
    function stopAuto() { clearInterval(timer); }

    dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); startAuto(); }));
    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAuto(); });

    carousel.addEventListener('mouseenter', stopAuto);
    carousel.addEventListener('mouseleave', startAuto);

    // Touch/swipe support
    let touchStartX = 0;
    carousel.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); startAuto(); }
    });

    goTo(0);
    startAuto();
  });
}

/* ========================================
   8. ACCORDION
======================================== */
function initAccordion() {
  document.querySelectorAll('.accordion__header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const body = item.querySelector('.accordion__body');
      const isOpen = item.classList.contains('open');

      // Close all siblings
      item.parentElement.querySelectorAll('.accordion__item.open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.accordion__body').style.maxHeight = '0';
          openItem.querySelector('.accordion__header').setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      if (isOpen) {
        item.classList.remove('open');
        body.style.maxHeight = '0';
        header.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ========================================
   9. PRODUCT FILTER (Products page)
======================================== */
function initProductFilter() {
  const filterTabs = document.querySelectorAll('.filter-tab');
  const sortSelect = document.querySelector('.filter-sort');
  const products   = document.querySelectorAll('.product-card');
  if (!filterTabs.length || !products.length) return;

  let activeOrigin = 'all';
  let activeSort   = 'default';

  function filterAndSort() {
    const visible = [];
    products.forEach(card => {
      const origin = card.getAttribute('data-origin') || '';
      const show = activeOrigin === 'all' || origin === activeOrigin;
      card.style.display = show ? '' : 'none';
      if (show) visible.push(card);
    });

    // Sort visible cards
    const grid = document.querySelector('.product-grid');
    if (!grid) return;
    const sorted = [...visible].sort((a, b) => {
      if (activeSort === 'strength-asc') {
        return (parseInt(a.getAttribute('data-strength') || 0)) - (parseInt(b.getAttribute('data-strength') || 0));
      }
      if (activeSort === 'strength-desc') {
        return (parseInt(b.getAttribute('data-strength') || 0)) - (parseInt(a.getAttribute('data-strength') || 0));
      }
      if (activeSort === 'price-asc') {
        return parseFloat(a.getAttribute('data-price') || 0) - parseFloat(b.getAttribute('data-price') || 0);
      }
      if (activeSort === 'price-desc') {
        return parseFloat(b.getAttribute('data-price') || 0) - parseFloat(a.getAttribute('data-price') || 0);
      }
      return 0;
    });

    // Re-order in DOM with smooth animation
    products.forEach(p => { p.style.opacity = '0'; p.style.transform = 'translateY(10px)'; });
    setTimeout(() => {
      sorted.forEach(p => grid.appendChild(p));
      products.forEach(p => {
        if (p.style.display !== 'none') {
          p.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          p.style.opacity = '1';
          p.style.transform = '';
        }
      });
    }, 150);
  }

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeOrigin = tab.getAttribute('data-filter') || 'all';
      filterAndSort();
    });
  });

  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      activeSort = sortSelect.value;
      filterAndSort();
    });
  }
}

/* ========================================
   10. CONTACT FORM VALIDATION
======================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const formContent = document.getElementById('form-content');
  const formSuccess = document.getElementById('form-success');

  function validateField(input) {
    const group = input.closest('.form-group');
    if (!group) return true;
    const errorEl = group.querySelector('.form-error');
    let valid = true;
    let msg = '';

    input.classList.remove('error');
    if (errorEl) errorEl.classList.remove('visible');

    if (input.required && !input.value.trim()) {
      valid = false; msg = 'This field is required.';
    } else if (input.type === 'email' && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
      valid = false; msg = 'Please enter a valid email address.';
    } else if (input.type === 'tel' && input.value && !/^[+\d\s\-()]{7,}$/.test(input.value)) {
      valid = false; msg = 'Please enter a valid phone number.';
    }

    if (!valid) {
      input.classList.add('error');
      if (errorEl) { errorEl.textContent = msg; errorEl.classList.add('visible'); }
    }
    return valid;
  }

  // Validate on blur
  form.querySelectorAll('input, select, textarea').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) validateField(input);
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let allValid = true;
    form.querySelectorAll('input[required], select[required], textarea[required]').forEach(input => {
      if (!validateField(input)) {
        allValid = false;
        if (allValid === false && !form.querySelector('.error')) input.focus();
      }
    });

    if (!allValid) {
      const firstError = form.querySelector('.error');
      if (firstError) firstError.focus();
      return;
    }

    // Success state
    if (formContent) formContent.style.display = 'none';
    if (formSuccess) formSuccess.classList.add('visible');
  });
}

/* ========================================
   11. NEWSLETTER FORM
======================================== */
function initNewsletterForm() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('.newsletter-input');
    const msg = form.querySelector('.newsletter-msg');
    if (!input || !msg) return;

    const email = input.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      msg.textContent = 'Please enter a valid email address.';
      msg.className = 'newsletter-msg error';
      return;
    }

    msg.textContent = 'Thank you. You\'re on the list.';
    msg.className = 'newsletter-msg success';
    input.value = '';
  });
}

/* ========================================
   12. CALENDAR WIDGET
======================================== */
function initCalendar() {
  const widget = document.getElementById('cal-widget');
  if (!widget) return;

  // Days with events (day numbers)
  const eventDays = [12, 18, 24, 27];
  let viewDate = new Date();

  function render() {
    const year  = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const today = new Date();

    const monthNames = ['January','February','March','April','May','June',
                        'July','August','September','October','November','December'];
    const dayNames   = ['Su','Mo','Tu','We','Th','Fr','Sa'];

    // First day of month and total days
    const firstDay  = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const monthEl = widget.querySelector('.cal-widget__month');
    if (monthEl) monthEl.textContent = `${monthNames[month]} ${year}`;

    const daysContainer = widget.querySelector('.cal-widget__days');
    const headerContainer = widget.querySelector('.cal-widget__days-header');
    if (!daysContainer) return;

    // Render day-name headers
    if (headerContainer) {
      headerContainer.innerHTML = dayNames.map(d =>
        `<div class="cal-day-name">${d}</div>`
      ).join('');
    }

    let html = '';
    // Empty leading cells
    for (let i = 0; i < firstDay; i++) {
      html += `<div class="cal-day empty"></div>`;
    }
    // Day cells
    for (let d = 1; d <= totalDays; d++) {
      const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      const hasEvt  = eventDays.includes(d);
      let cls = 'cal-day';
      if (isToday) cls += ' today';
      if (hasEvt && !isToday) cls += ' has-event';
      html += `<div class="${cls}" title="${hasEvt ? 'Event this day' : ''}">${d}</div>`;
    }
    daysContainer.innerHTML = html;
  }

  // Nav buttons
  const prevBtn = widget.querySelector('.cal-prev');
  const nextBtn = widget.querySelector('.cal-next');
  if (prevBtn) prevBtn.addEventListener('click', () => {
    viewDate.setMonth(viewDate.getMonth() - 1);
    render();
  });
  if (nextBtn) nextBtn.addEventListener('click', () => {
    viewDate.setMonth(viewDate.getMonth() + 1);
    render();
  });

  render();
}

/* ========================================
   13. ACTIVE NAV LINK
======================================== */
function initActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__link, .navbar__dropdown-link, .navbar__mobile-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === page || (page === 'index.html' && href === 'index.html') ||
        (page === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ========================================
   14. SMOOTH ANCHOR SCROLLING
======================================== */
function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-h')) || 72;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ========================================
   15. EMBER / SMOKE ANIMATION (404)
======================================== */
function initEmbers() {
  const container = document.querySelector('.ember');
  if (!container) return;

  const colors = ['#C8873A', '#E09F52', '#F2EAD9', '#8B4513'];
  const count  = 24;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'ember-particle';

    const size   = Math.random() * 5 + 2;
    const startX = Math.random() * 100;
    const startY = Math.random() * 100;
    const endX   = (Math.random() - 0.5) * 200;
    const endY   = -(Math.random() * 300 + 100);
    const dur    = Math.random() * 6 + 4;
    const delay  = Math.random() * 8;

    p.style.cssText = `
      left: ${startX}vw; top: ${startY}vh;
      width: ${size}px; height: ${size}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      filter: blur(${Math.random() * 2}px);
      --ex: ${endX}px; --ey: ${endY}px;
      animation-duration: ${dur}s;
      animation-delay: ${delay}s;
      box-shadow: 0 0 ${size * 2}px currentColor;
    `;
    container.appendChild(p);
  }
}

/* ========================================
   16. QTY SELECTOR (Product Detail)
======================================== */
function initQtySelector() {
  const decreaseBtn = document.getElementById('qty-decrease');
  const increaseBtn = document.getElementById('qty-increase');
  const qtyDisplay  = document.getElementById('qty-num');
  if (!decreaseBtn || !increaseBtn || !qtyDisplay) return;

  let qty = 1;
  const max = 20;

  decreaseBtn.addEventListener('click', () => {
    if (qty > 1) { qty--; qtyDisplay.textContent = qty; }
  });
  increaseBtn.addEventListener('click', () => {
    if (qty < max) { qty++; qtyDisplay.textContent = qty; }
  });
}

/* ========================================
   17. MARQUEE SPEED CONTROL
======================================== */
function initMarquee() {
  const track = document.querySelector('.marquee-track');
  if (!track) return;
  // Clone for seamless loop
  const clone = track.innerHTML;
  track.innerHTML += clone;
}

/* ========================================
   18. PRODUCT CARD CLICK → DETAIL
======================================== */
function initProductCards() {
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => {
      const productId = card.getAttribute('data-id') || '1';
      window.location.href = `product-detail.html?id=${productId}`;
    });
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') card.click();
    });
  });
}

/* ========================================
   19. PARALLAX DISABLE ON MOBILE
======================================== */
function initParallax() {
  // Only apply fixed parallax on non-mobile
  if (window.innerWidth <= 768) {
    document.querySelectorAll('.cta-band__bg').forEach(bg => {
      bg.style.backgroundAttachment = 'scroll';
    });
  }
}

/* ========================================
   20. SPACES GALLERY (Membership)
======================================== */
function initSpacesGallery() {
  // Gallery items are handled via CSS hover — no JS needed beyond reveal
}

/* ========================================
   INIT — DOMContentLoaded
======================================== */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initRTL();
  initNavbar();
  initHamburger();
  initScrollReveal();
  initCountUp();
  initCarousels();
  initAccordion();
  initProductFilter();
  initContactForm();
  initNewsletterForm();
  initCalendar();
  initActiveNav();
  initSmoothAnchors();
  initEmbers();
  initQtySelector();
  initMarquee();
  initProductCards();
  initParallax();
});

/* ========================================
   RESIZE HANDLER (debounced)
======================================== */
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    initParallax();
    // Re-close open accordion if needed
  }, 200);
}, { passive: true });
