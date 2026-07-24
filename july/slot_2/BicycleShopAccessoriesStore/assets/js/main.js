/**
 * VELOX — Bicycle Shop & Accessories Store
 * main.js — Navigation, Theme, RTL, Scroll Animations
 */

'use strict';

// ─── Theme Management ──────────────────────────────────────
const ThemeManager = {
  STORAGE_KEY: 'velox-theme',
  ATTRIBUTE: 'data-theme',
  DARK: 'dark',
  LIGHT: 'light',

  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? this.DARK : this.LIGHT;
    const initial = saved || preferred;
    this.apply(initial);

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem(this.STORAGE_KEY)) {
        this.apply(e.matches ? this.DARK : this.LIGHT);
      }
    });
  },

  apply(theme) {
    document.documentElement.setAttribute(this.ATTRIBUTE, theme);
    this.updateButtons(theme);
  },

  toggle() {
    const current = document.documentElement.getAttribute(this.ATTRIBUTE);
    const next = current === this.DARK ? this.LIGHT : this.DARK;
    this.apply(next);
    localStorage.setItem(this.STORAGE_KEY, next);
  },

  updateButtons(theme) {
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      btn.setAttribute('aria-label', theme === this.DARK ? 'Switch to light mode' : 'Switch to dark mode');
      btn.innerHTML = theme === this.DARK ? this._sunIcon() : this._moonIcon();
    });
  },

  _sunIcon: () => `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256" aria-hidden="true"><path d="M120,40V16a8,8,0,0,1,16,0V40a8,8,0,0,1-16,0Zm72,88a64,64,0,1,1-64-64A64.07,64.07,0,0,1,192,128Zm-16,0a48,48,0,1,0-48,48A48.05,48.05,0,0,0,176,128ZM58.34,69.66A8,8,0,0,0,69.66,58.34l-16-16A8,8,0,0,0,42.34,53.66Zm0,116.68-16,16a8,8,0,0,0,11.32,11.32l16-16a8,8,0,0,0-11.32-11.32ZM192,72a8,8,0,0,0,5.66-2.34l16-16a8,8,0,0,0-11.32-11.32l-16,16A8,8,0,0,0,192,72Zm5.66,114.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32-11.32ZM40,120H16a8,8,0,0,0,0,16H40a8,8,0,0,0,0-16Zm200-8H216a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16Zm-128,80a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V200A8,8,0,0,0,128,192Z"/></svg>`,
  _moonIcon: () => `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256" aria-hidden="true"><path d="M233.54,142.23a8,8,0,0,0-8-2,88.08,88.08,0,0,1-109.8-109.8,8,8,0,0,0-10-10,104.84,104.84,0,0,0-52.91,37A104,104,0,0,0,136,224a103.09,103.09,0,0,0,62.52-20.88,104.84,104.84,0,0,0,37-52.91A8,8,0,0,0,233.54,142.23ZM188.9,190.34A88,88,0,0,1,65.66,67.11a89,89,0,0,1,31.4-26A106.08,106.08,0,0,0,224,215a89,89,0,0,1-35.1-24.66Z"/></svg>`,
};

// ─── RTL Management ────────────────────────────────────────
const RTLManager = {
  STORAGE_KEY: 'velox-dir',
  LTR: 'ltr',
  RTL: 'rtl',

  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY) || this.LTR;
    this.apply(saved);
  },

  apply(dir) {
    document.documentElement.setAttribute('dir', dir);
    document.querySelectorAll('[data-rtl-toggle]').forEach(btn => {
      btn.textContent = dir === this.RTL ? 'LTR' : 'RTL';
      btn.setAttribute('aria-label', dir === this.RTL ? 'Switch to left-to-right layout' : 'Switch to right-to-left layout');
    });
  },

  toggle() {
    const current = document.documentElement.getAttribute('dir') || this.LTR;
    const next = current === this.RTL ? this.LTR : this.RTL;
    this.apply(next);
    localStorage.setItem(this.STORAGE_KEY, next);
  },
};

