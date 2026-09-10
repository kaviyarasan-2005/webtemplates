/* ============================================================
   AXE FORGE VENUE — app.js
   Theme Toggle | RTL/LTR | Mobile Menu | Scroll Effects
   Accordions | Tabs | Form Validation | Counters | Calendar
   ============================================================ */

'use strict';

/* ─── THEME MANAGER ─────────────────────────────────────────── */
const ThemeManager = (() => {
  const ROOT = document.documentElement;
  const STORAGE_KEY = 'axeforge-theme';

  function getPreferred() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function apply(theme) {
    ROOT.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    updateIcons(theme);
  }

  function toggle() {
    const current = ROOT.getAttribute('data-theme') || 'dark';
    apply(current === 'dark' ? 'light' : 'dark');
  }

  function updateIcons(theme) {
    document.querySelectorAll('[data-theme-icon]').forEach(el => {
      el.textContent = theme === 'dark' ? '' : '';
      el.title = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
      el.setAttribute('aria-label', el.title);
    });
  }

  function init() {
    apply(getPreferred());
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      btn.addEventListener('click', toggle);
    });
  }

  return { init, toggle, apply };
})();

/* ─── RTL MANAGER ───────────────────────────────────────────── */
const RTLManager = (() => {
  const STORAGE_KEY = 'axeforge-dir';

  function getDirection() {
    return localStorage.getItem(STORAGE_KEY) || 'ltr';
  }

  function apply(dir) {
    document.body.setAttribute('dir', dir);
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem(STORAGE_KEY, dir);
    document.querySelectorAll('[data-dir-label]').forEach(el => {
      el.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
      el.title = dir === 'rtl' ? 'Switch to Left-to-Right' : 'Switch to Right-to-Left';
      el.setAttribute('aria-label', el.title);
    });
  }

  function toggle() {
    const current = document.body.getAttribute('dir') || 'ltr';
    apply(current === 'ltr' ? 'rtl' : 'ltr');
  }

  function init() {
    apply(getDirection());
    document.querySelectorAll('[data-rtl-toggle]').forEach(btn => {
      btn.addEventListener('click', toggle);
    });
  }

  return { init, toggle };
})();

/* ─── NAVBAR ────────────────────────────────────────────────── */
const NavbarManager = (() => {
  function init() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.nav-overlay');

    if (!navbar) return;

    // Scroll effect
    const handleScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Active link
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href') || '';
      if (href.endsWith(currentPath) || (currentPath === '' && href.includes('index'))) {
        link.classList.add('active');
      }
    });

    // Mobile menu
    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        const isOpen = hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
        hamburger.setAttribute('aria-expanded', isOpen);
      });

      mobileMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          hamburger.classList.remove('open');
          mobileMenu.classList.remove('open');
          document.body.style.overflow = '';
        });
      });
    }

    // Click outside
    document.addEventListener('click', (e) => {
      if (mobileMenu && hamburger && !mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  return { init };
})();

/* ─── SCROLL REVEAL ─────────────────────────────────────────── */
const ScrollReveal = (() => {
  let observer;

  function init() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
      return;
    }

    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  return { init };
})();

/* ─── COUNTER ANIMATION ─────────────────────────────────────── */
const CounterAnimation = (() => {
  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-target'));
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 1800;
    const start = performance.now();

    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(eased * target);
      el.textContent = prefix + value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  }

  function init() {
    if (!('IntersectionObserver' in window)) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    document.querySelectorAll('[data-counter]').forEach(el => obs.observe(el));
  }

  return { init };
})();

/* ─── ACCORDIONS ────────────────────────────────────────────── */
const AccordionManager = (() => {
  function init() {
    document.querySelectorAll('.accordion').forEach(acc => {
      acc.querySelectorAll('.accordion__trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
          const isActive = trigger.classList.contains('active');
          acc.querySelectorAll('.accordion__trigger').forEach(t => {
            t.classList.remove('active');
            const content = t.nextElementSibling;
            if (content) content.style.maxHeight = null;
          });
          if (!isActive) {
            trigger.classList.add('active');
            const content = trigger.nextElementSibling;
            if (content) content.style.maxHeight = content.scrollHeight + 'px';
          }
        });
      });
    });
  }

  return { init };
})();

