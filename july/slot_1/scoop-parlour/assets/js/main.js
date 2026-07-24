'use strict';

/* =============================================================
   SCOOP ICE CREAM PARLOUR — main.js
   Core site functionality: theme, direction, navbar,
   accordion, flavor pills, blog filter, smooth scroll
   ============================================================= */

// ============================================================
// THEME MANAGER
// Persists user preference; falls back to OS preference.
// Toggles class="dark" on <html>.
// ============================================================
const ThemeManager = {
  STORAGE_KEY: 'scoop-theme',

  init() {
    const stored        = localStorage.getItem(this.STORAGE_KEY);
    const prefersDark   = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark        = stored ? stored === 'dark' : prefersDark;
    this.apply(isDark);

    // Wire every [data-theme-toggle] button
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      btn.addEventListener('click', () => this.toggle());
    });

    // React to OS-level change if user hasn't manually set preference
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem(this.STORAGE_KEY)) {
        this.apply(e.matches);
      }
    });
  },

  apply(isDark) {
    document.documentElement.classList.toggle('dark', isDark);

    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) {
        icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
      }
      btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      btn.title = isDark ? 'Light mode' : 'Dark mode';
    });
  },

  toggle() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem(this.STORAGE_KEY, isDark ? 'dark' : 'light');
    this.apply(isDark);
  }
};

// ============================================================
// DIRECTION MANAGER
// Toggles dir="ltr" / dir="rtl" on <html>.
// Also loads/unloads the rtl.css stylesheet dynamically.
// ============================================================
const DirectionManager = {
  STORAGE_KEY: 'scoop-dir',
  RTL_CSS_ID:  'rtl-stylesheet',
  RTL_CSS_HREF: 'assets/css/rtl.css',

  init() {
    const stored = localStorage.getItem(this.STORAGE_KEY) || 'ltr';
    this.apply(stored);

    document.querySelectorAll('[data-dir-toggle]').forEach(btn => {
      btn.addEventListener('click', () => this.toggle());
    });
  },

  apply(dir) {
    document.documentElement.setAttribute('dir', dir);

    // Dynamically inject / remove rtl.css
    const existing = document.getElementById(this.RTL_CSS_ID);
    if (dir === 'rtl') {
      if (!existing) {
        const link = document.createElement('link');
        link.rel  = 'stylesheet';
        link.href = this.RTL_CSS_HREF;
        link.id   = this.RTL_CSS_ID;
        document.head.appendChild(link);
      }
    } else {
      if (existing) existing.remove();
    }

    document.querySelectorAll('[data-dir-toggle]').forEach(btn => {
      btn.textContent = dir === 'ltr' ? 'RTL' : 'LTR';
      btn.setAttribute('aria-label', `Switch to ${dir === 'ltr' ? 'RTL' : 'LTR'} layout`);
    });
  },

  toggle() {
    const current = document.documentElement.getAttribute('dir') || 'ltr';
    const next    = current === 'ltr' ? 'rtl' : 'ltr';
    localStorage.setItem(this.STORAGE_KEY, next);
    this.apply(next);
  }
};

