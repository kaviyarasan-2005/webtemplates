/**
 * ============================================================
 *  CHIC — Fashion Boutique | main.js
 *  Version 1.0.0
 * ============================================================
 */

'use strict';

/* ── Utilities ──────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

/* ── 1. Theme Toggle ─────────────────────────────────────────── */
function initTheme() {
  const stored = localStorage.getItem('chic-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored || (prefersDark ? 'dark' : 'light');
  applyTheme(theme);

  on(document, 'click', e => {
    if (e.target.closest('[data-theme-toggle]')) {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      applyTheme(current === 'light' ? 'dark' : 'light');
    }
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('chic-theme', theme);
  $$('[data-theme-icon]').forEach(el => {
    el.className = theme === 'dark' ? 'ph ph-sun' : 'ph ph-moon';
  });
  $$('[data-theme-label]').forEach(el => {
    el.textContent = theme === 'dark' ? 'Light' : 'Dark';
  });
}

/* ── 2. RTL / LTR Toggle ─────────────────────────────────────── */
function initDir() {
  const stored = localStorage.getItem('chic-dir') || 'ltr';
  applyDir(stored);

  on(document, 'click', e => {
    if (e.target.closest('[data-dir-toggle]')) {
      const current = document.documentElement.getAttribute('dir') || 'ltr';
      applyDir(current === 'ltr' ? 'rtl' : 'ltr');
    }
  });
}

function applyDir(dir) {
  document.documentElement.setAttribute('dir', dir);
  localStorage.setItem('chic-dir', dir);
  $$('[data-dir-label]').forEach(el => {
    el.textContent = dir === 'ltr' ? 'RTL' : 'LTR';
  });
}

/* ── 3. Navbar Scroll Effect ─────────────────────────────────── */
function initNavbar() {
  const navbar = $('#navbar');
  if (!navbar) return;

  const handleScroll = () => {
    navbar.classList.toggle('navbar--scrolled', window.scrollY > 50);
  };
  on(window, 'scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ── 4. Active Nav Link ──────────────────────────────────────── */
function initActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  $$('.navbar__links a, .mobile-menu__links a').forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    const linkFile = href.split('/').pop();
    if (
      linkFile === path ||
      (path === '' && linkFile === 'index.html') ||
      (path === 'index.html' && linkFile === 'index.html')
    ) {
      a.classList.add('active');
      const parentLi = a.closest('.navbar__links > li');
      if (parentLi) parentLi.classList.add('active');
    }
  });
}

/* ── 5. Home Dropdown (keyboard accessible) ──────────────────── */
function initDropdown() {
  $$('.navbar__links li').forEach(li => {
    const btn = $('button[aria-haspopup="true"]', li);
    const dropdown = $('.nav-dropdown', li);
    if (!btn || !dropdown) return;

    on(btn, 'keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const open = li.getAttribute('data-open') === 'true';
        li.setAttribute('data-open', !open);
        dropdown.style.visibility = !open ? 'visible' : '';
      }
      if (e.key === 'Escape') {
        li.setAttribute('data-open', 'false');
        btn.focus();
      }
    });
  });
}

/* ── 6. Mobile Hamburger Menu ────────────────────────────────── */
function initMobileMenu() {
  const hamburger = $('#hamburger');
  const menu = $('#mobileMenu');
  const backdrop = $('#menuBackdrop');
  const closeBtn = $('#menuClose');

  if (!hamburger || !menu) return;

  const openMenu = () => {
    menu.classList.add('is-open');
    backdrop && backdrop.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    closeBtn && closeBtn.focus();
  };

  const closeMenu = () => {
    menu.classList.remove('is-open');
    backdrop && backdrop.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    hamburger.focus();
  };

  on(hamburger, 'click', openMenu);
  on(closeBtn, 'click', closeMenu);
  on(backdrop, 'click', closeMenu);

  on(document, 'keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) closeMenu();
  });
}

