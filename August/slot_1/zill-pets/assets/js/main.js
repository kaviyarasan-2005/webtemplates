/**
 * ZILL — main.js
 * Core interactions: Theme, RTL, Navbar, Scroll-Reveal,
 * Ken Burns, Floating Leaves, Count-Up Stats, Marquee, Parallax
 */

/* ============================================================
   1. THEME TOGGLE
   ============================================================ */
(function initTheme() {
  const saved = localStorage.getItem('zill-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
})();

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('zill-theme', next);
  updateThemeIcons();
}

function updateThemeIcons() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.querySelectorAll('[data-theme-icon]').forEach(el => {
    el.innerHTML = isDark ? getSunIcon() : getMoonIcon();
    el.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    el.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  });
}

function getSunIcon() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
}

function getMoonIcon() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
}

/* ============================================================
   2. RTL TOGGLE
   ============================================================ */
(function initRTL() {
  const saved = localStorage.getItem('zill-dir') || 'ltr';
  document.documentElement.setAttribute('dir', saved);
})();

function toggleRTL() {
  const current = document.documentElement.getAttribute('dir') || 'ltr';
  const next = current === 'rtl' ? 'ltr' : 'rtl';
  document.documentElement.setAttribute('dir', next);
  localStorage.setItem('zill-dir', next);
  updateRTLButtons();
}

function updateRTLButtons() {
  const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
  document.querySelectorAll('[data-rtl-btn]').forEach(btn => {
    btn.textContent = isRTL ? 'LTR' : 'RTL';
    btn.setAttribute('aria-label', isRTL ? 'Switch to left-to-right layout' : 'Switch to right-to-left layout');
    btn.setAttribute('title', btn.getAttribute('aria-label'));
  });
}

/* ============================================================
   3. NAVBAR — HIDE ON SCROLL DOWN, REVEAL ON SCROLL UP
   ============================================================ */
