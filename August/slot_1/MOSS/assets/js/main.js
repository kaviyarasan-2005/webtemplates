/**
 * MOSS — Bonsai & Japanese Garden Nursery
 * Main JavaScript — ES6+
 * Handles: Theme, RTL, Navbar, Mobile Menu, Scroll Reveal,
 *          Accordion, Counter Animation, Form Validation,
 *          Filter Pills, Countdown Timer, Password Toggle
 */

'use strict';

/* ── Constants ───────────────────────────────────────────── */
const THEME_KEY  = 'moss-theme';
const DIR_KEY    = 'moss-dir';
const DARK       = 'dark';
const LIGHT      = 'light';
const RTL        = 'rtl';
const LTR        = 'ltr';

/* ── DOM Ready ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initRTL();
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initScrollProgress();
  initAccordion();
  initCounters();
  initFilterPills();
  initForms();
  initMiniForm();
  initPasswordToggles();
  initCountdown();
  initSocialShare();
  setActiveNavLink();
});

/* ── Theme Toggle ────────────────────────────────────────── */
function initTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored || (prefersDark ? DARK : LIGHT);
  applyTheme(theme);

  // Attach all theme toggle buttons
  document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      applyTheme(current === DARK ? LIGHT : DARK);
    });
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);

  // Update icons
  document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
    const sunIcon  = btn.querySelector('.icon-sun');
    const moonIcon = btn.querySelector('.icon-moon');
    if (sunIcon)  sunIcon.style.display  = theme === DARK  ? 'none' : 'block';
    if (moonIcon) moonIcon.style.display = theme === LIGHT ? 'none' : 'block';
  });
}

/* ── RTL Toggle ──────────────────────────────────────────── */
function initRTL() {
  const stored = localStorage.getItem(DIR_KEY) || LTR;
  applyDir(stored);

  document.querySelectorAll('[data-rtl-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('dir') || LTR;
      applyDir(current === RTL ? LTR : RTL);
    });
  });
}

function applyDir(dir) {
  document.documentElement.setAttribute('dir', dir);
  localStorage.setItem(DIR_KEY, dir);

  // Update toggle text
  document.querySelectorAll('[data-rtl-toggle]').forEach(btn => {
    btn.textContent = dir === RTL ? 'RTL' : 'LTR';
  });
}

/* ── Navbar ──────────────────────────────────────────────── */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const SCROLL_THRESHOLD = 50;

  function onScroll() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load
}

/* ── Mobile Menu ─────────────────────────────────────────── */
function initMobileMenu() {
  const hamburger  = document.querySelector('.navbar__hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const closeBtn   = document.querySelector('.mobile-menu__close');

  if (!hamburger || !mobileMenu) return;

  const links = mobileMenu.querySelectorAll('.mobile-menu__link');

  function openMenu() {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');

    // Stagger links in
    links.forEach((link, i) => {
      link.style.transitionDelay = `${i * 80}ms`;
    });
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');

    links.forEach(link => {
      link.style.transitionDelay = '0ms';
    });
  }

  hamburger.addEventListener('click', openMenu);

  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  // Close on link click
  links.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });
}

/* ── Scroll Reveal ───────────────────────────────────────── */
function initScrollReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ── Accordion ───────────────────────────────────────────── */
function initAccordion() {
  const triggers = document.querySelectorAll('.accordion__trigger');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion__item');
      const isOpen = item.classList.contains('open');

      // Close all items
      document.querySelectorAll('.accordion__item.open').forEach(openItem => {
        openItem.classList.remove('open');
        openItem.querySelector('.accordion__trigger').setAttribute('aria-expanded', 'false');
      });

      // Open clicked if it was closed
      if (!isOpen) {
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ── Counter Animation ───────────────────────────────────── */
function initCounters() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target   = parseFloat(el.getAttribute('data-count'));
  const suffix   = el.getAttribute('data-suffix') || '';
  const prefix   = el.getAttribute('data-prefix') || '';
  const duration = 2000;
  const start    = Date.now();
  const isFloat  = String(target).includes('.');
  const decimals = isFloat ? (String(target).split('.')[1] || '').length : 0;

  function update() {
    const elapsed  = Date.now() - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased   = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;

    el.textContent = prefix + (isFloat ? current.toFixed(decimals) : Math.round(current)) + suffix;

    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

/* ── Filter Pills ────────────────────────────────────────── */
function initFilterPills() {
  const pillGroups = document.querySelectorAll('.filter-pills');

  pillGroups.forEach(group => {
    const pills = group.querySelectorAll('.filter-pill');
    const targetSelector = group.getAttribute('data-filter-target');
    const items = targetSelector ? document.querySelectorAll(targetSelector) : null;

    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        if (!items) return;
        const filter = pill.getAttribute('data-filter');

        items.forEach(item => {
          if (filter === 'all' || item.getAttribute('data-category') === filter) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  });
}

/* ── Form Validation ─────────────────────────────────────── */
function initForms() {
  document.querySelectorAll('form[data-validate]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (validateForm(form)) {
        handleFormSuccess(form);
      }
    });

    // Live validation on blur
    form.querySelectorAll('input, textarea, select').forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.classList.contains('error')) validateField(field);
      });
    });
  });
}

