/**
 * CRAG — main.js
 * Core JavaScript: Theme, RTL, Navbar, Scroll Reveal, Animations, Accordion, Forms
 */

'use strict';

/* ══════════════════════════════════════════════
   UTILITIES
══════════════════════════════════════════════ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function debounce(fn, ms = 100) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

/* ══════════════════════════════════════════════
   THEME TOGGLE
══════════════════════════════════════════════ */
const THEME_KEY = 'crag-theme';

function getStoredTheme() {
  return localStorage.getItem(THEME_KEY) ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);

  $$('[data-theme-toggle]').forEach(btn => {
    const icon = btn.querySelector('i');
    if (icon) {
      icon.className = theme === 'dark'
        ? 'ph-bold ph-sun'
        : 'ph-bold ph-moon';
    }
    btn.setAttribute('aria-label',
      theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
    );
  });
}

function initTheme() {
  applyTheme(getStoredTheme());

  $$('[data-theme-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  });
}

/* ══════════════════════════════════════════════
   RTL TOGGLE
══════════════════════════════════════════════ */
const RTL_KEY = 'crag-dir';

function getStoredDir() {
  return localStorage.getItem(RTL_KEY) || 'ltr';
}

function applyDir(dir) {
  document.documentElement.setAttribute('dir', dir);
  localStorage.setItem(RTL_KEY, dir);

  $$('[data-rtl-toggle]').forEach(btn => {
    btn.textContent = dir === 'rtl' ? 'RTL' : 'LTR';
    btn.setAttribute('aria-label',
      dir === 'rtl' ? 'Switch to LTR mode' : 'Switch to RTL mode'
    );
  });
}

function initRTL() {
  applyDir(getStoredDir());

  $$('[data-rtl-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('dir') || 'ltr';
      applyDir(current === 'rtl' ? 'ltr' : 'rtl');
    });
  });
}

/* ══════════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════════ */
function initNavbar() {
  const navbar = $('.navbar');
  if (!navbar) return;

  // Scroll behavior: orange border
  const handleScroll = debounce(() => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, 20);
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Active link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  $$('.nav-link, .mobile-nav-link').forEach(link => {
    const href = (link.getAttribute('href') || '').split('/').pop();
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Hamburger
  const hamburger = $('.navbar__hamburger');
  const mobileMenu = $('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';

      // Stagger mobile links
      if (isOpen) {
        $$('.mobile-nav-link', mobileMenu).forEach((link, i) => {
          link.style.transitionDelay = `${i * 60}ms`;
        });
      }
    });

    // Close on link click
    $$('.mobile-nav-link', mobileMenu).forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }
}

/* ══════════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════════ */
function initScrollReveal() {
  const items = $$('.reveal');
  if (!items.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  // Stagger siblings
  items.forEach((el, i) => {
    const siblings = Array.from(el.parentElement.children).filter(c =>
      c.classList.contains('reveal')
    );
    const sibIdx = siblings.indexOf(el);
    el.style.transitionDelay = `${sibIdx * 80}ms`;
    io.observe(el);
  });
}

/* ══════════════════════════════════════════════
   STATS COUNT-UP
══════════════════════════════════════════════ */
function animateCountUp(el) {
  const target = parseFloat(el.dataset.target || el.textContent.replace(/[^0-9.]/g, ''));
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 1400;
  const steps = 60;
  const increment = target / steps;
  let current = 0;
  let step = 0;

  const isFloat = target % 1 !== 0;

  const timer = setInterval(() => {
    step++;
    current = Math.min(current + increment, target);
    el.textContent = prefix + (isFloat ? current.toFixed(1) : Math.floor(current).toLocaleString()) + suffix;
    if (step >= steps) {
      el.textContent = prefix + (isFloat ? target.toFixed(1) : target.toLocaleString()) + suffix;
      clearInterval(timer);
    }
  }, duration / steps);
}

function initStats() {
  const statNums = $$('.stat-block__number[data-target], .dashboard-stat__number[data-target]');
  if (!statNums.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCountUp(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => io.observe(el));
}

/* ══════════════════════════════════════════════
   ACCORDION
══════════════════════════════════════════════ */
function initAccordion() {
  $$('.accordion__trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const panel = trigger.nextElementSibling;
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      // Close all in same accordion
      const accordion = trigger.closest('.accordion');
      if (accordion) {
        $$('.accordion__trigger', accordion).forEach(t => {
          t.setAttribute('aria-expanded', 'false');
          const p = t.nextElementSibling;
          if (p) p.setAttribute('aria-hidden', 'true');
        });
      }

      if (!isExpanded) {
        trigger.setAttribute('aria-expanded', 'true');
        if (panel) panel.setAttribute('aria-hidden', 'false');
      }
    });
  });
}