(function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let lastScroll = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const current = window.scrollY;
        if (current <= 0) {
          navbar.classList.remove('navbar--hidden');
          document.body.classList.remove('nav-hidden');
        } else if (current > lastScroll && current > 80) {
          navbar.classList.add('navbar--hidden');
          document.body.classList.add('nav-hidden');
        } else if (current < lastScroll) {
          navbar.classList.remove('navbar--hidden');
          document.body.classList.remove('nav-hidden');
        }
        lastScroll = current;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

/* ============================================================
   4. MOBILE HAMBURGER MENU
   ============================================================ */
(function initHamburger() {
  const burger = document.querySelector('.navbar__hamburger');
  const overlay = document.querySelector('.navbar__mobile-overlay');
  if (!burger || !overlay) return;

  burger.addEventListener('click', () => {
    const isOpen = overlay.classList.contains('navbar__mobile-overlay--open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close on overlay link click
  overlay.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeMenu);
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  function openMenu() {
    overlay.classList.add('navbar__mobile-overlay--open');
    burger.classList.add('navbar__hamburger--active');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    overlay.classList.remove('navbar__mobile-overlay--open');
    burger.classList.remove('navbar__hamburger--active');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
})();

/* ============================================================
   5. SCROLL-REVEAL via IntersectionObserver
   ============================================================ */
(function initScrollReveal() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    document.querySelectorAll('.reveal').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('reveal--visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  // Auto-stagger siblings in the same parent grid
  document.querySelectorAll('.reveal').forEach((el, i) => {
    if (!el.dataset.delay) {
      const siblings = el.parentElement.querySelectorAll('.reveal');
      siblings.forEach((sib, si) => {
        if (!sib.dataset.delay) sib.dataset.delay = si * 80;
      });
    }
    observer.observe(el);
  });
})();

/* ============================================================
   6. SKETCH DRAW-ON ANIMATIONS (SVG stroke-dashoffset)
   ============================================================ */
(function initSketchDraw() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('drawn');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.sketch-underline, .sketch-circle, .sketch-arrow, .vine-svg').forEach(el => {
    if (prefersReduced) {
      el.classList.add('drawn');
    } else {
      observer.observe(el);
    }
  });
})();

/* ============================================================
   7. COUNT-UP STATS
   ============================================================ */
(function initCountUp() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function countUp(el, target, suffix, duration) {
    if (prefersReduced) { el.textContent = target + suffix; return; }
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(eased * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        const duration = parseInt(el.dataset.duration, 10) || 1800;
        countUp(el, target, suffix, duration);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count-up]').forEach(el => observer.observe(el));
})();

/* ============================================================
   8. PARALLAX CTA BANDS
   ============================================================ */
(function initParallax() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const bands = document.querySelectorAll('.cta-band');
  if (!bands.length) return;

  function update() {
    const scrollY = window.scrollY;
    bands.forEach(band => {
      const bg = band.querySelector('.cta-band__bg');
      if (!bg) return;
      const rect = band.getBoundingClientRect();
      const centerOffset = (rect.top + rect.height / 2) - window.innerHeight / 2;
      bg.style.transform = `translateY(${centerOffset * 0.2}px)`;
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ============================================================
   9. FLOATING LEAF DOODLES
   ============================================================ */
function initLeaves(container) {
  if (!container) return;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const leafSVG = (size, opacity, color) => `
    <svg width="${size}" height="${size}" viewBox="0 0 32 32" aria-hidden="true">
      <path d="M16 2 C6 6 2 16 8 26 C14 20 26 18 28 6 C22 8 18 12 16 18 C14 10 18 4 16 2Z"
            fill="${color}" opacity="${opacity}"/>
    </svg>`;

  const configs = [
    { top: '15%', left: '8%',  size: 28, opacity: 0.35, delay: '0s',   dur: '7s'  },
    { top: '30%', right: '6%', size: 22, opacity: 0.28, delay: '1.5s', dur: '8s'  },
    { top: '60%', left: '5%',  size: 18, opacity: 0.3,  delay: '3s',   dur: '6s'  },
    { top: '75%', right: '10%',size: 32, opacity: 0.25, delay: '0.8s', dur: '9s'  },
    { top: '45%', left: '92%', size: 20, opacity: 0.32, delay: '2s',   dur: '7.5s'},
  ];

  const color = getComputedStyle(document.documentElement)
    .getPropertyValue('--clr-green').trim() || '#3E9B4F';

  configs.forEach(cfg => {
    const leaf = document.createElement('div');
    leaf.className = 'leaf';
    Object.assign(leaf.style, {
      top: cfg.top,
      left: cfg.left || 'auto',
      right: cfg.right || 'auto',
      animationDelay: cfg.delay,
      animationDuration: cfg.dur,
      animationPlayState: prefersReduced ? 'paused' : 'running',
    });
    leaf.innerHTML = leafSVG(cfg.size, cfg.opacity, color);
    container.appendChild(leaf);
  });
}

/* ============================================================
   10. ACCORDION
   ============================================================ */
function initAccordions() {
  document.querySelectorAll('.accordion__trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion__item');
      const isOpen = item.classList.contains('accordion__item--open');

      // Close all others in same accordion
      const accordion = item.closest('.accordion');
      accordion.querySelectorAll('.accordion__item--open').forEach(open => {
        if (open !== item) {
          open.classList.remove('accordion__item--open');
          open.querySelector('.accordion__trigger').setAttribute('aria-expanded', 'false');
        }
      });

      item.classList.toggle('accordion__item--open', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
    });
  });
}

/* ============================================================
   11. STICKER WIGGLE
   ============================================================ */
function initStickerWiggle() {
  document.querySelectorAll('.sticker').forEach(el => {
    el.addEventListener('mouseenter', () => {
      el.style.animation = 'none';
      requestAnimationFrame(() => {
        el.style.animation = 'sticker-wiggle 0.4s cubic-bezier(0.34,1.56,0.64,1)';
      });
    });
  });
}

/* ============================================================
   12. QTY STEPPER (Product Detail)
   ============================================================ */
function initQtyStepper() {
  document.querySelectorAll('.qty-stepper').forEach(stepper => {
    const display = stepper.querySelector('.qty-display');
    const minusBtn = stepper.querySelector('[data-qty="minus"]');
    const plusBtn = stepper.querySelector('[data-qty="plus"]');
    if (!display) return;

    let qty = 1;
    const min = parseInt(stepper.dataset.min || '1');
    const max = parseInt(stepper.dataset.max || '99');

    function update() {
      display.textContent = qty;
      if (minusBtn) minusBtn.disabled = qty <= min;
      if (plusBtn) plusBtn.disabled = qty >= max;
    }

    if (minusBtn) minusBtn.addEventListener('click', () => { if (qty > min) { qty--; update(); } });
    if (plusBtn) plusBtn.addEventListener('click', () => { if (qty < max) { qty++; update(); } });
    update();
  });
}

/* ============================================================
   13. ACTIVE NAV LINK DETECTION
   ============================================================ */
(function setActiveNavLink() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__link, .navbar__mobile-link').forEach(link => {
    const href = (link.getAttribute('href') || '').split('/').pop();
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('navbar__link--active');
    }
  });
})();