/* ─── TABS ──────────────────────────────────────────────────── */
const TabManager = (() => {
  function init() {
    document.querySelectorAll('[data-tab-group]').forEach(group => {
      const id = group.getAttribute('data-tab-group');
      const buttons = document.querySelectorAll(`[data-tab="${id}"]`);
      const contents = document.querySelectorAll(`[data-tab-content="${id}"]`);

      buttons.forEach((btn, i) => {
        btn.addEventListener('click', () => {
          buttons.forEach(b => b.classList.remove('active'));
          contents.forEach(c => c.classList.remove('active'));
          btn.classList.add('active');
          if (contents[i]) contents[i].classList.add('active');
        });
      });
    });
  }

  return { init };
})();

/* ─── FORM VALIDATION ───────────────────────────────────────── */
const FormValidator = (() => {
  const rules = {
    required: (val) => val.trim() !== '' || 'This field is required.',
    email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Please enter a valid email address.',
    phone: (val) => !val || /^[\d\s\+\-\(\)]{7,15}$/.test(val) || 'Please enter a valid phone number.',
    minLength: (len) => (val) => val.length >= len || `Minimum ${len} characters required.`,
    maxLength: (len) => (val) => val.length <= len || `Maximum ${len} characters allowed.`,
    password: (val) => val.length >= 8 || 'Password must be at least 8 characters.',
  };

  function validateField(input) {
    const fieldRules = input.getAttribute('data-validate')?.split(',') || [];
    const label = input.closest('.form-group')?.querySelector('.form-label')?.textContent?.replace('*', '').trim() || 'Field';
    let errorMsg = '';

    for (const rule of fieldRules) {
      const trimmed = rule.trim();
      if (rules[trimmed]) {
        const result = rules[trimmed](input.value);
        if (result !== true) { errorMsg = result; break; }
      } else if (trimmed.startsWith('minLength:')) {
        const len = parseInt(trimmed.split(':')[1]);
        const result = rules.minLength(len)(input.value);
        if (result !== true) { errorMsg = result; break; }
      }
    }

    const errEl = input.closest('.form-group')?.querySelector('.form-error-msg');
    input.classList.toggle('error', !!errorMsg);
    input.classList.toggle('success', !errorMsg && input.value.trim() !== '');
    if (errEl) {
      errEl.textContent = errorMsg;
      errEl.classList.toggle('visible', !!errorMsg);
    }

    return !errorMsg;
  }

  function init() {
    document.querySelectorAll('[data-validate]').forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('error')) validateField(input);
      });
    });

    document.querySelectorAll('form[data-form-validate]').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const inputs = form.querySelectorAll('[data-validate]');
        let valid = true;
        inputs.forEach(input => { if (!validateField(input)) valid = false; });
        if (valid) {
          const btn = form.querySelector('[type="submit"]');
          if (btn) {
            btn.classList.add('btn--loading');
            setTimeout(() => {
              btn.classList.remove('btn--loading');
              showToast('Your request has been submitted successfully!', 'success');
              form.reset();
              form.querySelectorAll('.form-input, .form-textarea, .form-select').forEach(el => {
                el.classList.remove('success', 'error');
              });
            }, 1800);
          }
        }
      });
    });
  }

  return { init, validateField };
})();

/* ─── SCROLL TO TOP ─────────────────────────────────────────── */
const ScrollToTop = (() => {
  function init() {
    const btn = document.querySelector('.scroll-top-btn');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  return { init };
})();

/* ─── PAGE LOADER ───────────────────────────────────────────── */
const PageLoader = (() => {
  function init() {
    const loader = document.querySelector('.page-loader');
    if (!loader) return;
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 400);
    });
    setTimeout(() => loader.classList.add('hidden'), 2500);
  }

  return { init };
})();