/* ══════════════════════════════════════════════
   FILTER PILLS (Blog)
══════════════════════════════════════════════ */
function initFilterPills() {
  $$('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const group = pill.closest('.filter-pills');
      $$('.filter-pill', group).forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.dataset.filter;
      const grid = group.nextElementSibling;
      if (!grid) return;

      $$('[data-category]', grid).forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ══════════════════════════════════════════════
   FORM VALIDATION
══════════════════════════════════════════════ */
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(input, msg) {
  input.classList.add('error');
  const errEl = input.parentElement.querySelector('.form-error') ||
    input.closest('.form-group')?.querySelector('.form-error');
  if (errEl) errEl.textContent = msg;
}

function clearError(input) {
  input.classList.remove('error');
  const errEl = input.parentElement.querySelector('.form-error') ||
    input.closest('.form-group')?.querySelector('.form-error');
  if (errEl) errEl.textContent = '';
}

function validateForm(form) {
  let valid = true;

  $$('input[required], textarea[required], select[required]', form).forEach(input => {
    clearError(input);
    if (!input.value.trim()) {
      showError(input, 'This field is required.');
      valid = false;
    } else if (input.type === 'email' && !validateEmail(input.value)) {
      showError(input, 'Please enter a valid email address.');
      valid = false;
    } else if (input.type === 'tel' && !/^\+?[\d\s\-()]{7,}$/.test(input.value)) {
      showError(input, 'Please enter a valid phone number.');
      valid = false;
    }
  });

  return valid;
}

function initForms() {
  $$('form[data-validate]').forEach(form => {
    // Inline validation on blur
    $$('input[required], textarea[required], select[required]', form).forEach(input => {
      input.addEventListener('blur', () => {
        clearError(input);
        if (!input.value.trim()) {
          showError(input, 'This field is required.');
        } else if (input.type === 'email' && !validateEmail(input.value)) {
          showError(input, 'Please enter a valid email address.');
        }
      });
      input.addEventListener('input', () => clearError(input));
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      if (validateForm(form)) {
        const btn = form.querySelector('[type="submit"]');
        if (btn) {
          btn.textContent = 'Submitted!';
          btn.disabled = true;
          setTimeout(() => {
            btn.textContent = btn.dataset.original || 'Submit';
            btn.disabled = false;
            form.reset();
          }, 3000);
        }
      }
    });
  });
}

/* ══════════════════════════════════════════════
   PASSWORD TOGGLE
══════════════════════════════════════════════ */
function initPasswordToggle() {
  $$('.input-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.parentElement.querySelector('input');
      if (!input) return;
      const isText = input.type === 'text';
      input.type = isText ? 'password' : 'text';
      const icon = btn.querySelector('i');
      if (icon) icon.className = isText ? 'ph-bold ph-eye' : 'ph-bold ph-eye-slash';
    });
  });
}

/* ══════════════════════════════════════════════
   AUTH TABS (Login/Register Toggle)
══════════════════════════════════════════════ */
function initAuthTabs() {
  const loginPanel  = $('#panel-login');
  const registerPanel = $('#panel-register');
  const toRegister  = $$('[data-show="register"]');
  const toLogin     = $$('[data-show="login"]');

  if (!loginPanel || !registerPanel) return;

  toRegister.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      loginPanel.hidden = true;
      registerPanel.hidden = false;
    });
  });

  toLogin.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      loginPanel.hidden = false;
      registerPanel.hidden = true;
    });
  });
}

/* ══════════════════════════════════════════════
   COUNTDOWN TIMER (Coming Soon)
══════════════════════════════════════════════ */
function initCountdown() {
  const target = new Date();
  target.setDate(target.getDate() + 14); // 14 days from now

  function updateCountdown() {
    const now = new Date();
    const diff = target - now;
    if (diff <= 0) return;

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const d = $('#cd-days');
    const h = $('#cd-hours');
    const m = $('#cd-minutes');
    const s = $('#cd-seconds');

    if (d) d.textContent = String(days).padStart(2, '0');
    if (h) h.textContent = String(hours).padStart(2, '0');
    if (m) m.textContent = String(minutes).padStart(2, '0');
    if (s) s.textContent = String(seconds).padStart(2, '0');
  }

  if ($('#cd-days')) {
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }
}

/* ══════════════════════════════════════════════
   INIT
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initRTL();
  initNavbar();
  initScrollReveal();
  initStats();
  initAccordion();
  initFilterPills();
  initForms();
  initPasswordToggle();
  initAuthTabs();
  initCountdown();
});