/* ============================================================
   14. GUIDE TOC — ACTIVE LINK ON SCROLL
   ============================================================ */
function initTOC() {
  const toc = document.querySelector('.guide-toc');
  if (!toc) return;

  const links = toc.querySelectorAll('.guide-toc__link');
  const sections = Array.from(links).map(link => {
    const id = link.getAttribute('href').replace('#', '');
    return document.getElementById(id);
  }).filter(Boolean);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(link => {
          link.classList.toggle(
            'guide-toc__link--active',
            link.getAttribute('href') === '#' + id
          );
        });
      }
    });
  }, {
    rootMargin: `-${document.querySelector('.navbar')?.offsetHeight || 68}px 0px -70% 0px`
  });

  sections.forEach(sec => observer.observe(sec));
}

/* ============================================================
   15. FILTER RE-FLOW ANIMATION (Products page)
   ============================================================ */
function filterReflow(cards, filterFn) {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  cards.forEach(card => {
    const visible = filterFn(card);
    if (!visible) {
      card.style.opacity = '0';
      card.style.transform = 'scale(0.92)';
      card.style.pointerEvents = 'none';
      setTimeout(() => { card.style.display = 'none'; }, prefersReduced ? 0 : 180);
    } else {
      card.style.display = '';
      requestAnimationFrame(() => {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.92)';
        requestAnimationFrame(() => {
          card.style.transition = 'opacity 0.22s ease, transform 0.22s ease';
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
          card.style.pointerEvents = '';
        });
      });
    }
  });
}

/* ============================================================
   16. NEWSLETTER FORM VALIDATION
   ============================================================ */
function initNewsletterForm() {
  document.querySelectorAll('.newsletter-card__form').forEach(form => {
    const input = form.querySelector('.newsletter-card__input');
    const submit = form.querySelector('.newsletter-card__submit');
    const errEl = form.parentElement?.querySelector('.newsletter-card__error');

    form.addEventListener('submit', e => {
      e.preventDefault();
      const val = input?.value.trim() || '';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(val)) {
        if (errEl) { errEl.textContent = '↳ Please enter a valid email address.'; }
        input?.focus();
        return;
      }

      if (errEl) errEl.textContent = '';
      if (submit) {
        const orig = submit.textContent;
        submit.textContent = 'SUBSCRIBED ✓';
        submit.disabled = true;
        submit.style.background = '#3E9B4F';
        submit.style.color = '#fff';
        setTimeout(() => {
          submit.textContent = orig;
          submit.disabled = false;
          submit.style.background = '';
          submit.style.color = '';
          if (input) input.value = '';
        }, 3000);
      }
    });
  });
}

/* ============================================================
   17. TIMELINE DRAW-ON
   ============================================================ */
function initTimeline() {
  const tl = document.querySelector('.timeline');
  if (!tl) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('drawn');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(tl);
}

/* ============================================================
   18. INIT ALL ON DOM READY
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Apply saved theme & dir
  updateThemeIcons();
  updateRTLButtons();

  // Wire theme/RTL buttons
  document.querySelectorAll('[data-theme-icon]').forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });
  document.querySelectorAll('[data-rtl-btn]').forEach(btn => {
    btn.addEventListener('click', toggleRTL);
  });

  // Init components
  initAccordions();
  initStickerWiggle();
  initQtyStepper();
  initTOC();
  initTimeline();
  initNewsletterForm();

  // Leaves on hero and 404
  const heroContainers = document.querySelectorAll('.leaves-container');
  heroContainers.forEach(c => initLeaves(c));

  // Fix: sticker animations on hover should re-trigger
  document.querySelectorAll('.sticker').forEach(el => {
    el.addEventListener('animationend', () => {
      el.style.animation = '';
    });
  });
});