/* ─── TOAST NOTIFICATIONS ───────────────────────────────────── */
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    success: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>`,
    error: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    info: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  };

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.style.borderInlineStart = `3px solid var(--clr-${type === 'success' ? 'success' : type === 'error' ? 'error' : 'info'})`;
  toast.innerHTML = `<span style="color:var(--clr-${type === 'success' ? 'success' : type === 'error' ? 'error' : 'info'})">${icons[type] || icons.info}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-40px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ─── QUANTITY CONTROL ──────────────────────────────────────── */
const QtyControl = (() => {
  function init() {
    document.querySelectorAll('.qty-control').forEach(ctrl => {
      const display = ctrl.querySelector('.qty-value');
      const minusBtn = ctrl.querySelector('[data-qty="minus"]');
      const plusBtn  = ctrl.querySelector('[data-qty="plus"]');
      const input    = ctrl.querySelector('input[type="hidden"]');
      const min = parseInt(ctrl.getAttribute('data-min') || 1);
      const max = parseInt(ctrl.getAttribute('data-max') || 99);

      if (!display || !minusBtn || !plusBtn) return;
      let val = parseInt(display.textContent || min);

      const update = () => {
        display.textContent = val;
        if (input) input.value = val;
        minusBtn.disabled = val <= min;
        plusBtn.disabled = val >= max;
      };

      minusBtn.addEventListener('click', () => { if (val > min) { val--; update(); } });
      plusBtn.addEventListener('click', () => { if (val < max) { val++; update(); } });
      update();
    });
  }

  return { init };
})();

/* ─── BOOKING CALENDAR ──────────────────────────────────────── */
const BookingCalendar = (() => {
  function init() {
    const calEl = document.querySelector('#booking-calendar');
    if (!calEl) return;

    let selectedDate = null;
    let currentDate = new Date();

    function renderCalendar(year, month) {
      const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      const today = new Date();
      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      const header = calEl.querySelector('.cal-month-title');
      const grid = calEl.querySelector('.calendar-grid');
      if (header) header.textContent = `${monthNames[month]} ${year}`;
      if (!grid) return;

      grid.innerHTML = '';
      ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(d => {
        const cell = document.createElement('div');
        cell.className = 'cal-day header';
        cell.textContent = d;
        grid.appendChild(cell);
      });

      for (let i = 0; i < firstDay; i++) {
        const cell = document.createElement('div');
        cell.className = 'cal-day disabled';
        grid.appendChild(cell);
      }

      for (let d = 1; d <= daysInMonth; d++) {
        const cell = document.createElement('div');
        const date = new Date(year, month, d);
        const isPast = date < new Date(today.setHours(0,0,0,0));
        cell.className = 'cal-day' + (isPast ? ' disabled' : '') +
          (d === today.getDate() && month === today.getMonth() && year === today.getFullYear() ? ' today' : '') +
          (selectedDate && date.toDateString() === selectedDate.toDateString() ? ' selected' : '');
        cell.textContent = d;
        if (!isPast) {
          cell.addEventListener('click', () => {
            selectedDate = date;
            renderCalendar(year, month);
            const display = document.querySelector('#selected-date-display');
            if (display) display.textContent = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
          });
        }
        grid.appendChild(cell);
      }
    }

    const prevBtn = calEl.querySelector('[data-cal="prev"]');
    const nextBtn = calEl.querySelector('[data-cal="next"]');
    if (prevBtn) prevBtn.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
    });
    if (nextBtn) nextBtn.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
    });

    renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
  }

  return { init };
})();

