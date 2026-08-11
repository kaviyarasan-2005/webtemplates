/* ============================================================
   YUMZ Restaurant — Main JavaScript
   main.js | Version 1.0
   Handles: Theme Toggle, RTL Toggle, Hamburger Menu,
            Navbar Active State, Dropdown, Order Modal,
            Sticky Navbar Shadow, Countdown Timer
   ============================================================ */

'use strict';

/* ============================================================
   1. DOM READY
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initRTL();
  initNavbar();
  initOrderModal();
  initCountdowns();
  initDropdownMobile();
  initStickyNavbar();
});

/* ============================================================
   2. THEME TOGGLE (Dark / Light)
   ============================================================ */
const THEME_KEY = 'yumz-theme';

function initTheme() {
  const savedTheme  = localStorage.getItem(THEME_KEY);
  const systemDark  = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme       = savedTheme || (systemDark ? 'dark' : 'light');

  applyTheme(theme);

  // Desktop toggle
  const desktopToggle = document.getElementById('themeToggle');
  if (desktopToggle) {
    desktopToggle.addEventListener('click', toggleTheme);
  }

  // Mobile toggle (inside hamburger panel)
  const mobileToggle = document.getElementById('themeToggleMobile');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', toggleTheme);
  }

  // Listen for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  updateThemeIcons(theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

function updateThemeIcons(theme) {
  const icons = [
    document.getElementById('themeIcon'),
    document.getElementById('themeIconMobile'),
  ];

  icons.forEach(icon => {
    if (!icon) return;
    if (theme === 'dark') {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
    } else {
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
    }
  });
}

/* ============================================================
   3. RTL / LTR TOGGLE
   ============================================================ */
const DIR_KEY = 'yumz-dir';

function initRTL() {
  const savedDir = localStorage.getItem(DIR_KEY) || 'ltr';
  applyDirection(savedDir);

  // Desktop toggle
  const desktopToggle = document.getElementById('rtlToggle');
  if (desktopToggle) {
    desktopToggle.addEventListener('click', toggleDirection);
  }

  // Mobile toggle
  const mobileToggle = document.getElementById('rtlToggleMobile');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', toggleDirection);
  }
}

function applyDirection(dir) {
  document.documentElement.setAttribute('dir', dir);
  localStorage.setItem(DIR_KEY, dir);
  updateDirButtons(dir);
}

function toggleDirection() {
  const current = document.documentElement.getAttribute('dir') || 'ltr';
  applyDirection(current === 'rtl' ? 'ltr' : 'rtl');
}

function updateDirButtons(dir) {
  // Show current active mode as button text
  const buttons = [
    document.getElementById('rtlToggle'),
    document.getElementById('rtlToggleMobile'),
  ];

  buttons.forEach(btn => {
    if (!btn) return;
    btn.textContent = dir === 'rtl' ? 'RTL' : 'LTR';
    btn.setAttribute('aria-label', `Current direction: ${dir.toUpperCase()}. Click to switch.`);
  });
}

/* ============================================================
   4. NAVBAR
   ============================================================ */
function initNavbar() {
  setActiveNavLink();
  initHamburger();
}

/* Mark the current page link as active */
function setActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  // Map page filenames to nav link hrefs
  const links = document.querySelectorAll('.navbar__link, .navbar__dropdown-link');

  links.forEach(link => {
    const href = link.getAttribute('href') || '';
    const linkPage = href.split('/').pop() || 'index.html';

    if (linkPage === currentPath) {
      link.classList.add('active');

      // Also mark parent dropdown as active
      const parentItem = link.closest('.navbar__item--dropdown');
      if (parentItem) {
        const parentLink = parentItem.querySelector('.navbar__link');
        if (parentLink) parentLink.classList.add('active');
      }
    }

    // Handle root path (treat as index.html)
    if ((currentPath === '' || currentPath === '/') && href === 'index.html') {
      link.classList.add('active');
    }
  });
}

/* ============================================================
   5. HAMBURGER MENU
   ============================================================ */