// ─── Navbar ─────────────────────────────────────────────────
const Navbar = {
  nav: null,
  hamburger: null,
  drawer: null,
  overlay: null,
  isOpen: false,

  init() {
    this.nav = document.getElementById('main-navbar');
    this.hamburger = document.getElementById('hamburger-btn');
    this.drawer = document.getElementById('mobile-drawer');
    this.overlay = document.getElementById('drawer-overlay');

    if (!this.nav) return;

    this._handleScroll();
    window.addEventListener('scroll', () => this._handleScroll(), { passive: true });

    if (this.hamburger) {
      this.hamburger.addEventListener('click', () => this.toggleDrawer());
    }

    if (this.overlay) {
      this.overlay.addEventListener('click', () => this.closeDrawer());
    }

    const closeBtn = document.getElementById('drawer-close');
    if (closeBtn) closeBtn.addEventListener('click', () => this.closeDrawer());

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.isOpen) this.closeDrawer();
    });

    // Toggle dropdown on click/tap for touch and click accessibility
    const dropdownTrigger = document.querySelector('.nav-dropdown > .nav-link');
    if (dropdownTrigger) {
      if (!dropdownTrigger.hasAttribute('aria-expanded')) {
        dropdownTrigger.setAttribute('aria-expanded', 'false');
      }
      dropdownTrigger.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        const expanded = dropdownTrigger.getAttribute('aria-expanded') === 'true';
        dropdownTrigger.setAttribute('aria-expanded', !expanded ? 'true' : 'false');
        dropdownTrigger.closest('.nav-dropdown')?.classList.toggle('show');
      });

      document.addEventListener('click', e => {
        if (!e.target.closest('.nav-dropdown')) {
          dropdownTrigger.setAttribute('aria-expanded', 'false');
          dropdownTrigger.closest('.nav-dropdown')?.classList.remove('show');
        }
      });
    }

    this._setActiveLink();
  },

  _handleScroll() {
    if (window.scrollY > 30) {
      this.nav.classList.add('scrolled');
    } else {
      this.nav.classList.remove('scrolled');
    }
  },

  toggleDrawer() {
    this.isOpen ? this.closeDrawer() : this.openDrawer();
  },

  openDrawer() {
    this.isOpen = true;
    this.drawer?.classList.add('open');
    this.overlay?.classList.add('open');
    this.hamburger?.classList.add('active');
    this.hamburger?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  },

  closeDrawer() {
    this.isOpen = false;
    this.drawer?.classList.remove('open');
    this.overlay?.classList.remove('open');
    this.hamburger?.classList.remove('active');
    this.hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  },

  _setActiveLink() {
    const current = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('[data-nav-link]').forEach(link => {
      const href = link.getAttribute('href');
      if (href === current || (current === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  },
};

// ─── Scroll Reveal ──────────────────────────────────────────
const ScrollReveal = {
  observer: null,

  init() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            this.observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(el => this.observer.observe(el));
  },
};

// ─── Accordion ──────────────────────────────────────────────
const Accordion = {
  init() {
    document.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        const body = header.nextElementSibling;
        const isActive = header.classList.contains('active');

        // Close siblings in same group
        const parent = header.closest('.accordion-group');
        if (parent) {
          parent.querySelectorAll('.accordion-header.active').forEach(h => {
            h.classList.remove('active');
            h.nextElementSibling?.classList.remove('open');
            h.setAttribute('aria-expanded', 'false');
          });
        }

        if (!isActive) {
          header.classList.add('active');
          body?.classList.add('open');
          header.setAttribute('aria-expanded', 'true');
        }
      });
    });
  },
};

// ─── Counter Animation ──────────────────────────────────────
const CounterAnimation = {
  init() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this._animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
  },

  _animate(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;

    const update = () => {
      current += step;
      if (current >= target) {
        el.textContent = target.toLocaleString() + (el.dataset.suffix || '');
        return;
      }
      el.textContent = Math.floor(current).toLocaleString() + (el.dataset.suffix || '');
      requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  },
};

// ─── Smooth Scroll for Anchor Links ─────────────────────────
const SmoothScroll = {
  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  },
};

// ─── Event Bindings ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  RTLManager.init();
  Navbar.init();
  ScrollReveal.init();
  Accordion.init();
  CounterAnimation.init();
  SmoothScroll.init();

  // Theme toggle buttons
  document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
    btn.addEventListener('click', () => ThemeManager.toggle());
  });

  // RTL toggle buttons
  document.querySelectorAll('[data-rtl-toggle]').forEach(btn => {
    btn.addEventListener('click', () => RTLManager.toggle());
  });
});