/* ── 7. Book Now Modal ───────────────────────────────────────── */
function initModal() {
  const modal = $('#bookModal');
  if (!modal) return;

  const openModal = () => {
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => $('#modalFirstInput') && $('#modalFirstInput').focus(), 100);
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  on(document, 'click', e => {
    if (e.target.closest('[data-modal-open]')) openModal();
    if (e.target.closest('[data-modal-close]')) closeModal();
    if (e.target === modal || e.target === $('.modal__backdrop', modal)) closeModal();
  });

  on(document, 'keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  // Trap focus within modal
  on(modal, 'keydown', e => {
    if (e.key !== 'Tab') return;
    const focusable = $$('button, input, select, textarea, a[href]', modal).filter(el => !el.disabled);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
}

/* ── 8. Modal Form Validation ────────────────────────────────── */
function initModalForm() {
  const form = $('#bookForm');
  if (!form) return;

  on(form, 'submit', e => {
    e.preventDefault();
    if (validateForm(form)) {
      const btn = $('[type="submit"]', form);
      btn.textContent = 'Booking Confirmed!';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Book Appointment';
        btn.disabled = false;
        form.reset();
        clearErrors(form);
        const modal = form.closest('.modal');
        if (modal) modal.classList.remove('is-open');
        document.body.style.overflow = '';
      }, 2500);
    }
  });

  // Inline validate on blur
  $$('input, select, textarea', form).forEach(field => {
    on(field, 'blur', () => validateField(field));
    on(field, 'input', () => {
      if (field.classList.contains('has-error')) validateField(field);
    });
  });
}

/* ── 9. Generic Form Validation ──────────────────────────────── */
function validateForm(form) {
  let valid = true;
  $$('[required]', form).forEach(field => {
    if (!validateField(field)) valid = false;
  });
  if (!valid) {
    const first = $('.has-error', form);
    if (first) first.focus();
  }
  return valid;
}

function validateField(field) {
  const val = field.value.trim();
  const errorEl = document.getElementById(field.getAttribute('aria-describedby'));
  let msg = '';

  if (field.required && !val) {
    msg = 'This field is required.';
  } else if (field.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
    msg = 'Please enter a valid email address.';
  } else if (field.type === 'tel' && val && !/^[\d\s+\-()]{7,15}$/.test(val)) {
    msg = 'Please enter a valid phone number.';
  }

  field.classList.toggle('has-error', !!msg);
  if (errorEl) {
    errorEl.textContent = msg;
    errorEl.classList.toggle('is-visible', !!msg);
  }
  return !msg;
}

function clearErrors(form) {
  $$('.has-error', form).forEach(el => el.classList.remove('has-error'));
  $$('.form__error', form).forEach(el => { el.textContent = ''; el.classList.remove('is-visible'); });
}

/* ── 10. Contact Form Validation ─────────────────────────────── */
function initContactForm() {
  const form = $('#contactForm');
  if (!form) return;

  on(form, 'submit', e => {
    e.preventDefault();
    if (validateForm(form)) {
      const btn = $('[type="submit"]', form);
      const original = btn.textContent;
      btn.textContent = 'Message Sent!';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
        form.reset();
        clearErrors(form);
      }, 3000);
    }
  });

  $$('input, select, textarea', form).forEach(field => {
    on(field, 'blur', () => validateField(field));
    on(field, 'input', () => {
      if (field.classList.contains('has-error')) validateField(field);
    });
  });
}

/* ── 11. Comment Form Validation ─────────────────────────────── */
function initCommentForm() {
  const form = $('#commentForm');
  if (!form) return;

  on(form, 'submit', e => {
    e.preventDefault();
    if (validateForm(form)) {
      const btn = $('[type="submit"]', form);
      btn.textContent = 'Comment Posted!';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Post Comment';
        btn.disabled = false;
        form.reset();
        clearErrors(form);
      }, 2000);
    }
  });

  $$('input, textarea', form).forEach(field => {
    on(field, 'blur', () => validateField(field));
  });
}