// ============================================================
// NAVBAR MANAGER
// Handles: mobile drawer, dropdowns, scroll shadow, active page
// ============================================================
const NavbarManager = {
  navbar:           null,
  hamburger:        null,
  drawer:           null,
  overlay:          null,
  dropdownWrappers: [],

  init() {
    this.navbar           = document.querySelector('.navbar');
    this.hamburger        = document.querySelector('.navbar__hamburger');
    this.drawer           = document.querySelector('.navbar__mobile-drawer');
    this.overlay          = document.querySelector('.navbar__overlay');
    this.dropdownWrappers = document.querySelectorAll('.navbar__dropdown-wrapper');

    // Hamburger open
    if (this.hamburger) {
      this.hamburger.addEventListener('click', () => {
        if (this.drawer?.classList.contains('open')) {
          this.closeDrawer();
        } else {
          this.openDrawer();
        }
      });
    }

    // Overlay / backdrop close
    if (this.overlay) {
      this.overlay.addEventListener('click', () => this.closeDrawer());
    }

    // Auto-close drawer when any link inside is clicked
    if (this.drawer) {
      this.drawer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => this.closeDrawer());
      });
    }

    // Desktop dropdowns — hover behaviour
    this.dropdownWrappers.forEach(wrapper => {
      const trigger  = wrapper.querySelector('.navbar__link');
      const dropdown = wrapper.querySelector('.navbar__dropdown');
      if (!trigger || !dropdown) return;

      // Desktop: open on hover
      wrapper.addEventListener('mouseenter', () => {
        if (window.innerWidth >= 1024) dropdown.classList.add('open');
      });
      wrapper.addEventListener('mouseleave', () => {
        if (window.innerWidth >= 1024) dropdown.classList.remove('open');
      });

      // Mobile: toggle on click
      trigger.addEventListener('click', e => {
        if (window.innerWidth < 1024) {
          e.preventDefault();
          const isOpen = dropdown.classList.contains('open');
          // Close all other dropdowns first
          document.querySelectorAll('.navbar__dropdown.open').forEach(d => {
            if (d !== dropdown) d.classList.remove('open');
          });
          dropdown.classList.toggle('open', !isOpen);
        }
      });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', e => {
      if (!e.target.closest('.navbar__dropdown-wrapper')) {
        document.querySelectorAll('.navbar__dropdown.open').forEach(d => {
          d.classList.remove('open');
        });
      }
    });

    // Scroll shadow
    const onScroll = this._debounce(() => {
      if (this.navbar) {
        this.navbar.classList.toggle('scrolled', window.scrollY > 50);
      }
    }, 10);
    window.addEventListener('scroll', onScroll, { passive: true });

    // Active page highlighting
    this._setActivePage();

    // Keyboard: Escape closes drawer & dropdowns
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        this.closeDrawer();
        document.querySelectorAll('.navbar__dropdown.open').forEach(d => {
          d.classList.remove('open');
        });
      }
    });

    // Close drawer on resize to desktop
    window.addEventListener('resize', this._debounce(() => {
      if (window.innerWidth >= 1024) this.closeDrawer();
    }, 200));
  },

  openDrawer() {
    this.drawer?.classList.add('open');
    this.overlay?.classList.add('open');
    this.hamburger?.classList.add('open');
    document.body.style.overflow = 'hidden';
    this.hamburger?.setAttribute('aria-expanded', 'true');
  },

  closeDrawer() {
    this.drawer?.classList.remove('open');
    this.overlay?.classList.remove('open');
    this.hamburger?.classList.remove('open');
    document.body.style.overflow = '';
    this.hamburger?.setAttribute('aria-expanded', 'false');
  },

  _setActivePage() {
    const path = window.location.pathname;
    const currentPage = path.split('/').pop() || 'index.html';
    const selectors   = '.navbar__link, .navbar__mobile-link, .navbar__dropdown-item';

    document.querySelectorAll(selectors).forEach(link => {
      const href = link.getAttribute('href') || '';
      const linkPage = href.split('/').pop();

      const isHome = (currentPage === '' || currentPage === 'index.html') && (linkPage === 'index.html' || linkPage === '');
      const isMatch = linkPage === currentPage;

      if (isHome || isMatch) link.classList.add('active');
    });
  },

  _debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }
};

// ============================================================
// ACCORDION MANAGER
// Supports single-open mode (closes others on open).
// ============================================================
const AccordionManager = {
  init() {
    document.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        const item = header.closest('.accordion-item');
        const body = item?.querySelector('.accordion-body');
        if (!item || !body) return;

        const isOpen   = item.classList.contains('open');
        const accordion = item.closest('.accordion');

        // Close all siblings in the same accordion
        accordion?.querySelectorAll('.accordion-item.open').forEach(openItem => {
          openItem.classList.remove('open');
          openItem.querySelector('.accordion-body')?.classList.remove('open');
          openItem.querySelector('.accordion-header')?.setAttribute('aria-expanded', 'false');
        });

        // Open clicked item if it was closed
        if (!isOpen) {
          item.classList.add('open');
          body.classList.add('open');
          header.setAttribute('aria-expanded', 'true');
        }
      });

      // ARIA attributes for accessibility
      header.setAttribute('role', 'button');
      header.setAttribute('aria-expanded', 'false');
      const body = header.closest('.accordion-item')?.querySelector('.accordion-body');
      if (body) {
        const id = `accordion-body-${Math.random().toString(36).slice(2, 7)}`;
        body.id  = id;
        header.setAttribute('aria-controls', id);
      }
    });
  }
};