function initHamburger() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navbar       = document.querySelector('.navbar');
  const navMenu      = document.getElementById('navMenu');

  if (!hamburgerBtn || !navbar || !navMenu) return;

  hamburgerBtn.addEventListener('click', () => {
    const isOpen = navbar.classList.toggle('navbar--open');
    hamburgerBtn.classList.toggle('is-open', isOpen);
    hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('no-scroll', isOpen);
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (
      navbar.classList.contains('navbar--open') &&
      !navbar.contains(e.target)
    ) {
      closeHamburger();
    }
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navbar.classList.contains('navbar--open')) {
      closeHamburger();
      hamburgerBtn.focus();
    }
  });

  // Close menu when a nav link is clicked
  const navLinks = navMenu.querySelectorAll('.navbar__link:not(.navbar__link--has-dropdown), .navbar__dropdown-link');
  navLinks.forEach(link => {
    link.addEventListener('click', closeHamburger);
  });

  function closeHamburger() {
    navbar.classList.remove('navbar--open');
    hamburgerBtn.classList.remove('is-open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  }
}

/* ============================================================
   6. MOBILE DROPDOWN TOGGLE
   ============================================================ */
function initDropdownMobile() {
  const dropdownItems = document.querySelectorAll('.navbar__item--dropdown');

  dropdownItems.forEach(item => {
    const trigger = item.querySelector('.navbar__link--has-dropdown');
    if (!trigger) return;

    // On mobile: click to open dropdown (prevent link navigation)
    trigger.addEventListener('click', (e) => {
      if (window.innerWidth <= 1023) {
        e.preventDefault();
        item.classList.toggle('is-open');
      }
    });
  });
}

/* ============================================================
   7. STICKY NAVBAR SHADOW
   ============================================================ */
function initStickyNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const handleScroll = throttle(() => {
    navbar.classList.toggle('navbar--scrolled', window.scrollY > 10);
  }, 100);

  window.addEventListener('scroll', handleScroll, { passive: true });
}

/* ============================================================
   8. ORDER MODAL
   ============================================================ */