function validateForm(form) {
  let valid = true;
  form.querySelectorAll('input[required], textarea[required], select[required]').forEach(field => {
    if (!validateField(field)) valid = false;
  });
  return valid;
}

function validateField(field) {
  const group  = field.closest('.form-group');
  const error  = group?.querySelector('.form-error');
  let   valid  = true;
  let   msg    = '';

  const val   = field.value.trim();
  const type  = field.type;

  if (field.required && !val) {
    valid = false;
    msg   = 'This field is required.';
  } else if (type === 'email' && val && !isValidEmail(val)) {
    valid = false;
    msg   = 'Please enter a valid email address.';
  } else if (type === 'tel' && val && !isValidPhone(val)) {
    valid = false;
    msg   = 'Please enter a valid phone number.';
  } else if (field.name === 'confirm_password') {
    const password = field.form?.querySelector('[name="password"]');
    if (password && val !== password.value) {
      valid = false;
      msg   = 'Passwords do not match.';
    }
  } else if (field.minLength && val.length < field.minLength) {
    valid = false;
    msg   = `Minimum ${field.minLength} characters required.`;
  }

  if (group) {
    group.classList.toggle('has-error', !valid);
    if (error) error.textContent = msg;
  }
  field.classList.toggle('error', !valid);
  field.setAttribute('aria-invalid', !valid);

  return valid;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^[\+\-\s\(\)\d]{7,15}$/.test(phone);
}

function handleFormSuccess(form) {
  const successEl = form.querySelector('[data-success-msg]');
  if (successEl) {
    successEl.style.display = 'block';
    setTimeout(() => { successEl.style.display = 'none'; }, 5000);
  }

  // Show inline toast
  showToast('Message sent! We\'ll be in touch soon.', 'success');
  form.reset();
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `moss-toast moss-toast--${type}`;
  toast.setAttribute('aria-live', 'polite');
  toast.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      ${type === 'success'
        ? '<polyline points="20 6 9 17 4 12"></polyline>'
        : '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line>'}
    </svg>
    <span>${message}</span>
  `;

  // Inject toast styles if not present
  if (!document.getElementById('moss-toast-style')) {
    const style = document.createElement('style');
    style.id = 'moss-toast-style';
    style.textContent = `
      .moss-toast {
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%) translateY(80px);
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 20px;
        background: #1c1917;
        color: #fff;
        font-family: 'Inter', sans-serif;
        font-size: 0.9rem;
        border-left: 3px solid #3f4f2a;
        z-index: 10000;
        transition: transform 0.3s ease;
        max-width: 360px;
      }
      [data-theme="dark"] .moss-toast {
        background: #262422;
      }
      .moss-toast--success { border-left-color: #3f4f2a; }
      .moss-toast--error   { border-left-color: #991b1b; }
      .moss-toast.visible  { transform: translateX(-50%) translateY(0); }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('visible'));
  });

  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* ── Password Toggle ─────────────────────────────────────── */
function initPasswordToggles() {
  document.querySelectorAll('.password-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const field = btn.previousElementSibling || btn.parentElement.querySelector('input');
      if (!field) return;

      const isPassword = field.type === 'password';
      field.type = isPassword ? 'text' : 'password';

      const eyeOpen   = btn.querySelector('.icon-eye-open');
      const eyeClosed = btn.querySelector('.icon-eye-closed');
      if (eyeOpen)   eyeOpen.style.display   = isPassword ? 'block' : 'none';
      if (eyeClosed) eyeClosed.style.display = isPassword ? 'none'  : 'block';
      btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    });
  });
}