/* ─── LANE SELECTION ────────────────────────────────────────── */
const LaneSelection = (() => {
  function init() {
    document.querySelectorAll('.lane-card').forEach(card => {
      if (card.classList.contains('busy')) return;
      card.addEventListener('click', () => {
        document.querySelectorAll('.lane-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const num = card.getAttribute('data-lane');
        const display = document.querySelector('#selected-lane-display');
        if (display) display.textContent = `Lane ${num}`;
      });
    });
  }

  return { init };
})();

/* ─── PRICE CALCULATOR ──────────────────────────────────────── */
const PriceCalculator = (() => {
  const BASE_PRICE = 25;
  const EXTRAS = { coaching: 30, drinks: 20, photo: 15 };

  function update() {
    const groupSize = parseInt(document.querySelector('#group-size-value')?.textContent || 1);
    const duration = parseInt(document.querySelector('#duration-select')?.value || 1);
    let extras = 0;
    document.querySelectorAll('[data-extra]:checked').forEach(cb => {
      extras += EXTRAS[cb.getAttribute('data-extra')] || 0;
    });
    const subtotal = (BASE_PRICE * groupSize * duration) + extras;
    const tax = subtotal * 0.13;
    const total = subtotal + tax;

    const elSubtotal = document.querySelector('#price-subtotal');
    const elTax = document.querySelector('#price-tax');
    const elTotal = document.querySelector('#price-total');

    if (elSubtotal) elSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (elTax) elTax.textContent = `$${tax.toFixed(2)}`;
    if (elTotal) elTotal.textContent = `$${total.toFixed(2)}`;
  }

  function init() {
    document.querySelectorAll('[data-extra]').forEach(cb => cb.addEventListener('change', update));
    const dur = document.querySelector('#duration-select');
    if (dur) dur.addEventListener('change', update);

    const obs = new MutationObserver(update);
    const sizeEl = document.querySelector('#group-size-value');
    if (sizeEl) obs.observe(sizeEl, { childList: true, characterData: true, subtree: true });

    update();
  }

  return { init };
})();

/* ─── SKELETON LOADER DEMO ──────────────────────────────────── */
const SkeletonLoader = (() => {
  function init() {
    document.querySelectorAll('[data-skeleton]').forEach(container => {
      const delay = parseInt(container.getAttribute('data-skeleton-delay') || 1200);
      setTimeout(() => {
        container.querySelectorAll('.skeleton').forEach(sk => sk.remove());
        container.querySelectorAll('[data-sk-content]').forEach(el => {
          el.style.display = '';
        });
      }, delay);
    });
  }

  return { init };
})();

/* ─── DASHBOARD TABS ────────────────────────────────────────── */
const DashboardUI = (() => {
  function init() {
    const sidebar = document.querySelector('.dash-sidebar');
    const sidebarToggle = document.querySelector('[data-dash-sidebar-toggle]');
    if (sidebarToggle && sidebar) {
      sidebarToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
    }
  }

  return { init };
})();

/* ─── NEWSLETTER ────────────────────────────────────────────── */
const Newsletter = (() => {
  function init() {
    document.querySelectorAll('.newsletter-form').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        if (!input || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
          showToast('Please enter a valid email address.', 'error');
          return;
        }
        const btn = form.querySelector('button[type="submit"]');
        if (btn) btn.classList.add('btn--loading');
        setTimeout(() => {
          if (btn) btn.classList.remove('btn--loading');
          showToast('You have been subscribed to our newsletter!', 'success');
          input.value = '';
        }, 1500);
      });
    });
  }

  return { init };
})();

/* ─── INIT ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  PageLoader.init();
  ThemeManager.init();
  RTLManager.init();
  NavbarManager.init();
  ScrollReveal.init();
  CounterAnimation.init();
  AccordionManager.init();
  TabManager.init();
  FormValidator.init();
  ScrollToTop.init();
  QtyControl.init();
  BookingCalendar.init();
  LaneSelection.init();
  PriceCalculator.init();
  SkeletonLoader.init();
  DashboardUI.init();
  Newsletter.init();
});