// ============================================================
// FLAVOR PILLS
// Toggle selected state on catering page flavor selections.
// ============================================================
const FlavorPills = {
  init() {
    document.querySelectorAll('.flavor-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        pill.classList.toggle('selected');
        const isSelected = pill.classList.contains('selected');
        pill.setAttribute('aria-pressed', String(isSelected));
      });

      // Keyboard support
      pill.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          pill.click();
        }
      });

      pill.setAttribute('role', 'button');
      pill.setAttribute('tabindex', '0');
      pill.setAttribute('aria-pressed', 'false');
    });
  }
};

// ============================================================
// BLOG FILTER
// Category-based card show/hide + keyword search.
// ============================================================
const BlogFilter = {
  init() {
    const filterBtns  = document.querySelectorAll('.filter-btn');
    const blogCards   = document.querySelectorAll('.blog-card[data-category]');
    if (!filterBtns.length) return;

    // Category filter
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        btn.setAttribute('aria-current', 'true');

        const category = btn.dataset.category || 'all';

        blogCards.forEach(card => {
          const cardCat = card.dataset.category || '';
          const visible = category === 'all' || cardCat === category;
          card.style.display  = visible ? '' : 'none';
          card.setAttribute('aria-hidden', String(!visible));
        });
      });
    });

    // Search filter
    const searchInput = document.querySelector('.blog-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', this._debounce(e => {
        const q = e.target.value.trim().toLowerCase();

        blogCards.forEach(card => {
          if (!q) {
            card.style.display = '';
            return;
          }
          const title   = card.querySelector('h3, .card__title')?.textContent.toLowerCase() || '';
          const excerpt = card.querySelector('.card__text')?.textContent.toLowerCase() || '';
          const visible = title.includes(q) || excerpt.includes(q);
          card.style.display  = visible ? '' : 'none';
          card.setAttribute('aria-hidden', String(!visible));
        });
      }, 300));
    }
  },

  _debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }
};

// ============================================================
// SMOOTH SCROLL TO ANCHOR
// Offsets by navbar height + 16px breathing room.
// ============================================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const hash   = anchor.getAttribute('href');
      if (!hash || hash === '#') return;

      const target = document.querySelector(hash);
      if (!target) return;

      e.preventDefault();
      const navHeight = document.querySelector('.navbar')?.offsetHeight ?? 72;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });

      // Update URL without triggering jump
      history.pushState(null, '', hash);

      // Accessibility: move focus to target
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });
}