/* ── Countdown Timer ─────────────────────────────────────── */
function initCountdown() {
  const el = document.querySelector('[data-countdown]');
  if (!el) return;

  const targetDate = new Date(el.getAttribute('data-countdown'));

  const daysEl  = el.querySelector('[data-days]');
  const hrsEl   = el.querySelector('[data-hours]');
  const minsEl  = el.querySelector('[data-minutes]');
  const secsEl  = el.querySelector('[data-seconds]');

  function pad(n) { return String(n).padStart(2, '0'); }

  function update() {
    const now   = new Date();
    const diff  = Math.max(0, targetDate - now);

    const days  = Math.floor(diff / 86400000);
    const hrs   = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000) / 60000);
    const secs  = Math.floor((diff % 60000) / 1000);

    if (daysEl)  daysEl.textContent  = pad(days);
    if (hrsEl)   hrsEl.textContent   = pad(hrs);
    if (minsEl)  minsEl.textContent  = pad(mins);
    if (secsEl)  secsEl.textContent  = pad(secs);
  }

  update();
  setInterval(update, 1000);
}

/* ── Active Nav Link ─────────────────────────────────────── */
function setActiveNavLink() {
  const path = window.location.pathname;
  document.querySelectorAll('.navbar__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (path.endsWith(href) || (href === 'index.html' && (path === '/' || path.endsWith('/MOSS/') || path.endsWith('/MOSS/index.html'))))) {
      link.classList.add('active');
    }
  });
}

/* ── Social Share ────────────────────────────────────────── */
function initSocialShare() {
  document.querySelectorAll('[data-share]').forEach(btn => {
    btn.addEventListener('click', () => {
      const platform = btn.getAttribute('data-share');
      const url      = encodeURIComponent(window.location.href);
      const title    = encodeURIComponent(document.title);
      let   shareUrl = '';

      switch (platform) {
        case 'twitter': shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`; break;
        case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`; break;
        case 'linkedin': shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`; break;
        case 'copy':
          navigator.clipboard?.writeText(window.location.href).then(() => {
            showToast('Link copied to clipboard!', 'success');
          });
          return;
      }

      if (shareUrl) window.open(shareUrl, '_blank', 'width=600,height=400');
    });
  });
}

/* ── Login/Register Tab Toggle ───────────────────────────── */
(function initAuthToggle() {
  const loginForm    = document.querySelector('[data-form="login"]');
  const registerForm = document.querySelector('[data-form="register"]');
  const toRegister   = document.querySelector('[data-to="register"]');
  const toLogin      = document.querySelector('[data-to="login"]');

  if (!loginForm || !registerForm) return;

  toRegister?.addEventListener('click', e => {
    e.preventDefault();
    loginForm.style.display    = 'none';
    registerForm.style.display = 'flex';
    registerForm.querySelector('input')?.focus();
  });

  toLogin?.addEventListener('click', e => {
    e.preventDefault();
    registerForm.style.display = 'none';
    loginForm.style.display    = 'flex';
    loginForm.querySelector('input')?.focus();
  });
})();

/* ── Scroll Progress Line ────────────────────────────────── */
function initScrollProgress() {
  const fill = document.getElementById('scrollFill');
  if (!fill) return;

  function onScroll() {
    const scrollTop    = window.scrollY;
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const pct          = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    fill.style.height  = `${Math.min(pct, 100)}%`;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── Mini Commission Form (Home 2 S6) ────────────────────── */
function initMiniForm() {
  const form = document.getElementById('commission-mini-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const nameEl   = form.querySelector('#commission-name');
    const emailEl  = form.querySelector('#commission-email');
    let   valid    = true;

    if (!nameEl?.value.trim()) {
      nameEl?.classList.add('error');
      valid = false;
    } else {
      nameEl?.classList.remove('error');
    }

    if (!emailEl?.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
      emailEl?.classList.add('error');
      valid = false;
    } else {
      emailEl?.classList.remove('error');
    }

    if (!valid) {
      showToast('Please fill in your name and a valid email.', 'error');
      return;
    }

    showToast('Thank you! We\'ll be in touch to arrange your consultation.', 'success');
    form.reset();
  });
}