/* ── 12. Newsletter Forms ────────────────────────────────────── */
function initNewsletterForms() {
  $$('[data-newsletter]').forEach(form => {
    on(form, 'submit', e => {
      e.preventDefault();
      const input = $('input[type="email"]', form);
      const btn = $('button[type="submit"]', form);
      if (!input || !input.value.trim()) {
        input && input.classList.add('has-error');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
        input && input.classList.add('has-error');
        return;
      }
      input.classList.remove('has-error');
      const original = btn.textContent;
      btn.textContent = 'Subscribed!';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
        form.reset();
      }, 3000);
    });
  });
}

/* ── 13. Scroll Reveal ───────────────────────────────────────── */
function initScrollReveal() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    $$('.reveal').forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  $$('.reveal').forEach(el => observer.observe(el));
}

/* ── 14. Accordion ───────────────────────────────────────────── */
function initAccordions() {
  $$('.accordion__header').forEach(header => {
    on(header, 'click', () => {
      const item = header.closest('.accordion__item');
      const body = $('.accordion__body', item);
      const isOpen = header.classList.contains('is-open');

      // Close all in same accordion
      const accordion = header.closest('.accordion');
      $$('.accordion__header.is-open', accordion).forEach(h => {
        h.classList.remove('is-open');
        h.setAttribute('aria-expanded', 'false');
        const b = $('.accordion__body', h.closest('.accordion__item'));
        if (b) b.style.maxHeight = '0';
      });

      // Toggle clicked
      if (!isOpen) {
        header.classList.add('is-open');
        header.setAttribute('aria-expanded', 'true');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });

    on(header, 'keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); header.click(); }
    });
  });
}

/* ── 15. Carousel (Home 2 Trending) ─────────────────────────── */
function initCarousel() {
  $$('[data-carousel]').forEach(carousel => {
    const track = $('.carousel__track', carousel);
    const items = $$('.carousel__item', carousel);
    if (!track || items.length === 0) return;

    let currentIndex = 0;
    let startX = 0;
    let isDragging = false;

    const getVisibleCount = () => {
      if (window.innerWidth < 640) return 1;
      if (window.innerWidth < 1024) return 2;
      return 4;
    };

    const maxIndex = () => Math.max(0, items.length - getVisibleCount());

    const slideTo = idx => {
      currentIndex = Math.max(0, Math.min(idx, maxIndex()));
      const itemWidth = items[0].offsetWidth + parseInt(getComputedStyle(track).gap || 24);
      const sign = document.documentElement.dir === 'rtl' ? 1 : -1;
      track.style.transform = `translateX(${sign * currentIndex * itemWidth}px)`;
      updateDots();
    };

    const updateDots = () => {
      $$('[data-dot]', carousel).forEach((dot, i) => {
        dot.classList.toggle('is-active', i === currentIndex);
        dot.setAttribute('aria-current', i === currentIndex ? 'true' : 'false');
      });
    };

    on($('[data-prev]', carousel), 'click', () => slideTo(currentIndex - 1));
    on($('[data-next]', carousel), 'click', () => slideTo(currentIndex + 1));

    // Touch / drag
    on(track, 'mousedown', e => { startX = e.clientX; isDragging = true; });
    on(track, 'touchstart', e => { startX = e.touches[0].clientX; isDragging = true; }, { passive: true });
    on(document, 'mousemove', e => { if (!isDragging) return; });
    on(document, 'mouseup', e => {
      if (!isDragging) return;
      isDragging = false;
      let diff = startX - e.clientX;
      if (document.documentElement.dir === 'rtl') diff = -diff;
      if (Math.abs(diff) > 50) slideTo(diff > 0 ? currentIndex + 1 : currentIndex - 1);
    });
    on(track, 'touchend', e => {
      isDragging = false;
      let diff = startX - e.changedTouches[0].clientX;
      if (document.documentElement.dir === 'rtl') diff = -diff;
      if (Math.abs(diff) > 50) slideTo(diff > 0 ? currentIndex + 1 : currentIndex - 1);
    });

    on(window, 'resize', () => slideTo(Math.min(currentIndex, maxIndex())));
  });
}