function initOrderModal() {
  const modal   = document.getElementById('orderModal');
  const overlay = document.getElementById('orderModalOverlay');
  const closeBtn = document.getElementById('orderModalClose');
  const openBtn  = document.getElementById('orderBtn');

  if (!modal) return;

  function openModal() {
    modal.classList.add('order-modal--active');
    document.body.classList.add('no-scroll');
    modal.setAttribute('aria-hidden', 'false');

    // Focus the close button for keyboard users
    setTimeout(() => {
      if (closeBtn) closeBtn.focus();
    }, 250);
  }

  function closeModal() {
    modal.classList.remove('order-modal--active');
    document.body.classList.remove('no-scroll');
    modal.setAttribute('aria-hidden', 'true');
    if (openBtn) openBtn.focus();
  }

  if (openBtn)  openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay)  overlay.addEventListener('click', closeModal);

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('order-modal--active')) {
      closeModal();
    }
  });

  // Trap focus inside modal when open
  modal.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;

    const focusable = modal.querySelectorAll(
      'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}

/* ============================================================
   9. COUNTDOWN TIMER
   ============================================================ */
function initCountdowns() {
  // Flash deals countdown (Home 2) — target: midnight tonight
  const dealsCountdown = document.getElementById('dealsCountdown');
  if (dealsCountdown) {
    const midnight = new Date();
    midnight.setHours(23, 59, 59, 0);
    startCountdown(dealsCountdown, midnight.getTime());
  }

  // Coming soon countdown — target: 30 days from now
  const comingSoonCountdown = document.getElementById('comingSoonCountdown');
  if (comingSoonCountdown) {
    const target = new Date();
    target.setDate(target.getDate() + 30);
    startCountdown(comingSoonCountdown, target.getTime());
  }
}

function startCountdown(container, targetTime) {
  const daysEl    = container.querySelector('[data-countdown="days"]');
  const hoursEl   = container.querySelector('[data-countdown="hours"]');
  const minutesEl = container.querySelector('[data-countdown="minutes"]');
  const secondsEl = container.querySelector('[data-countdown="seconds"]');

  function update() {
    const now  = Date.now();
    const diff = Math.max(0, targetTime - now);

    const days    = Math.floor(diff / 86400000);
    const hours   = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    if (daysEl)    daysEl.textContent    = String(days).padStart(2, '0');
    if (hoursEl)   hoursEl.textContent   = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');

    if (diff <= 0) clearInterval(interval);
  }

  update();
  const interval = setInterval(update, 1000);
}

/* ============================================================
   10. GALLERY LIGHTBOX
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const lightbox    = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  if (!lightbox || !lightboxImg) return;

  const galleryItems = document.querySelectorAll('[data-lightbox="true"]');

  galleryItems.forEach(item => {
    const img = item.querySelector('img') || item;
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');

    const openLightbox = () => {
      const src = img.getAttribute('data-src') || img.getAttribute('src') || '';
      const alt = img.getAttribute('alt') || '';
      lightboxImg.setAttribute('src', src);
      lightboxImg.setAttribute('alt', alt);
      lightbox.classList.add('lightbox--active');
      document.body.classList.add('no-scroll');
      lightboxClose && lightboxClose.focus();
    };

    item.addEventListener('click', openLightbox);
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox();
      }
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('lightbox--active');
    document.body.classList.remove('no-scroll');
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('lightbox--active')) {
      closeLightbox();
    }
  });
});

/* ============================================================
   11. ACCORDION
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const accordionHeaders = document.querySelectorAll('.accordion__header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item      = header.closest('.accordion__item');
      const isOpen    = item.classList.contains('accordion__item--open');
      const accordion = item.closest('.accordion');

      // Close all siblings (only one open at a time within same accordion)
      if (accordion) {
        accordion.querySelectorAll('.accordion__item--open').forEach(openItem => {
          if (openItem !== item) {
            openItem.classList.remove('accordion__item--open');
            openItem.querySelector('.accordion__header').setAttribute('aria-expanded', 'false');
          }
        });
      }

      item.classList.toggle('accordion__item--open', !isOpen);
      header.setAttribute('aria-expanded', String(!isOpen));
    });
  });
});

/* ============================================================
   12. TABS
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const tabBtns = document.querySelectorAll('.tabs__btn');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId    = btn.getAttribute('data-tab');
      const tabsWrap = btn.closest('.tabs');
      if (!tabsWrap) return;

      // Deactivate all buttons and panels in this tabs group
      tabsWrap.querySelectorAll('.tabs__btn').forEach(b => {
        b.classList.remove('tabs__btn--active');
        b.setAttribute('aria-selected', 'false');
      });
      tabsWrap.querySelectorAll('.tabs__panel').forEach(p => {
        p.classList.remove('tabs__panel--active');
      });

      // Activate clicked tab
      btn.classList.add('tabs__btn--active');
      btn.setAttribute('aria-selected', 'true');
      const panel = tabsWrap.querySelector(`[data-tab-panel="${tabId}"]`);
      if (panel) panel.classList.add('tabs__panel--active');
    });

    // Keyboard nav for tabs
    btn.addEventListener('keydown', (e) => {
      const tabsWrap = btn.closest('.tabs');
      if (!tabsWrap) return;
      const allBtns = [...tabsWrap.querySelectorAll('.tabs__btn')];
      const idx = allBtns.indexOf(btn);

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        allBtns[(idx + 1) % allBtns.length].click();
        allBtns[(idx + 1) % allBtns.length].focus();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        allBtns[(idx - 1 + allBtns.length) % allBtns.length].click();
        allBtns[(idx - 1 + allBtns.length) % allBtns.length].focus();
      }
    });
  });
});

/* ============================================================
   13. BLOG CATEGORY FILTER
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const filterBtns    = document.querySelectorAll('.category-pill[data-category]');
  const filterableCards = document.querySelectorAll('.article-card[data-category]');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category');

      // Update active state
      filterBtns.forEach(b => b.classList.remove('category-pill--active'));
      btn.classList.add('category-pill--active');

      // Filter cards
      filterableCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
          card.style.display = '';
          requestAnimationFrame(() => card.classList.add('animate-in'));
        } else {
          card.style.display = 'none';
          card.classList.remove('animate-in');
        }
      });
    });
  });
});

/* ============================================================
   14. BLOG SEARCH
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('.search-bar__input');
  const searchBtn   = document.querySelector('.search-bar__btn');
  const cards       = document.querySelectorAll('.article-card');

  if (!searchInput || !cards.length) return;

  function performSearch() {
    const query = searchInput.value.trim().toLowerCase();

    cards.forEach(card => {
      const title   = (card.querySelector('.article-card__title')?.textContent || '').toLowerCase();
      const excerpt = (card.querySelector('.article-card__excerpt')?.textContent || '').toLowerCase();
      const matches = !query || title.includes(query) || excerpt.includes(query);

      card.style.display = matches ? '' : 'none';
    });
  }

  if (searchBtn) searchBtn.addEventListener('click', performSearch);

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') performSearch();
  });

  // Debounced live search
  searchInput.addEventListener('input', debounce(performSearch, 300));
});

/* ============================================================
   15. SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      const navbarH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--navbar-h'),
        10
      ) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navbarH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
});

/* ============================================================
   16. PROMO CODE COPY
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const copyBtn = document.getElementById('copyPromoBtn');
  const codeText = document.getElementById('promoCodeText');
  const label = document.getElementById('copyBtnLabel');

  if (!copyBtn || !codeText) return;

  copyBtn.addEventListener('click', () => {
    const code = codeText.textContent.trim();
    navigator.clipboard.writeText(code).then(() => {
      if (label) label.textContent = 'Copied!';
      copyBtn.style.backgroundColor = '#2A9D8F';
      setTimeout(() => {
        if (label) label.textContent = 'Copy';
        copyBtn.style.backgroundColor = '';
      }, 2000);
    }).catch(() => {
      if (label) label.textContent = 'Copied!';
    });
  });
});

/* ============================================================
   17. UTILITY FUNCTIONS
   ============================================================ */
function throttle(fn, limit) {
  let inThrottle = false;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => { inThrottle = false; }, limit);
    }
  };
}

function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