// ============================================================
// TOAST NOTIFICATIONS
// Usage: ToastManager.show('Message', 'success' | 'error' | 'info')
// ============================================================
const ToastManager = {
  container: null,

  init() {
    // Create container if not present in HTML
    if (!document.querySelector('.toast-container')) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      this.container.setAttribute('aria-live', 'polite');
      this.container.setAttribute('aria-atomic', 'false');
      document.body.appendChild(this.container);
    } else {
      this.container = document.querySelector('.toast-container');
    }
  },

  show(message, type = 'info', duration = 4000) {
    if (!this.container) this.init();

    const iconMap = {
      success: 'fa-solid fa-circle-check',
      error:   'fa-solid fa-circle-xmark',
      info:    'fa-solid fa-circle-info'
    };

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
      <i class="toast__icon ${iconMap[type] || iconMap.info}" aria-hidden="true"></i>
      <span class="toast__text">${message}</span>
      <button class="toast__close" aria-label="Dismiss notification"><i class="fa-solid fa-xmark"></i></button>
    `;

    const close = toast.querySelector('.toast__close');
    close.addEventListener('click', () => this._remove(toast));

    this.container.appendChild(toast);

    // Auto-dismiss
    if (duration > 0) {
      setTimeout(() => this._remove(toast), duration);
    }

    return toast;
  },

  _remove(toast) {
    toast.style.opacity   = '0';
    toast.style.transform = 'translateX(110%)';
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }
};

// ============================================================
// MODAL MANAGER
// Opens/closes modals by [data-modal-trigger] / [data-modal-close]
// ============================================================
const ModalManager = {
  init() {
    // Open triggers
    document.querySelectorAll('[data-modal-trigger]').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const id = trigger.dataset.modalTrigger;
        this.open(id);
      });
    });

    // Close buttons inside modals
    document.querySelectorAll('[data-modal-close]').forEach(btn => {
      btn.addEventListener('click', () => {
        const overlay = btn.closest('.modal-overlay');
        if (overlay) this._closeOverlay(overlay);
      });
    });

    // Click outside modal content to close
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', e => {
        if (e.target === overlay) this._closeOverlay(overlay);
      });
    });

    // Escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.open').forEach(o => this._closeOverlay(o));
      }
    });
  },

  open(id) {
    const overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Trap focus
    const firstFocusable = overlay.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    firstFocusable?.focus();
  },

  _closeOverlay(overlay) {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
};

// ============================================================
// COUNTER ANIMATION
// Animates numbers from 0 to target value.
// Usage: add data-counter="1500" to element
// ============================================================
function initCounters() {
  const counterEls = document.querySelectorAll('[data-counter]');
  if (!counterEls.length) return;

  const opts = { threshold: 0.5 };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);

      const el       = entry.target;
      const target   = parseInt(el.dataset.counter, 10);
      const duration = parseInt(el.dataset.counterDuration || '1500', 10);
      const suffix   = el.dataset.counterSuffix || '';
      const prefix   = el.dataset.counterPrefix || '';
      const start    = performance.now();

      const step = now => {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased    = 1 - Math.pow(1 - progress, 3);
        el.textContent = prefix + Math.round(eased * target).toLocaleString() + suffix;

        if (progress < 1) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    });
  }, opts);

  counterEls.forEach(el => observer.observe(el));
}

// ============================================================
// BACK TO TOP BUTTON
// Creates button dynamically; shows after 400px scroll.
// ============================================================
function initBackToTop() {
  const btn = document.createElement('button');
  btn.className   = 'btn-back-top';
  btn.innerHTML   = '<i class="fa-solid fa-arrow-up" aria-hidden="true"></i>';
  btn.setAttribute('aria-label', 'Back to top');
  btn.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--primary);
    color: #fff;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    box-shadow: 0 4px 16px rgba(244,162,97,0.4);
    z-index: 900;
    opacity: 0;
    visibility: hidden;
    transform: translateY(12px);
    transition: opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease, background-color 0.3s ease;
  `;
  document.body.appendChild(btn);

  const toggle = () => {
    const show = window.scrollY > 400;
    btn.style.opacity    = show ? '1' : '0';
    btn.style.visibility = show ? 'visible' : 'hidden';
    btn.style.transform  = show ? 'translateY(0)' : 'translateY(12px)';
  };

  window.addEventListener('scroll', toggle, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  btn.addEventListener('mouseenter', () => {
    btn.style.backgroundColor = '#e8954f';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.backgroundColor = 'var(--primary)';
  });
}

// ============================================================
// LAZY IMAGES (native lazy loading polyfill for older browsers)
// ============================================================
function initLazyImages() {
  // Modern browsers handle loading="lazy" natively
  // This ensures images without the attribute also get lazy treatment
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
          img.removeAttribute('data-srcset');
        }
        obs.unobserve(img);
      });
    }, { rootMargin: '200px' });

    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
  }
}

// ============================================================
// DOM READY — INIT ALL MODULES
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  DirectionManager.init();
  NavbarManager.init();
  AccordionManager.init();
  FlavorPills.init();
  BlogFilter.init();
  ToastManager.init();
  ModalManager.init();
  initSmoothScroll();
  initCounters();
  initBackToTop();
  initLazyImages();
});

// ============================================================
// EXPORTS (for pages that import individual modules)
// ============================================================
if (typeof window !== 'undefined') {
  window.SCOOP = {
    ThemeManager,
    DirectionManager,
    NavbarManager,
    AccordionManager,
    FlavorPills,
    BlogFilter,
    ToastManager,
    ModalManager
  };
}
