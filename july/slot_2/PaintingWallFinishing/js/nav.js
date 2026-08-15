/* ============================================================
   ColorCraft — Navigation Controller
   ============================================================ */

'use strict';

import { $, $$, on, throttle } from './utils.js';

/**
 * Initialize the navigation
 */
function initNav() {
  const navbar     = $('#navbar');
  const hamburger  = $('#hamburger');
  const navMenu    = $('#navMenu');
  const scrollTop  = $('#scrollTop');

  if (!navbar) return;

  // ── Scroll behavior ────────────────────────────────────── //
  const handleScroll = throttle(() => {
    const scrolled = window.scrollY > 10;
    navbar.classList.toggle('is-scrolled', scrolled);
    if (scrollTop) scrollTop.classList.toggle('is-visible', window.scrollY > 300);
  }, 100);

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // ── Hamburger Menu ─────────────────────────────────────── //
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      if (navbar) {
        navbar.classList.toggle('is-menu-open', isOpen);
        navbar.classList.remove('is-hidden');
      }
      hamburger.classList.toggle('is-active', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && navMenu.classList.contains('is-open')) {
        closeMenu();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  function closeMenu() {
    if (navMenu) navMenu.classList.remove('is-open');
    if (navbar) {
      navbar.classList.remove('is-menu-open');
      navbar.classList.remove('is-hidden');
    }
    if (hamburger) {
      hamburger.classList.remove('is-active');
      hamburger.setAttribute('aria-expanded', 'false');
    }
    document.body.style.overflow = '';
  }

  // ── Dropdown menus ─────────────────────────────────────── //
  const dropdownItems = $$('.navbar__item--dropdown');

  dropdownItems.forEach((item) => {
    const toggle = item.querySelector('.navbar__dropdown-toggle');
    const dropdown = item.querySelector('.navbar__dropdown');

    if (!toggle || !dropdown) return;

    // Desktop: hover
    if (window.innerWidth > 1024) {
      item.addEventListener('mouseenter', () => item.classList.add('is-open'));
      item.addEventListener('mouseleave', () => item.classList.remove('is-open'));
    }

    // Toggle on click (works for both mobile and desktop)
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = item.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));

      // Close sibling dropdowns
      dropdownItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('is-open');
          const otherToggle = other.querySelector('.navbar__dropdown-toggle');
          if (otherToggle) otherToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close dropdown on outside click
    document.addEventListener('click', () => {
      item.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // ── Active link highlighting ───────────────────────────── //
  const currentPath = window.location.pathname;
  $$('.navbar__link, .navbar__dropdown-link').forEach((link) => {
    if (link.href) {
      const linkPath = new URL(link.href, window.location.origin).pathname;
      if (linkPath === currentPath || (linkPath.endsWith('index.html') && currentPath === '/')) {
        link.classList.add('is-active');
        
        // Also highlight parent dropdown button if applicable
        const dropdownItem = link.closest('.navbar__item--dropdown');
        if (dropdownItem) {
          const toggleBtn = dropdownItem.querySelector('.navbar__link--dropdown');
          if (toggleBtn) toggleBtn.classList.add('is-active');
        }
      }
    }
  });

  // ── Scroll-to-top ──────────────────────────────────────── //
  if (scrollTop) {
    scrollTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// Auto-init
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNav);
} else {
  initNav();
}

export { initNav };