/* ── 16. Blog Category Filter ────────────────────────────────── */
function initBlogFilter() {
  const pillsContainer = $('#blogPills');
  if (!pillsContainer) return;

  on(pillsContainer, 'click', e => {
    const pill = e.target.closest('.pill');
    if (!pill) return;

    $$('.pill', pillsContainer).forEach(p => p.classList.remove('is-active'));
    pill.classList.add('is-active');

    const category = pill.dataset.filter;
    $$('[data-category]').forEach(card => {
      const match = category === 'all' || card.dataset.category === category;
      card.style.display = match ? '' : 'none';
      card.style.opacity = match ? '1' : '0';
    });
  });
}

/* ── 17. Gallery Lightbox ────────────────────────────────────── */
function initLightbox() {
  const lightbox = $('#lightbox');
  if (!lightbox) return;

  const img = $('.lightbox__img', lightbox);
  const closeBtn = $('.lightbox__close', lightbox);

  on(document, 'click', e => {
    const trigger = e.target.closest('[data-lightbox]');
    if (trigger) {
      const src = trigger.dataset.lightbox || $('img', trigger)?.src;
      const alt = $('img', trigger)?.alt || '';
      if (img) { img.src = src; img.alt = alt; }
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
  });

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    if (img) img.src = '';
  };

  on(closeBtn, 'click', closeLightbox);
  on(lightbox, 'click', e => { if (e.target === lightbox) closeLightbox(); });
  on(document, 'keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
  });
}

/* ── 18. Countdown Timer ─────────────────────────────────────── */
function initCountdown() {
  const container = $('#countdown');
  if (!container) return;

  const target = new Date(container.dataset.target || '2026-10-15T00:00:00');

  const tick = () => {
    const now = new Date();
    const diff = target - now;

    if (diff <= 0) {
      container.innerHTML = '<p style="color:var(--clr-secondary);font-size:1.5rem;font-weight:700;">We\'re Live!</p>';
      return;
    }

    const days    = Math.floor(diff / 864e5);
    const hours   = Math.floor((diff % 864e5) / 36e5);
    const minutes = Math.floor((diff % 36e5) / 6e4);
    const seconds = Math.floor((diff % 6e4) / 1e3);

    const pad = n => String(n).padStart(2, '0');

    const dEl = $('#cd-days', container);
    const hEl = $('#cd-hours', container);
    const mEl = $('#cd-min', container);
    const sEl = $('#cd-sec', container);

    if (dEl) dEl.textContent = pad(days);
    if (hEl) hEl.textContent = pad(hours);
    if (mEl) mEl.textContent = pad(minutes);
    if (sEl) sEl.textContent = pad(seconds);
  };

  tick();
  setInterval(tick, 1000);
}

/* ── 19. Hero Parallax ───────────────────────────────────────── */
function initParallax() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const heroes = $$('.hero[data-parallax]');
  if (!heroes.length) return;

  on(window, 'scroll', () => {
    const y = window.scrollY;
    heroes.forEach(hero => {
      hero.style.backgroundPositionY = `calc(50% + ${y * 0.3}px)`;
    });
  }, { passive: true });
}

/* ── 20. Search (404 Page) ───────────────────────────────────── */
function initSearch() {
  const searchForm = $('#searchForm');
  if (!searchForm) return;

  on(searchForm, 'submit', e => {
    e.preventDefault();
    const q = $('input', searchForm)?.value?.trim();
    if (q) {
      alert(`Searching for "${q}"... (Demo)`);
    }
  });
}

/* ── 21. Smooth Scroll (Anchor CTAs) ────────────────────────── */
function initSmoothScroll() {
  on(document, 'click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    const target = $(id);
    if (target) {
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-h')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
}

/* ── 22. Scroll-to-top (optional utility) ────────────────────── */
function initScrollTop() {
  const btn = $('#scrollTop');
  if (!btn) return;
  on(window, 'scroll', () => { btn.style.opacity = window.scrollY > 400 ? '1' : '0'; }, { passive: true });
  on(btn, 'click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── 23. Stagger children animations ────────────────────────── */
function initStagger() {
  $$('[data-stagger]').forEach(parent => {
    const children = $$(':scope > *', parent);
    children.forEach((child, i) => {
      child.classList.add('reveal');
      child.style.transitionDelay = `${i * 0.08}s`;
    });
  });
}

/* ── 24. Navbar sub-menu mobile toggle ───────────────────────── */
function initMobileSubMenus() {
  $$('[data-submenu-toggle]').forEach(btn => {
    on(btn, 'click', () => {
      const sub = document.getElementById(btn.dataset.submenuToggle);
      if (!sub) return;
      const open = sub.style.display === 'block';
      sub.style.display = open ? 'none' : 'block';
      btn.setAttribute('aria-expanded', !open);
    });
  });
}

/* ── 25. Footer newsletter (footer-specific) ─────────────────── */
function initFooterNewsletter() {
  $$('[data-footer-newsletter]').forEach(form => {
    on(form, 'submit', e => {
      e.preventDefault();
      const input = $('input', form);
      const btn = $('button', form);
      if (!input?.value?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        input && input.focus();
        return;
      }
      const original = btn.textContent;
      btn.textContent = '✓';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
        form.reset();
      }, 3000);
    });
  });
}

/* ── 26. Early Access (Coming Soon) ─────────────────────────── */
function initEarlyAccess() {
  const form = $('#earlyAccessForm');
  if (!form) return;

  on(form, 'submit', e => {
    e.preventDefault();
    if (validateForm(form)) {
      const btn = $('[type="submit"]', form);
      btn.textContent = 'You\'re on the list!';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Get Early Access';
        btn.disabled = false;
        form.reset();
        clearErrors(form);
      }, 3000);
    }
  });

  $$('input', form).forEach(field => {
    on(field, 'blur', () => validateField(field));
  });
}

/* ── 27. Masonry hover reveal texts ─────────────────────────── */
function initMasonryHover() {
  $$('.masonry__item').forEach(item => {
    const overlay = $('.masonry__item-overlay', item);
    if (!overlay) return;
    on(item, 'mouseenter', () => overlay.style.opacity = '1');
    on(item, 'mouseleave', () => overlay.style.opacity = '0');
    on(item, 'focus', () => overlay.style.opacity = '1');
    on(item, 'blur', () => overlay.style.opacity = '0');
  });
}

/* ── 28. Share Buttons ───────────────────────────────────────── */
function initShareButtons() {
  on(document, 'click', e => {
    const btn = e.target.closest('[data-share]');
    if (!btn) return;
    const platform = btn.dataset.share;
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    const links = {
      instagram: `https://www.instagram.com/`,
      facebook:  `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter:   `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${url}&description=${title}`
    };
    if (links[platform]) window.open(links[platform], '_blank', 'noopener,width=600,height=400');
  });
}

/* ── Init ────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initDir();
  initNavbar();
  initActiveNav();
  initDropdown();
  initMobileMenu();
  initMobileSubMenus();
  initModal();
  initModalForm();
  initContactForm();
  initCommentForm();
  initNewsletterForms();
  initScrollReveal();
  initAccordions();
  initCarousel();
  initBlogFilter();
  initLightbox();
  initCountdown();
  initParallax();
  initSearch();
  initSmoothScroll();
  initScrollTop();
  initStagger();
  initFooterNewsletter();
  initEarlyAccess();
  initMasonryHover();
  initShareButtons();
});
